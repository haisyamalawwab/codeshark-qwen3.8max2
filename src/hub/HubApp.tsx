/* HUB AGREGAT latihan.my.id — template belajar koding berbasis game.
   Bukan game itu sendiri: direktori sub-game + media belajar.
   - Kartu CodeShark → ./codingshark/  (Shark Typer, ketik kode, butuh keyboard)
   - Kartu Coding Tower → ./codingtower/ (susun blok, ramah HP, Matter+Pixi+p5 lazy)
   - Slot "Segera hadir" untuk sub-game berikutnya (tinggal tambah folder + kartu).
   Desain netral (tidak meniru tema gelap shark / terang tower) agar jadi payung.
   Animasi kartu murni CSS (.anim-pop, stagger via animationDelay) — nol JS animasi.
   Ikon kartu memakai SVG vektor (ui/icons) agar tajam di semua DPR. */
import type { ComponentType } from "react";
import { IconTower, IconFin, IconMobile, IconServer, IconDatabase } from "../ui/icons";

interface HubGame {
  id: string;
  name: string;
  href: string;
  tagline: string;
  desc: string;
  points: string[];
  cta: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  accent: string;
  live: boolean;
}

const GAMES: HubGame[] = [
  {
    id: "ci_backend",
    name: "Backend PHP Studio",
    href: "./?subgame=ci_backend",
    tagline: "PHP 8 Native • MySQL Database • phpMyAdmin • cPanel Hosting • 16 Pertemuan OBE",
    desc: "MK Sistem Aplikasi Web - Backend Dasar (Jalur A): Arsitektur Client-Server & HTTP, PHP 8 Native, Database MySQL & phpMyAdmin, Operasi CRUD Lengkap, Validasi Form Server-Side & Sanitasi XSS/SQLi, Relasi 1:N JOIN, Session-Based Auth, sampai Deployment cPanel Web Hosting!",
    points: ["PHP 8.2 Native", "phpMyAdmin & MySQL", "16 Pertemuan OBE", "Deploy cPanel"],
    cta: "Buka Backend PHP Studio",
    Icon: IconServer,
    accent: "#ef4444",
    live: true,
  },
  {
    id: "py_backend",
    name: "Backend Python Studio",
    href: "./?subgame=py_backend",
    tagline: "Python 3 & Flask / Django • MySQL Database • Passenger WSGI Hosting",
    desc: "MK Sistem Aplikasi Web - Backend Dasar (Jalur B): Arsitektur Web Python, WSGI & Routing Jinja2, PyMySQL & Parameterized Queries, CRUD Lengkap, Validasi Server-Side & Flash Messages, Relasi 1:N JOIN, Session Auth & Role Decorators, sampai Deployment cPanel Python App!",
    points: ["Python 3 & Flask", "PyMySQL & WSGI", "16 Pertemuan OBE", "cPanel Python App"],
    cta: "Buka Python Backend Studio",
    Icon: IconDatabase,
    accent: "#10b981",
    live: true,
  },
  {
    id: "crossplatform",
    name: "CrossPlatform Studio",
    href: "./crossplatform/",
    tagline: "React Native & Expo • Simulator Mobile HP • 16 Pertemuan RPS",
    desc: "MK Sistem Aplikasi Lintas Platform (React Native & Expo): Setup Expo, Core Components, Flexbox, State Hooks, React Navigation, AsyncStorage/API, Context API, Auth Flow, Firestore CRUD, Native Camera/GPS, sampai EAS Build APK!",
    points: ["Expo SDK 52", "Simulator HP Live", "16 Pertemuan RPS", "Build APK EAS"],
    cta: "Buka CrossPlatform Studio",
    Icon: IconMobile,
    accent: "#38bdf8",
    live: true,
  },
  {
    id: "tower",
    name: "Coding Tower",
    href: "./codingtower/",
    tagline: "Susun Blok • Ramah HP • Fisika Matter.js + FX Pixi",
    desc: "Susun blok HTML/CSS/JS menjadi menara. Ketuk / drag saja — tanpa keyboard fisik. Ada pengecoh, petunjuk, undo, dan live preview halaman.",
    points: ["Tanpa simbol sulit", "Tombol ≥48px", "PWA offline"],
    cta: "Main Coding Tower",
    Icon: IconTower,
    accent: "#f97316",
    live: true,
  },
  {
    id: "shark",
    name: "CodeShark",
    href: "./codingshark/",
    tagline: "Shark Typer • Ketik Kode • Combo & WPM",
    desc: "Ketik ulang kode persis sambil mengusir hiu. Combo, overdrive ×2, HP, dan preview hidup. Paling enak di laptop / keyboard fisik.",
    points: ["Keyboard fisik", "Combo & WPM", "16 pertemuan"],
    cta: "Main CodeShark",
    Icon: IconFin,
    accent: "#2ee6c8",
    live: true,
  },
];

export default function HubApp() {
  return (
    <div className="min-h-screen" style={{ background: "#060f1d", color: "#e6f2f8" }}>
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: "rgba(6,15,29,0.86)", borderBottom: "1px solid rgba(69,198,255,0.16)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="w-10 h-10 rounded-xl grid place-items-center shrink-0" style={{ background: "rgba(46,230,200,0.12)", border: "1px solid rgba(46,230,200,0.45)", color: "#2ee6c8" }}>
            <IconFin size={22} />
          </span>
          <div className="mr-auto leading-tight">
            <p className="font-extrabold tracking-wide text-sm md:text-base">
              LATIHAN<span style={{ color: "#2ee6c8" }}>.MY.ID</span>
            </p>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#7ea4bd" }}>
              Template belajar koding berbasis game
            </p>
          </div>
          <a href="./?subgame=ci_backend" className="text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-500/40 inline-flex items-center gap-1.5" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
            <IconServer size={14} /> Backend PHP
          </a>
          <a href="./?subgame=py_backend" className="text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/40 inline-flex items-center gap-1.5" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
            <IconDatabase size={14} /> Backend Python
          </a>
          <a href="./crossplatform/" className="text-xs font-bold px-3 py-1.5 rounded-xl border border-sky-400/40 inline-flex items-center gap-1.5" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>
            <IconMobile size={14} /> React Native
          </a>
          <a href="./codingtower/" className="text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5" style={{ background: "#f97316", color: "#fff" }}>
            <IconTower size={14} /> Tower
          </a>
          <a href="./codingshark/" className="text-xs font-bold px-3 py-1.5 rounded-xl border border-cyan-300/40 inline-flex items-center gap-1.5" style={{ color: "#7ee4ff" }}>
            <IconFin size={14} /> Shark
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        <section className="mt-8 md:mt-12 text-center max-w-3xl mx-auto">
          <p className="text-[11px] font-extrabold tracking-[0.28em] uppercase" style={{ color: "#45c6ff" }}>
            Agregat • 5 sub-game live (Backend PHP, Backend Python, CrossPlatform, Tower, Shark)
          </p>
          <h1 className="font-extrabold text-3xl md:text-5xl tracking-tight mt-2">
            Belajar koding sambil <span style={{ color: "#2ee6c8" }}>main game</span>.
          </h1>
          <p className="text-sm md:text-base mt-3 leading-relaxed" style={{ color: "#9db8cb" }}>
            latihan.my.id adalah halaman induk. Pilih sub-game di bawah — progres tiap game
            tersimpan di perangkat masing-masing (<code>localStorage</code>), berbagi XP, koin, dan streak harian.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap text-[11px] font-bold" style={{ color: "#7ea4bd" }}>
            <span>🐘 PHP Native & MySQL</span>•<span>🐍 Python Flask & Django</span>•<span>⚡ React Native & Expo</span>•<span>🧱 Susun Blok Fisika</span>•<span>🦈 Ketik Cepat Keyboard</span>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {GAMES.map((g, i) => (
            <article
              key={g.id}
              className="rounded-2xl p-5 md:p-6 text-left anim-pop"
              style={{
                background: "rgba(10,28,46,0.9)",
                border: `1px solid ${g.live ? `${g.accent}66` : "rgba(126,196,236,0.18)"}`,
                opacity: g.live ? 1 : 0.75,
                animationDelay: `${i * 90}ms`,
              }}
            >
              <div className="flex items-start gap-3.5">
                <span className="w-14 h-14 shrink-0 rounded-2xl grid place-items-center" style={{ background: `${g.accent}1f`, border: `1px solid ${g.accent}66`, color: g.accent }}>
                  <g.Icon size={30} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-extrabold text-xl text-white leading-tight">{g.name}</h2>
                    {g.live ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: g.accent, border: `1px solid ${g.accent}66` }}>
                        ● Live
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-500/40 text-slate-300">
                        Segera
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase mt-0.5" style={{ color: g.accent }}>
                    {g.tagline}
                  </p>
                  <p className="text-xs md:text-sm mt-1.5 leading-relaxed" style={{ color: "#9db8cb" }}>
                    {g.desc}
                  </p>
                  <ul className="flex flex-wrap gap-1.5 mt-2.5">
                    {g.points.map((p) => (
                      <li key={p} className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-400/25" style={{ color: "#c9dcec" }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {g.live ? (
                    <a href={g.href} className="inline-flex items-center gap-2 mt-3.5 px-6 py-2.5 text-sm font-bold rounded-xl" style={{ background: g.accent, color: g.id === "shark" ? "#04222b" : "#fff" }}>
                      {g.cta} →
                    </a>
                  ) : (
                    <button disabled className="mt-3.5 px-6 py-2.5 text-sm font-bold rounded-xl border border-slate-500/30 text-slate-400 cursor-not-allowed">
                      {g.cta}
                    </button>
                  )}
                  {g.live && (
                    <p className="text-[11px] font-semibold mt-1.5" style={{ color: "#5f7d95" }}>
                      Dibuka di sub-folder: <code>{g.href}</code>
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl p-5 md:p-6" style={{ background: "rgba(10,28,46,0.7)", border: "1px solid rgba(69,198,255,0.18)" }}>
          <h2 className="font-extrabold text-lg md:text-xl text-white">Buat sub-game ke-3? Tinggal colok folder.</h2>
          <p className="text-xs md:text-sm mt-1 leading-relaxed" style={{ color: "#9db8cb" }}>
            Arsitektur: <code>index.html</code> (hub ini) + <code>codingshark/</code> + <code>codingtower/</code> — tiap entry
            punya <code>index.html</code> sendiri dan berbagi inti <code>src/data • src/lib • src/ui</code> (satu pintu XP via{" "}
            <code>lib/progress.applyAttempt</code>). Tambah game baru = duplikat satu entry + tambah kartu di file ini.
          </p>
          <div className="grid sm:grid-cols-3 gap-2 mt-3 text-[12px] font-mono" style={{ color: "#7ee4ff" }}>
            <span className="rounded-lg px-3 py-2 border border-cyan-300/20">/ → hub agregat</span>
            <span className="rounded-lg px-3 py-2 border border-cyan-300/20">/codingshark/ → typer</span>
            <span className="rounded-lg px-3 py-2 border border-cyan-300/20">/codingtower/ → susun</span>
          </div>
        </section>

        <p className="text-center text-xs mt-12 font-medium" style={{ color: "#5f7d95" }}>
          latihan.my.id — agregat game belajar programming. CodeShark (gelap, keyboard) &amp; Coding Tower (terang, sentuh) berbagi kurikulum 16 pertemuan.
        </p>
      </main>
    </div>
  );
}
