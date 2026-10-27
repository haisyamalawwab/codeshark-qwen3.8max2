// Wrapper CLI Better Auth yang memuat .env (via flag Node pada npm script)
// dan menjalankan paket `auth` dengan versi yang sama persis dengan
// dependensi `better-auth` terpasang. Ini mencegah `npx auth@latest`
// menghasilkan skema dari versi yang berbeda dengan runtime aplikasi.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { exitIfLocalMode } from "../server/local-mode.mjs";

const command = process.argv[2];
const extraArgs = process.argv.slice(3);
const supported = new Set(["generate", "migrate", "check", "info", "create-admin"]);

if (!supported.has(command)) {
  console.error("Pemakaian: node scripts/better-auth-cli.mjs <generate|migrate|check|info|create-admin> [opsi tambahan]");
  process.exit(2);
}

exitIfLocalMode(`better-auth ${command}`);

const databaseUrl = (process.env.AUTH_DATABASE_URL || process.env.BETTER_AUTH_DATABASE_URL || process.env.DATABASE_URL || "").trim();
const layerbasePort = (process.env.PORT || "3306").trim();
const hasLayerbaseDiscreteConfig = Boolean(
  (process.env.HOST || "").trim()
    && (process.env.username || "").trim()
    && (process.env.database || "").trim()
    && process.env.password
    && Number.isInteger(Number(layerbasePort))
    && Number(layerbasePort) >= 1
    && Number(layerbasePort) <= 65535,
);
const secret = (process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "").trim();
if (
  (command === "generate" || command === "migrate" || command === "check" || command === "create-admin")
  && (!(databaseUrl || hasLayerbaseDiscreteConfig) || !secret)
) {
  console.error(
    "Better Auth belum dikonfigurasi: isi AUTH_DATABASE_URL/DATABASE_URL (dari Layerbase → Connect) " +
      "atau field Layerbase HOST/username/database/PORT/password, " +
      "serta BETTER_AUTH_SECRET di .env terlebih dahulu.",
  );
  process.exit(1);
}

const { version } = JSON.parse(
  readFileSync(new URL("../node_modules/better-auth/package.json", import.meta.url), "utf8"),
);
const args = ["--yes", `auth@${version}`, command, "--config", "auth.ts"];
if (command === "generate" && !extraArgs.includes("--output")) {
  args.push("--output", "db/better-auth.generated.sql");
}
if ((command === "generate" || command === "migrate") && !extraArgs.includes("--yes") && !extraArgs.includes("-y")) {
  args.push("--yes");
}
args.push(...extraArgs);

const child = spawn("npx", args, {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

child.on("error", (error) => {
  console.error(`Gagal menjalankan Better Auth CLI: ${error.message}`);
  process.exit(1);
});
child.on("close", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
