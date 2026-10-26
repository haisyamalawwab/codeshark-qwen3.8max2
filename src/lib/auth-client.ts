import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// Klien Better Auth (Layerbase MariaDB di sisi server).
// Default baseURL kosong = origin halaman saat ini, sehingga request menuju
// /api/auth/* pada domain yang sama (Netlify/Vercel/dev). Isi
// VITE_BETTER_AUTH_URL hanya bila API auth sengaja di origin lain.
const configuredBaseUrl = String(import.meta.env.VITE_BETTER_AUTH_URL ?? "").trim();

export const authClient = createAuthClient({
  ...(configuredBaseUrl ? { baseURL: configuredBaseUrl } : {}),
  plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
