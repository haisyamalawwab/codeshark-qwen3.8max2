/* ============ SKENARIO "THE AI-TRAP & PRODUCTION CRISIS SIMULATOR" ============
   Tahap 1 – Pemicu (Disorienting Dilemma). Rancangan: docs/053.

   Tiap skenario adalah satu halaman mini HTML + <style> + <script> yang diklaim
   "hasil asisten AI" dan berisi EMPAT cacat yang sengaja ditanam:
     1 HTML  · tanda kutip atribut tidak ditutup
     1 CSS   · titik koma / kurung kurawal hilang
     1 JS    · nama variabel yang nyaris sama (baru ketahuan saat dijalankan)
     1 JS    · satu baris "terpotong saat disalin" yang harus DITULIS ULANG utuh
               (padat simbol — sumber data peta panas keyboard)

   `checks` adalah badan fungsi JavaScript yang dijalankan DI DALAM sandbox dan
   mengembalikan daftar { label, ok, detail }. Aturan penulisannya: setiap
   pernyataan diakhiri titik koma, tanpa komentar `//`, dan tanpa teks penutup
   tag skrip — karena badan ini dipadatkan menjadi satu baris (trapRunner). */

import type { AgeId, SaveData } from "../lib/storage";
import type { Region } from "../lib/trapLint";
import { splitRegions, lintCss } from "../lib/trapLint";

export interface TrapDef {
  id: string;
  lang: Region;
  /** potongan unik pada kode beracun — dipakai mencari nomor barisnya */
  needle: string;
  title: string;
  /** baris sebelum dan sesudah diperbaiki, untuk pembongkaran jebakan */
  before: string;
  after: string;
  /** penjelasan di pembongkaran: apa gejalanya dan mengapa lolos dari mata */
  reveal: string;
  /** true bila jebakan ini sudah benar pada kode yang diberikan */
  fixed: (code: string) => boolean;
}

export interface TrapScenario {
  id: string;
  title: string;
  /** narasi insiden di pengarahan */
  incident: string;
  /** apa yang dianggap "pulih" */
  goal: string;
  code: string;
  /** kode acuan yang benar (dipakai uji otomatis, tidak pernah ditampilkan saat Babak 1) */
  solution: string;
  traps: TrapDef[];
  /** kira-kira berapa karakter yang harus diketik untuk memperbaiki semuanya */
  fixChars: number;
  checks: string;
}

const LISTENER_RE = /tombol\s*\.\s*addEventListener\(\s*(['"`])click\1\s*,\s*(?:\(\s*\)\s*=>|function\s*\(\s*\))\s*\{/;

const cssOf = (code: string) => splitRegions(code).css;

/* ---------------------------------------------------------------- skenario 1 */

const KERANJANG_CODE = `<!-- Dibuat oleh asisten AI • fitur: tombol tambah barang ke keranjang -->
<div class="kartu">
  <h2>Keranjang Belanja</h2>
  <p>Total: Rp <span id="total">0</span></p>
  <button id="tambah" class="btn>Tambah Barang</button>
  <p class="catatan">Harga satuan Rp 15.000</p>
</div>

<style>
  .kartu { padding: 16px; border: 1px solid #ccc; }
  .btn {
    background: #0a7
    color: white;
    padding: 8px 12px;
  }
  .catatan { color: #555; }
</style>

<script>
  const hargaSatuan = 15000;
  let jumlahBarang = 0;
  const tombol = document.querySelector('#tambah');
  const label = document.querySelector('#total');

  function hitungTotal(jumlah) {
    return jumlah * hargaSatuaan;
  }

  // pasang listener klik (baris di bawah ini terpotong saat disalin)
    jumlahBarang += 1;
    label.textContent = hitungTotal(jumlahBarang);
  });
</script>
`;

const KERANJANG_SOLUTION = KERANJANG_CODE
  .replace('class="btn>Tambah Barang', 'class="btn">Tambah Barang')
  .replace("background: #0a7\n", "background: #0a7;\n")
  .replace("hargaSatuaan", "hargaSatuan")
  .replace("terpotong saat disalin)\n", "terpotong saat disalin)\n  tombol.addEventListener('click', () => {\n");

const KERANJANG: TrapScenario = {
  id: "keranjang",
  title: "Tombol “Tambah Barang” macet",
  incident:
    "Tombol “Tambah Barang” di halaman keranjang toko tidak berfungsi sejak rilis sore ini. Pesanan berhenti masuk. " +
    "Rekan timmu menyalin perbaikan dari asisten AI dan langsung merilisnya tanpa dibaca — lalu pulang.",
  goal: "Tombol tampil benar, berwarna hijau merek, dan total menjadi 30000 setelah dua klik.",
  code: KERANJANG_CODE,
  solution: KERANJANG_SOLUTION,
  fixChars: 45,
  traps: [
    {
      id: "html-kutip",
      lang: "html",
      needle: 'class="btn>',
      title: "Tanda kutip atribut tidak ditutup",
      before: '<button id="tambah" class="btn>Tambah Barang</button>',
      after: '<button id="tambah" class="btn">Tambah Barang</button>',
      reveal:
        "Satu tanda kutip yang hilang membuat browser menelan teks tombol dan tag di bawahnya sebagai nilai atribut class. " +
        "Browser tidak menampilkan pesan error apa pun untuk HTML — halaman hanya rusak diam-diam.",
      fixed: (code) => /<button\b[^>]*\bclass\s*=\s*"btn"[^>]*>\s*Tambah Barang\s*<\/button>/.test(code),
    },
    {
      id: "css-titik-koma",
      lang: "css",
      needle: "background: #0a7",
      title: "Titik koma CSS hilang",
      before: "background: #0a7",
      after: "background: #0a7;",
      reveal:
        "Tanpa titik koma, browser membaca dua deklarasi sebagai satu nilai yang tidak sah, lalu membuang keduanya. " +
        "Tombol kehilangan warna latar dan warna teks sekaligus — juga tanpa pesan error.",
      fixed: (code) => /background\s*:\s*#0a7\s*;/i.test(cssOf(code)),
    },
    {
      id: "js-nama-variabel",
      lang: "js",
      needle: "hargaSatuaan",
      title: "Nama variabel yang nyaris sama",
      before: "return jumlah * hargaSatuaan;",
      after: "return jumlah * hargaSatuan;",
      reveal:
        "hargaSatuaan (dua huruf a) tidak pernah dideklarasikan. Kesalahan ini tidak terlihat saat kode dimuat; " +
        "ia baru meledak sebagai ReferenceError ketika tombol benar-benar diklik.",
      fixed: (code) => {
        const js = splitRegions(code).js;
        return !/hargaSatuaan/.test(js) && /jumlah\s*\*\s*hargaSatuan\b/.test(js);
      },
    },
    {
      id: "js-baris-terpotong",
      lang: "js",
      needle: "terpotong saat disalin",
      title: "Satu baris terpotong saat disalin",
      before: "(baris pemasangan listener hilang)",
      after: "tombol.addEventListener('click', () => {",
      reveal:
        "Baris pembuka listener tidak ikut tersalin. Mesin JavaScript melaporkan error di baris penutup `});`, " +
        "bukan di tempat baris itu hilang — dan baris ini harus kamu tulis sendiri, simbol demi simbol.",
      fixed: (code) => LISTENER_RE.test(splitRegions(code).js),
    },
  ],
  checks: `
    var out = [];
    var btn = document.querySelector('#tambah');
    var total = document.querySelector('#total');
    var teks = btn ? btn.textContent.replace(/\\s+/g, ' ').trim() : '';
    out.push({ label: 'Tombol bertuliskan “Tambah Barang”', ok: teks === 'Tambah Barang',
      detail: btn ? 'terbaca: “' + teks.slice(0, 40) + '”' : 'tombol #tambah tidak ditemukan' });
    var bg = btn ? getComputedStyle(btn).backgroundColor : '';
    out.push({ label: 'Tombol memakai warna hijau merek', ok: bg === 'rgb(0, 170, 119)',
      detail: btn ? 'warna latar terbaca: ' + bg : 'tombol #tambah tidak ditemukan' });
    if (btn) { btn.click(); btn.click(); }
    var angka = total ? total.textContent.trim() : '';
    out.push({ label: 'Total setelah 2 klik = 30000', ok: angka === '30000',
      detail: total ? 'terbaca: ' + angka.slice(0, 20) : 'elemen #total tidak ditemukan' });
    return out;
  `,
};

/* ---------------------------------------------------------------- skenario 2 */

const SUKA_CODE = `<!-- Dibuat oleh asisten AI • fitur: tombol suka pada postingan -->
<div class="pos">
  <h2>Postingan Kapten Hiu</h2>
  <button id="suka" class="tombol">Suka</button>
  <p>Disukai <span id="jumlah>0</span> kali</p>
  <p class="info">Terima kasih sudah mampir.</p>
</div>

<style>
  .pos { padding: 16px; border: 1px solid #ccc; }
  .tombol {
    color: white;
    background: #c33;
    border-radius: 6px;

  .info { color: #555; }
</style>

<script>
  const langkah = 1;
  let jumlahSuka = 0;
  const tombol = document.querySelector('#suka');
  const penghitung = document.querySelector('#jumlah');

  function tambahSuka(nilai) {
    return nilai + langkha;
  }

  // pasang listener klik (baris di bawah ini terpotong saat disalin)
    jumlahSuka = tambahSuka(jumlahSuka);
    penghitung.textContent = jumlahSuka;
  });
</script>
`;

const SUKA_SOLUTION = SUKA_CODE
  .replace('id="jumlah>0', 'id="jumlah">0')
  .replace("border-radius: 6px;\n\n", "border-radius: 6px;\n  }\n")
  .replace("langkha;", "langkah;")
  .replace("terpotong saat disalin)\n", "terpotong saat disalin)\n  tombol.addEventListener('click', () => {\n");

const SUKA: TrapScenario = {
  id: "suka",
  title: "Tombol “Suka” tidak menghitung",
  incident:
    "Tombol “Suka” di halaman postingan berhenti menghitung sejak rilis sore ini, dan keluhan pengguna terus masuk. " +
    "Rekan timmu menyalin perbaikan dari asisten AI dan langsung merilisnya tanpa dibaca — lalu pulang.",
  goal: "Penghitung tampil, teks info berwarna abu-abu, dan angka menjadi 3 setelah tiga klik.",
  code: SUKA_CODE,
  solution: SUKA_SOLUTION,
  fixChars: 50,
  traps: [
    {
      id: "html-kutip",
      lang: "html",
      needle: 'id="jumlah>',
      title: "Tanda kutip atribut tidak ditutup",
      before: '<span id="jumlah>0</span>',
      after: '<span id="jumlah">0</span>',
      reveal:
        "Satu tanda kutip yang hilang membuat browser menelan isi baris itu dan tag di bawahnya sebagai nilai atribut id. " +
        "Elemen #jumlah tidak pernah ada, dan browser tidak menampilkan pesan error apa pun untuk HTML.",
      fixed: (code) => /<span\b[^>]*\bid\s*=\s*"jumlah"[^>]*>/.test(code),
    },
    {
      id: "css-kurung",
      lang: "css",
      needle: "border-radius: 6px;",
      title: "Kurung kurawal penutup CSS hilang",
      before: "border-radius: 6px;",
      after: "border-radius: 6px;\n  }",
      reveal:
        "Aturan .tombol tidak pernah ditutup, sehingga aturan .info di bawahnya terbaca sebagai bagian dari .tombol " +
        "dan tidak berlaku. Tidak ada pesan error — teks info hanya kehilangan warnanya.",
      fixed: (code) => {
        const css = cssOf(code);
        return /\.tombol\s*\{[^{}]*\}/.test(css) && !lintCss(css).some((f) => f.code === "unclosed-bracket" || f.code === "stray-closer");
      },
    },
    {
      id: "js-nama-variabel",
      lang: "js",
      needle: "langkha;",
      title: "Nama variabel yang nyaris sama",
      before: "return nilai + langkha;",
      after: "return nilai + langkah;",
      reveal:
        "langkha (huruf tertukar) tidak pernah dideklarasikan. Kesalahan ini tidak terlihat saat kode dimuat; " +
        "ia baru meledak sebagai ReferenceError ketika tombol benar-benar diklik.",
      fixed: (code) => {
        const js = splitRegions(code).js;
        return !/\blangkha\b/.test(js) && /nilai\s*\+\s*langkah\b/.test(js);
      },
    },
    {
      id: "js-baris-terpotong",
      lang: "js",
      needle: "terpotong saat disalin",
      title: "Satu baris terpotong saat disalin",
      before: "(baris pemasangan listener hilang)",
      after: "tombol.addEventListener('click', () => {",
      reveal:
        "Baris pembuka listener tidak ikut tersalin. Mesin JavaScript melaporkan error di baris penutup `});`, " +
        "bukan di tempat baris itu hilang — dan baris ini harus kamu tulis sendiri, simbol demi simbol.",
      fixed: (code) => LISTENER_RE.test(splitRegions(code).js),
    },
  ],
  checks: `
    var out = [];
    var btn = document.querySelector('#suka');
    var hitung = document.querySelector('#jumlah');
    var info = document.querySelector('.info');
    out.push({ label: 'Penghitung #jumlah ada di halaman', ok: !!hitung,
      detail: 'elemen #jumlah tidak ditemukan' });
    var warna = info ? getComputedStyle(info).color : '';
    out.push({ label: 'Teks info berwarna abu-abu', ok: warna === 'rgb(85, 85, 85)',
      detail: info ? 'warna terbaca: ' + warna : 'elemen .info tidak ditemukan' });
    if (btn) { btn.click(); btn.click(); btn.click(); }
    var angka = hitung ? hitung.textContent.trim() : '';
    out.push({ label: 'Jumlah suka setelah 3 klik = 3', ok: angka === '3',
      detail: hitung ? 'terbaca: ' + angka.slice(0, 20) : 'elemen #jumlah tidak ditemukan' });
    return out;
  `,
};

export const TRAP_SCENARIOS: TrapScenario[] = [KERANJANG, SUKA];

export function getTrapScenario(id: string): TrapScenario | undefined {
  return TRAP_SCENARIOS.find((s) => s.id === id);
}

/** Pilih skenario yang berbeda dari percobaan terakhir. */
export function pickTrapScenario(lastId?: string | null, rand: () => number = Math.random): TrapScenario {
  const pool = TRAP_SCENARIOS.filter((s) => s.id !== lastId);
  const list = pool.length ? pool : TRAP_SCENARIOS;
  return list[Math.floor(rand() * list.length) % list.length];
}

/** nomor baris (mulai 1) jebakan pada kode beracun */
export function trapLine(sc: TrapScenario, trap: TrapDef): number {
  const idx = sc.code.indexOf(trap.needle);
  if (idx < 0) return 1;
  return sc.code.slice(0, idx).split("\n").length;
}

export const fixedTrapIds = (sc: TrapScenario, code: string): string[] =>
  sc.traps.filter((t) => t.fixed(code)).map((t) => t.id);

/* ============ GERBANG ============
   Wajib sekali sebelum latihan pertama untuk kelompok Mahasiswa/Umum.
   Opsional (lewat kartu Dashboard) untuk 16–19 tahun. Tidak ditampilkan
   untuk kelompok 10–15 tahun. */

export const TRAP_REQUIRED_AGES: AgeId[] = ["academy"];
export const TRAP_OPTIONAL_AGES: AgeId[] = ["senior"];
/** XP partisipasi — sekali, tidak bergantung pada hasil */
export const TRAP_PARTICIPATION_XP = 30;

export function trapVisibleFor(age: AgeId | undefined): boolean {
  return !!age && (TRAP_REQUIRED_AGES.includes(age) || TRAP_OPTIONAL_AGES.includes(age));
}

/** true bila latihan harus dialihkan dulu ke simulator. Perangkat sentuh tidak
    digerbang: keyboard HP tidak menghasilkan data yang sahih (ditunda ke laptop). */
export function needsTrapGate(save: Pick<SaveData, "profile" | "aiTrap">, isTouch: boolean): boolean {
  const age = save.profile?.age;
  if (!age || !TRAP_REQUIRED_AGES.includes(age)) return false;
  if (isTouch) return false;
  if (save.aiTrap?.deferred) return false;
  return (save.aiTrap?.attempts.length ?? 0) === 0;
}
