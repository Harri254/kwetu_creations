import { Router } from "express";
import { saveImageBuffer } from "../utils/uploads.mjs";

const router = Router();

router.post("/", async (req, res) => {
  const mimeType = String(req.headers["content-type"] || "").toLowerCase();
  const originalName = String(req.headers["x-file-name"] || "upload");

  if (!mimeType.startsWith("image/")) {
    res.status(400).json({ message: "Only image uploads are supported." });
    return;
  }

  if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
    res.status(400).json({ message: "Image body is required." });
    return;
  }

  const maxSizeBytes = 5 * 1024 * 1024;
  if (req.body.length > maxSizeBytes) {
    res.status(413).json({ message: "Image must be 5MB or smaller." });
    return;
  }

  const file = await saveImageBuffer({
    buffer: req.body,
    originalName,
    mimeType,
  });

  res.status(201).json({
    file: {
      name: file.fileName,
      publicPath: file.publicPath,
    },
  });
});

export default router;
