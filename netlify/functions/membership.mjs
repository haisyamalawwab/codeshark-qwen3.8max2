import { createDispatchedMembershipHandler } from "../../server/profile.mjs";
import { isLocalMode, cloudDisabledResponse } from "../../server/local-mode.mjs";

// Adapter Netlify untuk GET/POST /api/membership. Aturan identitas
// produksi berlaku di semua konteks deploy (termasuk deploy preview).
export function createNetlifyMembershipHandler({ env = process.env, ...deps } = {}) {
  const prodEnv = { ...env, NODE_ENV: "production", TIDB_ALLOW_GUEST_SYNC: "false" };
  const membership = createDispatchedMembershipHandler({ ...deps, env: prodEnv });
  return async (event) => {
    const response = { statusCode: 200, headers: { "Cache-Control": "no-store" } };
    const res = {
      setHeader(name, value) { response.headers[name] = value; },
      status(code) { response.statusCode = code; return this; },
      json(value) { response.headers["Content-Type"] = "application/json"; response.body = JSON.stringify(value); return response; },
    };
    const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
    let body;
    if (event.httpMethod === "POST") {
      try {
        const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "{}";
        if (Buffer.byteLength(raw) > 64 * 1024) return res.status(413).json({ ok: false, error: "Payload too large" });
        body = JSON.parse(raw);
      } catch {
        return res.status(400).json({ ok: false, error: "Invalid JSON request" });
      }
    }
    await membership({ method: event.httpMethod, headers, body }, res);
    return response;
  };
}

const cloudHandler = createNetlifyMembershipHandler();
export const handler = async (event) => (isLocalMode() ? cloudDisabledResponse() : cloudHandler(event));
