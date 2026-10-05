import { useState } from "react";
import type { AgeCfg, Block, ModuleDef } from "../data/modules";
import { sfx } from "../lib/audio";
import { CodePanel } from "./Dashboard";
import {
  IconArrowL, IconArrowR, IconCheck, IconFin, IconInfo, IconKeyboard, IconStar, IconX,
} from "./icons";

interface Props {
  mod: ModuleDef;
  cfg: AgeCfg;
  alreadyDone: boolean;
  onComplete: (quizXp: number) => void;
  onPractice: () => void;
  onExit: () => void;
}

export default function Materi({ mod, cfg, alreadyDone, onComplete, onPractice, onExit }: Props) {
  const [idx, setIdx] = useState(0);
  const [quizXp, setQuizXp] = useState(0);
  const [awarded, setAwarded] = useState<Record<number, boolean>>({});
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const slide = mod.slides[idx];
  const isLast = idx === mod.slides.length - 1;
  const blockedByQuiz = slide.blocks.some((b) => b.t === "quiz") && !solved[idx];

  const finish = () => {
    onComplete(quizXp);
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* topbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,15,26,0.82)] border-b border-[var(--line-soft)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button className="btn btn-ghost !px-3 !py-2" onClick={onExit} aria-label="Kembali ke peta">
            <IconX size={17} />
          </button>
          <div className="leading-tight mr-auto">
            <p className="text-[10px] font-extrabold tracking-[0.22em] uppercase" style={{ color: mod.color }}>
              Misi 0{mod.num} • {mod.title}
            </p>
            <p className="font-display font-bold">Ruang Materi</p>
          </div>
          <div className="flex items-center gap-1.5">
            {mod.slides.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "w-7" : i < idx ? "w-2 bg-[var(--teal)]" : "w-2 bg-[rgba(126,196,236,0.25)]"}`}
                style={i === idx ? { background: mod.color } : undefined}
              />
            ))}
          </div>
          <span className="chip">Slide {idx + 1}/{mod.slides.length}</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <div key={idx} className="screen-in">
          <p className="text-xs font-extrabold tracking-[0.22em] uppercase" style={{ color: mod.color }}>
            {slide.kicker}
          </p>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl mt-1.5 mb-6">{slide.title}</h1>

          <div className="space-y-4 text-[1.05rem] leading-relaxed text-[rgba(214,236,249,0.92)]">
            {slide.blocks.map((b, i) => (
              <BlockView
                key={`${idx}-${i}`}
                block={b}
                slideIdx={idx}
                solved={!!solved[idx]}
                onSolved={(firstTry) => {
                  setSolved((s) => ({ ...s, [idx]: true }));
                  if (firstTry && !awarded[idx]) {
                    setAwarded((a) => ({ ...a, [idx]: true }));
                    setQuizXp((x) => x + 15);
                    sfx.quizOk();
                  } else {
                    sfx.click();
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* nav */}
        <div className="flex items-center justify-between gap-3 mt-10 mb-16">
          <button className="btn btn-ghost px-5 py-2.5" onClick={() => (idx === 0 ? onExit() : setIdx(idx - 1))}>
            <IconArrowL size={17} /> {idx === 0 ? "Peta" : "Sebelumnya"}
          </button>
          {blockedByQuiz ? (
            <span className="chip !text-[var(--amber)]">
              <IconInfo size={14} /> Jawab kuis dulu untuk lanjut
            </span>
          ) : !isLast ? (
            <button className="btn btn-primary px-6 py-2.5" onClick={() => { sfx.click(); setIdx(idx + 1); }}>
              Lanjut <IconArrowR size={17} />
            </button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <button className="btn btn-primary px-6 py-3" onClick={finish}>
                <IconCheck size={18} /> {alreadyDone ? "Materi Diperbarui — Kembali" : "Selesai & Buka Praktik"}
              </button>
              {alreadyDone && (
                <button className="btn btn-amber px-5 py-2 text-sm" onClick={onPractice}>
                  <IconKeyboard size={16} /> Langsung Praktik
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* mascot hint untuk kelompok muda */}
      {cfg.hints && (
        <div className="fixed bottom-4 left-4 z-30 hidden md:flex items-center gap-3 panel px-4 py-3 max-w-xs anim-fadeUp">
          <span className="w-10 h-10 grid place-items-center text-[var(--accent)] shrink-0">
            <IconFin size={30} />
          </span>
          <p className="text-xs text-[var(--dim)] leading-snug">
            <strong className="text-[var(--ink)]">Bubu bilang:</strong> baca pelan-pelan saja, kuisnya gampang kok. +15 XP kalau benar!
          </p>
        </div>
      )}
    </div>
  );
}

function BlockView({
  block, slideIdx, solved, onSolved,
}: {
  block: Block;
  slideIdx: number;
  solved: boolean;
  onSolved: (firstTry: boolean) => void;
}) {
  switch (block.t) {
    case "p":
      return <p className="anim-fadeUp">{block.text}</p>;
    case "list":
      return (
        <ul className="space-y-2.5 anim-fadeUp">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-1 w-5 h-5 shrink-0 rounded-md grid place-items-center bg-[rgba(46,230,200,0.14)] text-[var(--teal)] border border-[rgba(46,230,200,0.3)]">
                <IconCheck size={12} />
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div className="anim-fadeUp">
          <CodePanel code={block.code} lang={block.lang} caption={block.caption} />
        </div>
      );
    case "callout": {
      const tone = {
        tip: { c: "var(--teal)", bg: "rgba(46,230,200,0.09)", bd: "rgba(46,230,200,0.3)", ic: <IconInfo size={17} /> },
        warn: { c: "var(--coral)", bg: "rgba(255,107,87,0.09)", bd: "rgba(255,107,87,0.35)", ic: <IconX size={17} /> },
        fun: { c: "var(--amber)", bg: "rgba(255,194,71,0.09)", bd: "rgba(255,194,71,0.35)", ic: <IconStar size={17} /> },
      }[block.tone];
      return (
        <div className="rounded-xl border px-4 py-3.5 flex gap-3 anim-fadeUp" style={{ background: tone.bg, borderColor: tone.bd }}>
          <span className="mt-0.5 shrink-0" style={{ color: tone.c }}>{tone.ic}</span>
          <div>
            <p className="font-display font-bold" style={{ color: tone.c }}>{block.title}</p>
            <p className="text-[0.98rem] text-[rgba(214,236,249,0.9)]">{block.text}</p>
          </div>
        </div>
      );
    }
    case "quiz":
      return <Quiz block={block} key2={slideIdx} solved={solved} onSolved={onSolved} />;
    default:
      return null;
  }
}

function Quiz({
  block, key2, solved, onSolved,
}: {
  block: Extract<Block, { t: "quiz" }>;
  key2: number;
  solved: boolean;
  onSolved: (firstTry: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongOnce, setWrongOnce] = useState(false);
  const [shakeId, setShakeId] = useState(0);

  return (
    <div className="rounded-xl border border-[rgba(255,194,71,0.4)] bg-[rgba(255,194,71,0.07)] p-5 anim-fadeUp">
      <p className="flex items-center gap-2 font-display font-bold text-lg">
        <span className="w-7 h-7 rounded-lg grid place-items-center bg-[var(--amber)] text-[#33210a]">
          <IconStar size={15} />
        </span>
        Kuis Cepat <span className="chip !text-[var(--amber)]">+15 XP</span>
      </p>
      <p className="mt-2.5 font-semibold text-[1.05rem]">{block.q}</p>
      <div className="grid sm:grid-cols-2 gap-2.5 mt-4" key={key2}>
        {block.options.map((opt, i) => {
          const isPick = picked === i;
          const isAns = i === block.answer;
          let cls = "border-[var(--line)] bg-[rgba(6,24,41,0.6)] hover:border-[rgba(255,194,71,0.5)] hover:-translate-y-0.5";
          if (solved && isAns) cls = "border-[var(--teal)] bg-[rgba(46,230,200,0.12)]";
          else if (isPick && !isAns) cls = "border-[var(--coral)] bg-[rgba(255,107,87,0.12)]";
          return (
            <button
              key={i}
              disabled={solved}
              onClick={() => {
                setPicked(i);
                if (isAns) {
                  onSolved(!wrongOnce);
                } else {
                  setWrongOnce(true);
                  setShakeId((s) => s + 1);
                  sfx.err();
                }
              }}
              className={`font-code text-sm text-left rounded-lg border px-3.5 py-2.5 transition-all cursor-pointer disabled:cursor-default ${cls} ${isPick && !isAns && !solved ? "shake" : ""}`}
              style={isPick && !isAns && !solved ? { animation: "none" } : undefined}
            >
              <span key={isPick && !isAns ? shakeId : 0} className={isPick && !isAns && !solved ? "shake inline-block" : ""}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      {solved && (
        <p className="mt-3 text-sm text-[var(--mint)] font-semibold anim-fadeUp">
          <IconCheck size={14} className="inline mr-1.5 -mt-0.5" />
          Benar! {block.explain}
        </p>
      )}
    </div>
  );
}
