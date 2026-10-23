import { useSiteSettings, Unavailable } from "../lib/siteSettings";
/* Peta Pertemuan 16× — silabus + tiga sesi ketik per pertemuan (Quest · Drill · Juggling).
   Status & gating berasal dari lib/progress.ts (satu sumber aturan). */
import { useEffect, useState } from "react";
import { CURRICULUM, PHASE_COLOR, getLesson } from "../data/curriculum";
import type { Lesson } from "../data/curriculum";
import type { Block, Slide } from "../data/modules";
import { getSession, questId, juggleSource, LESSON_LANG, TUGAS_PERTEMUAN } from "../data/quests";
import type { SessionKind } from "../data/quests";
import type { SaveData } from "../lib/storage";
import { meetingLevel, meetingUnlocked, sessionPassed, LEVEL_NAME, totalMeetings } from "../lib/progress";
import { sfx } from "../lib/audio";
import { tokenize } from "../lib/highlight";
import { SUBGAMES } from "../data/subgames";
import type { SubGameId } from "../data/subgames";
import { IconBook, IconKeyboard, IconTower, IconLock, IconCheck, IconArrowL, IconArrowR, IconStar } from "./icons";
import { StationArt, stationFor } from "../graphics/stations";
import WebTrioAnalogyArt from "./WebTrioAnalogyArt";
import HtmlStructureDiagram from "./HtmlStructureDiagram";
import CssFlexboxDiagram from "./CssFlexboxDiagram";
import JsDomInteractiveDiagram from "./JsDomInteractiveDiagram";

interface Props {
  save: SaveData;
  startNo: number;
  /** arena yang sedang aktif (dipilih di hub) */
  subGame?: SubGameId;
  onExit: () => void;
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
        if (b.t === "diagram") {
          return (
            <div key={i} className="my-2">
              {b.kind === "trio" && <WebTrioAnalogyArt interactive={false} />}
              {b.kind === "html-dom" && <HtmlStructureDiagram />}
              {b.kind === "css-flexbox" && <CssFlexboxDiagram />}
              {b.kind === "js-events" && <JsDomInteractiveDiagram />}
              {b.caption && <p className="text-[11px] text-[var(--faint)] italic mt-1">{b.caption}</p>}
            </div>
          );
        }
        if (b.t === "quiz") {
          return <QuizBlock key={i} b={b} color={color} />;
        }
        return null;
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
  no, kind, label, hint, save, locked, subGame, onPlay,
}: {
  no: number; kind: Exclude<SessionKind, "misi">; label: string; hint: string;
  save: SaveData; locked: boolean; subGame: SubGameId; onPlay: () => void;
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
        {locked ? <><IconLock size={13} /> Terkunci</> : subGame === "tower"
          ? <><IconTower size={14} /> {done ? "Ulangi Susun" : "Susun"}</>
          : <><IconKeyboard size={14} /> {done ? "Ulangi Ketik" : "Ketik"}</>}
      </button>
    </div>
  );
}

export function Pertemuan({ save, startNo, subGame = "shark", onExit, onMateri, onPlay }: Props) {
  const settings = useSiteSettings();
  const [no, setNo] = useState(startNo);
  const [openSlide, setOpenSlide] = useState<number | null>(0);
  const l: Lesson = getLesson(no);
  const c = PHASE_COLOR[l.phase];
  const level = meetingLevel(save, no);
  const unlocked = meetingUnlocked(save, no);
  const passedMeetings = CURRICULUM.filter((x) => meetingLevel(save, x.no) >= 2).length;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const go = (n: number) => {
    sfx.click();
    setNo(Math.min(totalMeetings(), Math.max(1, n)));
    setOpenSlide(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!settings.modules[LESSON_LANG[no]]) return <Unavailable message="Modul pertemuan ini dinonaktifkan admin." retry={onExit} />;
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* topbar halaman khusus — bukan modal */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,15,26,0.85)] border-b border-[var(--line-soft)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button className="btn btn-ghost !px-3 !py-2" onClick={() => { sfx.back(); onExit(); }} aria-label="Kembali ke beranda">
            <IconArrowL size={17} />
          </button>
          <div className="leading-tight mr-auto min-w-0">
            <p className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-[var(--amber)]">
              {SUBGAMES[subGame].name} • {passedMeetings}/{totalMeetings()} tuntas (Perak+)
            </p>
            <p className="font-display font-bold truncate">Peta Pertemuan 16×</p>
          </div>
          <span className="chip shrink-0">P{no}/{totalMeetings()}</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-5 screen-in">
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
          <article className="cv-auto rounded-2xl border border-[rgba(126,196,236,0.16)] bg-[rgba(255,255,255,0.03)] overflow-hidden">
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${c}, transparent)` }} />
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 flex-wrap">
                <span className="chip shrink-0" style={{ background: `${c}1d`, color: c, border: `1px solid ${c}4d` }}>
                  Pertemuan {l.no} • Tahap {l.phase} • {LEVEL_NAME[level]}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold leading-tight flex-1 min-w-[12rem]">{l.title}</h3>
                <figure className="ml-auto text-center shrink-0" title={stationFor(l.no).label}>
                  <StationArt no={l.no} width={104} />
                  <figcaption className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-[var(--faint)] mt-1">{stationFor(l.no).label}</figcaption>
                </figure>
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

              {/* tiga sesi — dimainkan sesuai arena aktif */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: c }}>
                  Misi {SUBGAMES[subGame].short} pertemuan ini
                </p>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {KINDS.map((k) => (
                    <SessionCard key={k.kind} no={no} kind={k.kind} label={k.label} hint={k.hint}
                      save={save} locked={!unlocked} subGame={subGame} onPlay={() => onPlay(no, k.kind)} />
                  ))}
                </div>
                <p className="text-[11px] text-[var(--faint)]">
                  Urutan yang disarankan: Quest → Drill (lulus = Perak) → Juggling (Emas). Bahasa: {LESSON_LANG[no] ?? "html"}.
                  Arena aktif: <strong className="text-[var(--teal)]">{SUBGAMES[subGame].name}</strong> ({SUBGAMES[subGame].tagline}) — ganti di hub utama atau banner layar permainan.
                </p>
              </div>

              {/* tugas mandiri (produk) */}
              {TUGAS_PERTEMUAN[no] && (
                <div className="rounded-xl px-4 py-3 border" style={{ borderColor: `${c}55`, background: `${c}0d` }}>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: c }}>Tugas mandiri (produk)</p>
                  <p className="text-sm text-[#bfe0f5] mt-1 leading-relaxed">{TUGAS_PERTEMUAN[no].tugas}</p>
                  <p className="text-[11px] text-[var(--faint)] mt-1">Quest: {TUGAS_PERTEMUAN[no].quest}</p>
                </div>
              )}

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
      </main>
    </div>
  );
}

export default Pertemuan;
