/* ============ PEMERIKSA SINTAKS — BLIND LIVE-CODING CHALLENGE ============
   Rancangan: docs/052 bagian 6.1. Lapisan tipis di atas lib/trapLint.ts (pindaian
   kurung, kutip, tag, dan titik koma CSS sudah ada di sana) dengan empat tambahan:

   • aturan CSS tanpa selektor;
   • `new Function(kode)` sebagai pemeriksa akhir JavaScript — kode hanya DIURAI,
     tidak pernah dijalankan;
   • `;` yang terlewat di JavaScript dihitung TERPISAH ("titik koma terlewat"),
     bukan sebagai syntax error, karena JavaScript menyisipkannya sendiri;
   • blok yang masih terbuka saat waktu habis diberi tanda `unfinished`, supaya
     terbedakan dari kesalahan pada bagian yang sudah selesai ditulis.

   Murni (tanpa DOM) supaya bisa diuji di Node. */
import type { Region, Regions } from "./trapLint";
import { lintDoc, splitRegions } from "./trapLint";

export interface BlindSyntaxError {
  /** nomor baris (mulai 1) pada kode utuh */
  line: number;
  region: Region;
  code: string;
  message: string;
  /** blok/tag/kutip yang sedang ditulis ketika waktu habis */
  unfinished?: boolean;
}

export interface BlindLintResult {
  errors: BlindSyntaxError[];
  /** perkiraan jumlah pernyataan JavaScript yang tidak diakhiri `;` */
  missingJsSemicolons: number;
}

const blankKeepLines = (s: string): string => s.replace(/[^\n]/g, " ");

const lineAt = (text: string, idx: number): number => {
  let l = 1;
  for (let i = 0; i < idx && i < text.length; i++) if (text[i] === "\n") l += 1;
  return l;
};

/** `{` yang tidak didahului selektor (mis. `{ color: red; }`). */
export function cssRulesWithoutSelector(rawCss: string): BlindSyntaxError[] {
  const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, blankKeepLines);
  const out: BlindSyntaxError[] = [];
  let segStart = 0;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") {
      if (!css.slice(segStart, i).trim()) {
        const line = lineAt(css, i);
        out.push({ region: "css", line, code: "css-no-selector", message: `Aturan CSS di baris ${line} tidak punya selektor sebelum \`{\`.` });
      }
      segStart = i + 1;
    } else if (ch === "}" || ch === ";") {
      segStart = i + 1;
    }
  }
  return out;
}

/** Ganti isi komentar dan string JavaScript dengan spasi (kutipnya dipertahankan,
    baris baru dipertahankan) supaya pindaian berikutnya tidak tertipu isi teks. */
export function maskJs(js: string): string {
  const out = js.split("");
  let i = 0;
  const n = js.length;
  const blank = (from: number, to: number) => {
    for (let k = from; k < to && k < n; k++) if (out[k] !== "\n") out[k] = " ";
  };
  while (i < n) {
    const ch = js[i];
    const next = js[i + 1];
    if (ch === "/" && next === "/") {
      const start = i;
      while (i < n && js[i] !== "\n") i += 1;
      blank(start, i);
    } else if (ch === "/" && next === "*") {
      const start = i;
      i += 2;
      while (i < n && !(js[i] === "*" && js[i + 1] === "/")) i += 1;
      i = Math.min(n, i + 2);
      blank(start, i);
    } else if (ch === '"' || ch === "'" || ch === "`") {
      const start = i + 1;
      i += 1;
      while (i < n && js[i] !== ch && (ch === "`" || js[i] !== "\n")) i += js[i] === "\\" ? 2 : 1;
      blank(start, Math.min(i, n));
      i += 1;
    } else {
      i += 1;
    }
  }
  return out.join("");
}

const CONTROL_HEAD = /^(?:if|for|while|switch|else|try|catch|finally|do|function|class)\b/;
const CONTINUES = /^(?:[.?:+\-*/%,=([]|&&|\|\|)/;

/** Perkiraan per baris: pernyataan yang berakhir di ujung baris tanpa `;`.
    Sengaja konservatif — baris kepala blok (`if (...)`), baris yang berakhir
    dengan `{`, `}`, `,`, atau operator, dan baris di dalam kurung yang belum
    ditutup tidak dihitung. */
export function countMissingJsSemicolons(rawJs: string): number {
  const lines = maskJs(rawJs).split("\n");
  let depth = 0;
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    for (const ch of line) {
      if (ch === "(" || ch === "[") depth += 1;
      else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    }
    if (!line || depth > 0) continue;
    if (!/(?:[\w$)\]"'`]|\+\+|--)$/.test(line)) continue;
    if (CONTROL_HEAD.test(line)) continue;
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j += 1;
    if (j < lines.length && CONTINUES.test(lines[j].trim())) continue;
    count += 1;
  }
  return count;
}

/** Pemeriksa akhir JavaScript. Mengembalikan pesan mesin bila kode tidak bisa
    diurai; null bila bisa, bila kosong, atau bila lingkungan melarang `new Function`
    (kebijakan CSP) — saat itu hasil pindaian sendiri yang dipakai. */
export function jsParseError(js: string): string | null {
  if (!js.trim()) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    new Function(js);
    return null;
  } catch (e) {
    return e instanceof SyntaxError ? e.message : null;
  }
}

function regionAt(doc: string, r: Regions, pos: number): Region {
  for (let i = Math.min(pos, doc.length) - 1; i >= 0; i--) {
    if (!doc[i].trim()) continue;
    if (r.css[i].trim()) return "css";
    if (r.js[i].trim()) return "js";
    /* tag pembuka <style>/<script> milik wilayah HTML, tetapi isinya (bila masih
       kosong) sudah wilayah CSS/JS */
    const open = /<(style|script)\b[^>]*>\s*$/i.exec(doc.slice(0, i + 1));
    if (open) return open[1].toLowerCase() === "style" ? "css" : "js";
    return "html";
  }
  return "html";
}

const UNCLOSED = new Set(["unclosed-bracket", "unclosed-string"]);
const HTML_OPEN = new Set(["html-dangling-lt", "html-attr-quote", "html-unclosed-tag"]);

export interface BlindLintOptions {
  /** sesi berakhir karena waktu habis (bukan "Saya selesai") */
  timedOut?: boolean;
  /** posisi suntingan terakhir pada kode akhir */
  lastEditPos?: number;
}

export function lintBlind(code: string, opts: BlindLintOptions = {}): BlindLintResult {
  const regions = splitRegions(code);
  const errors: BlindSyntaxError[] = lintDoc(code).map((f) => ({ line: f.line, region: f.region, code: f.code, message: f.message }));
  errors.push(...cssRulesWithoutSelector(regions.css));

  /* pemeriksa akhir JS: hanya menambah temuan bila pindaian sendiri tidak melihat apa pun */
  if (!errors.some((e) => e.region === "js")) {
    const msg = jsParseError(regions.js);
    if (msg) {
      const first = regions.js.search(/\S/);
      const line = first < 0 ? 1 : lineAt(regions.js, first);
      errors.push({ region: "js", line, code: "js-parse", message: `JavaScript di dalam <script> tidak bisa diurai browser: ${msg}` });
    }
  }
  errors.sort((a, b) => a.line - b.line);

  if (opts.timedOut) {
    const pos = Math.max(0, Math.min(opts.lastEditPos ?? code.length, code.length));
    const caretLine = lineAt(code, pos);
    const caretRegion = regionAt(code, regions, pos);
    const container = caretRegion === "css" ? "style" : caretRegion === "js" ? "script" : null;
    for (const e of errors) {
      if (UNCLOSED.has(e.code)) {
        if (e.region === caretRegion && e.line <= caretLine) e.unfinished = true;
      } else if (HTML_OPEN.has(e.code)) {
        const tag = /<([a-zA-Z][a-zA-Z0-9-]*)>/.exec(e.message)?.[1]?.toLowerCase();
        if (e.code === "html-unclosed-tag" && container && tag === container && e.line <= caretLine) e.unfinished = true;
        else if (caretRegion === "html" && e.line === caretLine) e.unfinished = true;
      }
    }
  }

  return { errors, missingJsSemicolons: countMissingJsSemicolons(regions.js) };
}
