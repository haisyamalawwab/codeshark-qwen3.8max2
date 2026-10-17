import { useEffect, useState } from "react";
import type { DailyChallenge } from "../data/dailyChallenges";
import { getTimeUntilMidnight } from "../data/dailyChallenges";
import type { DailyChallengeRecord } from "../lib/storage";
import { sfx } from "../lib/audio";
import {
  IconTimer, IconCheck, IconArrowR,
  IconBolt, IconCoin, IconFlame, IconTarget, IconRetry, IconCalendar,
} from "./icons";

interface Props {
  challenge: DailyChallenge;
  isCompleted: boolean;
  record: DailyChallengeRecord;
  subGameName: string;
  onStart: () => void;
  onOpenHistory?: () => void;
}

export default function DailyChallengeCard({ challenge, isCompleted, record, subGameName, onStart, onOpenHistory }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeUntilMidnight().formatted);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const difficultyColors = {
    Mudah: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    Sedang: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    Tantangan: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    Master: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  };

  return (
    <article
      className="hud-panel relative overflow-hidden p-5 md:p-6 rounded-2xl transition-all"
      style={{
        background: "linear-gradient(135deg, rgba(8, 26, 46, 0.94) 0%, rgba(13, 34, 58, 0.88) 100%)",
        border: isCompleted
          ? "1px solid rgba(46, 230, 200, 0.4)"
          : "1px solid rgba(245, 158, 11, 0.45)",
        boxShadow: isCompleted
          ? "0 4px 24px rgba(46, 230, 200, 0.12)"
          : "0 4px 24px rgba(245, 158, 11, 0.15)",
      }}
      aria-label="Tantangan Harian"
    >
      {/* Glow ambient background */}
      <div
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none opacity-20 blur-2xl"
        style={{ background: isCompleted ? "var(--teal)" : "#f59e0b" }}
      />

      <div className="relative z-10">
        {/* Header bar: Kategori + Countdown timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[rgba(126,196,236,0.15)]">
          <div className="flex items-center gap-3">
            {/* Lambang Chronometer Harian Samudra */}
            <div
              className="relative w-12 h-12 rounded-2xl grid place-items-center shrink-0 select-none shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              style={{
                background: isCompleted
                  ? "linear-gradient(135deg, rgba(46,230,200,0.22) 0%, rgba(6,22,38,0.9) 100%)"
                  : "linear-gradient(135deg, rgba(255,194,71,0.22) 0%, rgba(6,22,38,0.9) 100%)",
                border: isCompleted
                  ? "1.5px solid rgba(46, 230, 200, 0.55)"
                  : "1.5px solid rgba(245, 158, 11, 0.55)",
              }}
            >
              <svg className="w-8 h-8 overflow-visible" viewBox="0 0 32 32" fill="none">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke={isCompleted ? "#2ee6c8" : "#f59e0b"}
                  strokeWidth="1.2"
                  strokeDasharray="2.5 2"
                  className="animate-spin"
                  style={{ transformOrigin: "16px 16px", animationDuration: "22s" }}
                />
                <circle
                  cx="16"
                  cy="16"
                  r="10.5"
                  fill={isCompleted ? "rgba(46,230,200,0.18)" : "rgba(245,158,11,0.18)"}
                  stroke={isCompleted ? "#2ee6c8" : "#fef08a"}
                  strokeWidth="1"
                />
                {isCompleted ? (
                  <path
                    d="M11 16 L14.5 19.5 L21 13"
                    stroke="#2ee6c8"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <>
                    <path
                      d="M16 8 L17.6 13.2 L22.8 14.8 L17.6 16.4 L16 21.6 L14.4 16.4 L9.2 14.8 L14.4 13.2 Z"
                      fill="#fef08a"
                      stroke="#f59e0b"
                      strokeWidth="0.6"
                    />
                    <circle cx="16" cy="14.8" r="1.6" fill="#ffffff" />
                  </>
                )}
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--amber)]">
                  Tantangan Harian • Daily Challenge
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl md:text-2xl text-white mt-0.5 leading-snug">
                {challenge.title}
              </h3>
            </div>
          </div>

          {/* Header Actions: Tombol Riwayat Misi + Countdown Timer */}
          <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
            {onOpenHistory && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onOpenHistory();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[rgba(126,196,236,0.25)] bg-[rgba(6,22,38,0.7)] text-[var(--teal)] hover:bg-[rgba(46,230,200,0.12)] hover:border-[rgba(46,230,200,0.5)] transition-all cursor-pointer text-xs font-bold shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                title="Buka Log Riwayat Tantangan Harian"
              >
                <IconCalendar size={14} className="text-[var(--teal)]" />
                <span>Log Riwayat</span>
                {((record.history?.length ?? 0) > 0 || record.totalCompleted > 0) && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[rgba(46,230,200,0.2)] text-[10px] font-mono font-bold text-[var(--teal)] border border-[rgba(46,230,200,0.35)]">
                    {record.history?.length || record.totalCompleted}
                  </span>
                )}
              </button>
            )}

            {/* Time-bound countdown */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border shrink-0 text-xs font-bold"
              style={{
                background: isCompleted ? "rgba(46, 230, 200, 0.08)" : "rgba(245, 158, 11, 0.08)",
                borderColor: isCompleted ? "rgba(46, 230, 200, 0.25)" : "rgba(245, 158, 11, 0.3)",
                color: isCompleted ? "var(--teal)" : "#fed7aa",
              }}
              title="Waktu tersisa sebelum tantangan harian berganti pada tengah malam"
            >
              <IconTimer size={15} className={isCompleted ? "text-[var(--teal)]" : "text-[#f59e0b] animate-pulse"} />
              <span>
                {isCompleted ? "Reset dalam:" : "Sisa waktu:"}{" "}
                <strong className="text-white font-mono tabular-nums text-sm">{timeLeft}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Unboxed metadata line (Anti-slop zero-pill rule) */}
        <div className="flex items-center gap-2 text-xs text-[var(--dim)] mt-3 flex-wrap font-medium">
          <span className="text-[var(--teal)] font-bold uppercase">{challenge.lang}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{challenge.topic}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <IconTarget size={13} className="text-amber-400" /> Target Akurasi ≥ {challenge.passAcc}%
          </span>
          {record.totalCompleted > 0 && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              {onOpenHistory ? (
                <button
                  type="button"
                  onClick={() => {
                    sfx.click();
                    onOpenHistory();
                  }}
                  className="text-slate-300 hover:text-[var(--teal)] font-semibold underline underline-offset-2 decoration-[rgba(46,230,200,0.4)] cursor-pointer transition-colors"
                  title="Klik untuk membuka riwayat tantangan harian"
                >
                  Tuntas {record.totalCompleted}×
                </button>
              ) : (
                <span className="text-slate-300 font-semibold">Tuntas {record.totalCompleted}×</span>
              )}
            </>
          )}
        </div>

        {/* Content grid: Deskripsi & Pratinjau Kode */}
        <div className="grid lg:grid-cols-12 gap-4 mt-3.5 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs md:text-sm text-[var(--dim)] leading-relaxed">
                {challenge.intro}
              </p>
              <p className="text-[11px] text-[var(--faint)] mt-2 font-medium">
                💡 <strong className="text-slate-300">Tips:</strong> {challenge.tip}
              </p>
            </div>

            {/* Hadiah Bonus Chips */}
            <div className="mt-4 pt-3 border-t border-[rgba(126,196,236,0.12)] flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-bold text-[var(--faint)] uppercase tracking-wider">Hadiah Bonus:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(46,230,200,0.12)] border border-[rgba(46,230,200,0.35)] text-[var(--teal)] text-xs font-bold tabular-nums">
                <IconBolt size={13} /> +{challenge.bonusXp} XP
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(255,194,71,0.12)] border border-[rgba(255,194,71,0.35)] text-[var(--amber)] text-xs font-bold tabular-nums">
                <IconCoin size={13} /> +{challenge.bonusCoins} Koin
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(249,115,22,0.12)] border border-[rgba(249,115,22,0.35)] text-[#fdba74] text-xs font-bold">
                <IconFlame size={13} /> +1 Streak
              </span>
            </div>
          </div>

          {/* Pratinjau cuplikan kode tugas */}
          <div className="lg:col-span-5 bg-[rgba(4,16,28,0.92)] border border-[rgba(126,196,236,0.18)] rounded-xl p-3 flex flex-col justify-between font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-[var(--faint)] pb-1.5 border-b border-[rgba(126,196,236,0.1)] mb-2 font-sans font-bold">
              <span>Cuplikan Tugas ({challenge.lang.toUpperCase()})</span>
              <span className="text-[var(--teal)]">Tantangan Harian</span>
            </div>
            <pre className="text-slate-300 text-[11.5px] leading-relaxed overflow-x-auto whitespace-pre font-code py-1">
              <code>{challenge.code}</code>
            </pre>
          </div>
        </div>

        {/* Interactive CTA Bar */}
        <div className="mt-5 pt-3.5 border-t border-[rgba(126,196,236,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {isCompleted ? (
            <div className="flex items-center gap-2.5 text-xs text-emerald-300 font-bold flex-wrap">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 grid place-items-center text-emerald-400 border border-emerald-500/40 shrink-0">
                <IconCheck size={13} />
              </span>
              <span>Tantangan hari ini tuntas! Bonus sudah terklaim.</span>
              {typeof record.todayAccuracy === "number" && (
                <span className="text-slate-400 font-medium">
                  (Akurasi {record.todayAccuracy}% · Skor {record.todayScore})
                </span>
              )}
            </div>
          ) : (
            <div className="text-xs text-[var(--dim)] font-medium">
              Selesaikan di arena aktif: <strong className="text-white">{subGameName}</strong>
            </div>
          )}

          <div className="flex items-center gap-2">
            {onOpenHistory && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onOpenHistory();
                }}
                className="btn btn-ghost !text-xs !py-2.5 !px-3.5 flex items-center gap-1.5 border border-[rgba(126,196,236,0.25)] bg-[rgba(6,22,38,0.7)] text-[var(--teal)] hover:bg-[rgba(46,230,200,0.12)] hover:border-[rgba(46,230,200,0.5)] rounded-xl transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                title="Buka Log Riwayat Tantangan Harian & Grafik Progres"
              >
                <IconCalendar size={14} className="text-[var(--teal)]" />
                <span>Riwayat Misi</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sfx.click();
                onStart();
              }}
              className={
                isCompleted
                  ? "btn btn-ghost !text-xs !py-2.5 !px-4 text-slate-300 hover:text-white"
                  : "hud-btn-practice !py-2.5 !px-6 text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(245,158,11,0.3)] !bg-gradient-to-r !from-amber-500 !to-amber-600 !text-slate-950 !border-amber-400/60 hover:brightness-110 active:scale-[0.98]"
              }
            >
              {isCompleted ? (
                <>
                  <IconRetry size={14} /> Latihan Ulang
                </>
              ) : (
                <>
                  Mulai Tantangan Harian <IconArrowR size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
