/* Supabase SDK is bundled lazily; only publishable/legacy anon keys are accepted.
   Login cloud hanya aktif bila mode EFEKTIF cloud (tes koneksi awal
   ke TiDB Cloud/Aiven berhasil); pada mode lokal SDK tidak pernah
   diunduh dan semua pemain tamu lokal. Lihat featureFlags.ts. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { authConfig } from '../../shared/supabase-config.mjs';
import { isCloudAuthEnabled } from './featureFlags';

let pending: Promise<SupabaseClient | null> | undefined;
export function isCloudReady(): boolean {
  if (!isCloudAuthEnabled()) return false;
  try { return authConfig(import.meta.env, 'VITE_') !== null; }
  catch { return false; }
}
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!isCloudAuthEnabled()) return Promise.resolve(null);
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
