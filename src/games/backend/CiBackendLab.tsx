/* ==========================================================================
   CI4 BACKEND STUDIO / LAB ARENA
   Sub-Game: Sistem Aplikasi Web - Backend Dasar (CodeIgniter 4 & MySQL)
   16 Pertemuan Lengkap • RPS Standar DIKTI • phpMyAdmin & cPanel Simulator
   ========================================================================== */

import { useState, useMemo } from "react";
import {
  CI_BACKEND_MEETINGS,
  type BackendMeeting,
} from "../../data/ciBackendCurriculum";
import { getCiBackendMdDoc } from "../../data/materiBackendCi";
import { parseMd, type MdBlock } from "../../lib/markdown";
import CiBackendSimulator from "./CiBackendSimulator";
import { sfx } from "../../lib/audio";
import {
  IconArrowL,
  IconCheck,
} from "../../ui/icons";
import type { GameResult } from "../../ui/TypingGame";

interface Props {
  onDone?: (r: GameResult) => void;
  onExit: () => void;
  startMeetingNo?: number;
}

function BackendMdView({ blocks }: { blocks: MdBlock[] }) {
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
            return (
              <h4 key={i} className="font-bold text-sm text-sky-200 mt-2">
                {b.text}
              </h4>
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

          case "quote":
            return (
              <blockquote
                key={i}
                className="p-3.5 rounded-2xl bg-sky-950/40 border-l-4 border-sky-400 text-xs sm:text-sm text-sky-200 italic space-y-1"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );

          case "code":
            return (
              <div key={i} className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{b.lang || "code"}</span>
                  <button
                    onClick={() => handleCopyCode(b.code, i)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 cursor-pointer"
                  >
                    {copiedIndex === i ? "✓ Tersalin" : "Salin Kode"}
                  </button>
                </div>
                <pre className="p-3.5 text-xs font-mono text-sky-200 overflow-x-auto leading-relaxed whitespace-pre">
                  <code>{b.code}</code>
                </pre>
              </div>
            );

          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-sky-300 font-bold border-b border-slate-800">
                      {b.head.map((h: string, k: number) => (
                        <th key={k} className="p-2.5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                    {b.rows.map((r, ri) => (
                      <tr key={ri} className="hover:bg-slate-900/50">
                        {r.map((c, ci) => (
                          <td key={ci} className="p-2.5 text-slate-300">
                            {c}
                          </td>
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

export default function CiBackendLab({
  onDone,
  onExit,
  startMeetingNo = 1,
}: Props) {
  const [currentNo, setCurrentNo] = useState<number>(() => {
    return Math.min(Math.max(1, startMeetingNo), 16);
  });

  const [activeTab, setActiveTab] = useState<
    "teori" | "tutorial" | "code" | "quiz" | "tugas" | "rps"
  >("teori");

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showRawMd, setShowRawMd] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "› Starting PHP 8.2 Development Server (Document Root: htdocs/simpus-mini)...",
    "› PHP Development server started on http://localhost:8000",
    "› MySQL Database connected: simpus_mini @ localhost:3306 (mysqli utf8mb4)",
    "› Press Ctrl-C to quit.",
  ]);

  const [completedMeetings, setCompletedMeetings] = useState<Record<number, boolean>>({});

  const meeting: BackendMeeting = useMemo(() => {
    return CI_BACKEND_MEETINGS.find((m) => m.no === currentNo) || CI_BACKEND_MEETINGS[0];
  }, [currentNo]);

  const mdDoc = useMemo(() => getCiBackendMdDoc(currentNo), [currentNo]);
  const mdBlocks = useMemo(() => parseMd(mdDoc?.source || ""), [mdDoc]);

  const handleSelectMeeting = (no: number) => {
    sfx.click();
    setCurrentNo(no);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizScore(null);
    setActiveFileIndex(0);
    setShowRawMd(false);
  };

  const handleCopyMdSource = () => {
    if (mdDoc?.source) {
      navigator.clipboard.writeText(mdDoc.source);
      sfx.click();
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    sfx.click();
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === meeting.quiz.answer;
    if (isCorrect) {
      sfx.win();
      setQuizScore(100);
      setCompletedMeetings((prev) => ({ ...prev, [currentNo]: true }));
    } else {
      sfx.err();
      setQuizScore(0);
    }
  };

  const executeCommand = (cmd: string) => {
    sfx.click();
    setTerminalLogs((prev) => [
      ...prev,
      `$ ${cmd}`,
      cmd.includes("serve")
        ? "› Server running on http://localhost:8080"
        : cmd.includes("routes")
        ? "› Routes: GET /buku, POST /buku/simpan, GET /buku/detail/(:num)"
        : "› Command executed successfully.",
    ]);
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

  return (
    <div className="min-h-screen bg-[#060f1d] text-slate-100 select-none pb-24">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(6,16,32,0.92)] border-b border-[rgba(56,189,248,0.2)]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sfx.click();
                onExit();
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-sky-400 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
            >
              <IconArrowL size={14} />
              <span>Kembali ke Hub</span>
            </button>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <h1 className="font-extrabold text-sm text-white flex items-center gap-2">
              <span className="text-sky-400">🐘 Backend PHP Studio</span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                P{meeting.no}: {meeting.title}
              </span>
            </h1>
          </div>

          {/* Meeting Quick Selector (1-16) */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[400px] py-1 scrollbar-none">
            {CI_BACKEND_MEETINGS.map((m) => {
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
                <span className="font-bold text-sky-400">{meeting.phase}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-medium">{meeting.sks}</span>
                {meeting.asesmenTerkait && (
                  <>
                    <span className="text-slate-500">·</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/50 text-rose-300 font-bold text-[10px]">
                      ★ {meeting.asesmenTerkait.nama} ({meeting.asesmenTerkait.bobot})
                    </span>
                  </>
                )}
              </div>
              <h2 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-1">
                Pertemuan {meeting.no}: {meeting.title}
              </h2>
              <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-sky-200/90 leading-relaxed">
                🎯 <strong>Sub-CPMK:</strong> {meeting.subCpmk}
              </div>
              <div className="mt-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                📦 <strong>Target Praktikum:</strong> {meeting.outputPraktikum}
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto scrollbar-none">
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("teori");
                }}
                className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "tugas"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📝 Tugas
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("rps");
                }}
                className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "rps"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📋 RPS DIKTI
              </button>
            </div>

            {/* ============ TAB 1: TEORI (.MD) ============ */}
            {activeTab === "teori" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] truncate">
                    <span className="text-sky-400">📄 Berkas:</span>
                    <span className="truncate">/content/ci_backend/{mdDoc?.fileName}</span>
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

                {showRawMd ? (
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sky-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                    <code>{mdDoc?.source}</code>
                  </pre>
                ) : (
                  <div className="md-body">
                    <BackendMdView blocks={mdBlocks} />
                  </div>
                )}
              </div>
            )}

            {/* ============ TAB 2: TUTORIAL STEP-BY-STEP ============ */}
            {activeTab === "tutorial" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-base text-white">Panduan Praktik Bertahap (Guided Live Coding)</h3>
                <div className="space-y-3">
                  {meeting.steps.map((st) => (
                    <div key={st.step} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-sky-300">
                          Langkah {st.step}: {st.title}
                        </span>
                        {st.command && (
                          <button
                            onClick={() => executeCommand(st.command!)}
                            className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono text-[10px] font-bold cursor-pointer"
                          >
                            ▶ Jalankan di Terminal
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
                      {st.codeSnippet && (
                        <pre className="p-2.5 rounded-xl bg-slate-900 text-sky-200 font-mono text-xs overflow-x-auto">
                          <code>{st.codeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============ TAB 3: KODE FILE SWITCHER ============ */}
            {activeTab === "code" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">Berkas Sumber Proyek CodeIgniter 4</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {meeting.files[activeFileIndex]?.name}
                  </span>
                </div>

                {/* File Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {meeting.files.map((f, fi) => (
                    <button
                      key={fi}
                      onClick={() => {
                        sfx.click();
                        setActiveFileIndex(fi);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        activeFileIndex === fi
                          ? "bg-sky-600 text-white shadow-sm"
                          : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>

                {/* Code Viewer */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>{meeting.files[activeFileIndex]?.description}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(meeting.files[activeFileIndex]?.code || "");
                        sfx.click();
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] cursor-pointer"
                    >
                      Salin Kode
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-sky-200 overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto">
                    <code>{meeting.files[activeFileIndex]?.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* ============ TAB 4: KUIS OBE ============ */}
            {activeTab === "quiz" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">Kuis Pemahaman Konsep (Formatif OBE)</h3>
                  <span className="text-xs font-bold text-sky-400">+50 XP</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <p className="text-sm font-bold text-slate-100">{meeting.quiz.question}</p>

                  <div className="space-y-2">
                    {meeting.quiz.options.map((opt, oi) => {
                      const isSelected = selectedQuizOption === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => {
                            if (!quizSubmitted) {
                              sfx.click();
                              setSelectedQuizOption(oi);
                            }
                          }}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${
                            isSelected
                              ? "bg-sky-950 border border-sky-400 text-white"
                              : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={selectedQuizOption === null}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-md"
                    >
                      Kirim Jawaban
                    </button>
                  ) : (
                    <div
                      className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
                        quizScore === 100
                          ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-200"
                          : "bg-rose-950/80 border border-rose-500/50 text-rose-200"
                      }`}
                    >
                      <p className="font-bold">
                        {quizScore === 100 ? "🎉 Jawaban Benar!" : "❌ Belum Tepat"}
                      </p>
                      <p className="text-[11px] leading-relaxed">{meeting.quiz.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============ TAB 5: TUGAS & RUBRIK ============ */}
            {activeTab === "tugas" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-base text-white">{meeting.tugas.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{meeting.tugas.description}</p>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-sky-300">Rubrik Penilaian Dosen:</h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                          <th className="p-2.5">Kriteria Ketercapaian</th>
                          <th className="p-2.5 text-right">Bobot</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                        {meeting.tugas.rubrik.map((rb, ri) => (
                          <tr key={ri}>
                            <td className="p-2.5 text-slate-200">{rb.criteria}</td>
                            <td className="p-2.5 text-right font-mono text-sky-400 font-bold">{rb.bobot}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleFinishMeeting}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
                  >
                    <IconCheck size={16} />
                    <span>Tandai Selesai & Lanjut ke Pertemuan {currentNo < 16 ? currentNo + 1 : 16}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============ TAB 6: DOKUMEN RPS LENGKAP STANDAR DIKTI ============ */}
            {activeTab === "rps" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">Rencana Pembelajaran Semester (RPS) Standar DIKTI</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("RPS Mata Kuliah Sistem Aplikasi Web (Backend Dasar) - DIKTI Standard");
                      sfx.click();
                      alert("RPS disalin ke clipboard!");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer"
                  >
                    📋 Salin RPS
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-[11px] leading-relaxed max-h-[600px] overflow-y-auto">
                  <p className="text-sky-300 font-bold text-xs">BAGIAN 1 — IDENTITAS MATA KULIAH</p>
                  <p>Mata Kuliah : Sistem Aplikasi Web (Backend Dasar)</p>
                  <p>Bobot SKS   : 3 SKS (1 Teori + 2 Praktikum)</p>
                  <p>Semester    : 3 (Sistem Informasi) / 5 (Teknik Informatika)</p>
                  <p>Tech Stack  : PHP 8.2 + Framework CodeIgniter 4 + MySQL Database</p>

                  <p className="text-sky-300 font-bold text-xs mt-3">BAGIAN 2 — CAPAIAN PEMBELAJARAN (CPMK)</p>
                  <p>CPMK-1: Menjelaskan konsep dasar arsitektur web dan cara kerja backend (C2)</p>
                  <p>CPMK-2: Merancang basis data MySQL serta operasi CRUD dengan CodeIgniter 4 (C3)</p>
                  <p>CPMK-3: Mengimplementasikan session login/register dan otorisasi role (C3)</p>
                  <p>CPMK-4: Men-deploy aplikasi web ke web hosting cPanel dan dokumentasi (C3)</p>
                  <p>CPMK-5: Menyelesaikan proyek PjBL SIMPUS-Mini secara mandiri/kelompok (C4)</p>

                  <p className="text-sky-300 font-bold text-xs mt-3">BAGIAN 3 — STRUKTUR 4 ASESMEN UTAMA</p>
                  <p>1. Formatif 1 (P4)  : 20% (Quiz Konsep DB + Tugas Koneksi MySQL)</p>
                  <p>2. Sumatif 1 / UTS (P8) : 25% (Praktik Membuat CRUD Sederhana)</p>
                  <p>3. Formatif 2 (P12) : 20% (Progress Project Login+Role + Presentasi)</p>
                  <p>4. Sumatif 2 / UAS (P16): 35% (Demo Aplikasi Live di Hosting + Laporan)</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Backend Simulator (5 Cols) */}
          <div className="lg:col-span-5 sticky top-16">
            <CiBackendSimulator
              meeting={meeting}
              terminalLogs={terminalLogs}
              onExecuteCmd={executeCommand}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
