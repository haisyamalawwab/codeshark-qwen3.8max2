/* ============ METRIK — BLIND LIVE-CODING CHALLENGE ============
   Rancangan: docs/052 bagian 6–8. Fungsi murni: rekaman ketikan (hanya hidup di
   memori selama sesi) → agregat rapor, tingkat, dan garis waktu. Tanpa DOM.

   Definisi operasional:
   • jeda dasar pribadi   = median selang antar-ketik huruf/angka, tanpa selang > 2 detik.
   • jeda panjang sebelum simbol
                          = selang sebelum sebuah simbol yang ≥ 1,5 detik DAN ≥ 4× jeda
                            dasar pribadi. Hanya dihitung di tengah rangkaian mengetik
                            (tanpa pindah kursor atau keluar jendela di antaranya).
   • salah tombol simbol  = simbol diketik, dihapus, lalu diganti simbol LAIN dalam dua
                            ketukan berikutnya.
   • beku                 = selang tanpa ketikan ≥ 5 detik yang tidak sudah terhitung
                            sebagai jeda panjang sebelum simbol. Waktu membaca soal
                            sebelum karakter pertama dilaporkan terpisah (latensi awal).

   Semua ambang bersifat sementara dan perlu dikalibrasi setelah uji coba kelas. */
import type { TrapEvent } from "./trapMetrics";

export const BLIND_LIMIT_MS = 180_000;
export const HESITATION_MIN_MS = 1500;
export const HESITATION_FACTOR = 4;
export const BASELINE_MAX_GAP_MS = 2000;
/** jumlah minimal selang huruf/angka agar jeda dasar dianggap ada */
export const BASELINE_MIN_SAMPLES = 5;
export const BLIND_FREEZE_MS = 5000;
export const TIMELINE_BUCKET_MS = 5000;
export const MAX_BLIND_ATTEMPTS = 10;
export const MAX_BLIND_CODE_CHARS = 4000;
const MAX_MARKS = 40;

export const BRACE_KEYS = "{}";
export const SEMICOLON_KEYS = ";";
export const OTHER_SYMBOL_KEYS = "()[]<>/=:\"'";
const isAlnum = (ch: string) => /^[A-Za-z0-9]$/.test(ch);
type SymbolGroup = "brace" | "semicolon" | "other";
const groupOf = (ch: string): SymbolGroup | null =>
  BRACE_KEYS.includes(ch) ? "brace" : SEMICOLON_KEYS.includes(ch) ? "semicolon" : OTHER_SYMBOL_KEYS.includes(ch) ? "other" : null;
/** simbol apa pun (untuk "salah tombol simbol"): karakter cetak selain huruf, angka, spasi */
const isSymbol = (ch: string) => ch.length === 1 && ch > " " && !isAlnum(ch);

/* aturan tingkat — ditampilkan apa adanya di rapor */
export const LEVEL_RULES = {
  heavyErrors: 3,
  heavyHesitations: 5,
  heavyFrozenShare: 0.4,
  /** kode akhir di bawah ini: hampir tidak ada yang tertulis */
  minChars: 40,
  fluentHesitations: 1,
  fluentFrozenShare: 0.15,
} as const;

export type BlindLevel = "lancar" | "tersendat" | "gagap-berat";

export const BLIND_LEVEL_LABEL: Record<BlindLevel, string> = { lancar: "Lancar", tersendat: "Tersendat", "gagap-berat": "Gagap berat" };
export const BLIND_LEVEL_COLOR: Record<BlindLevel, string> = { lancar: "var(--teal)", tersendat: "var(--amber)", "gagap-berat": "var(--coral)" };

export interface BlindStoredError {
  line: number;
  region: "html" | "css" | "js";
  code: string;
  message: string;
  unfinished?: boolean;
}

export interface BlindAttempt {
  id: string;
  at: number;
  briefId: string;
  durationSec: number;
  limitSec: number;
  endedBy: "timeout" | "manual";
  /** panjang kode akhir */
  chars: number;
  confidence?: 1 | 2 | 3 | 4 | 5;
  /** jeda dasar pribadi (ms); null bila ketikan huruf/angka terlalu sedikit */
  baselineMs: number | null;
  braceHesitations: number;
  semicolonHesitations: number;
  otherSymbolHesitations: number;
  longestBracePauseMs: number;
  longestSemicolonPauseMs: number;
  longestSymbolPauseMs: number;
  symbolFumbles: number;
  freezes: number;
  frozenMs: number;
  /** null bila tidak ada satu karakter pun yang diketik */
  firstKeyMs: number | null;
  corrections: number;
  syntaxErrors: BlindStoredError[];
  missingJsSemicolons: number;
  specPassed: number;
  specTotal: number;
  /** id tuntutan yang terpenuhi */
  specMet: string[];
  pasteAttempts: number;
  rejectedInserts: number;
  blurCount: number;
  blurMs: number;
  /** kata per menit (5 karakter = 1 kata), dari panjang kode akhir */
  wpm: number;
  level: BlindLevel;
  /** 36 ember × 5 detik: jumlah karakter yang diketik per ember */
  timeline: number[];
  /** jeda panjang sebelum simbol: [detik ke-, lama ms, simbol] */
  pauseMarks: [number, number, string][];
  /** rentang beku: [detik mulai, detik selesai] */
  freezeSpans: [number, number][];
  /** kode akhir, dipotong */
  code: string;
}

export interface BlindState {
  attempts: BlindAttempt[];
  /** ditunda (aksesibilitas) — gerbang tidak menghalangi latihan */
  deferred?: boolean;
  /** soal sesi terakhir yang DIMULAI (termasuk yang batal karena muat ulang),
      supaya percobaan berikutnya memakai varian lain */
  lastBriefId?: string;
}

export interface BlindMetrics {
  baselineMs: number | null;
  braceHesitations: number;
  semicolonHesitations: number;
  otherSymbolHesitations: number;
  longestBracePauseMs: number;
  longestSemicolonPauseMs: number;
  longestSymbolPauseMs: number;
  symbolFumbles: number;
  freezes: number;
  frozenMs: number;
  firstKeyMs: number | null;
  corrections: number;
  charsTyped: number;
  pasteAttempts: number;
  rejectedInserts: number;
  blurCount: number;
  blurMs: number;
  timeline: number[];
  pauseMarks: [number, number, string][];
  freezeSpans: [number, number][];
  /** posisi suntingan terakhir pada kode akhir (untuk tanda "belum ditutup") */
  lastEditPos: number;
}

const median = (xs: number[]): number | null => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

const sec = (ms: number) => Math.round(ms / 100) / 10;

export function computeBlindMetrics(events: TrapEvent[], durationMs: number): BlindMetrics {
  const buckets = Math.max(1, Math.ceil(durationMs / TIMELINE_BUCKET_MS));
  const timeline = new Array<number>(Math.max(buckets, Math.ceil(BLIND_LIMIT_MS / TIMELINE_BUCKET_MS))).fill(0);

  /* lintasan 1: selang tiap ketukan */
  interface Key { t: number; ch: string; gap: number | null }
  const keys: Key[] = [];
  const editTimes: { t: number; keyIdx: number }[] = [];
  const baselineGaps: number[] = [];
  let lastEditT = -1;
  let lastCaret = -1;
  let broken = true;
  let corrections = 0;
  let charsTyped = 0;
  let firstKeyMs: number | null = null;
  let lastEditPos = 0;
  let pasteAttempts = 0;
  let rejectedInserts = 0;
  let blurCount = 0;
  let blurMs = 0;

  /* salah tombol simbol: simbol → hapus → simbol lain */
  let symbolFumbles = 0;
  let fumble: { ch: string; pos: number; stage: 0 | 1 } | null = null;

  for (const ev of events) {
    if (ev[0] === "e") {
      const [, t, pos, del, ins] = ev;
      const single = del === 0 && [...ins].length === 1;
      const contiguous = !broken && lastEditT >= 0 && pos === lastCaret;
      let keyIdx = -1;
      if (single) {
        const gap = contiguous ? t - lastEditT : null;
        keyIdx = keys.push({ t, ch: ins, gap }) - 1;
        if (gap !== null && isAlnum(ins) && gap <= BASELINE_MAX_GAP_MS) baselineGaps.push(gap);
      }
      editTimes.push({ t, keyIdx });
      if (ins.length > 0 && firstKeyMs === null) firstKeyMs = t;
      if (del > 0 && ins === "") corrections += 1;
      charsTyped += ins.length;
      const b = Math.min(timeline.length - 1, Math.max(0, Math.floor(t / TIMELINE_BUCKET_MS)));
      timeline[b] += ins.length;

      if (single && isSymbol(ins)) {
        if (fumble && fumble.stage === 1 && pos === fumble.pos && ins !== fumble.ch) symbolFumbles += 1;
        fumble = { ch: ins, pos, stage: 0 };
      } else if (fumble && fumble.stage === 0 && del === 1 && ins === "" && pos === fumble.pos) {
        fumble.stage = 1;
      } else {
        fumble = null;
      }

      lastCaret = pos + ins.length;
      lastEditPos = lastCaret;
      lastEditT = t;
      broken = false;
    } else if (ev[0] === "n") {
      broken = true;
      fumble = null;
    } else if (ev[0] === "b") {
      blurCount += 1;
      blurMs += ev[2];
      broken = true;
      fumble = null;
    } else if (ev[0] === "x") {
      if (ev[2] === "paste" || ev[2] === "drop") pasteAttempts += 1;
      else rejectedInserts += 1;
    }
  }

  /* lintasan 2: jeda panjang sebelum simbol, relatif terhadap jeda dasar pribadi */
  const baselineMs = baselineGaps.length >= BASELINE_MIN_SAMPLES ? median(baselineGaps) : null;
  const threshold = Math.max(HESITATION_MIN_MS, baselineMs === null ? 0 : baselineMs * HESITATION_FACTOR);
  const count = { brace: 0, semicolon: 0, other: 0 };
  const longest = { brace: 0, semicolon: 0, other: 0 };
  const pauseMarks: [number, number, string][] = [];
  const hesitated = new Set<number>();
  keys.forEach((k, i) => {
    const g = groupOf(k.ch);
    if (!g || k.gap === null || k.gap < threshold) return;
    count[g] += 1;
    longest[g] = Math.max(longest[g], k.gap);
    hesitated.add(i);
    if (pauseMarks.length < MAX_MARKS) pauseMarks.push([sec(k.t), k.gap, k.ch]);
  });

  /* beku: selang antar-suntingan ≥ ambang yang belum terhitung sebagai jeda simbol */
  let freezes = 0;
  let frozenMs = 0;
  const freezeSpans: [number, number][] = [];
  const addFreeze = (from: number, to: number) => {
    freezes += 1;
    frozenMs += to - from;
    if (freezeSpans.length < MAX_MARKS) freezeSpans.push([sec(from), sec(to)]);
  };
  for (let i = 1; i < editTimes.length; i++) {
    const gap = editTimes[i].t - editTimes[i - 1].t;
    if (gap >= BLIND_FREEZE_MS && !hesitated.has(editTimes[i].keyIdx)) addFreeze(editTimes[i - 1].t, editTimes[i].t);
  }
  if (editTimes.length) {
    const last = editTimes[editTimes.length - 1].t;
    if (durationMs - last >= BLIND_FREEZE_MS) addFreeze(last, durationMs);
  } else if (durationMs > 0) {
    /* tidak ada ketikan sama sekali: seluruh sesi tanpa ketikan */
    addFreeze(0, durationMs);
  }

  return {
    baselineMs,
    braceHesitations: count.brace,
    semicolonHesitations: count.semicolon,
    otherSymbolHesitations: count.other,
    longestBracePauseMs: longest.brace,
    longestSemicolonPauseMs: longest.semicolon,
    longestSymbolPauseMs: Math.max(longest.brace, longest.semicolon, longest.other),
    symbolFumbles,
    freezes,
    frozenMs,
    firstKeyMs,
    corrections,
    charsTyped,
    pasteAttempts,
    rejectedInserts,
    blurCount,
    blurMs,
    timeline,
    pauseMarks,
    freezeSpans,
    lastEditPos,
  };
}

export interface LevelInput {
  /** syntax error pada bagian yang sudah selesai ditulis (tanpa yang bertanda `unfinished`) */
  syntaxErrors: number;
  /** total jeda panjang sebelum simbol (semua kelompok) */
  symbolHesitations: number;
  frozenMs: number;
  durationMs: number;
  /** panjang kode akhir */
  chars: number;
}

export function blindLevel(i: LevelInput): BlindLevel {
  const frozenShare = i.durationMs > 0 ? i.frozenMs / i.durationMs : 0;
  if (
    i.chars < LEVEL_RULES.minChars ||
    i.syntaxErrors >= LEVEL_RULES.heavyErrors ||
    i.symbolHesitations >= LEVEL_RULES.heavyHesitations ||
    frozenShare >= LEVEL_RULES.heavyFrozenShare
  ) return "gagap-berat";
  if (i.syntaxErrors === 0 && i.symbolHesitations <= LEVEL_RULES.fluentHesitations && frozenShare < LEVEL_RULES.fluentFrozenShare) return "lancar";
  return "tersendat";
}

/** kata per menit dari panjang kode akhir (5 karakter = 1 kata, sama dengan arena salin) */
export function writingWpm(chars: number, durationMs: number): number {
  const minutes = Math.max(durationMs, 5000) / 60_000;
  return Math.round(chars / 5 / minutes);
}

/* ============ PENYIMPANAN ============ */

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Simpan paling banyak MAX_BLIND_ATTEMPTS percobaan. Percobaan PERTAMA (baseline)
    tidak pernah dibuang: yang gugur adalah percobaan ulang tertua. */
export function trimBlindAttempts(attempts: BlindAttempt[]): BlindAttempt[] {
  if (attempts.length <= MAX_BLIND_ATTEMPTS) return attempts;
  return [attempts[0], ...attempts.slice(-(MAX_BLIND_ATTEMPTS - 1))];
}

const LEVELS: readonly string[] = ["lancar", "tersendat", "gagap-berat"];
const NUMERIC_FIELDS = [
  "at", "durationSec", "limitSec", "chars", "braceHesitations", "semicolonHesitations", "otherSymbolHesitations",
  "longestBracePauseMs", "longestSemicolonPauseMs", "longestSymbolPauseMs", "symbolFumbles", "freezes", "frozenMs",
  "corrections", "missingJsSemicolons", "specPassed", "specTotal", "pasteAttempts", "rejectedInserts", "blurCount",
  "blurMs", "wpm",
] as const;

const isStoredError = (e: unknown): e is BlindStoredError =>
  isObj(e) && typeof e.line === "number" && typeof e.message === "string" && typeof e.code === "string" &&
  (e.region === "html" || e.region === "css" || e.region === "js");

/** Satu rapor tersimpan sahih bila semua kolom yang dibaca rapor ada dan bertipe benar.
    Rapor yang tidak sahih dibuang utuh: rapor separuh rusak akan menampilkan angka palsu. */
function isBlindAttempt(a: unknown): a is BlindAttempt {
  if (!isObj(a)) return false;
  if (typeof a.id !== "string" || typeof a.briefId !== "string" || typeof a.code !== "string") return false;
  if (typeof a.level !== "string" || !LEVELS.includes(a.level)) return false;
  if (a.endedBy !== "timeout" && a.endedBy !== "manual") return false;
  if (!NUMERIC_FIELDS.every((k) => typeof a[k] === "number" && Number.isFinite(a[k]))) return false;
  if (a.baselineMs !== null && typeof a.baselineMs !== "number") return false;
  if (a.firstKeyMs !== null && typeof a.firstKeyMs !== "number") return false;
  if (!Array.isArray(a.syntaxErrors) || !a.syntaxErrors.every(isStoredError)) return false;
  if (!Array.isArray(a.specMet) || !a.specMet.every((x) => typeof x === "string")) return false;
  if (!Array.isArray(a.timeline) || !a.timeline.every((x) => typeof x === "number")) return false;
  if (!Array.isArray(a.pauseMarks) || !a.pauseMarks.every((m) => Array.isArray(m) && typeof m[0] === "number" && typeof m[1] === "number" && typeof m[2] === "string")) return false;
  if (!Array.isArray(a.freezeSpans) || !a.freezeSpans.every((m) => Array.isArray(m) && typeof m[0] === "number" && typeof m[1] === "number")) return false;
  return true;
}

/** Bersihkan irisan `blind` dari save (data lama/rusak tidak boleh menggagalkan muat). */
export function normalizeBlind(raw: unknown): BlindState | undefined {
  if (!isObj(raw)) return undefined;
  const list = Array.isArray(raw.attempts) ? raw.attempts : [];
  const out: BlindState = { attempts: trimBlindAttempts(list.filter(isBlindAttempt)) };
  if (raw.deferred === true) out.deferred = true;
  if (typeof raw.lastBriefId === "string") out.lastBriefId = raw.lastBriefId;
  return out;
}
