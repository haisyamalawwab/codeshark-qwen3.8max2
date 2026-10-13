/* CODING TOWER — puzzle susun blok HTML berpasangan dengan menara builder.
   Tiap lantai benar = satu lantai menara + halaman HTML ikut terbentuk (live preview).
   Level per pertemuan diatur di data/towerLevels.ts — makin jauh makin sulit:
   tahap dipecah, pengecoh disisipkan, ancaman naik, jatah petunjuk menipis.
   Menghasilkan GameResult yang sama dengan TypingGame (satu pintu XP/progres). */
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { AgeCfg } from "../data/modules";
import type { Session } from "../data/quests";
import type { GameResult } from "./TypingGame";
import { toBlocks, shuffled, floorWidth } from "../lib/puzzle";
import {
  getTowerLevel, buildStages, decoysPerStage, extractTag, tagColor,
} from "../data/towerLevels";
import { tokenizeLine } from "../lib/highlight";
import { sfx } from "../lib/audio";
import { scene } from "../graphics/scene";
import { DndContext, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import TowerPhysicsCanvas from "../games/tower/TowerPhysicsCanvas";
import {
  IconX, IconHeart, IconBolt, IconTimer, IconPause, IconPlay, IconRetry,
  IconMap, IconFin, IconTarget, IconCheck, IconEye, IconArrowR,
} from "./icons";
import { SharkMascot, Diver } from "../characters";

interface Props {
  mod: Session;
  cfg: AgeCfg;
  onDone: (r: GameResult) => void;
  onExit: () => void;
}

type Status = "brief" | "count" | "play" | "pause" | "won" | "dead";

interface BankItem {
  id: number;
  text: string;
  decoy: boolean;
}

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* Blok bank yang bisa di-drag (dnd-kit) + tetap bisa di-ketuk (fallback HP/mouse).
   Drag ke menara = sama dengan ketuk: memanggil onTap bila di-drop di shaft. */
function DragBlock({ item, disabled, children, onTap }: { item: BankItem; disabled: boolean; children: ReactNode; onTap: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id, disabled });
  const style: CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50, opacity: 0.92 }
    : {};
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button onClick={onTap} disabled={disabled} className={`w-full text-left ${isDragging ? "ring-2 ring-[var(--amber)]" : ""}`} style={{ all: "unset", display: "block", width: "100%" }}>
        <span className="block">{children}</span>
      </button>
    </div>
  );
}

function ShaftDrop({ children }: { children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: "shaft" });
  return (
    <div ref={setNodeRef} className={isOver ? "outline-2 outline-dashed outline-[var(--amber)] rounded-xl" : ""}>
      {children}
    </div>
  );
}

export default function TowerPuzzle({ mod, cfg, onDone, onExit }: Props) {
  const level = useMemo(() => getTowerLevel(mod.num), [mod.num]);
  const blocks = useMemo(() => toBlocks(mod.code), [mod.code]);
  const stages = useMemo(() => buildStages(blocks, level.stageSize), [blocks, level.stageSize]);
  const stageDecoys = useMemo(
    () => decoysPerStage(level.decoys.slice(0, level.decoyCount), stages.length),
    [level, stages.length]
  );
  const isHtml = mod.lang === "html";

  const offsetOf = (stage: number) => stages.slice(0, stage).reduce((a, s) => a + s.length, 0);

  const makeBank = (stage: number, placedArr: string[]): BankItem[] => {
    const offset = stages.slice(0, stage).reduce((a, s) => a + s.length, 0);
    const k = Math.min(stages[stage]?.length ?? 0, Math.max(0, placedArr.length - offset));
    const remaining = (stages[stage] ?? []).slice(k);
    let n = 1000 + stage * 500 + k * 37;
    const rand = () => { n = (n * 1103515245 + 12345) & 0x7fffffff; return n / 0x7fffffff; };
    void rand;
    const items: BankItem[] = [
      ...remaining.map((text, i) => ({ id: stage * 1000 + k * 50 + i, text, decoy: false })),
      ...(stageDecoys[stage] ?? []).map((text, i) => ({ id: stage * 1000 + 900 + i, text, decoy: true })),
    ];
    return shuffled(items);
  };

  const [bank, setBank] = useState<BankItem[]>(() => makeBank(0, []));
  const [placed, setPlaced] = useState<string[]>([]);
  const [stageIdx, setStageIdx] = useState(0);
  const [status, setStatus] = useState<Status>("brief");
  const [count, setCount] = useState(3);
  const [showGo, setShowGo] = useState(false);
  const [view, setView] = useState<"tower" | "page">("tower");
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [score, setScore] = useState(0);
  const [threat, setThreat] = useState(0);
  const [lives, setLives] = useState(3);
  const [missed, setMissed] = useState<Record<string, number>>({});
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [hintId, setHintId] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState(0);
  const [toast, setToast] = useState<{ id: number; txt: string } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const state = useRef({ startAt: 0, pauseAt: 0, pauseAccum: 0 });
  const idRef = useRef(100000);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  /* sensor drag: mouse butuh jarak 6px, sentuh butuh tahan 180ms agar scroll tetap enak */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } })
  );

  let threatRate = cfg.threatRate * level.threat;
  if (mod.kind === "drill") threatRate *= 0.8;
  if (mod.kind === "juggle") threatRate *= 1.25;

  const nextText = placed.length < blocks.length ? blocks[placed.length] : null;
  const nextTag = nextText ? extractTag(nextText) : "";
  const progress = blocks.length ? (placed.length / blocks.length) * 100 : 0;

  useEffect(() => {
    scene.active = true;
    return () => { scene.active = false; scene.threat = 0; scene.progress = 0; };
  }, []);
  scene.threat = status === "dead" ? 100 : threat;
  scene.progress = progress / 100;

  const elapsedSec = () => {
    const st = state.current;
    if (!st.startAt) return 0;
    const now = status === "pause" ? st.pauseAt : performance.now();
    return Math.max(0, now - st.startAt - st.pauseAccum) / 1000;
  };

  /* countdown — timer sembunyi GO dipisah agar tidak ikut dibatalkan
     saat status pindah count -> play (cleanup effect di bawah sebelumnya
     meng-clearTimeout timer GO sehingga overlay nyangkut selamanya). */
  useEffect(() => {
    if (status !== "count") return;
    if (count === 0) {
      state.current.startAt = performance.now();
      setStatus("play");
      sfx.go();
      setShowGo(true);
      return;
    }
    sfx.count();
    const t = window.setTimeout(() => setCount((c) => c - 1), 800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, status]);

  useEffect(() => {
    if (!showGo) return;
    const t = window.setTimeout(() => setShowGo(false), 850);
    return () => window.clearTimeout(t);
  }, [showGo]);

  /* ancaman hiu */
  useEffect(() => {
    const iv = window.setInterval(() => {
      if (status !== "play") return;
      setThreat((th) => {
        const nx = Math.min(100, th + threatRate);
        if (nx >= 100) hurt();
        return nx >= 100 ? 0 : nx;
      });
    }, 100);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, threatRate]);

  /* auto-pause */
  useEffect(() => {
    const autoPause = () => {
      if (status !== "play") return;
      state.current.pauseAt = performance.now();
      setStatus("pause");
    };
    const onVis = () => { if (document.hidden) autoPause(); };
    window.addEventListener("blur", autoPause);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("blur", autoPause);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const hurt = () => {
    setLives((l) => {
      const nl = l - 1;
      if (nl <= 0) {
        setStatus("dead");
        sfx.lose();
        return 0;
      }
      return nl;
    });
    setThreat(0);
    setCombo(0);
    setFlash((f) => f + 1);
    sfx.hurt();
  };

  const win = (finalPlaced: string[], finalScore: number, finalCorrect: number) => {
    setStatus("won");
    sfx.win();
    const total = finalCorrect + errors;
    const acc = total > 0 ? Math.round((finalCorrect / total) * 100) : 100;
    const t = Math.max(5, elapsedSec());
    const wpm = Math.round((finalPlaced.join("\n").length || 1) / 5 / (t / 60));
    const stars = acc >= 95 ? 3 : acc >= 85 ? 2 : 1;
    const r: GameResult = {
      won: true, score: finalScore, accuracy: acc, wpm, maxCombo: Math.max(maxCombo, combo),
      stars, timeSec: Math.round(t), correct: finalCorrect, errors, missed: { ...missed },
    };
    window.setTimeout(() => onDoneRef.current(r), 1600);
  };

  const popToast = (txt: string) => {
    const id = ++idRef.current;
    setToast({ id, txt });
    window.setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 1200);
  };

  const tap = (item: BankItem) => {
    if (status !== "play" || nextText === null) return;
    if (!item.decoy && item.text === nextText) {
      const nc = combo + 1;
      setCombo(nc);
      setMaxCombo((m) => Math.max(m, nc));
      const gain = Math.round(22 * (1 + Math.min(nc, 60) * 0.03));
      const ns = score + gain;
      const nCorrect = correct + 1;
      const nPlaced = [...placed, item.text];
      setScore(ns);
      setCorrect(nCorrect);
      setPlaced(nPlaced);
      setThreat((th) => Math.max(0, th - cfg.relief * 0.8));
      sfx.key(nc);
      if (nc % 5 === 0) sfx.star();
      if (isHtml) setView((v) => v); // preview ikut bertambah otomatis
      const offset = offsetOf(stageIdx);
      const inStage = nPlaced.length - offset;
      if (inStage >= (stages[stageIdx]?.length ?? 0)) {
        if (stageIdx + 1 >= stages.length) {
          setBank([]);
          win(nPlaced, ns, nCorrect);
        } else {
          sfx.line();
          popToast(`Tahap ${stageIdx + 1} selesai! 🎉`);
          const nx = stageIdx + 1;
          setStageIdx(nx);
          setBank(makeBank(nx, nPlaced));
        }
      } else {
        setBank((b) => b.filter((x) => x.id !== item.id));
        if (nPlaced.length % 4 === 0) {
          sfx.line();
          popToast(cfg.cheers[(nPlaced.length / 4 | 0) % cfg.cheers.length]);
        }
      }
      if (nPlaced.length >= blocks.length && stageIdx + 1 >= stages.length) {
        /* pengaman ganda bila tahap terakhir berimpit */
      }
    } else {
      const ne = errors + 1;
      setErrors(ne);
      setCombo(0);
      setThreat((th) => Math.min(100, th + cfg.missPenalty));
      const key = item.text.slice(0, 24) || "(blok)";
      setMissed((m) => ({ ...m, [key]: (m[key] ?? 0) + 1 }));
      sfx.err();
      setShake((s) => s + 1);
      setWrongId(item.id);
      window.setTimeout(() => setWrongId((w) => (w === item.id ? null : w)), 420);
      setThreat((th) => {
        if (th >= 100) {
          hurt();
          return 0;
        }
        return th;
      });
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    if (status !== "play") return;
    if (e.over?.id !== "shaft") return;
    const item = bank.find((b) => b.id === e.active.id);
    if (item) tap(item);
  };

  const undo = () => {
    if (status !== "play" || placed.length === 0) return;
    const nPlaced = placed.slice(0, -1);
    setPlaced(nPlaced);
    setCorrect((c) => Math.max(0, c - 1));
    setCombo(0);
    // kembali ke tahap pemilik lantai tersebut
    let acc = 0;
    let ns = 0;
    for (let i = 0; i < stages.length; i++) {
      if (nPlaced.length >= acc + stages[i].length) { acc += stages[i].length; ns = i + 1; }
      else break;
    }
    ns = Math.min(ns, stages.length - 1);
    setStageIdx(ns);
    setBank(makeBank(ns, nPlaced));
    sfx.click();
  };

  const hint = () => {
    if (status !== "play" || nextText === null || hintsUsed >= level.hintLimit) return;
    const found = bank.find((b) => !b.decoy && b.text === nextText);
    if (!found) return;
    setHintsUsed((h) => h + 1);
    setHintId(found.id);
    setThreat((th) => Math.min(99, th + level.hintCost));
    sfx.quizOk();
    window.setTimeout(() => setHintId((h) => (h === found.id ? null : h)), 1500);
  };

  const startFromBrief = () => {
    sfx.click();
    setShowGo(false);
    setCount(3);
    setStatus("count");
  };

  const retry = () => {
    setBank(makeBank(0, []));
    setPlaced([]);
    setStageIdx(0);
    setCombo(0); setMaxCombo(0); setCorrect(0); setErrors(0);
    setScore(0); setThreat(0); setLives(3); setMissed({});
    setWrongId(null); setHintId(null); setHintsUsed(0);
    setToast(null); setShowAnswer(false); setView("tower");
    state.current = { startAt: 0, pauseAt: 0, pauseAccum: 0 };
    setShowGo(false);
    setCount(3);
    setStatus("count");
    sfx.click();
  };

  const togglePause = () => {
    if (status === "play") {
      state.current.pauseAt = performance.now();
      setStatus("pause");
    } else if (status === "pause") {
      state.current.pauseAccum += performance.now() - state.current.pauseAt;
      setStatus("play");
    }
    sfx.click();
  };

  const totalTaps = correct + errors;
  const liveAcc = totalTaps > 0 ? Math.round((correct / totalTaps) * 100) : 100;
  const accColor = liveAcc >= 95 ? "var(--teal)" : liveAcc >= 85 ? "var(--amber)" : "var(--coral)";
  const threatColor = threat > 78 ? "var(--coral)" : threat > 45 ? "var(--amber)" : "var(--teal)";
  const danger = status === "play" && (lives === 1 || threat > 78);
  const hintsLeft = Math.max(0, level.hintLimit - hintsUsed);
  const decoysHere = (stageDecoys[stageIdx] ?? []).length;
  const assembled = placed.join("\n");

  return (
    <div className="tower-light relative z-10 min-h-screen flex flex-col select-none">
      {danger && <div className="danger-vignette" aria-hidden="true" />}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,15,26,0.85)] border-b border-[var(--line-soft)]">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2.5 flex-wrap">
          <button className="btn btn-ghost !px-3 !py-2" onClick={onExit} aria-label="Keluar">
            <IconX size={16} />
          </button>
          <div className="leading-tight mr-auto">
            <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase" style={{ color: mod.color }}>
              {mod.tag} • TOWER LV{level.level}
            </p>
            <p className="font-display font-bold text-sm">
              Lantai {placed.length}/{blocks.length} • Tahap {stageIdx + 1}/{stages.length}
            </p>
          </div>
          <span className="chip"><IconTimer size={14} /> {fmt(elapsedSec())}</span>
          <span className="chip font-display" style={{ color: accColor, borderColor: accColor }} title={`Target lulus: akurasi ≥ ${mod.passAcc}%`}>
            <IconTarget size={14} /> {liveAcc}%{mod.passAcc > 0 && <span className="opacity-70"> / {mod.passAcc}%</span>}
          </span>
          <span className="chip !text-[var(--amber)] font-display text-base !px-3.5">
            <IconBolt size={15} /> {score}
          </span>
          {combo >= 2 && (
            <span key={combo} className="chip !text-[var(--teal)] !border-[rgba(46,230,200,0.45)] anim-pop font-display">
              COMBO ×{combo}
            </span>
          )}
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <IconHeart key={i} size={20} className={i < lives ? "text-[var(--coral)]" : "text-[#e2e8f0]"} />
            ))}
          </span>
          <button className="btn btn-ghost !px-3 !py-2" onClick={togglePause} aria-label="Jeda" disabled={status === "brief" || status === "count"}>
            {status === "pause" ? <IconPlay size={16} /> : <IconPause size={16} />}
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-2.5 flex items-center gap-3">
          <span className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-[var(--dim)] whitespace-nowrap">Ancaman Hiu</span>
          <div className="threat-track flex-1 h-2.5 rounded-full bg-[rgba(6,24,41,0.9)] border border-[var(--line-soft)] overflow-hidden">
            <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${threat}%`, background: `linear-gradient(90deg, var(--teal), ${threatColor})` }} />
          </div>
          <span className="font-code text-xs font-bold tabular-nums" style={{ color: threatColor }}>{Math.round(threat)}%</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-5 flex flex-col gap-4 pb-10">
        {/* tahap + tab pasangan menara/halaman */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="stage-dots" aria-label={`Tahap ${stageIdx + 1} dari ${stages.length}`}>
            {stages.map((s, i) => (
              <span key={i} className={`stage-dot ${i < stageIdx ? "done" : i === stageIdx ? "now" : ""}`} title={`Tahap ${i + 1}: ${s.length} lantai`} />
            ))}
          </div>
          <span className="text-[11px] font-bold text-[var(--dim)]">
            {level.title} • {level.mechanic}
          </span>
          {isHtml && status !== "brief" && (
            <div className="tower-tabs ml-auto">
              <button className={`tab-btn ${view === "tower" ? "on" : ""}`} onClick={() => { sfx.click(); setView("tower"); }}>🧱 Menara</button>
              <button className={`tab-btn ${view === "page" ? "on" : ""}`} onClick={() => { sfx.click(); setView("page"); }}>
                🌐 Hasil{placed.length > 0 && <i className="tab-ping" />}
              </button>
            </div>
          )}
        </div>

        <div className="panel p-1.5 relative overflow-hidden">
          <div className="tower-progress-track h-1.5 rounded-t-[10px] overflow-hidden bg-[rgba(6,24,41,0.8)]">
            <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${mod.color}, var(--accent))` }} />
          </div>
          <div key={shake} className={`px-4 md:px-6 py-5 ${shake ? "shake" : ""}`}>
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--dim)]">
                {view === "page" ? "Halamanmu — terbentuk tiap lantai" : `Menara ${mod.lang.toUpperCase()} — ketuk blok sesuai urutan`}
              </p>
              <div className="flex gap-2">
                <button className="btn btn-ghost !py-1.5 !px-3 !text-xs" onClick={hint} disabled={status !== "play" || hintsLeft <= 0}>
                  <IconEye size={13} /> Petunjuk ({level.hintLimit >= 99 ? "∞" : hintsLeft})
                </button>
                <button className="btn btn-ghost !py-1.5 !px-3 !text-xs" onClick={undo} disabled={status !== "play" || placed.length === 0}>
                  Lepas lantai
                </button>
              </div>
            </div>

            {toast && (
              <p key={toast.id} className="text-center font-display font-extrabold text-lg anim-pop mb-2" style={{ color: "#ea580c" }}>
                {toast.txt}
              </p>
            )}

            {!(isHtml && view === "page") ? (
              <>
                {/* bayangan lantai berikutnya: bentuk tag saja, bukan isi penuh */}
                {nextText && status === "play" && (
                  <p className="ghost-next">
                    Lantai {placed.length + 1}:{" "}
                    <span className="tag-chip" style={{ color: tagColor(nextTag), borderColor: `${tagColor(nextTag)}66`, background: `${tagColor(nextTag)}14` }}>
                      &lt;{nextTag}&gt;
                    </span>
                    <span className="text-[var(--faint)]">… cari bloknya di bank bawah</span>
                  </p>
                )}
                <div className="tower-shaft" aria-live="polite">
                  {placed.length === 0 && (
                    <p className="text-center text-xs text-[var(--faint)] font-semibold py-6">
                      Menaramu masih rata dengan laut… ketuk blok pertama di bawah!
                    </p>
                  )}
                  {[...placed].reverse().map((txt, ri) => {
                    const idx = placed.length - 1 - ri;
                    const tag = extractTag(txt);
                    const tc = tagColor(tag);
                    return (
                      <div key={`${idx}-${txt.slice(0, 16)}-${ri}`} className="tower-floor anim-pop"
                        style={{ width: `${floorWidth(idx, blocks.length)}%`, borderColor: `${tc}88` }}>
                        <span className="tower-floor-no">{idx + 1}</span>
                        <span className="tag-chip" style={{ color: tc, borderColor: `${tc}66`, background: `${tc}14` }}>{tag}</span>
                        <code className="tower-floor-code">{txt.trim() === "" ? "…" : txt}</code>
                        {ri === 0 && <span className="tower-crane" aria-hidden="true">🏗️</span>}
                      </div>
                    );
                  })}
                  <div className="tower-base">
                    <Diver />
                    <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[var(--faint)]">Fondasi • Tahap {stageIdx + 1}/{stages.length}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="phone-frame">
                <div className="phone-bar">
                  <span className="flex gap-1.5">
                    <i className="w-2.5 h-2.5 rounded-full bg-[#ff6b57] inline-block" />
                    <i className="w-2.5 h-2.5 rounded-full bg-[#ffc247] inline-block" />
                    <i className="w-2.5 h-2.5 rounded-full bg-[#2ee6c8] inline-block" />
                  </span>
                  <span className="phone-url">halamanmu.html • {placed.length}/{blocks.length} blok</span>
                </div>
                {placed.length === 0 ? (
                  <p className="text-center text-xs text-[var(--faint)] font-semibold py-10 px-6">
                    Belum ada blok terpasang — halaman masih kosong. Kembali ke tab Menara dan susun lantai pertamamu! 🧱
                  </p>
                ) : (
                  <iframe title="Hasil halaman" srcDoc={mod.preview(assembled)} sandbox="allow-scripts" className="w-full h-[300px] md:h-[360px] bg-white block rounded-b-[14px]" />
                )}
                <p className="phone-cap">Setiap lantai yang benar langsung mengubah halaman ini — menara &amp; halaman berpasangan.</p>
              </div>
            )}

            {flash > 0 && <div key={flash} className="flash-red absolute inset-0 bg-[var(--coral)] pointer-events-none rounded-2xl" />}
          </div>
        </div>

        {/* laut + hiu */}
        <div className="panel tower-sea relative h-24 md:h-28 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #e0f2fe 0%, #bae6fd 55%, #fef3c7 130%)" }} />
          <div className="absolute left-4 md:left-8 bottom-2 flex flex-col items-center gap-1">
            <Diver />
            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[var(--faint)]">Pangkalan</span>
          </div>
          <div className="absolute bottom-1 transition-[left] duration-300 ease-out" style={{ left: `${74 - threat * 0.62}%`, width: "clamp(90px, 16vw, 150px)" }}>
            <div className={threat > 78 ? "anim-wiggle" : "anim-bob"}>
              <SharkMascot className="w-full" style={{ filter: threat > 78 ? "drop-shadow(0 0 14px rgba(255,107,87,0.55))" : "drop-shadow(0 8px 16px rgba(0,0,0,0.4))" }} />
            </div>
          </div>
        </div>

        {/* bank blok */}
        <section aria-label="Bank blok kode">
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--dim)]">
              Bank blok • sisa {bank.length}{decoysHere > 0 && <span className="text-[var(--coral)]"> • ada {decoysHere} pengecoh!</span>}
            </p>
            <button
              className="text-[11px] font-bold text-[var(--cyan)] underline underline-offset-2"
              onClick={() => { sfx.click(); setShowAnswer((v) => !v); }}
            >
              {showAnswer ? "Sembunyikan bocoran" : "Intip susunan benar"}
            </button>
          </div>
          {showAnswer && (
            <div className="panel-flat p-3 mb-2 font-code text-[12px] leading-relaxed whitespace-pre-wrap break-words text-[var(--dim)]">
              {blocks.map((b, i) => (
                <p key={i} style={{ color: i < placed.length ? "var(--teal)" : i === placed.length ? "var(--amber)" : undefined }}>
                  {i < placed.length ? "✓ " : i === placed.length ? "➜ " : "· "}{b}
                </p>
              ))}
            </div>
          )}
          <div className="grid gap-2">
            {bank.map((item) => {
              const isWrong = wrongId === item.id;
              const isHint = hintId === item.id;
              const tag = extractTag(item.text);
              const tc = tagColor(tag);
              return (
                <button
                  key={item.id}
                  onClick={() => tap(item)}
                  disabled={status !== "play"}
                  className={`puzzle-block ${isWrong ? "puzzle-wrong" : ""} ${isHint ? "puzzle-hint" : ""}`}
                >
                  <span className="tag-chip shrink-0" style={{ color: tc, borderColor: `${tc}66`, background: `${tc}14` }}>{tag}</span>
                  <code className="puzzle-code">{tokenizeLine(item.text || " ", mod.lang).map((t, j) => (
                    <span key={j} className={t.cls}>{t.ch === " " ? " " : t.ch}</span>
                  ))}</code>
                  {isWrong && <span className="puzzle-badge">✕</span>}
                  {isHint && <span className="puzzle-badge !bg-[var(--amber)] !text-[#2b1a02]">➜</span>}
                </button>
              );
            })}
            {bank.length === 0 && placed.length === blocks.length && (
              <p className="text-center text-sm font-bold text-[var(--teal)] py-4 flex items-center justify-center gap-2">
                <IconCheck size={16} /> Semua lantai terpasang!
              </p>
            )}
          </div>
          <p className="text-center text-xs text-[var(--faint)] font-semibold mt-3">
            Cocokkan bentuk tag lantai berikutnya • awas blok pengecoh yang mirip!
          </p>
        </section>
      </main>

      {/* briefing level */}
      {status === "brief" && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(2,9,17,0.82)] backdrop-blur-sm screen-in">
          <div className="panel w-full max-w-md p-6 md:p-7 anim-pop">
            <p className="text-[11px] font-extrabold tracking-[0.24em] uppercase" style={{ color: mod.color }}>
              {mod.tag}
            </p>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl mt-1">
              Tower Lv{level.level} — {level.title}
            </h2>
            <p className="text-sm text-[var(--dim)] mt-1.5 leading-relaxed">{level.mechanic}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="chip">🧱 {blocks.length} lantai</span>
              <span className="chip">📦 {stages.length} tahap</span>
              {level.decoyCount > 0
                ? <span className="chip !text-[var(--coral)]">😈 {level.decoyCount} pengecoh</span>
                : <span className="chip !text-[var(--teal)]">Tanpa pengecoh</span>}
              <span className="chip">💡 {level.hintLimit >= 99 ? "Petunjuk ∞" : `${level.hintLimit} petunjuk`}</span>
            </div>
            <div className="panel-flat p-3.5 mt-3.5">
              <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-[var(--amber)]">Tips level</p>
              <p className="text-[13px] text-[#334155] mt-1 leading-relaxed">{level.tip}</p>
            </div>
            {isHtml && (
              <p className="text-[12px] text-[var(--dim)] mt-3 leading-relaxed">
                🧱 + 🌐 berpasangan: tiap lantai juga membangun <strong className="text-[#0f172a]">halaman HTML-mu</strong> di tab Hasil.
              </p>
            )}
            <button className="btn btn-primary w-full py-3.5 mt-5 justify-center" onClick={startFromBrief}>
              Mulai Membangun <IconArrowR size={17} />
            </button>
          </div>
        </div>
      )}

      {(status === "count" || showGo) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(2,9,17,0.72)] backdrop-blur-sm">
          <div className="text-center px-6">
            <p className="text-sm font-extrabold tracking-[0.3em] uppercase text-[var(--dim)] mb-3">Tower Lv{level.level} • Tahap 1</p>
            <div key={showGo ? "go" : count} className={`font-display font-extrabold ${showGo ? "text-6xl md:text-7xl text-[var(--teal)]" : "text-8xl md:text-9xl"} count-pop`} style={{ color: showGo ? undefined : cfg.accent }}>
              {showGo ? "SUSUN!" : count}
            </div>
            <p className="text-xs text-[var(--dim)] font-semibold mt-3">Susun {blocks.length} blok dalam {stages.length} tahap</p>
          </div>
        </div>
      )}

      {status === "pause" && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(2,9,17,0.78)] backdrop-blur-sm screen-in">
          <div className="panel w-full max-w-sm p-7 text-center anim-pop">
            <span className="w-14 h-14 mx-auto rounded-2xl grid place-items-center bg-[rgba(69,198,255,0.12)] text-[var(--cyan)] border border-[rgba(69,198,255,0.3)]">
              <IconPause size={26} />
            </span>
            <h2 className="font-display font-extrabold text-2xl mt-4">Jeda — Hiu Menunggu</h2>
            <p className="text-sm text-[var(--dim)] mt-1.5">Lantai: <strong className="text-[var(--teal)]">{placed.length}/{blocks.length}</strong> • Skor: <strong className="text-[var(--amber)]">{score}</strong></p>
            <div className="flex flex-col gap-2.5 mt-6">
              <button className="btn btn-primary py-3" onClick={togglePause}><IconPlay size={18} /> Lanjutkan</button>
              <button className="btn btn-ghost py-2.5" onClick={retry}><IconRetry size={17} /> Ulang dari Awal</button>
              <button className="btn btn-ghost py-2.5" onClick={onExit}><IconMap size={17} /> Kembali ke Peta</button>
            </div>
          </div>
        </div>
      )}

      {status === "dead" && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(20,5,8,0.8)] backdrop-blur-sm screen-in">
          <div className="panel w-full max-w-md p-7 text-center anim-pop !border-[rgba(255,107,87,0.45)]">
            <div className="w-20 mx-auto opacity-90 grayscale-[0.3]"><SharkMascot className="w-full" /></div>
            <h2 className="font-display font-extrabold text-3xl mt-3 text-[var(--coral)]">HIU MENYERANG!</h2>
            <p className="text-sm text-[var(--dim)] mt-2">
              Menaramu roboh di lantai {placed.length + 1} (tahap {stageIdx + 1}). Waspadai blok pengecoh yang mirip!
            </p>
            <div className="flex justify-center gap-2.5 mt-4 flex-wrap">
              <span className="chip">Skor {score}</span>
              <span className="chip">Benar {correct}</span>
              <span className="chip !text-[var(--coral)]">Salah {errors}</span>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-coral flex-1 py-3" onClick={retry}><IconRetry size={18} /> Coba Lagi</button>
              <button className="btn btn-ghost flex-1 py-3" onClick={onExit}><IconMap size={17} /> Peta</button>
            </div>
          </div>
        </div>
      )}

      {status === "won" && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(2,9,17,0.78)] backdrop-blur-sm">
          <div className="text-center anim-pop">
            <div className="w-32 mx-auto anim-bob"><SharkMascot className="w-full" /></div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl mt-4" style={{ color: "#5eead4", textShadow: "0 6px 30px rgba(45,212,191,0.45)" }}>
              MENARA BERDIRI!
            </h2>
            <p className="text-[var(--dim)] font-bold mt-2 flex items-center justify-center gap-2">
              <IconFin size={18} className="text-[var(--teal)]" /> Menghitung hadiahmu…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
