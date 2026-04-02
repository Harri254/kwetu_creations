import { Router } from "express";
import pool from "../config/db.mjs";
import { parseCallbackPayload, queryStkPush } from "../utils/daraja.mjs";

const router = Router();

router.post("/daraja/callback", async (req, res) => {
  const callback = parseCallbackPayload(req.body);

  if (!callback.checkoutRequestId) {
    res.status(400).json({ message: "Invalid Daraja callback payload." });
    return;
  }

  const nextStatus = Number(callback.resultCode) === 0 ? "paid" : "failed";

  await pool.query(
    `
      UPDATE orders
      SET
        status = $1,
        payment_reference = COALESCE($2, payment_reference),
        payment_result_code = $3,
        payment_result_desc = $4,
        payment_phone_number = COALESCE($5, payment_phone_number),
        payment_transaction_date = COALESCE($6, payment_transaction_date)
      WHERE payment_checkout_request_id = $7
    `,
    [
      nextStatus,
      callback.mpesaReceiptNumber,
      callback.resultCode,
      callback.resultDesc,
      callback.phoneNumber ? String(callback.phoneNumber) : null,
      callback.transactionDate ? String(callback.transactionDate) : null,
      callback.checkoutRequestId,
    ]
  );

  res.json({ message: "Callback received." });
});

router.post("/daraja/query", async (req, res) => {
  const { orderId, checkoutRequestId } = req.body ?? {};
  if (!orderId) {
    res.status(400).json({ message: "Order id is required." });
    return;
  }

  const orderResult = await pool.query(
    `
      SELECT id, user_id, payment_checkout_request_id
      FROM orders
      WHERE id = $1
      LIMIT 1
    `,
    [orderId]
  );

  if (!orderResult.rowCount) {
    res.status(404).json({ message: "Order not found." });
    return;
  }

  const order = orderResult.rows[0];
  if (req.user) {
    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      res.status(403).json({ message: "You do not have access to this order." });
      return;
    }
  } else if (!checkoutRequestId || checkoutRequestId !== order.payment_checkout_request_id) {
    res.status(403).json({ message: "A valid checkout request id is required to query this payment." });
    return;
  }

  if (!order.payment_checkout_request_id) {
    res.status(400).json({ message: "This order does not have a Daraja payment request." });
    return;
  }

  const payload = await queryStkPush({ checkoutRequestId: order.payment_checkout_request_id });
  const nextStatus = normalizePaymentStatus(payload.ResultCode);

  if (nextStatus) {
    await pool.query(
      `
        UPDATE orders
        SET
          status = $1,
          payment_result_code = $2,
          payment_result_desc = $3
        WHERE id = $4
      `,
      [
        nextStatus,
        payload.ResultCode !== undefined && payload.ResultCode !== null ? Number(payload.ResultCode) : null,
        payload.ResultDesc || payload.ResponseDescription || null,
        order.id,
      ]
    );
  }

  const refreshedOrder = await pool.query(
    `
      SELECT
        id,
        status,
        payment_method,
        payment_reference,
        payment_checkout_request_id,
        payment_merchant_request_id,
        payment_result_code,
        payment_result_desc,
        payment_transaction_date,
        total_amount,
        created_at
      FROM orders
      WHERE id = $1
      LIMIT 1
    `,
    [order.id]
  );

  res.json({
    payment: payload,
    order: refreshedOrder.rows[0]
      ? {
          id: refreshedOrder.rows[0].id,
          status: refreshedOrder.rows[0].status,
          paymentMethod: refreshedOrder.rows[0].payment_method,
          paymentReference: refreshedOrder.rows[0].payment_reference,
          paymentCheckoutRequestId: refreshedOrder.rows[0].payment_checkout_request_id,
          paymentMerchantRequestId: refreshedOrder.rows[0].payment_merchant_request_id,
          paymentResultCode: refreshedOrder.rows[0].payment_result_code,
          paymentResultDesc: refreshedOrder.rows[0].payment_result_desc,
          paymentTransactionDate: refreshedOrder.rows[0].payment_transaction_date,
          totalAmount: Number(refreshedOrder.rows[0].total_amount),
          createdAt: refreshedOrder.rows[0].created_at,
        }
      : null,
  });
});

export default router;

function normalizePaymentStatus(resultCode) {
  if (resultCode === undefined || resultCode === null || resultCode === "") {
    return null;
  }

  const code = Number(resultCode);
  if (Number.isNaN(code)) {
    return null;
  }

  if (code === 0) {
    return "paid";
  }

  return "failed";
}
