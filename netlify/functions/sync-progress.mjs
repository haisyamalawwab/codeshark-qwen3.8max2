import { createTidbSyncHandler } from "../../server/tidb-sync.mjs";
import { createAivenSyncHandler } from "../../server/aiven-sync.mjs";
import { pickCloudProvider, aivenKind, aivenUrl, getAivenMysqlPool } from "../../server/aiven.mjs";
import { isLocalMode, cloudDisabledResponse } from "../../server/local-mode.mjs";

// Provider dipilih dari konfigurasi (TiDB Cloud atau Aiven; pool injeksi
// test selalu berarti jalur TiDB). Production identity rules apply to
// every deployed context, including deploy previews.
export function createNetlifyHandler({ pool, request, env = process.env } = {}) {
  const prodEnv = { ...env, NODE_ENV: "production", TIDB_ALLOW_GUEST_SYNC: "false" };
  let sync;
  if (!pool && pickCloudProvider(prodEnv) === "aiven") {
    sync = aivenKind(aivenUrl(prodEnv)) === "mysql"
      ? createTidbSyncHandler({ pool: () => getAivenMysqlPool(prodEnv), request, env: prodEnv })
      : createAivenSyncHandler({ env: prodEnv, request });
  } else {
    sync = createTidbSyncHandler({ pool, request, env: prodEnv });
  }
  return async (event) => {
    const response = { statusCode: 200, headers: { "Cache-Control": "no-store" } };
    const res = {
      setHeader(name, value) { response.headers[name] = value; },
      status(code) { response.statusCode = code; return this; },
      json(value) { response.headers["Content-Type"] = "application/json"; response.body = JSON.stringify(value); return response; },
    };
    if (event.httpMethod !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    let body;
    try {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "{}";
      if (Buffer.byteLength(raw) > 1024 * 1024) return res.status(413).json({ ok: false, error: "Payload too large" });
      body = JSON.parse(raw);
    } catch {
      return res.status(400).json({ ok: false, error: "Invalid JSON request" });
    }
    const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
    await sync({ method: event.httpMethod, headers, body }, res);
    return response;
  };
}

// DATA_MODE=local memaksa 503 mode-lokal; auto/cloud melayani provider terpilih.
const cloudHandler = createNetlifyHandler();
export const handler = async (event) => (isLocalMode() ? cloudDisabledResponse() : cloudHandler(event));
