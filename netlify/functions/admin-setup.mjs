import { createAdminSetupHandler } from '../../server/admin-setup.mjs';
export function createNetlifyAdminSetupHandler(dependencies = {}) {
  const env = { ...(dependencies.env || process.env), DB_PROVIDER: 'tidb', NODE_ENV: 'production' };
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
export const handler = createNetlifyAdminSetupHandler();
