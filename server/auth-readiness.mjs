import { serverAuthConfig } from './supabase-auth.mjs';
// Non-destructive public probes only. No tokens/passwords or API key values in output.
export async function inspectAuth(env = process.env, request = fetch) {
  const report = { state: 'config_invalid', configuration: false, jwks: 'not_checked', authService: 'not_checked', googleEnabled: null, loginVerified: false };
  let config;
  try { config = serverAuthConfig(env); } catch { return report; }
  report.configuration = true;
  const results = await Promise.all([
    (async () => {
      try {
        const response = await request(config.jwks || new URL(`${config.url}/auth/v1/.well-known/jwks.json`), { signal: AbortSignal.timeout(8000) });
        if (!response.ok) return 'unavailable';
        const data = await response.json();
        return Array.isArray(data.keys) && data.keys.length && data.keys.every(k => typeof k.kty === 'string' && typeof k.kid === 'string') ? 'available' : 'no_signing_keys';
      } catch { return 'unavailable'; }
    })(),
    (async () => {
      try {
        const response = await request(new URL('/auth/v1/settings', config.url), { headers: { apikey: config.key }, signal: AbortSignal.timeout(8000) });
        if (!response.ok) return { status: 'unavailable', google: null };
        const data = await response.json();
        if (!data.external || typeof data.external.google !== 'boolean') return { status: 'invalid_response', google: null };
        return { status: 'available', google: data.external.google };
      } catch { return { status: 'unavailable', google: null }; }
    })(),
  ]);
  report.jwks = results[0]; report.authService = results[1].status; report.googleEnabled = results[1].google;
  report.state = report.jwks === 'available' && report.authService === 'available' ? 'service_reachable' : 'unavailable';
  return report;
}
