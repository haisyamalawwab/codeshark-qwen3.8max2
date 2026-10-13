// Bundel tes TypeScript dengan esbuild lalu jalankan di Node (tanpa browser).
import { build } from "esbuild";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const dir = mkdtempSync(join(tmpdir(), "codeshark-test-"));
const outfile = join(dir, "suite.mjs");
try {
  await build({
    entryPoints: ["tests/suite.test.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile,
    logLevel: "warning",
  });
  const r = spawnSync(process.execPath, [outfile], { stdio: "inherit" });
  process.exitCode = r.status ?? 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
