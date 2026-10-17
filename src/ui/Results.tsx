import { useEffect, useState } from "react";
import type { AgeCfg } from "../data/modules";
import type { Session } from "../data/quests";
import type { GameResult } from "./TypingGame";
import { sfx } from "../lib/audio";
import { CodePanel } from "./Dashboard";
import RankCelebrationOverlay from "./RankCelebrationOverlay";
import RankEmblemArt from "./RankEmblemArt";
import {
  IconBolt, IconCoin, IconRetry, IconMap, IconStar, IconStarLine, IconTarget,
  IconTimer, IconBolt as IconCombo, IconCheck, IconX, IconConsole, IconEye, IconKeyboard,
  IconFlame, IconSparkles,
} from "./icons";

interface Props {
  mod: Session;
  cfg: AgeCfg;
  result: GameResult;
  /** true = memenuhi target akurasi sesi (lihat Session.passAcc) */
  passed: boolean;
  /** XP baru yang benar-benar ditambahkan (0 bila belum melampaui skor terbaik) */
  xpGained: number;
  coinsGained: number;
  rankUp: string | null;
  /** Jumlah hari berturut-turut streak aktif */
  streakCount?: number;
  /** Menandakan apakah sesi ini merupakan tantangan harian */
  isDaily?: boolean;
  dailyBonusXp?: number;
  dailyBonusCoins?: number;
  /** Pengali Streak permanen aktif */
  streakMultiplier?: number;
  streakTierName?: string;
  streakBonusXp?: number;
  streakBonusCoins?: number;
  /** Tier pengali yang baru saja terbuka di sesi ini */
  newStreakTierUnlocked?: {
    tier: number;
    name: string;
    multiplier: number;
  } | null;
  onRetry: () => void;
  onMap: () => void;
}

function useCountUp(target: number, dur = 950, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let t0 = 0;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0 - delay) / dur);
      if (p >= 0) setV(Math.round(target * (1 - Math.pow(1 - Math.max(0, p), 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur, delay]);
  return v;
}

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Results({
  mod, cfg, result, passed, xpGained, coinsGained, rankUp, streakCount,
  isDaily = false, dailyBonusXp = 0, dailyBonusCoins = 0,
  streakMultiplier = 1, streakTierName, streakBonusXp = 0, streakBonusCoins = 0,
  newStreakTierUnlocked,
  onRetry, onMap,
}: Props) {
  const r = result;
  const score = useCountUp(r.score, 1100, 300);
  const xp = useCountUp(xpGained, 900, 800);
  const coins = useCountUp(coinsGained, 900, 1000);
  const [logs, setLogs] = useState<{ type: string; text: string }[]>([]);
  const [tab, setTab] = useState<"preview" | "kode" | "konsol">("preview");
  const [showRankModal, setShowRankModal] = useState<boolean>(() => Boolean(rankUp));
  const showConsole = mod.lang === "js";
  const hardest = Object.entries(r.missed ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 4);

  /* tangkap console.log dari iframe preview */
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { __cs?: boolean; type?: string; text?: string };
      if (d && d.__cs) setLogs((l) => [...l, { type: d.type ?? "log", text: d.text ?? "" }]);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  /* bunyi bintang beruntun */
  useEffect(() => {
    const ts: number[] = [];
    for (let i = 0; i < r.stars; i++) ts.push(window.setTimeout(() => sfx.star(), 500 + i * 320));
    if (xpGained > 0) ts.push(window.setTimeout(() => sfx.coin(), 1200));
    return () => ts.forEach(clearTimeout);
  }, [r.stars, xpGained]);

  const stats = [
    { ic: <IconTarget size={17} />, l: "Akurasi", v: `${r.accuracy}%`, c: r.accuracy >= 85 ? "var(--teal)" : "var(--amber)" },
    { ic: <IconTimer size={17} />, l: "Kecepatan", v: `${r.wpm} WPM`, c: "var(--cyan)" },
    { ic: <IconCombo size={17} />, l: "Combo Maks", v: `×${r.maxCombo}`, c: "var(--accent)" },
    { ic: <IconKeyboard size={17} />, l: "Waktu", v: fmt(r.timeSec), c: "var(--dim)" },
  ];

  return (
    <div className="relative z-10 min-h-screen">
      {/* ===== OVERLAY PERAYAAN NAIK PANGKAT (RANK UP CELEBRATION) ===== */}
      {showRankModal && rankUp && (
        <RankCelebrationOverlay
          rank={rankUp}
          onClose={() => setShowRankModal(false)}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 py-10 pb-24">
        {/* ===== kepala hasil ===== */}
        <section className="text-center screen-in">
          <p className="text-xs font-extrabold tracking-[0.28em] uppercase" style={{ color: mod.color }}>
            {mod.tag} • {mod.practiceTitle}
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl mt-2">
            {r.accuracy >= 95 ? "SEMPURNA!" : r.accuracy >= 85 ? "HEBAT SEKALI!" : "MISI SELESAI!"}
          </h1>
          <p className="mt-2.5 flex items-center justify-center gap-2 flex-wrap">
            <span className="chip !text-[var(--accent)]">{cfg.label}</span>
            {mod.passAcc > 0 && (
              passed ? (
                <span className="chip !text-[var(--teal)] !border-[rgba(46,230,200,0.45)]">
                  <IconCheck size={13} /> LULUS • target ≥ {mod.passAcc}%
                </span>
              ) : (
                <span className="chip !text-[var(--coral)] !border-[rgba(255,107,87,0.45)]">
                  <IconX size={13} /> BELUM LULUS • target ≥ {mod.passAcc}% (akurasimu {r.accuracy}%)
                </span>
              )
            )}
            {rankUp && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  setShowRankModal(true);
                }}
                className="chip !text-[var(--amber)] !border-[rgba(255,194,71,0.55)] anim-pop hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_16px_rgba(255,194,71,0.3)] flex items-center gap-2"
                title="Klik untuk membuka kembali perayaan kenaikan pangkat!"
              >
                <RankEmblemArt rank={rankUp} size={22} animated={false} />
                <span>Rank naik: <strong className="text-amber-200">{rankUp}</strong>!</span>
                <IconSparkles size={13} className="text-amber-300 animate-spin" />
              </button>
            )}
            {isDaily && (
              <span className="chip !text-[var(--amber)] !border-[rgba(245,158,11,0.5)] anim-pop flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <IconSparkles size={14} /> Tantangan Harian Selesai!
              </span>
            )}
          </p>

          {/* Banner Pengali Baru Terbuka Permanen */}
          {newStreakTierUnlocked && (
            <div className="max-w-xl mx-auto mt-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[rgba(245,158,11,0.25)] via-[rgba(46,230,200,0.25)] to-[rgba(56,189,248,0.25)] border-2 border-[rgba(245,158,11,0.7)] shadow-[0_0_30px_rgba(245,158,11,0.35)] anim-pop flex items-center gap-3.5 text-left">
              <span className="w-11 h-11 rounded-2xl bg-[rgba(255,194,71,0.3)] text-amber-300 border border-amber-400 grid place-items-center text-2xl shrink-0 shadow">
                ⚡
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[var(--amber)]">
                    PENGALI STREAK BARU TERBUKA PERMANEN!
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 border border-amber-400/50">
                    Tier {newStreakTierUnlocked.tier}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-base md:text-lg text-white mt-0.5">
                  {newStreakTierUnlocked.name} ({newStreakTierUnlocked.multiplier}× Multiplier)
                </h3>
                <p className="text-xs text-slate-200 mt-0.5">
                  Mulai sekarang, setiap misi yang kamu selesaikan mendapatkan bonus pengali {newStreakTierUnlocked.multiplier}× selamanya!
                </p>
              </div>
            </div>
          )}

          {/* bintang */}
          <div className="flex justify-center items-end gap-3 mt-6">
            {[0, 1, 2].map((i) => {
              const on = i < r.stars;
              return (
                <span
                  key={i}
                  className={on ? "star-pop" : ""}
                  style={{ animationDelay: `${0.5 + i * 0.32}s` }}
                >
                  {on ? (
                    <IconStar size={i === 1 ? 62 : 46} className="text-[var(--amber)] drop-shadow-[0_6px_18px_rgba(255,194,71,0.45)]" />
                  ) : (
                    <IconStarLine size={i === 1 ? 62 : 46} className="text-[rgba(126,196,236,0.22)]" />
                  )}
                </span>
              );
            })}
          </div>

          {/* skor */}
          <p className="font-display font-extrabold text-7xl md:text-8xl mt-4 tabular-nums text-[var(--amber)]" style={{ textShadow: "0 8px 34px rgba(255,194,71,0.35)" }}>
            {score}
          </p>
          <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-[var(--dim)]">Skor Akhir</p>

          {/* statistik */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-2xl mx-auto mt-7">
            {stats.map((s, i) => (
              <div key={i} className="panel-flat px-3 py-3.5 anim-fadeUp" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                <span className="inline-grid place-items-center w-8 h-8 rounded-lg mb-1.5" style={{ color: s.c, background: `${"rgba(255,255,255,0.05)"}`, border: `1px solid var(--line-soft)` }}>
                  {s.ic}
                </span>
                <p className="font-display font-extrabold text-xl leading-none" style={{ color: s.c }}>{s.v}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-[var(--faint)] mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--faint)] font-semibold mt-3">
            {r.correct} aksi benar • {r.errors} kesalahan {r.errors === 0 && "— tanpa cela!"}
          </p>

          {/* kenapa bintang ini? + karakter tersulit */}
          <div className="grid md:grid-cols-2 gap-2.5 max-w-2xl mx-auto mt-5 text-left">
            <div className="panel-flat px-4 py-3.5">
              <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)] mb-2">Syarat bintang</p>
              {[
                { ok: true, t: "Selesaikan misi — 1 bintang" },
                { ok: r.accuracy >= 85, t: `Akurasi ≥ 85% — 2 bintang (kamu ${r.accuracy}%)` },
                { ok: r.accuracy >= 95, t: `Akurasi ≥ 95% — 3 bintang (kamu ${r.accuracy}%)` },
              ].map((c, i) => (
                <p key={i} className="text-xs font-semibold flex items-center gap-2 py-0.5" style={{ color: c.ok ? "var(--teal)" : "var(--dim)" }}>
                  {c.ok ? <IconCheck size={13} /> : <IconX size={13} />} {c.t}
                </p>
              ))}
            </div>
            <div className="panel-flat px-4 py-3.5">
              <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)] mb-2">Karakter tersulit</p>
              {hardest.length === 0 ? (
                <p className="text-xs font-semibold text-[var(--teal)]">Tidak ada salah ketik — mantap!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {hardest.map(([ch, n]) => (
                    <span key={ch} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--dim)]">
                      <span className="keycap !min-w-7 !h-7">{ch === " " ? "␣" : ch}</span> ×{n}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== hadiah ===== */}
        <section className="panel mt-8 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-5 anim-fadeUp" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-4 flex-1">
            <span className="w-12 h-12 rounded-xl grid place-items-center bg-[rgba(46,230,200,0.12)] text-[var(--teal)] border border-[rgba(46,230,200,0.3)]">
              <IconBolt size={24} />
            </span>
            <div>
              <p className="font-display font-extrabold text-3xl leading-none text-[var(--teal)] tabular-nums">+{xp}</p>
              <p className="text-xs font-bold text-[var(--dim)] mt-1">
                {xpGained > 0
                  ? dailyBonusXp > 0
                    ? `XP baru (termasuk bonus harian +${dailyBonusXp} XP)`
                    : "XP baru • dasar 50 + bintang + akurasi"
                  : "Belum ada XP baru — skor harus melampaui hasil terbaikmu"}
              </p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-[var(--line-soft)]" />
          <div className="flex items-center gap-4 flex-1">
            <span className="w-12 h-12 rounded-xl grid place-items-center bg-[rgba(255,194,71,0.12)] text-[var(--amber)] border border-[rgba(255,194,71,0.3)]">
              <IconCoin size={24} />
            </span>
            <div>
              <p className="font-display font-extrabold text-3xl leading-none text-[var(--amber)] tabular-nums">+{coins}</p>
              <p className="text-xs font-bold text-[var(--dim)] mt-1">
                {dailyBonusCoins > 0
                  ? `Koin (termasuk bonus harian +${dailyBonusCoins} koin)`
                  : "Koin • simpan untuk reward samudra"}
              </p>
            </div>
          </div>
          {typeof streakCount === "number" && streakCount > 0 && (
            <>
              <div className="hidden sm:block w-px h-12 bg-[var(--line-soft)]" />
              <div className="flex items-center gap-4 flex-1">
                <span className="w-12 h-12 rounded-xl grid place-items-center bg-[rgba(249,115,22,0.12)] text-[#f97316] border border-[rgba(249,115,22,0.35)] shadow-[0_0_14px_rgba(249,115,22,0.25)]">
                  <IconFlame size={24} />
                </span>
                <div>
                  <p className="font-display font-extrabold text-3xl leading-none text-[#fdba74] tabular-nums">{streakCount} Hari</p>
                  <p className="text-xs font-bold text-[var(--dim)] mt-1">Daily Streak • Api latihan menyala!</p>
                </div>
              </div>
            </>
          )}

          {streakMultiplier > 1 && (
            <>
              <div className="hidden sm:block w-px h-12 bg-[var(--line-soft)]" />
              <div className="flex items-center gap-4 flex-1">
                <span className="w-12 h-12 rounded-xl grid place-items-center bg-[rgba(245,158,11,0.15)] text-[var(--amber)] border border-[rgba(245,158,11,0.4)] shadow-[0_0_16px_rgba(245,158,11,0.25)] shrink-0">
                  <IconSparkles size={24} />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-display font-extrabold text-3xl leading-none text-[var(--amber)] tabular-nums">
                      {streakMultiplier}×
                    </p>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[rgba(245,158,11,0.2)] text-[var(--amber)] border border-[rgba(245,158,11,0.4)]">
                      Permanen
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[var(--dim)] mt-1">
                    {streakTierName ? `${streakTierName} • ` : ""}Bonus (+{streakBonusXp} XP · +{streakBonusCoins} Koin)
                  </p>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ===== preview hasil ===== */}
        <section className="panel mt-8 overflow-hidden anim-fadeUp" style={{ animationDelay: "0.65s" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line-soft)] flex-wrap">
            <span className="flex gap-1.5 mr-1">
              <i className="w-3 h-3 rounded-full bg-[#ff6b57] inline-block" />
              <i className="w-3 h-3 rounded-full bg-[#ffc247] inline-block" />
              <i className="w-3 h-3 rounded-full bg-[#2ee6c8] inline-block" />
            </span>
            <span className="font-code text-xs text-[var(--dim)] bg-[rgba(6,24,41,0.8)] rounded-md px-3 py-1 flex-1 truncate min-w-32">
              preview://hasil-kode/{mod.id}
            </span>
            <div className="flex gap-1.5">
              <button className={`btn !px-3.5 !py-1.5 text-xs ${tab === "preview" ? "btn-primary" : "btn-ghost"}`} onClick={() => { setTab("preview"); setLogs([]); sfx.click(); }}>
                <IconEye size={14} /> Preview
              </button>
              <button className={`btn !px-3.5 !py-1.5 text-xs ${tab === "kode" ? "btn-primary" : "btn-ghost"}`} onClick={() => { setTab("kode"); sfx.click(); }}>
                <IconKeyboard size={14} /> Kode
              </button>
              {showConsole && (
                <button className={`btn !px-3.5 !py-1.5 text-xs ${tab === "konsol" ? "btn-primary" : "btn-ghost"}`} onClick={() => { setTab("konsol"); sfx.click(); }}>
                  <IconConsole size={14} /> Konsol
                </button>
              )}
            </div>
          </div>

          {/* iframe selalu terpasang agar script/konsol tetap hidup saat pindah tab */}
          <iframe
            title="Preview kode"
            srcDoc={mod.preview(mod.code)}
            sandbox="allow-scripts"
            className={`w-full h-[380px] md:h-[430px] bg-white ${tab === "preview" ? "block" : "hidden"}`}
          />
          {tab === "kode" && (
            <div className="p-4">
              <CodePanel code={mod.code} lang={mod.lang} caption="Inilah kode yang baru saja kamu ketik" />
            </div>
          )}
          {tab === "konsol" && showConsole && (
            <div className="p-4 font-code text-sm bg-[rgba(3,13,24,0.9)] min-h-[380px]">
              <p className="text-[var(--faint)] text-xs mb-3 tracking-widest uppercase">Output console.log — coba klik tombol di tab Preview!</p>
              {logs.length === 0 ? (
                <p className="text-[var(--dim)] flex items-center gap-2"><IconConsole size={16} /> Konsol masih kosong…</p>
              ) : (
                logs.map((l, i) => (
                  <p key={i} className="anim-fadeUp py-0.5" style={{ color: l.type === "error" ? "var(--coral)" : l.type === "warn" ? "var(--amber)" : "var(--mint)" }}>
                    <span className="text-[var(--faint)] mr-2">{">"}</span>{l.text}
                  </p>
                ))
              )}
            </div>
          )}

          <div className="px-4 py-3 text-xs text-[var(--dim)] font-semibold border-t border-[var(--line-soft)] flex items-center gap-2">
            <IconCheck size={14} className="text-[var(--teal)]" />
            Halaman ini dibuat 100% dari kode yang kamu ketik. {mod.lang === "js" && "Buka tab Konsol untuk melihat output JavaScript-nya."}
          </div>
        </section>

        {/* ===== aksi ===== */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">
          <button className="btn btn-ghost px-7 py-3" onClick={() => { sfx.click(); onRetry(); }}>
            <IconRetry size={18} /> Ulangi Misi (perbaiki bintang)
          </button>
          <button className="btn btn-primary px-8 py-3" onClick={() => { sfx.click(); onMap(); }}>
            <IconMap size={18} /> Kembali ke Peta Misi
          </button>
        </div>

        {r.stars < 3 && (
          <p className="text-center text-xs text-[var(--faint)] font-semibold mt-4 flex items-center justify-center gap-1.5">
            <IconX size={13} /> {r.accuracy >= 95 ? "" : `Akurasi ${95 - r.accuracy}% lagi untuk bintang 3 `}(≥95%) — hiu menghargai presisi!
          </p>
        )}
      </main>
    </div>
  );
}
