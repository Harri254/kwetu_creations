import { Router } from "express";
import pool from "../config/db.mjs";
import { hashPassword, serializeUser, signToken, verifyPassword } from "../utils/auth.mjs";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    res.status(400).json({ message: "Name, email, and password are required." });
    return;
  }

  if (password.trim().length < 8) {
    res.status(400).json({ message: "Password must be at least 8 characters long." });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [normalizedEmail]);
  if (existingUser.rowCount > 0) {
    res.status(409).json({ message: "An account with that email already exists." });
    return;
  }

  const result = await pool.query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'customer')
      RETURNING id, name, email, role, created_at
    `,
    [name.trim(), normalizedEmail, hashPassword(password.trim())]
  );

  const user = serializeUser(result.rows[0]);
  const token = signToken({ sub: user.id, role: user.role });

  res.status(201).json({ user, token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email?.trim() || !password?.trim()) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  const result = await pool.query(
    `
      SELECT id, name, email, role, created_at, password_hash
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email.toLowerCase().trim()]
  );

  if (!result.rowCount || !verifyPassword(password.trim(), result.rows[0].password_hash)) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  const user = serializeUser(result.rows[0]);
  const token = signToken({ sub: user.id, role: user.role });

  res.json({ user, token });
});

router.get("/me", (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  res.json({ user: req.user });
});

export default router;
