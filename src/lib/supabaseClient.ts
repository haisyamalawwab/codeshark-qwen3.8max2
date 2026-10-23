/* Supabase SDK is bundled lazily; only publishable/legacy anon keys are accepted. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { authConfig } from '../../shared/supabase-config.mjs';

let pending: Promise<SupabaseClient | null> | undefined;
export function isCloudReady(): boolean {
  try { return authConfig(import.meta.env, 'VITE_') !== null; }
  catch { return false; }
}
export function getSupabase(): Promise<SupabaseClient | null> {
  // Share SDK initialization across concurrent session queries and auth subscriptions.
  if (!pending) {
    pending = (async () => {
      const config = authConfig(import.meta.env, 'VITE_');
      if (!config) return null;
      const { createClient } = await import('@supabase/supabase-js');
      return createClient(config.url, config.key, {
        auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
    })().catch(() => {
      pending = undefined; // Permit retry; do not cache a failed SDK initialization.
      throw new Error('Supabase Auth tidak dapat disiapkan. Periksa URL HTTPS dan publishable key.');
    });
  }
  return pending;
}
