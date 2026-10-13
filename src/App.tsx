import { useEffect, useState } from "react";
import type { AgeId, SaveData } from "./lib/storage";
import { clearSave, defaultSave, loadSave, persist, rankOf } from "./lib/storage";
import { AGE_GROUPS, getModule } from "./data/modules";
import { getSession, questId } from "./data/quests";
import type { Session } from "./data/quests";
import { applyAttempt, meetingLevel, meetingUnlocked } from "./lib/progress";
import Pertemuan from "./ui/Pertemuan";
import { sfx } from "./lib/audio";
import Ambient from "./graphics/Ambient";
import Onboarding from "./ui/Onboarding";
import Dashboard from "./ui/Dashboard";
import Materi from "./ui/Materi";
import MateriHtml from "./ui/MateriHtml";
import TypingGame from "./ui/TypingGame";
import type { GameResult } from "./ui/TypingGame";
import Results from "./ui/Results";

type Screen =
  | { s: "dash" }
  | { s: "peta"; no: number }
  | { s: "materi"; id: string }
  | { s: "materi-html"; no?: number }
  | { s: "game"; id: string; k: number }
  | { s: "result"; id: string; r: GameResult; xp: number; coins: number; rankUp: string | null; passed: boolean };

export default function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [sound, setSound] = useState<boolean>(() => loadSave().profile?.sound ?? true);
  const [screen, setScreen] = useState<Screen>({ s: "dash" });
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => persist(save), [save]);
  useEffect(() => {
    sfx.enabled = sound;
  }, [sound]);

  const profile = save.profile;
  const cfg = AGE_GROUPS[profile?.age ?? "teen"];

  /* ===== aksi profil ===== */
  const createProfile = (name: string, age: AgeId) => {
    sfx.click();
    setSave((s) => ({
      ...s,
      profile: { name, age, sound, createdAt: Date.now() },
    }));
    setScreen({ s: "dash" });
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSave((s) => (s.profile ? { ...s, profile: { ...s.profile, sound: next } } : s));
  };

  const resetProfile = () => {
    clearSave();
    setSave(defaultSave());
    setScreen({ s: "dash" });
    sfx.click();
  };

  /* ===== aksi permainan ===== */
  const completeMateri = (id: string, quizXp: number) => {
    const prev = save.modules[id] ?? { materiDone: false, quizXp: 0, completions: 0 };
    const firstRead = !prev.materiDone;
    const firstQuiz = prev.quizXp === 0 && quizXp > 0;
    const gained = (firstRead ? 20 : 0) + (firstQuiz ? quizXp : 0);
    setSave((s) => {
      const p = s.modules[id] ?? { materiDone: false, quizXp: 0, completions: 0 };
      return {
        ...s,
        xp: s.xp + gained,
        modules: {
          ...s.modules,
          [id]: { ...p, materiDone: true, quizXp: Math.max(p.quizXp, quizXp) },
        },
      };
    });
    /* pertama kali selesai materi → langsung lanjut ke praktikum (alur belajar) */
    if (firstRead) enterPractice(id);
    else setScreen({ s: "dash" });
  };

  const enterPractice = (id: string) => {
    setGameKey((k) => k + 1);
    setScreen({ s: "game", id, k: gameKey + 1 });
  };

  /* sesi dihitung ulang di sini (satu sumber aturan: lib/progress.ts).
     XP & koin hanya bertambah di atas hasil terbaik sesi → replay tanpa peningkatan tidak menambah XP. */
  const finishPractice = (id: string, r: GameResult) => {
    const sess = getSession(id);
    if (!sess) return setScreen({ s: "dash" });
    const prevRankName = rankOf(save.xp).cur.name;
    const xpSession = r.won ? 50 + r.stars * 25 + Math.round(r.accuracy / 5) : Math.round(r.score / 25);
    const coinsSession = r.won ? 10 + r.stars * 10 + Math.round(r.accuracy / 10) : 0;
    const { next, passed, xpAward, coinsAward } = applyAttempt(save.modules[id], sess, r, xpSession, coinsSession);
    const newRankName = rankOf(save.xp + xpAward).cur.name;
    const rankUp = newRankName !== prevRankName ? newRankName : null;

    setSave((s) => ({
      ...s,
      xp: s.xp + xpAward,
      coins: s.coins + coinsAward,
      modules: { ...s.modules, [id]: next },
      stats: {
        games: s.stats.games + 1,
        wins: s.stats.wins + (r.won ? 1 : 0),
        bestWpm: Math.max(s.stats.bestWpm, r.won ? r.wpm : 0),
        bestCombo: Math.max(s.stats.bestCombo, r.maxCombo),
        keystrokes: s.stats.keystrokes + r.correct + r.errors,
        correct: s.stats.correct + r.correct,
      },
    }));
    setScreen({ s: "result", id, r, xp: xpAward, coins: coinsAward, rankUp, passed });
  };

  /* pertemuan dibuka dari peta / materi HTML → sesi pertemuan itu */
  const playQuest = (no: number, kind: "quest" | "drill" | "juggle") => enterPractice(questId(no, kind));

  /* ===== render ===== */
  return (
    <div className={`age-${cfg.id}`} style={{ "--accent": cfg.accent, "--accent-deep": shade(cfg.accent) } as React.CSSProperties}>
      <Ambient fish={!profile || screen.s === "dash"} />

      {!profile ? (
        <Onboarding soundOn={sound} onToggleSound={toggleSound} onCreate={createProfile} />
      ) : screen.s === "dash" ? (
        <Dashboard
          save={save}
          cfg={cfg}
          onMateri={(id) =>
            /* modul HTML memakai dokumen .md per pertemuan sebagai materi utama */
            id === "html" ? setScreen({ s: "materi-html" }) : setScreen({ s: "materi", id })
          }
          onPractice={enterPractice}
          onMateriHtml={() => setScreen({ s: "materi-html" })}
          onPeta={() => setScreen({ s: "peta", no: nextMeeting(save) })}
          onToggleSound={toggleSound}
          onResetProfile={resetProfile}
        />
      ) : screen.s === "peta" ? (
        <Pertemuan
          key={screen.no}
          save={save}
          startNo={screen.no}
          onExit={() => setScreen({ s: "dash" })}
          onMateri={(no) => setScreen({ s: "materi-html", no })}
          onPlay={(no, kind) => playQuest(no, kind)}
        />
      ) : screen.s === "materi-html" ? (
        <MateriHtml
          startNo={screen.no}
          save={save}
          onPractice={enterPractice}
          onExit={() => setScreen({ s: "dash" })}
        />
      ) : screen.s === "materi" ? (
        <Materi
          key={screen.id}
          mod={getModule(screen.id)}
          cfg={cfg}
          alreadyDone={!!save.modules[screen.id]?.materiDone}
          onComplete={(quizXp) => completeMateri(screen.id, quizXp)}
          onPractice={() => enterPractice(screen.id)}
          onExit={() => setScreen({ s: "dash" })}
        />
      ) : screen.s === "game" ? (
        <TypingGame
          key={`${screen.id}-${screen.k}`}
          mod={sessionOf(screen.id)}
          cfg={cfg}
          onDone={(r) => finishPractice(screen.id, r)}
          onExit={() => setScreen({ s: "dash" })}
        />
      ) : (
        <Results
          mod={sessionOf(screen.id)}
          cfg={cfg}
          result={screen.r}
          passed={screen.passed}
          xpGained={screen.xp}
          coinsGained={screen.coins}
          rankUp={screen.rankUp}
          onRetry={() => enterPractice(screen.id)}
          onMap={() => setScreen(meetingScreenOf(screen.id))}
        />
      )}
    </div>
  );
}

/* sesi aktif — id bisa berupa modul lama (html/css/js) atau sesi pertemuan (q:<no>:<kind>) */
function sessionOf(id: string): Session {
  return getSession(id) ?? (getSession("html") as Session);
}

/** kembali ke halaman peta bila sesi berasal dari pertemuan (q:<no>:<kind>), selain itu ke dashboard */
function meetingScreenOf(id: string): Screen {
  const m = /^q:(\d+):/.exec(id);
  if (m) return { s: "peta", no: Math.min(16, Math.max(1, Number(m[1]))) };
  return { s: "dash" };
}

/** pertemuan pertama yang belum PERAK (untuk tombol "lanjut") */
function nextMeeting(save: SaveData): number {
  for (let no = 1; no <= 16; no++) {
    if (meetingUnlocked(save, no) && meetingLevel(save, no) < 2) return no;
  }
  return 16;
}


/* versi lebih gelap dari warna aksen — untuk bayangan tombol */
function shade(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.62));
  const r = f((n >> 16) & 255);
  const gr = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (gr << 8) | b).toString(16).padStart(6, "0")}`;
}
