/* ==========================================================================
   CROSS-PLATFORM HUD (SIMPLIFIED & STREAMLINED)
   HUD Khusus & Sederhana untuk MK Sistem Aplikasi Lintas Platform
   React Native & Expo SDK • 16 Pertemuan Komprehensif • Semester 5
   ========================================================================== */

import { useState, useMemo } from "react";
import type { SaveData } from "../lib/storage";
import { rankOf } from "../lib/storage";
import {
  CROSS_PLATFORM_MEETINGS,
  CPMK_LIST,
} from "../data/crossPlatformCurriculum";
import { type SubGameId } from "../data/subgames";
import { sfx } from "../lib/audio";
import {
  IconCheck,
  IconFlame,
  IconCoin,
  IconArrowR,
  IconTower,
  IconFin,
  IconMobile,
  IconChevronDown,
  IconChevronUp,
} from "./icons";

interface Props {
  save: SaveData;
  onOpenMeeting: (no: number) => void;
  onOpenLab: () => void;
  onToggleSound: () => void;
  onResetProfile: () => void;
  subGame: SubGameId;
  onSelectSubGame?: (id: SubGameId) => void;
  hubHref?: string;
  siblingHref?: string;
  siblingLabel?: string;
  lockedSubGame?: SubGameId | null;
}

export default function CrossPlatformHud({
  save,
  onOpenMeeting,
  onOpenLab,
  onToggleSound,
  onSelectSubGame,
  hubHref,
  siblingHref,
  siblingLabel,
  lockedSubGame,
}: Props) {
  const profile = save.profile!;
  const rank = rankOf(save.xp);

  // Filter & Search states
  const [filterPhase, setFilterPhase] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showSyllabus, setShowSyllabus] = useState<boolean>(false);

  // Status penyelesaian 16 pertemuan
  const completedMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    for (const m of CROSS_PLATFORM_MEETINGS) {
      map[m.no] =
        (save.modules[`crossplatform:${m.no}`]?.completions ?? 0) > 0 ||
        (save.modules[`q:${m.no}:quest`]?.completions ?? 0) > 0;
    }
    return map;
  }, [save.modules]);

  const completedCount = useMemo(
    () => Object.values(completedMap).filter(Boolean).length,
    [completedMap]
  );

  const pct = Math.round((completedCount / CROSS_PLATFORM_MEETINGS.length) * 100);

  // Pertemuan selanjutnya yang direkomendasikan untuk dipelajari
  const nextMeeting = useMemo(() => {
    return (
      CROSS_PLATFORM_MEETINGS.find((m) => !completedMap[m.no]) ||
      CROSS_PLATFORM_MEETINGS[0]
    );
  }, [completedMap]);

  // Filter & Search logic
  const filteredMeetings = useMemo(() => {
    return CROSS_PLATFORM_MEETINGS.filter((m) => {
      // Phase filtering
      if (filterPhase !== "all") {
        if (filterPhase === "pra-uts" && (m.no < 1 || m.no > 7)) return false;
        if (filterPhase === "uts" && m.no !== 8) return false;
        if (filterPhase === "pasca-uts" && (m.no < 9 || m.no > 14)) return false;
        if (filterPhase === "uas" && (m.no < 15 || m.no > 16)) return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesGoal = m.goal.toLowerCase().includes(q);
        const matchesOutput = m.outputPraktikum.toLowerCase().includes(q);
        const matchesNo = `p${m.no}`.includes(q) || `${m.no}` === q;
        if (!matchesTitle && !matchesGoal && !matchesOutput && !matchesNo) return false;
      }

      return true;
    });
  }, [filterPhase, searchQuery]);

  return (
    <div className="relative z-10 min-h-screen pb-20 text-slate-100 select-none">
      {/* ================= 1. HEADER RINGKAS & BERSIH ================= */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-sky-500/20">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Identitas */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl grid place-items-center bg-sky-500/15 border border-sky-400/30 text-sky-400 text-lg shadow-sm">
              ⚛️
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  CrossPlatform <span className="text-sky-400">Studio</span>
                </h1>
                <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
                  · React Native & Expo SDK
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                MK Sistem Aplikasi Lintas Platform · 3 SKS
              </p>
            </div>
          </div>

          {/* User Metrics & Quick Controls (Zero-pill text separators) */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <span className="font-bold text-amber-400">Lv {rank.cur.name}</span>
              <span className="text-slate-600">·</span>
              <span className="font-semibold text-sky-300">{save.xp} XP</span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1 font-semibold text-orange-300">
                <IconFlame size={13} className="text-orange-400" />
                {save.streak.current} Hari
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <IconCoin size={13} />
                {save.coins}
              </span>
            </div>

            {/* Tombol Audio */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Atur Suara"
            >
              {profile.sound ? "🔊" : "🔇"}
            </button>

            {/* Link Hub / Kembali */}
            {hubHref && (
              <a
                href={hubHref}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-medium transition-colors text-xs"
              >
                ⌂ Hub
              </a>
            )}

            {/* Link Arena Lain (jika dalam mode standalone) */}
            {siblingHref && (
              <a
                href={siblingHref}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-medium transition-colors text-xs"
              >
                {siblingLabel ?? "Arena Lain →"}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="max-w-6xl mx-auto px-4 pt-5 space-y-5">
        {/* ============ HERO SECTION: SEDERHANA, JELAS, LANGSUNG KE TUJUAN ============ */}
        <section className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-sky-950/40 border border-sky-500/20 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-bold text-sky-400">16 Pertemuan RPS</span>
                <span aria-hidden="true">·</span>
                <span>Mahasiswa: <strong className="text-white">{profile.name}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Status: <strong className={completedCount === 16 ? "text-emerald-400" : "text-sky-300"}>{completedCount === 16 ? "Lulus Sempurna" : "Aktif Belajar"}</strong></span>
              </div>

              <h2 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                Sistem Aplikasi Lintas Platform
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Belajar React Native & Expo SDK secara terstruktur dari instalasi, Flexbox UI, State & Navigasi, REST API, hingga Build APK Android via EAS Build.
              </p>

              {/* Minimalist Progress Line */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Progres Pembelajaran:</span>
                  <span className="font-bold text-sky-400">
                    {completedCount} dari 16 Selesai ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.max(3, pct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions (Action Langsung & Jelas) */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => {
                  sfx.click();
                  onOpenMeeting(nextMeeting.no);
                }}
                className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>▶ Lanjut P{nextMeeting.no < 10 ? `0${nextMeeting.no}` : nextMeeting.no}: {nextMeeting.title}</span>
                <IconArrowR size={15} />
              </button>

              <button
                onClick={() => {
                  sfx.click();
                  onOpenLab();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <IconMobile size={15} className="text-sky-400" />
                <span>Buka Simulator HP Langsung</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============ 3. TOOLBAR: PENCARIAN & FILTER CEPAT ============ */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Phase Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { id: "all", label: "Semua (16)" },
              { id: "pra-uts", label: "Pra-UTS (P1–P7)" },
              { id: "uts", label: "UTS (P8)" },
              { id: "pasca-uts", label: "Pasca-UTS (P9–P14)" },
              { id: "uas", label: "UAS (P15–P16)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sfx.click();
                  setFilterPhase(tab.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                  filterPhase === tab.id
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar & View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik (flexbox, api, kamera)..."
                className="w-full px-3 py-1.5 pl-8 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
              />
              <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Switch Mode: List vs Grid */}
            <div className="flex items-center bg-slate-900/90 rounded-xl border border-slate-800 p-0.5 shrink-0">
              <button
                onClick={() => {
                  sfx.click();
                  setViewMode("list");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-slate-800 text-sky-400 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Tampilan Daftar Ringkas"
              >
                ≡ Daftar
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setViewMode("grid");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-slate-800 text-sky-400 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Tampilan Kartu"
              >
                ▦ Kartu
              </button>
            </div>
          </div>
        </div>

        {/* ============ 4. DAFTAR / GRID 16 PERTEMUAN ============ */}
        {filteredMeetings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              Tidak ada materi yang sesuai dengan pencarian &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterPhase("all");
              }}
              className="text-xs text-sky-400 hover:underline font-bold"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* ============ MODE DAFTAR RINGKAS (LIST VIEW - SUPER BERSIH) ============ */
          <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
            {filteredMeetings.map((m) => {
              const isDone = completedMap[m.no];
              const isNext = m.no === nextMeeting.no && !isDone;

              return (
                <div
                  key={m.no}
                  onClick={() => {
                    sfx.click();
                    onOpenMeeting(m.no);
                  }}
                  className={`p-3.5 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                    isNext
                      ? "bg-sky-950/30 hover:bg-sky-950/50"
                      : isDone
                      ? "hover:bg-emerald-950/20"
                      : "hover:bg-slate-800/50"
                  }`}
                >
                  {/* Left: Index & Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Number Badge */}
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                        isDone
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isNext
                          ? "bg-sky-500/20 text-sky-300 border border-sky-400/40 ring-2 ring-sky-500/20"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {isDone ? <IconCheck size={16} /> : m.no < 10 ? `0${m.no}` : m.no}
                    </span>

                    {/* Title & Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-sky-300 transition-colors truncate">
                          {m.title}
                        </h4>
                        {isNext && (
                          <span className="text-[10px] font-bold text-sky-400">
                            (Rekomendasi Berikutnya)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate mt-0.5">
                        <span>{m.phase}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-300 truncate">
                          Output: {m.outputPraktikum}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-semibold hidden md:inline ${
                        isDone
                          ? "text-emerald-400"
                          : isNext
                          ? "text-sky-300"
                          : "text-slate-400"
                      }`}
                    >
                      {isDone ? "Selesai" : isNext ? "Siap Mulai" : "Belum"}
                    </span>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isNext
                          ? "bg-sky-600 text-white hover:bg-sky-500 shadow-sm"
                          : isDone
                          ? "bg-slate-800 text-emerald-400 hover:bg-slate-700"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <span>{isDone ? "Review" : "Buka"}</span>
                      <IconArrowR size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ============ MODE KARTU (GRID VIEW - ELEGAN & RINGKAS) ============ */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMeetings.map((m) => {
              const isDone = completedMap[m.no];
              const isNext = m.no === nextMeeting.no && !isDone;

              return (
                <div
                  key={m.no}
                  onClick={() => {
                    sfx.click();
                    onOpenMeeting(m.no);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                    isDone
                      ? "bg-slate-900/60 border-emerald-500/30 hover:border-emerald-400"
                      : isNext
                      ? "bg-slate-900/80 border-sky-400/60 hover:border-sky-300 ring-1 ring-sky-500/20"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-sky-400">
                        Pertemuan {m.no < 10 ? `0${m.no}` : m.no}
                      </span>
                      <span>{m.phase}</span>
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                      {m.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {m.goal}
                    </p>

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 truncate">
                      <span className="text-slate-300 font-medium">Output: </span>
                      {m.outputPraktikum}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    {isDone ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        <IconCheck size={13} /> Selesai
                      </span>
                    ) : isNext ? (
                      <span className="text-sky-300 font-bold text-[11px]">
                        ▶ Giliranmu
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Siap Belajar</span>
                    )}

                    <span className="text-sky-400 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Buka Lab →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============ 5. COLLAPSIBLE SILABUS, CPMK & BOBOT NILAI ============ */}
        {/* Disimpan dalam accordion rapi agar tidak memenuhi tampilan utama */}
        <section className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
          <button
            onClick={() => {
              sfx.click();
              setShowSyllabus((prev) => !prev);
            }}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sky-400 font-bold text-sm">📋</span>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white">
                  Informasi Silabus RPS, CPMK & Komponen Penilaian (3 SKS)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Klik untuk melihat detail capaian pembelajaran, rincian bobot nilai, dan link referensi resmi.
                </p>
              </div>
            </div>
            <span className="text-slate-400 p-1">
              {showSyllabus ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </span>
          </button>

          {showSyllabus && (
            <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-slate-800/80 animate-fadeIn">
              {/* Bobot Penilaian */}
              <div className="space-y-2 pt-3">
                <h4 className="font-bold text-xs text-slate-200">
                  Komponen Penilaian Mata Kuliah:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
                  {[
                    { label: "Kehadiran", bobot: "10%" },
                    { label: "Praktikum", bobot: "20%" },
                    { label: "Mini Project 1", bobot: "15%" },
                    { label: "UTS", bobot: "20%" },
                    { label: "Mini Project 2", bobot: "15%" },
                    { label: "UAS", bobot: "20%" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50"
                    >
                      <p className="font-black text-sky-400 text-sm">{item.bobot}</p>
                      <p className="text-[10px] text-slate-300 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6 CPMK */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-200">
                  Capaian Pembelajaran Mata Kuliah (CPMK):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {CPMK_LIST.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2"
                    >
                      <span className="font-black text-sky-400 shrink-0">{c.id}:</span>
                      <span>{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referensi Resmi */}
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-300 font-medium">
                  📚 Dokumentasi Resmi Framework:
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://docs.expo.dev/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline font-bold"
                  >
                    docs.expo.dev ↗
                  </a>
                  <span className="text-slate-600">·</span>
                  <a
                    href="https://reactnative.dev/docs/environment-setup"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline font-bold"
                  >
                    reactnative.dev/docs ↗
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ============ 6. FOOTER SWITCHER (ARENA LAIN) ============ */}
        {!lockedSubGame && onSelectSubGame && (
          <footer className="pt-2 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/60">
            <p>CodeShark Academy · Sub-Game CrossPlatform Studio</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px]">Arena Lain:</span>
              <button
                onClick={() => {
                  sfx.click();
                  onSelectSubGame("tower");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <IconTower size={12} /> Coding Tower
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  onSelectSubGame("shark");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <IconFin size={12} /> CodeShark
              </button>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}
