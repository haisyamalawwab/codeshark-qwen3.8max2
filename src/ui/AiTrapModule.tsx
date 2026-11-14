/* ============ THE AI-TRAP & PRODUCTION CRISIS SIMULATOR ============
   Tahap 1 – Pemicu (Disorienting Dilemma). Rancangan: docs/053; catatan
   implementasi: docs/054.

   mode "run"     : pengarahan → hitung mundur → Babak 1 (jebakan, 3 menit) →
                    Babak 2 (diagnosis).
   mode "history" : riwayat percobaan + diagnosis tiap percobaan + unduh telemetri.

   Babak 1 memakai <textarea> polos: tanpa autocomplete, tanpa pewarnaan,
   tanpa tempel. Timer tidak bisa dijeda dan tetap berjalan saat pindah tab. */
import { useEffect, useMemo, useRef, useState } from "react";
import type { SaveData } from "../lib/storage";
import type { AiTrapAttempt, TrapEvent } from "../lib/trapMetrics";
import {
  computeMetrics, diffEdit, outcomeOf, MAX_CODE_CHARS, MAX_LOG_EVENTS, TRAP_LIMIT_MS,
} from "../lib/trapMetrics";
import { lintDoc, lintKeys } from "../lib/trapLint";
import type { RunResult } from "../lib/trapRunner";
import { isRecovered, runInSandbox } from "../lib/trapRunner";
import type { TrapScenario } from "../data/aiTrapScenarios";
import { fixedTrapIds, getTrapScenario, pickTrapScenario, trapLine, TRAP_SCENARIOS } from "../data/aiTrapScenarios";
import { sfx } from "../lib/audio";
import AiTrapDiagnostic from "./AiTrapDiagnostic";
import { IconArrowL, IconArrowR, IconCheck, IconPlay, IconRetry, IconTimer, IconX } from "./icons";

const clock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const BLOCKED_INPUT = new Set([
  "insertFromPaste", "insertFromPasteAsQuotation", "insertFromDrop", "insertFromYank", "insertReplacementText",
]);
const NAV_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"]);

/* ====================================================================== */
/* PENGARAHAN                                                              */
/* ====================================================================== */

const CONFIDENCE = ["Tidak yakin", "Kurang yakin", "Cukup yakin", "Yakin", "Sangat yakin"];

function Briefing({
  scenario, gated, gate, hubHref, onStart, onDefer, onExit,
}: {
  scenario: TrapScenario; gated: boolean; gate: "entry" | "practice"; hubHref?: string;
  onStart: (confidence: number) => void; onDefer: () => void; onExit: () => void;
}) {
  const [confidence, setConfidence] = useState(0);
  const lines = scenario.code.trimEnd().split("\n").length;
  return (
    <div className="relative z-10 min-h-screen grid place-items-center px-4 py-8">
      <div className="panel w-full max-w-2xl p-6 md:p-8 screen-in" style={{ borderColor: "rgba(255,107,87,0.45)" }}>
        <p className="trap-incident-label"><i /> INSIDEN PRODUKSI • SIMULASI</p>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight mt-3">{scenario.title}</h1>
        <p className="text-[15px] text-[var(--ink)] mt-3 leading-relaxed">{scenario.incident}</p>
        <p className="text-[15px] text-white font-bold mt-2 leading-relaxed">
          Kode {lines} baris itu sekarang di tanganmu. Kamu punya 3 menit untuk memulihkan sistem.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-[var(--ink)]">
          <li className="flex gap-2.5"><span className="text-[var(--coral)] font-extrabold">1</span><span>Tanpa AI, tanpa autocomplete, tanpa tempel. Hanya mata dan jarimu.</span></li>
          <li className="flex gap-2.5"><span className="text-[var(--coral)] font-extrabold">2</span><span>Tombol <strong>Jalankan</strong> mengeksekusi kodemu dan menampilkan pesan error asli dari browser.</span></li>
          <li className="flex gap-2.5"><span className="text-[var(--coral)] font-extrabold">3</span><span>Waktu tidak bisa dijeda, dan tetap berjalan bila kamu pindah tab.</span></li>
          <li className="flex gap-2.5"><span className="text-[var(--coral)] font-extrabold">4</span><span>Target: {scenario.goal}</span></li>
        </ul>

        <fieldset className="mt-6">
          <legend className="text-sm font-extrabold text-white">Sebelum mulai: seberapa yakin kamu bisa memperbaikinya tanpa AI?</legend>
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
                  className="trap-confidence"
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
          <summary className="cursor-pointer font-bold text-[var(--ink)]">Apa yang direkam selama simulasi?</summary>
          <p className="mt-2 leading-relaxed">
            Setiap suntingan beserta waktunya, jeda antar-ketukan, berapa kali kamu menjalankan kode, upaya tempel, dan berapa
            lama kamu keluar dari jendela ini. Rekaman disimpan di riwayat profilmu dan ikut tersinkron bila aplikasi terhubung
            ke cloud. Hasilnya tidak memengaruhi nilai, rank, maupun koin.
          </p>
        </details>

        <div className="flex items-center gap-3 flex-wrap mt-6">
          <button
            type="button"
            className="btn btn-coral px-6 py-3.5 text-base"
            disabled={confidence === 0}
            onClick={() => onStart(confidence)}
          >
            Ambil alih insiden <IconArrowR size={18} />
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
            Simulasi ini wajib dikerjakan satu kali sebelum {gate === "entry" ? "masuk ke CodeShark" : "latihan pertama"}.{" "}
            <button type="button" className="underline hover:text-[var(--dim)]" onClick={onDefer}>
              Saya tidak bisa mengerjakannya (kebutuhan aksesibilitas)
            </button>
            {" "}— {gate === "entry" ? "CodeShark" : "latihan"} tetap dibuka tanpa diagnosis.
            {gate === "entry" && hubHref && (
              <>
                {" "}
                <a className="underline hover:text-[var(--dim)]" href={hubHref}>Kembali ke hub</a>.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

/* ====================================================================== */
/* BABAK 1 — JEBAKAN                                                       */
/* ====================================================================== */

function TrapArena({
  scenario, confidence, onFinish,
}: {
  scenario: TrapScenario; confidence: number; onFinish: (a: AiTrapAttempt) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const events = useRef<TrapEvent[]>([]);
  const value = useRef(scenario.code);
  const startAt = useRef(performance.now());
  const blurAt = useRef<number | null>(null);
  const ended = useRef(false);
  const selfInsert = useRef(false);
  const runChain = useRef<Promise<unknown>>(Promise.resolve());
  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; });

  const [remaining, setRemaining] = useState(TRAP_LIMIT_MS);
  const [lineCount, setLineCount] = useState(() => scenario.code.split("\n").length);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState(0);
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

  /* satu antrean eksekusi: Jalankan dan pemeriksaan akhir tidak saling menimpa iframe */
  const execute = (code: string): Promise<RunResult> => {
    const frame = frameRef.current;
    const next = runChain.current.then(() =>
      frame ? runInSandbox(frame, code, scenario.checks) : { errors: [], checks: [], timedOut: true },
    );
    runChain.current = next.catch(() => undefined);
    return next;
  };

  const finish = async (endedBy: AiTrapAttempt["endedBy"], known?: RunResult) => {
    if (ended.current) return;
    ended.current = true;
    const durationMs = Math.min(TRAP_LIMIT_MS, now());
    if (blurAt.current !== null) {
      push(["b", blurAt.current, Math.max(0, durationMs - blurAt.current)]);
      blurAt.current = null;
    }
    setPhase("closing");
    setClosingNote(endedBy === "timeout" ? "WAKTU HABIS" : endedBy === "recovered" ? "PRODUKSI PULIH" : "SESI DIAKHIRI");
    if (endedBy === "recovered") sfx.win(); else sfx.lose();
    const code = value.current;
    const final = known ?? (await execute(code));
    const fixed = fixedTrapIds(scenario, code);
    const recovered = isRecovered(final);
    const metrics = computeMetrics({
      initial: scenario.code,
      events: events.current,
      durationMs,
      lint: lintKeys,
      trapLines: scenario.traps.map((t) => trapLine(scenario, t)),
    });
    const attempt: AiTrapAttempt = {
      id: uid(),
      at: Date.now(),
      scenarioId: scenario.id,
      confidence,
      durationMs,
      limitMs: TRAP_LIMIT_MS,
      endedBy,
      fixed,
      trapTotal: scenario.traps.length,
      recovered,
      checksOk: final.checks.filter((c) => c.ok).length,
      checksTotal: final.checks.length,
      lastError: final.errors[0]?.message ?? (final.timedOut ? "Halaman tidak merespons" : final.skipped ?? ""),
      outcome: outcomeOf(fixed.length, scenario.traps.length, recovered),
      metrics,
      code: code.slice(0, MAX_CODE_CHARS),
      log: events.current.slice(0, MAX_LOG_EVENTS),
    };
    window.setTimeout(() => onFinishRef.current(attempt), 1400);
  };

  const run = async () => {
    if (ended.current || running) return;
    setRunning(true);
    sfx.click();
    const code = value.current;
    const r = await execute(code);
    if (ended.current) return;
    push(["r", now(), lintDoc(code).length, r.checks.filter((c) => c.ok).length, r.checks.length, r.errors[0]?.message ?? ""]);
    setResult(r);
    setRuns((n) => n + 1);
    setRunning(false);
    if (isRecovered(r)) finish("recovered", r);
    else if (r.errors.length) sfx.err();
  };
  const runRef = useRef(run);
  useEffect(() => { runRef.current = run; });
  const finishRef = useRef(finish);
  useEffect(() => { finishRef.current = finish; });

  /* latar laut beranimasi dimatikan selama arena: render yang berat akan mencemari
     pengukuran jeda ketik (CSS: html.trap-live .ambient-root) */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("trap-live");
    return () => root.classList.remove("trap-live");
  }, []);

  /* kondisi produksi awal: langsung tampilkan error — tidak dihitung sebagai Jalankan */
  useEffect(() => {
    let alive = true;
    execute(scenario.code).then((r) => { if (alive && !ended.current) setResult((cur) => cur ?? r); });
    taRef.current?.focus();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* timer berbasis tenggat — tab yang diperlambat browser tidak memperpanjang waktu */
  useEffect(() => {
    const iv = window.setInterval(() => {
      if (ended.current) return;
      const left = TRAP_LIMIT_MS - (performance.now() - startAt.current);
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
    const onContext = (e: Event) => e.preventDefault();
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
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runRef.current();
        return;
      }
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
  const okCount = result ? result.checks.filter((c) => c.ok).length : 0;

  return (
    <div className="trap-arena relative z-10 min-h-screen flex flex-col">
      <header className="trap-topbar">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <div className="mr-auto min-w-0">
            <p className="trap-incident-label"><i /> PRODUKSI DOWN</p>
            <p className="font-display font-extrabold text-white text-base md:text-lg leading-tight truncate">{scenario.title}</p>
          </div>
          <div
            className={`trap-timer font-code ${urgent ? "urgent" : ""}`}
            role="timer"
            aria-label={`Sisa waktu ${clock(remaining)}`}
          >
            <IconTimer size={18} /> {clock(remaining)}
          </div>
          <button type="button" className="btn btn-coral px-4 py-2.5" onClick={run} disabled={running || phase !== "play"}>
            <IconPlay size={16} /> {running ? "Menjalankan…" : "Jalankan"}
            <span className="hidden md:inline text-[11px] font-bold opacity-80">Ctrl+Enter</span>
          </button>
          <button
            type="button"
            className="btn btn-ghost px-3 py-2.5 text-sm"
            disabled={phase !== "play"}
            onClick={() => (confirmEnd ? finish("manual") : setConfirmEnd(true))}
          >
            {confirmEnd ? "Yakin? Klik lagi" : "Akhiri"}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4">
        {/* ---------- editor ---------- */}
        <section className="trap-editor-shell" aria-label="Editor kode">
          <div className="trap-editor-head">
            <span>{scenario.id}.html — hasil asisten AI, belum diperiksa</span>
            <span className="ml-auto">tanpa autocomplete • tanpa tempel{blocked > 0 ? ` • ${blocked} sisipan ditolak` : ""}</span>
          </div>
          <div className="trap-editor">
            <div ref={gutterRef} className="trap-gutter font-code" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              ref={taRef}
              className="trap-textarea font-code"
              defaultValue={scenario.code}
              wrap="off"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              data-lpignore="true"
              aria-label="Kode yang harus diperbaiki"
              readOnly={phase !== "play"}
            />
          </div>
        </section>

        {/* ---------- kondisi produksi ---------- */}
        <aside className="space-y-3 min-w-0">
          <div className="panel-flat overflow-hidden">
            <p className="trap-side-head">Tampilan produksi</p>
            <iframe
              ref={frameRef}
              title="Tampilan produksi"
              sandbox="allow-scripts"
              tabIndex={-1}
              className="w-full h-56 bg-white block pointer-events-none"
            />
          </div>

          <div className="panel-flat">
            <p className="trap-side-head">
              Pemeriksaan produksi
              {result && result.checks.length > 0 && (
                <span className="ml-auto font-code" style={{ color: okCount === result.checks.length ? "var(--teal)" : "var(--coral)" }}>
                  {okCount}/{result.checks.length} lulus
                </span>
              )}
            </p>
            <ul className="p-3 space-y-2" aria-live="polite">
              {!result && <li className="text-sm text-[var(--dim)]">Memeriksa kondisi produksi…</li>}
              {result?.timedOut && <li className="text-sm text-[var(--coral)] font-bold">Halaman tidak merespons.</li>}
              {result?.skipped && <li className="text-sm text-[var(--amber)] font-bold">{result.skipped}</li>}
              {result?.checks.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span
                    className="w-5 h-5 rounded-full grid place-items-center shrink-0 mt-0.5"
                    style={{ background: c.ok ? "rgba(46,230,200,0.16)" : "rgba(255,107,87,0.18)", color: c.ok ? "var(--teal)" : "var(--coral)" }}
                  >
                    {c.ok ? <IconCheck size={12} /> : <IconX size={11} />}
                  </span>
                  <span className="min-w-0">
                    <span className={c.ok ? "text-[var(--mint)]" : "text-white font-bold"}>{c.label}</span>
                    {!c.ok && c.detail && <span className="block font-code text-[11.5px] text-[var(--dim)] break-words">{c.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="trap-console font-code" aria-live="polite">
            <p className="trap-console-head">Konsol browser{runs > 0 ? ` • dijalankan ${runs}×` : ""}</p>
            {!result ? (
              <p className="text-[var(--faint)]">…</p>
            ) : result.errors.length ? (
              result.errors.map((e, i) => (
                <p key={i} className="trap-console-err">
                  ✖ {e.message}
                  {e.line !== null && <span className="trap-console-line"> baris {e.line}</span>}
                </p>
              ))
            ) : (
              <p className="text-[var(--dim)]">
                {okCount === result.checks.length && result.checks.length > 0
                  ? "Tidak ada error."
                  : "Tidak ada error di konsol — tetapi pemeriksaan di atas masih gagal."}
              </p>
            )}
          </div>
        </aside>
      </main>

      {phase === "closing" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(2,9,17,0.86)] backdrop-blur-sm" role="status">
          <div className="text-center anim-pop">
            <p
              className="font-display font-extrabold text-5xl md:text-6xl"
              style={{ color: closingNote === "PRODUKSI PULIH" ? "var(--teal)" : "var(--coral)" }}
            >
              {closingNote}
            </p>
            <p className="text-[var(--dim)] font-bold mt-3">Menyusun diagnosis…</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================================================================== */
/* RIWAYAT + TELEMETRI                                                     */
/* ====================================================================== */

const OUTCOME_LABEL = { pulih: "Pulih", sebagian: "Masih down", gagal: "Tetap down" } as const;
const OUTCOME_COLOR = { pulih: "var(--teal)", sebagian: "var(--amber)", gagal: "var(--coral)" } as const;

const dateLabel = (at: number) =>
  new Date(at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function downloadTelemetry(save: SaveData) {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "codeshark-ai-trap",
    profileName: save.profile?.name ?? null,
    ageGroup: save.profile?.age ?? null,
    deviceId: save.deviceId,
    eventFormat: {
      e: "[\"e\", t, posisi, jumlahDihapus, teksDisisipkan]",
      n: "[\"n\", t] pindah kursor",
      r: "[\"r\", t, temuanLint, pemeriksaanLulus, totalPemeriksaan, errorPertama]",
      b: "[\"b\", tMulai, durasiMs] keluar jendela",
      x: "[\"x\", t, jenis] sisipan ditolak",
      t: "milidetik sejak MULAI",
    },
    attempts: save.aiTrap?.attempts ?? [],
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `codeshark-ai-trap-telemetri-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function History({
  save, canRetake, onExit, onRetake,
}: {
  save: SaveData; canRetake: boolean; onExit: () => void; onRetake: () => void;
}) {
  const attempts = useMemo(() => [...(save.aiTrap?.attempts ?? [])].reverse(), [save.aiTrap]);
  const [selected, setSelected] = useState<string | null>(attempts[0]?.id ?? null);
  const current = attempts.find((a) => a.id === selected) ?? attempts[0];
  const scenario = current ? getTrapScenario(current.scenarioId) ?? TRAP_SCENARIOS[0] : null;

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,14,26,0.88)] border-b border-[var(--line-soft)]">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2.5 flex-wrap">
          <button type="button" className="btn btn-ghost !px-3 !py-2" onClick={onExit}><IconArrowL size={16} /> Dashboard</button>
          <p className="font-display font-extrabold text-white mr-auto">Riwayat Simulasi Krisis Produksi</p>
          <button type="button" className="btn btn-ghost !px-3 !py-2 text-sm" onClick={() => downloadTelemetry(save)} disabled={!attempts.length}>
            Unduh telemetri (JSON)
          </button>
          {canRetake && (
            <button type="button" className="btn btn-coral !px-4 !py-2 text-sm" onClick={onRetake}><IconRetry size={15} /> Ulangi simulasi</button>
          )}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {attempts.length === 0 ? (
          <div className="panel p-8 text-center">
            <p className="text-[var(--dim)]">Belum ada percobaan yang tersimpan.</p>
          </div>
        ) : (
          <>
            <section className="panel p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[var(--faint)] mb-2.5">
                {attempts.length} percobaan tersimpan • terbaru di atas
              </p>
              <ul className="space-y-1.5">
                {attempts.map((a, i) => {
                  const sc = getTrapScenario(a.scenarioId);
                  const on = a.id === current?.id;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        className="trap-history-row"
                        data-on={on}
                        aria-current={on}
                        onClick={() => { sfx.click(); setSelected(a.id); }}
                      >
                        <span className="font-code text-[12px] text-[var(--faint)] w-7 shrink-0">#{attempts.length - i}</span>
                        <span className="text-sm text-[var(--ink)] mr-auto text-left">
                          {dateLabel(a.at)} <span className="text-[var(--faint)]">• {sc?.title ?? a.scenarioId}</span>
                        </span>
                        <span className="chip">{a.fixed.length}/{a.trapTotal} cacat</span>
                        <span className="chip">{Math.round(a.durationMs / 1000)} dtk</span>
                        <span className="chip" style={{ color: OUTCOME_COLOR[a.outcome] }}>{OUTCOME_LABEL[a.outcome]}</span>
                        <span className="chip">{a.log ? "rekaman ada" : "tanpa rekaman"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
            {current && scenario && <AiTrapDiagnostic key={current.id} attempt={current} scenario={scenario} />}
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
  /** datang dari gerbang (wajib) — tanpa tombol kembali, ada tautan penundaan */
  gated: boolean;
  /** gerbang mana yang mengalihkan ke sini: pintu masuk CodeShark atau latihan pertama */
  gate?: "entry" | "practice";
  /** tautan keluar ke hub; hanya ditampilkan di gerbang masuk */
  hubHref?: string;
  /** perangkat sentuh tidak boleh memulai simulasi (data tidak sahih) */
  isTouch: boolean;
  continueLabel: string;
  onRecord: (attempt: AiTrapAttempt) => void;
  onDefer: () => void;
  onContinue: () => void;
  onExit: () => void;
  onRetake: () => void;
}

export default function AiTrapModule({
  save, mode, gated, gate = "practice", hubHref, isTouch, continueLabel, onRecord, onDefer, onContinue, onExit, onRetake,
}: Props) {
  const [scenario] = useState(() => pickTrapScenario(save.aiTrap?.attempts.at(-1)?.scenarioId));
  const [step, setStep] = useState<"brief" | "count" | "play" | "diag">("brief");
  const [confidence, setConfidence] = useState(0);
  const [count, setCount] = useState(3);
  const [attempt, setAttempt] = useState<AiTrapAttempt | null>(null);

  useEffect(() => {
    if (step !== "count") return;
    if (count === 0) {
      sfx.go();
      setStep("play");
      return;
    }
    sfx.count();
    const t = window.setTimeout(() => setCount((c) => c - 1), 800);
    return () => window.clearTimeout(t);
  }, [step, count]);

  useEffect(() => {
    if (step === "diag") window.scrollTo(0, 0);
  }, [step]);

  if (mode === "history") {
    return <History save={save} canRetake={!isTouch} onExit={onExit} onRetake={onRetake} />;
  }

  if (step === "brief") {
    return (
      <Briefing
        scenario={scenario}
        gated={gated}
        gate={gate}
        hubHref={hubHref}
        onStart={(c) => { sfx.click(); setConfidence(c); setCount(3); setStep("count"); }}
        onDefer={onDefer}
        onExit={onExit}
      />
    );
  }

  if (step === "count") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(20,5,8,0.9)]">
        <div className="text-center">
          <p className="text-sm font-extrabold tracking-[0.3em] uppercase text-[var(--coral)] mb-3">Mengambil alih insiden</p>
          <div key={count} className="font-display font-extrabold text-8xl md:text-9xl text-white count-pop">{count}</div>
        </div>
      </div>
    );
  }

  if (step === "play") {
    return (
      <TrapArena
        scenario={scenario}
        confidence={confidence}
        onFinish={(a) => { onRecord(a); setAttempt(a); setStep("diag"); }}
      />
    );
  }

  return (
    <div className="relative z-10 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-6">
        {attempt && <AiTrapDiagnostic attempt={attempt} scenario={scenario} onContinue={onContinue} continueLabel={continueLabel} />}
      </main>
    </div>
  );
}
