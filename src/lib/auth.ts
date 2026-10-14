/* Abstraksi identitas multi-user: guest-first, cloud-progressive.
   - Tanpa Supabase: semua user = guest lokal (namespace per nama).
   - Dengan Supabase: Google OAuth → user.id jadi kunci save + RLS. */

import { getSupabase } from "./supabaseClient";

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  provider: "guest" | "google";
}

const LAST_USER_KEY = "codeshark:lastUser:v1";

export function lastUserId(): string {
  try {
    return localStorage.getItem(LAST_USER_KEY) || "guest";
  } catch {
    return "guest";
  }
}

export function rememberUserId(id: string) {
  try {
    localStorage.setItem(LAST_USER_KEY, id);
  } catch {
    /* abaikan */
  }
}

export function guestUser(name: string): AuthUser {
  const id = `guest:${name.trim().toLowerCase().replace(/\s+/g, "-") || "anon"}`;
  rememberUserId(id);
  return { id, name, provider: "guest" };
}

export async function currentUser(): Promise<AuthUser | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  const u = data.session?.user;
  if (!u) return null;
  return { id: u.id, email: u.email, provider: "google" };
}

export async function signInWithGoogle(): Promise<void> {
  const sb = await getSupabase();
  if (!sb) throw new Error("Supabase belum dikonfigurasi (.env).");
  await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
}

export async function signOut(): Promise<void> {
  const sb = await getSupabase();
  if (sb) await sb.auth.signOut();
  rememberUserId("guest");
}

export function onAuthChange(cb: (u: AuthUser | null) => void): () => void {
  let off = () => {};
  getSupabase().then((sb) => {
    if (!sb) return;
    const { data } = sb.auth.onAuthStateChange((_ev, session) => {
      cb(session?.user ? { id: session.user.id, email: session.user.email, provider: "google" } : null);
    });
    off = () => data.subscription.unsubscribe();
  });
  return () => off();
}

export async function accessToken(): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.access_token ?? null;
}
