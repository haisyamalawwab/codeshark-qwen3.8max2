/* ============ EKSEKUSI KODE DI SANDBOX (AI-Trap Simulator) ============
   Kode mahasiswa dijalankan di <iframe sandbox="allow-scripts"> (origin buram:
   tanpa akses ke halaman induk, localStorage, maupun cookie). Sebuah skrip
   pemantau disisipkan di DEPAN kode — dalam SATU baris, sehingga nomor baris
   pesan error mesin tetap sama dengan nomor baris di editor.

   Pemantau dipasang di depan (bukan di belakang) agar tidak ikut tertelan bila
   mahasiswa meninggalkan <style>/<script>/kutip yang tidak ditutup. */

import { hasLoop } from "./trapLint";

export interface RunError {
  message: string;
  line: number | null;
}

export interface RunCheck {
  label: string;
  ok: boolean;
  detail?: string;
}

export interface RunResult {
  errors: RunError[];
  checks: RunCheck[];
  /** halaman tidak melapor dalam batas waktu */
  timedOut: boolean;
  /** eksekusi dibatalkan sebelum dijalankan (penjaga perulangan) */
  skipped?: string;
}

const MSG_KEY = "codesharkTrap";

/** Susun dokumen sandbox. `checksJs` adalah badan fungsi yang mengembalikan RunCheck[]. */
export function buildSandboxDoc(code: string, checksJs: string, token: string): string {
  const checks = checksJs.replace(/\s*\n\s*/g, " ").trim();
  const monitor =
    `<script>(function(){var T=${JSON.stringify(token)},E=[];` +
    `window.onerror=function(m,s,l){E.push({message:String(m),line:typeof l==="number"&&l>0?l:null});return true;};` +
    `function done(){var C=[];try{C=(function(){${checks}})()||[];}` +
    `catch(x){C=[{label:"Pemeriksaan otomatis",ok:false,detail:String(x)}];}` +
    `parent.postMessage({${MSG_KEY}:T,errors:E,checks:C},"*");}` +
    `window.addEventListener("load",function(){setTimeout(done,40);});})();</` + `script>`;
  return monitor + code;
}

let seq = 0;

export function runInSandbox(
  iframe: HTMLIFrameElement,
  code: string,
  checksJs: string,
  timeoutMs = 2500,
): Promise<RunResult> {
  if (hasLoop(code)) {
    return Promise.resolve({
      errors: [],
      checks: [],
      timedOut: false,
      skipped: "Eksekusi dibatalkan: perbaikan ini tidak membutuhkan perulangan (for/while).",
    });
  }
  const token = `${Date.now().toString(36)}-${++seq}`;
  return new Promise<RunResult>((resolve) => {
    let settled = false;
    const finish = (r: RunResult) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", onMsg);
      window.clearTimeout(timer);
      resolve(r);
    };
    const onMsg = (e: MessageEvent) => {
      if (e.source !== iframe.contentWindow) return;
      const d = e.data as { [MSG_KEY]?: string; errors?: unknown; checks?: unknown } | null;
      if (!d || d[MSG_KEY] !== token) return;
      const seen = new Set<string>();
      const errors: RunError[] = [];
      for (const x of Array.isArray(d.errors) ? (d.errors as RunError[]) : []) {
        const err = {
          message: String(x?.message ?? "Error").slice(0, 240),
          line: typeof x?.line === "number" ? x.line : null,
        };
        /* error yang sama berulang (mis. tiap klik uji) cukup ditampilkan sekali */
        const key = `${err.line}:${err.message}`;
        if (seen.has(key) || errors.length >= 6) continue;
        seen.add(key);
        errors.push(err);
      }
      const checks = Array.isArray(d.checks)
        ? (d.checks as RunCheck[]).slice(0, 8).map((c) => ({
            label: String(c?.label ?? "").slice(0, 120),
            ok: c?.ok === true,
            detail: typeof c?.detail === "string" ? c.detail.slice(0, 160) : undefined,
          }))
        : [];
      finish({ errors, checks, timedOut: false });
    };
    const timer = window.setTimeout(() => finish({ errors: [], checks: [], timedOut: true }), timeoutMs);
    window.addEventListener("message", onMsg);
    iframe.srcdoc = buildSandboxDoc(code, checksJs, token);
  });
}

/** Produksi dianggap pulih bila halaman melapor, tanpa error, dan semua pemeriksaan lulus. */
export function isRecovered(r: RunResult): boolean {
  return !r.timedOut && !r.skipped && r.errors.length === 0 && r.checks.length > 0 && r.checks.every((c) => c.ok);
}
