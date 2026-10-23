import { verifyAuth } from '@supabase/server/core';
import { authConfig } from '../shared/supabase-config.mjs';

export class AuthVerificationError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function serverAuthConfig(env) {
  let config;
  try {
    config = authConfig(env);
    if (!config) throw new Error();
    const expected = `${config.url}/auth/v1/.well-known/jwks.json`;
    const jwks = env.SUPABASE_JWKS_URL?.trim();
    // Pin the signing key source to the same project; never trust token jku/x5u headers.
    if (jwks && jwks !== expected) throw new Error();
    return { ...config, jwks: jwks ? new URL(jwks) : null, issuer: `${config.url}/auth/v1` };
  } catch { throw new AuthVerificationError(503, 'Server identity configuration is incomplete or invalid'); }
}
export async function verifySupabaseUser(req, env = process.env, request = fetch, verify = verifyAuth) {
  const authorization = req.headers?.authorization;
  if (typeof authorization !== 'string' || !/^Bearer \S+$/.test(authorization)) throw new AuthVerificationError(401, 'Sign in required for cloud sync');
  const config = serverAuthConfig(env);
  let id;
  if (config.jwks) {
    // Use only user-JWT mode: a public API key or secret key is NOT a user identity.
    let result;
    try {
      result = await verify(new Request('https://codeshark.invalid/internal-auth', { headers: { authorization } }), {
        auth: 'user', audience: 'authenticated', issuer: config.issuer,
        env: { url: config.url, jwks: config.jwks, publishableKeys: { default: config.key }, secretKeys: {} },
      });
    } catch { throw new AuthVerificationError(503, 'Identity verification unavailable'); }
    if (result.error) throw new AuthVerificationError(result.error.status >= 500 ? 503 : 401, result.error.status >= 500 ? 'Identity verification unavailable' : 'Invalid session');
    const claims = result.data?.jwtClaims;
    if (result.data?.authMode !== 'user' || claims?.role !== 'authenticated' || !Number.isFinite(claims?.exp) || claims.exp <= Date.now() / 1000) throw new AuthVerificationError(401, 'Invalid session');
    id = result.data.userClaims?.id;
  } else {
    // Compatibility for legacy HS256 projects without published asymmetric signing keys.
    let response;
    try {
      response = await request(new URL('/auth/v1/user', config.url), {
        headers: { authorization, apikey: config.key }, signal: AbortSignal.timeout(10000),
      });
    } catch { throw new AuthVerificationError(503, 'Identity verification unavailable'); }
    if (response.status === 401 || response.status === 403) throw new AuthVerificationError(401, 'Invalid session');
    if (!response.ok) throw new AuthVerificationError(503, 'Identity verification unavailable');
    try { id = (await response.json()).id; } catch { throw new AuthVerificationError(503, 'Identity verification unavailable'); }
  }
  if (typeof id !== 'string' || !id.trim() || id.length > 180) throw new AuthVerificationError(401, 'Invalid session');
  return id;
}
