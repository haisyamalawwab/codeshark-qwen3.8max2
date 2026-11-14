/* ============ PEMERIKSA SINTAKS RINGAN (AI-Trap Simulator) ============
   Dipakai HANYA untuk menghitung "efek domino": apakah suntingan mahasiswa
   menambah kerusakan struktur baru. Pesan error yang dilihat mahasiswa tetap
   berasal dari mesin browser (lib/trapRunner.ts), bukan dari berkas ini.

   Tanpa dependensi dan murni (tanpa DOM) supaya bisa diuji di Node.
   Cakupannya sengaja sempit: pasangan kurung, kutip, tag, dan titik koma CSS. */

export type Region = "html" | "css" | "js";

export interface LintFinding {
  region: Region;
  /** nomor baris (mulai 1) pada dokumen utuh */
  line: number;
  code:
    | "unclosed-bracket"
    | "stray-closer"
    | "unclosed-string"
    | "css-missing-semicolon"
    | "css-missing-colon"
    | "html-attr-quote"
    | "html-unclosed-tag"
    | "html-stray-close"
    | "html-dangling-lt";
  message: string;
}

export interface Regions {
  html: string;
  css: string;
  js: string;
}

const BLOCK_OPEN = /<(style|script)\b[^>]*>/gi;

/** Pecah dokumen menjadi tiga teks berukuran sama; karakter di luar wilayahnya
    diganti spasi (baris baru dipertahankan) sehingga nomor baris tetap cocok. */
export function splitRegions(doc: string): Regions {
  const html = doc.split("");
  const css: string[] = doc.split("").map((c) => (c === "\n" ? "\n" : " "));
  const js = css.slice();
  BLOCK_OPEN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = BLOCK_OPEN.exec(doc))) {
    const tag = m[1].toLowerCase();
    const start = m.index + m[0].length;
    const close = new RegExp(`</${tag}\\s*>`, "i").exec(doc.slice(start));
    const end = close ? start + close.index : doc.length;
    const target = tag === "style" ? css : js;
    for (let i = start; i < end; i++) {
      if (doc[i] === "\n") continue;
      target[i] = doc[i];
      html[i] = " ";
    }
    BLOCK_OPEN.lastIndex = end;
  }
  return { html: html.join(""), css: css.join(""), js: js.join("") };
}

const OPENERS: Record<string, string> = { "{": "}", "(": ")", "[": "]" };
const CLOSERS: Record<string, string> = { "}": "{", ")": "(", "]": "[" };

interface Open {
  ch: string;
  line: number;
}

/** Tutup satu kurung: cari pembuka terdekat yang cocok; pembuka di atasnya dianggap tak ditutup. */
function closeBracket(stack: Open[], ch: string, line: number, region: Region, out: LintFinding[]) {
  const want = CLOSERS[ch];
  let at = -1;
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].ch === want) {
      at = i;
      break;
    }
  }
  if (at === -1) {
    out.push({ region, line, code: "stray-closer", message: `Penutup \`${ch}\` di baris ${line} tidak punya pembuka.` });
    return;
  }
  for (let i = stack.length - 1; i > at; i--) {
    const o = stack[i];
    out.push({ region, line: o.line, code: "unclosed-bracket", message: `\`${o.ch}\` di baris ${o.line} tidak pernah ditutup.` });
  }
  stack.length = at;
}

function flushUnclosed(stack: Open[], region: Region, out: LintFinding[]) {
  for (const o of stack) {
    out.push({ region, line: o.line, code: "unclosed-bracket", message: `\`${o.ch}\` di baris ${o.line} tidak pernah ditutup.` });
  }
}

export function lintJs(text: string): LintFinding[] {
  const out: LintFinding[] = [];
  const stack: Open[] = [];
  let line = 1;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === "\n") {
      line += 1;
      i += 1;
    } else if (ch === "/" && next === "/") {
      while (i < n && text[i] !== "\n") i += 1;
    } else if (ch === "/" && next === "*") {
      i += 2;
      while (i < n && !(text[i] === "*" && text[i + 1] === "/")) {
        if (text[i] === "\n") line += 1;
        i += 1;
      }
      i += 2;
    } else if (ch === "'" || ch === '"') {
      const startLine = line;
      i += 1;
      let closed = false;
      while (i < n && text[i] !== "\n") {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i] === ch) {
          closed = true;
          i += 1;
          break;
        }
        i += 1;
      }
      if (!closed) {
        out.push({ region: "js", line: startLine, code: "unclosed-string", message: `Tanda kutip ${ch} di baris ${startLine} tidak ditutup.` });
      }
    } else if (ch === "`") {
      const startLine = line;
      i += 1;
      let closed = false;
      while (i < n) {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i] === "\n") line += 1;
        if (text[i] === "`") {
          closed = true;
          i += 1;
          break;
        }
        i += 1;
      }
      if (!closed) {
        out.push({ region: "js", line: startLine, code: "unclosed-string", message: `Backtick di baris ${startLine} tidak ditutup.` });
      }
    } else if (OPENERS[ch]) {
      stack.push({ ch, line });
      i += 1;
    } else if (CLOSERS[ch]) {
      closeBracket(stack, ch, line, "js", out);
      i += 1;
    } else {
      i += 1;
    }
  }
  flushUnclosed(stack, "js", out);
  return out;
}

const lineAt = (text: string, idx: number): number => {
  let l = 1;
  for (let i = 0; i < idx && i < text.length; i++) if (text[i] === "\n") l += 1;
  return l;
};

const blankKeepLines = (s: string): string => s.replace(/[^\n]/g, " ");

export function lintCss(raw: string): LintFinding[] {
  const out: LintFinding[] = [];
  const text = raw.replace(/\/\*[\s\S]*?\*\//g, blankKeepLines);
  const stack: Open[] = [];
  let line = 1;
  let declStart = -1;

  const checkDecl = (end: number) => {
    if (declStart < 0) return;
    const piece = text.slice(declStart, end);
    if (!piece.trim()) return;
    const lead = piece.length - piece.trimStart().length;
    const at = lineAt(text, declStart + lead);
    if (!piece.includes(":")) {
      out.push({ region: "css", line: at, code: "css-missing-colon", message: `Deklarasi CSS di baris ${at} tidak punya titik dua.` });
    } else if (/:[^\n]*\n\s*[a-zA-Z-]+\s*:/.test(piece)) {
      out.push({ region: "css", line: at, code: "css-missing-semicolon", message: `Titik koma hilang setelah deklarasi CSS di baris ${at}.` });
    }
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "\n") {
      line += 1;
    } else if (ch === '"' || ch === "'") {
      const startLine = line;
      let j = i + 1;
      while (j < text.length && text[j] !== ch && text[j] !== "\n") j += 1;
      if (text[j] !== ch) {
        out.push({ region: "css", line: startLine, code: "unclosed-string", message: `Tanda kutip ${ch} di baris ${startLine} tidak ditutup.` });
        i = j - 1;
      } else {
        i = j;
      }
    } else if (ch === "{") {
      /* teks sebelum `{` adalah selektor (termasuk aturan bersarang), bukan deklarasi */
      stack.push({ ch, line });
      declStart = i + 1;
    } else if (ch === "}") {
      if (stack.length) checkDecl(i);
      closeBracket(stack, ch, line, "css", out);
      declStart = stack.length ? i + 1 : -1;
    } else if (ch === ";") {
      if (stack.length) {
        checkDecl(i);
        declStart = i + 1;
      }
    }
  }
  if (stack.length) checkDecl(text.length);
  flushUnclosed(stack, "css", out);
  return out;
}

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);

export function lintHtml(raw: string): LintFinding[] {
  const out: LintFinding[] = [];
  const text = raw.replace(/<!--[\s\S]*?-->/g, blankKeepLines);
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)>/g;
  const stack: { name: string; line: number }[] = [];
  const starts = new Set<number>();
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(text))) {
    starts.add(m.index);
    const closing = m[1] === "/";
    const name = m[2].toLowerCase();
    const attrs = m[3];
    const line = lineAt(text, m.index);
    if (!closing) {
      const dq = (attrs.match(/"/g) ?? []).length;
      const sq = (attrs.match(/'/g) ?? []).length;
      if (dq % 2 === 1 || sq % 2 === 1) {
        out.push({ region: "html", line, code: "html-attr-quote", message: `Tanda kutip atribut pada <${name}> di baris ${line} tidak ditutup.` });
      }
      if (!VOID_TAGS.has(name) && !/\/\s*$/.test(attrs)) stack.push({ name, line });
      continue;
    }
    let at = -1;
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].name === name) {
        at = i;
        break;
      }
    }
    if (at === -1) {
      out.push({ region: "html", line, code: "html-stray-close", message: `Tag penutup </${name}> di baris ${line} tidak punya pembuka.` });
      continue;
    }
    for (let i = stack.length - 1; i > at; i--) {
      const o = stack[i];
      out.push({ region: "html", line: o.line, code: "html-unclosed-tag", message: `Tag <${o.name}> di baris ${o.line} tidak ditutup.` });
    }
    stack.length = at;
  }
  for (const o of stack) {
    out.push({ region: "html", line: o.line, code: "html-unclosed-tag", message: `Tag <${o.name}> di baris ${o.line} tidak ditutup.` });
  }
  /* `<` yang mengawali tag tetapi tidak pernah bertemu `>` */
  const ltRe = /<\/?[a-zA-Z]/g;
  let k: RegExpExecArray | null;
  while ((k = ltRe.exec(text))) {
    if (starts.has(k.index)) continue;
    const line = lineAt(text, k.index);
    out.push({ region: "html", line, code: "html-dangling-lt", message: `Tag di baris ${line} dibuka dengan < tetapi tidak ditutup dengan >.` });
  }
  return out;
}

/** Periksa satu dokumen campuran HTML + <style> + <script>. */
export function lintDoc(doc: string): LintFinding[] {
  const r = splitRegions(doc);
  return [...lintHtml(r.html), ...lintCss(r.css), ...lintJs(r.js)].sort((a, b) => a.line - b.line);
}

/** Identitas temuan tanpa nomor baris — baris bergeser saat murid menyisipkan baris,
    jadi perbandingan antar-snapshot (efek domino) memakai kunci ini. */
export function lintKeys(doc: string): string[] {
  return lintDoc(doc).map((f) => `${f.region}:${f.code}:${f.message.replace(/ di baris \d+/, "")}`);
}

/** true bila wilayah JS memuat perulangan — dipakai penjaga eksekusi di trapRunner. */
export function hasLoop(doc: string): boolean {
  const js = splitRegions(doc).js.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return /\b(while|for|do)\b\s*[({]/.test(js);
}
