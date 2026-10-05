import { useState } from "react";
import type { AgeId } from "../lib/storage";
import { AGE_GROUPS } from "../data/modules";
import { sfx } from "../lib/audio";
import {
  SharkMascot,
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

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.05fr_1fr] gap-8 items-center">
        {/* ===== Sisi kiri: identitas ===== */}
        <div className="screen-in">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-11 h-11 rounded-xl grid place-items-center text-[var(--teal)] bg-[rgba(46,230,200,0.12)] border border-[rgba(46,230,200,0.3)]">
              <IconFin size={26} />
            </span>
            <div>
              <p className="font-display font-extrabold text-xl leading-none tracking-wide">
                CODESHARK <span className="text-[var(--teal)]">ACADEMY</span>
              </p>
              <p className="text-xs text-[var(--dim)] font-semibold tracking-[0.22em] uppercase mt-1">
                Web Dev • v0.1 MVP
              </p>
            </div>
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-[3.4rem] leading-[1.05]">
            Belajar <span className="text-[var(--teal)]">HTML, CSS & JS</span>
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
                className="flex items-center gap-3.5 panel-flat px-4 py-3 hover:border-[rgba(126,196,236,0.35)] transition-colors anim-fadeUp"
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

        {/* ===== Sisi kanan: pembuatan profil ===== */}
        <div className="panel p-6 md:p-8 screen-in" style={{ animationDelay: "0.12s" }}>
          <h2 className="font-display font-extrabold text-2xl">Buat Profil Penyelam</h2>
          <p className="text-sm text-[var(--dim)] mt-1 mb-6">
            Progresmu tersimpan otomatis di perangkat ini.
          </p>

          <label className="block text-xs font-extrabold tracking-[0.14em] uppercase text-[var(--dim)] mb-2">
            Nama panggilan
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder="cth: Raka"
            className="w-full bg-[rgba(6,24,41,0.8)] border border-[var(--line)] rounded-xl px-4 py-3 font-display font-bold text-lg outline-none placeholder:text-[var(--faint)] focus:border-[var(--teal)] focus:shadow-[0_0_0_3px_rgba(46,230,200,0.15)] transition"
          />

          <label className="block text-xs font-extrabold tracking-[0.14em] uppercase text-[var(--dim)] mb-2 mt-6">
            Level tantangan <span className="text-[var(--faint)] normal-case tracking-normal font-semibold">(menyesuaikan tempo & gaya)</span>
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {(Object.keys(AGE_GROUPS) as AgeId[]).map((id) => {
              const g = AGE_GROUPS[id];
              const on = age === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setAge(id);
                    sfx.click();
                  }}
                  className={`text-left rounded-xl border px-4 py-3 transition-all duration-150 cursor-pointer ${
                    on
                      ? "border-transparent -translate-y-0.5 shadow-[0_10px_26px_rgba(0,0,0,0.35)]"
                      : "border-[var(--line)] bg-[rgba(6,24,41,0.5)] hover:border-[rgba(126,196,236,0.4)] hover:-translate-y-0.5"
                  }`}
                  style={on ? { background: `linear-gradient(150deg, ${g.accent}22, ${g.accent}0d)`, borderColor: g.accent } : undefined}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-display font-bold" style={on ? { color: g.accent } : undefined}>
                      {g.label}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 transition-all ${on ? "scale-110" : ""}`}
                      style={{ borderColor: g.accent, background: on ? g.accent : "transparent" }}
                    />
                  </span>
                  <span className="block text-xs font-bold text-[var(--dim)] mt-0.5">{g.range}</span>
                  <span className="block text-xs text-[var(--faint)] mt-1 leading-snug">{g.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6 panel-flat px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-bold">
              {soundOn ? <IconSound size={18} className="text-[var(--teal)]" /> : <IconMute size={18} className="text-[var(--faint)]" />}
              Efek suara game
            </span>
            <button
              type="button"
              onClick={() => {
                onToggleSound();
                sfx.click();
              }}
              aria-label="Ganti efek suara"
              className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${
                soundOn ? "bg-[var(--teal)]" : "bg-[rgba(90,130,160,0.4)]"
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${
                  soundOn ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <button
            className="btn btn-primary w-full py-3.5 text-lg mt-6"
            disabled={!valid}
            onClick={() => age && onCreate(name.trim(), age)}
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
