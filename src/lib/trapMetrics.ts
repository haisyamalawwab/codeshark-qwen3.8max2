/* ============ TELEMETRI & METRIK AI-TRAP SIMULATOR ============
   Fungsi murni: rekaman ketikan → metrik diagnosis, data peta panas, dan
   jadwal putar ulang. Tanpa DOM dan tanpa React supaya bisa diuji di Node.

   Definisi operasional (docs/053 bagian 6.4):
   • jeda motorik  = selang sebelum sebuah tombol DI TENGAH rangkaian mengetik
                     (posisi kursor bersambung, tanpa pindah kursor/Jalankan/keluar
                     fokus di antaranya). Hanya ini yang masuk peta panas.
   • tombol lumpuh = jeda motorik > SLOW_MS (2 detik).
   • beku          = selang tanpa aktivitas ≥ FREEZE_MS (5 detik), di luar waktu
                     membaca sebelum aksi pertama.
   • efek domino   = jumlah temuan pemeriksa sintaks yang BARU muncul di sebuah
                     snapshot dibanding snapshot sebelumnya (kode awal → tiap Jalankan
                     → kode akhir). Dibandingkan per identitas temuan, bukan per jumlah:
                     menukar satu error dengan error lain tetap terhitung kerusakan baru. */

export const SLOW_MS = 2000;
export const FREEZE_MS = 5000;
export const TRAP_LIMIT_MS = 180_000;
/** jumlah minimal ketukan bersambung agar peta panas dianggap bermakna */
export const MIN_HEATMAP_KEYS = 8;

/** Rekaman ringkas. Angka kedua selalu waktu (ms sejak MULAI). */
export type TrapEvent =
  /** sunting: t, posisi, jumlah karakter dihapus, teks disisipkan */
  | ["e", number, number, number, string]
  /** pindah kursor (mouse / tombol panah) */
  | ["n", number]
  /** Jalankan: t, temuan lint, pemeriksaan lulus, total pemeriksaan, pesan error pertama */
  | ["r", number, number, number, number, string]
  /** keluar fokus: t mulai, durasi ms */
  | ["b", number, number]
  /** sisipan ditolak: t, jenis (paste | drop | replace | synthetic) */
  | ["x", number, string];

export interface KeyStat {
  /** berapa kali tombol ini diketik di tengah rangkaian */
  n: number;
  /** jeda motorik terlama (ms) */
  maxMs: number;
  /** berapa kali jedanya melewati SLOW_MS */
  slow: number;
}

export interface TrapMetrics {
  durationMs: number;
  /** waktu membaca sebelum aksi pertama (sunting/Jalankan); null bila tidak ada aksi */
  firstActionMs: number | null;
  /** median waktu dari Jalankan sampai suntingan berikutnya */
  scanAfterRunMs: number | null;
  freezes: number;
  frozenMs: number;
  longestFreezeMs: number;
  corrections: number;
  longestDeleteStreak: number;
  charsTyped: number;
  /** ketukan bersambung yang masuk hitungan jeda motorik */
  contiguousKeys: number;
  runs: number;
  domino: number;
  editBursts: number;
  offTargetBursts: number;
  pasteAttempts: number;
  rejectedInserts: number;
  blurCount: number;
  blurMs: number;
  keys: Record<string, KeyStat>;
  /** tombol dengan jeda motorik > SLOW_MS, terlama dulu */
  slowKeys: string[];
}

export type TrapOutcome = "pulih" | "sebagian" | "gagal";

export interface AiTrapAttempt {
  id: string;
  at: number;
  scenarioId: string;
  /** keyakinan diri sebelum mulai (1–5) */
  confidence: number;
  durationMs: number;
  limitMs: number;
  endedBy: "timeout" | "manual" | "recovered";
  /** id jebakan yang sudah benar pada kode akhir */
  fixed: string[];
  trapTotal: number;
  recovered: boolean;
  checksOk: number;
  checksTotal: number;
  lastError: string;
  outcome: TrapOutcome;
  metrics: TrapMetrics;
  /** kode akhir (dipotong) */
  code: string;
  /** rekaman ketikan untuk putar ulang; hanya disimpan untuk percobaan terbaru */
  log?: TrapEvent[];
}

export interface AiTrapState {
  attempts: AiTrapAttempt[];
  /** ditunda (aksesibilitas) — gerbang tidak menghalangi latihan */
  deferred?: boolean;
}

export const MAX_ATTEMPTS = 10;
export const MAX_LOGGED_ATTEMPTS = 5;
export const MAX_LOG_EVENTS = 1500;
export const MAX_CODE_CHARS = 4000;

export function applyEdit(text: string, pos: number, del: number, ins: string): string {
  return text.slice(0, pos) + ins + text.slice(pos + del);
}

export function finalTextOf(initial: string, events: TrapEvent[]): string {
  let text = initial;
  for (const ev of events) if (ev[0] === "e") text = applyEdit(text, ev[2], ev[3], ev[4]);
  return text;
}

/** Selisih dua nilai textarea → satu suntingan. `caret` = posisi kursor SESUDAH perubahan
    (dipakai untuk memilih posisi yang benar pada karakter berulang, mis. "aa" → "aaa"). */
export function diffEdit(prev: string, next: string, caret?: number): { pos: number; del: number; ins: string } | null {
  if (prev === next) return null;
  const delta = next.length - prev.length;
  if (typeof caret === "number") {
    if (delta > 0) {
      const pos = caret - delta;
      if (pos >= 0 && prev.slice(0, pos) === next.slice(0, pos) && prev.slice(pos) === next.slice(caret)) {
        return { pos, del: 0, ins: next.slice(pos, caret) };
      }
    } else if (delta < 0) {
      if (prev.slice(0, caret) === next.slice(0, caret) && prev.slice(caret - delta) === next.slice(caret)) {
        return { pos: caret, del: -delta, ins: "" };
      }
    }
  }
  let p = 0;
  const max = Math.min(prev.length, next.length);
  while (p < max && prev[p] === next[p]) p += 1;
  let s = 0;
  while (s < max - p && prev[prev.length - 1 - s] === next[next.length - 1 - s]) s += 1;
  return { pos: p, del: prev.length - p - s, ins: next.slice(p, next.length - s) };
}

const countNl = (s: string): number => {
  let c = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === "\n") c += 1;
  return c;
};

const median = (xs: number[]): number | null => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

/** nama tombol untuk satu suntingan bersambung; null = bukan satu ketukan (mis. Tab → dua spasi) */
function keyOf(del: number, ins: string): string | null {
  if (del === 0 && ins.length === 1) {
    if (ins === "\n") return "Enter";
    if (ins === " ") return "Space";
    return ins;
  }
  if (del === 1 && ins === "") return "Backspace";
  return null;
}

export interface MetricsInput {
  initial: string;
  events: TrapEvent[];
  durationMs: number;
  /** pemeriksa sintaks: kode → daftar kunci temuan (trapLint.lintKeys). Disuntikkan
      agar modul ini tetap murni; tanpa ini efek domino = 0. */
  lint?: (code: string) => string[];
  /** nomor baris (mulai 1) tiap jebakan pada kode awal */
  trapLines: number[];
}

export function computeMetrics(input: MetricsInput): TrapMetrics {
  const { initial, events, durationMs } = input;
  const keys: Record<string, KeyStat> = {};
  let text = initial;
  const trapLines = [...input.trapLines];

  let lastActivity = 0;
  let firstActionMs: number | null = null;
  let freezes = 0;
  let frozenMs = 0;
  let longestFreezeMs = 0;

  let lastEditT = -1;
  let lastCaret = -1;
  let broken = true;

  let corrections = 0;
  let deleteStreak = 0;
  let longestDeleteStreak = 0;
  let lastDeleteT = -1;
  let charsTyped = 0;
  let contiguousKeys = 0;
  let editBursts = 0;
  let offTargetBursts = 0;

  let runs = 0;
  let domino = 0;
  const bag = (code: string) => {
    const m = new Map<string, number>();
    if (input.lint) for (const k of input.lint(code)) m.set(k, (m.get(k) ?? 0) + 1);
    return m;
  };
  let prevLint = bag(initial);
  /** temuan yang tidak ada di snapshot sebelumnya */
  const snapshot = (code: string) => {
    const cur = bag(code);
    for (const [k, n] of cur) domino += Math.max(0, n - (prevLint.get(k) ?? 0));
    prevLint = cur;
  };
  let pendingRunT = -1;
  const scans: number[] = [];

  let pasteAttempts = 0;
  let rejectedInserts = 0;
  let blurCount = 0;
  let blurMs = 0;

  const activity = (t: number) => {
    if (firstActionMs === null) {
      firstActionMs = t;
    } else {
      const gap = t - lastActivity;
      if (gap >= FREEZE_MS) {
        freezes += 1;
        frozenMs += gap;
        longestFreezeMs = Math.max(longestFreezeMs, gap);
      }
    }
    lastActivity = t;
  };

  for (const ev of events) {
    const t = ev[1];
    if (ev[0] === "e") {
      const [, , pos, del, ins] = ev;
      activity(t);
      if (pendingRunT >= 0) {
        scans.push(t - pendingRunT);
        pendingRunT = -1;
      }
      const contiguous =
        !broken && lastEditT >= 0 &&
        ((del === 0 && ins.length > 0 && pos === lastCaret) || (del > 0 && ins === "" && (pos + del === lastCaret || pos === lastCaret)));
      const line = countNl(text.slice(0, pos)) + 1;
      if (contiguous) {
        const key = keyOf(del, ins);
        if (key) {
          const gap = t - lastEditT;
          const st = keys[key] ?? (keys[key] = { n: 0, maxMs: 0, slow: 0 });
          st.n += 1;
          st.maxMs = Math.max(st.maxMs, gap);
          if (gap > SLOW_MS) st.slow += 1;
          contiguousKeys += 1;
        }
      } else {
        editBursts += 1;
        if (!trapLines.some((tl) => Math.abs(tl - line) <= 1)) offTargetBursts += 1;
      }
      if (del > 0 && ins === "") {
        corrections += 1;
        deleteStreak = lastDeleteT >= 0 && t - lastDeleteT < 1000 ? deleteStreak + 1 : 1;
        longestDeleteStreak = Math.max(longestDeleteStreak, deleteStreak);
        lastDeleteT = t;
      } else {
        deleteStreak = 0;
        lastDeleteT = -1;
      }
      charsTyped += ins.length;
      /* geser baris jebakan di bawah titik sunting */
      const shift = countNl(ins) - countNl(text.slice(pos, pos + del));
      if (shift !== 0) for (let i = 0; i < trapLines.length; i++) if (trapLines[i] > line) trapLines[i] += shift;
      text = applyEdit(text, pos, del, ins);
      lastCaret = pos + ins.length;
      lastEditT = t;
      broken = false;
    } else if (ev[0] === "n") {
      activity(t);
      broken = true;
    } else if (ev[0] === "r") {
      activity(t);
      broken = true;
      runs += 1;
      snapshot(text);
      pendingRunT = t;
    } else if (ev[0] === "b") {
      blurCount += 1;
      blurMs += ev[2];
      broken = true;
    } else if (ev[0] === "x") {
      if (ev[2] === "paste" || ev[2] === "drop") pasteAttempts += 1;
      else rejectedInserts += 1;
    }
  }
  snapshot(text);
  if (firstActionMs !== null) {
    const tail = durationMs - lastActivity;
    if (tail >= FREEZE_MS) {
      freezes += 1;
      frozenMs += tail;
      longestFreezeMs = Math.max(longestFreezeMs, tail);
    }
  }

  const slowKeys = Object.keys(keys)
    .filter((k) => keys[k].maxMs > SLOW_MS)
    .sort((a, b) => keys[b].maxMs - keys[a].maxMs);

  return {
    durationMs,
    firstActionMs,
    scanAfterRunMs: median(scans),
    freezes,
    frozenMs,
    longestFreezeMs,
    corrections,
    longestDeleteStreak,
    charsTyped,
    contiguousKeys,
    runs,
    domino,
    editBursts,
    offTargetBursts,
    pasteAttempts,
    rejectedInserts,
    blurCount,
    blurMs,
    keys,
    slowKeys,
  };
}

export function outcomeOf(fixed: number, total: number, recovered: boolean): TrapOutcome {
  if (recovered) return "pulih";
  return fixed >= Math.ceil(total / 2) ? "sebagian" : "gagal";
}

/* ============ PUTAR ULANG (Keystroke Ghost Replay) ============ */

export interface ReplayFrame {
  /** kapan frame tampil pada pemutaran (ms) */
  at: number;
  kind: "edit" | "run";
  pos: number;
  del: number;
  ins: string;
  /** durasi asli jeda sebelum frame ini bila ≥ ambang beku (ms) */
  freezeMs: number;
  /** waktu asli (ms sejak MULAI) */
  realT: number;
}

export interface Replay {
  frames: ReplayFrame[];
  totalMs: number;
  /** diam ≥ ambang beku antara aktivitas terakhir dan akhir sesi (0 bila tidak ada) */
  tailFreezeMs: number;
}

/** Padatkan rekaman menjadi ±targetMs. Setiap beku ≥ freezeMs ditahan minimal holdMs
    agar terbaca, sehingga total bisa sedikit melebihi targetMs.
    Definisi "beku" sama dengan computeMetrics: jeda antar-aktivitas (sunting, pindah
    kursor, Jalankan) SETELAH aksi pertama — waktu membaca di awal bukan beku. */
export function buildReplay(
  events: TrapEvent[],
  durationMs: number,
  opts: { targetMs?: number; freezeMs?: number; holdMs?: number } = {},
): Replay {
  const targetMs = opts.targetMs ?? 10_000;
  const freezeAt = opts.freezeMs ?? FREEZE_MS;
  const holdMs = opts.holdMs ?? 700;
  const speed = Math.max(1, durationMs / targetMs);
  const frames: ReplayFrame[] = [];
  let at = 0;
  let lastFrameT = 0;
  let lastAct = -1;
  let pending = 0;
  for (const ev of events) {
    if (ev[0] !== "e" && ev[0] !== "r" && ev[0] !== "n") continue;
    const t = ev[1];
    if (lastAct >= 0 && t - lastAct >= freezeAt) pending = Math.max(pending, t - lastAct);
    lastAct = t;
    if (ev[0] === "n") continue;
    const gap = Math.max(0, t - lastFrameT);
    at += pending > 0 ? Math.max(gap / speed, holdMs) : gap / speed;
    lastFrameT = t;
    frames.push(
      ev[0] === "e"
        ? { at, kind: "edit", pos: ev[2], del: ev[3], ins: ev[4], freezeMs: pending, realT: t }
        : { at, kind: "run", pos: 0, del: 0, ins: "", freezeMs: pending, realT: t },
    );
    pending = 0;
  }
  const tail = Math.max(0, durationMs - lastFrameT);
  const tailIdle = lastAct >= 0 ? Math.max(0, durationMs - lastAct) : 0;
  const tailFreezeMs = tailIdle >= freezeAt ? tailIdle : 0;
  const totalMs = at + (tailFreezeMs > 0 ? Math.max(tail / speed, holdMs) : tail / speed);
  return { frames, totalMs, tailFreezeMs };
}

/* ============ PENYIMPANAN ============ */

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Bersihkan irisan `aiTrap` dari save (data lama/rusak tidak boleh menggagalkan muat). */
export function normalizeAiTrap(raw: unknown): AiTrapState | undefined {
  if (!isObj(raw)) return undefined;
  const list = Array.isArray(raw.attempts) ? raw.attempts : [];
  const attempts = list.filter(
    (a): a is AiTrapAttempt =>
      isObj(a) && typeof a.id === "string" && typeof a.at === "number" && typeof a.scenarioId === "string" &&
      isObj(a.metrics) && Array.isArray(a.fixed),
  );
  return { attempts: trimAttempts(attempts), deferred: raw.deferred === true ? true : undefined };
}

/** Simpan maksimal MAX_ATTEMPTS percobaan; rekaman ketikan hanya untuk MAX_LOGGED_ATTEMPTS terbaru. */
export function trimAttempts(attempts: AiTrapAttempt[]): AiTrapAttempt[] {
  const kept = attempts.slice(-MAX_ATTEMPTS);
  const firstLogged = kept.length - MAX_LOGGED_ATTEMPTS;
  return kept.map((a, i) => {
    if (i >= firstLogged || !a.log) return a;
    const { log: _drop, ...rest } = a;
    return rest;
  });
}
