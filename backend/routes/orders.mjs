import { Router } from "express";
import pool from "../config/db.mjs";
import { initiateStkPush, isDarajaConfigured, normalizeKenyanPhoneNumber } from "../utils/daraja.mjs";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  const isAdmin = req.user.role === "admin";
  const values = [];
  let query = `
    SELECT
      o.id,
      o.user_id,
      o.customer_name,
      o.customer_email,
      o.payment_phone_number,
      o.payment_method,
      o.status,
      o.payment_reference,
      o.payment_checkout_request_id,
      o.payment_merchant_request_id,
      o.payment_result_code,
      o.payment_result_desc,
      o.payment_transaction_date,
      o.total_amount,
      o.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi.product_id,
            'productName', oi.product_name,
            'unitPrice', oi.unit_price,
            'quantity', oi.quantity,
            'lineTotal', oi.line_total
          )
          ORDER BY oi.id
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
  `;

  if (!isAdmin) {
    values.push(req.user.id);
    query += ` WHERE o.user_id = $1`;
  }

  query += `
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  const result = await pool.query(query, values);
  res.json({ orders: result.rows.map(serializeOrder) });
});

router.get("/:id/status", async (req, res) => {
  const result = await pool.query(
    `
      SELECT
        o.id,
        o.user_id,
        o.customer_name,
        o.customer_email,
        o.payment_phone_number,
        o.payment_method,
        o.status,
        o.payment_reference,
        o.payment_checkout_request_id,
        o.payment_merchant_request_id,
        o.payment_result_code,
        o.payment_result_desc,
        o.payment_transaction_date,
        o.total_amount,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi.product_id,
              'productName', oi.product_name,
              'unitPrice', oi.unit_price,
              'quantity', oi.quantity,
              'lineTotal', oi.line_total
            )
            ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.id = $1
      GROUP BY o.id
      LIMIT 1
    `,
    [req.params.id]
  );

  if (!result.rowCount) {
    res.status(404).json({ message: "Order not found." });
    return;
  }

  const order = result.rows[0];
  const checkoutRequestId = String(req.query.checkoutRequestId || "").trim();

  if (req.user) {
    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      res.status(403).json({ message: "You do not have access to this order." });
      return;
    }
  } else if (!checkoutRequestId || checkoutRequestId !== order.payment_checkout_request_id) {
    res.status(403).json({ message: "A valid checkout request id is required to view this order status." });
    return;
  }

  res.json({ order: serializeOrder(order) });
});

router.patch("/:id", async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required." });
    return;
  }

  const status = normalizeOrderStatus(req.body?.status);
  if (!status) {
    res.status(400).json({ message: "Choose a valid order status." });
    return;
  }

  const result = await pool.query(
    `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING id, user_id, customer_name, customer_email, payment_phone_number, payment_method, status, payment_reference, payment_checkout_request_id, payment_merchant_request_id, payment_result_code, payment_result_desc, payment_transaction_date, total_amount, created_at
    `,
    [status, req.params.id]
  );

  if (!result.rowCount) {
    res.status(404).json({ message: "Order not found." });
    return;
  }

  const items = await pool.query(
    `
      SELECT id, product_id, product_name, unit_price, quantity, line_total
      FROM order_items
      WHERE order_id = $1
      ORDER BY id
    `,
    [req.params.id]
  );

  res.json({
    order: serializeOrder({
      ...result.rows[0],
      items: items.rows.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        unitPrice: item.unit_price,
        quantity: item.quantity,
        lineTotal: item.line_total,
      })),
    }),
  });
});

router.post("/", async (req, res) => {
  const { items, paymentMethod, customerName, customerEmail, phoneNumber } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "At least one cart item is required." });
    return;
  }

  const method = String(paymentMethod || "").trim().toLowerCase();
  if (!["paypal", "mpesa", "airtel"].includes(method)) {
    res.status(400).json({ message: "Choose a valid payment method." });
    return;
  }

  const normalizedPhoneNumber = method === "mpesa" ? normalizeKenyanPhoneNumber(phoneNumber) : null;
  if (method === "mpesa" && !normalizedPhoneNumber) {
    res.status(400).json({ message: "Enter a valid Safaricom M-Pesa number in the format 2547XXXXXXXX." });
    return;
  }

  if (method === "mpesa" && !isDarajaConfigured()) {
    res.status(500).json({ message: "Daraja is not fully configured on the server." });
    return;
  }

  if (!req.user && !String(customerEmail || "").trim()) {
    res.status(400).json({ message: "Guest checkout requires a customer email." });
    return;
  }

  const productIds = [...new Set(items.map((item) => Number(item.productId)).filter(Boolean))];
  const productsResult = await pool.query(
    `
      SELECT id, name, price
      FROM products
      WHERE id = ANY($1::int[]) AND status = 'active'
    `,
    [productIds]
  );

  const productMap = new Map(productsResult.rows.map((product) => [product.id, product]));
  const normalizedItems = [];

  for (const item of items) {
    const quantity = Number(item.quantity);
    const product = productMap.get(Number(item.productId));

    if (!product || !Number.isInteger(quantity) || quantity <= 0) {
      res.status(400).json({ message: "Cart contains invalid items." });
      return;
    }

    normalizedItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: Number(product.price),
      quantity,
      lineTotal: Number(product.price) * quantity,
    });
  }

  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      `
        INSERT INTO orders (user_id, customer_name, customer_email, payment_phone_number, payment_method, status, total_amount)
        VALUES ($1, $2, $3, $4, $5, 'pending', $6)
        RETURNING id, status, total_amount, payment_phone_number, created_at
      `,
      [
        req.user?.id || null,
        req.user?.name || customerName?.trim() || null,
        req.user?.email || customerEmail?.trim() || null,
        normalizedPhoneNumber,
        method,
        totalAmount,
      ]
    );

    for (const item of normalizedItems) {
      await client.query(
        `
          INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [orderResult.rows[0].id, item.productId, item.productName, item.unitPrice, item.quantity, item.lineTotal]
      );
    }

    let payment = null;
    if (method === "mpesa") {
      payment = await initiateStkPush({
        phoneNumber: normalizedPhoneNumber,
        amount: totalAmount,
        orderId: orderResult.rows[0].id,
        accountReference: `ORDER-${orderResult.rows[0].id}`,
        transactionDesc: `Kwetu order ${orderResult.rows[0].id}`,
      });

      await client.query(
        `
          UPDATE orders
          SET
            status = 'processing',
            payment_checkout_request_id = $1,
            payment_merchant_request_id = $2,
            payment_result_desc = $3
          WHERE id = $4
        `,
        [
          payment.checkoutRequestId,
          payment.merchantRequestId,
          payment.responseDescription,
          orderResult.rows[0].id,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      order: {
        id: orderResult.rows[0].id,
        status: payment ? "processing" : orderResult.rows[0].status,
        totalAmount: Number(orderResult.rows[0].total_amount),
        createdAt: orderResult.rows[0].created_at,
        paymentMethod: method,
        paymentPhoneNumber: orderResult.rows[0].payment_phone_number,
        items: normalizedItems,
      },
      payment: payment
        ? {
            type: "mpesa",
            checkoutRequestId: payment.checkoutRequestId,
            merchantRequestId: payment.merchantRequestId,
            customerMessage: payment.customerMessage,
          }
        : null,
      message: payment
        ? payment.customerMessage || "M-Pesa payment prompt sent to your phone."
        : "Order created successfully. Payment can now be reconciled against this reference.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

export default router;

function normalizeOrderStatus(value) {
  const next = String(value || "").trim().toLowerCase();
  return ["pending", "processing", "paid", "completed", "cancelled", "failed"].includes(next) ? next : null;
}

function serializeOrder(order) {
  return {
    id: order.id,
    userId: order.user_id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    paymentPhoneNumber: order.payment_phone_number,
    paymentMethod: order.payment_method,
    status: order.status,
    paymentReference: order.payment_reference,
    paymentCheckoutRequestId: order.payment_checkout_request_id,
    paymentMerchantRequestId: order.payment_merchant_request_id,
    paymentResultCode: order.payment_result_code,
    paymentResultDesc: order.payment_result_desc,
    paymentTransactionDate: order.payment_transaction_date,
    totalAmount: Number(order.total_amount),
    createdAt: order.created_at,
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          id: item.id,
          productId: item.productId ?? item.product_id,
          productName: item.productName ?? item.product_name,
          unitPrice: Number(item.unitPrice ?? item.unit_price),
          quantity: Number(item.quantity),
          lineTotal: Number(item.lineTotal ?? item.line_total),
        }))
      : [],
  };
}
