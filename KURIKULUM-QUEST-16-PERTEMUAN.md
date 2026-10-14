# Kurikulum Quest · Drill · Juggling — 16 Pertemuan

> Dihasilkan dari `src/data/quests.ts` dan `src/data/curriculum.ts` (drill di dokumen ini = drill yang diketik di aplikasi). Jika data berubah, regenerasi dokumen ini.

## Aturan penilaian sesi

| Sesi | Isi | Target lulus | Fungsi |
|---|---|---|---|
| **Quest** | Kode utuh pertemuan (latihan ketik kode) | akurasi ≥ 90% | Perunggu |
| **Drill** | Baris pendek sintaks inti; ancaman hiu lebih lambat | akurasi ≥ 90% | Perak (membuka pertemuan berikutnya) |
| **Juggling** | Drill pertemuan ini dianyam bergantian dengan drill sebelumnya sebahasa (spaced review); ancaman lebih cepat | akurasi ≥ 85% | Emas |

Aturan tambahan: pertemuan *n+1* terbuka setelah *n* minimal **Perak**. XP & koin hanya bertambah bila hasil **melampaui** rekor sesi (anti-farm). Tombol Ctrl/⌘/Alt tidak dihitung sebagai ketikan.

## Peta

| # | Tahap | Judul | Mesin | Juggling dengan |
|---|---|---|---|---|
| 1 | HTML | Mengenal HTML & Alat Perangnya | html | urutan balik (drill sendiri) |
| 2 | HTML | Anatomi Dokumen HTML | html | P1 |
| 3 | HTML | Teks & Daftar | html | P2 |
| 4 | HTML | Media & Navigasi | html | P3 |
| 5 | HTML | Formulir & Elemen Semantik | html | P4 |
| 6 | HTML | Mini Project: Merakit Halaman Profil | html | P5 |
| 7 | HTML | Mini Project: Presentasi & Review Sejawat | html | P6 |
| 8 | UTS | Panduan UTS: Halaman HTML + CSS | html | P7 |
| 9 | CSS | Cara Kerja CSS & Selektor Dasar | css | urutan balik (drill sendiri) |
| 10 | CSS | Class, ID, Warna & Tipografi | css | P9 |
| 11 | CSS | Box Model: Kotak di Balik Semua Hal | css | P10 |
| 12 | CSS | Layout: Flexbox & Responsif | css | P11 |
| 13 | JS | Variabel, Tipe Data & Operator | js | urutan balik (drill sendiri) |
| 14 | JS | Logika Percabangan | js | P13 |
| 15 | JS | Perulangan & Fungsi | js | P14 |
| 16 | UAS | DOM, Event & Mini App (Gladi UAS) | js | P15 |

---

## Pertemuan 1 — Mengenal HTML & Alat Perangnya

**Tahap:** HTML · **Tujuan:** Memahami peran HTML di dunia web dan menyiapkan berkas halaman pertama.

### Quest (Perunggu)
**Kerangka halaman pertama** — ketik kode latihan pertemuan (170 karakter), akurasi ≥ 90%.

### Drill (Perak)
```html
<h1>Halo, Dunia!</h1>
<p>Ini paragraf pertamaku.</p>
<h2>Judul Kedua</h2>
<p>Aku sedang belajar HTML.</p>
<!-- Ini komentar, tidak tampil di layar -->
<hr />
<br />
<h3>Tag Berpasangan</h3>
```

### Juggling (Emas)
Tidak ada pertemuan sebahasa sebelumnya: drill P1 dianyam dengan urutan terbalik dirinya sendiri (baris terakhir ke pertama). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** index.html dengan h1 dan dua paragraf
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 2 — Anatomi Dokumen HTML

**Tahap:** HTML · **Tujuan:** Menguasai kerangka wajib dokumen HTML dan fungsi head vs body.

### Quest (Perunggu)
**Kerangka + head/body** — ketik kode latihan pertemuan (216 karakter), akurasi ≥ 90%.

### Drill (Perak)
```html
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Latihan Kerangka</title>
</head>
<body>
<h1>Selamat datang</h1>
</body>
</html>
```

### Juggling (Emas)
Anyam drill P2 dengan drill P1: baris P2 dan P1 diketik bergantian (baris 1 P2, baris 1 P1, baris 2 P2, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Kerangka lengkap, valid di validator W3C
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 3 — Teks & Daftar

**Tahap:** HTML · **Tujuan:** Menyusun konten teks bertingkat: heading, paragraf, penekanan, dan daftar.

### Quest (Perunggu)
**Profil Kadet** — ketik kode latihan pertemuan (235 karakter), akurasi ≥ 90%.

### Drill (Perak)
```html
<h1>Resep Samudra</h1>
<h2>Bahan</h2>
<p>Ambil <strong>dua</strong> mangkuk <em>segar</em>.</p>
<ul>
<li>Masker</li>
<li>Fin</li>
</ul>
<ol>
<li>Buka tali</li>
<li>Masukkan kaki</li>
</ol>
```

### Juggling (Emas)
Anyam drill P3 dengan drill P2: baris P3 dan P2 diketik bergantian (baris 1 P3, baris 1 P2, baris 2 P3, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Halaman dengan <ul>, <ol>, <strong>, <em>
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 4 — Media & Navigasi

**Tahap:** HTML · **Tujuan:** Menampilkan gambar dan membuat link antar halaman.

### Quest (Perunggu)
**Blog + gambar + link** — ketik kode latihan pertemuan (262 karakter), akurasi ≥ 90%.

### Drill (Perak)
```html
<img src="img/hiu.jpg" alt="Hiu berenang di terumbu" width="320" />
<a href="https://developer.mozilla.org">Dokumentasi MDN</a>
<a href="about.html">Tentang Kami</a>
<a href="#kontak">Ke bagian kontak</a>
<nav><a href="index.html">Beranda</a></nav>
<h2 id="kontak">Kontak</h2>
<img src="img/terumbu.png" alt="Terumbu karang berwarna-warni" />
```

### Juggling (Emas)
Anyam drill P4 dengan drill P3: baris P4 dan P3 diketik bergantian (baris 1 P4, baris 1 P3, baris 2 P4, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Dua halaman dengan nav, alt wajib, anchor
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 5 — Formulir & Elemen Semantik

**Tahap:** HTML · **Tujuan:** Membangun formulir yang aksesibel dan mengganti div generik dengan tag semantik.

### Quest (Perunggu)
**Formulir daftar** — ketik kode latihan pertemuan (302 karakter), akurasi ≥ 90%.

### Drill (Perak)
```html
<form>
<label for="nama">Nama:</label>
<input id="nama" type="text" required />
<label for="email">Email:</label>
<input id="email" type="email" />
<input id="setuju" type="checkbox" />
<label for="setuju">Saya setuju</label>
<textarea id="pesan" rows="4"></textarea>
<button type="submit">Kirim</button>
</form>
```

### Juggling (Emas)
Anyam drill P5 dengan drill P4: baris P5 dan P4 diketik bergantian (baris 1 P5, baris 1 P4, baris 2 P5, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Form dengan label, radio, checkbox, select, textarea
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 6 — Mini Project: Merakit Halaman Profil

**Tahap:** HTML · **Tujuan:** Menggabungkan semua materi HTML menjadi satu proyek utuh sebagai bekal UTS.

### Quest (Perunggu)
**Profil utuh** — ketik kode latihan pertemuan (833 karakter), akurasi ≥ 90%.

### Drill (Perak)
```html
<header><h1>Raka Pratama</h1></header>
<nav><a href="#kontak">Kontak</a></nav>
<main>
<section><h2>Tentang</h2><p>Siswa SMA Bahari.</p></section>
<img src="foto.jpg" alt="Foto Raka" width="200" />
</main>
<footer>&copy; 2026 Raka</footer>
<label for="nama">Nama</label>
<input id="nama" type="text" placeholder="Nama" />
```

### Juggling (Emas)
Anyam drill P6 dengan drill P5: baris P6 dan P5 diketik bergantian (baris 1 P6, baris 1 P5, baris 2 P6, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Halaman gabungan P1–P5, lolos checklist pra-UTS
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 7 — Mini Project: Presentasi & Review Sejawat

**Tahap:** HTML · **Tujuan:** Mempresentasikan halaman profil, memberi review kode teman, dan memantapkan HTML sebelum UTS.

### Quest (Perunggu)
**Demo profil & review** — ketik kode latihan pertemuan (289 karakter), akurasi ≥ 90%.

### Drill (Perak)
```html
<nav>
<a href="index.html">Beranda</a>
<a href="#kontak">Kontak</a>
</nav>
<section id="kontak">
<h2>Hubungi Saya</h2>
<label for="email">Email:</label>
<input id="email" type="email" required />
<footer>&copy; 2026 Raka</footer>
```

### Juggling (Emas)
Anyam drill P7 dengan drill P6: baris P7 dan P6 diketik bergantian (baris 1 P7, baris 1 P6, baris 2 P7, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Demo 5 menit + review sejawat, siap UTS
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 8 — Panduan UTS: Halaman HTML + CSS

**Tahap:** UTS · **Tujuan:** Strategi mengerjakan UTS: lingkup, format, dan checklist pengerjaan.

### Quest (Perunggu)
**Halaman HTML + CSS** — ketik kode latihan pertemuan (917 karakter), akurasi ≥ 90%.

### Drill (Perak)
```html
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>UTS Raka</title>
</head>
<body>
<h1>Judul Utama</h1>
<img src="a.png" alt="Gambar A" />
</body>
</html>
```

### Juggling (Emas)
Anyam drill P8 dengan drill P7: baris P8 dan P7 diketik bergantian (baris 1 P8, baris 1 P7, baris 2 P8, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Ujian praktik 40 menit dengan gaya.css eksternal
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 9 — Cara Kerja CSS & Selektor Dasar

**Tahap:** CSS · **Tujuan:** Memahami cascade, tiga cara memasang CSS, dan selektor elemen.

### Quest (Perunggu)
**Gaya dasar** — ketik kode latihan pertemuan (139 karakter), akurasi ≥ 90%.

### Drill (Perak)
```css
body {
color: #eaf6ff;
}
h1, h2, h3 {
color: #ffc247;
}
p {
line-height: 1.6;
}
button {
border-radius: 10px;
}
```

### Juggling (Emas)
Tidak ada pertemuan sebahasa sebelumnya: drill P9 dianyam dengan urutan terbalik dirinya sendiri (baris terakhir ke pertama). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** gaya.css dengan selector elemen, tanpa inline style
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 10 — Class, ID, Warna & Tipografi

**Tahap:** CSS · **Tujuan:** Membedakan class vs id, membaca kode warna, dan mengatur huruf.

### Quest (Perunggu)
**Kartu dengan class/id** — ketik kode latihan pertemuan (190 karakter), akurasi ≥ 90%.

### Drill (Perak)
```css
.kartu {
background: #0c3350;
padding: 16px;
}
#hero {
text-align: center;
}
p.catatan {
color: #9ad7f5;
}
.judul {
font-size: 1.5rem;
font-weight: 700;
}
```

### Juggling (Emas)
Anyam drill P10 dengan drill P9: baris P10 dan P9 diketik bergantian (baris 1 P10, baris 1 P9, baris 2 P10, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Tiga class, satu id, HEX, rem
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 11 — Box Model: Kotak di Balik Semua Hal

**Tahap:** CSS · **Tujuan:** Memahami margin, border, padding, dan ukuran kotak elemen.

### Quest (Perunggu)
**Kartu berpadding** — ketik kode latihan pertemuan (198 karakter), akurasi ≥ 90%.

### Drill (Perak)
```css
* {
box-sizing: border-box;
}
body {
margin: 0;
}
.kartu {
margin: 16px auto;
padding: 20px 24px;
border: 2px solid #2ee6c8;
border-radius: 14px;
}
```

### Juggling (Emas)
Anyam drill P11 dengan drill P10: baris P11 dan P10 diketik bergantian (baris 1 P11, baris 1 P10, baris 2 P11, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** box-sizing, margin: auto, border
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 12 — Layout: Flexbox & Responsif

**Tahap:** CSS · **Tujuan:** Menyusun posisi elemen dengan display:flex, menyesuaikan layout di HP, plus review gabungan dan cicipan DOM sebagai jembatan ke JS.

**Tahap:** CSS · **Tujuan:** Menyusun posisi elemen dengan display:flex dan menyesuaikan layout di HP.

### Quest (Perunggu)
**Navbar flex** — ketik kode latihan pertemuan (264 karakter), akurasi ≥ 90%.

### Drill (Perak)
```css
.bar {
display: flex;
justify-content: space-between;
align-items: center;
gap: 12px;
}
@media (max-width: 600px) {
.bar {
flex-direction: column;
}
}
```

### Juggling (Emas)
Anyam drill P12 dengan drill P11: baris P12 dan P11 diketik bergantian (baris 1 P12, baris 1 P11, baris 2 P12, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Flex + @media, menumpuk di layar 375px
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 13 — Variabel, Tipe Data & Operator

**Tahap:** JS · **Tujuan:** Menyimpan data dengan const/let dan mengenal tipe serta operator.

### Quest (Perunggu)
**Operator & variabel** — ketik kode latihan pertemuan (135 karakter), akurasi ≥ 90%.

### Drill (Perak)
```js
const nama = "Raka";
let skor = 0;
skor = skor + 10;
const pesan = "Halo, " + nama;
console.log(pesan);
console.log(skor);
let total = 4 + 6 * 2;
console.log(total);
```

### Juggling (Emas)
Tidak ada pertemuan sebahasa sebelumnya: drill P13 dianyam dengan urutan terbalik dirinya sendiri (baris terakhir ke pertama). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** const/let, typeof, console.log
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 14 — Logika Percabangan

**Tahap:** JS · **Tujuan:** Membuat keputusan dengan if/else, else if, dan operator logika.

### Quest (Perunggu)
**if/else, &&, ternary** — ketik kode latihan pertemuan (209 karakter), akurasi ≥ 90%.

### Drill (Perak)
```js
if (skor >= 10) {
console.log("Lulus");
} else {
console.log("Coba lagi");
}
if (nama === "Raka" && skor > 0) {
console.log("Halo Raka");
}
const status = skor > 5 ? "Hebat" : "Lanjut";
console.log(status);
```

### Juggling (Emas)
Anyam drill P14 dengan drill P13: baris P14 dan P13 diketik bergantian (baris 1 P14, baris 1 P13, baris 2 P14, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** cekNilai(n) dengan minimal 3 kasus uji
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 15 — Perulangan & Fungsi

**Tahap:** JS · **Tujuan:** Mengulang tugas dengan loop dan membereskan logika dengan fungsi.

### Quest (Perunggu)
**for, while, function** — ketik kode latihan pertemuan (200 karakter), akurasi ≥ 90%.

### Drill (Perak)
```js
for (let i = 1; i <= 5; i++) {
console.log("Baris " + i);
}
let n = 0;
while (n < 3) {
n = n + 1;
}
function sapa(nama) {
return "Halo, " + nama;
}
const jumlah = (a, b) => a + b;
```

### Juggling (Emas)
Anyam drill P15 dengan drill P14: baris P15 dan P14 diketik bergantian (baris 1 P15, baris 1 P14, baris 2 P15, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Angka 1–10, rata-rata, fungsi dipanggil 3×
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

---

## Pertemuan 16 — DOM, Event & Mini App (Gladi UAS)

**Tahap:** UAS · **Tujuan:** Membangun mini app interaktif dari HTML + CSS + JS: memilih elemen, merespons event, dan menguji kasus tepi.

### Quest (Perunggu)
**Counter klik** — ketik kode latihan pertemuan (283 karakter), akurasi ≥ 90%.

### Drill (Perak)
```js
const tombol = document.querySelector("button");
const pesan = document.querySelector("#pesan");
let jumlah = 0;
tombol.addEventListener("click", function () {
jumlah = jumlah + 1;
pesan.textContent = "Diklik " + jumlah + " kali";
});
pesan.classList.toggle("aktif");
```

### Juggling (Emas)
Anyam drill P16 dengan drill P15: baris P16 dan P15 diketik bergantian (baris 1 P16, baris 1 P15, baris 2 P16, …). Akurasi ≥ 85%.

### Tugas mandiri
- **Produk:** Mini app satu berkas: input, tombol, event, uji kasus tepi
- **Kumpulkan:** berkas hasil + tangkapan layar level sesi di Peta Pertemuan.

