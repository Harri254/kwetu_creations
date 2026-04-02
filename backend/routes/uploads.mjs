import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const apiKey = process.env.IMGBB_API_KEY;
  const mimeType = String(req.headers["content-type"] || "").toLowerCase();
  const originalName = String(req.headers["x-file-name"] || "upload");

  if (!apiKey) {
    res.status(500).json({ message: "ImgBB is not configured on the server." });
    return;
  }

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

  const formData = new FormData();
  formData.append("image", new Blob([req.body], { type: mimeType }), decodeURIComponent(originalName));
  formData.append("name", decodeURIComponent(originalName).replace(/\.[^.]+$/, ""));

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success || !payload?.data?.url) {
    res.status(502).json({ message: payload?.error?.message || "ImgBB upload failed." });
    return;
  }

  res.status(201).json({
    file: {
      name: payload.data.id || decodeURIComponent(originalName),
      publicPath: payload.data.url,
      deleteUrl: payload.data.delete_url || null,
    },
  });
});

export default router;
