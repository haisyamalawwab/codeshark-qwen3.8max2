import { createDatabaseStatusHandler } from "../../server/database-status.mjs";

export function createNetlifyDatabaseStatusHandler({ env = process.env, ...dependencies } = {}) {
  const check = createDatabaseStatusHandler({ ...dependencies, env: { ...env, DB_PROVIDER: "tidb", NODE_ENV: "production" } });
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

export const handler = createNetlifyDatabaseStatusHandler();
