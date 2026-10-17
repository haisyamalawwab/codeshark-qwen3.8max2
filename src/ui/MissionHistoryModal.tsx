import { useEffect, useMemo, useState } from "react";
import type { DailyChallengeAttempt, DailyChallengeRecord } from "../lib/storage";
import { sfx } from "../lib/audio";
import {
  IconX,
  IconTarget,
  IconTimer,
  IconBolt,
  IconStar,
  IconStarLine,
  IconCalendar,
  IconCheck,
  IconSparkles,
  IconArrowR,
} from "./icons";

interface Props {
  record: DailyChallengeRecord;
  onClose: () => void;
  onStartToday?: () => void;
  isTodayCompleted?: boolean;
}

type SortMode = "newest" | "highestScore" | "highestAcc";

export default function MissionHistoryModal({
  record,
  onClose,
  onStartToday,
  isTodayCompleted = false,
}: Props) {
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  // Keyboard shortcut Esc untuk keluar
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

  // Siapkan daftar attempt dari record.history
  const attempts: DailyChallengeAttempt[] = useMemo(() => {
    const raw = record.history ?? [];
    if (raw.length > 0) return raw;

    // Fallback jika pemain punya progres hari ini / totalCompleted tetapi history belum terisi
    if (record.lastCompletedDate && typeof record.todayScore === "number") {
      return [
        {
          date: record.lastCompletedDate,
          title: "Tantangan Harian Samudra",
          lang: "html",
          score: record.todayScore,
          accuracy: record.todayAccuracy ?? 95,
          wpm: 42,
          stars: 3,
          completedAt: Date.now() - 3600000,
        },
      ];
    }
    return [];
  }, [record]);

  // Urutkan attempt sesuai pilihan pengguna
  const sortedAttempts = useMemo(() => {
    const list = [...attempts];
    if (sortMode === "highestScore") {
      return list.sort((a, b) => b.score - a.score);
    }
    if (sortMode === "highestAcc") {
      return list.sort((a, b) => b.accuracy - a.accuracy || b.score - a.score);
    }
    // "newest"
    return list.sort((a, b) => {
      const timeA = a.completedAt || new Date(a.date).getTime() || 0;
      const timeB = b.completedAt || new Date(b.date).getTime() || 0;
      return timeB - timeA;
    });
  }, [attempts, sortMode]);

  // Metrik ringkasan untuk melihat tren progres
  const summary = useMemo(() => {
    if (attempts.length === 0) {
      return { total: 0, avgAcc: 0, maxScore: 0, avgWpm: 0 };
    }
    const total = attempts.length;
    const sumAcc = attempts.reduce((acc, cur) => acc + (cur.accuracy || 0), 0);
    const maxScore = Math.max(...attempts.map((a) => a.score || 0));
    const validWpms = attempts.filter((a) => typeof a.wpm === "number" && a.wpm > 0);
    const avgWpm = validWpms.length > 0
      ? Math.round(validWpms.reduce((acc, cur) => acc + (cur.wpm || 0), 0) / validWpms.length)
      : 0;

    return {
      total,
      avgAcc: Math.round(sumAcc / total),
      maxScore,
      avgWpm,
    };
  }, [attempts]);

  // Urutan kronologis lama ke baru untuk grafik progres
  const chronologicalAttempts = useMemo(() => {
    return [...attempts]
      .sort((a, b) => {
        const timeA = a.completedAt || new Date(a.date).getTime() || 0;
        const timeB = b.completedAt || new Date(b.date).getTime() || 0;
        return timeA - timeB;
      })
      .slice(-8); // Tampilkan hingga 8 data terbaru di grafik
  }, [attempts]);

  // Format tanggal Indonesia
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().slice(0, 10);
    return dateStr === today;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(2,9,17,0.85)] backdrop-blur-md screen-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[rgba(10,32,54,0.96)] to-[rgba(5,17,29,0.98)] border border-[rgba(46,230,200,0.4)] shadow-[0_0_50px_rgba(46,230,200,0.25)] relative anim-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        {/* ============ HEADER MODAL ============ */}
        <div className="p-5 md:p-6 border-b border-[rgba(126,196,236,0.15)] bg-[rgba(6,22,38,0.7)] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl grid place-items-center bg-[rgba(255,194,71,0.14)] text-[var(--amber)] border border-[rgba(255,194,71,0.4)] shadow-[0_0_16px_rgba(255,194,71,0.25)] shrink-0">
              <IconCalendar size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--amber)]">
                  Log Eksplorasi
                </span>
                <span className="text-[10px] text-[var(--faint)]" aria-hidden="true">•</span>
                <span className="text-[10px] font-bold text-[var(--teal)]">
                  {summary.total} Misi Selesai
                </span>
              </div>
              <h2
                id="history-modal-title"
                className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight"
              >
                Riwayat Misi Harian
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
            aria-label="Tutup jendela riwayat"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* ============ KONTEN BODY (SCROLLABLE) ============ */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Ringkasan Statistik Progres (Sense of Progress Over Time) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[rgba(7,24,42,0.75)] border border-[rgba(126,196,236,0.18)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--faint)]">
                <p className="text-[10px] uppercase tracking-wider font-extrabold">
                  Total Selesai
                </p>
                <IconCheck size={14} className="text-slate-400" />
              </div>
              <p className="font-display font-extrabold text-2xl text-white mt-1 leading-none">
                {summary.total}×
              </p>
              <p className="text-[10px] text-[var(--dim)] mt-1 font-medium">Tantangan harian</p>
            </div>

            <div className="p-3 rounded-2xl bg-[rgba(7,24,42,0.75)] border border-[rgba(46,230,200,0.25)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--teal)]">
                <p className="text-[10px] uppercase tracking-wider font-extrabold">
                  Rata-Rata Akurasi
                </p>
                <IconTarget size={15} />
              </div>
              <p className="font-display font-extrabold text-2xl text-[var(--teal)] mt-1 leading-none">
                {summary.avgAcc}%
              </p>
              <p className="text-[10px] text-[var(--dim)] mt-1 font-medium">Ketepatan koding</p>
            </div>

            <div className="p-3 rounded-2xl bg-[rgba(7,24,42,0.75)] border border-[rgba(255,194,71,0.25)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--amber)]">
                <p className="text-[10px] uppercase tracking-wider font-extrabold">
                  Skor Tertinggi
                </p>
                <IconBolt size={15} />
              </div>
              <p className="font-display font-extrabold text-2xl text-[var(--amber)] mt-1 leading-none">
                {summary.maxScore.toLocaleString()}
              </p>
              <p className="text-[10px] text-[var(--dim)] mt-1 font-medium">Poin terbaik</p>
            </div>

            <div className="p-3 rounded-2xl bg-[rgba(7,24,42,0.75)] border border-[rgba(69,198,255,0.25)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--cyan)]">
                <p className="text-[10px] uppercase tracking-wider font-extrabold">
                  Rata-Rata WPM
                </p>
                <IconTimer size={15} />
              </div>
              <p className="font-display font-extrabold text-2xl text-white mt-1 leading-none">
                {summary.avgWpm} <span className="text-xs text-[var(--cyan)] font-sans">WPM</span>
              </p>
              <p className="text-[10px] text-[var(--dim)] mt-1 font-medium">Kecepatan ketik</p>
            </div>
          </div>

          {/* ============ VISUALISASI GRAFIK TREN PROGRES ============ */}
          {chronologicalAttempts.length > 1 && (
            <div className="p-4 rounded-2xl bg-[rgba(6,20,34,0.85)] border border-[rgba(126,196,236,0.18)]">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <IconSparkles size={14} className="text-[var(--teal)]" />
                  <span>Tren Akurasi Sepanjang Waktu</span>
                </span>
                <span className="text-[10px] text-[var(--faint)]">
                  {chronologicalAttempts.length} sesi terakhir
                </span>
              </div>

              {/* Bar Sparkline Visual */}
              <div className="flex items-end justify-between gap-2 h-20 pt-2 px-1">
                {chronologicalAttempts.map((item, i) => {
                  const acc = Math.max(10, Math.min(100, item.accuracy || 0));
                  const isHigh = acc >= 90;
                  const isMid = acc >= 80;
                  const barColor = isHigh ? "bg-[var(--teal)]" : isMid ? "bg-[var(--amber)]" : "bg-[var(--coral)]";

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1.5 group relative"
                      title={`${item.title} (${item.date}): ${acc}% akurasi · ${item.score} poin`}
                    >
                      {/* Tooltip Hover */}
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[rgba(4,14,24,0.95)] border border-[rgba(126,196,236,0.3)] text-white text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap z-20">
                        {acc}% · {item.score} pts
                      </div>

                      {/* Batang Progres */}
                      <div className="w-full h-14 bg-[rgba(255,255,255,0.05)] rounded-md overflow-hidden flex items-end">
                        <div
                          className={`w-full ${barColor} rounded-md transition-all duration-500 shadow-[0_0_8px_rgba(46,230,200,0.3)] group-hover:brightness-125`}
                          style={{ height: `${acc}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[var(--faint)] truncate max-w-full">
                        {item.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============ FILTER & SORTIR BAR ============ */}
          {attempts.length > 0 && (
            <div className="flex items-center justify-between gap-3 flex-wrap pt-1 text-xs">
              <span className="font-bold text-[var(--dim)]">
                Daftar Riwayat Percobaan ({sortedAttempts.length})
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[var(--faint)]">Urutkan:</span>
                <select
                  value={sortMode}
                  onChange={(e) => {
                    sfx.click();
                    setSortMode(e.target.value as SortMode);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[rgba(6,22,38,0.9)] border border-[rgba(126,196,236,0.25)] text-white text-xs font-semibold focus:outline-none focus:border-[var(--teal)] cursor-pointer"
                >
                  <option value="newest">Paling Baru</option>
                  <option value="highestScore">Skor Tertinggi</option>
                  <option value="highestAcc">Akurasi Tertinggi</option>
                </select>
              </div>
            </div>
          )}

          {/* ============ DAFTAR RIWAYAT TANTANGAN ============ */}
          {sortedAttempts.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-[rgba(6,20,34,0.5)] border border-[rgba(126,196,236,0.15)]">
              <span className="w-16 h-16 rounded-3xl mx-auto grid place-items-center text-3xl bg-[rgba(69,198,255,0.1)] border border-[rgba(69,198,255,0.3)] text-[var(--cyan)] shadow-inner mb-3">
                🧭
              </span>
              <h3 className="font-display font-bold text-lg text-white">Belum Ada Riwayat Tersimpan</h3>
              <p className="text-xs text-[var(--dim)] mt-1.5 max-w-md mx-auto leading-relaxed">
                Tantangan harianmu belum tercatat. Selesaikan tantangan harian hari ini untuk mengukir catatan perdana di Log Samudramu!
              </p>
              {onStartToday && !isTodayCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    sfx.click();
                    onClose();
                    onStartToday();
                  }}
                  className="mt-4 hud-btn-learn py-2.5 px-6 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Mulai Tantangan Hari Ini</span>
                  <IconArrowR size={14} />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedAttempts.map((item, idx) => {
                const isItemToday = isToday(item.date);
                const accColor = item.accuracy >= 90 ? "text-emerald-300" : item.accuracy >= 80 ? "text-amber-300" : "text-rose-300";

                return (
                  <article
                    key={`${item.date}-${idx}`}
                    className={`p-4 rounded-2xl border transition-all duration-200 hover:border-[rgba(46,230,200,0.5)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${
                      isItemToday
                        ? "bg-[rgba(12,34,56,0.85)] border-[rgba(255,194,71,0.5)] shadow-[0_0_18px_rgba(255,194,71,0.15)]"
                        : "bg-[rgba(6,20,34,0.7)] border-[rgba(126,196,236,0.18)]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Sisi Kiri: Tanggal, Judul & Bahasa */}
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-10 h-10 rounded-xl grid place-items-center text-xs font-bold shrink-0 mt-0.5 ${
                            isItemToday
                              ? "bg-[rgba(255,194,71,0.15)] text-[var(--amber)] border border-[rgba(255,194,71,0.4)]"
                              : "bg-[rgba(46,230,200,0.12)] text-[var(--teal)] border border-[rgba(46,230,200,0.35)]"
                          }`}
                        >
                          <IconCheck size={18} />
                        </span>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-bold text-white">
                              {formatDate(item.date)}
                            </span>
                            {isItemToday && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[rgba(255,194,71,0.2)] text-[var(--amber)] border border-[rgba(255,194,71,0.5)]">
                                Hari Ini
                              </span>
                            )}
                            {item.lang && (
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[var(--cyan)] border border-[rgba(126,196,236,0.2)]">
                                {item.lang}
                              </span>
                            )}
                          </div>
                          <h4 className="font-display font-extrabold text-base text-white mt-0.5 leading-snug">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      {/* Sisi Kanan: Skor, Akurasi, WPM & Bintang */}
                      <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto pl-13 sm:pl-0">
                        {/* Akurasi */}
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-[var(--faint)] font-bold">
                            Akurasi
                          </p>
                          <p className={`font-mono font-extrabold text-sm ${accColor}`}>
                            {item.accuracy}%
                          </p>
                        </div>

                        {/* WPM (jika ada) */}
                        {typeof item.wpm === "number" && item.wpm > 0 && (
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-[var(--faint)] font-bold">
                              Kecepatan
                            </p>
                            <p className="font-mono font-extrabold text-sm text-[var(--cyan)]">
                              {item.wpm} WPM
                            </p>
                          </div>
                        )}

                        {/* Skor Poin */}
                        <div className="text-right pl-2 border-l border-[rgba(126,196,236,0.15)]">
                          <p className="text-[10px] uppercase tracking-wider text-[var(--faint)] font-bold">
                            Skor
                          </p>
                          <p className="font-mono font-extrabold text-base text-[var(--amber)] tabular-nums">
                            {item.score.toLocaleString()}
                          </p>
                        </div>

                        {/* Bintang */}
                        <div className="flex items-center text-[var(--amber)] pl-1">
                          {Array.from({ length: 3 }).map((_, i) =>
                            i < (item.stars ?? 3) ? (
                              <IconStar key={i} size={13} />
                            ) : (
                              <IconStarLine key={i} size={13} className="opacity-30" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* ============ FOOTER MODAL ============ */}
        <div className="p-4 px-6 border-t border-[rgba(126,196,236,0.15)] bg-[rgba(6,22,38,0.7)] flex items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-[var(--faint)] font-medium">
            Tersimpan otomatis di perangkat ini
          </span>
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
        </div>
      </div>
    </div>
  );
}
