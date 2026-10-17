import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { SaveData, StreakStatus } from "../lib/storage";
import { getLocalDateString } from "../lib/storage";
import { sfx } from "../lib/audio";
import {
  IconFlame,
  IconCheck,
  IconSparkles,
  IconArrowR,
  IconCalendar,
  IconTarget,
} from "./icons";
import { getPermanentStreakTier } from "../lib/streakMultiplier";

interface Props {
  save: SaveData;
  streakStatus: StreakStatus;
  onStartDaily?: () => void;
  onOpenHistory?: () => void;
  onOpenMultiplier?: () => void;
}

export interface DayTrendPoint {
  date: string;
  dayName: string;
  dayNum: number;
  formattedDate: string;
  shortLabel: string;
  count: number;
  isToday: boolean;
  isCompleted: boolean;
  details?: {
    title?: string;
    score?: number;
    accuracy?: number;
    lang?: string;
  };
}

/** Hitung data tren 7 hari terakhir (6 hari lalu sampai hari ini) */
export function calculate7DaysTrend(save: SaveData, now: number = Date.now()): DayTrendPoint[] {
  const result: DayTrendPoint[] = [];
  const todayStr = getLocalDateString(now);
  const history = save.dailyChallenge?.history ?? [];
  const dayNamesIndo = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const monthNamesIndo = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d.getTime());
    const isToday = dateStr === todayStr;

    // Filter attempts di history untuk tanggal ini
    const dayAttempts = history.filter((h) => h.date === dateStr);
    let count = dayAttempts.length;

    // Fallback: Jika hari ini tercatat tuntas di save.dailyChallenge tapi belum sempat masuk array history
    if (isToday && count === 0 && save.dailyChallenge?.lastCompletedDate === todayStr) {
      count = 1;
    }

    const bestAttempt = dayAttempts[0];

    result.push({
      date: dateStr,
      dayName: dayNamesIndo[d.getDay()],
      dayNum: d.getDate(),
      formattedDate: `${d.getDate()} ${monthNamesIndo[d.getMonth()]}`,
      shortLabel: isToday ? "Hari Ini" : `${dayNamesIndo[d.getDay()]} ${d.getDate()}`,
      count,
      isToday,
      isCompleted: count > 0,
      details: bestAttempt
        ? {
            title: bestAttempt.title,
            score: bestAttempt.score,
            accuracy: bestAttempt.accuracy,
            lang: bestAttempt.lang,
          }
        : undefined,
    });
  }

  return result;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DayTrendPoint;
    value: number;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="p-3 rounded-xl bg-[rgba(4,16,28,0.96)] border border-[rgba(46,230,200,0.4)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md text-xs font-sans min-w-[190px]">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[rgba(126,196,236,0.18)]">
        <div>
          <span className="font-extrabold text-white text-xs block">
            {data.dayName}, {data.formattedDate}
          </span>
          {data.isToday && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--amber)]">
              Hari Ini
            </span>
          )}
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            data.isCompleted
              ? "bg-[rgba(46,230,200,0.15)] text-[var(--teal)] border-[rgba(46,230,200,0.4)]"
              : data.isToday
                ? "bg-[rgba(255,194,71,0.15)] text-[var(--amber)] border-[rgba(255,194,71,0.4)]"
                : "bg-[rgba(255,255,255,0.05)] text-[var(--faint)] border-[rgba(255,255,255,0.1)]"
          }`}
        >
          {data.isCompleted ? "Tuntas ✓" : data.isToday ? "Menunggu" : "Kosong"}
        </span>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-[11px] text-[var(--dim)]">Misi Selesai:</span>
          <strong className="font-mono text-[var(--teal)] font-bold">
            {data.count}× {data.count >= 1 ? "Tuntas" : ""}
          </strong>
        </div>

        {data.details && (
          <>
            {data.details.title && (
              <p className="text-[11px] text-white font-medium truncate max-w-[200px] mt-1 pt-1 border-t border-[rgba(126,196,236,0.1)]">
                {data.details.title}
              </p>
            )}
            <div className="flex items-center justify-between text-[10px] text-[var(--dim)] pt-0.5 font-mono">
              {typeof data.details.accuracy === "number" && (
                <span>Akurasi {data.details.accuracy}%</span>
              )}
              {typeof data.details.score === "number" && (
                <span className="text-[var(--amber)]">{data.details.score} Pts</span>
              )}
            </div>
          </>
        )}

        {!data.isCompleted && (
          <p className="text-[10px] text-[var(--faint)] italic pt-1">
            {data.isToday
              ? "⚡ Selesaikan tantangan hari ini untuk menambah streak!"
              : "Tidak ada tantangan tuntas pada hari ini"}
          </p>
        )}
      </div>
    </div>
  );
}

export default function StreakTrendsVisualizer({
  save,
  streakStatus,
  onStartDaily,
  onOpenHistory,
  onOpenMultiplier,
}: Props) {
  const trendData = useMemo(() => calculate7DaysTrend(save), [save]);
  const multiplierTier = useMemo(() => getPermanentStreakTier(save), [save]);

  // Hitung jumlah hari aktif dalam 7 hari terakhir
  const completedDaysCount = useMemo(
    () => trendData.filter((d) => d.isCompleted).length,
    [trendData]
  );
  const consistencyPct = Math.round((completedDaysCount / 7) * 100);

  // Cari nilai maksimum count untuk skala sumbu Y yang proporsional
  const maxCount = useMemo(() => {
    const highest = Math.max(...trendData.map((d) => d.count), 0);
    return Math.max(highest, 1);
  }, [trendData]);

  // Pesan motivasi dinamis
  const motivationText = useMemo(() => {
    if (completedDaysCount === 7) {
      return "Sempurna! 7 dari 7 hari tuntas. Kamu adalah master konsistensi samudra koding!";
    }
    if (completedDaysCount >= 5) {
      return "Konsistensi sangat kuat! Memori otot kodingmu berkembang pesat minggu ini.";
    }
    if (streakStatus.practicedToday) {
      return `Target hari ini selesai! Streak kamu menyala ${streakStatus.current} hari berturut-turut.`;
    }
    if (streakStatus.current > 0) {
      return `Api streak masih terjaga (${streakStatus.current} hari). Koding 1 tantangan hari ini agar api tidak padam!`;
    }
    return "Mulai tantangan harian pertamamu hari ini untuk menyalakan kebiasaan koding setiap hari!";
  }, [completedDaysCount, streakStatus]);

  return (
    <article
      className="hud-panel relative overflow-hidden p-5 md:p-6 rounded-2xl select-none"
      style={{
        background:
          "linear-gradient(135deg, rgba(8, 26, 46, 0.94) 0%, rgba(10, 32, 54, 0.88) 100%)",
        border: "1px solid rgba(69, 198, 255, 0.25)",
        boxShadow: "0 6px 28px rgba(0, 0, 0, 0.35)",
      }}
      aria-label="Tren Konsistensi 7 Hari"
    >
      {/* Glow ambient background */}
      <div
        className="absolute -left-14 -bottom-14 w-52 h-52 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background: streakStatus.current > 0 ? "var(--amber)" : "var(--teal)",
        }}
      />

      <div className="relative z-10">
        {/* ============ HEADER SECTION ============ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(126,196,236,0.15)]">
          <div className="flex items-center gap-3">
            {/* Lambang Api Streak Dinamis */}
            <div
              className={`w-11 h-11 rounded-2xl grid place-items-center shrink-0 border transition-all ${
                streakStatus.current > 0
                  ? "bg-[rgba(249,115,22,0.15)] text-[#f97316] border-[rgba(249,115,22,0.45)] shadow-[0_0_18px_rgba(249,115,22,0.3)]"
                  : "bg-[rgba(69,198,255,0.1)] text-[var(--cyan)] border-[rgba(69,198,255,0.3)] shadow-[0_0_14px_rgba(69,198,255,0.15)]"
              }`}
            >
              <IconFlame
                size={22}
                className={streakStatus.current > 0 ? "animate-pulse" : "opacity-80"}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--amber)]">
                  Streak Trends • Tren Konsistensi
                </span>
                <span className="text-[10px] text-[var(--faint)]" aria-hidden="true">
                  •
                </span>
                <span className="text-[10px] font-bold text-[var(--teal)]">
                  7 Hari Terakhir
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl md:text-2xl text-white mt-0.5 leading-tight">
                Aktivitas Tantangan Harian
              </h3>
            </div>
          </div>

          {/* Sisi Kanan: Metrik Ringkasan Streak & Konsistensi */}
          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-center">
            {/* Chip Streak Hari */}
            <div
              className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold"
              style={{
                background:
                  streakStatus.current > 0
                    ? "rgba(249, 115, 22, 0.12)"
                    : "rgba(10, 32, 54, 0.8)",
                borderColor:
                  streakStatus.current > 0
                    ? "rgba(249, 115, 22, 0.4)"
                    : "rgba(126, 196, 236, 0.2)",
                color: streakStatus.current > 0 ? "#fdba74" : "var(--dim)",
              }}
              title={`Streak aktif: ${streakStatus.current} hari berturut-turut`}
            >
              <IconFlame
                size={14}
                className={streakStatus.current > 0 ? "text-[#f97316]" : "opacity-40"}
              />
              <span>
                Streak:{" "}
                <strong className="text-white font-mono text-sm">
                  {streakStatus.current}
                </strong>{" "}
                Hari
              </span>
            </div>

            {/* Chip Konsistensi 7 Hari */}
            <div
              className="px-3 py-1.5 rounded-xl border bg-[rgba(6,22,38,0.85)] border-[rgba(46,230,200,0.3)] text-xs font-bold flex items-center gap-1.5"
              title={`${completedDaysCount} dari 7 hari terakhir tuntas tantangan (${consistencyPct}%)`}
            >
              <IconTarget size={14} className="text-[var(--teal)]" />
              <span className="text-[var(--dim)]">7 Hari:</span>
              <span className="text-[var(--teal)] font-mono text-sm">
                {completedDaysCount}/7
              </span>
              <span className="text-[10px] text-emerald-400 font-mono hidden xs:inline">
                ({consistencyPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* ============ VISUALISASI RECHARTS BAR CHART ============ */}
        <div className="mt-4 pt-1">
          <div className="flex items-center justify-between text-xs text-[var(--dim)] mb-2 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <IconSparkles size={13} className="text-[var(--teal)]" />
              <span>Penyelesaian per Hari</span>
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--teal)] inline-block shadow-[0_0_6px_rgba(46,230,200,0.8)]" />
                <span className="text-slate-300">Tuntas</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(255,194,71,0.4)] border border-[rgba(255,194,71,0.8)] inline-block" />
                <span className="text-slate-400">Target Hari Ini</span>
              </span>
            </div>
          </div>

          {/* Area Render Recharts */}
          <div className="w-full h-44 sm:h-48 pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendData}
                margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
              >
                <defs>
                  {/* Gradien Batang Tuntas Hijau Toska / Teal */}
                  <linearGradient id="streakBarDone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#45c6ff" stopOpacity={1} />
                    <stop offset="40%" stopColor="#2ee6c8" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#0a3c5a" stopOpacity={0.8} />
                  </linearGradient>

                  {/* Gradien Batang Hari Ini Menunggu */}
                  <linearGradient id="streakBarTodayPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#78350f" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(126, 196, 236, 0.12)"
                />

                <XAxis
                  dataKey="shortLabel"
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: "rgba(126, 196, 236, 0.2)" }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, Math.max(2, maxCount)]}
                  ticks={[0, 1, Math.max(2, maxCount)]}
                  tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />

                <ReferenceLine
                  y={1}
                  stroke="rgba(46, 230, 200, 0.35)"
                  strokeDasharray="4 4"
                />

                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(69, 198, 255, 0.06)" }} />

                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={38}
                  animationDuration={800}
                >
                  {trendData.map((entry, index) => {
                    const isDone = entry.isCompleted;
                    const isTodayWaiting = entry.isToday && !isDone;

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          isDone
                            ? "url(#streakBarDone)"
                            : isTodayWaiting
                              ? "url(#streakBarTodayPending)"
                              : "rgba(126, 196, 236, 0.1)"
                        }
                        stroke={
                          isDone
                            ? "#2ee6c8"
                            : isTodayWaiting
                              ? "#f59e0b"
                              : "rgba(126, 196, 236, 0.2)"
                        }
                        strokeWidth={isDone || isTodayWaiting ? 1.5 : 1}
                        style={{
                          filter: isDone
                            ? "drop-shadow(0 0 6px rgba(46,230,200,0.45))"
                            : undefined,
                        }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============ KALENDER JEJAK 7 HARI (DAILY TRACKER CHIPS) ============ */}
        <div className="mt-4 pt-3 border-t border-[rgba(126,196,236,0.12)]">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {trendData.map((item, idx) => (
              <div
                key={idx}
                className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-between text-center transition-all ${
                  item.isCompleted
                    ? "bg-[rgba(46,230,200,0.12)] border border-[rgba(46,230,200,0.4)] shadow-[0_0_10px_rgba(46,230,200,0.15)]"
                    : item.isToday
                      ? "bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.45)] shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                      : "bg-[rgba(5,17,30,0.6)] border border-[rgba(126,196,236,0.14)] opacity-70"
                }`}
              >
                <span className="text-[10px] text-[var(--faint)] font-bold">
                  {item.dayName}
                </span>

                <div className="my-1">
                  {item.isCompleted ? (
                    <span className="w-5 h-5 rounded-full bg-[var(--teal)] text-[#041926] grid place-items-center text-[10px] font-bold shadow-sm">
                      <IconCheck size={12} />
                    </span>
                  ) : item.isToday ? (
                    <span className="w-5 h-5 rounded-full bg-[rgba(245,158,11,0.25)] text-[var(--amber)] border border-[rgba(245,158,11,0.6)] grid place-items-center text-[10px] font-bold animate-pulse">
                      ⚡
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] grid place-items-center text-[10px] text-[var(--faint)] font-mono">
                      -
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-mono font-bold ${
                    item.isToday
                      ? "text-[var(--amber)]"
                      : item.isCompleted
                        ? "text-white"
                        : "text-[var(--faint)]"
                  }`}
                >
                  {item.dayNum}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ============ STATUS STREAK MULTIPLIER PERMANEN ============ */}
        <div
          className="mt-4 p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(10, 36, 62, 0.7) 0%, rgba(6, 22, 38, 0.85) 100%)",
            borderColor: multiplierTier.color,
            boxShadow: `0 0 16px ${multiplierTier.glowColor}`,
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-10 h-10 rounded-xl grid place-items-center text-xl shrink-0 border shadow-sm"
              style={{
                background: multiplierTier.badgeBg,
                borderColor: multiplierTier.color,
              }}
            >
              {multiplierTier.iconChar}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-extrabold tracking-wider" style={{ color: multiplierTier.color }}>
                  Streak Multiplier Permanen
                </span>
                <span className="text-[10px] text-[var(--faint)]" aria-hidden="true">•</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <IconCheck size={11} /> Aktif Selamanya
                </span>
              </div>
              <p className="font-display font-extrabold text-sm sm:text-base text-white truncate">
                {multiplierTier.name} — <span style={{ color: multiplierTier.color }}>{multiplierTier.multiplier}× XP & Koin</span>
                <span className="text-xs font-sans font-normal text-slate-300 ml-1.5 hidden xs:inline">
                  (+{multiplierTier.bonusPercent}% di setiap misi)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {onOpenMultiplier && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onOpenMultiplier();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 hover:text-white bg-[rgba(245,158,11,0.15)] hover:bg-[rgba(245,158,11,0.25)] border border-[rgba(245,158,11,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
                title="Buka rincian semua tingkatan Streak Multiplier"
              >
                <span>Tingkatan Pengali</span>
                <IconArrowR size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ============ FOOTER: MOTIVASI & AKSI CEPAT ============ */}
        <div className="mt-4 pt-3 border-t border-[rgba(126,196,236,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[var(--dim)] leading-relaxed flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-amber-400 text-sm shrink-0">💡</span>
            <span>{motivationText}</span>
          </p>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenHistory && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onOpenHistory();
                }}
                className="btn btn-ghost !text-xs !py-2 !px-3 flex items-center gap-1.5 text-slate-300 hover:text-white border border-[rgba(126,196,236,0.2)] rounded-xl"
                title="Lihat riwayat lengkap seluruh percobaan harian"
              >
                <IconCalendar size={13} className="text-[var(--teal)]" />
                <span>Riwayat Misi</span>
              </button>
            )}

            {!streakStatus.practicedToday && onStartDaily && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onStartDaily();
                }}
                className="hud-btn-practice !py-2 !px-4 text-xs font-extrabold flex items-center gap-1.5 shadow-[0_0_14px_rgba(245,158,11,0.3)] !bg-gradient-to-r !from-amber-500 !to-amber-600 !text-slate-950 !border-amber-400/60"
              >
                <span>Mulai Hari Ini</span>
                <IconArrowR size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
