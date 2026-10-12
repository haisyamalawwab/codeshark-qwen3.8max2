/* Peta Pertemuan 16x — silabus: HTML (P1-6) → UTS (P7) → CSS (P8-11) →
   review/jembatan (P12) → JS (P13-15) → UAS (P16). Setiap pertemuan punya
   materi konsep tersendiri + latihan ketik bertingkat sebagai ajang praktik. */
import { useState } from "react";
import { CURRICULUM, PHASE_COLOR, getLesson } from "../data/curriculum";
import type { Lesson } from "../data/curriculum";
import type { Block, Slide } from "../data/modules";
import { MODULES } from "../data/modules";
import { sfx } from "../lib/audio";
import { loadSave } from "../lib/storage";
import { tokenize } from "../lib/highlight";
import {
  IconX, IconBook, IconKeyboard, IconLock, IconCheck, IconArrowL, IconArrowR, IconStar,
} from "./icons";

interface Props {
  onClose: () => void;
  onMateri: (modId: string) => void;
  onPractice: (modId: string) => void;
}

/** modul pendamping tiap tahap/pertemuan ujian */
function companion(phase: Lesson["phase"]): { id: string; label: string } {
  switch (phase) {
    case "HTML": return { id: "h0", label: "Misi H0" };
    case "CSS": return { id: "c0", label: "Misi C0" };
    case "JS": return { id: "j0", label: "Misi J0" };
    case "UTS": return { id: "h5", label: "Rangkai Profil" };
    case "UAS": return { id: "j3", label: "Aplikasi Mini" };
  }
}

/* ---------- renderer blok materi (ringkas, gaya sama dengan Ruang Materi) ---------- */
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

function QuizBlock({ color }: { color: string }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: `${color}55`, background: `${color}0d` }}>
      <p className="text-xs font-extrabold tracking-wider uppercase" style={{ color }}>Cek paham</p>
      <input readOnly value="Soal lengkap ada di Ruang Materi →" className="w-full text-[11px] bg-transparent text-[var(--faint)] outline-none cursor-default" />
      <button className="btn btn-ghost !py-1.5 text-xs w-full justify-center" onClick={() => setPick(pick === null ? 0 : null)}>
        <IconStar size={13} /> {pick === null ? "Buka versi interaktif di Ruang Materi" : "Tutup"}
      </button>
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
        return <QuizBlock key={i} color={color} />;
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

/* ---------- panel latihan ketik per pertemuan (pratinjau + langsung main) ---------- */
function PracticePanel({ l, onPractice }: { l: Lesson; onPractice: (id: string) => void }) {
  const comp = companion(l.phase);
  const mod = MODULES.find((m) => m.id === comp.id)!;
  const [started, setStarted] = useState(false);
  const lines = tokenize(l.practice!.code, mod.lang);
  if (started) { sfx.click(); onPractice(comp.id); return null; }
  return (
    <div className="rounded-xl border border-[rgba(255,194,71,0.3)] bg-[rgba(255,194,71,0.05)] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <IconKeyboard size={16} className="text-[var(--amber)]" />
        <p className="font-display font-extrabold text-sm text-[var(--amber)]">Latihan Ketik Pertemuan {l.no}</p>
      </div>
      <p className="text-[13px] text-[var(--dim)] leading-relaxed">{l.practice!.intro}</p>
      <pre className="px-4 py-3 text-[12.5px] leading-relaxed overflow-x-auto code-scroll font-mono rounded-xl border border-[rgba(126,196,236,0.16)] bg-[rgba(4,14,26,0.75)] max-h-56">
        {lines.map((ln, i) => (
          <div key={i}>
            {ln.map((tk, j) => <span key={j} className={tk.cls}>{tk.ch}</span>)}
            {ln.length === 0 && "\u00A0"}
          </div>
        ))}
      </pre>
      <button className="btn btn-primary w-full !py-2.5 text-sm justify-center" onClick={() => setStarted(true)}>
        <IconKeyboard size={15} /> Mulai Latihan ({l.practice!.code.length} karakter)
      </button>
      <p className="text-[11px] text-[var(--faint)]">Sesi latihan memakai mesin ketik misi {comp.label} dengan kode pertemuan ini.</p>
    </div>
  );
}

export function Pertemuan({ onClose, onMateri, onPractice }: Props) {
  const [no, setNo] = useState(1);
  const [openSlide, setOpenSlide] = useState<number | null>(0);
  const save = loadSave();
  const l = getLesson(no);
  const comp = companion(l.phase);
  const c = PHASE_COLOR[l.phase];
  const compProg = save.modules[comp.id];
  const compDone = !!compProg?.best || !!compProg?.materiDone;

  const go = (n: number) => {
    sfx.click();
    setNo(Math.min(CURRICULUM.length, Math.max(1, n)));
    setOpenSlide(0);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-8">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto code-scroll rounded-[2rem] border border-[rgba(126,196,236,0.2)] bg-[#0a2c44] shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
        {/* header */}
        <div className="sticky top-0 z-10 px-5 sm:px-7 py-4 border-b border-[rgba(126,196,236,0.14)] bg-[rgba(10,44,68,0.94)] backdrop-blur-lg flex items-center gap-3">
          <span className="chip shrink-0 !bg-[rgba(255,194,71,0.12)] !text-[#ffc247] !border-[rgba(255,194,71,0.35)]">Silabus</span>
          <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-wide flex-1 min-w-0 truncate">
            Peta Pertemuan <span className="text-[var(--dim)] text-base">16×</span>
          </h2>
          <button className="w-9 h-9 rounded-full grid place-items-center text-[var(--dim)] hover:text-white hover:bg-white/10 transition-colors shrink-0"
            onClick={() => { sfx.back(); onClose(); }} aria-label="Tutup">
            <IconX size={18} />
          </button>
        </div>

        <div className="px-5 sm:px-7 py-5 space-y-5">
          {/* ringkasan struktur tahap */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {(
              [
                ["HTML", 6], ["UTS", 1], ["CSS", 4], ["JS", 4 + 1], ["UAS", 1],
              ] as const
            ).map(([ph, cnt]) => (
              <div key={ph} className="rounded-xl border border-[rgba(126,196,236,0.14)] bg-[rgba(255,255,255,0.03)] px-1 py-2">
                <p className="font-display text-xl font-extrabold" style={{ color: PHASE_COLOR[ph as Lesson["phase"]] }}>
                  {ph === "JS" ? cnt - 1 : cnt}
                </p>
                <p className="text-[9px] text-[var(--dim)] font-bold tracking-wider">{ph}{ph === "JS" ? "+" : ""}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[var(--faint)] font-medium -mt-2">
            6 pertemuan HTML + UTS + 4 CSS + 1 jembatan + 4 JS + UAS = 16 pertemuan. Semua sesi dimanfaatkan sebagai ajang latihan mengetik kode.
          </p>

          {/* pemilih pertemuan */}
          <div className="flex flex-wrap gap-1.5">
            {CURRICULUM.map((x) => {
              const active = x.no === no;
              const cc = PHASE_COLOR[x.phase];
              const xp = save.modules[companion(x.phase).id];
              const isDone = !!xp?.best || !!xp?.materiDone;
              return (
                <button key={x.no} onClick={() => go(x.no)} title={x.title}
                  className={`w-10 h-10 rounded-xl font-display font-extrabold text-sm transition-all relative ${active ? "scale-110" : "opacity-70 hover:opacity-100"}`}
                  style={{
                    background: active ? `${cc}26` : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${active ? cc : "rgba(126,196,236,0.14)"}`,
                    color: active ? cc : "var(--dim)",
                  }}>
                  {x.no}
                  {isDone && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#4dd9c0] border-2 border-[#0a2c44]" />}
                </button>
              );
            })}
          </div>

          {/* detail pertemuan */}
          <article className="rounded-2xl border border-[rgba(126,196,236,0.16)] bg-[rgba(255,255,255,0.03)] overflow-hidden">
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${c}, transparent)` }} />
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 flex-wrap">
                <span className="chip shrink-0" style={{ background: `${c}1d`, color: c, border: `1px solid ${c}4d` }}>
                  Pertemuan {l.no} • Tahap {l.phase}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold leading-tight flex-1 min-w-[12rem]">{l.title}</h3>
              </div>
              <div className="rounded-xl px-4 py-3 border-l-4" style={{ borderColor: c, background: `${c}0c` }}>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: c }}>Tujuan pembelajaran</p>
                <p className="text-sm text-[#bfe0f5] mt-1 leading-relaxed">{l.goal}</p>
              </div>

              {/* MATERI PER TAHAP — accordion slide */}
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

              {/* latihan ketik pertemuan ini */}
              {l.practice && <PracticePanel l={l} onPractice={onPractice} />}

              {/* aksi pendukung */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button className="btn btn-ghost flex-1 !py-2.5 text-sm justify-center" onClick={() => { sfx.click(); onMateri(comp.id); }}>
                  <IconBook size={15} /> Buka Konsep Lengkap ({comp.label})
                </button>
              </div>
              {!compDone && l.no > 6 && (
                <p className="text-[11px] text-[var(--amber)] font-semibold flex items-center gap-1.5">
                  <IconLock size={12} /> Alur disarankan: taklukkan dulu misi {comp.label} di Peta Misi sebelum fokus ke pertemuan ini.
                </p>
              )}
              {compDone && (
                <p className="text-[11px] text-[var(--teal)] font-semibold flex items-center gap-1.5">
                  <IconCheck size={12} /> Misi {comp.label} sudah kamu selesaikan — pertemuan ini tinggal memperdalam.
                </p>
              )}
            </div>
          </article>

          {/* navigasi prev/next */}
          <div className="flex justify-between gap-3">
            <button className="btn btn-ghost !py-2 text-xs" onClick={() => go(no - 1)} disabled={no === 1} style={{ opacity: no === 1 ? 0.4 : 1 }}>
              <IconArrowL size={14} /> {no > 1 ? `Pertemuan ${no - 1}` : "Awal"}
            </button>
            <span className="self-center text-[11px] font-bold text-[var(--faint)]">{no} / {CURRICULUM.length}</span>
            <button className="btn btn-ghost !py-2 text-xs" onClick={() => go(no + 1)} disabled={no === CURRICULUM.length} style={{ opacity: no === CURRICULUM.length ? 0.4 : 1 }}>
              {no < CURRICULUM.length ? `Pertemuan ${no + 1}` : "Selesai"} <IconArrowR size={14} />
            </button>
          </div>

          {/* daftar ringkas seluruh pertemuan */}
          <details className="rounded-xl border border-[rgba(126,196,236,0.14)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
            <summary className="cursor-pointer text-sm font-bold text-[#bfe0f5] select-none">Daftar ringkas 16 pertemuan</summary>
            <ol className="mt-3 space-y-1">
              {CURRICULUM.map((x) => {
                const xc = PHASE_COLOR[x.phase];
                const xp = save.modules[companion(x.phase).id];
                const isDone = !!xp?.best || !!xp?.materiDone;
                return (
                  <li key={x.no}>
                    <button className="w-full text-left flex items-baseline gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors" onClick={() => go(x.no)}>
                      <span className="font-display font-extrabold text-sm w-6 shrink-0 text-right" style={{ color: xc }}>{x.no}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider w-8 shrink-0" style={{ color: xc }}>{x.phase}</span>
                      <span className="text-sm text-[#bfe0f5] font-semibold flex-1">{x.title}</span>
                      {isDone && <IconCheck size={14} className="text-[#4dd9c0] shrink-0" />}
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
