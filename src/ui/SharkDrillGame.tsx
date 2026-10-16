/* CodingShark mode Drill — arena Shark Typer per-hiu.
   Setiap hiu yang berhasil dihancurkan (kata selesai diketik) → +poin.
   Setiap hiu yang lolos & menyerang (keluar kiri) → -poin + nyawa -1.
   Skor akhir diteruskan sebagai GameResult agar XP/koin/progres berjalan normal. */
import { useRef } from "react";
import SharkTyperDrill from "../components/SharkTyperDrill";
import type { DrillResult } from "../components/SharkTyperDrill";
import type { Session } from "../data/quests";
import { DRILLS } from "../data/quests";
import type { GameResult } from "./TypingGame";

/** poin dasar per hiu hancur & penalti per hiu menyerang (sama di .tsx + .html) */
export const DRILL_KILL_POINTS = 100;
export const DRILL_ATTACK_PENALTY = 50;

interface Props {
  mod: Session;
  onDone: (r: GameResult) => void;
  onExit: () => void;
}

/** kata drill = baris sintaks inti pertemuan (satu baris = satu hiu) */
export function drillWordsFor(mod: Session): string[] {
  const items = DRILLS[mod.num];
  if (items && items.length > 0) return items;
  return mod.code.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12);
}

export default function SharkDrillGame({ mod, onDone, onExit }: Props) {
  const t0 = useRef(performance.now());
  const words = drillWordsFor(mod);

  const handleFinish = (r: DrillResult) => {
    const acc = Math.round(r.accuracy * 100);
    const won = r.passed;
    const stars = won ? (acc >= 95 ? 3 : acc >= 85 ? 2 : 1) : 0;
    const errors = Math.max(0, r.typed - r.correct);
    const timeSec = Math.max(5, Math.round((performance.now() - t0.current) / 1000));
    const out: GameResult = {
      won,
      score: r.score,
      accuracy: acc,
      wpm: r.wpm,
      maxCombo: r.maxCombo,
      stars,
      timeSec,
      correct: r.correct,
      errors,
      missed: {},
    };
    onDone(out);
  };

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-10">
      <p className="text-center text-[11px] text-[var(--faint)] font-semibold mt-1.5 mb-2">
        🦈 Mode Drill — hiu hancur <strong className="text-[var(--teal)]">+{DRILL_KILL_POINTS}</strong> (+bonus combo) ·
        hiu menyerang <strong className="text-[var(--coral)]">-{DRILL_ATTACK_PENALTY}</strong> + nyawa -1
      </p>
      {/* SharkTyperDrill mengisi height 100% — parent wajib punya tinggi */}
      <div style={{ height: "calc(100dvh - 170px)", minHeight: 560 }}>
        <SharkTyperDrill
          missionId={mod.num >= 1 && mod.num <= 16 ? mod.num : 1}
          words={words}
          title={mod.practiceTitle}
          speed={mod.threatMul <= 0.7 ? 0.85 : 1}
          lives={3}
          waves={3}
          waveSize={6}
          killPoints={DRILL_KILL_POINTS}
          attackPenalty={DRILL_ATTACK_PENALTY}
          onFinish={handleFinish}
          onExit={onExit}
        />
      </div>
    </div>
  );
}
