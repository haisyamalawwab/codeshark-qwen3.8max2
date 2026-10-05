import { useEffect, useRef, useState } from "react";
import type { SaveData } from "../lib/storage";
import { rankOf } from "../lib/storage";
import type { AgeCfg, ModuleDef } from "../data/modules";
import { MODULES } from "../data/modules";
import { sfx } from "../lib/audio";
import {
  IconFin, IconBolt, IconCoin, IconBook, IconKeyboard, IconStar, IconStarLine,
  IconLock, IconCheck, IconArrowR, IconEye, IconRetry, IconSound, IconMute,
  IconMap, IconTarget, IconTimer, IconTrophy, IconX, IconTag, IconBrush, IconHome,
} from "./icons";
import { tokenize } from "../lib/highlight";
import { SharkMascot } from "./icons";

interface Props {
  save: SaveData;
  cfg: AgeCfg;
  onMateri: (id: string) => void;
  onPractice: (id: string) => void;
  onToggleSound: () => void;
  onResetProfile: () => void;
}

const MOD_ICON = {
  tag: IconTag,
  brush: IconBrush,
  bolt: IconBolt,
} as const;

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    el.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function Dashboard({ save, cfg, onMateri, onPractice, onToggleSound, onResetProfile }: Props) {
  const revealRef = useReveal();
  const [preview, setPreview] = useState<ModuleDef | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const profile = save.profile!;
  const rank = rankOf(save.xp);
  const doneCount = MODULES.filter((m) => (save.modules[m.id]?.completions ?? 0) > 0).length;
  const avgAcc = (() => {
    const bests = MODULES.map((m) => save.modules[m.id]?.best).filter(
      (b): b is NonNullable<typeof b> => !!b
    );
    if (!bests.length) return null;
    return Math.round(bests.reduce((a, b) => a + b.accuracy, 0) / bests.length);
  })();

  return (
    <div ref={revealRef} className="relative z-10 min-h-screen">
      {/* ============ HUD HEADER ============ */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,15,26,0.82)] border-b border-[var(--line-soft)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="w-10 h-10 rounded-xl grid place-items-center text-[var(--teal)] bg-[rgba(46,230,200,0.12)] border border-[rgba(46,230,200,0.3)] shrink-0">
            <IconFin size={24} />
          </span>
          <div className="mr-auto leading-tight">
            <p className="font-display font-extrabold tracking-wide">CODESHARK <span className="text-[var(--teal)]">ACADEMY</span></p>
            <p className="text-[11px] text-[var(--dim)] font-bold tracking-[0.18em] uppercase">Peta Misi • {cfg.label}</p>
          </div>

          <div className="chip !text-[var(--amber)]" title="Koin">
            <IconCoin size={15} /> {save.coins}
          </div>
          <div className="chip !text-[var(--teal)]" title="Experience">
            <IconBolt size={15} /> {save.xp} XP
          </div>
          <button className="btn btn-ghost !px-3 !py-2" onClick={onToggleSound} aria-label="Suara">
            {profile.sound ? <IconSound size={17} /> : <IconMute size={17} />}
          </button>
          <button className="btn btn-ghost !px-3 !py-2" onClick={() => setConfirmReset(true)} aria-label="Profil">
            <IconHome size={17} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        {/* ============ SAMBUTAN + RANK ============ */}
        <section className="panel mt-8 p-6 md:p-8 relative overflow-hidden screen-in">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full opacity-[0.13]" style={{ background: `radial-gradient(circle, ${cfg.accent}, transparent 70%)` }} />
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="hidden md:block w-36 shrink-0 anim-drift">
              <SharkMascot className="w-full" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--dim)] tracking-wide">
                {doneCount === MODULES.length ? "Semua misi selesai — luar biasa!" : "Selamat datang kembali,"}
              </p>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl mt-0.5">
                Kapten {profile.name} <span className="align-middle text-base font-bold px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--dim)]">{cfg.range}</span>
              </h1>
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span className="chip !text-[var(--accent)] relative ping-dot">
                  <IconTrophy size={15} /> Rank: {rank.cur.name}
                </span>
                {rank.next && (
                  <span className="text-xs text-[var(--dim)] font-bold">
                    {rank.next.xp - save.xp} XP lagi menuju <span className="text-[var(--ink)]">{rank.next.name}</span>
                  </span>
                )}
              </div>
              <div className="mt-3 max-w-md">
                <div className="h-3 rounded-full bg-[rgba(6,24,41,0.9)] border border-[var(--line-soft)] overflow-hidden">
                  <div
                    className="h-full rounded-full shimmer transition-all duration-700"
                    style={{ width: `${Math.max(4, rank.pct)}%`, background: `linear-gradient(90deg, var(--teal), ${cfg.accent})` }}
                  />
                </div>
              </div>
            </div>
            {/* statistik ringkas */}
            <div className="grid grid-cols-2 gap-2.5 md:w-64 shrink-0">
              {[
                { ic: <IconMap size={16} />, v: `${doneCount}/${MODULES.length}`, l: "Misi" },
                { ic: <IconTarget size={16} />, v: avgAcc === null ? "—" : `${avgAcc}%`, l: "Akurasi" },
                { ic: <IconTimer size={16} />, v: save.stats.bestWpm || "—", l: "WPM Terbaik" },
                { ic: <IconBolt size={16} />, v: save.stats.bestCombo || "—", l: "Combo Maks" },
              ].map((s, i) => (
                <div key={i} className="panel-flat px-3 py-2.5 flex items-center gap-2.5">
                  <span className="text-[var(--cyan)]">{s.ic}</span>
                  <div className="leading-tight">
                    <p className="font-display font-extrabold text-lg">{s.v}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[var(--faint)]">{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PETA MISI ============ */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-6 reveal">
            <h2 className="font-display font-extrabold text-2xl">Peta Misi Samudra</h2>
            <span className="h-px flex-1 bg-[var(--line-soft)]" />
            <span className="chip">Alur: Materi → Praktik Ketik → Preview</span>
          </div>

          <div className="relative pl-6 md:pl-10">
            <div className="dash-line absolute left-[13px] md:left-[25px] top-2 bottom-2 w-[2px]" />
            <div className="space-y-6">
              {MODULES.map((m, idx) => {
                const prog = save.modules[m.id] ?? { materiDone: false, quizXp: 0, completions: 0 };
                const prevDone = idx === 0 || (save.modules[MODULES[idx - 1].id]?.completions ?? 0) > 0;
                const unlocked = prevDone;
                const done = prog.completions > 0;
                const MIcon = MOD_ICON[m.icon];
                const stars = prog.best?.stars ?? 0;
                return (
                  <article key={m.id} className="reveal relative" style={{ transitionDelay: `${idx * 0.08}s` }}>
                    {/* node jalur */}
                    <span
                      className={`absolute -left-6 md:-left-10 top-8 w-7 h-7 md:w-9 md:h-9 rounded-full grid place-items-center font-display font-extrabold text-xs md:text-sm border-2 ${
                        done
                          ? "bg-[var(--teal)] text-[#04222b] border-[var(--teal)]"
                          : unlocked
                            ? "bg-[var(--panel2)] text-[var(--accent)] border-[var(--accent)] glow-pulse"
                            : "bg-[var(--panel)] text-[var(--faint)] border-[var(--line)]"
                      }`}
                    >
                      {done ? <IconCheck size={15} /> : m.num}
                    </span>

                    <div
                      className={`panel p-5 md:p-6 border-l-4 transition-transform duration-200 ${unlocked ? "hover:-translate-y-1" : "opacity-60 saturate-50"}`}
                      style={{ borderLeftColor: unlocked ? m.color : "var(--line)" }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <span
                          className="w-14 h-14 shrink-0 rounded-2xl grid place-items-center"
                          style={{ background: `${m.color}1f`, border: `1px solid ${m.color}55`, color: m.color }}
                        >
                          <MIcon size={28} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase" style={{ color: m.color }}>
                            Misi 0{m.num} • {m.lang.toUpperCase()}
                          </p>
                          <h3 className="font-display font-extrabold text-xl md:text-2xl leading-tight">{m.title}</h3>
                          <p className="text-sm text-[var(--dim)]">{m.subtitle}</p>

                          {/* status chips */}
                          <div className="flex items-center gap-2 flex-wrap mt-2.5">
                            <span className={`chip ${prog.materiDone ? "!text-[var(--teal)]" : ""}`}>
                              {prog.materiDone ? <IconCheck size={13} /> : <IconBook size={13} />} Materi
                            </span>
                            <span className={`chip ${done ? "!text-[var(--amber)]" : ""}`}>
                              <IconKeyboard size={13} /> Praktik {done ? "✓" : ""}
                            </span>
                            {done && prog.best && (
                              <>
                                <span className="chip !text-[var(--amber)]" title="Bintang">
                                  {Array.from({ length: 3 }, (_, i) =>
                                    i < stars ? <IconStar key={i} size={13} /> : <IconStarLine key={i} size={13} className="opacity-40" />
                                  )}
                                </span>
                                <span className="chip">{prog.best.score} poin</span>
                                <span className="chip !text-[var(--cyan)]">{prog.best.wpm} WPM</span>
                              </>
                            )}
                            {!unlocked && (
                              <span className="chip !text-[var(--faint)]">
                                <IconLock size={13} /> Selesaikan Misi 0{m.num - 1} dulu
                              </span>
                            )}
                          </div>
                        </div>

                        {/* aksi */}
                        <div className="flex md:flex-col gap-2.5 shrink-0">
                          {!unlocked ? (
                            <button className="btn btn-ghost px-5 py-2.5" disabled>
                              <IconLock size={16} /> Terkunci
                            </button>
                          ) : !prog.materiDone ? (
                            <button className="btn btn-primary px-5 py-2.5" onClick={() => { sfx.click(); onMateri(m.id); }}>
                              <IconBook size={17} /> Pelajari Materi <IconArrowR size={17} />
                            </button>
                          ) : (
                            <>
                              <button
                                className={`btn px-5 py-2.5 ${done ? "btn-ghost" : "btn-primary glow-pulse"}`}
                                onClick={() => { sfx.click(); onPractice(m.id); }}
                              >
                                <IconKeyboard size={17} /> {done ? "Ulangi Praktik" : "Mulai Praktik Ketik"}
                              </button>
                              <div className="flex gap-2.5">
                                <button className="btn btn-ghost px-4 py-2 flex-1 text-sm" onClick={() => { sfx.click(); onMateri(m.id); }}>
                                  <IconRetry size={15} /> Materi
                                </button>
                                {done && (
                                  <button className="btn btn-amber px-4 py-2 flex-1 text-sm" onClick={() => { sfx.click(); setPreview(m); }}>
                                    <IconEye size={15} /> Preview
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-[var(--faint)] mt-14 reveal">
          CodeShark Academy v0.1 (MVP) — progres tersimpan di localStorage perangkatmu. Upgrade berikutnya: lebih banyak misi, mode tantangan harian, dan papan peringkat.
        </p>
      </main>

      {/* ============ MODAL PREVIEW ============ */}
      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(2,9,17,0.8)] backdrop-blur-sm screen-in" onClick={() => setPreview(null)}>
          <div className="panel w-full max-w-3xl overflow-hidden anim-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line-soft)]">
              <span className="flex gap-1.5">
                <i className="w-3 h-3 rounded-full bg-[#ff6b57] inline-block" />
                <i className="w-3 h-3 rounded-full bg-[#ffc247] inline-block" />
                <i className="w-3 h-3 rounded-full bg-[#2ee6c8] inline-block" />
              </span>
              <span className="font-code text-xs text-[var(--dim)] bg-[rgba(6,24,41,0.8)] rounded-md px-3 py-1 ml-2 flex-1 truncate">
                preview://hasil-kode/{preview.id}
              </span>
              <button className="btn btn-ghost !p-2" onClick={() => setPreview(null)} aria-label="Tutup">
                <IconX size={16} />
              </button>
            </div>
            <iframe
              title={`Preview ${preview.title}`}
              srcDoc={preview.preview(preview.code)}
              sandbox="allow-scripts"
              className="w-full h-[60vh] bg-white block"
            />
            <div className="px-4 py-3 text-xs text-[var(--dim)] font-semibold border-t border-[var(--line-soft)]">
              Inilah halaman yang kodenya kamu ketik di misi {preview.title}. {preview.lang === "js" && "Coba klik tombolnya!"}
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL RESET ============ */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(2,9,17,0.8)] backdrop-blur-sm screen-in" onClick={() => setConfirmReset(false)}>
          <div className="panel w-full max-w-sm p-6 text-center anim-pop" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto rounded-full grid place-items-center bg-[rgba(255,107,87,0.15)] text-[var(--coral)] border border-[rgba(255,107,87,0.4)]">
              <IconX size={22} />
            </div>
            <h3 className="font-display font-extrabold text-xl mt-4">Ganti profil & hapus progres?</h3>
            <p className="text-sm text-[var(--dim)] mt-2">
              Semua XP, koin, bintang, dan progres misi di perangkat ini akan dihapus permanen.
            </p>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-ghost flex-1 py-2.5" onClick={() => setConfirmReset(false)}>Batal</button>
              <button className="btn btn-coral flex-1 py-2.5" onClick={onResetProfile}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Panel kode dengan penomoran baris — dipakai juga oleh layar hasil. */
export function CodePanel({ code, lang, caption }: { code: string; lang: "html" | "css" | "js"; caption?: string }) {
  const lines = tokenize(code, lang);
  return (
    <figure className="my-4 rounded-xl overflow-hidden border border-[var(--line)] bg-[rgba(4,17,30,0.85)]">
      <figcaption className="flex items-center gap-2 px-4 py-2 border-b border-[var(--line-soft)] bg-[rgba(10,38,62,0.5)]">
        <span className="flex gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-[#ff6b57] inline-block" />
          <i className="w-2.5 h-2.5 rounded-full bg-[#ffc247] inline-block" />
          <i className="w-2.5 h-2.5 rounded-full bg-[#2ee6c8] inline-block" />
        </span>
        <span className="font-code text-[11px] uppercase tracking-widest text-[var(--faint)]">{lang}</span>
        {caption && <span className="text-xs text-[var(--dim)] ml-auto hidden sm:block">{caption}</span>}
      </figcaption>
      <div className="overflow-x-auto code-scroll py-3">
        <pre className="font-code text-sm leading-[1.75] min-w-max">
          {lines.map((toks, i) => (
            <div key={i} className="flex px-4 hover:bg-[rgba(69,198,255,0.05)]">
              <span className="w-7 shrink-0 text-right mr-4 text-[var(--faint)] select-none">{i + 1}</span>
              <code>
                {toks.length === 0 ? "\u00A0" : toks.map((t, j) => (
                  <span key={j} className={t.cls}>{t.ch}</span>
                ))}
              </code>
            </div>
          ))}
        </pre>
      </div>
      {caption && <p className="px-4 pb-3 text-xs text-[var(--dim)] sm:hidden">{caption}</p>}
    </figure>
  );
}
