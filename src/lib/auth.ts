/* Abstraksi identitas multi-user: guest-first, cloud-progressive.
   - Tanpa layanan auth: semua user = guest lokal (namespace per nama).
   - Better Auth (email/password, MariaDB Layerbase): user.id menjadi
     identitas akun; sesi berupa cookie httpOnly dari /api/auth/*.
   - Supabase Google OAuth dipertahankan sebagai jalur legacy bila
     dikonfigurasi dan mode cloud game aktif. */

import { getSupabase } from "./supabaseClient";
import { isBetterAuthEnabled, isCloudAuthEnabled } from "./featureFlags";

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  provider: "guest" | "google" | "email";
  role?: string;
  banned?: boolean;
}

export interface EmailSignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface EmailSignInInput {
  email: string;
  password: string;
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

interface BetterAuthUserShape {
  id?: unknown;
  email?: unknown;
  name?: unknown;
  role?: unknown;
  banned?: unknown;
}

function mapBetterAuthUser(value: BetterAuthUserShape | null | undefined): AuthUser | null {
  if (!value || typeof value.id !== "string" || !value.id) return null;
  return {
    id: value.id,
    email: typeof value.email === "string" ? value.email : undefined,
    name: typeof value.name === "string" ? value.name : undefined,
    provider: "email",
    role: typeof value.role === "string" ? value.role : "user",
    banned: value.banned === true || value.banned === 1 || value.banned === "1",
  };
}

async function loadBetterAuthClient() {
  if (!isBetterAuthEnabled()) return null;
  const module = await import("./auth-client");
  return module.authClient;
}

function betterAuthErrorMessage(error: unknown, fallback: string): string {
  const record = (error ?? {}) as Record<string, unknown>;
  const body = (record.body ?? {}) as Record<string, unknown>;
  const code = typeof body.code === "string" ? body.code : typeof record.code === "string" ? record.code : "";
  const bodyError = typeof body.error === "string" ? body.error : "";
  const status = typeof record.status === "number" ? record.status : 0;

  if (status === 503 || bodyError === "better_auth_not_configured" || code === "better_auth_not_configured") {
    return "Login email belum dikonfigurasi di server (koneksi Layerbase + BETTER_AUTH_SECRET).";
  }
  if (/banned/i.test(code) || /banned/i.test(bodyError)) {
    return "Akun ini dinonaktifkan oleh admin.";
  }
  if (status === 401 || /invalid.*credential|user.*not.*found/i.test(code)) {
    return "Email atau kata sandi tidak cocok.";
  }
  if (status === 409 || /user.*already.*exist|already.*registered/i.test(code)) {
    return "Email ini sudah terdaftar — silakan masuk.";
  }
  const message =
    (typeof body.message === "string" && body.message) ||
    (typeof record.message === "string" && record.message) ||
    (typeof record.statusText === "string" && record.statusText) ||
    "";
  return message || fallback;
}

export async function currentBetterAuthUser(): Promise<AuthUser | null> {
  if (!isBetterAuthEnabled()) return null;
  try {
    const client = await loadBetterAuthClient();
    if (!client) return null;
    const { data, error } = await client.getSession();
    if (error) return null;
    return mapBetterAuthUser(data?.user as BetterAuthUserShape | undefined);
  } catch {
    return null;
  }
}

export async function signUpWithEmail(input: EmailSignUpInput): Promise<AuthUser> {
  if (!isBetterAuthEnabled()) throw new Error("Login email nonaktif pada mode lokal (VITE_DATA_MODE=local).");
  const client = await loadBetterAuthClient();
  if (!client) throw new Error("Klien Better Auth tidak tersedia.");
  const { data, error } = await client.signUp.email({
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
  });
  if (error) throw new Error(betterAuthErrorMessage(error, "Pendaftaran gagal. Periksa email dan kata sandi (minimal 8 karakter)."));
  const user = mapBetterAuthUser(data?.user as BetterAuthUserShape | undefined) ?? (await currentBetterAuthUser());
  if (!user) throw new Error("Akun dibuat, tetapi sesi belum aktif. Silakan masuk dengan email tersebut.");
  if (user.banned) throw new Error("Akun ini dinonaktifkan oleh admin.");
  rememberUserId(user.id);
  return user;
}

export async function signInWithEmail(input: EmailSignInInput): Promise<AuthUser> {
  if (!isBetterAuthEnabled()) throw new Error("Login email nonaktif pada mode lokal (VITE_DATA_MODE=local).");
  const client = await loadBetterAuthClient();
  if (!client) throw new Error("Klien Better Auth tidak tersedia.");
  const { data, error } = await client.signIn.email({
    email: input.email.trim(),
    password: input.password,
  });
  if (error) throw new Error(betterAuthErrorMessage(error, "Login gagal. Periksa email dan kata sandi."));
  const user = mapBetterAuthUser(data?.user as BetterAuthUserShape | undefined) ?? (await currentBetterAuthUser());
  if (!user) throw new Error("Sesi login tidak dapat dibuat. Silakan coba lagi.");
  if (user.banned) throw new Error("Akun ini dinonaktifkan oleh admin.");
  rememberUserId(user.id);
  return user;
}

export async function currentUser(): Promise<AuthUser | null> {
  const betterAuthUser = await currentBetterAuthUser();
  if (betterAuthUser) return betterAuthUser;

  const sb = await getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.getSession();
  if (error) throw new Error("Sesi login tidak dapat dibaca. Silakan login kembali.");
  const u = data.session?.user;
  if (!u) return null;
  return { id: u.id, email: u.email, provider: "google" };
}

export async function signInWithGoogle(redirectPath = ""): Promise<void> {
  if (!isCloudAuthEnabled()) throw new Error("Login cloud tidak aktif — database cloud tidak terjangkau, mode lokal (tamu) yang dipakai.");
  const sb = await getSupabase();
  if (!sb) throw new Error("Supabase belum dikonfigurasi (.env).");
  // Redirects are same-origin paths; never accept a caller-supplied external URL.
  if (redirectPath && (!redirectPath.startsWith("/") || redirectPath.startsWith("//") || redirectPath.includes("\\"))) throw new Error("Tujuan login tidak valid.");
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + redirectPath },
  });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  if (isBetterAuthEnabled()) {
    try {
      const betterAuthUser = await currentBetterAuthUser();
      if (betterAuthUser) {
        const client = await loadBetterAuthClient();
        await client?.signOut();
      }
    } catch {
      /* Sesi Better Auth sudah tidak ada/endpoint tidak terjangkau. */
    }
  }
  const sb = await getSupabase();
  if (sb) {
    const { error } = await sb.auth.signOut();
    if (error) throw new Error(error.message);
  }
  rememberUserId("guest");
}

export function onAuthChange(cb: (u: AuthUser | null) => void): () => void {
  let off = () => {};
  let active = true;

  void currentBetterAuthUser()
    .then((user) => {
      if (active && user) cb(user);
    })
    .catch(() => {});

  getSupabase().then((sb) => {
    if (!sb || !active) return;
    const { data } = sb.auth.onAuthStateChange((_ev, session) => {
      cb(session?.user ? { id: session.user.id, email: session.user.email, provider: "google" } : null);
    });
    off = () => data.subscription.unsubscribe();
  }).catch(() => { if (active) cb(null); });
  return () => { active = false; off(); };
}

export async function accessToken(): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.getSession();
  if (error) throw new Error("Sesi login tidak dapat dibaca. Silakan login kembali.");
  return data.session?.access_token ?? null;
}
