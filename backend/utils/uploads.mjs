import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const uploadsDir = path.resolve(process.cwd(), "uploads");

export async function ensureUploadsDir() {
  await fs.mkdir(uploadsDir, { recursive: true });
}

export function getUploadsDir() {
  return uploadsDir;
}

export async function saveImageBuffer({ buffer, originalName, mimeType }) {
  const ext = extensionFromMimeType(mimeType, originalName);
  const fileName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, buffer);

  return {
    fileName,
    filePath,
    publicPath: `/uploads/${fileName}`,
  };
}

export async function removeStoredFile(publicPath) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) {
    return;
  }

  const fileName = path.basename(publicPath);
  const filePath = path.join(uploadsDir, fileName);

  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore missing files so delete/update flows stay resilient.
  }
}

function extensionFromMimeType(mimeType, originalName) {
  const normalized = String(mimeType || "").toLowerCase();
  const byMime = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };

  if (byMime[normalized]) {
    return byMime[normalized];
  }

  const ext = path.extname(originalName || "");
  return ext || ".bin";
}
