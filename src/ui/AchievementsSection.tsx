import { useMemo, useState } from "react";
import type { SaveData } from "../lib/storage";
import {
  TIER_CONFIG,
  getAllAchievementsWithStatus,
  getAchievementSummary,
  type AchievementCategory,
  type AchievementStatus,
} from "../lib/achievements";
import { sfx } from "../lib/audio";
import {
  IconTrophy,
  IconLock,
  IconCheck,
  IconSparkles,
  IconBolt,
  IconCoin,
  IconX,
} from "./icons";

interface Props {
  save: SaveData;
  onClaim: (badgeId: string, rewardXp: number, rewardCoins: number) => void;
}

const CATEGORY_TABS: { id: AchievementCategory; label: string; icon: string }[] = [
  { id: "all", label: "Semua", icon: "🏆" },
  { id: "lines", label: "Baris Kode", icon: "⌨️" },
  { id: "daily", label: "Tantangan Harian", icon: "📅" },
  { id: "speed", label: "Kecepatan & Kombo", icon: "⚡" },
  { id: "adventure", label: "Petualangan", icon: "🌊" },
];

export default function AchievementsSection({ save, onClaim }: Props) {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>("all");
  const [selectedBadge, setSelectedBadge] = useState<AchievementStatus | null>(null);
  const [justClaimedId, setJustClaimedId] = useState<string | null>(null);

  const allStatuses = useMemo(() => getAllAchievementsWithStatus(save), [save]);
  const summary = useMemo(() => getAchievementSummary(save), [save]);

  const filteredBadges = useMemo(() => {
    if (activeCategory === "all") return allStatuses;
    return allStatuses.filter((s) => s.def.category === activeCategory);
  }, [allStatuses, activeCategory]);

  const handleClaim = (status: AchievementStatus, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!status.isUnlocked || status.isClaimed) return;
    setJustClaimedId(status.def.id);
    onClaim(status.def.id, status.def.rewardXp, status.def.rewardCoins);
    window.setTimeout(() => setJustClaimedId(null), 1200);
  };

  return (
    <section className="mt-12 reveal">
      {/* ============ HEADER PRESTASI ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl grid place-items-center bg-[rgba(255,194,71,0.14)] text-[var(--amber)] border border-[rgba(255,194,71,0.45)] shadow-[0_0_18px_rgba(255,194,71,0.25)]">
              <IconTrophy size={20} />
            </span>
            <div>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight leading-tight">
                Prestasi & Lencana
              </h2>
              <p className="text-xs text-[var(--dim)] font-medium">
                Selesaikan milestone seperti <strong className="text-[var(--teal)]">1000 Total Lines Typed</strong> & <strong className="text-[var(--amber)]">Completed 5 Daily Challenges</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Status ringkasan lencana */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="px-4 py-2 rounded-xl bg-[rgba(7,24,42,0.85)] border border-[rgba(69,198,255,0.25)] shadow-inner flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--faint)]">
                Lencana Terbuka
              </p>
              <p className="font-display font-extrabold text-lg text-white leading-none">
                <span className="text-[var(--teal)]">{summary.unlockedCount}</span>
                <span className="text-[var(--dim)]"> / {summary.total}</span>
              </p>
            </div>
            <div className="w-10 h-10 relative grid place-items-center">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[rgba(255,255,255,0.08)]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--teal)] transition-all duration-700 ease-out"
                  strokeDasharray={`${summary.unlockedPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-display font-bold text-[10px] text-white">
                {summary.unlockedPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Hadiah Siap Klaim (jika ada) */}
      {summary.claimableCount > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[rgba(255,194,71,0.2)] via-[rgba(46,230,200,0.15)] to-[rgba(7,24,42,0.85)] border border-[rgba(255,194,71,0.6)] shadow-[0_0_25px_rgba(255,194,71,0.2)] flex flex-wrap items-center justify-between gap-3 anim-pop">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl grid place-items-center bg-[var(--amber)] text-black font-display font-extrabold text-lg shadow-[0_0_15px_rgba(255,194,71,0.7)] animate-bounce">
              🎁
            </span>
            <div>
              <p className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                <span>{summary.claimableCount} Hadiah Lencana Siap Diklaim!</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[rgba(255,194,71,0.25)] text-[var(--amber)]">
                  <IconSparkles size={11} /> Baru
                </span>
              </p>
              <p className="text-xs text-[var(--dim)] mt-0.5">
                Klaim bonus XP dan koin untuk mempercepat kenaikan pangkatmu!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              // Klaim semua lencana yang belum diklaim
              allStatuses
                .filter((s) => s.isUnlocked && !s.isClaimed)
                .forEach((s) => handleClaim(s));
            }}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[var(--amber)] text-black hover:bg-[#ffe082] active:scale-95 transition-all shadow-[0_0_15px_rgba(255,194,71,0.5)] flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
          >
            <IconSparkles size={14} /> Klaim Semua Hadiah
          </button>
        </div>
      )}

      {/* ============ TAB KATEGORI ============ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const active = activeCategory === tab.id;
          const count =
            tab.id === "all"
              ? allStatuses.length
              : allStatuses.filter((s) => s.def.category === tab.id).length;
          const unlockedCount =
            tab.id === "all"
              ? summary.unlockedCount
              : allStatuses.filter((s) => s.def.category === tab.id && s.isUnlocked).length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sfx.click();
                setActiveCategory(tab.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? "bg-[rgba(46,230,200,0.18)] text-[var(--teal)] border border-[rgba(46,230,200,0.6)] shadow-[0_0_14px_rgba(46,230,200,0.25)]"
                  : "bg-[rgba(10,30,48,0.5)] text-[var(--dim)] border border-[rgba(126,196,236,0.18)] hover:text-white hover:border-[rgba(126,196,236,0.35)]"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  active
                    ? "bg-[rgba(46,230,200,0.25)] text-white"
                    : "bg-[rgba(255,255,255,0.06)] text-[var(--faint)]"
                }`}
              >
                {unlockedCount}/{count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============ GRID KARTU LENCANA ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badgeStatus) => {
          const { def, current, target, pct, isUnlocked, isClaimed } = badgeStatus;
          const tier = TIER_CONFIG[def.tier];
          const isJustClaimed = justClaimedId === def.id;

          return (
            <article
              key={def.id}
              onClick={() => {
                sfx.click();
                setSelectedBadge(badgeStatus);
              }}
              className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                isUnlocked
                  ? isClaimed
                    ? "bg-[rgba(8,26,44,0.7)] border-[rgba(46,230,200,0.3)] hover:border-[rgba(46,230,200,0.55)] hover:shadow-[0_0_20px_rgba(46,230,200,0.15)]"
                    : "bg-[rgba(15,35,58,0.85)] border-[rgba(255,194,71,0.65)] shadow-[0_0_22px_rgba(255,194,71,0.2)] hover:border-[rgba(255,194,71,0.9)]"
                  : "bg-[rgba(6,19,33,0.55)] border-[rgba(126,196,236,0.15)] hover:border-[rgba(126,196,236,0.28)] opacity-85 hover:opacity-100"
              } ${isJustClaimed ? "anim-pop ring-2 ring-[var(--amber)]" : ""}`}
            >
              {/* Header Kartu: Ikon & Tier */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Medallion / Badge Avatar */}
                    <div
                      className={`relative w-13 h-13 rounded-2xl grid place-items-center text-2xl shrink-0 transition-transform group-hover:scale-105 border ${
                        isUnlocked
                          ? "shadow-[0_0_18px_rgba(46,230,200,0.3)]"
                          : "grayscale opacity-60"
                      }`}
                      style={{
                        background: isUnlocked ? tier.bgBadge : "rgba(10,25,40,0.6)",
                        borderColor: isUnlocked ? tier.border : "rgba(126,196,236,0.2)",
                      }}
                    >
                      <span>{def.icon}</span>
                      {isUnlocked ? (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--teal)] text-[#031d24] grid place-items-center text-[10px] font-bold shadow-md">
                          <IconCheck size={11} />
                        </span>
                      ) : (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[rgba(6,19,33,0.95)] text-[var(--faint)] border border-[rgba(126,196,236,0.2)] grid place-items-center text-[10px]">
                          <IconLock size={10} />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md"
                          style={{
                            color: tier.text,
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${tier.border}`,
                          }}
                        >
                          {tier.label}
                        </span>
                        {isUnlocked && !isClaimed && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[var(--amber)] text-black animate-pulse">
                            KLAIM!
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-extrabold text-base text-white mt-1 group-hover:text-[var(--teal)] transition-colors leading-tight">
                        {def.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Milestone */}
                <p className="text-xs text-[var(--dim)] leading-relaxed mb-4 line-clamp-2">
                  {def.desc}
                </p>
              </div>

              {/* Bagian Bawah: Progress Bar & Action */}
              <div className="mt-auto pt-2 border-t border-[rgba(126,196,236,0.1)]">
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="text-[var(--faint)]">Progres</span>
                    <span className={isUnlocked ? "text-[var(--teal)]" : "text-white"}>
                      {current.toLocaleString()} / {target.toLocaleString()} {def.unit} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(4,16,28,0.9)] border border-[rgba(126,196,236,0.15)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: isUnlocked
                          ? "linear-gradient(90deg, #2ee6c8, #45c6ff)"
                          : "linear-gradient(90deg, #38bdf8, #0ea5e9)",
                        boxShadow: isUnlocked ? "0 0 10px rgba(46,230,200,0.6)" : "none",
                      }}
                    />
                  </div>
                </div>

                {/* Imbalan & Tombol Klaim */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[var(--teal)]">
                      <IconBolt size={12} /> +{def.rewardXp} XP
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[var(--amber)]">
                      <IconCoin size={12} /> +{def.rewardCoins}
                    </span>
                  </div>

                  {/* Status Button */}
                  {isUnlocked ? (
                    isClaimed ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <IconCheck size={13} /> Terklaim
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleClaim(badgeStatus, e)}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-gradient-to-r from-[#ffc247] to-[#f59e0b] text-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(255,194,71,0.4)] flex items-center gap-1 cursor-pointer"
                      >
                        <IconSparkles size={12} /> Klaim
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] font-bold text-[var(--faint)] flex items-center gap-1">
                      <IconLock size={12} /> Terkunci
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ============ MODAL INSPEKSI DETAIL LENCANA ============ */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(2,9,17,0.85)] backdrop-blur-md screen-in"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[rgba(10,32,54,0.96)] to-[rgba(5,17,29,0.98)] border border-[rgba(46,230,200,0.4)] shadow-[0_0_50px_rgba(46,230,200,0.25)] relative anim-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-[var(--dim)] hover:text-white grid place-items-center transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <IconX size={16} />
            </button>

            {/* Badge Medallion Besar */}
            <div className="text-center pt-2 pb-4">
              <div className="relative inline-block mx-auto mb-4">
                <div
                  className="w-24 h-24 rounded-3xl grid place-items-center text-5xl shadow-[0_0_35px_rgba(46,230,200,0.4)] border-2"
                  style={{
                    background: selectedBadge.isUnlocked
                      ? TIER_CONFIG[selectedBadge.def.tier].bgBadge
                      : "rgba(10,25,40,0.6)",
                    borderColor: selectedBadge.isUnlocked
                      ? TIER_CONFIG[selectedBadge.def.tier].border
                      : "rgba(126,196,236,0.2)",
                  }}
                >
                  <span className={selectedBadge.isUnlocked ? "" : "grayscale opacity-50"}>
                    {selectedBadge.def.icon}
                  </span>
                </div>
                {selectedBadge.isUnlocked && (
                  <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--teal)] text-[#031d24] grid place-items-center shadow-lg">
                    <IconCheck size={18} />
                  </span>
                )}
              </div>

              {/* Rarity & Judul */}
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span
                  className="text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                  style={{
                    color: TIER_CONFIG[selectedBadge.def.tier].text,
                    border: `1px solid ${TIER_CONFIG[selectedBadge.def.tier].border}`,
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  Tingkat {TIER_CONFIG[selectedBadge.def.tier].label}
                </span>
                <span className="text-xs font-bold text-[var(--faint)]">
                  • {selectedBadge.def.category === "lines" ? "Baris Kode" : selectedBadge.def.category === "daily" ? "Tantangan Harian" : selectedBadge.def.category === "speed" ? "Kecepatan" : "Petualangan"}
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white">
                {selectedBadge.def.name}
              </h3>
              <p className="text-xs text-[var(--cyan)] font-mono font-semibold mt-0.5">
                {selectedBadge.def.nameEn}
              </p>

              <p className="text-sm text-[var(--dim)] mt-3 leading-relaxed px-2">
                {selectedBadge.def.desc}
              </p>
            </div>

            {/* Kotak Progres */}
            <div className="p-4 rounded-2xl bg-[rgba(4,14,26,0.8)] border border-[rgba(126,196,236,0.18)] mb-5">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[var(--faint)]">Pencapaian Kamu</span>
                <span className={selectedBadge.isUnlocked ? "text-[var(--teal)]" : "text-white"}>
                  {selectedBadge.current.toLocaleString()} / {selectedBadge.target.toLocaleString()} {selectedBadge.def.unit} ({selectedBadge.pct}%)
                </span>
              </div>
              <div className="h-3 rounded-full bg-[rgba(2,9,17,0.95)] border border-[rgba(126,196,236,0.15)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${selectedBadge.pct}%`,
                    background: selectedBadge.isUnlocked
                      ? "linear-gradient(90deg, #2ee6c8, #ffc247)"
                      : "linear-gradient(90deg, #38bdf8, #0ea5e9)",
                  }}
                />
              </div>

              {selectedBadge.isUnlocked && selectedBadge.claimedAt && (
                <p className="text-[11px] text-[var(--faint)] mt-2 flex items-center gap-1">
                  <IconCheck size={12} className="text-emerald-400" /> Hadiah telah diklaim pada {new Date(selectedBadge.claimedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Imbalan & CTA */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-[rgba(46,230,200,0.1)] border border-[rgba(46,230,200,0.35)] flex items-center gap-1.5 text-xs font-extrabold text-[var(--teal)]">
                  <IconBolt size={14} /> +{selectedBadge.def.rewardXp} XP
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[rgba(255,194,71,0.1)] border border-[rgba(255,194,71,0.35)] flex items-center gap-1.5 text-xs font-extrabold text-[var(--amber)]">
                  <IconCoin size={14} /> +{selectedBadge.def.rewardCoins} Koin
                </div>
              </div>

              {selectedBadge.isUnlocked ? (
                selectedBadge.isClaimed ? (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[rgba(52,211,153,0.15)] text-emerald-400 border border-[rgba(52,211,153,0.4)] cursor-default flex items-center gap-1.5"
                  >
                    <IconCheck size={14} /> Selesai
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      handleClaim(selectedBadge, e);
                      setSelectedBadge((prev) => (prev ? { ...prev, isClaimed: true, claimedAt: Date.now() } : null));
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--amber)] text-black hover:bg-[#ffe082] active:scale-95 transition-all shadow-[0_0_18px_rgba(255,194,71,0.5)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <IconSparkles size={14} /> Klaim Hadiah
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--dim)] hover:text-white bg-[rgba(255,255,255,0.05)] cursor-pointer"
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
