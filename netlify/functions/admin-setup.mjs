import { createAdminSetupHandler } from '../../server/admin-setup.mjs';
import { aivenUrl } from '../../server/aiven.mjs';
import { isLocalMode, cloudDisabledResponse } from '../../server/local-mode.mjs';
export function createNetlifyAdminSetupHandler(dependencies = {}) {
  const baseEnv = dependencies.env || process.env;
  const forced = !baseEnv.DB_PROVIDER && !aivenUrl(baseEnv) ? { DB_PROVIDER: 'tidb' } : {};
  const env = { ...baseEnv, ...forced, NODE_ENV: 'production' };
  const handle = createAdminSetupHandler({ ...dependencies, env });
  return async event => {
    const response = { statusCode: 200, headers: {}, body: '' };
    const res = {
      setHeader(name, value) { response.headers[name] = value; },
      status(code) { response.statusCode = code; return this; },
      json(value) { response.headers['Content-Type'] = 'application/json'; response.body = JSON.stringify(value); return response; },
    };
    await handle({ method: event.httpMethod }, res);
    return response;
  };
}
// DATA_MODE=local memaksa 503; auto/cloud menjalankan diagnostik setup.
const cloudHandler = createNetlifyAdminSetupHandler();
export const handler = async (event) => (isLocalMode() ? cloudDisabledResponse() : cloudHandler(event));
