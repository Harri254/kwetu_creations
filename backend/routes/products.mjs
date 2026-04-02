import { Router } from "express";
import pool from "../config/db.mjs";
import { normalizeCategory, slugify } from "../config/schema.mjs";
import { removeStoredFile } from "../utils/uploads.mjs";

const router = Router();

router.get("/", async (req, res) => {
  const category = req.query.category ? normalizeCategory(req.query.category) : null;
  const includeAll = req.user?.role === "admin" && req.query.includeAll === "true";
  const values = [];

  let query = `
    SELECT id, name, slug, category, image_url, price, description, status, created_at
    FROM products
  `;

  const conditions = [];
  if (!includeAll) {
    conditions.push(`status = 'active'`);
  }

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, values);
  res.json({ products: result.rows.map(serializeProduct) });
});

router.post("/", async (req, res) => {
  const payload = validateProductPayload(req.body);
  if (payload.error) {
    res.status(400).json({ message: payload.error });
    return;
  }

  const { name, category, imageUrl, price, description, status } = payload.data;
  const slug = await createUniqueSlug(name);

  const result = await pool.query(
    `
      INSERT INTO products (name, slug, category, image_url, price, description, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, slug, category, image_url, price, description, status, created_at
    `,
    [name, slug, category, imageUrl, price, description, status]
  );

  res.status(201).json({ product: serializeProduct(result.rows[0]) });
});

router.put("/:id", async (req, res) => {
  const payload = validateProductPayload(req.body);
  if (payload.error) {
    res.status(400).json({ message: payload.error });
    return;
  }

  const existing = await pool.query(`SELECT id, image_url FROM products WHERE id = $1 LIMIT 1`, [req.params.id]);
  if (!existing.rowCount) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  const { name, category, imageUrl, price, description, status } = payload.data;
  const slug = await createUniqueSlug(name, Number(req.params.id));

  const result = await pool.query(
    `
      UPDATE products
      SET name = $1, slug = $2, category = $3, image_url = $4, price = $5, description = $6, status = $7
      WHERE id = $8
      RETURNING id, name, slug, category, image_url, price, description, status, created_at
    `,
    [name, slug, category, imageUrl, price, description, status, req.params.id]
  );

  const previousImage = existing.rows[0].image_url;
  if (previousImage !== imageUrl) {
    await removeStoredFile(previousImage);
  }

  res.json({ product: serializeProduct(result.rows[0]) });
});

router.delete("/:id", async (req, res) => {
  const result = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING id, image_url`, [req.params.id]);
  if (!result.rowCount) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  await removeStoredFile(result.rows[0].image_url);

  res.status(204).send();
});

function validateProductPayload(body) {
  const name = body?.name?.trim();
  const imageUrl = body?.imageUrl?.trim();
  const price = Number(body?.price);

  if (!name) {
    return { error: "Product name is required." };
  }

  if (!imageUrl) {
    return { error: "Product image is required." };
  }

  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Price must be a valid positive number." };
  }

  return {
    data: {
      name,
      category: normalizeCategory(body?.category),
      imageUrl,
      price,
      description: body?.description?.trim() || "",
      status: body?.status === "draft" ? "draft" : "active",
    },
  };
}

async function createUniqueSlug(name, currentId = null) {
  const base = slugify(name) || "product";
  let slug = base;
  let suffix = 1;

  while (true) {
    const values = [slug];
    let query = `SELECT id FROM products WHERE slug = $1`;

    if (currentId !== null) {
      values.push(currentId);
      query += ` AND id <> $2`;
    }

    const result = await pool.query(query, values);
    if (!result.rowCount) {
      return slug;
    }

    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    imageUrl: product.image_url,
    price: Number(product.price),
    description: product.description,
    status: product.status,
    createdAt: product.created_at,
  };
}

export default router;
