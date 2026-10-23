/* Supabase SDK is bundled lazily; browser configuration contains public keys only. */
type SupabaseClient = {
  auth: {
    getSession: () => Promise<{ data: { session: { user: { id: string; email?: string }; access_token: string } | null } }>;
    signInWithOAuth: (o: { provider: "google"; options?: { redirectTo?: string } }) => Promise<{ error: { message: string } | null }>;
    signOut: () => Promise<{ error: { message: string } | null }>;
    onAuthStateChange: (cb: (ev: string, session: { user: { id: string; email?: string } } | null) => void) => { data: { subscription: { unsubscribe: () => void } } };
  };
  from: (table: string) => {
    upsert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
    select: (cols?: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: Record<string, unknown> | null }>;
        order: (col: string, o?: { ascending: boolean }) => Promise<{ data: Record<string, unknown>[] }>;
      };
    };
  };
};

let cached: SupabaseClient | null | undefined;

export function isCloudReady(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (cached !== undefined) return cached;
  if (!isCloudReady()) {
    cached = null;
    return cached;
  }
  try {
    // Static dynamic import lets Vite bundle the SDK for browser OAuth.
    const mod = await import("@supabase/supabase-js");
    cached = mod.createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    ) as unknown as SupabaseClient;
    return cached;
  } catch {
    cached = null;
    return cached;
  }
}
