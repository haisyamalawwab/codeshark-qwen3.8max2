/* Mode SUSUN MENARA — pengganti mengetik untuk layar sentuh (HP/tablet).
   Pemain mengetuk blok kode sesuai urutan; tiap blok benar = satu lantai menara.
   Menghasilkan GameResult yang sama dengan TypingGame sehingga XP/koin/progres
   memakai satu pintu (App.finishPractice → lib/progress.applyAttempt). */
import { useEffect, useMemo, useRef, useState } from "react";
import type { AgeCfg } from "../data/modules";
import type { Session } from "../data/quests";
import type { GameResult } from "./TypingGame";
import { toBlocks, shuffled, floorWidth } from "../lib/puzzle";
import { tokenizeLine } from "../lib/highlight";
import { sfx } from "../lib/audio";
import { scene } from "../graphics/scene";
import {
  IconX, IconHeart, IconBolt, IconTimer, IconPause, IconPlay, IconRetry,
  IconMap, IconFin, IconTarget, IconCheck, IconEye,
} from "./icons";
import { SharkMascot, Diver } from "../characters";

interface Props {
  mod: Session;
  cfg: AgeCfg;
  onDone: (r: GameResult) => void;
  onExit: () => void;
}

type Status = "count" | "play" | "pause" | "won" | "dead";

interface BankItem {
  id: number;
  text: string;
}

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function TowerPuzzle({ mod, cfg, onDone, onExit }: Props) {
  const blocks = useMemo(() => toBlocks(mod.code), [mod.code]);
  const bank0 = useMemo<BankItem[]>(
    () => shuffled(blocks.map((text, i) => ({ id: i, text }))),
    [blocks]
  );


  const [bank, setBank] = useState<BankItem[]>(bank0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("count");
  const [count, setCount] = useState(3);
  const [showGo, setShowGo] = useState(false);
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
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState(0);
  const [toast, setToast] = useState<{ id: number; txt: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const state = useRef({ startAt: 0, pauseAt: 0, pauseAccum: 0 });
  const idRef = useRef(1000);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  const threatRate = cfg.threatRate * mod.threatMul * 0.7; // sedikit lebih ramah di sentuh
  const nextText = placed.length < blocks.length ? blocks[placed.length] : null;
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

  /* countdown */
  useEffect(() => {
    if (status !== "count") return;
    if (count === 0) {
      state.current.startAt = performance.now();
      setStatus("play");
      sfx.go();
      setShowGo(true);
      const t = window.setTimeout(() => setShowGo(false), 850);
      return () => window.clearTimeout(t);
    }
    sfx.count();
    const t = window.setTimeout(() => setCount((c) => c - 1), 800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, status]);

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
    window.setTimeout(() => onDoneRef.current(r), 1500);
  };

  const tap = (item: BankItem) => {
    if (status !== "play" || nextText === null) return;
    if (item.text === nextText) {
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
      setBank((b) => b.filter((x) => x.id !== item.id));
      setThreat((th) => Math.max(0, th - cfg.relief * 0.8));
      sfx.key(nc);
      if (nc % 5 === 0) sfx.star();
      if (nPlaced.length % 3 === 0) {
        const id = ++idRef.current;
        setToast({ id, txt: cfg.cheers[(nPlaced.length / 3 | 0) % cfg.cheers.length] });
        window.setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 950);
        sfx.line();
      }
      if (nPlaced.length >= blocks.length) win(nPlaced, ns, nCorrect);
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
      window.setTimeout(() => setWrongId((w) => (w === item.id ? null : w)), 380);
      setThreat((th) => {
        if (th >= 100) {
          hurt();
          return 0;
        }
        return th;
      });
    }
  };

  const undo = () => {
    if (status !== "play" || placed.length === 0) return;
    const last = placed[placed.length - 1];
    // kembalikan satu salinan ke bank (id baru agar animasi segar)
    setPlaced((p) => p.slice(0, -1));
    setBank((b) => [...b, { id: ++idRef.current, text: last }]);
    setCorrect((c) => Math.max(0, c - 1));
    setCombo(0);
    sfx.click();
  };

  const hint = () => {
    if (status !== "play" || nextText === null) return;
    const found = bank.find((b) => b.text === nextText);
    if (!found) return;
    setHintId(found.id);
    setThreat((th) => Math.min(99, th + 4)); // petunjuk berbayar murah: +4 ancaman
    sfx.quizOk();
    window.setTimeout(() => setHintId((h) => (h === found.id ? null : h)), 1400);
  };

  const retry = () => {
    setBank(bank0);
    setPlaced([]);
    setCombo(0); setMaxCombo(0); setCorrect(0); setErrors(0);
    setScore(0); setThreat(0); setLives(3); setMissed({});
    setWrongId(null); setHintId(null); setToast(null); setShowPreview(false);
    state.current = { startAt: 0, pauseAt: 0, pauseAccum: 0 };
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

  return (
    <div className="relative z-10 min-h-screen flex flex-col select-none">
      {danger && <div className="danger-vignette" aria-hidden="true" />}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,15,26,0.85)] border-b border-[var(--line-soft)]">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2.5 flex-wrap">
          <button className="btn btn-ghost !px-3 !py-2" onClick={onExit} aria-label="Keluar">
            <IconX size={16} />
          </button>
          <div className="leading-tight mr-auto">
            <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase" style={{ color: mod.color }}>
              {mod.tag} • MODE SUSUN
            </p>
            <p className="font-display font-bold text-sm">Lantai {placed.length}/{blocks.length}</p>
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
              <IconHeart key={i} size={20} className={i < lives ? "text-[var(--coral)]" : "text-[rgba(126,196,236,0.18)]"} />
            ))}
          </span>
          <button className="btn btn-ghost !px-3 !py-2" onClick={togglePause} aria-label="Jeda">
            {status === "pause" ? <IconPlay size={16} /> : <IconPause size={16} />}
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-2.5 flex items-center gap-3">
          <span className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-[var(--dim)] whitespace-nowrap">Ancaman Hiu</span>
          <div className="flex-1 h-2.5 rounded-full bg-[rgba(6,24,41,0.9)] border border-[var(--line-soft)] overflow-hidden">
            <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${threat}%`, background: `linear-gradient(90deg, var(--teal), ${threatColor})` }} />
          </div>
          <span className="font-code text-xs font-bold tabular-nums" style={{ color: threatColor }}>{Math.round(threat)}%</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-5 flex flex-col gap-4 pb-10">
        <div className="panel p-1.5 relative overflow-hidden">
          <div className="h-1.5 rounded-t-[10px] overflow-hidden bg-[rgba(6,24,41,0.8)]">
            <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${mod.color}, var(--accent))` }} />
          </div>
          <div key={shake} className={`px-4 md:px-6 py-5 ${shake ? "shake" : ""}`}>
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--dim)]">
                Menara {mod.lang.toUpperCase()} — ketuk blok sesuai urutan
              </p>
              <div className="flex gap-2">
                <button className="btn btn-ghost !py-1.5 !px-3 !text-xs" onClick={hint} disabled={status !== "play"}>
                  <IconEye size={13} /> Petunjuk
                </button>
                <button className="btn btn-ghost !py-1.5 !px-3 !text-xs" onClick={undo} disabled={status !== "play" || placed.length === 0}>
                  Lepas lantai
                </button>
              </div>
            </div>

            {toast && (
              <p key={toast.id} className="text-center font-display font-extrabold text-lg anim-pop mb-2" style={{ color: cfg.accent }}>
                {toast.txt}
              </p>
            )}

            {/* menara tersusun */}
            <div className="tower-shaft" aria-live="polite">
              {placed.length === 0 && (
                <p className="text-center text-xs text-[var(--faint)] font-semibold py-6">
                  Menaramu masih rata dengan laut… ketuk blok pertama di bawah!
                  {nextText && <span className="block mt-2 font-code text-[13px] text-[var(--dim)]">⌄ {nextText.trim().slice(0, 48)} ⌄</span>}
                </p>
              )}
              {[...placed].reverse().map((txt, ri) => {
                const idx = placed.length - 1 - ri; // idx asli dari bawah
                return (
                  <div key={`${idx}-${txt}`} className="tower-floor anim-pop" style={{ width: `${floorWidth(idx, blocks.length)}%` }}>
                    <span className="tower-floor-no">{idx + 1}</span>
                    <code className="tower-floor-code">{txt.trim() === "" ? "…" : txt}</code>
                    {ri === 0 && <span className="tower-crane" aria-hidden="true">🏗️</span>}
                  </div>
                );
              })}
              <div className="tower-base">
                <Diver />
                <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[var(--faint)]">Fondasi</span>
              </div>
            </div>

            {flash > 0 && <div key={flash} className="flash-red absolute inset-0 bg-[var(--coral)] pointer-events-none rounded-2xl" />}
          </div>
        </div>

        {/* laut + hiu */}
        <div className="panel relative h-24 md:h-28 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,42,68,0.35), rgba(4,17,30,0.85))" }} />
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--dim)]">
              Bank blok • sisa {bank.length}
            </p>
            <button
              className="text-[11px] font-bold text-[var(--cyan)] underline underline-offset-2"
              onClick={() => { sfx.click(); setShowPreview((v) => !v); }}
            >
              {showPreview ? "Sembunyikan bocoran" : "Intip susunan benar"}
            </button>
          </div>
          {showPreview && (
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
              return (
                <button
                  key={item.id}
                  onClick={() => tap(item)}
                  disabled={status !== "play"}
                  className={`puzzle-block ${isWrong ? "puzzle-wrong" : ""} ${isHint ? "puzzle-hint" : ""}`}
                >
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
            Ketuk blok paling atas dari susunan benar • tombol besar, aman untuk jempol
          </p>
        </section>
      </main>

      {/* overlays */}
      {(status === "count" || showGo) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(2,9,17,0.72)] backdrop-blur-sm">
          <div className="text-center px-6">
            <p className="text-sm font-extrabold tracking-[0.3em] uppercase text-[var(--dim)] mb-3">Mode Susun Menara</p>
            <div key={showGo ? "go" : count} className={`font-display font-extrabold ${showGo ? "text-6xl md:text-7xl text-[var(--teal)]" : "text-8xl md:text-9xl"} count-pop`} style={{ color: showGo ? undefined : cfg.accent }}>
              {showGo ? "SUSUN!" : count}
            </div>
            <p className="text-xs text-[var(--dim)] font-semibold mt-3">Susun {blocks.length} blok menjadi menara {mod.lang.toUpperCase()}</p>
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
              Menaramu roboh di lantai {placed.length + 1}. Ketukan salah menaikkan ancaman — perhatikan urutan blok!
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
            <h2 className="font-display font-extrabold text-4xl md:text-5xl mt-4 text-[var(--teal)]" style={{ textShadow: "0 6px 30px rgba(46,230,200,0.4)" }}>
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
