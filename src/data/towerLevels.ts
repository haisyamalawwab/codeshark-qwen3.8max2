/* Ladder kesulitan Coding Tower untuk fase HTML (P1–P8: P1–P6 dasar, P7 mini project, P8 gladi UTS).
   Tiap pertemuan = satu level: jumlah lantai per tahap, blok pengecoh,
   laju ancaman, jatah petunjuk, dan mekanik yang diajarkan — makin sulit.
   Pertemuan non-HTML / misi lama memakai level generik (ramping ringan). */

export interface TowerLevel {
  /** nomor level tampil (1–8 untuk HTML) */
  level: number;
  title: string;
  /** mekanik yang dilatih di level ini */
  mechanic: string;
  /** tips singkat tampil di briefing */
  tip: string;
  /** maks blok per tahap (menara dipecah jadi beberapa tahap bila lantai banyak) */
  stageSize: number;
  /** jumlah pengecoh yang disisipkan ke bank */
  decoyCount: number;
  /** pengali laju ancaman (dikalikan cfg.threatRate) */
  threat: number;
  /** jatah petunjuk per permainan */
  hintLimit: number;
  /** biaya ancaman per petunjuk */
  hintCost: number;
  /** kumpulan blok pengecoh (kesalahan khas pertemuan ini) */
  decoys: string[];
}

const L = (
  level: number, title: string, mechanic: string, tip: string,
  stageSize: number, decoyCount: number, threat: number,
  hintLimit: number, hintCost: number, decoys: string[],
): TowerLevel => ({
  level, title, mechanic, tip, stageSize, decoyCount, threat, hintLimit, hintCost, decoys,
});

const HTML_LEVELS: Record<number, TowerLevel> = {
  1: L(1, "Fondasi Pertama", "Mengenal tag berpasangan",
    "Pasangan pembuka–penutup selalu berurutan: yang dibuka dulu, ditutup belakangan.",
    8, 0, 0.45, 99, 0, []),
  2: L(2, "Kerangka Dokumen", "Urutan head vs body",
    "Ingat mantra: DOCTYPE → html → head → body. Konten terlihat hanya di body.",
    10, 1, 0.6, 5, 3,
    ['<body>\n  <h1>Selamat datang</h1>\n</head>']),
  3: L(3, "Daftar & Hierarki", "ul vs ol, li di dalamnya",
    "<li> wajib tinggal di dalam <ul> atau <ol>. <ol> = bernomor, <ul> = bullet.",
    6, 2, 0.75, 4, 4,
    ["<ul>\n  <li>Buka tali</li>\n</ul>", "<ol>\n  <li>Masker</li>\n</ol>"]),
  4: L(4, "Media & Tautan", "href vs src + alt wajib",
    "<a> pakai href, <img> pakai src. Setiap gambar wajib punya alt.",
    5, 2, 0.9, 3, 4,
    [
      '<a src="about.html">Tentang Kami</a>',
      '<img href="img/hiu.jpg" alt="Hiu berenang" />',
    ]),
  5: L(5, "Formulir Pasangan", "label for ↔ input id",
    "Setiap <label for=\"…\"> harus punya <input id=\"…\"> yang sama persis.",
    5, 3, 1.0, 3, 5,
    [
      '<label for="nama">Nama:</label>\n<input id="email" type="text" />',
      '<input id="nama" type="text" />',
      "<button>Kirim</button>",
    ]),
  6: L(6, "Menara Profil", "Merakit semantik lengkap",
    "Kerjakan per tahap: header+nav dulu, lalu section demi section.",
    6, 3, 1.1, 2, 5,
    [
      "<main>\n  <header>\n    <h1>Raka</h1>\n  </header>\n</main>",
      '<img src="foto.jpg" width="120" />',
      "<section>\n  <h2>Kontak</h2>\n</main>",
    ]),
  7: L(7, "Menara Presentasi", "Semantik rapi untuk didemo",
    "Menara yang rapi = demo yang meyakinkan: nav, section ber-id, dan footer berurutan.",
    6, 3, 1.15, 2, 5,
    [
      '<section id="kontak">\n  <h2>Hubungi Saya</h2>\n</footer>',
      '<a href="#kontak">Kontak</a>\n</nav>',
      '<label for="nama">Nama:</label>\n<input id="email" type="text" />',
    ]),
  8: L(8, "Gladi UTS", "Campuran + validasi rapi",
    "Ujian sesungguhnya: atribut, alt, label, dan titik koma CSS — teliti tiap lantai.",
    6, 3, 1.25, 2, 6,
    [
      '<meta name="viewport" content="width=device-width" />',
      '<img src="foto.jpg" alt="Foto Raka" />',
      ".kartu {\n  padding: 16px\n  border-radius: 12px;\n}",
    ]),
};

/** Level generik untuk CSS/JS/UAS & misi lama — ramping ringan mengikuti nomor. */
function genericLevel(no: number): TowerLevel {
  const d = Math.min(3, Math.floor(Math.max(1, no) / 4));
  return L(
    Math.min(9, no), `Tantangan P${no}`, "Susun sesuai urutan logika",
    "Baca alur kode: atas ke bawah, buka sebelum tutup, indentasi sebagai petunjuk.",
    7, d, 1.0, 3, 5,
    ["}", "};", "</div>", "console.log(x)"],
  );
}

export function getTowerLevel(no: number): TowerLevel {
  return HTML_LEVELS[no] ?? genericLevel(no);
}

/** Pecah daftar blok menjadi tahap-tahap berukuran stageSize. */
export function buildStages(blocks: string[], stageSize: number): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < blocks.length; i += stageSize) out.push(blocks.slice(i, i + stageSize));
  return out.length ? out : [[]];
}

/** Bagi pengecoh ke tiap tahap secara round-robin. */
export function decoysPerStage(decoys: string[], stageCount: number): string[][] {
  const out: string[][] = Array.from({ length: stageCount }, () => []);
  decoys.forEach((d, i) => { out[i % stageCount].push(d); });
  return out;
}

/** Nama tag utama sebuah blok — untuk chip label & warna lantai. */
export function extractTag(block: string): string {
  const m = /<\/?([a-zA-Z][\w-]*)/.exec(block);
  if (m) return m[1].toLowerCase();
  if (/^\s*[{}();]/.test(block)) return "{}";
  if (/console|const|let|function|return|if|for|while/.test(block)) return "js";
  if (/[a-z-]+\s*:/.test(block)) return "css";
  return "teks";
}

/** Warna aksen per jenis tag — versi pekat agar terbaca di atas putih.
   Keluarga utama: orange untuk struktur/aksi, indigo untuk daftar & tautan. */
export function tagColor(tag: string): string {
  if (/^h[1-6]$/.test(tag)) return "#c2410c";
  if (tag === "p" || tag === "teks") return "#0f766e";
  if (["ul", "ol", "li"].includes(tag)) return "#4f46e5";
  if (["a", "img", "nav"].includes(tag)) return "#7c3aed";
  if (["form", "input", "label", "button", "textarea", "select"].includes(tag)) return "#ea580c";
  if (["header", "main", "footer", "section", "article"].includes(tag)) return "#b45309";
  if (tag === "{}" || tag === "css") return "#475569";
  if (tag === "js") return "#a16207";
  return "#334155";
}
