// Shared, public-key-only configuration for browser SDK and server token verification.
export const authKeyName = (env, prefix = '') => env[`${prefix}SUPABASE_PUBLISHABLE_KEY`]?.trim()
  ? `${prefix}SUPABASE_PUBLISHABLE_KEY` : `${prefix}SUPABASE_ANON_KEY`;
export function publicAuthKey(value) {
  const key = value?.trim() || '';
  if (key.startsWith('sb_secret_')) throw new Error('Use a publishable/anon key, never a secret key.');
  if (key.split('.').length === 3) {
    try {
      const payload = JSON.parse(atob(key.split('.')[1].replaceAll('-', '+').replaceAll('_', '/')));
      if (payload.role === 'service_role') throw new Error('service_role');
    } catch (error) {
      if (error.message === 'service_role') throw new Error('Use a publishable/anon key, never a service-role key.');
    }
  }
  return key;
}
export function authUrl(value) {
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Supabase URL must be a plain HTTPS origin.');
  return url.origin;
}
export function authConfig(env, prefix = '') {
  const rawUrl = env[`${prefix}SUPABASE_URL`]?.trim();
  const key = publicAuthKey(env[authKeyName(env, prefix)]);
  if (!rawUrl || !key) return null;
  return { url: authUrl(rawUrl), key };
}
