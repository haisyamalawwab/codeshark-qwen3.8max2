/* Supabase client — lazy & opsional.
   Tanpa VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY → getSupabase() = null,
   game jalan 100% lokal (guest). Setelah `npm i @supabase/supabase-js`
   + isi .env, login Google otomatis aktif tanpa ubah caller. */

type SupabaseClient = {
  auth: {
    getSession: () => Promise<{ data: { session: { user: { id: string; email?: string }; access_token: string } | null } }>;
    signInWithOAuth: (o: { provider: "google"; options?: { redirectTo?: string } }) => Promise<unknown>;
    signOut: () => Promise<unknown>;
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
    // specifier dipecah + @vite-ignore agar Rollup tidak me-resolve saat build;
    // paket hanya diunduh bila user memasangnya (`npm i @supabase/supabase-js`).
    const spec = "@supabase/" + "supabase-js";
    const mod = await import(/* @vite-ignore */ spec).catch(() => null);
    if (!mod) {
      cached = null;
      return cached;
    }
    cached = mod.createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    ) as SupabaseClient;
    return cached;
  } catch {
    cached = null;
    return cached;
  }
}
