import pool from "./db.mjs";
import { hashPassword } from "../utils/auth.mjs";

export async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255),
      password_hash TEXT,
      role VARCHAR(20) NOT NULL DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(150) UNIQUE,
      category VARCHAR(50) NOT NULL DEFAULT 'products',
      image_url TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      description TEXT DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      customer_name VARCHAR(100),
      customer_email VARCHAR(150),
      payment_phone_number VARCHAR(20),
      payment_method VARCHAR(50) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      payment_reference VARCHAR(100),
      payment_checkout_request_id VARCHAR(100),
      payment_merchant_request_id VARCHAR(100),
      payment_result_code INTEGER,
      payment_result_desc TEXT,
      payment_transaction_date VARCHAR(30),
      total_amount NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name VARCHAR(100) NOT NULL,
      unit_price NUMERIC(10,2) NOT NULL,
      quantity INTEGER NOT NULL,
      line_total NUMERIC(10,2) NOT NULL
    );
  `);

  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'customer';
    ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

    ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(150);
    ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'products';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_phone_number VARCHAR(20);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_checkout_request_id VARCHAR(100);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_merchant_request_id VARCHAR(100);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_result_code INTEGER;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_result_desc TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_date VARCHAR(30);
  `);

  const legacyUsers = await pool.query(
    `SELECT id, password FROM users WHERE password_hash IS NULL AND password IS NOT NULL`
  );

  for (const user of legacyUsers.rows) {
    const passwordHash = hashPassword(user.password);
    await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [passwordHash, user.id]);
  }

  const products = await pool.query(`SELECT id, name, slug, category, description, status FROM products`);

  for (const product of products.rows) {
    const nextSlug = product.slug || `${slugify(product.name)}-${product.id}`;
    const nextCategory = normalizeCategory(product.category);
    const nextDescription = product.description ?? "";
    const nextStatus = product.status || "active";

    await pool.query(
      `
        UPDATE products
        SET slug = $1, category = $2, description = $3, status = $4
        WHERE id = $5
      `,
      [nextSlug, nextCategory, nextDescription, nextStatus, product.id]
    );
  }

  await ensureAdminUser();
}

async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@kwetu.local";
  const adminName = process.env.ADMIN_NAME || "Kwetu Admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  const existingAdmin = await pool.query(`SELECT id FROM users WHERE email = $1`, [adminEmail]);
  if (existingAdmin.rowCount > 0) {
    return;
  }

  await pool.query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
    `,
    [adminName, adminEmail, hashPassword(adminPassword)]
  );
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeCategory(value) {
  const next = (value || "").toLowerCase().trim();
  if (["latest", "products", "services"].includes(next)) {
    return next;
  }

  return "products";
}
