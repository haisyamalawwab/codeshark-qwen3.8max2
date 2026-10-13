/* Peta Pertemuan 16× — silabus + tiga sesi ketik per pertemuan (Quest · Drill · Juggling).
   Status & gating berasal dari lib/progress.ts (satu sumber aturan). */
import { useState } from "react";
import { CURRICULUM, PHASE_COLOR, getLesson } from "../data/curriculum";
import type { Lesson } from "../data/curriculum";
import type { Block, Slide } from "../data/modules";
import { getSession, questId, juggleSource, LESSON_LANG } from "../data/quests";
import type { SessionKind } from "../data/quests";
import type { SaveData } from "../lib/storage";
import { meetingLevel, meetingUnlocked, sessionPassed, LEVEL_NAME, totalMeetings } from "../lib/progress";
import { sfx } from "../lib/audio";
import { tokenize } from "../lib/highlight";
import { IconX, IconBook, IconKeyboard, IconLock, IconCheck, IconArrowL, IconArrowR, IconStar } from "./icons";

interface Props {
  save: SaveData;
  startNo: number;
  onClose: () => void;
  /** buka materi .md (hanya pertemuan HTML) */
  onMateri: (no: number) => void;
  onPlay: (no: number, kind: Exclude<SessionKind, "misi">) => void;
}

const KINDS: { kind: Exclude<SessionKind, "misi">; label: string; hint: string }[] = [
  { kind: "quest", label: "Quest", hint: "Kode utuh pertemuan ini" },
  { kind: "drill", label: "Drill", hint: "Baris pendek sintaks inti" },
  { kind: "juggle", label: "Juggling", hint: "Drill dianyam dengan pertemuan sebelumnya" },
];

/* ---------- renderer blok materi ---------- */
function CodeBlock({ b }: { b: Extract<Block, { t: "code" }> }) {
  const lines = tokenize(b.code, b.lang);
  return (
    <div className="rounded-xl border border-[rgba(126,196,236,0.16)] bg-[rgba(4,14,26,0.75)] overflow-hidden">
      <pre className="px-4 py-3 text-[13px] leading-relaxed overflow-x-auto code-scroll font-mono">
        {lines.map((ln, i) => (
          <div key={i}>
            {ln.map((tk, j) => <span key={j} className={tk.cls}>{tk.ch}</span>)}
            {ln.length === 0 && "\u00A0"}
          </div>
        ))}
      </pre>
      {b.caption && <p className="px-4 pb-2.5 text-[11px] text-[var(--faint)] italic">{b.caption}</p>}
    </div>
  );
}

/** kuis interaktif: pilih jawaban → langsung tahu benar/salah + penjelasan */
function QuizBlock({ b, color }: { b: Extract<Block, { t: "quiz" }>; color: string }) {
  const [pick, setPick] = useState<number | null>(null);
  const ok = pick === b.answer;
  return (
    <div className="rounded-xl border p-4 space-y-2.5" style={{ borderColor: `${color}55`, background: `${color}0d` }}>
      <p className="text-xs font-extrabold tracking-wider uppercase" style={{ color }}>Cek paham</p>
      <p className="text-sm font-semibold text-[#bfe0f5]">{b.q}</p>
      <div className="grid gap-1.5">
        {b.options.map((o, i) => {
          const chosen = pick === i;
          const cls = pick === null
            ? "border-[rgba(126,196,236,0.18)] text-[var(--dim)] hover:bg-white/5"
            : i === b.answer
              ? "border-[rgba(46,230,200,0.6)] text-[var(--teal)]"
              : chosen ? "border-[rgba(255,107,87,0.6)] text-[var(--coral)]" : "border-[rgba(126,196,236,0.1)] text-[var(--faint)]";
          return (
            <button key={i} disabled={pick !== null}
              onClick={() => { setPick(i); if (i === b.answer) sfx.quizOk(); }}
              className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${cls}`}>
              {o}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <p className={`text-[12px] leading-relaxed ${ok ? "text-[var(--teal)]" : "text-[var(--coral)]"}`}>
          {ok ? "Benar! " : "Belum tepat. "}{b.explain}
        </p>
      )}
    </div>
  );
}

function Blocks({ blocks, color }: { blocks: Block[]; color: string }) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.t === "p") return <p key={i} className="text-sm leading-relaxed text-[#bfe0f5]">{b.text}</p>;
        if (b.t === "list") return (
          <ul key={i} className="space-y-1.5 pl-1">
            {b.items.map((it, j) => (
              <li key={j} className="text-sm text-[var(--dim)] leading-relaxed flex gap-2">
                <span style={{ color }}>▸</span><span>{it}</span>
              </li>
            ))}
          </ul>
        );
        if (b.t === "code") return <CodeBlock key={i} b={b} />;
        if (b.t === "callout") {
          const tone = b.tone === "warn" ? "#ff6b57" : b.tone === "fun" ? "#ffc247" : "#4dd9c0";
          return (
            <div key={i} className="rounded-xl px-4 py-3 border" style={{ borderColor: `${tone}44`, background: `${tone}0d` }}>
              <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: tone }}>{b.title}</p>
              <p className="text-[13px] text-[var(--dim)] mt-1 leading-relaxed">{b.text}</p>
            </div>
          );
        }
        return <QuizBlock key={i} b={b} color={color} />;
      })}
    </div>
  );
}

function SlideView({ s, color }: { s: Slide; color: string }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-extrabold tracking-[0.18em] uppercase" style={{ color }}>{s.kicker}</p>
      <h4 className="font-display font-extrabold text-lg leading-snug">{s.title}</h4>
      <Blocks blocks={s.blocks} color={color} />
    </div>
  );
}

/* ---------- kartu sesi ketik (quest / drill / juggling) ---------- */
function SessionCard({
  no, kind, label, hint, save, locked, onPlay,
}: {
  no: number; kind: Exclude<SessionKind, "misi">; label: string; hint: string;
  save: SaveData; locked: boolean; onPlay: () => void;
}) {
  const sess = getSession(questId(no, kind));
  const done = sessionPassed(save, questId(no, kind));
  const best = save.modules[questId(no, kind)]?.best;
  const src = kind === "juggle" ? juggleSource(no) : null;
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-2.5 ${done ? "border-[rgba(46,230,200,0.45)] bg-[rgba(46,230,200,0.05)]" : "border-[rgba(255,194,71,0.25)] bg-[rgba(255,194,71,0.04)]"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="font-display font-extrabold text-sm">{label}</p>
        {done ? (
          <span className="chip !text-[var(--teal)] !border-[rgba(46,230,200,0.45)]"><IconCheck size={12} /> Lulus</span>
        ) : (
          <span className="chip !text-[var(--faint)]">Target ≥ {sess?.passAcc ?? "-"}%</span>
        )}
      </div>
      <p className="text-[12px] text-[var(--dim)] leading-relaxed">{hint}{kind === "juggle" && (src !== null ? ` (P${src})` : " (balik)")}</p>
      {best && <p className="text-[11px] text-[var(--faint)]">Terbaik: {best.accuracy}% • {best.wpm} WPM • {best.stars}★</p>}
      <button
        disabled={locked}
        onClick={() => { sfx.click(); onPlay(); }}
        className="btn btn-primary !py-2 text-xs justify-center disabled:opacity-40"
      >
        {locked ? <><IconLock size={13} /> Terkunci</> : <><IconKeyboard size={14} /> {done ? "Ulangi" : "Mulai"}</>}
      </button>
    </div>
  );
}

export function Pertemuan({ save, startNo, onClose, onMateri, onPlay }: Props) {
  const [no, setNo] = useState(startNo);
  const [openSlide, setOpenSlide] = useState<number | null>(0);
  const l: Lesson = getLesson(no);
  const c = PHASE_COLOR[l.phase];
  const level = meetingLevel(save, no);
  const unlocked = meetingUnlocked(save, no);
  const passedMeetings = CURRICULUM.filter((x) => meetingLevel(save, x.no) >= 2).length;

  const go = (n: number) => {
    sfx.click();
    setNo(Math.min(totalMeetings(), Math.max(1, n)));
    setOpenSlide(0);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-8">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto code-scroll rounded-[2rem] border border-[rgba(126,196,236,0.2)] bg-[#0a2c44] shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
        {/* header */}
        <div className="sticky top-0 z-10 px-5 sm:px-7 py-4 border-b border-[rgba(126,196,236,0.14)] bg-[rgba(10,44,68,0.94)] backdrop-blur-lg flex items-center gap-3">
          <span className="chip shrink-0 !bg-[rgba(255,194,71,0.12)] !text-[#ffc247] !border-[rgba(255,194,71,0.35)]">Peta</span>
          <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-wide flex-1 min-w-0 truncate">
            Peta Pertemuan <span className="text-[var(--dim)] text-base">{passedMeetings}/{totalMeetings()} tuntas (Perak+)</span>
          </h2>
          <button className="w-9 h-9 rounded-full grid place-items-center text-[var(--dim)] hover:text-white hover:bg-white/10 transition-colors shrink-0"
            onClick={() => { sfx.back(); onClose(); }} aria-label="Tutup">
            <IconX size={18} />
          </button>
        </div>

        <div className="px-5 sm:px-7 py-5 space-y-5">
          {/* pemilih pertemuan + status */}
          <div className="flex flex-wrap gap-1.5">
            {CURRICULUM.map((x) => {
              const active = x.no === no;
              const cc = PHASE_COLOR[x.phase];
              const lv = meetingLevel(save, x.no);
              const open = meetingUnlocked(save, x.no);
              return (
                <button key={x.no} onClick={() => go(x.no)} title={`${x.title} — ${LEVEL_NAME[lv]}`}
                  className={`w-10 h-10 rounded-xl font-display font-extrabold text-sm transition-all relative ${active ? "scale-110" : "opacity-70 hover:opacity-100"}`}
                  style={{
                    background: active ? `${cc}26` : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${active ? cc : "rgba(126,196,236,0.14)"}`,
                    color: open ? (active ? cc : "var(--dim)") : "var(--faint)",
                  }}>
                  {x.no}
                  {lv > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0a2c44]" style={{ background: lv >= 3 ? "#ffc247" : lv === 2 ? "#4dd9c0" : "#7ee4ff" }} />}
                  {!open && <IconLock size={9} className="absolute -bottom-0.5 -right-0.5" />}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[var(--faint)] -mt-2">
            Titik: <span className="text-[#7ee4ff]">●</span> Perunggu (quest) · <span className="text-[#4dd9c0]">●</span> Perak (quest+drill, membuka pertemuan berikutnya) · <span className="text-[#ffc247]">●</span> Emas (+juggling)
          </p>

          {/* detail pertemuan */}
          <article className="rounded-2xl border border-[rgba(126,196,236,0.16)] bg-[rgba(255,255,255,0.03)] overflow-hidden">
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${c}, transparent)` }} />
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 flex-wrap">
                <span className="chip shrink-0" style={{ background: `${c}1d`, color: c, border: `1px solid ${c}4d` }}>
                  Pertemuan {l.no} • Tahap {l.phase} • {LEVEL_NAME[level]}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold leading-tight flex-1 min-w-[12rem]">{l.title}</h3>
              </div>
              <div className="rounded-xl px-4 py-3 border-l-4" style={{ borderColor: c, background: `${c}0c` }}>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: c }}>Tujuan pembelajaran</p>
                <p className="text-sm text-[#bfe0f5] mt-1 leading-relaxed">{l.goal}</p>
              </div>

              {!unlocked && (
                <p className="text-[12px] text-[var(--amber)] font-semibold flex items-center gap-1.5">
                  <IconLock size={12} /> Kunci: capai minimal Perak di Pertemuan {no - 1} untuk membuka pertemuan ini. Sesi di bawah tetap bisa dipelajari materinya.
                </p>
              )}

              {/* materi konsep */}
              <div className="space-y-2">
                {l.slides.map((s, i) => {
                  const open = openSlide === i;
                  return (
                    <div key={i} className="rounded-xl border border-[rgba(126,196,236,0.14)] bg-[rgba(9,30,50,0.55)] overflow-hidden">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                        onClick={() => { sfx.click(); setOpenSlide(open ? null : i); }}>
                        <span className="w-6 h-6 rounded-lg grid place-items-center text-[11px] font-display font-extrabold shrink-0"
                          style={{ background: `${c}22`, color: c }}>{i + 1}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[10px] font-bold tracking-wider uppercase" style={{ color: c }}>{s.kicker}</span>
                          <span className="block font-display font-extrabold text-sm leading-snug">{s.title}</span>
                        </span>
                        <span className="text-[var(--faint)] text-xs shrink-0">{open ? "▲" : "▼"}</span>
                      </button>
                      {open && (
                        <div className="px-4 pb-4 pt-1 screen-in">
                          <SlideView s={s} color={c} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* tiga sesi ketik */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: c }}>Misi ketik pertemuan ini</p>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {KINDS.map((k) => (
                    <SessionCard key={k.kind} no={no} kind={k.kind} label={k.label} hint={k.hint}
                      save={save} locked={!unlocked} onPlay={() => onPlay(no, k.kind)} />
                  ))}
                </div>
                <p className="text-[11px] text-[var(--faint)]">
                  Urutan yang disarankan: Quest → Drill (lulus = Perak) → Juggling (Emas). Mesin ketik: {LESSON_LANG[no] ?? "html"}.
                </p>
              </div>

              {/* materi .md — hanya tersedia untuk tahap HTML */}
              {l.phase === "HTML" && (
                <button className="btn btn-ghost w-full !py-2.5 text-sm justify-center" onClick={() => { sfx.click(); onMateri(no); }}>
                  <IconBook size={15} /> Buka Materi Lengkap (dokumen .md)
                </button>
              )}
            </div>
          </article>

          {/* navigasi */}
          <div className="flex justify-between gap-3">
            <button className="btn btn-ghost !py-2 text-xs" onClick={() => go(no - 1)} disabled={no === 1} style={{ opacity: no === 1 ? 0.4 : 1 }}>
              <IconArrowL size={14} /> {no > 1 ? `Pertemuan ${no - 1}` : "Awal"}
            </button>
            <span className="self-center text-[11px] font-bold text-[var(--faint)]">{no} / {totalMeetings()}</span>
            <button className="btn btn-ghost !py-2 text-xs" onClick={() => go(no + 1)} disabled={no === totalMeetings()} style={{ opacity: no === totalMeetings() ? 0.4 : 1 }}>
              {no < totalMeetings() ? `Pertemuan ${no + 1}` : "Selesai"} <IconArrowR size={14} />
            </button>
          </div>

          {/* daftar ringkas */}
          <details className="rounded-xl border border-[rgba(126,196,236,0.14)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
            <summary className="cursor-pointer text-sm font-bold text-[#bfe0f5] select-none">Daftar ringkas {totalMeetings()} pertemuan</summary>
            <ol className="mt-3 space-y-1">
              {CURRICULUM.map((x) => {
                const xc = PHASE_COLOR[x.phase];
                const lv = meetingLevel(save, x.no);
                return (
                  <li key={x.no}>
                    <button className="w-full text-left flex items-baseline gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors" onClick={() => go(x.no)}>
                      <span className="font-display font-extrabold text-sm w-6 shrink-0 text-right" style={{ color: xc }}>{x.no}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider w-8 shrink-0" style={{ color: xc }}>{x.phase}</span>
                      <span className="text-sm text-[#bfe0f5] font-semibold flex-1">{x.title}</span>
                      <span className="text-[10px] font-bold text-[var(--faint)]">{LEVEL_NAME[lv]}</span>
                      {lv >= 2 && <IconStar size={12} className="text-[#ffc247] shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </details>
        </div>
      </div>
    </div>
  );
}

export default Pertemuan;
