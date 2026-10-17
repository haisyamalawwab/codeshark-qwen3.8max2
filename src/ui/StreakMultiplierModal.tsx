import { useEffect } from "react";
import type { SaveData } from "../lib/storage";
import { sfx } from "../lib/audio";
import {
  STREAK_MULTIPLIER_TIERS,
  getPermanentStreakTier,
  getNextStreakTier,
} from "../lib/streakMultiplier";
import {
  IconX,
  IconCheck,
  IconFlame,
  IconBolt,
  IconLock,
  IconSparkles,
  IconTarget,
} from "./icons";

interface Props {
  save: SaveData;
  onClose: () => void;
  onStartPractice?: () => void;
}

export default function StreakMultiplierModal({ save, onClose, onStartPractice }: Props) {
  const currentTier = getPermanentStreakTier(save);
  const nextTier = getNextStreakTier(currentTier);

  // Hitung streak tertinggi yang pernah dicapai (latihan atau login)
  const highestStreakDays = Math.max(
    save.streak?.best ?? 0,
    save.streak?.current ?? 0,
    save.loginStreak?.best ?? 0,
    save.loginStreak?.current ?? 0
  );

  // Keyboard shortcut Esc
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        sfx.click();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Perhitungan progres menuju tier berikutnya
  const progressToNext = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((highestStreakDays - currentTier.streakRequired) /
              (nextTier.streakRequired - currentTier.streakRequired)) *
              100
          )
        )
      )
    : 100;

  const daysNeededForNext = nextTier
    ? Math.max(0, nextTier.streakRequired - highestStreakDays)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(2,9,17,0.85)] backdrop-blur-md screen-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[rgba(10,32,54,0.96)] to-[rgba(5,17,29,0.98)] border border-[rgba(245,158,11,0.4)] shadow-[0_0_50px_rgba(245,158,11,0.25)] relative anim-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="multiplier-modal-title"
      >
        {/* ============ HEADER MODAL ============ */}
        <div className="p-5 md:p-6 border-b border-[rgba(126,196,236,0.15)] bg-[rgba(6,22,38,0.7)] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span
              className="w-12 h-12 rounded-2xl grid place-items-center text-2xl shrink-0 border shadow-md"
              style={{
                background: currentTier.badgeBg,
                borderColor: currentTier.color,
                boxShadow: `0 0 20px ${currentTier.glowColor}`,
              }}
            >
              {currentTier.iconChar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--amber)]">
                  Sistem Hadiah Permanen
                </span>
                <span className="text-[10px] text-[var(--faint)]" aria-hidden="true">
                  •
                </span>
                <span className="text-[10px] font-bold text-[var(--teal)]">
                  {currentTier.multiplier}× Multiplier
                </span>
              </div>
              <h2
                id="multiplier-modal-title"
                className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight"
              >
                Streak Multiplier System
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.14)] text-[var(--dim)] hover:text-white grid place-items-center transition-colors cursor-pointer"
            aria-label="Tutup jendela"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* ============ BODY CONTENT (SCROLLABLE) ============ */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Banner Status Pengali Aktif & Jaminan Permanen */}
          <div
            className="p-4 md:p-5 rounded-2xl border relative overflow-hidden"
            style={{
              background: currentTier.badgeBg,
              borderColor: currentTier.color,
              boxShadow: `0 0 25px ${currentTier.glowColor}`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-300">
                  Pengali Aktif Permanen Saat Ini
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display font-extrabold text-3xl md:text-4xl text-white">
                    {currentTier.name}
                  </span>
                  <span
                    className="font-mono font-extrabold text-2xl md:text-3xl"
                    style={{ color: currentTier.color }}
                  >
                    {currentTier.multiplier}×
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1 max-w-md font-medium leading-relaxed">
                  Semua XP dan Koin dari setiap misi yang kamu selesaikan otomatis dikalikan{" "}
                  <strong className="text-white">{currentTier.multiplier}×</strong> (+
                  {currentTier.bonusPercent}% bonus).
                </p>
              </div>

              {/* Jaminan Permanen Badge */}
              <div className="sm:text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(46,230,200,0.15)] border border-[rgba(46,230,200,0.4)] text-[var(--teal)] text-xs font-bold">
                  <IconCheck size={14} />
                  <span>Garansi Permanen</span>
                </div>
                <p className="text-[10px] text-[var(--faint)] mt-1.5 sm:max-w-[170px]">
                  Tidak akan turun meski streak terputus.
                </p>
              </div>
            </div>

            {/* Bilah Progres ke Milestone Berikutnya */}
            {nextTier ? (
              <div className="mt-4 pt-3.5 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <IconTarget size={14} className="text-[var(--amber)]" />
                    <span>
                      Menuju <strong className="text-white">{nextTier.name}</strong> ({nextTier.multiplier}×)
                    </span>
                  </span>
                  <span className="font-mono text-[var(--amber)] font-bold">
                    {highestStreakDays}/{nextTier.streakRequired} Hari ({daysNeededForNext} hari lagi)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[rgba(4,16,28,0.95)] overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-400 to-[#2ee6c8]"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-rose-300 flex items-center gap-2">
                <IconSparkles size={14} />
                <span>Selamat! Kamu telah mencapai Tingkat Pengali Tertinggi Samudra (2.00×)!</span>
              </div>
            )}
          </div>

          {/* ============ JALUR TIER PENGALI (TIER ROAD) ============ */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <IconFlame size={14} className="text-[var(--amber)]" />
                <span>Jalur Tingkatan Pengali Streak</span>
              </span>
              <span className="text-[11px] text-[var(--faint)]">
                Rekor Streakmu: <strong className="text-white font-mono">{highestStreakDays} Hari</strong>
              </span>
            </div>

            <div className="space-y-3">
              {STREAK_MULTIPLIER_TIERS.map((tierItem) => {
                const isUnlocked = highestStreakDays >= tierItem.streakRequired;
                const isCurrent = currentTier.tier === tierItem.tier;

                return (
                  <div
                    key={tierItem.tier}
                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                      isCurrent
                        ? "border-[rgba(46,230,200,0.65)] bg-[rgba(10,36,60,0.9)] shadow-[0_0_20px_rgba(46,230,200,0.2)]"
                        : isUnlocked
                          ? "border-[rgba(126,196,236,0.3)] bg-[rgba(7,24,42,0.7)]"
                          : "border-[rgba(126,196,236,0.12)] bg-[rgba(4,16,28,0.6)] opacity-75"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Sisi Kiri: Icon + Info Tier */}
                      <div className="flex items-start gap-3.5">
                        <span
                          className="w-11 h-11 rounded-2xl grid place-items-center text-xl shrink-0 border shadow-inner mt-0.5"
                          style={{
                            background: isUnlocked ? tierItem.badgeBg : "rgba(15,23,42,0.8)",
                            borderColor: isUnlocked ? tierItem.color : "rgba(126,196,236,0.2)",
                            boxShadow: isUnlocked ? `0 0 14px ${tierItem.glowColor}` : "none",
                          }}
                        >
                          {tierItem.iconChar}
                        </span>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[var(--faint)] uppercase tracking-wider">
                              Tier {tierItem.tier}
                            </span>
                            <span className="text-[var(--faint)]" aria-hidden="true">•</span>
                            <span className="text-xs font-semibold text-slate-300">
                              {tierItem.subtitle}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[rgba(46,230,200,0.2)] text-[var(--teal)] border border-[rgba(46,230,200,0.5)]">
                                Aktif Saat Ini
                              </span>
                            )}
                          </div>

                          <h3 className="font-display font-extrabold text-lg text-white mt-0.5 leading-snug">
                            {tierItem.name}
                          </h3>

                          <p className="text-xs text-[var(--dim)] mt-1 font-medium leading-relaxed">
                            {tierItem.description}
                          </p>
                        </div>
                      </div>

                      {/* Sisi Kanan: Multiplier Badge & Status */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pl-14 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div
                          className="font-mono font-extrabold text-2xl tracking-tight"
                          style={{ color: tierItem.color }}
                        >
                          {tierItem.multiplier}×
                        </div>

                        {isUnlocked ? (
                          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                            <IconCheck size={13} />
                            <span>Terbuka Permanen</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-[var(--faint)] font-bold">
                            <IconLock size={12} />
                            <span>Butuh {tierItem.streakRequired} Hari Streak</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Penjelasan Cara Kerja */}
          <div className="p-4 rounded-2xl bg-[rgba(6,20,34,0.7)] border border-[rgba(126,196,236,0.15)] text-xs text-[var(--dim)] leading-relaxed space-y-2">
            <p className="font-bold text-white flex items-center gap-2">
              <IconSparkles size={14} className="text-[var(--amber)]" />
              <span>Cara Kerja Streak Multiplier:</span>
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                <strong>Login & Latihan Beruntun:</strong> Buka aplikasi dan selesaikan tantangan harian setiap hari untuk menambah hari streak.
              </li>
              <li>
                <strong>Buka Permanen:</strong> Begitu mencapai 3, 7, 14, 21, atau 30 hari streak, pengali XP dan Koin tersebut terkunci <em>permanen</em> di profilmu selamanya.
              </li>
              <li>
                <strong>Berlaku di Semua Misi:</strong> Pengali aktif di Shark Typer, Coding Tower, Materi Teori, Tantangan Harian, hingga Peta Pertemuan!
              </li>
            </ul>
          </div>
        </div>

        {/* ============ FOOTER MODAL ============ */}
        <div className="p-4 px-6 border-t border-[rgba(126,196,236,0.15)] bg-[rgba(6,22,38,0.7)] flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-[var(--faint)] font-medium">
            <IconBolt size={14} className="text-[var(--teal)]" />
            <span>Bonus langsung bertambah di layar hasil koding</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sfx.click();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] text-white transition-colors cursor-pointer"
            >
              Tutup
            </button>
            {onStartPractice && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onClose();
                  onStartPractice();
                }}
                className="hud-btn-practice !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Mulai Koding</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
