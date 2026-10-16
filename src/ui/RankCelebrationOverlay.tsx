import { useEffect, useMemo } from "react";
import { sfx } from "../lib/audio";
import { CaptainAvatar } from "../characters";
import { IconTrophy, IconSparkles, IconX, IconArrowR, IconBolt } from "./icons";

interface Props {
  rank: string;
  onClose: () => void;
}

interface RankMeta {
  level: string;
  desc: string;
  highlight: string;
  accentColor: string;
  badgeBg: string;
}

const RANK_DATA: Record<string, RankMeta> = {
  "Kadet Baru": {
    level: "Tingkat 1 • Awal Mula",
    desc: "Permulaan yang berani di kedalaman samudra kode! Setiap baris koding mendekatkanmu pada kehebatan.",
    highlight: "Kuasai dasar sintaksis & ketukan tombol pertama!",
    accentColor: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
  },
  "Ikan Kecil": {
    level: "Tingkat 2 • Gesit & Lincah",
    desc: "Kelincahan jemarimu mulai memecah ombak! Karakter kode diketik semakin cepat dan presisi tanpa ragu.",
    highlight: "Kecepatan dan refleks ketik meningkat tajam!",
    accentColor: "#2ee6c8",
    badgeBg: "rgba(46, 230, 200, 0.15)",
  },
  "Kuda Laut": {
    level: "Tingkat 3 • Ritme Stabil",
    desc: "Ritme dan ketukan kodingmu semakin stabil & tangguh di antara karang-karang tantangan samudra!",
    highlight: "Ketahanan kombo dan konsistensi kode teruji!",
    accentColor: "#34d399",
    badgeBg: "rgba(52, 211, 153, 0.15)",
  },
  "Lumba-Lumba": {
    level: "Tingkat 4 • Cerdas & Tangkas",
    desc: "Kecerdasan logika kodingmu melompat tinggi melintasi rintangan samudra dengan anggun!",
    highlight: "Struktur DOM & styling CSS semakin lekat di ingatan!",
    accentColor: "#60a5fa",
    badgeBg: "rgba(96, 165, 250, 0.15)",
  },
  "Hiu Muda": {
    level: "Tingkat 5 • Predator Kode",
    desc: "Predator kode sejati! Kecepatan dan ketepatanmu disegani di seluruh perairan samudra koding!",
    highlight: "Ketepatan tinggi di arena kecepatan tinggi!",
    accentColor: "#fbbf24",
    badgeBg: "rgba(251, 191, 36, 0.15)",
  },
  "Megalodon": {
    level: "Tingkat 6 • Raksasa Samudra",
    desc: "Kekuatan legendaris raksasa purba samudra! Setiap baris kode tunduk di bawah kendalimu!",
    highlight: "Akurasi tanpa cela & kecepatan luar biasa!",
    accentColor: "#f59e0b",
    badgeBg: "rgba(245, 158, 11, 0.18)",
  },
  "Legenda Samudra": {
    level: "Tingkat Tertinggi • Penguasa Samudra",
    desc: "Puncak keagungan samudra! Kamu adalah legenda hidup yang menaklukkan seluruh rahasia kode!",
    highlight: "Master sejati pengembangan web di kedalaman samudra!",
    accentColor: "#ffd700",
    badgeBg: "rgba(255, 215, 0, 0.22)",
  },
};

const CONFETTI_COLORS = [
  "#2ee6c8", // teal
  "#ffc247", // amber
  "#45c6ff", // cyan
  "#f97316", // orange
  "#a78bfa", // purple
  "#f43f5e", // rose
  "#ffffff", // pearl white
  "#34d399", // emerald
];

export default function RankCelebrationOverlay({ rank, onClose }: Props) {
  // Mainkan SFX rank up fanfare saat overlay pertama kali terbuka
  useEffect(() => {
    sfx.rankUp();
  }, []);

  // Keyboard shortcut ESC / Enter untuk menutup perayaan
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        sfx.click();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const meta = RANK_DATA[rank] ?? {
    level: "Pangkat Baru Samudra",
    desc: "Selamat atas pencapaian pangkat barumu! Keahlian kodingmu semakin diakui di seluruh samudra.",
    highlight: "Terus berlatih untuk membuka pangkat legendaris berikutnya!",
    accentColor: "#ffc247",
    badgeBg: "rgba(255, 194, 71, 0.15)",
  };

  // Buat 40 partikel confetti unik dengan distribusi acak stabil
  const confetti = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const left = (i * 2.38 + (i % 7) * 3.4) % 100;
      const delay = (i * 0.08) % 2.4;
      const duration = 2.6 + ((i * 13) % 20) / 10;
      const drift = ((i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 25));
      const rot = (i % 2 === 0 ? 1 : -1) * (360 + (i % 5) * 180);
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const isCircle = i % 3 === 0;
      const isSquare = i % 3 === 1;
      const size = 7 + (i % 4) * 3;
      return { id: i, left, delay, duration, drift, rot, color, isCircle, isSquare, size };
    });
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rankup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[rgba(2,10,20,0.85)] backdrop-blur-lg"
      onClick={onClose}
    >
      {/* ===== PARTIKEL CONFETTI BERGUGURAN ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.left}%`,
              width: `${c.size}px`,
              height: c.isCircle ? `${c.size}px` : `${c.size * 1.5}px`,
              backgroundColor: c.color,
              borderRadius: c.isCircle ? "50%" : c.isSquare ? "2px" : "1px",
              boxShadow: `0 0 10px ${c.color}90`,
              ["--duration" as string]: `${c.duration}s`,
              ["--delay" as string]: `${c.delay}s`,
              ["--drift" as string]: `${c.drift}px`,
              ["--rot" as string]: `${c.rot}deg`,
            }}
          />
        ))}
      </div>

      {/* ===== KARTU CELEBRATION ===== */}
      <div
        className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-3xl anim-rank-card text-center overflow-hidden border border-[rgba(255,194,71,0.4)] shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_60px_rgba(255,194,71,0.25)]"
        style={{
          background: "linear-gradient(165deg, rgba(14, 42, 69, 0.96) 0%, rgba(6, 22, 38, 0.98) 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efek Sunburst berputar di latar belakang kartu */}
        <div
          className="absolute -top-32 -left-32 -right-32 -bottom-32 pointer-events-none flex items-center justify-center opacity-20"
          aria-hidden="true"
        >
          <svg
            className="w-[180%] h-[180%] anim-sunburst text-amber-300"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <path
                key={i}
                d="M100 100 L93 0 L107 0 Z"
                transform={`rotate(${i * 22.5} 100 100)`}
              />
            ))}
          </svg>
        </div>

        {/* Tombol Tutup Silang di Kanan Atas */}
        <button
          className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center bg-[rgba(6,24,42,0.8)] border border-[rgba(126,196,236,0.25)] text-[var(--dim)] hover:text-white hover:border-[var(--teal)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
          onClick={() => {
            sfx.click();
            onClose();
          }}
          aria-label="Tutup jendela perayaan"
        >
          <IconX size={18} />
        </button>

        {/* Lencana atas: Icon Sparkles + Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(255,194,71,0.12)] border border-[rgba(255,194,71,0.5)] text-[var(--amber)] text-xs font-black tracking-wider uppercase shadow-[0_0_18px_rgba(255,194,71,0.3)]">
          <IconSparkles size={14} className="animate-spin text-amber-300" />
          <span>Pangkat Samudra Terbuka!</span>
          <IconSparkles size={14} className="animate-spin text-amber-300" />
        </div>

        {/* Lambang / Avatar Pangkat Megah */}
        <div className="relative my-6 flex justify-center items-center">
          {/* Radial Aura Glow */}
          <div
            className="absolute w-40 h-40 rounded-full blur-2xl opacity-60 pointer-events-none"
            style={{ backgroundColor: meta.accentColor }}
            aria-hidden="true"
          />

          {/* Frame Emblem Bulat */}
          <div
            className="relative anim-rank-badge p-3 rounded-full border-2 border-[rgba(255,194,71,0.6)] shadow-[0_0_35px_rgba(255,194,71,0.45)]"
            style={{ background: meta.badgeBg }}
          >
            <CaptainAvatar size={118} className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" />

            {/* Pin Trofi Mengkilap di Sudut Avatar */}
            <span
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full grid place-items-center bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black shadow-[0_4px_16px_rgba(251,191,36,0.6)] border-2 border-white/80"
              aria-hidden="true"
            >
              <IconTrophy size={18} />
            </span>
          </div>
        </div>

        {/* Level Tagline */}
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--dim)]">
          {meta.level}
        </p>

        {/* Nama Pangkat Besar Berkilau */}
        <h2
          id="rankup-title"
          className="font-display font-black text-3xl sm:text-4xl mt-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-teal-200 drop-shadow-[0_4px_18px_rgba(255,194,71,0.45)]"
        >
          {rank}
        </h2>

        {/* Deskripsi & Lore Pangkat */}
        <p className="text-sm text-[var(--dim)] mt-3 leading-relaxed max-w-md mx-auto">
          {meta.desc}
        </p>

        {/* Kotak Benefit & Highlight */}
        <div className="mt-5 p-3.5 rounded-2xl bg-[rgba(6,22,38,0.75)] border border-[rgba(126,196,236,0.22)] text-left flex items-start gap-3">
          <span className="p-2 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/30 shrink-0">
            <IconBolt size={18} />
          </span>
          <div className="text-xs">
            <p className="font-extrabold text-white">Status Kapten Diperbarui</p>
            <p className="text-[var(--dim)] mt-0.5 leading-snug">{meta.highlight}</p>
          </div>
        </div>

        {/* Tombol Aksi Klaim / Lanjutkan */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            autoFocus
            className="btn btn-primary flex-1 !py-3.5 text-base font-black shadow-[0_8px_25px_rgba(46,230,200,0.35)] flex items-center justify-center gap-2 group"
            onClick={() => {
              sfx.click();
              onClose();
            }}
          >
            <span>Klaim Pangkat & Lanjutkan</span>
            <IconArrowR size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-[11px] text-[var(--faint)] font-semibold mt-3">
          Tekan tombol atau Enter / ESC untuk melanjutkan
        </p>
      </div>
    </div>
  );
}
