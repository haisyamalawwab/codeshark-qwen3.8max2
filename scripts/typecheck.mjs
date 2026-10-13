// Pemeriksaan tipe tanpa emit (tsconfig proyek).
import { spawnSync } from "node:child_process";
const r = spawnSync("npx", ["tsc", "--noEmit", "-p", "."], { stdio: "inherit", shell: process.platform === "win32" });
process.exitCode = r.status ?? 1;
