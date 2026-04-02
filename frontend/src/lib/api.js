const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest(path, { method = "GET", token, body, headers = {} } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(payload?.message || "Request failed.", response.status, payload);
  }

  return payload;
}

export async function uploadImage(file, token) {
  const response = await fetch(`${API_BASE_URL}/api/uploads`, {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      "x-file-name": encodeURIComponent(file.name),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: file,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new ApiError(payload?.message || "Image upload failed.", response.status, payload);
  }

  return payload.file;
}

export function toMediaUrl(value) {
  if (!value) {
    return "";
  }

  return value.startsWith("/uploads/") ? `${API_BASE_URL}${value}` : value;
}

export { API_BASE_URL };
