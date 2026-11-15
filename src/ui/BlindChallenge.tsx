/* ============ BLIND LIVE-CODING CHALLENGE ============
   Tahap 1 – Pemicu (Disorienting Dilemma). Rancangan: docs/052; catatan
   implementasi: docs/065.

   mode "run"     : pengantar → hitung mundur → 3 menit menulis dari halaman kosong
                    → Rapor Kegagapan Sintaksis.
   mode "history" : daftar rapor tersimpan; rapor pertama (baseline) selalu ada.

   Editor adalah <textarea> polos: tanpa kode acuan, tanpa pewarnaan, tanpa
   pratinjau, tanpa autocomplete, tanpa tempel. Timer tidak bisa dijeda dan tetap
   berjalan saat pindah tab. Log ketikan hanya hidup di memori komponen ini;
   yang disimpan hanyalah agregat dan kode akhir (docs/052 bagian 8.3). */
import { useEffect, useMemo, useRef, useState } from "react";
import type { SaveData } from "../lib/storage";
import type { TrapEvent } from "../lib/trapMetrics";
import { diffEdit } from "../lib/trapMetrics";
import type { BlindAttempt } from "../lib/blindMetrics";
import { BLIND_LEVEL_COLOR, BLIND_LEVEL_LABEL, BLIND_LIMIT_MS, MAX_BLIND_ATTEMPTS } from "../lib/blindMetrics";
import { buildBlindAttempt } from "../lib/blindAttempt";
import type { BlindBrief } from "../data/blindChallenges";
import { getBlindBrief, pickBlindBrief, BLIND_PARTICIPATION_XP } from "../data/blindChallenges";
import { sfx } from "../lib/audio";
import BlindReportCard from "./BlindReportCard";
import { IconArrowL, IconArrowR, IconCheck, IconKeyboard, IconRetry, IconTimer } from "./icons";

const clock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const dateLabel = (at: number) =>
  new Date(at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const BLOCKED_INPUT = new Set([
  "insertFromPaste", "insertFromPasteAsQuotation", "insertFromDrop", "insertFromYank", "insertReplacementText",
]);
const NAV_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"]);

/* ====================================================================== */
/* PENGANTAR                                                               */
/* ====================================================================== */

const CONFIDENCE = ["Tidak yakin", "Kurang yakin", "Cukup yakin", "Yakin", "Sangat yakin"];

function Intro({
  gated, firstTime, onStart, onDefer, onExit,
}: {
  gated: boolean; firstTime: boolean;
  onStart: (confidence: number) => void; onDefer: () => void; onExit: () => void;
}) {
  const [confidence, setConfidence] = useState(0);
  const rules = [
    "Halaman kosong. Tidak ada kode contoh, pewarnaan sintaks, pratinjau, maupun autocomplete.",
    "Tempel, seret-lepas teks, dan klik kanan ditolak dan dicatat. Tab menyisipkan dua spasi.",
    "Waktu 3 menit tidak bisa dijeda, dan tetap berjalan bila kamu pindah tab.",
    "Soalnya baru tampil saat waktu mulai berjalan: satu halaman mini berisi beberapa elemen HTML, satu aturan CSS, dan satu fungsi JavaScript.",
  ];
  return (
    <div className="relative z-10 min-h-screen grid place-items-center px-4 py-8">
      <div className="panel w-full max-w-2xl p-6 md:p-8 screen-in" style={{ borderColor: "rgba(69,198,255,0.45)" }}>
        <p className="blind-label"><IconKeyboard size={14} /> BLIND LIVE-CODING CHALLENGE</p>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight mt-3">
          Tulis kodenya sendiri, dari halaman kosong
        </h1>
        <p className="text-[15px] text-[var(--ink)] mt-3 leading-relaxed">
          Di latihan reguler kamu menyalin kode yang terlihat di layar. Di sini kodenya tidak ada: kamu membaca soal, lalu menulis
          HTML, CSS, dan JavaScript-nya dari ingatan. Hasilnya adalah <strong className="text-white">Rapor Kegagapan Sintaksis</strong>{" "}
          milikmu sendiri.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-[var(--ink)]">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="text-[var(--cyan)] font-extrabold">{i + 1}</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <fieldset className="mt-6">
          <legend className="text-sm font-extrabold text-white">Sebelum mulai: seberapa yakin kamu bisa menulis ini tanpa AI?</legend>
          <div className="grid grid-cols-5 gap-2 mt-2.5">
            {CONFIDENCE.map((label, i) => {
              const v = i + 1;
              const on = confidence === v;
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={on}
                  onClick={() => { sfx.click(); setConfidence(v); }}
                  className="trap-confidence blind-confidence"
                  data-on={on}
                >
                  <strong>{v}</strong>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <details className="mt-5 text-[13px] text-[var(--dim)]">
          <summary className="cursor-pointer font-bold text-[var(--ink)]">Apa yang direkam selama tantangan?</summary>
          <p className="mt-2 leading-relaxed">
            Yang disimpan: kode akhirmu dan angka ringkasannya, yaitu jumlah dan lama jeda sebelum simbol, waktu tanpa ketikan,
            koreksi, syntax error, upaya tempel, dan berapa lama kamu keluar dari jendela ini. Urutan ketikanmu satu per satu hanya
            dipakai untuk menghitung angka itu, lalu dibuang: tidak disimpan dan tidak dikirim. Rapor tersimpan di profilmu
            (paling banyak {MAX_BLIND_ATTEMPTS}) dan ikut tersinkron bila aplikasi terhubung ke cloud.
          </p>
        </details>

        <p className="text-[13px] text-[var(--dim)] mt-4 leading-relaxed">
          Hasilnya tidak memengaruhi nilai, rank, maupun koin.
          {firstTime && ` Kamu mendapat ${BLIND_PARTICIPATION_XP} XP karena mengerjakannya, berapa pun hasilnya.`}
        </p>

        <div className="flex items-center gap-3 flex-wrap mt-5">
          <button
            type="button"
            className="btn btn-primary px-6 py-3.5 text-base"
            disabled={confidence === 0}
            onClick={() => onStart(confidence)}
          >
            Mulai 3 menit <IconArrowR size={18} />
          </button>
          {!gated && (
            <button type="button" className="btn btn-ghost px-4 py-3" onClick={onExit}>
              <IconArrowL size={16} /> Kembali
            </button>
          )}
          {confidence === 0 && <span className="text-[12px] font-bold text-[var(--amber)]">Pilih tingkat keyakinanmu dulu.</span>}
        </div>

        {gated && (
          <p className="text-[12px] text-[var(--faint)] mt-5 leading-relaxed">
            Tantangan ini wajib dikerjakan satu kali sebelum latihan pertama.{" "}
            <button type="button" className="underline hover:text-[var(--dim)]" onClick={onDefer}>
              Saya tidak bisa mengerjakannya (kebutuhan aksesibilitas)
            </button>
            {" "}— latihan tetap dibuka tanpa rapor.{" "}
            <button type="button" className="underline hover:text-[var(--dim)]" onClick={onExit}>Kembali ke Dashboard</button>.
          </p>
        )}
      </div>
    </div>
  );
}

function NeedsKeyboard({ onExit }: { onExit: () => void }) {
  return (
    <div className="relative z-10 min-h-screen grid place-items-center px-4 py-8">
      <div className="panel w-full max-w-lg p-6 md:p-8 text-center screen-in">
        <p className="blind-label justify-center"><IconKeyboard size={14} /> BLIND LIVE-CODING CHALLENGE</p>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-tight mt-3">Kerjakan di laptop</h1>
        <p className="text-sm text-[var(--ink)] mt-3 leading-relaxed">
          Tantangan ini mengukur jeda jarimu sebelum simbol. Di keyboard layar sentuh simbol berada di lapisan lain dan saran kata tidak
          bisa dimatikan, jadi angkanya tidak sahih. Buka CodeShark di perangkat dengan keyboard fisik untuk mengerjakannya.
        </p>
        <button type="button" className="btn btn-ghost px-5 py-3 mt-5" onClick={onExit}><IconArrowL size={16} /> Kembali</button>
      </div>
    </div>
  );
}

/* ====================================================================== */
/* ARENA — 3 MENIT, HALAMAN KOSONG                                         */
/* ====================================================================== */

function BlindArena({
  brief, confidence, onFinish,
}: {
  brief: BlindBrief; confidence: number; onFinish: (a: BlindAttempt) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const events = useRef<TrapEvent[]>([]);
  const value = useRef("");
  const startAt = useRef(performance.now());
  const blurAt = useRef<number | null>(null);
  const ended = useRef(false);
  const selfInsert = useRef(false);
  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; });

  const [remaining, setRemaining] = useState(BLIND_LIMIT_MS);
  const [lineCount, setLineCount] = useState(1);
  const [phase, setPhase] = useState<"play" | "closing">("play");
  const [closingNote, setClosingNote] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [blocked, setBlocked] = useState(0);

  const now = () => Math.round(performance.now() - startAt.current);
  const push = (ev: TrapEvent) => {
    const list = events.current;
    if (ev[0] === "n" && list.length && list[list.length - 1][0] === "n") return;
    list.push(ev);
  };

  const finish = (endedBy: BlindAttempt["endedBy"]) => {
    if (ended.current) return;
    ended.current = true;
    const durationMs = Math.min(BLIND_LIMIT_MS, now());
    if (blurAt.current !== null) {
      push(["b", blurAt.current, Math.max(0, durationMs - blurAt.current)]);
      blurAt.current = null;
    }
    setPhase("closing");
    setClosingNote(endedBy === "timeout" ? "WAKTU HABIS" : "SESI SELESAI");
    sfx.back();
    const attempt = buildBlindAttempt({
      brief, code: value.current, events: events.current, durationMs, endedBy, confidence, id: uid(), at: Date.now(),
    });
    /* log mentah tidak disimpan: dikosongkan begitu agregatnya jadi */
    events.current = [];
    window.setTimeout(() => onFinishRef.current(attempt), 1200);
  };
  const finishRef = useRef(finish);
  useEffect(() => { finishRef.current = finish; });

  /* latar laut beranimasi dimatikan selama arena: render yang berat akan mencemari
     pengukuran jeda ketik (CSS: html.trap-live .ambient-root) */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("trap-live");
    taRef.current?.focus();
    return () => root.classList.remove("trap-live");
  }, []);

  /* timer berbasis tenggat — tab yang diperlambat browser tidak memperpanjang waktu */
  useEffect(() => {
    const iv = window.setInterval(() => {
      if (ended.current) return;
      const left = BLIND_LIMIT_MS - (performance.now() - startAt.current);
      setRemaining(Math.max(0, left));
      if (left <= 0) finishRef.current("timeout");
    }, 200);
    return () => window.clearInterval(iv);
  }, []);

  /* keluar jendela: timer TIDAK berhenti; hanya dicatat */
  useEffect(() => {
    const away = () => { if (!ended.current && blurAt.current === null) blurAt.current = now(); };
    const back = () => {
      if (blurAt.current === null) return;
      push(["b", blurAt.current, Math.max(0, now() - blurAt.current)]);
      blurAt.current = null;
    };
    const onVis = () => (document.hidden ? away() : back());
    window.addEventListener("blur", away);
    window.addEventListener("focus", back);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("blur", away);
      window.removeEventListener("focus", back);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* editor: semua pencatatan lewat event native agar inputType & isTrusted terbaca */
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const reject = (kind: string) => {
      push(["x", now(), kind]);
      setBlocked((n) => n + 1);
      sfx.err();
    };
    const onBeforeInput = (e: InputEvent) => {
      if (ended.current) return e.preventDefault();
      if (!e.isTrusted && !selfInsert.current) {
        e.preventDefault();
        reject("synthetic");
      } else if (BLOCKED_INPUT.has(e.inputType)) {
        e.preventDefault();
        reject(e.inputType === "insertFromDrop" ? "drop" : e.inputType === "insertReplacementText" ? "replace" : "paste");
      }
    };
    const onPaste = (e: Event) => { e.preventDefault(); reject("paste"); };
    const onDrop = (e: Event) => { e.preventDefault(); reject("drop"); };
    const onContext = (e: Event) => { e.preventDefault(); reject("paste"); };
    const onInput = (e?: Event) => {
      if (ended.current) {
        ta.value = value.current;
        return;
      }
      const next = ta.value;
      const d = diffEdit(value.current, next, ta.selectionStart);
      /* Satu tekanan tombol menyisipkan paling banyak 2 karakter (dead key + huruf).
         Sisipan lebih panjang berasal dari skrip/ekstensi/dikte: execCommand TIDAK
         memicu beforeinput, jadi ditangkap di sini lalu dikembalikan. Undo/redo dan
         komposisi IME dikecualikan. */
      const it = e instanceof InputEvent ? e.inputType : "";
      const composing = e instanceof InputEvent && e.isComposing;
      if (d && !selfInsert.current && !composing && it !== "historyUndo" && it !== "historyRedo" && [...d.ins].length > 2) {
        ta.value = value.current;
        ta.setSelectionRange(d.pos, d.pos);
        reject("synthetic");
        return;
      }
      if (d) push(["e", now(), d.pos, d.del, d.ins]);
      value.current = next;
      const lines = next.split("\n").length;
      setLineCount((c) => (c === lines ? c : lines));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (ended.current) return;
        selfInsert.current = true;
        const ok = typeof document.execCommand === "function" && document.execCommand("insertText", false, "  ");
        selfInsert.current = false;
        if (!ok) {
          ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end");
          onInput();
        }
        return;
      }
      if (NAV_KEYS.has(e.key)) push(["n", now()]);
    };
    const onMouseDown = () => push(["n", now()]);
    const onScroll = () => { if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop; };

    ta.addEventListener("beforeinput", onBeforeInput);
    ta.addEventListener("paste", onPaste);
    ta.addEventListener("drop", onDrop);
    ta.addEventListener("contextmenu", onContext);
    ta.addEventListener("input", onInput);
    ta.addEventListener("keydown", onKeyDown);
    ta.addEventListener("mousedown", onMouseDown);
    ta.addEventListener("scroll", onScroll);
    return () => {
      ta.removeEventListener("beforeinput", onBeforeInput);
      ta.removeEventListener("paste", onPaste);
      ta.removeEventListener("drop", onDrop);
      ta.removeEventListener("contextmenu", onContext);
      ta.removeEventListener("input", onInput);
      ta.removeEventListener("keydown", onKeyDown);
      ta.removeEventListener("mousedown", onMouseDown);
      ta.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!confirmEnd) return;
    const t = window.setTimeout(() => setConfirmEnd(false), 3000);
    return () => window.clearTimeout(t);
  }, [confirmEnd]);

  const urgent = remaining <= 30_000;

  return (
    <div className="trap-arena blind-arena relative z-10 min-h-screen flex flex-col">
      <header className="trap-topbar blind-topbar">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <div className="mr-auto min-w-0">
            <p className="blind-label"><IconKeyboard size={14} /> TANPA CONTOH • TANPA BANTUAN</p>
            <p className="font-display font-extrabold text-white text-base md:text-lg leading-tight truncate">{brief.title}</p>
          </div>
          <div
            className={`trap-timer font-code ${urgent ? "urgent" : ""}`}
            role="timer"
            aria-label={`Sisa waktu ${clock(remaining)}`}
          >
            <IconTimer size={18} /> {clock(remaining)}
          </div>
          <button
            type="button"
            className="btn btn-ghost px-4 py-2.5 text-sm"
            disabled={phase !== "play"}
            onClick={() => (confirmEnd ? finish("manual") : setConfirmEnd(true))}
          >
            {confirmEnd ? "Yakin? Klik lagi" : <><IconCheck size={15} /> Saya selesai</>}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4 items-start">
        {/* ---------- soal ---------- */}
        <aside className="panel-flat blind-brief" aria-label="Soal">
          <p className="trap-side-head">Soal</p>
          <div className="p-4">
            <p className="text-sm text-[var(--ink)] leading-relaxed">
              Tulis semuanya dalam satu berkas: HTML dulu, lalu CSS di dalam tag <code className="blind-sym">style</code>, lalu
              JavaScript di dalam tag <code className="blind-sym">script</code>.
            </p>
            <ol className="mt-3 space-y-2.5">
              {brief.demands.map((d, i) => (
                <li key={d.id} className="flex gap-2.5 text-[15px] text-white leading-relaxed">
                  <span className="text-[var(--cyan)] font-extrabold">{i + 1}</span>
                  <span>{d.text}</span>
                </li>
              ))}
            </ol>
            <p className="text-[12px] text-[var(--faint)] mt-4 leading-relaxed">
              Tidak ada pemeriksaan selama kamu menulis. Kode diperiksa sekali, setelah waktu habis atau setelah kamu menekan Saya selesai.
            </p>
          </div>
        </aside>

        {/* ---------- editor ---------- */}
        <section className="trap-editor-shell blind-editor-shell" aria-label="Editor kode">
          <div className="trap-editor-head">
            <span>halaman-kosong.html</span>
            <span className="ml-auto">tanpa autocomplete • tanpa tempel{blocked > 0 ? ` • ${blocked} sisipan ditolak` : ""}</span>
          </div>
          <div className="trap-editor">
            <div ref={gutterRef} className="trap-gutter font-code" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              ref={taRef}
              className="trap-textarea font-code"
              defaultValue=""
              wrap="off"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              data-lpignore="true"
              data-1p-ignore="true"
              aria-label="Tulis kodemu di sini"
              readOnly={phase !== "play"}
            />
          </div>
        </section>
      </main>

      {phase === "closing" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(2,9,17,0.86)] backdrop-blur-sm" role="status">
          <div className="text-center anim-pop">
            <p className="font-display font-extrabold text-5xl md:text-6xl text-white">{closingNote}</p>
            <p className="text-[var(--dim)] font-bold mt-3">Menyusun rapor…</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================================================================== */
/* RIWAYAT RAPOR                                                           */
/* ====================================================================== */

function History({
  save, canRetake, onExit, onRetake,
}: {
  save: SaveData; canRetake: boolean; onExit: () => void; onRetake: () => void;
}) {
  const all = save.blind?.attempts;
  const attempts = useMemo(() => [...(all ?? [])].reverse(), [all]);
  const baseline = all?.[0];
  const [selected, setSelected] = useState<string | null>(attempts[0]?.id ?? null);
  const current = attempts.find((a) => a.id === selected) ?? attempts[0];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,14,26,0.88)] border-b border-[var(--line-soft)]">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2.5 flex-wrap">
          <button type="button" className="btn btn-ghost !px-3 !py-2" onClick={onExit}><IconArrowL size={16} /> Dashboard</button>
          <p className="font-display font-extrabold text-white mr-auto">Rapor Kegagapan Sintaksis</p>
          {canRetake && (
            <button type="button" className="btn btn-primary !px-4 !py-2 text-sm" onClick={onRetake}><IconRetry size={15} /> Ulangi tantangan</button>
          )}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {attempts.length === 0 ? (
          <div className="panel p-8 text-center">
            <p className="text-[var(--dim)]">Belum ada rapor yang tersimpan.</p>
          </div>
        ) : (
          <>
            <section className="panel p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[var(--faint)] mb-2.5">
                {attempts.length} rapor tersimpan • terbaru di atas • rapor pertama tidak pernah dihapus
              </p>
              <ul className="space-y-1.5">
                {attempts.map((a) => {
                  const on = a.id === current?.id;
                  const errors = a.syntaxErrors.filter((e) => !e.unfinished).length;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        className="trap-history-row"
                        data-on={on}
                        aria-current={on}
                        onClick={() => { sfx.click(); setSelected(a.id); }}
                      >
                        <span className="text-sm text-[var(--ink)] mr-auto text-left">
                          {dateLabel(a.at)} <span className="text-[var(--faint)]">• {getBlindBrief(a.briefId)?.title ?? a.briefId}</span>
                        </span>
                        {a.id === baseline?.id && <span className="chip" style={{ color: "var(--cyan)" }}>rapor pertama</span>}
                        <span className="chip">{a.braceHesitations + a.semicolonHesitations} jeda {"{ } ;"}</span>
                        <span className="chip">{errors} syntax error</span>
                        <span className="chip" style={{ color: BLIND_LEVEL_COLOR[a.level] }}>{BLIND_LEVEL_LABEL[a.level]}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
            {current && (
              <BlindReportCard
                key={current.id}
                attempt={current}
                brief={getBlindBrief(current.briefId)}
                baseline={baseline}
                bestCopyWpm={save.stats.bestWpm}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ====================================================================== */
/* MODUL                                                                   */
/* ====================================================================== */

interface Props {
  save: SaveData;
  mode: "run" | "history";
  /** datang dari gerbang (wajib) — ada tautan penundaan aksesibilitas */
  gated: boolean;
  /** tanpa keyboard fisik tantangan tidak dimulai (angkanya tidak sahih) */
  noKeyboard: boolean;
  continueLabel: string;
  /** sesi benar-benar dimulai (timer berjalan): catat variannya supaya tidak terulang */
  onBegin: (briefId: string) => void;
  onRecord: (attempt: BlindAttempt) => void;
  onDefer: () => void;
  onContinue: () => void;
  onExit: () => void;
  onRetake: () => void;
}

export default function BlindChallenge({
  save, mode, gated, noKeyboard, continueLabel, onBegin, onRecord, onDefer, onContinue, onExit, onRetake,
}: Props) {
  const [brief] = useState(() => pickBlindBrief(save.blind?.lastBriefId ?? save.blind?.attempts.at(-1)?.briefId));
  /* rapor pertama saat modul dibuka; tidak berubah setelah percobaan ini tercatat */
  const [baseline] = useState(() => save.blind?.attempts[0]);
  const [step, setStep] = useState<"intro" | "count" | "play" | "report">("intro");
  const [confidence, setConfidence] = useState(0);
  const [count, setCount] = useState(3);
  const [attempt, setAttempt] = useState<BlindAttempt | null>(null);
  const onBeginRef = useRef(onBegin);
  useEffect(() => { onBeginRef.current = onBegin; });

  useEffect(() => {
    if (step !== "count") return;
    if (count === 0) {
      sfx.go();
      onBeginRef.current(brief.id);
      setStep("play");
      return;
    }
    sfx.count();
    const t = window.setTimeout(() => setCount((c) => c - 1), 800);
    return () => window.clearTimeout(t);
  }, [step, count, brief.id]);

  useEffect(() => {
    if (step === "report") window.scrollTo(0, 0);
  }, [step]);

  if (mode === "history") {
    return <History save={save} canRetake={!noKeyboard} onExit={onExit} onRetake={onRetake} />;
  }

  if (noKeyboard && step === "intro") return <NeedsKeyboard onExit={onExit} />;

  if (step === "intro") {
    return (
      <Intro
        gated={gated}
        firstTime={!baseline}
        onStart={(c) => { sfx.click(); setConfidence(c); setCount(3); setStep("count"); }}
        onDefer={onDefer}
        onExit={onExit}
      />
    );
  }

  if (step === "count") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(3,12,22,0.92)]">
        <div className="text-center">
          <p className="text-sm font-extrabold tracking-[0.3em] uppercase text-[var(--cyan)] mb-3">Halaman kosong dalam</p>
          <div key={count} className="font-display font-extrabold text-8xl md:text-9xl text-white count-pop">{count}</div>
        </div>
      </div>
    );
  }

  if (step === "play") {
    return (
      <BlindArena
        brief={brief}
        confidence={confidence}
        onFinish={(a) => { onRecord(a); setAttempt(a); setStep("report"); }}
      />
    );
  }

  return (
    <div className="relative z-10 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-6">
        {attempt && (
          <BlindReportCard
            attempt={attempt}
            brief={brief}
            baseline={baseline}
            bestCopyWpm={save.stats.bestWpm}
            onContinue={onContinue}
            continueLabel={continueLabel}
          />
        )}
      </main>
    </div>
  );
}
