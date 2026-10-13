/* ============ GAMBAR ILUSTRASI MATERI (SVG inline, tema HUD Selam) ============
   Dipakai dokumen .md lewat placeholder "%%IMG:<kunci>%%" pada baris sendiri.
   Palet mengikuti var CSS tema: cyan #45c6ff · teal #2ee6c8 · amber #ffc247 ·
   koral #ff7a59 · biru dalam #071b2e. */
import type { ReactNode } from "react";

const CYAN = "#45c6ff";
const TEAL = "#2ee6c8";
const AMBER = "#ffc247";
const CORAL = "#ff7a59";
const LINE = "rgba(126,196,236,0.35)";

const label = { fontFamily: "ui-monospace, monospace", fontWeight: 700 };
const capStyle: Record<string, unknown> = { ...label, fontSize: 11, fill: "#bfe8ff" };
const smallStyle: Record<string, unknown> = { ...label, fontSize: 9, fill: "#7ec4ec" };

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
  "form-semantik": {
    node: <FigFormLabel />,
    caption: "Gambar 5.1 — Kiri: pasangan label↔input lewat id. Kanan: pembagian wilayah semantik halaman.",
  },
  "checklist-uts": {
    node: <FigChecklist />,
    caption: "Gambar 6.1 — Checklist pra-UTS: lima pemeriksaan wajib sebelum menyerahkan proyek.",
  },
};

/** Ambil gambar berdasarkan kunci placeholder; undefined bila tak dikenal. */
export const getFigure = (key: string) => FIGURES[key.trim()];
