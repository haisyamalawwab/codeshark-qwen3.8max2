import { createAdminDiagnosticsHandler } from "../../server/admin-diagnostics.mjs";
import { isLocalMode, cloudDisabledResponse } from "../../server/local-mode.mjs";

export function createNetlifyAdminDiagnosticsHandler(dependencies = {}) {
  const handle = createAdminDiagnosticsHandler(dependencies);
  return async (event) => {
    const response = { statusCode: 200, headers: {}, body: "" };
    const res = {
      setHeader(name, value) { response.headers[name] = value; },
      status(code) { response.statusCode = code; return this; },
      json(value) { response.headers["Content-Type"] = "application/json"; response.body = JSON.stringify(value); return response; },
    };
    const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
    await handle({ method: event.httpMethod, headers }, res);
    return response;
  };
}

// DATA_MODE=local memaksa 503; auto/cloud menjalankan diagnostik admin.
const cloudHandler = createNetlifyAdminDiagnosticsHandler();
export const handler = async (event) => (isLocalMode() ? cloudDisabledResponse() : cloudHandler(event));
