import { createDatabaseStatusHandler } from "../../server/database-status.mjs";
import { aivenUrl } from "../../server/aiven.mjs";
import { isLocalMode, cloudDisabledResponse } from "../../server/local-mode.mjs";

export function createNetlifyDatabaseStatusHandler({ env = process.env, ...dependencies } = {}) {
  // Warisan deploy Netlify=TiDB dipertahankan HANYA bila operator belum
  // memilih provider apa pun; bila Aiven terkonfigurasi, jangan paksa TiDB.
  const forced = !env.DB_PROVIDER && !aivenUrl(env) ? { DB_PROVIDER: "tidb" } : {};
  const check = createDatabaseStatusHandler({ ...dependencies, env: { ...env, ...forced, NODE_ENV: "production" } });
  return async (event) => {
    const response = { statusCode: 200, headers: {} };
    const res = {
      setHeader(name, value) { response.headers[name] = value; },
      status(code) { response.statusCode = code; return this; },
      json(value) { response.headers["Content-Type"] = "application/json"; response.body = JSON.stringify(value); return response; },
    };
    await check({ method: event.httpMethod }, res);
    return response;
  };
}

// DATA_MODE=local memaksa 503; auto/cloud menjalankan tes koneksi TiDB + Aiven.
const cloudHandler = createNetlifyDatabaseStatusHandler();
export const handler = async (event) => (isLocalMode() ? cloudDisabledResponse() : cloudHandler(event));
