import { createDispatchedProfileHandler } from "../../server/profile.mjs";
import { isLocalMode, cloudDisabledResponse } from "../../server/local-mode.mjs";

// Adapter Netlify untuk GET /api/profile. Aturan identitas produksi
// berlaku di semua konteks deploy (termasuk deploy preview).
export function createNetlifyProfileHandler({ env = process.env, ...deps } = {}) {
  const prodEnv = { ...env, NODE_ENV: "production", TIDB_ALLOW_GUEST_SYNC: "false" };
  const profile = createDispatchedProfileHandler({ ...deps, env: prodEnv });
  return async (event) => {
    const response = { statusCode: 200, headers: { "Cache-Control": "no-store" } };
    const res = {
      setHeader(name, value) { response.headers[name] = value; },
      status(code) { response.statusCode = code; return this; },
      json(value) { response.headers["Content-Type"] = "application/json"; response.body = JSON.stringify(value); return response; },
    };
    const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
    await profile({ method: event.httpMethod, headers }, res);
    return response;
  };
}

const cloudHandler = createNetlifyProfileHandler();
export const handler = async (event) => (isLocalMode() ? cloudDisabledResponse() : cloudHandler(event));
