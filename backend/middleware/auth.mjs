import pool from "../config/db.mjs";
import { serializeUser, verifyToken } from "../utils/auth.mjs";

export async function attachUser(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    req.user = null;
    next();
    return;
  }

  const payload = verifyToken(token);
  if (!payload?.sub) {
    req.user = null;
    next();
    return;
  }

  const result = await pool.query(
    `SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1`,
    [payload.sub]
  );

  req.user = result.rowCount ? serializeUser(result.rows[0]) : null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required." });
    return;
  }

  next();
}
