/* ============ GAMBAR ILUSTRASI MATERI (SVG inline, tema HUD Selam) ============
   Dipakai dokumen .md lewat placeholder "%%IMG:<kunci>%%" pada baris sendiri.
   Palet mengikuti var CSS tema: cyan #45c6ff · teal #2ee6c8 · amber #ffc247 ·
   koral #ff7a59 · biru dalam #071b2e. */
import type { ReactNode } from "react";
/* Ilustrasi raster materi RPL (JPG gaya HUD selam Neon) — didaftarkan ke
   katalog FIGURES sebagai node <img> agar placeholder %%IMG%% pada dokumen
   .md dapat memakainya sama seperti diagram SVG. */
import rplP1Pabrik from "../assets/materi-rpl/rpl-p1-pabrik-pl.jpg";
import rplP1Siklus from "../assets/materi-rpl/rpl-p1-siklus-hidup.jpg";
import rplP2Waterfall from "../assets/materi-rpl/rpl-p2-waterfall.jpg";
import rplP2Sprint from "../assets/materi-rpl/rpl-p2-sprint-agile.jpg";
import rplP3Elisitasi from "../assets/materi-rpl/rpl-p3-elisitasi.jpg";
import rplP3Srs from "../assets/materi-rpl/rpl-p3-dokumen-srs.jpg";
import rplP4Aktor from "../assets/materi-rpl/rpl-p4-aktor-sistem.jpg";
import rplP4Alur from "../assets/materi-rpl/rpl-p4-alur-aktivitas.jpg";
import rplP5Blok from "../assets/materi-rpl/rpl-p5-blok-kelas.jpg";
import rplP5Sinyal from "../assets/materi-rpl/rpl-p5-sinyal-urutan.jpg";
import rplP6Bug from "../assets/materi-rpl/rpl-p6-inspeksi-bug.jpg";
import rplP6Rawat from "../assets/materi-rpl/rpl-p6-pemeliharaan.jpg";

const CYAN = "#45c6ff";
const TEAL = "#2ee6c8";
const AMBER = "#ffc247";
const CORAL = "#ff7a59";
const LINE = "rgba(126,196,236,0.35)";

const label = { fontFamily: "ui-monospace, monospace", fontWeight: 700 };
const capStyle: Record<string, unknown> = { ...label, fontSize: 11, fill: "#bfe8ff" };
const smallStyle: Record<string, unknown> = { ...label, fontSize: 9, fill: "#7ec4ec" };

/** Node katalog untuk ilustrasi raster (JPG/PNG/WebP) materi. */
const raster = (src: string, alt: string): ReactNode => (
  <img src={src} alt={alt} loading="lazy" />
);

/** Kotak HUD berlabel untuk diagram alur (dipakai figur-figur RPL). */
function HudBox({ x, y, w, h, title, sub, color = CYAN }: { x: number; y: number; w: number; h: number; title: string; sub?: string; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="rgba(69,198,255,0.07)" stroke={color} strokeWidth="1.6" />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle" style={{ ...capStyle, fill: "#e6f6ff" }}>{title}</text>
      {sub ? <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" style={smallStyle}>{sub}</text> : null}
    </g>
  );
}

/** Aktor UML (stick figure) untuk diagram use case. */
function StickActor({ x, y, name }: { x: number; y: number; name: string }) {
  return (
    <g stroke={AMBER} strokeWidth="2.4" strokeLinecap="round" fill="none">
      <circle cx={x} cy={y} r="9" />
      <path d={`M${x} ${y + 9} V${y + 34} M${x - 13} ${y + 20} H${x + 13} M${x} ${y + 34} L${x - 11} ${y + 54} M${x} ${y + 34} L${x + 11} ${y + 54}`} />
      <text x={x} y={y + 72} textAnchor="middle" stroke="none" style={{ ...capStyle, fill: AMBER }}>{name}</text>
    </g>
  );
}

function Arrow({ d, color = TEAL, dash }: { d: string; color?: string; dash?: boolean }) {
  return (
    <g stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round">
      <path d={d} strokeDasharray={dash ? "6 5" : undefined} markerEnd={`url(#ah-${color.slice(1)})`} />
    </g>
  );
}

function Markers() {
  return (
    <defs>
      {[TEAL, CYAN, AMBER, CORAL].map((c) => (
        <marker key={c} id={`ah-${c.slice(1)}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={c} />
        </marker>
      ))}
      <linearGradient id="sea-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0a2440" />
        <stop offset="1" stopColor="#051323" />
      </linearGradient>
    </defs>
  );
}

/* ---------- P1 · Web bekerja: browser ⇄ server ---------- */
function FigBrowserServer() {
  return (
    <svg viewBox="0 0 640 300" role="img" aria-label="Diagram browser meminta dokumen HTML ke server lalu merendernya">
      <Markers />
      <rect x="0" y="0" width="640" height="300" rx="14" fill="url(#sea-bg)" />
      {/* Browser */}
      <g>
        <rect x="24" y="70" width="220" height="150" rx="12" fill="rgba(69,198,255,0.06)" stroke={CYAN} strokeWidth="1.6" />
        <rect x="24" y="70" width="220" height="30" rx="12" fill="rgba(69,198,255,0.14)" />
        <circle cx="44" cy="85" r="4" fill={CORAL} /><circle cx="58" cy="85" r="4" fill={AMBER} /><circle cx="72" cy="85" r="4" fill={TEAL} />
        <text x="134" y="90" style={smallStyle}>browser</text>
        <rect x="40" y="116" width="120" height="10" rx="5" fill="rgba(191,232,255,0.5)" />
        <rect x="40" y="134" width="188" height="7" rx="3.5" fill="rgba(126,196,236,0.35)" />
        <rect x="40" y="147" width="160" height="7" rx="3.5" fill="rgba(126,196,236,0.35)" />
        <rect x="40" y="160" width="180" height="7" rx="3.5" fill="rgba(126,196,236,0.25)" />
        <text x="134" y="248" textAnchor="middle" style={capStyle}>BROWSER — pembaca &amp; penggambar</text>
      </g>
      {/* Server */}
      <g>
        <rect x="440" y="70" width="176" height="150" rx="12" fill="rgba(46,230,200,0.05)" stroke={TEAL} strokeWidth="1.6" />
        {[92, 122, 152].map((yy) => (
          <g key={yy}>
            <rect x="456" y={yy} width="144" height="22" rx="6" fill="rgba(46,230,200,0.1)" stroke="rgba(46,230,200,0.4)" />
            <circle cx="470" cy={yy + 11} r="3.5" fill={TEAL} />
            <rect x="482" y={yy + 8} width="100" height="6" rx="3" fill="rgba(126,196,236,0.3)" />
          </g>
        ))}
        <text x="528" y="248" textAnchor="middle" style={capStyle}>SERVER — penyimpan index.html</text>
      </g>
      {/* panah permintaan & respons */}
      <Arrow d="M252 112 C 320 96, 380 96, 432 112" color={CYAN} />
      <text x="342" y="92" textAnchor="middle" style={{ ...smallStyle, fill: CYAN }}>① minta halaman (HTTP request)</text>
      <Arrow d="M432 172 C 380 188, 320 188, 252 172" color={TEAL} dash />
      <text x="342" y="206" textAnchor="middle" style={{ ...smallStyle, fill: TEAL }}>② kirim dokumen HTML (response)</text>
      {/* gelembung dekorasi */}
      <circle cx="310" cy="40" r="5" fill="none" stroke={LINE} />
      <circle cx="330" cy="28" r="3" fill="none" stroke={LINE} />
      <text x="320" y="282" textAnchor="middle" style={{ ...smallStyle, fill: "#7ec4ec" }}>③ browser membaca tag → menggambar halaman di layarmu</text>
    </svg>
  );
}

/* ---------- P1 · Trio teknologi web ---------- */
function FigWebTrio() {
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label="Diagram trio teknologi web: HTML kerangka, CSS gaya, JavaScript perilaku">
      <Markers />
      <rect x="0" y="0" width="640" height="260" rx="14" fill="url(#sea-bg)" />
      <text x="320" y="34" textAnchor="middle" style={{ ...capStyle, fontSize: 13 }}>SATU HALAMAN = TIGA LAPISAN</text>
      {/* HTML */}
      <g>
        <rect x="30" y="60" width="180" height="150" rx="12" fill="rgba(69,198,255,0.07)" stroke={CYAN} strokeWidth="1.8" />
        <text x="120" y="92" textAnchor="middle" style={{ ...label, fontSize: 20, fill: CYAN }} fontFamily="ui-monospace, monospace">&lt;h1&gt;</text>
        <rect x="52" y="108" width="136" height="9" rx="4.5" fill="rgba(191,232,255,0.55)" />
        <rect x="52" y="124" width="110" height="9" rx="4.5" fill="rgba(191,232,255,0.35)" />
        <rect x="52" y="140" width="126" height="9" rx="4.5" fill="rgba(191,232,255,0.35)" />
        <text x="120" y="182" textAnchor="middle" style={capStyle}>HTML</text>
        <text x="120" y="232" textAnchor="middle" style={{ ...smallStyle, fill: CYAN }}>kerangka &amp; isi</text>
      </g>
      {/* CSS */}
      <g>
        <rect x="230" y="60" width="180" height="150" rx="12" fill="rgba(46,230,200,0.06)" stroke={TEAL} strokeWidth="1.8" />
        <text x="320" y="92" textAnchor="middle" style={{ ...label, fontSize: 16, fill: TEAL }} fontFamily="ui-monospace, monospace">color · margin</text>
        <rect x="252" y="108" width="136" height="9" rx="4.5" fill={TEAL} opacity="0.6" />
        <rect x="252" y="124" width="136" height="9" rx="9" fill="rgba(46,230,200,0.25)" stroke={TEAL} />
        <circle cx="280" cy="158" r="14" fill="rgba(46,230,200,0.3)" stroke={TEAL} />
        <circle cx="330" cy="162" r="9" fill={AMBER} opacity="0.7" />
        <text x="320" y="182" textAnchor="middle" style={capStyle}>CSS</text>
        <text x="320" y="232" textAnchor="middle" style={{ ...smallStyle, fill: TEAL }}>tampilan &amp; gaya</text>
      </g>
      {/* JS */}
      <g>
        <rect x="430" y="60" width="180" height="150" rx="12" fill="rgba(255,194,71,0.06)" stroke={AMBER} strokeWidth="1.8" />
        <text x="520" y="92" textAnchor="middle" style={{ ...label, fontSize: 16, fill: AMBER }} fontFamily="ui-monospace, monospace">onclick()</text>
        <circle cx="480" cy="140" r="16" fill="rgba(255,194,71,0.18)" stroke={AMBER} strokeWidth="1.6" />
        <path d="M480 124 a16 16 0 0 1 14 24" fill="none" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
        <rect x="512" y="128" width="76" height="12" rx="6" fill="rgba(255,194,71,0.3)" />
        <rect x="512" y="148" width="56" height="12" rx="6" fill="rgba(255,194,71,0.18)" />
        <text x="520" y="182" textAnchor="middle" style={capStyle}>JavaScript</text>
        <text x="520" y="232" textAnchor="middle" style={{ ...smallStyle, fill: AMBER }}>perilaku &amp; interaksi</text>
      </g>
      <Arrow d="M212 135 L228 135" color={CYAN} />
      <Arrow d="M412 135 L428 135" color={TEAL} />
    </svg>
  );
}

/* ---------- P2 · Anatomi dokumen HTML ---------- */
function FigAnatomy() {
  const rows: [string, string, string, number][] = [
    ["<!DOCTYPE html>", CYAN, " declares: dokumen HTML modern", 0],
    ["<html lang=\"id\">", TEAL, " root: pembungkus seluruh halaman", 1],
    ["  <head>", AMBER, " kepala: info tentang halaman (tab, charset)", 2],
    ["    <title>…</title>", AMBER, " teks pada tab browser", 3],
    ["  </head>", AMBER, "", 4],
    ["  <body>", CORAL, " badan: SEMUA yang tampil di layar", 5],
    ["    <h1>Halo!</h1>", CORAL, " konten pengunjung", 6],
    ["  </body>", CORAL, "", 7],
    ["</html>", TEAL, "", 8],
  ];
  return (
    <svg viewBox="0 0 640 330" role="img" aria-label="Diagram anatomi dokumen HTML: doctype, html, head, dan body">
      <Markers />
      <rect x="0" y="0" width="640" height="330" rx="14" fill="url(#sea-bg)" />
      <text x="320" y="30" textAnchor="middle" style={{ ...capStyle, fontSize: 13 }}>ANATOMI DOKUMEN — empat pilar kerangka halaman</text>
      {rows.map(([code, c, note], i) => {
        const y = 52 + i * 28;
        return (
          <g key={i}>
            <rect x="24" y={y} width={290} height="24" rx="6" fill={`${c}14`} stroke={`${c}55`} />
            <text x="36" y={y + 16} fontFamily="ui-monospace, monospace" fontSize="12" fontWeight="700" fill={c}>{code}</text>
            {note && <text x="326" y={y + 16} style={{ ...smallStyle }}>{note}</text>}
          </g>
        );
      })}
      {/* kurung head vs body */}
      <path d="M330 116 h14 v60 h-8" fill="none" stroke={AMBER} strokeWidth="2" />
      <text x="352" y="150" style={{ ...smallStyle, fill: AMBER }}>tidak terlihat pengunjung</text>
      <path d="M330 180 h14 v96 h-8" fill="none" stroke={CORAL} strokeWidth="2" />
      <text x="352" y="232" style={{ ...smallStyle, fill: CORAL }}>terlihat di layar ✓</text>
      <text x="320" y="316" textAnchor="middle" style={{ ...smallStyle, fill: "#7ec4ec" }}>Aturan praktis: kalau pengunjung harus MELIHAT-nya → taruh di &lt;body&gt;</text>
    </svg>
  );
}

/* ---------- P3 · Struktur elemen: tag, isi, atribut ---------- */
function FigTagStructure() {
  return (
    <svg viewBox="0 0 640 240" role="img" aria-label="Diagram struktur elemen HTML: tag pembuka, atribut, isi, dan tag penutup">
      <Markers />
      <rect x="0" y="0" width="640" height="240" rx="14" fill="url(#sea-bg)" />
      <text x="320" y="32" textAnchor="middle" style={{ ...capStyle, fontSize: 13 }}>ANATOMI SATU ELEMEN</text>
      {/* kode besar */}
      <g fontFamily="ui-monospace, monospace" fontSize="26" fontWeight="700">
        <text x="60" y="120" fill={CYAN}>&lt;p</text>
        <text x="130" y="120" fill={AMBER}>class</text>
        <text x="212" y="120" fill="#bfe8ff">="intro"</text>
        <text x="360" y="120" fill={CYAN}>{">"}</text>
        <text x="392" y="120" fill="#eaf7ff">Halo laut!</text>
        <text x="540" y="120" fill={CORAL}>&lt;/p&gt;</text>
      </g>
      {/* garis penunjuk */}
      <path d="M80 132 L80 166" stroke={CYAN} strokeWidth="1.8" />
      <text x="80" y="184" textAnchor="middle" style={{ ...smallStyle, fill: CYAN }}>tag pembuka</text>
      <path d="M180 132 L180 166" stroke={AMBER} strokeWidth="1.8" />
      <text x="180" y="184" textAnchor="middle" style={{ ...smallStyle, fill: AMBER }}>atribut = pengaturan</text>
      <path d="M440 132 L440 166" stroke={TEAL} strokeWidth="1.8" />
      <text x="440" y="184" textAnchor="middle" style={{ ...smallStyle, fill: TEAL }}>isi / konten</text>
      <path d="M565 132 L565 166" stroke={CORAL} strokeWidth="1.8" />
      <text x="565" y="184" textAnchor="middle" style={{ ...smallStyle, fill: CORAL }}>tag penutup (garis miring!)</text>
      <text x="320" y="222" textAnchor="middle" style={{ ...smallStyle, fill: "#7ec4ec" }}>Elemen = tag pembuka + isi + tag penutup. Tag tunggal seperti &lt;img&gt; &amp; &lt;br&gt; tidak ditutup.</text>
    </svg>
  );
}

/* ---------- P3 · Heading bertingkat ---------- */
function FigHeadingTree() {
  return (
    <svg viewBox="0 0 640 250" role="img" aria-label="Diagram hierarki heading dari h1 sampai h3 bagai peta terumbu karang">
      <Markers />
      <rect x="0" y="0" width="640" height="250" rx="14" fill="url(#sea-bg)" />
      <text x="320" y="30" textAnchor="middle" style={{ ...capStyle, fontSize: 13 }}>HIERARKI HEADING — peta isi halaman</text>
      <g fontFamily="ui-monospace, monospace" fontWeight="700">
        <rect x="240" y="48" width="160" height="34" rx="8" fill={`${CYAN}18`} stroke={CYAN} strokeWidth="1.8" />
        <text x="320" y="70" textAnchor="middle" fontSize="15" fill={CYAN}>h1 · judul utama</text>
        <rect x="90" y="120" width="150" height="30" rx="8" fill={`${TEAL}14`} stroke={TEAL} />
        <text x="165" y="140" textAnchor="middle" fontSize="12" fill={TEAL}>h2 · bab A</text>
        <rect x="400" y="120" width="150" height="30" rx="8" fill={`${TEAL}14`} stroke={TEAL} />
        <text x="475" y="140" textAnchor="middle" fontSize="12" fill={TEAL}>h2 · bab B</text>
        <rect x="330" y="186" width="150" height="26" rx="8" fill={`${AMBER}12`} stroke={AMBER} />
        <text x="405" y="203" textAnchor="middle" fontSize="11" fill={AMBER}>h3 · sub-bab</text>
      </g>
      <path d="M300 82 C 250 100, 190 100, 168 118" stroke={CYAN} strokeWidth="1.8" fill="none" markerEnd="url(#ah-45c6ff)" />
      <path d="M340 82 C 400 100, 452 100, 472 118" stroke={CYAN} strokeWidth="1.8" fill="none" markerEnd="url(#ah-45c6ff)" />
      <path d="M475 150 C 470 165, 440 172, 415 184" stroke={TEAL} strokeWidth="1.8" fill="none" markerEnd="url(#ah-2ee6c8)" />
      <text x="120" y="212" style={{ ...smallStyle, fill: "#7ec4ec" }}>satu h1 per halaman</text>
      <text x="120" y="228" style={{ ...smallStyle, fill: "#7ec4ec" }}>jangan lompat tingkat</text>
    </svg>
  );
}

/* ---------- P4 · Gambar & link ---------- */
function FigMediaLink() {
  return (
    <svg viewBox="0 0 640 250" role="img" aria-label="Diagram cara kerja img dengan src dan alt, serta anchor dengan href">
      <Markers />
      <rect x="0" y="0" width="640" height="250" rx="14" fill="url(#sea-bg)" />
      {/* kiri: img */}
      <text x="160" y="34" textAnchor="middle" style={capStyle}>{"<img src alt>"}</text>
      <rect x="60" y="52" width="200" height="120" rx="10" fill="rgba(69,198,255,0.08)" stroke={CYAN} strokeWidth="1.6" strokeDasharray="7 5" />
      <circle cx="104" cy="86" r="12" fill={AMBER} opacity="0.8" />
      <path d="M64 152 L116 104 L152 136 L184 112 L256 152 Z" fill="rgba(46,230,200,0.35)" stroke={TEAL} strokeWidth="1.4" />
      <text x="160" y="146" textAnchor="middle" style={{ ...smallStyle, fill: TEAL }}>src → berkas hiu.jpg</text>
      <text x="160" y="196" textAnchor="middle" style={{ ...smallStyle, fill: CYAN }}>alt → dibaca saat gambar gagal / screen reader</text>
      {/* kanan: anchor */}
      <text x="480" y="34" textAnchor="middle" style={capStyle}>&lt;a href&gt; menuju id&lt;/text&gt;</text>
      <g fontFamily="ui-monospace, monospace" fontSize="13" fontWeight="700">
        <rect x="380" y="58" width="110" height="28" rx="8" fill={`${CYAN}14`} stroke={CYAN} />
        <text x="435" y="76" textAnchor="middle" fill={CYAN}>#kontak</text>
        <rect x="500" y="150" width="120" height="28" rx="8" fill={`${AMBER}14`} stroke={AMBER} />
        <text x="560" y="168" textAnchor="middle" fill={AMBER}>id="kontak"</text>
      </g>
      <path d="M470 88 C 520 108, 556 120, 558 146" stroke={TEAL} strokeWidth="2" fill="none" strokeDasharray="6 5" markerEnd="url(#ah-2ee6c8)" />
      <text x="480" y="212" style={{ ...smallStyle, fill: "#7ec4ec" }}>href menentukan tujuan: https://luar · berkas tetangga · #anchor</text>
      <text x="160" y="228" textAnchor="middle" style={{ ...smallStyle, fill: "#7ec4ec" }}>img pakai src · a pakai href — jangan tertukar!</text>
    </svg>
  );
}

/* ---------- P5 · Formulir & semantik ---------- */
function FigFormLabel() {
  return (
    <svg viewBox="0 0 640 250" role="img" aria-label="Diagram pasangan label for dan input id pada formulir, plus wilayah semantik halaman">
      <Markers />
      <rect x="0" y="0" width="640" height="250" rx="14" fill="url(#sea-bg)" />
      {/* kiri: label-input */}
      <text x="160" y="32" textAnchor="middle" style={capStyle}>PASANGAN label ↔ input</text>
      <g fontFamily="ui-monospace, monospace" fontSize="12" fontWeight="700">
        <rect x="42" y="52" width="150" height="30" rx="8" fill={`${TEAL}14`} stroke={TEAL} />
        <text x="117" y="71" textAnchor="middle" fill={TEAL}>label for="nama"</text>
        <rect x="120" y="120" width="170" height="30" rx="8" fill={`${CYAN}14`} stroke={CYAN} />
        <text x="205" y="139" textAnchor="middle" fill={CYAN}>input id="nama"</text>
      </g>
      <path d="M150 84 C 168 100, 186 106, 196 116" stroke={AMBER} strokeWidth="2" fill="none" markerEnd="url(#ah-ffc247)" />
      <text x="248" y="96" style={{ ...smallStyle, fill: AMBER }}>id yang sama = terhubung</text>
      <text x="160" y="184" textAnchor="middle" style={{ ...smallStyle, fill: "#7ec4ec" }}>klik label → fokus pindah ke kolom</text>
      <text x="160" y="202" textAnchor="middle" style={{ ...smallStyle, fill: "#7ec4ec" }}>screen reader membacakan nama kolom</text>
      {/* kanan: wilayah semantik */}
      <text x="480" y="32" textAnchor="middle" style={capStyle}>WILAYAH SEMANTIK</text>
      <g fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="700">
        <rect x="380" y="46" width="200" height="180" rx="10" fill="none" stroke={LINE} />
        <rect x="388" y="54" width="184" height="30" rx="6" fill={`${CYAN}16`} stroke={CYAN} />
        <text x="480" y="73" textAnchor="middle" fill={CYAN}>header + nav</text>
        <rect x="388" y="90" width="184" height="94" rx="6" fill={`${TEAL}12`} stroke={TEAL} />
        <text x="480" y="112" textAnchor="middle" fill={TEAL}>main</text>
        <rect x="400" y="124" width="160" height="24" rx="5" fill="rgba(191,232,255,0.12)" stroke={LINE} />
        <text x="480" y="140" textAnchor="middle" fill="#bfe8ff">section / article</text>
        <rect x="388" y="190" width="184" height="28" rx="6" fill={`${AMBER}14`} stroke={AMBER} />
        <text x="480" y="208" textAnchor="middle" fill={AMBER}>footer</text>
      </g>
    </svg>
  );
}

/* ---------- P6 · Checklist gladi UTS ---------- */
function FigChecklist() {
  const items = [
    ["Semua pasangan tag lengkap?", TEAL],
    ["Satu <h1> per halaman?", CYAN],
    ["Setiap <img> punya alt?", AMBER],
    ["Label terhubung via id?", CORAL],
    ["Sudah validasi W3C?", TEAL],
  ] as const;
  return (
    <svg viewBox="0 0 640 230" role="img" aria-label="Diagram checklist pra UTS HTML dengan lima butir pemeriksaan">
      <Markers />
      <rect x="0" y="0" width="640" height="230" rx="14" fill="url(#sea-bg)" />
      <text x="320" y="32" textAnchor="middle" style={{ ...capStyle, fontSize: 13 }}>CHECKLIST PRA-UTS — bereskan satu per satu</text>
      {items.map(([t, c], i) => {
        const y = 52 + i * 32;
        return (
          <g key={i}>
            <rect x="120" y={y} width="400" height="26" rx="8" fill={`${c}10`} stroke={`${c}66`} />
            <rect x="130" y={y + 5} width="16" height="16" rx="4" fill="none" stroke={c} strokeWidth="1.8" />
            <path d={`M133 ${y + 13} l4 4 l7 -8`} fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" />
            <text x="158" y={y + 17} fontFamily="ui-monospace, monospace" fontSize="12" fontWeight="700" fill={c === AMBER || c === CORAL ? c : `#dff3ff`}>{t}</text>
          </g>
        );
      })}
      <text x="320" y="220" textAnchor="middle" style={{ ...smallStyle, fill: "#7ec4ec" }}>Lima centang = tiket lulus gladi UTS pertemuan 7 🦈</text>
    </svg>
  );
}

/* ---------- P2 · Pohon Hierarki DOM HTML ---------- */
function FigDomTree() {
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label="Diagram Pohon DOM Dokumen HTML">
      <Markers />
      <rect x="0" y="0" width="640" height="260" rx="14" fill="url(#sea-bg)" />
      <text x="320" y="30" textAnchor="middle" style={{ ...capStyle, fontSize: 13 }}>POHON HIERARKI DOKUMEN (DOM TREE)</text>

      {/* Root html */}
      <rect x="270" y="45" width="100" height="30" rx="8" fill="rgba(69,198,255,0.15)" stroke={CYAN} strokeWidth="1.5" />
      <text x="320" y="65" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="bold" fill={CYAN}>&lt;html&gt;</text>

      {/* Lines to head & body */}
      <path d="M 300 75 L 180 115" stroke={CYAN} strokeWidth="1.5" />
      <path d="M 340 75 L 460 115" stroke={TEAL} strokeWidth="1.5" />

      {/* Head */}
      <rect x="120" y="115" width="120" height="30" rx="8" fill="rgba(69,198,255,0.1)" stroke={CYAN} strokeWidth="1.2" />
      <text x="180" y="135" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fontWeight="bold" fill={CYAN}>&lt;head&gt; (Metadata)</text>

      {/* Head Children */}
      <path d="M 150 145 L 120 180" stroke={CYAN} strokeWidth="1.2" />
      <path d="M 210 145 L 240 180" stroke={CYAN} strokeWidth="1.2" />
      <rect x="70" y="180" width="90" height="26" rx="6" fill="rgba(69,198,255,0.08)" stroke="rgba(69,198,255,0.4)" />
      <text x="115" y="197" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#dff3ff">&lt;title&gt;</text>
      <rect x="200" y="180" width="90" height="26" rx="6" fill="rgba(69,198,255,0.08)" stroke="rgba(69,198,255,0.4)" />
      <text x="245" y="197" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#dff3ff">&lt;meta&gt;</text>

      {/* Body */}
      <rect x="400" y="115" width="120" height="30" rx="8" fill="rgba(46,230,200,0.1)" stroke={TEAL} strokeWidth="1.2" />
      <text x="460" y="135" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fontWeight="bold" fill={TEAL}>&lt;body&gt; (Tampilan)</text>

      {/* Body Children */}
      <path d="M 430 145 L 370 180" stroke={TEAL} strokeWidth="1.2" />
      <path d="M 460 145 L 460 180" stroke={TEAL} strokeWidth="1.2" />
      <path d="M 490 145 L 550 180" stroke={TEAL} strokeWidth="1.2" />
      <rect x="330" y="180" width="80" height="26" rx="6" fill="rgba(46,230,200,0.08)" stroke="rgba(46,230,200,0.4)" />
      <text x="370" y="197" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#dff3ff">&lt;header&gt;</text>
      <rect x="425" y="180" width="70" height="26" rx="6" fill="rgba(46,230,200,0.08)" stroke="rgba(46,230,200,0.4)" />
      <text x="460" y="197" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#dff3ff">&lt;main&gt;</text>
      <rect x="510" y="180" width="80" height="26" rx="6" fill="rgba(46,230,200,0.08)" stroke="rgba(46,230,200,0.4)" />
      <text x="550" y="197" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#dff3ff">&lt;footer&gt;</text>

      <text x="320" y="240" textAnchor="middle" style={{ ...smallStyle, fill: "#7ec4ec" }}>Setiap elemen bersarang menjadi simpul (node) yang dapat dimanipulasi browser</text>
    </svg>
  );
}

/* ---------- CSS Box Model ---------- */
function FigCssBoxModel() {
  return (
    <svg viewBox="0 0 640 250" role="img" aria-label="Diagram Box Model CSS: Margin, Border, Padding, Content">
      <rect x="0" y="0" width="640" height="250" rx="14" fill="url(#sea-bg)" />
      <text x="320" y="28" textAnchor="middle" style={{ ...capStyle, fontSize: 13 }}>CSS &amp; LAYOUT BOX MODEL</text>

      {/* Margin */}
      <rect x="90" y="45" width="460" height="180" rx="12" fill="rgba(255,194,71,0.08)" stroke={AMBER} strokeWidth="1.5" strokeDasharray="5 3" />
      <text x="105" y="65" fontFamily="ui-monospace, monospace" fontSize="10" fontWeight="bold" fill={AMBER}>MARGIN (Ruang Luar)</text>

      {/* Border */}
      <rect x="140" y="75" width="360" height="125" rx="8" fill="rgba(255,122,89,0.1)" stroke={CORAL} strokeWidth="1.8" />
      <text x="155" y="93" fontFamily="ui-monospace, monospace" fontSize="10" fontWeight="bold" fill={CORAL}>BORDER (Batas Garis)</text>

      {/* Padding */}
      <rect x="190" y="105" width="260" height="75" rx="6" fill="rgba(46,230,200,0.12)" stroke={TEAL} strokeWidth="1.5" />
      <text x="205" y="122" fontFamily="ui-monospace, monospace" fontSize="10" fontWeight="bold" fill={TEAL}>PADDING (Ruang Dalam)</text>

      {/* Content */}
      <rect x="250" y="130" width="140" height="35" rx="4" fill="rgba(69,198,255,0.25)" stroke={CYAN} strokeWidth="1.5" />
      <text x="320" y="152" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="bold" fill="#ffffff">CONTENT (Teks/Gambar)</text>
    </svg>
  );
}

/* ============ FIGUR MATERI RPL (diagram SVG notasi) ============ */

/* ---------- RPL P1 · Enam fase SDLC ---------- */
function FigSdlcFase() {
  const phases: Array<[string, string]> = [
    ["Perencanaan", "proposal & jadwal"],
    ["Analisis", "SRS / kebutuhan"],
    ["Desain", "UML & arsitektur"],
    ["Implementasi", "kode program"],
    ["Pengujian", "laporan uji"],
    ["Deploy & Rawat", "sistem live"],
  ];
  return (
    <svg viewBox="0 0 640 300" role="img" aria-label="Diagram enam fase SDLC dari perencanaan sampai deployment dan pemeliharaan dengan panah umpan balik ke analisis">
      <Markers />
      <rect x="0" y="0" width="640" height="300" rx="14" fill="url(#sea-bg)" />
      {phases.map(([title, sub], i) => {
        const x = 14 + i * 103;
        return (
          <g key={title}>
            <circle cx={x + 47} cy="72" r="13" fill="rgba(255,194,71,0.15)" stroke={AMBER} strokeWidth="1.6" />
            <text x={x + 47} y="77" textAnchor="middle" style={{ ...capStyle, fill: AMBER }}>{i + 1}</text>
            <HudBox x={x} y={96} w={94} h={70} title={title} sub={sub} color={i % 2 ? TEAL : CYAN} />
            {i < phases.length - 1 ? <Arrow d={`M${x + 95} 131 H${x + 101}`} color={TEAL} /> : null}
          </g>
        );
      })}
      <Arrow d="M576 170 C 576 244, 200 244, 168 170" color={AMBER} dash />
      <text x="372" y="262" textAnchor="middle" style={{ ...smallStyle, fill: AMBER }}>perubahan &amp; pemeliharaan kembali dianalisis — siklus hidup terus berputar</text>
      <text x="320" y="34" textAnchor="middle" style={capStyle}>SDLC — dari ide sampai sistem yang dirawat</text>
    </svg>
  );
}

/* ---------- RPL P2 · Siklus Scrum ---------- */
function FigSiklusScrum() {
  return (
    <svg viewBox="0 0 640 320" role="img" aria-label="Diagram siklus Scrum dari product backlog, sprint planning, sprint, increment, review dan retrospective lalu kembali ke product backlog">
      <Markers />
      <rect x="0" y="0" width="640" height="320" rx="14" fill="url(#sea-bg)" />
      <HudBox x={14} y={118} w={106} h={66} title="Product" sub="Backlog" color={CYAN} />
      <Arrow d="M122 151 H142" color={TEAL} />
      <HudBox x={146} y={118} w={106} h={66} title="Sprint" sub="Planning" color={TEAL} />
      <Arrow d="M254 151 H274" color={TEAL} />
      {/* wadah sprint */}
      <rect x="278" y="62" width="196" height="176" rx="14" fill="rgba(46,230,200,0.04)" stroke={TEAL} strokeWidth="1.6" strokeDasharray="7 5" />
      <text x="376" y="86" textAnchor="middle" style={{ ...capStyle, fill: TEAL }}>SPRINT · 1–4 MINGGU</text>
      <HudBox x={298} y={98} w={156} h={46} title="Sprint Backlog" color={CYAN} />
      <HudBox x={298} y={168} w={156} h={46} title="Daily Scrum" sub="bangun & uji harian" color={CYAN} />
      <Arrow d="M340 146 V164" color={AMBER} />
      <Arrow d="M412 166 C 438 156, 438 140, 416 132" color={AMBER} dash />
      <Arrow d="M476 121 H494" color={TEAL} />
      <HudBox x={498} y={88} w={128} h={62} title="Increment" sub="hasil bisa dipakai" color={AMBER} />
      <Arrow d="M562 152 V180" color={TEAL} />
      <HudBox x={498} y={184} w={128} h={62} title="Review &" sub="Retrospective" color={AMBER} />
      <Arrow d="M498 262 C 340 296, 180 296, 70 190" color={CORAL} dash />
      <text x="300" y="300" textAnchor="middle" style={{ ...smallStyle, fill: CORAL }}>umpan balik masuk lagi ke Product Backlog — sprint berikutnya dimulai</text>
      <text x="320" y="34" textAnchor="middle" style={capStyle}>Siklus Scrum — iterasi pendek yang selalu menghasilkan increment</text>
    </svg>
  );
}

/* ---------- RPL P3 · Alur rekayasa kebutuhan ---------- */
function FigAlurKebutuhan() {
  const steps: Array<[string, string]> = [
    ["Elisitasi", "wawancara · observasi"],
    ["Analisis", "konflik & prioritas"],
    ["Spesifikasi", "SRS / user story"],
    ["Validasi", "cek bersama pengguna"],
  ];
  return (
    <svg viewBox="0 0 640 300" role="img" aria-label="Diagram empat tahap rekayasa kebutuhan elisitasi analisis spesifikasi validasi dengan panah pengulangan">
      <Markers />
      <rect x="0" y="0" width="640" height="300" rx="14" fill="url(#sea-bg)" />
      <text x="320" y="40" textAnchor="middle" style={capStyle}>Pemangku kepentingan terlibat di semua tahap</text>
      {steps.map(([title, sub], i) => {
        const x = 18 + i * 156;
        return (
          <g key={title}>
            <HudBox x={x} y={92} w={136} h={74} title={title} sub={sub} color={i % 2 ? TEAL : CYAN} />
            {i < steps.length - 1 ? <Arrow d={`M${x + 138} 129 H${x + 152}`} color={TEAL} /> : null}
          </g>
        );
      })}
      <Arrow d="M554 170 C 554 236, 86 236, 86 170" color={AMBER} dash />
      <text x="320" y="256" textAnchor="middle" style={{ ...smallStyle, fill: AMBER }}>belum sesuai kebutuhan nyata? gali &amp; perbaiki lagi — bukan lanjut buta</text>
      <text x="86" y="196" textAnchor="middle" style={smallStyle}>sumber: manusia</text>
      <text x="398" y="196" textAnchor="middle" style={smallStyle}>hasil: dokumen terukur</text>
    </svg>
  );
}

/* ---------- RPL P4 · Use case diagram perpustakaan ---------- */
function FigUseCasePerpus() {
  const uc = (cx: number, cy: number, rx: number, ry: number, name: string) => (
    <g key={name}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(69,198,255,0.08)" stroke={CYAN} strokeWidth="1.6" />
      <text x={cx} y={cy + 4} textAnchor="middle" style={{ ...capStyle, fill: "#e6f6ff" }}>{name}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 640 350" role="img" aria-label="Use case diagram sistem perpustakaan dengan aktor mahasiswa dan pustakawan serta relasi include dan extend">
      <Markers />
      <rect x="0" y="0" width="640" height="350" rx="14" fill="url(#sea-bg)" />
      {/* batas sistem */}
      <rect x="170" y="34" width="300" height="282" rx="12" fill="rgba(46,230,200,0.03)" stroke={TEAL} strokeWidth="1.8" />
      <text x="320" y="58" textAnchor="middle" style={{ ...capStyle, fill: TEAL }}>Sistem Perpustakaan</text>
      {/* aktor */}
      <StickActor x={82} y={118} name="Mahasiswa" />
      <StickActor x={558} y={196} name="Pustakawan" />
      {/* asosiasi */}
      <g stroke={LINE} strokeWidth="1.6">
        <path d="M96 130 L200 92" />
        <path d="M96 140 L200 146" />
        <path d="M96 152 L200 198" />
        <path d="M544 224 L340 258" />
      </g>
      {/* use case utama */}
      {uc(268, 90, 66, 23, "Cari Buku")}
      {uc(268, 146, 66, 23, "Pinjam Buku")}
      {uc(268, 202, 66, 23, "Kembalikan Buku")}
      {uc(268, 264, 66, 23, "Kelola Katalog")}
      {/* use case pendukung */}
      {uc(402, 146, 54, 20, "Catat Transaksi")}
      {uc(402, 202, 54, 20, "Hitung Denda")}
      {/* include / extend */}
      <Arrow d="M336 146 H344" color={TEAL} dash />
      <text x="340" y="136" textAnchor="middle" style={{ ...smallStyle, fill: TEAL }}>&lt;&lt;include&gt;&gt;</text>
      <Arrow d="M336 194 C 356 178, 366 168, 380 160" color={TEAL} dash />
      <Arrow d="M346 202 H338" color={CORAL} dash />
      <text x="342" y="192" textAnchor="middle" style={{ ...smallStyle, fill: CORAL }}>&lt;&lt;extend&gt;&gt;</text>
      <text x="320" y="336" textAnchor="middle" style={smallStyle}>aktor di luar batas · include = selalu ikut · extend = kondisional (bila terlambat)</text>
    </svg>
  );
}

/* ---------- RPL P5 · Class diagram kuis ---------- */
function ClassBox({ x, y, w, name, attrs, ops }: { x: number; y: number; w: number; name: string; attrs: string[]; ops: string[] }) {
  const h = 30 + attrs.length * 16 + ops.length * 16 + 14;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(69,198,255,0.06)" stroke={CYAN} strokeWidth="1.6" />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" style={{ ...capStyle, fill: "#e6f6ff", fontSize: 12 }}>{name}</text>
      <path d={`M${x} ${y + 28} H${x + w}`} stroke={LINE} strokeWidth="1.2" />
      {attrs.map((a, i) => (
        <text key={a} x={x + 10} y={y + 44 + i * 16} style={smallStyle}>{a}</text>
      ))}
      <path d={`M${x} ${y + 34 + attrs.length * 16} H${x + w}`} stroke={LINE} strokeWidth="1.2" />
      {ops.map((o, i) => (
        <text key={o} x={x + 10} y={y + 50 + attrs.length * 16 + i * 16} style={{ ...smallStyle, fill: "#bfe8ff" }}>{o}</text>
      ))}
    </g>
  );
}

function FigClassDiagramKuis() {
  return (
    <svg viewBox="0 0 640 350" role="img" aria-label="Class diagram mahasiswa hasil kuis kuis dan soal dengan multiplisitas dan relasi komposisi">
      <Markers />
      <rect x="0" y="0" width="640" height="350" rx="14" fill="url(#sea-bg)" />
      <ClassBox x={22} y={92} w={168} name="Mahasiswa" attrs={["- nim : string", "- nama : string"]} ops={["+ ikutiKuis()"]} />
      <ClassBox x={248} y={92} w={168} name="HasilKuis" attrs={["- skor : int", "- tanggal : date"]} ops={["+ hitungBintang()"]} />
      <ClassBox x={468} y={36} w={152} name="Kuis" attrs={["- judul : string", "- durasi : int"]} ops={["+ mulai()"]} />
      <ClassBox x={468} y={208} w={152} name="Soal" attrs={["- teks : string", "- kunci : string"]} ops={["+ periksa(j)"]} />
      {/* asosiasi Mahasiswa—HasilKuis */}
      <path d="M190 122 H248" stroke={TEAL} strokeWidth="1.8" />
      <text x="198" y="112" style={{ ...capStyle, fill: TEAL }}>1</text>
      <text x="228" y="112" style={{ ...capStyle, fill: TEAL }}>*</text>
      {/* asosiasi Kuis—HasilKuis */}
      <path d="M468 84 L416 108" stroke={TEAL} strokeWidth="1.8" />
      <text x="452" y="80" style={{ ...capStyle, fill: TEAL }}>1</text>
      <text x="420" y="100" style={{ ...capStyle, fill: TEAL }}>*</text>
      {/* komposisi Kuis◆—Soal */}
      <path d="M544 138 V208" stroke={AMBER} strokeWidth="1.8" />
      <polygon points="544,126 552,138 544,150 536,138" fill={AMBER} />
      <text x="558" y="146" style={{ ...capStyle, fill: AMBER }}>1</text>
      <text x="558" y="202" style={{ ...capStyle, fill: AMBER }}>1..*</text>
      <text x="320" y="336" textAnchor="middle" style={smallStyle}>baca bersuara: satu mahasiswa punya banyak hasil · kuis tersusun atas soal (komposisi ◆)</text>
    </svg>
  );
}

/* ---------- RPL P6 · Level pengujian ---------- */
function FigLevelPengujian() {
  return (
    <svg viewBox="0 0 640 300" role="img" aria-label="Diagram bertingkat empat level pengujian unit integrasi sistem dan penerimaan">
      <Markers />
      <rect x="0" y="0" width="640" height="300" rx="14" fill="url(#sea-bg)" />
      <HudBox x={110} y={216} w={380} h={46} title="Unit" sub="programmer · banyak & cepat" color={CYAN} />
      <HudBox x={150} y={164} w={300} h={46} title="Integrasi" sub="programmer / QA" color={TEAL} />
      <HudBox x={190} y={112} w={220} h={46} title="Sistem" sub="QA vs SRS" color={AMBER} />
      <HudBox x={230} y={60} w={140} h={46} title="Penerimaan" sub="pengguna (UAT)" color={CORAL} />
      <Arrow d="M548 258 V66" color={CORAL} />
      <text x="566" y="162" textAnchor="middle" transform="rotate(-90 566 162)" style={{ ...smallStyle, fill: CORAL }}>cakupan meluas · biaya per cacat membesar</text>
      <text x="300" y="34" textAnchor="middle" style={capStyle}>Empat level pengujian — sedini mungkin, seluas perlu</text>
    </svg>
  );
}

/* ---------- katalog kunci untuk placeholder %%IMG:key%% ---------- */
export const FIGURES: Record<string, { node: ReactNode; caption: string }> = {
  "web-browser-server": {
    node: <FigBrowserServer />,
    caption: "Gambar 1.1 — Web bekerja: browser meminta, server mengirim HTML, browser menggambar halaman.",
  },
  "web-trio": {
    node: <FigWebTrio />,
    caption: "Gambar 1.2 — Tiga lapisan penyusun halaman: HTML (kerangka), CSS (gaya), JavaScript (perilaku).",
  },
  "anatomi-dokumen": {
    node: <FigAnatomy />,
    caption: "Gambar 2.1 — Empat pilar dokumen HTML dan batas wilayah head (tak terlihat) vs body (terlihat).",
  },
  "html-dom-tree": {
    node: <FigDomTree />,
    caption: "Gambar 2.2 — Struktur Pohon DOM: elemen bersarang dari html, head, hingga body dan isinya.",
  },
  "struktur-tag": {
    node: <FigTagStructure />,
    caption: "Gambar 3.1 — Bagian-bagian elemen: tag pembuka, atribut, isi, dan tag penutup.",
  },
  "hierarki-heading": {
    node: <FigHeadingTree />,
    caption: "Gambar 3.2 — Hierarki heading ibarat peta: satu h1 di puncak, cabang-cabang h2/h3 di bawahnya.",
  },
  "media-link": {
    node: <FigMediaLink />,
    caption: "Gambar 4.1 — img memakai src + alt; anchor a memakai href yang menunjuk id tujuan.",
  },
  "css-box-model": {
    node: <FigCssBoxModel />,
    caption: "Gambar 4.2 — CSS Box Model: Margin (luar), Border (garis tepi), Padding (dalam), dan Content (isi).",
  },
  "form-semantik": {
    node: <FigFormLabel />,
    caption: "Gambar 5.1 — Kiri: pasangan label↔input lewat id. Kanan: pembagian wilayah semantik halaman.",
  },
  "checklist-uts": {
    node: <FigChecklist />,
    caption: "Gambar 6.1 — Checklist pra-UTS: lima pemeriksaan wajib sebelum menyerahkan proyek.",
  },
  /* ===== Materi RPL (content/rpl) — raster gaya HUD selam + diagram SVG notasi ===== */
  "rpl-p1-pabrik-pl": {
    node: raster(rplP1Pabrik, "Ilustrasi tim hiu CodeShark membangun aplikasi di bengkel bawah laut"),
    caption: "Gambar RPL-1.1 — Perangkat lunak adalah hasil kerja tim yang direkayasa: ada perencanaan, pembangunan, dan pemeriksaan — bukan sulap.",
  },
  "rpl-sdlc-fase": {
    node: <FigSdlcFase />,
    caption: "Gambar RPL-1.2 — Enam fase SDLC: perencanaan, analisis, desain, implementasi, pengujian, deployment & pemeliharaan — dengan umpan balik yang terus berputar.",
  },
  "rpl-p1-siklus-hidup": {
    node: raster(rplP1Siklus, "Ilustrasi perjalanan melingkar stasiun-stasiun siklus hidup perangkat lunak di terumbu karang"),
    caption: "Gambar RPL-1.3 — Siklus hidup perangkat lunak sebagai perjalanan melingkar: setiap stasiun fase menghasilkan bekal untuk stasiun berikutnya.",
  },
  "rpl-p2-waterfall": {
    node: raster(rplP2Waterfall, "Ilustrasi air terjun berundak satu arah ke bawah sebagai metafora model Waterfall"),
    caption: "Gambar RPL-2.1 — Waterfall: aliran fase hanya bergerak turun satu arah; kembali ke fase sebelumnya tidak direncanakan dan mahal.",
  },
  "rpl-siklus-scrum": {
    node: <FigSiklusScrum />,
    caption: "Gambar RPL-2.2 — Siklus Scrum: dari Product Backlog dipilih pekerjaan sprint, dibangun harian, menjadi increment, ditinjau, lalu umpan balik kembali ke backlog.",
  },
  "rpl-p2-sprint-agile": {
    node: raster(rplP2Sprint, "Ilustrasi tim hiu berlari sprint melingkar mengelilingi pulau karang"),
    caption: "Gambar RPL-2.3 — Sprint Agile: putaran pendek yang berulang dengan pit-stop evaluasi — cepat, terukur, dan mudah berbelok arah.",
  },
  "rpl-p3-elisitasi": {
    node: raster(rplP3Elisitasi, "Ilustrasi analis hiu mewawancarai para pemangku kepentingan makhluk laut"),
    caption: "Gambar RPL-3.1 — Elisitasi: analis menggali kebutuhan dari beragam pemangku kepentingan, bukan menebaknya sendiri.",
  },
  "rpl-alur-kebutuhan": {
    node: <FigAlurKebutuhan />,
    caption: "Gambar RPL-3.2 — Empat tahap rekayasa kebutuhan: elisitasi, analisis, spesifikasi, validasi — dan kembali mengulang bila belum sesuai.",
  },
  "rpl-p3-dokumen-srs": {
    node: raster(rplP3Srs, "Ilustrasi dokumen holografik raksasa berisi daftar periksa yang sedang ditinjau"),
    caption: "Gambar RPL-3.3 — SRS yang baik ibarat dokumen periksa raksasa: setiap kebutuhan tertulis, terukur, dan dapat dicentang kebenarannya.",
  },
  "rpl-p4-aktor-sistem": {
    node: raster(rplP4Aktor, "Ilustrasi kubah kaca berisi portal oval dengan aktor di luar yang berinteraksi"),
    caption: "Gambar RPL-4.1 — Gagasan use case: aktor berada di luar batas sistem dan hanya menyentuh fungsi (portal oval) yang menjadi haknya.",
  },
  "rpl-usecase-perpus": {
    node: <FigUseCasePerpus />,
    caption: "Gambar RPL-4.2 — Use case diagram Sistem Perpustakaan: Catat Transaksi selalu ikut (include); Hitung Denda hanya bila terlambat (extend).",
  },
  "rpl-p4-alur-aktivitas": {
    node: raster(rplP4Alur, "Ilustrasi arus bercahaya yang bercabang di gerbang belah ketupat lalu menyatu kembali"),
    caption: "Gambar RPL-4.3 — Activity diagram sebagai arus proses: ia dapat bercabang pada keputusan, berjalan paralel, lalu menyatu kembali.",
  },
  "rpl-p5-blok-kelas": {
    node: raster(rplP5Blok, "Ilustrasi arsitek hiu menyusun blok-blok cetak biru berlapis yang saling terhubung"),
    caption: "Gambar RPL-5.1 — Kelas sebagai blok bangunan berlapis (nama, atribut, operasi) yang dirakit menjadi struktur sistem.",
  },
  "rpl-class-diagram-kuis": {
    node: <FigClassDiagramKuis />,
    caption: "Gambar RPL-5.2 — Class diagram kuis: multiplisitas pada asosiasi dan komposisi Kuis◆—Soal (soal mati bersama kuisnya).",
  },
  "rpl-p5-sinyal-urutan": {
    node: raster(rplP5Sinyal, "Ilustrasi pilar stasiun bawah laut saling bertukar sinyal sonar berurutan"),
    caption: "Gambar RPL-5.3 — Sequence diagram sebagai percakapan: sinyal (pesan) berpindah antar stasiun (objek) mengikuti urutan waktu.",
  },
  "rpl-level-pengujian": {
    node: <FigLevelPengujian />,
    caption: "Gambar RPL-6.1 — Empat level pengujian bertingkat: unit yang banyak dan cepat di dasar, penerimaan pengguna yang sempit dan menentukan di puncak.",
  },
  "rpl-p6-inspeksi-bug": {
    node: raster(rplP6Bug, "Ilustrasi inspektur hiu memeriksa robot kepiting bug dengan kaca pembesar raksasa"),
    caption: "Gambar RPL-6.2 — Pengujian sebagai inspeksi: cacat (bug) dicari sedini mungkin dengan kasus uji yang dirancang, bukan ditemukan pengguna.",
  },
  "rpl-p6-pemeliharaan": {
    node: raster(rplP6Rawat, "Ilustrasi kru hiu merawat dan meningkatkan stasiun bawah laut"),
    caption: "Gambar RPL-6.3 — Pemeliharaan: sistem yang sudah rilis terus diperbaiki, disesuaikan, disempurnakan, dan dicegah kerusakannya.",
  },
};

/** Ambil gambar berdasarkan kunci placeholder dari katalog web. */
export const getFigure = (key: string) => {
  const k = key.trim();
  return FIGURES[k];
};

