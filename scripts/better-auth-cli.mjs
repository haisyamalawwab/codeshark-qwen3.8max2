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

const cleanEnv = (key) => (process.env[key] || "").trim();
const discreteState = (keys) => {
  const portRaw = cleanEnv(keys.port);
  const port = Number(portRaw || "3306");
  const hasAny = Boolean(
    cleanEnv(keys.host)
      || cleanEnv(keys.username)
      || cleanEnv(keys.database)
      || portRaw
      || process.env[keys.password],
  );
  const complete = Boolean(
    cleanEnv(keys.host)
      && cleanEnv(keys.username)
      && cleanEnv(keys.database)
      && process.env[keys.password]
      && Number.isInteger(port)
      && port >= 1
      && port <= 65535,
  );
  return { hasAny, complete };
};
const prefixedDiscrete = discreteState({
  host: "LAYERBASE_HOST",
  username: "LAYERBASE_USERNAME",
  database: "LAYERBASE_DATABASE",
  port: "LAYERBASE_PORT",
  password: "LAYERBASE_PASSWORD",
});
const legacyDiscrete = discreteState({
  host: "HOST",
  username: "username",
  database: "database",
  port: "PORT",
  password: "password",
});
const layerbaseDatabaseUrl = cleanEnv("LAYERBASE_DATABASE_URL");
const legacyDatabaseUrl = cleanEnv("AUTH_DATABASE_URL")
  || cleanEnv("BETTER_AUTH_DATABASE_URL")
  || cleanEnv("DATABASE_URL");
const databaseConfigured = Boolean(
  layerbaseDatabaseUrl
    || (prefixedDiscrete.hasAny
      ? prefixedDiscrete.complete
      : legacyDatabaseUrl || legacyDiscrete.complete),
);
const secret = (process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "").trim();
if (
  (command === "generate" || command === "migrate" || command === "check" || command === "create-admin")
  && (!databaseConfigured || !secret)
) {
  console.error(
    "Better Auth belum dikonfigurasi: isi LAYERBASE_DATABASE_URL atau field " +
      "LAYERBASE_HOST/LAYERBASE_USERNAME/LAYERBASE_DATABASE/LAYERBASE_PORT/LAYERBASE_PASSWORD, " +
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
