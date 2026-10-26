// Entry Better Auth untuk CLI (`npx auth@latest generate/migrate`).
// Implementasi canonical-nya berada di server/better-auth.mjs agar instance
// yang sama dipakai Vercel API Routes, Netlify Functions, dan dev-api lokal.
export { auth } from "./server/better-auth.mjs";
