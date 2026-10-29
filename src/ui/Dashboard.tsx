import { useSiteSettings, useEffectiveDataMode } from "../lib/siteSettings";
import DatabaseConnectionStatus from "./DatabaseConnectionStatus";
import LocalStorageStatus from "./LocalStorageStatus";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import type { SaveData } from "../lib/storage";
import { rankOf, RANKS, evaluateStreak } from "../lib/storage";
import type { AgeCfg, ModuleDef } from "../data/modules";
import { MODULES } from "../data/modules";
import { HTML_DOCS } from "../data/materiHtml";
import { sfx } from "../lib/audio";
import {
  IconFin, IconBolt, IconCoin, IconBook, IconKeyboard,
  IconCheck, IconArrowR, IconSound, IconMute,
  IconTarget, IconTimer, IconX, IconFlame, IconHome, IconAward,
} from "./icons";
import { SUBGAMES, SUBGAME_ORDER } from "../data/subgames";
import type { SubGameId } from "../data/subgames";
import { tokenize } from "../lib/highlight";
import { CaptainAvatar } from "../characters";
import { SharkSprite } from "../graphics/stations";
import MiniSpeedometer from "./MiniSpeedometer";
import HudMap from "./HudMap";
import DailyChallengeCard from "./DailyChallengeCard";
import AchievementsSection from "./AchievementsSection";
import RankEmblemArt from "./RankEmblemArt";
import SubGameArtwork from "./SubGameArtwork";
import DaftarMisiSection from "./DaftarMisiSection";
import MissionHistoryModal from "./MissionHistoryModal";
import StreakMultiplierModal from "./StreakMultiplierModal";
import { getPermanentStreakTier } from "../lib/streakMultiplier";
import { getDailyChallenge } from "../data/dailyChallenges";
import { isDailyCompletedToday } from "../lib/storage";

const StreakTrendsVisualizer = lazy(() => import("./StreakTrendsVisualizer"));

interface Props {
  save: SaveData;
  cfg: AgeCfg;
  onMateri: (id: string) => void;
  onPractice: (id: string) => void;
  onDailyChallenge?: (challengeId: string) => void;
  onClaimAchievement?: (badgeId: string, rewardXp: number, rewardCoins: number) => void;
  /** buka Materi HTML berbasis dokumen .md per pertemuan */
  onMateriHtml?: () => void;
  /** buka Peta Pertemuan 16× (quest · drill · juggling) */
  onPeta?: () => void;
  /** arena aktif + pemilih sub-game (hub utama) */
  subGame?: SubGameId;
  isTouch?: boolean;
  onSelectSubGame?: (id: SubGameId) => void;
  onToggleSound: () => void;
  onResetProfile: () => void;
  /** buka halaman Profil & Membership */
  onOpenProfile?: () => void;
}

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

export default function Dashboard({
  save, cfg, onMateri, onPractice, onDailyChallenge, onClaimAchievement, onMateriHtml, onPeta,
  subGame = "shark", isTouch = false, onSelectSubGame, onToggleSound, onResetProfile, onOpenProfile,
}: Props) {
  const settings = useSiteSettings();
  const dataMode = useEffectiveDataMode();
  const revealRef = useReveal();
  const [preview, setPreview] = useState<ModuleDef | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMultiplierModal, setShowMultiplierModal] = useState(false);
  const profile = save.profile!;
  const rank = rankOf(save.xp);
  const streakStatus = evaluateStreak(save.streak);
  const multiplierTier = getPermanentStreakTier(save);
  const dailyChallenge = getDailyChallenge();
  const isDailyDone = isDailyCompletedToday(save);
  const doneCount = MODULES.filter((m) => (save.modules[m.id]?.completions ?? 0) > 0).length;
  const avgAcc = (() => {
    const bests = MODULES.map((m) => save.modules[m.id]?.best).filter(
      (b): b is NonNullable<typeof b> => !!b
    );
    if (!bests.length) return null;
    return Math.round(bests.reduce((a, b) => a + b.accuracy, 0) / bests.length);
  })();
  const hasStats = avgAcc !== null || save.stats.bestWpm > 0 || save.stats.bestCombo > 0;

  return (
    <div ref={revealRef} className="relative z-10 min-h-screen">
      {/* ============ HUD TOPBAR HEADER ============ */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,14,26,0.85)] border-b border-[rgba(69,198,255,0.15)]">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <span className="w-10 h-10 rounded-xl grid place-items-center text-[var(--teal)] bg-[rgba(46,230,200,0.12)] border border-[rgba(46,230,200,0.45)] shadow-[0_0_16px_rgba(46,230,200,0.25)] shrink-0">
            <IconFin size={22} />
          </span>
          <div className="mr-auto leading-tight">
            <p className="font-display font-extrabold tracking-wide text-white text-sm md:text-base">
              CODESHARK <span className="text-[var(--teal)]">ACADEMY</span>
            </p>
            <p className="text-[10px] text-[var(--dim)] font-bold tracking-[0.2em] uppercase">
              PETA MISI • {cfg.label.toUpperCase()}
            </p>
          </div>

          {/* Lencana level + bilah XP ala konsep (Lv 1 · 45/100 XP) */}
          <span
            className="text-xs font-extrabold px-3 py-1.5 rounded-full shrink-0"
            style={{ background: "linear-gradient(135deg,#ffc247,#f59e0b)", color: "#2b1802", boxShadow: "0 0 14px rgba(255,194,71,0.5)" }}
            title={`Rank: ${rank.cur.name}`}
          >
            Lv {RANKS.indexOf(rank.cur) + 1}
          </span>
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 min-w-44"
            style={{ background: "rgba(7,24,42,0.85)", border: "1px solid rgba(46,230,200,0.4)" }}
            title={rank.next ? `${rank.next.xp - save.xp} XP menuju ${rank.next.name}` : "Pangkat tertinggi"}
            role="progressbar"
            aria-valuenow={rank.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progres XP"
          >
            <div className="w-24 h-2 rounded-full overflow-hidden bg-[rgba(4,16,28,0.95)]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(4, rank.pct)}%`, background: "linear-gradient(90deg,#2ee6c8,#45c6ff)", boxShadow: "0 0 8px rgba(46,230,200,0.7)" }}
              />
            </div>
            <span className="text-[11px] font-extrabold text-[var(--teal)] whitespace-nowrap">
              {save.xp} / {rank.next ? rank.next.xp : "MAX"} XP
            </span>
          </div>

          {/* Chip Koin — XP sudah tampil di bilah progres, jangan ganda */}
          <div className="chip !bg-[rgba(7,24,42,0.85)] !border-[rgba(255,194,71,0.35)] !text-[var(--amber)] shadow-[0_2px_10px_rgba(0,0,0,0.25)]" title="Koin">
            <IconCoin size={15} /> {save.coins}
          </div>

          {/* Chip Daily Streak */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setShowMultiplierModal(true);
            }}
            className="chip !bg-[rgba(7,24,42,0.85)] !border-[rgba(249,115,22,0.4)] !text-[#fdba74] shadow-[0_2px_10px_rgba(249,115,22,0.2)] flex items-center gap-1.5 cursor-pointer hover:border-amber-400/80 hover:scale-105 active:scale-95 transition-all"
            title={
              streakStatus.practicedToday
                ? `Daily Streak: ${streakStatus.current} hari berturut-turut! Target hari ini sudah selesai. Klik untuk melihat sistem Streak Multiplier.`
                : streakStatus.current > 0
                  ? `Daily Streak: ${streakStatus.current} hari aktif! Latihan sekarang agar streak tidak putus. Klik untuk melihat sistem Streak Multiplier.`
                  : "Mulai Daily Streak pertamamu hari ini! Klik untuk melihat sistem Streak Multiplier."
            }
          >
            <IconFlame
              size={15}
              className={streakStatus.current > 0 ? "text-[#f97316] animate-pulse" : "text-slate-400 opacity-60"}
            />
            <span className="font-extrabold text-xs tabular-nums text-white">
              {streakStatus.current}
            </span>
            <span className="text-[10px] uppercase font-bold text-amber-200/80 hidden xs:inline">
              Hari
            </span>
          </button>

          {/* Chip Streak Multiplier Permanen */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setShowMultiplierModal(true);
            }}
            className="chip flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
            style={{
              background: multiplierTier.tier > 0 ? multiplierTier.badgeBg : "rgba(7,24,42,0.85)",
              borderColor: multiplierTier.color,
              boxShadow: `0 0 12px ${multiplierTier.glowColor}`,
              color: multiplierTier.color,
            }}
            title={`Streak Multiplier: ${multiplierTier.multiplier}× (${multiplierTier.name}) - Klik untuk rincian bonus permanen`}
          >
            <span className="text-xs leading-none">{multiplierTier.iconChar}</span>
            <span className="font-extrabold text-xs tabular-nums text-white">
              {multiplierTier.multiplier}×
            </span>
            <span className="text-[10px] uppercase font-bold text-amber-200/90 hidden xs:inline">
              XP
            </span>
          </button>

          {/* Tombol Profil & Membership, Suara, Ganti Profil */}
          {onOpenProfile && (
            <button
              className="btn btn-ghost !px-3 !py-2 !rounded-xl !bg-[rgba(10,34,56,0.5)] !border-[rgba(46,230,200,0.35)]"
              onClick={() => { sfx.click(); onOpenProfile(); }}
              aria-label="Buka halaman Profil dan Membership"
              title="Profil & Membership — XP, badge, achievement, atensi, dan status database"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--teal)]">
                <IconAward size={15} /> Profil
              </span>
            </button>
          )}
          <button className="btn btn-ghost !p-2 !rounded-xl !bg-[rgba(10,34,56,0.5)] !border-[rgba(126,196,236,0.2)]" onClick={onToggleSound} aria-label="Suara">
            {profile.sound ? <IconSound size={17} /> : <IconMute size={17} />}
          </button>
          <button className="btn btn-ghost !p-2 !rounded-xl !bg-[rgba(10,34,56,0.5)] !border-[rgba(126,196,236,0.2)]" onClick={() => setConfirmReset(true)} aria-label="Ganti Profil">
            <IconHome size={17} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        {dataMode.mode === "cloud" ? <DatabaseConnectionStatus /> : <LocalStorageStatus />}
        {/* ============ HERO KARTU PROFIL KAPTEN (HUD STYLE) ============ */}
        <section className="hud-hero-card mt-7 p-6 md:p-8 relative overflow-hidden screen-in">
          {/* Ambient Glow di belakang kartu */}
          <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full pointer-events-none opacity-20" style={{ background: `radial-gradient(circle, var(--teal), transparent 70%)` }} />
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full pointer-events-none opacity-15" style={{ background: `radial-gradient(circle, #45c6ff, transparent 70%)` }} />
          {/* Hiu sprite melayang ala mockup HUD */}
          <div className="absolute right-4 md:right-10 top-4 pointer-events-none hidden sm:block anim-bob" aria-hidden="true">
            <SharkSprite width={132} />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-7 relative z-10">
            {/* Sisi Kiri: Avatar Kapten dengan Bingkai Hologram Cyber + Sapaan & Progress Rank */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 flex-1 min-w-0">
              <div className="relative shrink-0 p-2">
                {/* Cincin Sonar Hologram Berputar */}
                <div
                  className="absolute inset-0 rounded-full border border-[rgba(46,230,200,0.4)] pointer-events-none animate-spin"
                  style={{ animationDuration: "28s", borderStyle: "dashed" }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-1 rounded-full border border-[rgba(69,198,255,0.25)] pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative rounded-full p-1 bg-gradient-to-b from-[rgba(46,230,200,0.3)] via-[rgba(6,24,42,0.85)] to-[rgba(10,36,60,0.9)] shadow-[0_0_28px_rgba(46,230,200,0.35)]">
                  <CaptainAvatar size={120} className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.65)]" />
                  {/* Badge Lambang Pangkat Mini di Sudut Bawah Avatar */}
                  <div
                    className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[rgba(6,22,38,0.95)] border border-[rgba(255,194,71,0.7)] shadow-[0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer hover:scale-110 transition-transform"
                    title={`Pangkat Samudra: ${rank.cur.name}`}
                  >
                    <RankEmblemArt rank={rank.cur.name} size={36} animated={false} />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-1 flex-wrap">
                  <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight">
                    Kapten {profile.name}
                  </h1>
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[rgba(6,24,42,0.85)] border border-[rgba(126,196,236,0.25)] text-[var(--dim)]">
                    {cfg.range}
                  </span>
                </div>
                {doneCount === MODULES.length && (
                  <p className="text-xs font-semibold text-[var(--teal)] tracking-wide mt-1">
                    Semua misi selesai — luar biasa!
                  </p>
                )}

                {/* Info Rank & Kebutuhan XP */}
                <div className="mt-3.5 flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[rgba(255,194,71,0.14)] border border-[rgba(255,194,71,0.5)] text-[var(--amber)] text-xs font-extrabold shadow-[0_0_14px_rgba(255,194,71,0.2)]">
                    <RankEmblemArt rank={rank.cur.name} size={18} animated={false} />
                    <span>Rank: {rank.cur.name}</span>
                  </span>

                  {/* Lencana 'Daily Streak' */}
                  <button
                    type="button"
                    onClick={() => {
                      sfx.click();
                      setShowMultiplierModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[rgba(249,115,22,0.12)] border border-[rgba(249,115,22,0.45)] text-[#fed7aa] text-xs font-bold shadow-[0_0_14px_rgba(249,115,22,0.18)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    title={
                      streakStatus.practicedToday
                        ? `Luar biasa! Kamu telah latihan ${streakStatus.current} hari berturut-turut. Klik untuk melihat sistem Streak Multiplier.`
                        : streakStatus.current > 0
                          ? `Streak aktif ${streakStatus.current} hari. Selesaikan 1 latihan hari ini untuk menjaga streak! Klik untuk melihat sistem Streak Multiplier.`
                          : "Selesaikan 1 misi latihan hari ini untuk menyalakan Daily Streak pertamamu!"
                    }
                  >
                    <IconFlame
                      size={15}
                      className={streakStatus.current > 0 ? "text-[#f97316] animate-pulse" : "text-slate-400 opacity-60"}
                    />
                    <span>
                      Daily Streak: <strong className="text-white font-extrabold tabular-nums">{streakStatus.current} Hari</strong>
                    </span>
                    {streakStatus.practicedToday ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                        <IconCheck size={11} /> Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                        ⚡ Hari Ini
                      </span>
                    )}
                    {streakStatus.best > 0 && (
                      <span className="text-[11px] text-amber-200/70 font-semibold hidden md:inline">
                        (Rekor: {streakStatus.best})
                      </span>
                    )}
                  </button>

                  {/* Lencana 'Streak Multiplier' Permanen */}
                  <button
                    type="button"
                    onClick={() => {
                      sfx.click();
                      setShowMultiplierModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    style={{
                      background: multiplierTier.badgeBg,
                      border: `1px solid ${multiplierTier.color}`,
                      boxShadow: `0 0 16px ${multiplierTier.glowColor}`,
                      color: multiplierTier.color,
                    }}
                    title={`Buka rincian Streak Multiplier (${multiplierTier.multiplier}×)`}
                  >
                    <span className="text-sm leading-none">{multiplierTier.iconChar}</span>
                    <span>
                      Bonus: <strong className="text-white font-extrabold">{multiplierTier.multiplier}×</strong>
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-400/40">
                      Permanen
                    </span>
                  </button>

                  {/* Chip Membership → halaman Profil & Membership */}
                  {onOpenProfile && (
                    <button
                      type="button"
                      onClick={() => { sfx.click(); onOpenProfile(); }}
                      className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[rgba(46,230,200,0.1)] border border-[rgba(46,230,200,0.45)] text-[#a7f3ea] text-xs font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      title="Buka Profil & Membership: hasil gamifikasi, badge, achievement, atensi, dan kesiapan database"
                    >
                      <IconAward size={14} />
                      <span>
                        Membership:{" "}
                        <strong className="text-white font-extrabold">
                          {save.membership?.plan === "pro" ? "Kapten Pro" : save.membership?.plan === "kelas" ? "Peserta Kelas" : "Penjelajah Bebas"}
                        </strong>
                        {save.membership?.cohortCode ? ` · ${save.membership.cohortCode}` : ""}
                      </span>
                    </button>
                  )}

                  {rank.next ? (
                    <span className="text-xs text-[var(--dim)] font-semibold">
                      <strong className="text-white">{rank.next.xp - save.xp} XP</strong> lagi menuju <span className="text-[var(--teal)] font-bold">{rank.next.name}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--teal)] font-bold">Pangkat Tertinggi Samudra!</span>
                  )}
                </div>

                {/* Progress Bar Gradien Cyan -> Amber */}
                <div className="mt-3 max-w-md w-full">
                  <div className="h-2.5 rounded-full bg-[rgba(4,16,28,0.95)] border border-[rgba(126,196,236,0.18)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(4, rank.pct)}%`,
                        background: "linear-gradient(90deg, #2ee6c8 0%, #45c6ff 60%, #ffc247 100%)",
                        boxShadow: "0 0 10px rgba(46, 230, 200, 0.6)",
                      }}
                    />
                  </div>
                </div>

                {/* Kalimat Motivasi Daily Streak & Total Baris Kode */}
                <div className="mt-2.5 text-xs flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 font-medium">
                  {streakStatus.practicedToday ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      Target hari ini selesai! Daily Streak kamu bertambah {streakStatus.current} hari berturut-turut.
                    </span>
                  ) : streakStatus.current > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Api latihan masih menyala! Selesaikan 1 misi hari ini agar streak {streakStatus.current} hari tidak putus.
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[var(--dim)]">
                      <IconFlame size={13} className="text-[#f97316]" /> Selesaikan 1 misi latihan hari ini untuk menyalakan Daily Streak!
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-[var(--teal)] font-mono text-[11px] bg-[rgba(46,230,200,0.08)] px-2.5 py-0.5 rounded-full border border-[rgba(46,230,200,0.25)]">
                    <IconKeyboard size={12} /> {(save.stats.linesTyped || 0).toLocaleString()} baris kode
                  </span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: HUD Stats — 1 sumber kebenaran, sembunyikan jika masih 0 */}
            <div className="grid grid-cols-2 gap-3 lg:w-72 shrink-0">
              {/* Card 1: MISI MODUL (denominator 3 = modul, bukan 16 pertemuan) */}
              <div className="hud-stat-box p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[var(--teal)]">
                  <IconBook size={18} />
                  <span className="font-display font-extrabold text-2xl text-white leading-none">
                    {doneCount}/{MODULES.length}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)] mt-2">
                  MISI
                </p>
              </div>

              {hasStats ? (
                <>
              {/* Card 2: AKURASI */}
              <div className="hud-stat-box p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[var(--teal)]">
                  <IconTarget size={19} />
                  <span className="font-display font-extrabold text-2xl text-[var(--teal)] leading-none">
                    {avgAcc === null ? "—" : `${avgAcc}%`}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)] mt-2">
                  AKURASI
                </p>
              </div>

              {/* Card 3: WPM TERBAIK (dengan mini speedometer) */}
              <div className="hud-stat-box p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-2xl text-white leading-none">
                    {save.stats.bestWpm || "—"}
                  </span>
                  <MiniSpeedometer val={save.stats.bestWpm || 0} max={100} />
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <IconTimer size={13} className="text-[var(--cyan)]" />
                  <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)]">
                    WPM
                  </p>
                </div>
              </div>

              {/* Card 4: COMBO MAKS */}
              <div className="hud-stat-box hud-stat-box-amber p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[var(--amber)]">
                  <IconBolt size={20} />
                  <span className="font-display font-extrabold text-2xl text-[var(--amber)] leading-none">
                    {save.stats.bestCombo || "—"}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)] mt-2">
                  COMBO
                </p>
              </div>
                </>
              ) : (
              <div className="hud-stat-box p-3.5 flex flex-col justify-center">
                <p className="text-xs font-bold text-[var(--dim)] leading-relaxed">
                  Selesaikan Misi 01 untuk membuka statistik.
                </p>
              </div>
              )}

              {/* Card: akses cepat Materi HTML */}
              {onMateriHtml && (
                <button
                  type="button"
                  onClick={() => { sfx.click(); onMateriHtml(); }}
                  title={`Materi HTML: ${HTML_DOCS.map((d) => `P${d.no}`).join(" · ")}`}
                  className="hud-stat-box hud-stat-box-html p-3.5 flex flex-col justify-between text-left cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center justify-between" style={{ color: "#7ee4ff" }}>
                    <IconBook size={18} />
                    <span className="font-display font-extrabold text-lg leading-none" style={{ color: "#7ee4ff" }}>
                      P1–P6
                    </span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)] mt-2">
                    MATERI HTML
                  </p>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ============ TANTANGAN HARIAN (DAILY CHALLENGE) ============ */}
        <section className="mt-8 reveal">
          <DailyChallengeCard
            challenge={dailyChallenge}
            isCompleted={isDailyDone}
            record={save.dailyChallenge}
            subGameName={SUBGAMES[subGame].name}
            onStart={() => {
              if (onDailyChallenge) onDailyChallenge(dailyChallenge.id);
              else onPractice(dailyChallenge.id);
            }}
            onOpenHistory={() => setShowHistoryModal(true)}
          />
        </section>

        {/* ============ TREN KONSISTENSI & STREAK 7 HARI (STREAK TRENDS) ============ */}
        <section className="mt-8 reveal">
          <Suspense
            fallback={
              <div className="p-6 rounded-2xl bg-[#071d2e]/80 border border-cyan-500/20 text-center text-xs text-cyan-300">
                Memuat grafik tren aktivitas…
              </div>
            }
          >
            <StreakTrendsVisualizer
              save={save}
              streakStatus={streakStatus}
              onStartDaily={() => {
                if (onDailyChallenge) onDailyChallenge(dailyChallenge.id);
                else onPractice(dailyChallenge.id);
              }}
              onOpenHistory={() => setShowHistoryModal(true)}
              onOpenMultiplier={() => setShowMultiplierModal(true)}
            />
          </Suspense>
        </section>

        {/* ============ PRESTASI & LENCANA (ACHIEVEMENTS) ============ */}
        <div id="achievements-section">
          <AchievementsSection
            save={save}
            onClaim={onClaimAchievement ?? (() => {})}
          />
        </div>

        {/* ============ PETA MISI HUD ============ */}
        <section className="mt-8 reveal">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight shrink-0">
              Peta Misi
            </h2>
            <span className="h-[1px] flex-1 bg-[rgba(69,198,255,0.2)]" />
            <span className="chip shrink-0 hidden sm:inline-flex">
              🗺️ 16 pertemuan
            </span>
          </div>
          <HudMap
            save={save}
            onNode={() => { sfx.click(); onPeta?.(); }}
          />
        </section>

        {/* ============ HUB SUB-GAME: pilih arena dulu ============ */}
        <section className="mt-10 reveal">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight shrink-0">
              Pilih Sub-Game
            </h2>
            <span className="h-[1px] flex-1 bg-[rgba(69,198,255,0.2)]" />
            <span className="chip shrink-0">
              Aktif: <strong className="text-[var(--teal)]">{SUBGAMES[subGame].name}</strong>
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {SUBGAME_ORDER.filter(id => settings.games[id]).map((id) => {
              const g = SUBGAMES[id];
              const active = subGame === id;
              const recommended = isTouch && id === "tower";
              return (
                <article
                  key={id}
                  className={`arena-card ${active ? "arena-active" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <SubGameArtwork id={id} active={active} size={58} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-extrabold text-xl text-white leading-tight">{g.name}</h3>
                        {active && (
                          <span className="chip !text-[var(--teal)] !border-[rgba(46,230,200,0.5)] !py-0.5 !text-[11px]">
                            <IconCheck size={12} /> Aktif
                          </span>
                        )}
                        {recommended && !active && (
                          <span className="chip !text-[var(--amber)] !border-[rgba(255,194,71,0.5)] !py-0.5 !text-[11px]">
                            Disarankan di HP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-[var(--cyan)] mt-0.5">{g.tagline}</p>
                      <p className="text-xs md:text-sm text-[var(--dim)] mt-1.5 leading-relaxed">{g.desc}</p>
                      <ul className="flex flex-wrap gap-1.5 mt-2.5">
                        {g.points.map((p) => (
                          <li key={p} className="hud-chip !text-[11px]">{p}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        disabled={active && !onPeta}
                        onClick={() => { sfx.click(); onSelectSubGame?.(id); if (!active) return; onPeta?.(); }}
                        className="mt-3.5 w-full sm:w-auto px-6 py-2.5 text-sm justify-center hud-btn-practice"
                      >
                        {active ? <>Lanjut ke Peta <IconArrowR size={15} /></> : g.cta}
                      </button>
                      {!active && onPeta && (
                        <p className="text-[11px] text-[var(--faint)] font-semibold mt-1.5">Ketuk untuk pilih.</p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="text-[11px] text-[var(--faint)] font-semibold mt-2.5">
            Progres berlaku untuk dua mode.
          </p>
        </section>

        {/* ============ KURIKULUM 16 PERTEMUAN ============ */}
        {onPeta && (
          <section className="mt-10 reveal">
            <button
              type="button"
              onClick={() => { sfx.click(); onPeta(); }}
              className="w-full text-left hud-panel p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="w-14 h-14 shrink-0 rounded-2xl grid place-items-center bg-[rgba(255,194,71,0.12)] border border-[rgba(255,194,71,0.5)] text-[var(--amber)]">
                <IconKeyboard size={26} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--amber)]">Kurikulum • 16 pertemuan • {SUBGAMES[subGame].name}</p>
                <h2 className="font-display font-extrabold text-xl md:text-2xl text-white">Kurikulum 16 Pertemuan</h2>
                <p className="text-xs md:text-sm text-[var(--dim)] mt-0.5">
                  Belajar berurutan: materi → praktik sebagai <strong>{subGame === "tower" ? "Susun Menara 🧱" : "Shark Typer ⌨️"}</strong>.
                </p>
              </div>
              <span className="btn btn-primary !py-2.5 !px-5 shrink-0 justify-center">Buka Peta <IconArrowR size={15} /></span>
            </button>
          </section>
        )}

        {/* ============ DAFTAR MISI ============ */}
        <DaftarMisiSection
          save={save}
          subGame={subGame}
          onMateri={onMateri}
          onPractice={onPractice}
          onSelectSubGame={onSelectSubGame}
          onPreview={(m) => setPreview(m)}
          onOpenHistory={() => setShowHistoryModal(true)}
          onOpenMultiplier={() => setShowMultiplierModal(true)}
        />

        {/* Footer info progres */}
        <p className="text-center text-xs text-[var(--faint)] mt-16 font-medium reveal">
          Otomatis tersimpan di perangkat ini.
        </p>
      </main>

      {/* ============ MODAL PREVIEW ============ */}
      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(2,9,17,0.85)] backdrop-blur-md screen-in" onClick={() => setPreview(null)}>
          <div className="panel w-full max-w-3xl overflow-hidden anim-pop border-[rgba(46,230,200,0.35)] shadow-[0_0_30px_rgba(46,230,200,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line-soft)] bg-[rgba(6,22,38,0.7)]">
              <span className="flex gap-1.5">
                <i className="w-3 h-3 rounded-full bg-[#ff6b57] inline-block" />
                <i className="w-3 h-3 rounded-full bg-[#ffc247] inline-block" />
                <i className="w-3 h-3 rounded-full bg-[#2ee6c8] inline-block" />
              </span>
              <span className="font-code text-xs text-[var(--dim)] bg-[rgba(4,14,26,0.85)] rounded-md px-3 py-1 ml-2 flex-1 truncate">
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
            <div className="px-4 py-3 text-xs text-[var(--dim)] font-semibold border-t border-[var(--line-soft)] bg-[rgba(6,22,38,0.7)]">
              Inilah halaman yang kodenya kamu ketik di misi {preview.title}. {preview.lang === "js" && "Coba klik tombolnya!"}
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL RESET ============ */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(2,9,17,0.85)] backdrop-blur-md screen-in" onClick={() => setConfirmReset(false)}>
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

      {/* ============ MODAL RIWAYAT MISI (MISSION HISTORY) ============ */}
      {showHistoryModal && (
        <MissionHistoryModal
          record={save.dailyChallenge}
          isTodayCompleted={isDailyDone}
          onClose={() => setShowHistoryModal(false)}
          onStartToday={() => {
            setShowHistoryModal(false);
            if (onDailyChallenge) onDailyChallenge(dailyChallenge.id);
            else onPractice(dailyChallenge.id);
          }}
        />
      )}

      {/* ============ MODAL STREAK MULTIPLIER ============ */}
      {showMultiplierModal && (
        <StreakMultiplierModal
          save={save}
          onClose={() => setShowMultiplierModal(false)}
          onStartPractice={() => {
            setShowMultiplierModal(false);
            if (!isDailyDone) {
              if (onDailyChallenge) onDailyChallenge(dailyChallenge.id);
              else onPractice(dailyChallenge.id);
            } else {
              const first = MODULES.find(m => settings.modules[m.id as keyof typeof settings.modules]);
              if (first) onPractice(first.id);
            }
          }}
        />
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
