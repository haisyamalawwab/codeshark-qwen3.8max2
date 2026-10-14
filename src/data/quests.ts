/* ============ SESI LATIHAN PER PERTEMUAN: QUEST · DRILL · JUGGLING ============
   Setiap pertemuan (1–16) punya tiga sesi ketik yang harus dilalui mahasiswa:
   • QUEST    — kode utuh pertemuan itu (latihan ketik dari curriculum.ts).   Target akurasi 90%.
   • DRILL    — baris-baris pendek berfokus pada sintaks inti pertemuan.     Target akurasi 90%.
   • JUGGLING — drill pertemuan ini DIANYAM bergantian dengan drill pertemuan
                sebelumnya yang sejenis (bahasa sama). Melatih pindah konteks
                & ingatan jangka panjang (spaced review).                    Target akurasi 85%.
   Level pertemuan: PERUNGGU = quest lulus · PERAK = quest + drill lulus · EMAS = + juggling lulus.
   Pertemuan n+1 terbuka bila pertemuan n sudah PERAK. */

import type { Lang } from "../lib/highlight";
import type { ModuleDef } from "./modules";
import { getModule } from "./modules";
import { CURRICULUM, getLesson } from "./curriculum";

export type SessionKind = "misi" | "quest" | "drill" | "juggle";

/** Bentuk sesi yang dikonsumsi TypingGame & Results. Field inti sengaja sama dengan ModuleDef. */
export interface Session {
  id: string;
  kind: SessionKind;
  num: number;
  /** label singkat di header, mis. "Quest P5 • Formulir" */
  tag: string;
  practiceTitle: string;
  color: string;
  lang: Lang;
  code: string;
  preview: (typed: string) => string;
  /** akurasi minimal (%) untuk dianggap LULUS. 0 = cukup menyelesaikan misi */
  passAcc: number;
  /** pengali kecepatan ancaman hiu (1 = normal) */
  threatMul: number;
  intro: string;
}

export const PASS_ACC: Record<Exclude<SessionKind, "misi">, number> = {
  quest: 90,
  drill: 90,
  juggle: 85,
};

const THREAT_MUL: Record<Exclude<SessionKind, "misi">, number> = {
  quest: 1,
  drill: 0.6,
  juggle: 1.3,
};

/** bahasa tampilan tiap pertemuan (P8 UTS = latihan HTML+CSS, lang html; P12 = flexbox CSS) */
export const LESSON_LANG: Record<number, Lang> = {
  1: "html", 2: "html", 3: "html", 4: "html", 5: "html", 6: "html", 7: "html", 8: "html",
  9: "css", 10: "css", 11: "css", 12: "css",
  13: "js", 14: "js", 15: "js", 16: "js",
};

/** drill per pertemuan: setiap baris = satu item yang harus diketik persis */
export const DRILLS: Record<number, string[]> = {
  1: [
    "<h1>Halo, Dunia!</h1>",
    "<p>Ini paragraf pertamaku.</p>",
    "<h2>Judul Kedua</h2>",
    "<p>Aku sedang belajar HTML.</p>",
    "<!-- Ini komentar, tidak tampil di layar -->",
    "<hr />",
    "<br />",
    "<h3>Tag Berpasangan</h3>",
  ],
  2: [
    "<!DOCTYPE html>",
    '<html lang="id">',
    "<head>",
    '<meta charset="UTF-8" />',
    "<title>Latihan Kerangka</title>",
    "</head>",
    "<body>",
    "<h1>Selamat datang</h1>",
    "</body>",
    "</html>",
  ],
  3: [
    "<h1>Resep Samudra</h1>",
    "<h2>Bahan</h2>",
    "<p>Ambil <strong>dua</strong> mangkuk <em>segar</em>.</p>",
    "<ul>",
    "<li>Masker</li>",
    "<li>Fin</li>",
    "</ul>",
    "<ol>",
    "<li>Buka tali</li>",
    "<li>Masukkan kaki</li>",
    "</ol>",
  ],
  4: [
    '<img src="img/hiu.jpg" alt="Hiu berenang di terumbu" width="320" />',
    '<a href="https://developer.mozilla.org">Dokumentasi MDN</a>',
    '<a href="about.html">Tentang Kami</a>',
    '<a href="#kontak">Ke bagian kontak</a>',
    '<nav><a href="index.html">Beranda</a></nav>',
    '<h2 id="kontak">Kontak</h2>',
    '<img src="img/terumbu.png" alt="Terumbu karang berwarna-warni" />',
  ],
  5: [
    "<form>",
    '<label for="nama">Nama:</label>',
    '<input id="nama" type="text" required />',
    '<label for="email">Email:</label>',
    '<input id="email" type="email" />',
    '<input id="setuju" type="checkbox" />',
    '<label for="setuju">Saya setuju</label>',
    '<textarea id="pesan" rows="4"></textarea>',
    '<button type="submit">Kirim</button>',
    "</form>",
  ],
  6: [
    "<header><h1>Raka Pratama</h1></header>",
    '<nav><a href="#kontak">Kontak</a></nav>',
    "<main>",
    "<section><h2>Tentang</h2><p>Siswa SMA Bahari.</p></section>",
    '<img src="foto.jpg" alt="Foto Raka" width="200" />',
    "</main>",
    "<footer>&copy; 2026 Raka</footer>",
    '<label for="nama">Nama</label>',
    '<input id="nama" type="text" placeholder="Nama" />',
  ],
  7: [
    "<nav>",
    '<a href="index.html">Beranda</a>',
    '<a href="#kontak">Kontak</a>',
    "</nav>",
    '<section id="kontak">',
    "<h2>Hubungi Saya</h2>",
    '<label for="email">Email:</label>',
    '<input id="email" type="email" required />',
    "<footer>&copy; 2026 Raka</footer>",
  ],
  8: [
    "<!DOCTYPE html>",
    '<html lang="id">',
    "<head>",
    '<meta charset="UTF-8" />',
    "<title>UTS Raka</title>",
    "</head>",
    "<body>",
    "<h1>Judul Utama</h1>",
    '<img src="a.png" alt="Gambar A" />',
    "</body>",
    "</html>",
  ],
  9: [
    "body {",
    "color: #eaf6ff;",
    "}",
    "h1, h2, h3 {",
    "color: #ffc247;",
    "}",
    "p {",
    "line-height: 1.6;",
    "}",
    "button {",
    "border-radius: 10px;",
    "}",
  ],
  10: [
    ".kartu {",
    "background: #0c3350;",
    "padding: 16px;",
    "}",
    "#hero {",
    "text-align: center;",
    "}",
    "p.catatan {",
    "color: #9ad7f5;",
    "}",
    ".judul {",
    "font-size: 1.5rem;",
    "font-weight: 700;",
    "}",
  ],
  11: [
    "* {",
    "box-sizing: border-box;",
    "}",
    "body {",
    "margin: 0;",
    "}",
    ".kartu {",
    "margin: 16px auto;",
    "padding: 20px 24px;",
    "border: 2px solid #2ee6c8;",
    "border-radius: 14px;",
    "}",
  ],
  12: [
    ".bar {",
    "display: flex;",
    "justify-content: space-between;",
    "align-items: center;",
    "gap: 12px;",
    "}",
    "@media (max-width: 600px) {",
    ".bar {",
    "flex-direction: column;",
    "}",
    "}",
  ],
  13: [
    'const nama = "Raka";',
    "let skor = 0;",
    "skor = skor + 10;",
    'const pesan = "Halo, " + nama;',
    "console.log(pesan);",
    "console.log(skor);",
    "let total = 4 + 6 * 2;",
    "console.log(total);",
  ],
  14: [
    "if (skor >= 10) {",
    'console.log("Lulus");',
    "} else {",
    'console.log("Coba lagi");',
    "}",
    'if (nama === "Raka" && skor > 0) {',
    'console.log("Halo Raka");',
    "}",
    'const status = skor > 5 ? "Hebat" : "Lanjut";',
    "console.log(status);",
  ],
  15: [
    "for (let i = 1; i <= 5; i++) {",
    'console.log("Baris " + i);',
    "}",
    "let n = 0;",
    "while (n < 3) {",
    "n = n + 1;",
    "}",
    "function sapa(nama) {",
    'return "Halo, " + nama;',
    "}",
    "const jumlah = (a, b) => a + b;",
  ],
  16: [
    'const tombol = document.querySelector("button");',
    'const pesan = document.querySelector("#pesan");',
    "let jumlah = 0;",
    'tombol.addEventListener("click", function () {',
    "jumlah = jumlah + 1;",
    'pesan.textContent = "Diklik " + jumlah + " kali";',
    "});",
    'pesan.classList.toggle("aktif");',
  ],
};


/** nama Quest & tugas mandiri (produk) per pertemuan — sesuai tabel kurikulum */
export const TUGAS_PERTEMUAN: Record<number, { quest: string; tugas: string }> = {
  1: { quest: "Kerangka halaman pertama", tugas: "index.html dengan h1 dan dua paragraf" },
  2: { quest: "Kerangka + head/body", tugas: "Kerangka lengkap, valid di validator W3C" },
  3: { quest: "Profil Kadet", tugas: "Halaman dengan <ul>, <ol>, <strong>, <em>" },
  4: { quest: "Blog + gambar + link", tugas: "Dua halaman dengan nav, alt wajib, anchor" },
  5: { quest: "Formulir daftar", tugas: "Form dengan label, radio, checkbox, select, textarea" },
  6: { quest: "Profil utuh", tugas: "Halaman gabungan P1–P5, lolos checklist pra-UTS" },
  7: { quest: "Demo profil & review", tugas: "Demo 5 menit + review sejawat, siap UTS" },
  8: { quest: "Halaman HTML + CSS", tugas: "Ujian praktik 40 menit dengan gaya.css eksternal" },
  9: { quest: "Gaya dasar", tugas: "gaya.css dengan selector elemen, tanpa inline style" },
  10: { quest: "Kartu dengan class/id", tugas: "Tiga class, satu id, HEX, rem" },
  11: { quest: "Kartu berpadding", tugas: "box-sizing, margin: auto, border" },
  12: { quest: "Navbar flex", tugas: "Flex + @media, menumpuk di layar 375px" },
  13: { quest: "Operator & variabel", tugas: "const/let, typeof, console.log" },
  14: { quest: "if/else, &&, ternary", tugas: "cekNilai(n) dengan minimal 3 kasus uji" },
  15: { quest: "for, while, function", tugas: "Angka 1–10, rata-rata, fungsi dipanggil 3×" },
  16: { quest: "Counter klik", tugas: "Mini app satu berkas: input, tombol, event, uji kasus tepi" },
};

/** pertemuan pembanding untuk juggling: sebelumnya dan sebahasa; bila tak ada → drill sendiri (dibalik) */
export function juggleSource(no: number): number | null {
  for (let n = no - 1; n >= 1; n--) if (LESSON_LANG[n] === LESSON_LANG[no]) return n;
  return null;
}

/** anyam dua daftar baris: a0, b0, a1, b1, … (sisa ditambahkan di akhir) */
export function interleave(a: string[], b: string[]): string[] {
  const out: string[] = [];
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

const modIdOf = (lang: Lang) => lang;

export const questId = (no: number, kind: Exclude<SessionKind, "misi">) => `q:${no}:${kind}`;

/** Ambil sesi dari id: "html"/"css"/"js" = misi lama; "q:<no>:<kind>" = sesi pertemuan. */
export function getSession(id: string): Session | null {
  if (!id.startsWith("q:")) {
    const m: ModuleDef = getModule(id);
    return {
      id: m.id, kind: "misi", num: m.num, tag: `Misi 0${m.num}`, practiceTitle: m.practiceTitle,
      color: m.color, lang: m.lang, code: m.code, preview: m.preview, passAcc: 0, threatMul: 1,
      intro: m.practiceIntro,
    };
  }
  const [, noStr, kind] = id.split(":");
  const no = Number(noStr) as number;
  const k = kind as Exclude<SessionKind, "misi">;
  const lesson = getLesson(no);
  if (!lesson || lesson.no !== no || !(k in PASS_ACC)) return null;
  const lang = LESSON_LANG[no] ?? "html";
  const base = getModule(modIdOf(lang));
  const label = { quest: "Quest", drill: "Drill", juggle: "Juggling" }[k];

  let code = "";
  let title = "";
  let intro = "";
  if (k === "quest") {
    if (!lesson.practice) return null;
    code = lesson.practice.code;
    title = TUGAS_PERTEMUAN[no]?.quest ?? lesson.title;
    intro = lesson.practice.intro;
  } else if (k === "drill") {
    const items = DRILLS[no];
    if (!items) return null;
    code = items.join("\n");
    title = `Drill: ${lesson.title}`;
    intro = "Ketik setiap baris persis seperti tampilan. Fokus pada sintaks inti pertemuan ini — kecepatan datang setelah akurasi.";
  } else {
    const own = DRILLS[no];
    if (!own) return null;
    const src = juggleSource(no);
    const other = src !== null ? DRILLS[src] : [...own].reverse();
    code = interleave(own, other).join("\n");
    title = src !== null ? `Juggling P${no} ↔ P${src}` : `Juggling P${no} (urutan balik)`;
    intro = src !== null
      ? `Baris materi P${no} dan P${src} bergantian. Pindahkan fokus setiap baris — ini melatih ingatan jangka panjang.`
      : "Tidak ada pertemuan sebahasa sebelumnya: drill ini dianyam dengan urutan terbalik dirinya sendiri untuk melatih ingatan.";
  }

  return {
    id, kind: k, num: no,
    tag: `${label} P${no} • ${lesson.title}`,
    practiceTitle: title,
    color: lesson.phase === "UAS" ? "#ff6b57" : base.color,
    lang, code, preview: base.preview,
    passAcc: PASS_ACC[k], threatMul: THREAT_MUL[k], intro,
  };
}

/** semua sesi pertemuan (untuk peta & pengecekan konsistensi) */
export function allQuestIds(): string[] {
  return CURRICULUM.flatMap((l) => (["quest", "drill", "juggle"] as const).map((k) => questId(l.no, k)));
}
