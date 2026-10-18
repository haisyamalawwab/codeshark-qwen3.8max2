/* ==========================================================================
   CROSS-PLATFORM STUDIO / LAB ARENA
   Sub-Game Khusus: Mata Kuliah Sistem Aplikasi Lintas Platform (React Native & Expo)
   16 Pertemuan Komprehensif • Markdown-Powered • Phone Simulator • RPS Tracker
   ========================================================================== */

import { useState, useMemo } from "react";
import {
  CROSS_PLATFORM_MEETINGS,
  type CrossPlatformMeeting,
} from "../../data/crossPlatformCurriculum";
import { getCrossPlatformMdDoc } from "../../data/materiCrossPlatform";
import { parseMd, type MdBlock } from "../../lib/markdown";
import { getFigure } from "../../lib/figures";
import CrossPlatformPhoneSimulator from "./CrossPlatformPhoneSimulator";
import { sfx } from "../../lib/audio";
import {
  IconArrowL,
  IconCheck,
  IconKeyboard,
  IconStar,
  IconInfo,
  IconX,
} from "../../ui/icons";
import type { GameResult } from "../../ui/TypingGame";

interface Props {
  onDone?: (r: GameResult) => void;
  onExit: () => void;
  startMeetingNo?: number;
}

/* ==========================================================================
   RENDERER BLOK MARKDOWN (.md) UNTUK CROSS-PLATFORM
   ========================================================================== */
function CrossPlatformMdView({ blocks }: { blocks: MdBlock[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    sfx.click();
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4 text-slate-200">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h": {
            if (b.level === 1) {
              return (
                <h2
                  key={i}
                  className="font-extrabold text-lg sm:text-xl text-white tracking-tight pb-2 border-b border-sky-500/20 text-sky-300"
                >
                  {b.text}
                </h2>
              );
            }
            if (b.level === 2) {
              return (
                <h3
                  key={i}
                  className="font-bold text-base sm:text-lg text-white mt-4 pb-1 border-b border-slate-700/60 flex items-center gap-2"
                >
                  <span className="text-sky-400">§</span>
                  <span>{b.text}</span>
                </h3>
              );
            }
            if (b.level === 3) {
              return (
                <h4 key={i} className="font-bold text-sm text-sky-200 mt-2">
                  {b.text}
                </h4>
              );
            }
            return (
              <h5 key={i} className="font-bold text-xs text-slate-300">
                {b.text}
              </h5>
            );
          }

          case "p":
            return (
              <p
                key={i}
                className="text-xs sm:text-sm text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );

          case "ul":
            return (
              <ul key={i} className="space-y-1.5 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                    <span dangerouslySetInnerHTML={{ __html: it }} />
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={i} className="space-y-1.5 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-sky-400 font-mono text-[10px] font-bold grid place-items-center shrink-0">
                      {j + 1}
                    </span>
                    <span className="pt-0.5" dangerouslySetInnerHTML={{ __html: it }} />
                  </li>
                ))}
              </ol>
            );

          case "code":
            return (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 my-2">
                <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{b.lang || "code"}</span>
                  <button
                    onClick={() => handleCopyCode(b.code, i)}
                    className="text-sky-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedIndex === i ? "✓ Tersalin" : "Salin"}
                  </button>
                </div>
                <pre className="p-3.5 text-xs font-mono text-sky-200 overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{b.code}</code>
                </pre>
              </div>
            );

          case "quote": {
            const isTip = /💡|✅/.test(b.html);
            const isWarn = /⚠️|🚫/.test(b.html);
            return (
              <blockquote
                key={i}
                className={`p-3.5 rounded-xl border flex items-start gap-3 my-2 text-xs sm:text-sm ${
                  isWarn
                    ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                    : isTip
                    ? "bg-sky-950/30 border-sky-500/40 text-sky-200"
                    : "bg-amber-950/30 border-amber-500/40 text-amber-200"
                }`}
              >
                <span className="shrink-0 mt-0.5">
                  {isWarn ? <IconX size={15} /> : isTip ? <IconInfo size={15} /> : <IconStar size={15} />}
                </span>
                <span
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: b.html.replace(/^[💡⚠️🚫✅]\s*/, "") }}
                />
              </blockquote>
            );
          }

          case "hr":
            return <hr key={i} className="border-slate-800 my-4" />;

          case "img": {
            const fig = getFigure(b.key);
            if (fig) {
              return (
                <figure key={i} className="my-4">
                  <div className="rounded-2xl overflow-hidden border border-sky-500/30 bg-slate-950 p-2 shadow-lg">
                    {fig.node}
                  </div>
                  <figcaption className="text-xs text-slate-400 mt-2 text-center font-mono">
                    {b.alt || fig.caption}
                  </figcaption>
                </figure>
              );
            }
            const src = b.src || b.key;
            if (src && (src.startsWith("/") || src.startsWith("http") || src.startsWith("./"))) {
              return (
                <figure key={i} className="my-4">
                  <div className="rounded-2xl overflow-hidden border border-sky-500/20 bg-slate-900/60 p-2 shadow-lg">
                    <img
                      src={src}
                      alt={b.alt || "Ilustrasi Materi"}
                      className="w-full h-auto max-h-96 object-contain rounded-xl mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {b.alt && <figcaption className="text-xs text-slate-400 mt-2 text-center font-mono">{b.alt}</figcaption>}
                </figure>
              );
            }
            return null;
          }

          case "table":
            return (
              <div key={i} className="overflow-x-auto my-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-sky-400 font-bold border-b border-slate-800">
                    <tr>
                      {b.head.map((h, j) => (
                        <th
                          key={j}
                          className="px-3 py-2.5"
                          dangerouslySetInnerHTML={{ __html: h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {b.rows.map((r, j) => (
                      <tr key={j} className="hover:bg-slate-900/40">
                        {r.map((c, k) => (
                          <td key={k} className="px-3 py-2" dangerouslySetInnerHTML={{ __html: c }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/* ==========================================================================
   KOMPONEN UTAMA: CROSS-PLATFORM LAB
   ========================================================================== */
export default function CrossPlatformLab({ onDone, onExit, startMeetingNo = 1 }: Props) {
  const [currentNo, setCurrentNo] = useState(startMeetingNo);
  const [activeTab, setActiveTab] = useState<"teori" | "tutorial" | "code" | "quiz" | "tugas">("teori");
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);
  const [showRawMd, setShowRawMd] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  // Quiz state per meeting
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [completedMeetings, setCompletedMeetings] = useState<Record<number, boolean>>({});

  // Simulated Terminal State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "› Starting Metro Bundler on port 8081...",
    "› Fast Refresh enabled.",
    "› Scan the QR code above with Expo Go (Android) or Camera (iOS).",
  ]);

  const meeting: CrossPlatformMeeting =
    CROSS_PLATFORM_MEETINGS.find((m) => m.no === currentNo) || CROSS_PLATFORM_MEETINGS[0];

  // Memuat dokumen markdown (.md)
  const mdDoc = useMemo(() => getCrossPlatformMdDoc(currentNo), [currentNo]);
  const mdBlocks = useMemo(() => (mdDoc ? parseMd(mdDoc.source) : []), [mdDoc]);

  const handleSelectMeeting = (no: number) => {
    sfx.click();
    setCurrentNo(no);
    setActiveTab("teori");
    setActiveFileIndex(0);
    setQuizSelected(null);
    setShowRawMd(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedFile(true);
    sfx.click();
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyMdSource = () => {
    if (!mdDoc) return;
    navigator.clipboard.writeText(mdDoc.source);
    setCopiedMd(true);
    sfx.click();
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(optionIdx);
    const isCorrect = optionIdx === meeting.quiz.answer;
    if (isCorrect) {
      sfx.quizOk();
      setCompletedMeetings((prev) => ({ ...prev, [currentNo]: true }));
    } else {
      sfx.err();
    }
  };

  const handleFinishMeeting = () => {
    sfx.win();
    setCompletedMeetings((prev) => ({ ...prev, [currentNo]: true }));
    if (onDone) {
      const mockResult: GameResult = {
        score: 100,
        stars: 3,
        accuracy: 98,
        wpm: 60,
        won: true,
        maxCombo: 15,
        timeSec: 120,
        correct: 50,
        errors: 0,
        missed: {},
        linesCompleted: 30,
      };
      onDone(mockResult);
    } else if (currentNo < 16) {
      handleSelectMeeting(currentNo + 1);
    }
  };

  const executeCommand = (cmd: string) => {
    sfx.click();
    setTerminalLogs((prev) => [
      ...prev,
      `$ ${cmd}`,
      cmd.includes("build")
        ? "› Compiling Android APK with EAS Cloud..."
        : "› Fast Refresh: update bundle (12ms)",
    ]);
  };

  return (
    <div className="min-h-screen bg-[#060f1d] text-slate-100 select-none pb-24">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(6,16,32,0.92)] border-b border-[rgba(56,189,248,0.2)]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sfx.click();
                onExit();
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-sky-400 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
            >
              <IconArrowL size={14} />
              <span>Kembali ke HUD</span>
            </button>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <h1 className="font-extrabold text-sm text-white flex items-center gap-2">
              <span className="text-sky-400">📱 CrossPlatform Studio</span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                P{meeting.no}: {meeting.title}
              </span>
            </h1>
          </div>

          {/* Meeting Quick Selector (1-16) */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[400px] py-1 scrollbar-none">
            {CROSS_PLATFORM_MEETINGS.map((m) => {
              const isDone = completedMeetings[m.no];
              const isCurrent = m.no === currentNo;
              return (
                <button
                  key={m.no}
                  onClick={() => handleSelectMeeting(m.no)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/40 scale-105"
                      : isDone
                      ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-400"
                      : "bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-white"
                  }`}
                  title={`P${m.no}: ${m.title}`}
                >
                  {isDone ? <IconCheck size={12} /> : m.no}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="max-w-7xl mx-auto px-4 pt-4 space-y-4">
        {/* Two-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Learning Tabs & RPS Curriculum (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Meeting Meta Header */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 flex-wrap mb-1 text-xs">
                <span className="font-bold text-sky-400">
                  {meeting.phase}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-medium">{meeting.sks}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300 font-semibold">{meeting.cpmk}</span>
              </div>
              <h2 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-1">
                Pertemuan {meeting.no}: {meeting.title}
              </h2>
              <p className="text-xs text-sky-200/90 font-medium mt-1 leading-relaxed">
                🎯 <strong>Capaian:</strong> {meeting.goal}
              </p>
              <div className="mt-2.5 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                📦 <strong>Target Output:</strong> {meeting.outputPraktikum}
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("teori");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "teori"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📖 Materi (.md)
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("tutorial");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "tutorial"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                💻 Tutorial
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("code");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "code"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📜 Kode
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("quiz");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ⚡ Kuis
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("tugas");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "tugas"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📝 Tugas
              </button>
            </div>

            {/* ============ TAB CONTENT: TEORI DARI FILE MARKDOWN (.md) ============ */}
            {activeTab === "teori" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                {/* Markdown Header Toolbar */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] truncate">
                    <span className="text-sky-400">📄 Berkas:</span>
                    <span className="truncate">/content/crossplatform/{mdDoc?.fileName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyMdSource}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {copiedMd ? "✓ .md Tersalin" : "📋 Salin .md"}
                    </button>
                    <button
                      onClick={() => {
                        sfx.click();
                        setShowRawMd((prev) => !prev);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/40 text-sky-300 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      {showRawMd ? "👁️ Tampilan Render" : "📝 Lihat Raw .md"}
                    </button>
                  </div>
                </div>

                {/* Markdown Content (Rendered vs Raw) */}
                {showRawMd ? (
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sky-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                    <code>{mdDoc?.source}</code>
                  </pre>
                ) : (
                  <div className="md-body">
                    <CrossPlatformMdView blocks={mdBlocks} />
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: TUTORIAL STEP-BY-STEP */}
            {activeTab === "tutorial" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <IconKeyboard size={17} className="text-sky-400" /> Panduan Tutorial Step-by-Step
                </h3>
                <div className="space-y-3">
                  {meeting.steps.map((st) => (
                    <div
                      key={st.step}
                      className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-extrabold text-xs grid place-items-center">
                          {st.step}
                        </span>
                        <h4 className="font-bold text-sm text-white">{st.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-8">{st.desc}</p>
                      {st.command && (
                        <div className="ml-8 mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs text-sky-300">
                          <code>{st.command}</code>
                          <button
                            onClick={() => executeCommand(st.command!)}
                            className="text-[10px] font-bold px-2 py-1 rounded bg-sky-600 text-white hover:bg-sky-500 cursor-pointer"
                          >
                            Jalankan ⚡
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: KODE SUMBER */}
            {activeTab === "code" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex gap-1.5">
                    {meeting.files.map((f, i) => (
                      <button
                        key={f.name}
                        onClick={() => {
                          sfx.click();
                          setActiveFileIndex(i);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          activeFileIndex === i
                            ? "bg-sky-600 text-white shadow-md"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopyCode(meeting.files[activeFileIndex].code)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{copiedFile ? "✓ Berhasil Disalin" : "Salin Kode"}</span>
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#030712]">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-sky-300">{meeting.files[activeFileIndex].name}</span>
                    <span>{meeting.files[activeFileIndex].description}</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-sky-200 overflow-x-auto whitespace-pre leading-relaxed">
                    <code>{meeting.files[activeFileIndex].code}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* TAB CONTENT: KUIS INTERAKTIF RPS */}
            {activeTab === "quiz" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <IconStar size={17} className="text-amber-400" /> Kuis Pemahaman RPS
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    +50 XP
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-3">
                  <p className="font-bold text-sm text-slate-100">{meeting.quiz.question}</p>
                  <div className="space-y-2">
                    {meeting.quiz.options.map((opt, i) => {
                      const isChosen = quizSelected === i;
                      const isCorrect = i === meeting.quiz.answer;
                      let btnCls = "bg-slate-900/90 border-slate-700 text-slate-300 hover:border-sky-400";
                      if (quizSelected !== null) {
                        if (isCorrect) {
                          btnCls = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
                        } else if (isChosen) {
                          btnCls = "bg-rose-950/80 border-rose-500 text-rose-200";
                        }
                      }
                      return (
                        <button
                          key={i}
                          disabled={quizSelected !== null}
                          onClick={() => handleAnswerQuiz(i)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-2 cursor-pointer ${btnCls}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-slate-600 grid place-items-center text-[10px] shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSelected !== null && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300">
                      <p className="font-bold text-sky-400">Penjelasan:</p>
                      <p className="mt-1">{meeting.quiz.explanation}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => handleSelectMeeting(Math.max(1, currentNo - 1))}
                    disabled={currentNo === 1}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs disabled:opacity-40 cursor-pointer"
                  >
                    ← P{currentNo - 1}
                  </button>
                  <button
                    onClick={handleFinishMeeting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 font-extrabold text-white text-xs shadow-lg shadow-sky-600/30 cursor-pointer"
                  >
                    Tuntaskan Pertemuan {currentNo} ✓
                  </button>
                  <button
                    onClick={() => handleSelectMeeting(Math.min(16, currentNo + 1))}
                    disabled={currentNo === 16}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs disabled:opacity-40 cursor-pointer"
                  >
                    P{currentNo + 1} →
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TUGAS LMS & RUBRIK */}
            {activeTab === "tugas" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-base text-white">
                  📋 {meeting.tugas.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {meeting.tugas.description}
                </p>

                <h4 className="font-bold text-xs text-sky-400 uppercase tracking-wider mt-3">
                  Rubrik Penilaian Dosen:
                </h4>
                <div className="space-y-1.5">
                  {meeting.tugas.rubrik.map((r, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-200">{r.criteria}</span>
                      <span className="font-bold text-sky-400">{r.bobot}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Phone Simulator + Terminal (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col items-center">
            {/* Interactive Device Simulator */}
            <CrossPlatformPhoneSimulator
              meeting={meeting}
              onActionComplete={() => {
                setCompletedMeetings((prev) => ({ ...prev, [currentNo]: true }));
              }}
            />

            {/* Simulated Expo CLI Terminal */}
            <div className="w-full max-w-[340px] rounded-2xl bg-[#030712] border border-slate-800 p-3 font-mono text-[11px] text-slate-300 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Expo Metro Terminal
                </span>
                <span className="text-[10px] text-slate-500">Port 8081</span>
              </div>
              <div className="space-y-1 text-slate-400 text-[10px] max-h-24 overflow-y-auto">
                {terminalLogs.map((log, i) => (
                  <p key={i} className="truncate">
                    {log}
                  </p>
                ))}
              </div>
              <div className="flex gap-1 pt-1">
                <button
                  onClick={() => executeCommand("npx expo start")}
                  className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-[10px] font-bold cursor-pointer"
                >
                  expo start
                </button>
                <button
                  onClick={() => executeCommand("r (reload)")}
                  className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer"
                >
                  reload (r)
                </button>
                <button
                  onClick={() => executeCommand("eas build -p android")}
                  className="flex-1 py-1 rounded bg-amber-600/80 hover:bg-amber-500 text-white text-[10px] font-bold cursor-pointer"
                >
                  eas build
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
