import { useSiteSettings, useEffectiveDataMode } from "../lib/siteSettings";
import DatabaseConnectionStatus from "../ui/DatabaseConnectionStatus";
import LocalStorageStatus from "../ui/LocalStorageStatus";
/* HUB AGREGAT latihan.my.id — template belajar koding berbasis game.
   Bukan game itu sendiri: direktori sub-game + media belajar.
   - Kartu CodeShark → ./codingshark/  (Shark Typer, ketik kode, butuh keyboard)
   - Kartu Coding Tower → ./codingtower/ (susun blok, ramah HP, Matter+Pixi+p5 lazy)
   - Banner campaign MatchingShark → ./matchingshark/ (game khusus MK RPL, segera hadir).
   - MatchingShark belum dihitung sebagai sub-game live sampai game penuhnya siap.
   Desain netral (tidak meniru tema gelap shark / terang tower) agar jadi payung.
   Animasi kartu murni CSS (.anim-pop, stagger via animationDelay) — nol JS animasi.
   Ikon kartu memakai SVG vektor (ui/icons) agar tajam di semua DPR. */
import type { ComponentType } from "react";
import { IconTower, IconFin } from "../ui/icons";
import matchingHeroJpg from "../assets/matchingshark/matching-hero.jpg";
import matchingHeroWebp from "../assets/matchingshark/matching-hero.webp";

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
  const settings = useSiteSettings();
  const dataMode = useEffectiveDataMode();
  return (
    <div className="min-h-screen" style={{ background: "#060f1d", color: "#e6f2f8" }}>
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: "rgba(6,15,29,0.86)", borderBottom: "1px solid rgba(69,198,255,0.16)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="w-10 h-10 rounded-xl grid place-items-center shrink-0" style={{ background: "rgba(46,230,200,0.12)", border: "1px solid rgba(46,230,200,0.45)", color: "#2ee6c8" }}>
            <IconFin size={22} />
          </span>
          <div className="mr-auto leading-tight">
            <p className="font-extrabold tracking-wide text-sm md:text-base">
              {settings.siteName}
            </p>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#7ea4bd" }}>
              {settings.description}
            </p>
          </div>
          <a href="./admin/" className="text-xs underline" title="Khusus admin: diagnostik & tes koneksi database">Admin · Tes Koneksi</a>
          <a href={settings.games.tower ? "./codingtower/" : undefined} aria-disabled={!settings.games.tower} className="text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5" style={{ background: "#f97316", color: "#fff" }}>
            <IconTower size={14} /> Tower
          </a>
          <a href={settings.games.shark ? "./codingshark/" : undefined} aria-disabled={!settings.games.shark} className="text-xs font-bold px-3 py-1.5 rounded-xl border border-cyan-300/40 inline-flex items-center gap-1.5" style={{ color: "#7ee4ff" }}>
            <IconFin size={14} /> Shark
          </a>
          <a
            href="./matchingshark/"
            className="text-xs font-extrabold px-3 py-1.5 rounded-xl border inline-flex items-center gap-1.5"
            style={{ borderColor: "rgba(167,139,250,0.55)", color: "#c4b5fd", background: "rgba(167,139,250,0.1)" }}
            title="MatchingShark — game khusus MK Rekayasa Perangkat Lunak"
          >
            <IconFin size={14} /> Matching
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        {dataMode.mode === "cloud" ? <DatabaseConnectionStatus /> : <LocalStorageStatus />}
        <section className="mt-8 md:mt-12 text-center max-w-3xl mx-auto">
          <p className="text-[11px] font-extrabold tracking-[0.28em] uppercase" style={{ color: "#45c6ff" }}>
            Agregat • {Object.values(settings.games).filter(Boolean).length} sub-game aktif
          </p>
          <h1 className="font-extrabold text-3xl md:text-5xl tracking-tight mt-2">
            Belajar koding sambil <span style={{ color: "#2ee6c8" }}>main game</span>.
          </h1>
          <p className="text-sm md:text-base mt-3 leading-relaxed" style={{ color: "#9db8cb" }}>
            latihan.my.id adalah halaman induk. Pilih sub-game di bawah — progres tiap game
            tersimpan di perangkat masing-masing (<code>localStorage</code>), berbagi XP, koin, dan streak harian.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap text-[11px] font-bold" style={{ color: "#7ea4bd" }}>
            <span>🧱 Susun Blok Fisika</span>•<span>🦈 Ketik Cepat Keyboard</span>•
            <a href="./matchingshark/" className="hover:brightness-125" style={{ color: "#c4b5fd" }}>
              🧩 Matching Artefak RPL — segera hadir
            </a>
          </div>
        </section>

        <section
          className="mt-10 overflow-hidden rounded-[1.6rem] anim-pop"
          style={{
            background: "linear-gradient(120deg, rgba(88,28,135,0.36), rgba(10,28,46,0.94) 58%)",
            border: "1px solid rgba(167,139,250,0.45)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.3)",
          }}
          aria-labelledby="matchingshark-campaign-title"
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[10px] font-extrabold uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border"
                  style={{ color: "#c4b5fd", borderColor: "rgba(167,139,250,0.5)", background: "rgba(167,139,250,0.1)" }}
                >
                  Campaign baru · MK RPL
                </span>
                <span className="text-[11px] font-extrabold px-2.5 py-1.5 rounded-full" style={{ color: "#160b2e", background: "#a78bfa" }}>
                  Segera hadir
                </span>
              </div>
              <h2 id="matchingshark-campaign-title" className="font-extrabold text-3xl md:text-5xl tracking-tight text-white mt-4">
                Matching<span style={{ color: "#a78bfa" }}>Shark</span>
              </h2>
              <p className="font-display font-extrabold text-xl md:text-2xl leading-tight mt-2" style={{ color: "#d9f5ff" }}>
                Game Rekayasa Perangkat Lunak untuk mencocokkan artefak &amp; menjalankan Sprint.
              </p>
              <p className="text-sm md:text-base leading-relaxed mt-3" style={{ color: "#b7cbda" }}>
                <strong className="text-white">MatchingShark untuk apa?</strong> Untuk melatih keputusan Software Engineering:
                mengubah kebutuhan menjadi user story, menghubungkan diagram UML, memilih pekerjaan Sprint, dan merancang
                kasus uji—dengan penjelasan alasan di setiap pasangan.
              </p>
              <ul className="flex flex-wrap gap-1.5 mt-4">
                {["SDLC & Scrum", "Kebutuhan & SRS", "UML", "Pengujian", "6 pulau belajar"].map((point) => (
                  <li
                    key={point}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                    style={{ color: "#e9d5ff", borderColor: "rgba(167,139,250,0.35)", background: "rgba(167,139,250,0.08)" }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="./matchingshark/"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-extrabold rounded-2xl"
                  style={{ background: "#a78bfa", color: "#160b2e" }}
                >
                  Jelajahi MatchingShark →
                </a>
                <a
                  href="./matchingshark/#demo"
                  className="inline-flex items-center px-5 py-3 text-sm font-extrabold rounded-2xl border"
                  style={{ borderColor: "rgba(69,198,255,0.45)", color: "#7ee4ff" }}
                >
                  Coba demo matching
                </a>
              </div>
              <p className="text-[11px] font-semibold mt-3" style={{ color: "#7ea4bd" }}>
                Dibuka di: <code>./matchingshark/</code> — halaman campaign &amp; demo konsep; game penuh sedang dirancang.
              </p>
            </div>
            <a href="./matchingshark/" className="relative min-h-72 lg:min-h-full block" aria-label="Buka halaman khusus MatchingShark">
              <picture>
                <source srcSet={matchingHeroWebp} type="image/webp" />
                <img
                  src={matchingHeroJpg}
                  alt="Kapten hiu MatchingShark mempresentasikan papan Scrum berisi kartu artefak Rekayasa Perangkat Lunak"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <span
                className="absolute left-4 bottom-4 rounded-full px-3.5 py-2 text-[11px] font-extrabold backdrop-blur-md"
                style={{ background: "rgba(4,16,29,0.84)", color: "#e9d5ff", border: "1px solid rgba(167,139,250,0.4)" }}
              >
                🧩 Semantic Matching × Agile Scrum
              </span>
            </a>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {GAMES.map(game => ({ ...game, live: game.live && settings.games[game.id as keyof typeof settings.games] })).map((g, i) => (
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
                        Dinonaktifkan sementara
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
                      Dinonaktifkan sementara
                    </button>
                  )}
                  {g.live && (
                    <p className="text-[11px] font-semibold mt-1.5" style={{ color: "#5f7d95" }}>
                      Dibuka di: <code>{g.href}</code>
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl p-5 md:p-6" style={{ background: "rgba(10,28,46,0.7)", border: "1px solid rgba(69,198,255,0.18)" }}>
          <h2 className="font-extrabold text-lg md:text-xl text-white">Arena ketiga sedang disiapkan sebagai entry mandiri.</h2>
          <p className="text-xs md:text-sm mt-1 leading-relaxed" style={{ color: "#9db8cb" }}>
            Arsitektur: <code>index.html</code> (hub ini) + <code>codingshark/</code> + <code>codingtower/</code> +
            <code> matchingshark/</code> — tiap entry punya <code>index.html</code> sendiri dan berbagi inti
            <code> src/data • src/lib • src/ui</code>. MatchingShark masih campaign/demo, jadi belum dihitung
            sebagai sub-game live dan belum menulis progres bersama.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3 text-[12px] font-mono" style={{ color: "#7ee4ff" }}>
            <span className="rounded-lg px-3 py-2 border border-cyan-300/20">/ → hub agregat</span>
            <span className="rounded-lg px-3 py-2 border border-cyan-300/20">/codingshark/ → typer</span>
            <span className="rounded-lg px-3 py-2 border border-cyan-300/20">/codingtower/ → susun</span>
            <a href="./matchingshark/" className="rounded-lg px-3 py-2 border hover:brightness-125" style={{ borderColor: "rgba(167,139,250,0.38)", color: "#c4b5fd" }}>
              /matchingshark/ → campaign RPL
            </a>
          </div>
        </section>

        <p className="text-center text-xs mt-12 font-medium" style={{ color: "#5f7d95" }}>
          latihan.my.id — agregat game belajar programming. CodeShark (keyboard) &amp; Coding Tower (sentuh) sudah live;
          MatchingShark (matching artefak RPL + Scrum) hadir sebagai halaman campaign khusus MK Rekayasa Perangkat Lunak.
        </p>
      </main>
    </div>
  );
}
