/** Encode a project/report/script ID into a URL-safe base64url string. */
export function encodeProjectId(id: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(id).toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  return btoa(id)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Decode a base64url-encoded ID back to the original string. */
export function decodeProjectId(encoded: string): string {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64, "base64").toString("utf-8");
    }
    return atob(base64);
  } catch {
    return encoded;
  }
}
