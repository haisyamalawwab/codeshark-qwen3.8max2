import { useState } from "react";
import type { AgeId } from "../lib/storage";
import { AGE_GROUPS } from "../data/modules";
import { SharkMascot } from "../characters";
import { sfx } from "../lib/audio";
import {
  IconFin,
  IconArrowR,
  IconBook,
  IconKeyboard,
  IconEye,
  IconSound,
  IconMute,
  IconBolt,
} from "./icons";

interface Props {
  soundOn: boolean;
  onToggleSound: () => void;
  onCreate: (name: string, age: AgeId) => void;
}

export default function Onboarding({ soundOn, onToggleSound, onCreate }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeId | null>(null);
  const valid = name.trim().length >= 2 && age !== null;

  const tryCreate = () => {
    if (valid && age) onCreate(name.trim(), age);
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        {/* ===== Sisi kiri: identitas ===== */}
        <div className="screen-in">
          <div className="inline-flex items-center gap-2 chip px-3 py-1.5 mb-6">
            <span className="w-5 h-5 rounded-full grid place-items-center bg-[rgba(69,198,255,0.15)] text-[var(--cyan)] border border-[rgba(69,198,255,0.3)]">
              <IconFin size={13} />
            </span>
            <span className="font-display font-extrabold text-[13px] tracking-[0.14em]">
              CODESHARK ACADEMY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] glow-pulse" aria-hidden="true" />
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-[3.5rem] leading-[1.05]">
            Belajar <span className="text-[var(--teal)]">HTML, CSS &amp; JS</span>
            <br />
            sambil <span className="relative inline-block text-[var(--amber)]">berburu skor
              <svg viewBox="0 0 120 10" className="absolute left-0 -bottom-1 w-full" aria-hidden="true"><path d="M3 7 C30 2 90 2 117 6" stroke="var(--amber)" strokeWidth="3.5" fill="none" strokeLinecap="round" /></svg>
            </span>
          </h1>
          <p className="text-[var(--dim)] text-lg mt-4 max-w-md leading-relaxed">
            Serap materinya, lalu ketik ulang kode sungguhan di arena ketik bergaya
            <strong className="text-[var(--ink)]"> TypingShark</strong> — kejar combo, hindari hiu,
            dan saksikan kodemu hidup di preview.
          </p>

          <div className="mt-7 space-y-3 max-w-md">
            {[
              { ic: <IconBook size={17} />, t: "Pelajari ilmu", d: "Materi singkat + kuis ber-XP di tiap misi" },
              { ic: <IconKeyboard size={17} />, t: "Ketik kodenya", d: "Game mengetik dengan poin, combo, nyawa & ancaman hiu" },
              { ic: <IconEye size={17} />, t: "Lihat hasilnya", d: "Kode yang kamu ketik langsung jadi halaman nyata" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 panel-flat px-4 py-3 hover:border-[rgba(126,196,236,0.35)] hover:-translate-y-px transition-all anim-fadeUp"
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
              >
                <span className="w-9 h-9 shrink-0 rounded-lg grid place-items-center bg-[rgba(69,198,255,0.12)] text-[var(--cyan)] border border-[rgba(69,198,255,0.25)]">
                  {s.ic}
                </span>
                <div>
                  <p className="font-display font-bold leading-tight">{s.t}</p>
                  <p className="text-sm text-[var(--dim)]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="anim-bob w-56 md:w-72 mt-6 lg:mt-2">
            <SharkMascot className="w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]" />
          </div>
        </div>

        {/* ===== Sisi kanan: pembuatan profil dalam bingkai HUD ===== */}
        <div className="hud-panel p-6 md:p-8 screen-in" style={{ animationDelay: "0.12s" }}>
          <span className="hud-tick" style={{ right: 26 }} aria-hidden="true" />
          <span className="hud-tick" style={{ right: 64, opacity: 0.55 }} aria-hidden="true" />

          <h2 className="font-display font-extrabold text-xl flex items-center gap-2.5">
            <span className="w-2 h-2 rotate-45 bg-[var(--teal)] shadow-[0_0_8px_rgba(46,230,200,0.8)]" aria-hidden="true" />
            Buat Profil Penyelam
          </h2>

          <label
            htmlFor="hud-name"
            className="block text-xs font-extrabold tracking-[0.16em] uppercase text-[var(--dim)] mb-2 mt-6"
          >
            Nama panggilan
          </label>
          <div className="relative">
            <input
              id="hud-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tryCreate()}
              maxLength={16}
              placeholder="cth: Raka"
              autoComplete="off"
              spellCheck={false}
              autoFocus
              className="hud-input w-full rounded-xl px-4 py-3 pr-14 font-display font-bold text-lg outline-none placeholder:text-[var(--faint)] transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[var(--faint)] tabular-nums pointer-events-none">
              {name.length}/16
            </span>
          </div>

          <p
            id="hud-level-label"
            className="text-xs font-extrabold tracking-[0.16em] uppercase text-[var(--dim)] mt-6 mb-2"
          >
            Level tantangan{" "}
            <span className="text-[var(--faint)] normal-case tracking-normal font-semibold">
              (menyesuaikan tempo &amp; gaya)
            </span>
          </p>
          <div role="radiogroup" aria-labelledby="hud-level-label" className="grid sm:grid-cols-2 gap-3">
            {(Object.keys(AGE_GROUPS) as AgeId[]).map((id) => {
              const g = AGE_GROUPS[id];
              const on = age === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setAge(id);
                    sfx.click();
                  }}
                  className={`text-left rounded-xl border px-4 py-3 transition-all duration-150 cursor-pointer ${
                    on
                      ? "border-transparent -translate-y-0.5"
                      : "border-[var(--line)] bg-[rgba(4,17,31,0.6)] hover:border-[rgba(126,196,236,0.45)] hover:-translate-y-0.5"
                  }`}
                  style={
                    on
                      ? {
                          background: `linear-gradient(150deg, ${g.accent}22, ${g.accent}0d)`,
                          borderColor: g.accent,
                          boxShadow: `0 0 18px ${g.accent}33, 0 10px 26px rgba(0,0,0,0.35)`,
                        }
                      : undefined
                  }
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold" style={on ? { color: g.accent } : undefined}>
                      {g.label}
                    </span>
                    <span className={`radio ${on ? "scale-110" : ""}`} style={{ borderColor: on ? g.accent : undefined }}>
                      {on && <span className="radio-dot" style={{ background: g.accent, color: g.accent }} />}
                    </span>
                  </span>
                  <span className="block text-xs font-bold text-[var(--dim)] mt-0.5">{g.range}</span>
                  <span className="block text-xs text-[var(--faint)] mt-1 leading-snug">{g.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6 panel-flat px-4 py-3">
            <span className="flex items-center gap-2.5 text-sm font-bold">
              <span
                className={`w-8 h-8 rounded-lg grid place-items-center border transition-colors ${
                  soundOn
                    ? "bg-[rgba(46,230,200,0.12)] text-[var(--teal)] border-[rgba(46,230,200,0.3)]"
                    : "bg-[rgba(90,130,160,0.12)] text-[var(--faint)] border-[var(--line-soft)]"
                }`}
              >
                {soundOn ? <IconSound size={16} /> : <IconMute size={16} />}
              </span>
              Efek suara game
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={soundOn}
              aria-label="Efek suara game"
              onClick={() => {
                onToggleSound();
                sfx.click();
              }}
              className={`hud-toggle ${soundOn ? "on" : ""}`}
            >
              <span className="knob" />
            </button>
          </div>

          <button
            className="btn btn-hud w-full py-3.5 text-lg mt-6"
            disabled={!valid}
            onClick={tryCreate}
          >
            <IconBolt size={20} />
            Mulai Petualangan
            <IconArrowR size={20} />
          </button>
          <p className="text-center text-xs text-[var(--faint)] mt-3">
            Butuh keyboard fisik untuk misi ketik • Data disimpan via localStorage
          </p>
        </div>
      </div>
    </div>
  );
}
