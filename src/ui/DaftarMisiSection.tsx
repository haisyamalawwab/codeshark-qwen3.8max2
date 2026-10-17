import { useMemo, useState } from "react";
import type { SaveData } from "../lib/storage";
import { MODULES, type ModuleDef } from "../data/modules";
import { sfx } from "../lib/audio";
import type { SubGameId } from "../data/subgames";
import { tokenize } from "../lib/highlight";
import {
  IconCheck,
  IconLock,
  IconBook,
  IconKeyboard,
  IconTower,
  IconEye,
  IconArrowR,
  IconStar,
  IconStarLine,
  IconTimer,
  IconRetry,
  IconCode,
  IconChevronDown,
  IconChevronUp,
  IconCalendar,
  IconBolt,
  IconCoin,
} from "./icons";
import { getPermanentStreakTier } from "../lib/streakMultiplier";

interface Props {
  save: SaveData;
  subGame?: SubGameId;
  onMateri: (id: string) => void;
  onPractice: (id: string) => void;
  onSelectSubGame?: (id: SubGameId) => void;
  onPreview: (mod: ModuleDef) => void;
  onOpenHistory?: () => void;
  onOpenMultiplier?: () => void;
}

type FilterTab = "all" | "active" | "completed";

export default function DaftarMisiSection({
  save,
  subGame = "shark",
  onMateri,
  onPractice,
  onSelectSubGame,
  onPreview,
  onOpenHistory,
  onOpenMultiplier,
}: Props) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status pengali streak permanen saat ini
  const multiplierTier = getPermanentStreakTier(save);

  // Perhitungan statistik progres kurikulum dasar
  const stats = useMemo(() => {
    let completedCount = 0;
    let totalScore = 0;
    let totalStars = 0;

    MODULES.forEach((m) => {
      const prog = save.modules[m.id];
      if (prog && prog.completions > 0) {
        completedCount++;
        totalScore += prog.best?.score ?? 0;
        totalStars += prog.best?.stars ?? 0;
      }
    });

    const pct = Math.round((completedCount / MODULES.length) * 100);
    return { completedCount, totalScore, totalStars, pct };
  }, [save.modules]);

  // Evaluasi status tiap modul
  const moduleStatuses = useMemo(() => {
    return MODULES.map((m, idx) => {
      const prog = save.modules[m.id] ?? { materiDone: false, quizXp: 0, completions: 0 };
      const prevDone = idx === 0 || (save.modules[MODULES[idx - 1].id]?.completions ?? 0) > 0;
      const unlocked = prevDone;
      const done = prog.completions > 0;
      const isCurrentActive = unlocked && !done;

      return {
        mod: m,
        prog,
        unlocked,
        done,
        isCurrentActive,
        idx,
      };
    });
  }, [save.modules]);

  // Filter modul berdasarkan tab
  const filteredModules = useMemo(() => {
    if (filter === "completed") return moduleStatuses.filter((s) => s.done);
    if (filter === "active") return moduleStatuses.filter((s) => s.isCurrentActive || (!s.done && s.unlocked));
    return moduleStatuses;
  }, [moduleStatuses, filter]);

  // Cuplikan topik inti per modul dari data slide
  const getModuleTopics = (m: ModuleDef): string[] => {
    if (m.id === "html") return ["Tag pembuka & penutup", "Judul <h1> & Paragraf <p>", "Daftar berurutan <ul> & <li>"];
    if (m.id === "css") return ["Selektor tag & class", "Warna latar background", "Tata letak & border-radius"];
    if (m.id === "js") return ["querySelector & DOM", "addEventListener('click')", "State dinamis textContent"];
    return m.slides.map((s) => s.title).slice(0, 3);
  };

  const toggleExpand = (id: string) => {
    sfx.click();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mt-14 reveal select-none" id="daftar-misi">
      {/* ============ HEADER DAFTAR MISI ============ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl grid place-items-center bg-[rgba(69,198,255,0.12)] text-[var(--cyan)] border border-[rgba(69,198,255,0.35)] shadow-[0_0_18px_rgba(69,198,255,0.2)]">
              <IconCode size={20} />
            </span>
            <div>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight leading-none">
                Daftar Misi Kurikulum
              </h2>
              <p className="text-xs text-[var(--dim)] mt-1 font-medium">
                Alur bertahap: Pelajari Teori → Arena Koding Praktik → Hasil Jadi
              </p>
            </div>
          </div>
        </div>

        {/* Ringkasan Progres & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Tombol Akses Riwayat Misi */}
          {onOpenHistory && (
            <button
              type="button"
              onClick={() => {
                sfx.click();
                onOpenHistory();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[rgba(126,196,236,0.25)] bg-[rgba(6,22,38,0.85)] text-[var(--teal)] hover:bg-[rgba(46,230,200,0.12)] hover:border-[rgba(46,230,200,0.5)] transition-all cursor-pointer text-xs font-bold shrink-0 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              title="Buka Log Riwayat Misi & Tantangan Harian"
            >
              <IconCalendar size={14} className="text-[var(--teal)]" />
              <span>Log Riwayat</span>
              {(save.dailyChallenge?.history?.length ?? 0) > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[rgba(46,230,200,0.2)] text-[10px] font-mono font-bold text-[var(--teal)] border border-[rgba(46,230,200,0.35)]">
                  {save.dailyChallenge.history?.length}
                </span>
              )}
            </button>
          )}

          {/* Tombol Akses Streak Multiplier Permanen */}
          {onOpenMultiplier && (
            <button
              type="button"
              onClick={() => {
                sfx.click();
                onOpenMultiplier();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-bold shrink-0 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              style={{
                background: multiplierTier.tier > 0 ? multiplierTier.badgeBg : "rgba(6,22,38,0.85)",
                borderColor: multiplierTier.color,
                color: multiplierTier.color,
                boxShadow: multiplierTier.tier > 0 ? `0 0 14px ${multiplierTier.glowColor}` : undefined,
              }}
              title="Buka Rincian Sistem Streak Multiplier Permanen"
            >
              <span className="text-sm leading-none">{multiplierTier.iconChar}</span>
              <span>{multiplierTier.multiplier}× Multiplier</span>
              {multiplierTier.tier > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-extrabold text-amber-200 border border-amber-400/40">
                  +{multiplierTier.bonusPercent}%
                </span>
              ) : (
                <span className="text-[10px] text-[var(--faint)] font-normal hidden sm:inline">
                  (Dasar)
                </span>
              )}
            </button>
          )}

          {/* Progress pill indicator */}
          <div className="px-3.5 py-1.5 rounded-xl bg-[rgba(6,22,38,0.85)] border border-[rgba(126,196,236,0.22)] shadow-inner flex items-center gap-2.5 text-xs font-bold">
            <span className="text-[var(--dim)]">Tuntas:</span>
            <span className="text-[var(--teal)] font-mono text-sm">{stats.completedCount}/{MODULES.length}</span>
            <div className="w-14 h-2 rounded-full bg-[rgba(4,16,28,0.9)] overflow-hidden border border-[rgba(126,196,236,0.2)]">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#2ee6c8] to-[#45c6ff]"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-[rgba(6,22,38,0.85)] border border-[rgba(126,196,236,0.2)] rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { sfx.click(); setFilter("all"); }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[rgba(46,230,200,0.2)] text-[var(--teal)] border border-[rgba(46,230,200,0.5)] shadow-sm"
                  : "text-[var(--dim)] hover:text-white"
              }`}
            >
              Semua ({MODULES.length})
            </button>
            <button
              type="button"
              onClick={() => { sfx.click(); setFilter("active"); }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === "active"
                  ? "bg-[rgba(255,194,71,0.2)] text-[var(--amber)] border border-[rgba(255,194,71,0.5)] shadow-sm"
                  : "text-[var(--dim)] hover:text-white"
              }`}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => { sfx.click(); setFilter("completed"); }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === "completed"
                  ? "bg-[rgba(46,230,200,0.2)] text-[var(--teal)] border border-[rgba(46,230,200,0.5)] shadow-sm"
                  : "text-[var(--dim)] hover:text-white"
              }`}
            >
              Selesai ({stats.completedCount})
            </button>
          </div>
        </div>
      </div>

      {/* ============ TIMELINE & KARTU MISI ============ */}
      <div className="relative pl-8 md:pl-12">
        {/* Garis Vertikal Latar Belakang */}
        <div
          className="absolute left-3.5 md:left-5 top-8 bottom-8 w-[2px] bg-gradient-to-b from-[rgba(46,230,200,0.6)] via-[rgba(69,198,255,0.3)] to-[rgba(126,196,236,0.1)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="space-y-6">
          {filteredModules.map(({ mod: m, prog, unlocked, done, isCurrentActive, idx }) => {
            const isExpanded = expandedId === m.id;
            const topics = getModuleTopics(m);
            const lineTokens = tokenize(m.code, m.lang).slice(0, 6);

            // Warna tema spesifik per bahasa pemrograman
            const langTheme = {
              html: {
                accent: "#2ee6c8",
                badgeBorder: "rgba(46, 230, 200, 0.45)",
                cardBg: "linear-gradient(145deg, rgba(8, 28, 48, 0.94) 0%, rgba(4, 18, 32, 0.96) 100%)",
                badgeText: "<HTML5 />",
              },
              css: {
                accent: "#ffc247",
                badgeBorder: "rgba(255, 194, 71, 0.45)",
                cardBg: "linear-gradient(145deg, rgba(20, 30, 48, 0.94) 0%, rgba(8, 18, 32, 0.96) 100%)",
                badgeText: "{ CSS3 }",
              },
              js: {
                accent: "#38bdf8",
                badgeBorder: "rgba(56, 189, 248, 0.45)",
                cardBg: "linear-gradient(145deg, rgba(8, 30, 52, 0.94) 0%, rgba(4, 18, 32, 0.96) 100%)",
                badgeText: "JS();",
              },
            }[m.lang] ?? {
              accent: "#2ee6c8",
              badgeBorder: "rgba(46, 230, 200, 0.45)",
              cardBg: "linear-gradient(145deg, rgba(8, 28, 48, 0.94) 0%, rgba(4, 18, 32, 0.96) 100%)",
              badgeText: m.lang.toUpperCase(),
            };

            return (
              <article
                key={m.id}
                className="relative transition-all duration-300"
                style={{ transitionDelay: `${idx * 0.06}s` }}
              >
                {/* Node Status Angka / Centang di Garis Timeline */}
                <div
                  className={`absolute -left-8 md:-left-12 top-6 w-7 h-7 md:w-8 md:h-8 rounded-full grid place-items-center font-display font-extrabold text-xs md:text-sm z-20 transition-all select-none ${
                    done
                      ? "bg-[var(--teal)] text-[#031d24] shadow-[0_0_18px_rgba(46,230,200,0.9)] border-2 border-[var(--teal)]"
                      : isCurrentActive
                        ? "bg-[rgba(9,28,46,0.95)] text-[var(--amber)] border-2 border-[var(--amber)] shadow-[0_0_20px_rgba(255,194,71,0.7)]"
                        : "bg-[rgba(5,16,28,0.95)] text-[var(--faint)] border border-[rgba(126,196,236,0.2)]"
                  }`}
                  aria-hidden="true"
                >
                  {done ? <IconCheck size={16} /> : m.num}
                </div>

                {/* Kartu Misi Utama Modern & Imersif */}
                <div
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    done
                      ? "border-[rgba(46,230,200,0.45)] hover:border-[rgba(46,230,200,0.8)] shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_24px_rgba(46,230,200,0.12)] hover:-translate-y-0.5"
                      : isCurrentActive
                        ? "border-[rgba(255,194,71,0.65)] hover:border-[rgba(255,194,71,0.9)] shadow-[0_8px_32px_rgba(0,0,0,0.55),0_0_30px_rgba(255,194,71,0.18)] hover:-translate-y-0.5"
                        : "border-[rgba(126,196,236,0.15)] bg-[rgba(5,17,30,0.65)] opacity-80"
                  }`}
                  style={{
                    background: unlocked ? langTheme.cardBg : "rgba(5, 17, 30, 0.65)",
                  }}
                >
                  {/* Bagian Atas Kartu: Konten & Status */}
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Sisi Kiri: Emblem Bahasa & Deskripsi Misi */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Emblem Crest Bahasa Vektor */}
                        <div
                          className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl grid place-items-center shrink-0 border transition-transform duration-300 shadow-md group-hover:scale-105"
                          style={{
                            background: unlocked
                              ? `radial-gradient(circle at 35% 35%, ${langTheme.accent}25, rgba(6, 20, 36, 0.95))`
                              : "rgba(8, 22, 36, 0.7)",
                            borderColor: unlocked ? langTheme.badgeBorder : "rgba(126,196,236,0.18)",
                            color: unlocked ? langTheme.accent : "var(--faint)",
                          }}
                        >
                          <span className="font-mono font-extrabold text-sm md:text-base tracking-tighter">
                            {langTheme.badgeText}
                          </span>
                          {done && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--teal)] text-[#031d24] grid place-items-center text-[10px] font-bold shadow border border-white/60">
                              <IconCheck size={11} />
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Metadata Misi (Clean Typography dengan separator, anti-pill) */}
                          <div className="flex items-center gap-2 text-xs font-bold tracking-wide">
                            <span
                              className="uppercase tracking-widest text-[11px]"
                              style={{ color: langTheme.accent }}
                            >
                              Misi 0{m.num}
                            </span>
                            <span className="text-[var(--faint)]" aria-hidden="true">•</span>
                            <span className="text-white font-semibold">
                              {m.lang.toUpperCase()}
                            </span>
                            <span className="text-[var(--faint)]" aria-hidden="true">•</span>
                            <span className="text-[var(--dim)] font-normal hidden sm:inline">
                              {m.practiceTitle}
                            </span>
                          </div>

                          {/* Judul & Subjudul */}
                          <h3 className="font-display font-extrabold text-xl md:text-2xl text-white leading-tight mt-1">
                            {m.title}
                          </h3>
                          <p className="text-xs md:text-sm text-[var(--dim)] mt-0.5 font-medium leading-relaxed">
                            {m.subtitle}
                          </p>

                          {/* Pathway 3 Langkah (Materi -> Praktik -> Hasil) */}
                          <div className="flex items-center gap-3 md:gap-4 mt-3.5 text-xs font-semibold flex-wrap">
                            {/* Langkah 1: Materi */}
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-4 h-4 rounded-full grid place-items-center text-[9px] font-bold ${
                                  prog.materiDone
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50"
                                    : unlocked
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-400/50"
                                      : "bg-slate-800 text-slate-500 border border-slate-700"
                                }`}
                              >
                                {prog.materiDone ? "✓" : "1"}
                              </span>
                              <span className={prog.materiDone ? "text-emerald-300" : unlocked ? "text-amber-200" : "text-slate-500"}>
                                Materi {prog.materiDone ? "Tuntas" : "Wajib"}
                              </span>
                            </div>

                            <span className="text-[var(--faint)] opacity-40" aria-hidden="true">→</span>

                            {/* Langkah 2: Praktik */}
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-4 h-4 rounded-full grid place-items-center text-[9px] font-bold ${
                                  done
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50"
                                    : prog.materiDone
                                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50"
                                      : "bg-slate-800 text-slate-500 border border-slate-700"
                                }`}
                              >
                                {done ? "✓" : "2"}
                              </span>
                              <span className={done ? "text-emerald-300" : prog.materiDone ? "text-cyan-300" : "text-slate-500"}>
                                Praktik Arena {done ? "Lulus" : "Menunggu"}
                              </span>
                            </div>

                            {/* Skor Terbaik & Bintang Bila Selesai */}
                            {done && prog.best && (
                              <div className="flex items-center gap-2 pl-2 border-l border-[rgba(126,196,236,0.2)]">
                                <span className="flex items-center text-[var(--amber)] drop-shadow-[0_0_8px_rgba(255,194,71,0.5)]">
                                  {Array.from({ length: 3 }).map((_, i) =>
                                    i < (prog.best?.stars ?? 0) ? (
                                      <IconStar key={i} size={13} />
                                    ) : (
                                      <IconStarLine key={i} size={13} className="opacity-30" />
                                    )
                                  )}
                                </span>
                                <span className="text-xs font-mono font-bold text-white">
                                  {prog.best.score} pts
                                </span>
                                <span className="text-xs font-mono font-bold text-[var(--teal)] flex items-center gap-0.5">
                                  <IconTimer size={12} /> {prog.best.wpm} WPM
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Hadiah Misi dengan Streak Multiplier Permanen */}
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[rgba(46,230,200,0.1)] text-[var(--teal)] border border-[rgba(46,230,200,0.25)]" title="Hadiah XP jika menyelesaikan misi">
                              <IconBolt size={12} />
                              <span>+{Math.round(80 * multiplierTier.multiplier)} XP</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[rgba(255,194,71,0.1)] text-[var(--amber)] border border-[rgba(255,194,71,0.25)]" title="Hadiah Koin jika menyelesaikan misi">
                              <IconCoin size={12} />
                              <span>+{Math.round(25 * multiplierTier.multiplier)} Koin</span>
                            </span>
                            {multiplierTier.tier > 0 ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sfx.click();
                                  onOpenMultiplier?.();
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                                style={{
                                  background: multiplierTier.badgeBg,
                                  borderColor: multiplierTier.color,
                                  borderWidth: 1,
                                  color: multiplierTier.color,
                                }}
                                title={`Streak Multiplier ${multiplierTier.multiplier}× aktif permanen! Klik untuk melihat tingkatan bonus`}
                              >
                                <span>⚡ {multiplierTier.multiplier}× Multiplier</span>
                                <span className="text-white/80">(+{multiplierTier.bonusPercent}%)</span>
                              </button>
                            ) : (
                              onOpenMultiplier && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sfx.click();
                                    onOpenMultiplier();
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold text-[var(--dim)] hover:text-white bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-amber-400/40 transition-colors cursor-pointer"
                                  title="Buka sistem Streak Multiplier untuk melipatgandakan hadiah misi!"
                                >
                                  <span>⚡ Multiplier 1.0×</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sisi Kanan: Panel Tindakan Interaktif */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 justify-center">
                        {!unlocked ? (
                          <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(8,24,40,0.6)] border border-[rgba(126,196,236,0.18)] text-[var(--faint)] text-xs font-bold">
                            <IconLock size={15} />
                            <span>Terkunci — Selesaikan Misi 0{m.num - 1}</span>
                          </div>
                        ) : !prog.materiDone ? (
                          /* Belum Buka Materi: Tombol Emas Pelajari Materi */
                          <button
                            type="button"
                            onClick={() => {
                              sfx.click();
                              onMateri(m.id);
                            }}
                            className="hud-btn-learn py-3 px-6 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,194,71,0.4)]"
                          >
                            <IconBook size={16} />
                            <span>Pelajari Materi Teori</span>
                            <IconArrowR size={15} />
                          </button>
                        ) : (
                          /* Materi Sudah Selesai: Siap Praktik Arena */
                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <div className="flex items-center gap-2">
                              {/* Tombol Utama Praktik Arena */}
                              <button
                                type="button"
                                onClick={() => {
                                  sfx.click();
                                  onPractice(m.id);
                                }}
                                className="hud-btn-practice py-2.5 px-6 text-sm flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer"
                              >
                                {subGame === "tower" ? <IconTower size={16} /> : <IconKeyboard size={16} />}
                                <span>
                                  {done
                                    ? subGame === "tower" ? "Ulangi Susun" : "Ulangi Ketik"
                                    : subGame === "tower" ? "Mulai Susun Menara" : "Mulai Praktik Ketik"}
                                </span>
                                <IconArrowR size={14} />
                              </button>

                              {/* Toggle Mode Cepat (Shark vs Tower) */}
                              {onSelectSubGame && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    sfx.click();
                                    onSelectSubGame(subGame === "shark" ? "tower" : "shark");
                                  }}
                                  className="p-2.5 rounded-xl bg-[rgba(6,22,38,0.85)] border border-[rgba(126,196,236,0.25)] text-[var(--dim)] hover:text-white hover:border-[var(--teal)] transition-colors cursor-pointer"
                                  title={`Beralih ke mode ${subGame === "shark" ? "Coding Tower (Susun)" : "Shark Typer (Ketik)"}`}
                                  aria-label="Ganti mode sub-game"
                                >
                                  {subGame === "shark" ? <IconTower size={15} /> : <IconKeyboard size={15} />}
                                </button>
                              )}
                            </div>

                            {/* Tombol Pendukung: Baca Ulang Materi & Live Preview */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  sfx.click();
                                  onMateri(m.id);
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[rgba(6,22,38,0.8)] border border-[rgba(126,196,236,0.22)] text-[var(--dim)] hover:text-white hover:border-[rgba(126,196,236,0.4)] flex-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <IconRetry size={12} />
                                <span>Materi</span>
                              </button>

                              {done && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    sfx.click();
                                    onPreview(m);
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-[rgba(255,194,71,0.15)] border border-[rgba(255,194,71,0.45)] text-[var(--amber)] hover:bg-[rgba(255,194,71,0.25)] flex-1 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,194,71,0.2)] cursor-pointer"
                                >
                                  <IconEye size={13} />
                                  <span>Preview</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ============ FOOTER DRAWER INTERAKTIF: SILABUS & PREVIEW KODE ============ */}
                  {unlocked && (
                    <div className="border-t border-[rgba(126,196,236,0.12)] bg-[rgba(3,14,24,0.6)]">
                      {/* Bar Pemicu Accordion */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(m.id)}
                        className="w-full px-5 md:px-6 py-2.5 flex items-center justify-between text-xs font-bold text-[var(--dim)] hover:text-white transition-colors cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <IconCode size={13} className="text-[var(--cyan)]" />
                          <span>Silabus & Intip Kode Praktik</span>
                          <span className="text-[10px] text-[var(--faint)] font-normal hidden sm:inline">
                            ({topics.join(" • ")})
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-[var(--cyan)] text-[11px] group-hover:translate-y-0.5 transition-transform">
                          <span>{isExpanded ? "Tutup Silabus" : "Buka Detail"}</span>
                          {isExpanded ? <IconChevronUp size={13} /> : <IconChevronDown size={13} />}
                        </span>
                      </button>

                      {/* Konten Accordion yang Terbuka */}
                      {isExpanded && (
                        <div className="px-5 md:px-6 pb-5 pt-1 anim-fadeUp">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {/* Kiri: Ringkasan Materi & Silabus */}
                            <div className="p-3.5 rounded-xl bg-[rgba(6,20,34,0.7)] border border-[rgba(126,196,236,0.18)]">
                              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--faint)] mb-2">
                                📚 Konsep Inti yang Dikuasai
                              </p>
                              <ul className="space-y-1.5 text-xs text-[var(--dim)] font-medium">
                                {topics.map((t, ti) => (
                                  <li key={ti} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] mt-1.5 shrink-0 shadow-[0_0_6px_rgba(46,230,200,0.8)]" />
                                    <span>{t}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-3 pt-2.5 border-t border-[rgba(126,196,236,0.1)] flex items-center justify-between text-[11px]">
                                <span className="text-[var(--faint)]">Target Akurasi Lulus:</span>
                                <span className="font-bold text-emerald-400">≥ 85% Akurat</span>
                              </div>
                            </div>

                            {/* Kanan: Cuplikan Kode Program yang Akan Diketik */}
                            <div className="p-3.5 rounded-xl bg-[rgba(4,14,24,0.9)] border border-[rgba(126,196,236,0.18)]">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--faint)] flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[#ffc247]" />
                                  <span>Contoh Kode ({m.code.split("\n").length} Baris)</span>
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      sfx.click();
                                      try {
                                        await navigator.clipboard.writeText(m.code);
                                      } catch {
                                        /* fallback */
                                      }
                                      setCopiedId(m.id);
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                    className="text-[10px] text-[var(--teal)] hover:text-white flex items-center gap-1 font-bold cursor-pointer transition-colors px-2 py-0.5 rounded bg-[rgba(46,230,200,0.1)] border border-[rgba(46,230,200,0.25)] hover:bg-[rgba(46,230,200,0.2)]"
                                    title="Salin kode ke papan klip"
                                  >
                                    {copiedId === m.id ? (
                                      <>
                                        <IconCheck size={11} className="text-emerald-400" />
                                        <span className="text-emerald-300">Tersalin!</span>
                                      </>
                                    ) : (
                                      <>
                                        <IconKeyboard size={11} />
                                        <span>Salin</span>
                                      </>
                                    )}
                                  </button>
                                  {done && (
                                    <button
                                      type="button"
                                      onClick={() => onPreview(m)}
                                      className="text-[10px] text-[var(--amber)] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                                    >
                                      <IconEye size={11} /> Lihat Hasil
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto max-h-24 scrollbar-none opacity-90">
                                {lineTokens.map((line, li) => (
                                  <div key={li} className="truncate">
                                    <span className="text-[var(--faint)] select-none mr-2">
                                      {String(li + 1).padStart(2, "0")}
                                    </span>
                                    {line.map((tok, ti) => (
                                      <span key={ti} className={tok.cls}>
                                        {tok.ch}
                                      </span>
                                    ))}
                                  </div>
                                ))}
                                {m.code.split("\n").length > 6 && (
                                  <div className="text-[var(--faint)] text-[10px] italic mt-0.5">
                                    ...dan {m.code.split("\n").length - 6} baris kode berikutnya
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
