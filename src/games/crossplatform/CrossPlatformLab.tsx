/* ==========================================================================
   CROSS-PLATFORM STUDIO / LAB ARENA
   Sub-Game Khusus: Mata Kuliah Sistem Aplikasi Lintas Platform (React Native & Expo)
   16 Pertemuan Komprehensif • Step-by-Step • Phone Simulator • RPS Tracker
   ========================================================================== */

import { useState } from "react";
import {
  CROSS_PLATFORM_MEETINGS,
  type CrossPlatformMeeting,
} from "../../data/crossPlatformCurriculum";
import CrossPlatformPhoneSimulator from "./CrossPlatformPhoneSimulator";
import { sfx } from "../../lib/audio";
import {
  IconArrowL,
  IconBook,
  IconCheck,
  IconKeyboard,
  IconStar,
} from "../../ui/icons";
import type { GameResult } from "../../ui/TypingGame";

interface Props {
  onDone?: (r: GameResult) => void;
  onExit: () => void;
  startMeetingNo?: number;
}

export default function CrossPlatformLab({ onDone, onExit, startMeetingNo = 1 }: Props) {
  const [currentNo, setCurrentNo] = useState(startMeetingNo);
  const [activeTab, setActiveTab] = useState<"teori" | "tutorial" | "code" | "quiz" | "tugas">("teori");
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);

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

  const handleSelectMeeting = (no: number) => {
    sfx.click();
    setCurrentNo(no);
    setActiveTab("teori");
    setActiveFileIndex(0);
    setQuizSelected(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedFile(true);
    sfx.click();
    setTimeout(() => setCopiedFile(false), 2000);
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
      `$ ${cmd}`,
      cmd.includes("build")
        ? "› [EAS] Build started in cloud: compiling Android APK..."
        : "› Metro: Bundling 100% (JavaScript transforms complete)",
      ...prev.slice(0, 4),
    ]);
  };

  const totalDone = Object.keys(completedMeetings).length;

  return (
    <div className="min-h-screen bg-[#060f1e] text-slate-100 pb-20 relative select-none">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(6,15,30,0.92)] border-b border-[rgba(56,189,248,0.2)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Kembali ke Dashboard Hub"
            >
              <IconArrowL size={18} />
            </button>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-sky-400">
                  📱 SISTEM APLIKASI LINTAS PLATFORM
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
                  3 SKS • Semester 5
                </span>
              </div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight mt-0.5">
                React Native & Expo SDK Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5">
              <IconCheck size={14} /> {totalDone}/16 Tuntas
            </span>
            <button
              onClick={onExit}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              Tutup Lab ✕
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        {/* 16 Pertemuan RPS Stepper Selector */}
        <section className="mb-6">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <IconBook size={14} className="text-sky-400" /> Silabus 16 Pertemuan RPS
            </span>
            <span className="text-[11px] text-sky-300 font-bold">
              Pertemuan {currentNo}: {meeting.title}
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CROSS_PLATFORM_MEETINGS.map((m) => {
              const active = m.no === currentNo;
              const done = !!completedMeetings[m.no];
              return (
                <button
                  key={m.no}
                  onClick={() => handleSelectMeeting(m.no)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-extrabold text-xs shrink-0 transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                    active
                      ? "bg-sky-600 text-white shadow-[0_0_15px_rgba(2,132,199,0.5)] scale-105 border-2 border-sky-300"
                      : done
                        ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80"
                        : "bg-slate-800/80 border border-slate-700 text-slate-400 hover:border-sky-400 hover:text-white"
                  }`}
                  title={`P${m.no}: ${m.title}`}
                >
                  <span>P{m.no}</span>
                  {done && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Two-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Learning Materials, Steps, Code, Quiz (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Header Meeting Info Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {meeting.phase}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {meeting.sks}
                </span>
              </div>
              <h2 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-1">
                Pertemuan {meeting.no}: {meeting.title}
              </h2>
              <p className="text-xs text-sky-200/90 font-medium mt-1 leading-relaxed">
                🎯 <strong>Capaian:</strong> {meeting.goal}
              </p>
              <div className="mt-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  📦 <strong>Output Praktikum:</strong> {meeting.outputPraktikum}
                </span>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("teori");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teori"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📖 Teori RPS
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("tutorial");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
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
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
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
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "quiz"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ⚡ Kuis & Uji
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveTab("tugas");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "tugas"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📝 Tugas LMS
              </button>
            </div>

            {/* TAB CONTENT: TEORI */}
            {activeTab === "teori" && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <IconBook size={17} className="text-sky-400" /> Materi Teori & Arsitektur
                </h3>
                {meeting.materiTeori.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2"
                  >
                    <h4 className="font-bold text-sm text-sky-300">{m.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.explanation}</p>
                    <ul className="space-y-1 pt-1">
                      {m.points.map((p, pIdx) => (
                        <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-sky-400 shrink-0 mt-0.5">▸</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* CPMK Association Badge */}
                <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-400/20 text-xs text-sky-200">
                  <strong className="text-sky-300">Capaian Pembelajaran (CPMK):</strong> {meeting.cpmk}
                </div>
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
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
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedFile ? <><IconCheck size={14} /> Tersalin!</> : "Salin Kode"}
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  {meeting.files[activeFileIndex].description}
                </p>

                <div className="rounded-2xl bg-[#030712] border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed code-scroll max-h-[380px]">
                  <pre>{meeting.files[activeFileIndex].code}</pre>
                </div>
              </div>
            )}

            {/* TAB CONTENT: KUIS & EVALUASI */}
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
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs disabled:opacity-40"
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
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs disabled:opacity-40"
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
                  className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-[10px] font-bold"
                >
                  expo start
                </button>
                <button
                  onClick={() => executeCommand("r (reload)")}
                  className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                >
                  reload (r)
                </button>
                <button
                  onClick={() => executeCommand("eas build -p android")}
                  className="flex-1 py-1 rounded bg-amber-600/80 hover:bg-amber-500 text-white text-[10px] font-bold"
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
