import express from 'express';
import path from "path";
import { runMigrations } from './config/schema.mjs';
import { attachUser, requireAdmin } from './middleware/auth.mjs';
import authRoutes from './routes/auth.mjs';
import orderRoutes from './routes/orders.mjs';
import paymentRoutes from './routes/payments.mjs';
import productRoutes from './routes/products.mjs';
import uploadRoutes from './routes/uploads.mjs';
import { ensureUploadsDir, getUploadsDir } from './utils/uploads.mjs';

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-file-name");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(getUploadsDir()));
app.use(attachUser);

const PORT = process.env.PORT || 3000;

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/',(req,res)=>{
    res.send({msg:"Kwetu API is running"});
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use(
  "/api/uploads",
  express.raw({ type: "image/*", limit: "5mb" }),
  requireAdmin,
  uploadRoutes
);
app.use(
  "/api/products",
  (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
      requireAdmin(req, res, next);
      return;
    }

    next();
  },
  productRoutes
);
app.use("/api/orders", orderRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server." });
});

ensureUploadsDir().then(runMigrations).then(() => {
  app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT} ...`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
