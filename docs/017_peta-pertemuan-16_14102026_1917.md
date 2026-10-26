# Peta Pertemuan 16× — Judul, Topik & Gambaran Singkat

> Sumber tunggal: `src/data/curriculum.ts` (`CURRICULUM`). Berkas ini ringkasan baca-cepat;
> bila kurikulum berubah, perbarui `curriculum.ts` dulu lalu selaraskan berkas ini.
> Struktur: HTML 1–5 · Mini project 6–7 · UTS 8 · CSS 9–12 (P12 plus jembatan) · JS 13–15 · UAS 16.

## Tahap HTML (Pertemuan 1–5)

### P1 — Mengenal HTML & Alat Perangnya
- **Topik:** Web bekerja (browser, server, HTML) · berkas pertama & cara membukanya
- **Gambaran:** Memahami peran HTML sebagai bahasa penanda server↔browser, lalu menyiapkan `index.html` pertama dengan teks editor, membukanya di browser, dan me-reload tiap ada perubahan.

### P2 — Anatomi Dokumen HTML
- **Topik:** Empat pilar kerangka · head vs body
- **Gambaran:** Menguasai kerangka wajib (`<!DOCTYPE html>`, `<html lang>`, `<head>`, `<body>`), `meta charset`, dan aturan praktis: yang terlihat pengunjung di `<body>`, info halaman di `<head>`.

### P3 — Teks & Daftar
- **Topik:** Heading, paragraf, penekanan · daftar urut & tak berurut
- **Gambaran:** Menyusun konten bertingkat (`h1`–`h6`, `p`, `strong`, `em`) dan daftar yang benar (`ul`/`ol` + `li`) alih-alih bullet manual.

### P4 — Media & Navigasi
- **Topik:** Gambar (`src`, `alt`, ukuran) · link internal, eksternal, anchor
- **Gambaran:** Menampilkan gambar dengan `alt` yang bermakna dan membuat navigasi tiga arah: situs lain, berkas tetangga, dan lompatan dalam halaman (`#id`).

### P5 — Formulir & Elemen Semantik
- **Topik:** Formulir (`input`, `label`, `button`) · semantik vs `div`
- **Gambaran:** Membangun formulir aksesibel (pasangan `label for`↔`id`, `type`, `required`) dan mengganti `div` generik dengan `header`/`nav`/`main`/`section`/`footer`.

## Mini Project (Pertemuan 6–7)

### P6 — Mini Project: Merakit Halaman Profil
- **Topik:** Menyatukan semua materi HTML · gladi ketik proyek utuh
- **Gambaran:** Merakit halaman profil lengkap (kerangka + teks + daftar + gambar + link + formulir + semantik) dengan pola kerja skeleton→isi→rapikan sebagai bekal UTS.

### P7 — Mini Project: Presentasi & Review Sejawat
- **Topik:** Demo (presentasi halaman) · review sejawat & pemantapan
- **Gambaran:** Mendemokan halaman profil 5 menit (tunjukkan tiap bagian + tag pembentuknya + satu kesulitan), lalu bertukar halaman untuk review sejawat berpedoman checklist pra-UTS.

## UTS (Pertemuan 8)

### P8 — Panduan UTS: Halaman HTML + CSS
- **Topik:** Apa yang diujikan · checklist sebelum submit
- **Gambaran:** Strategi ujian tahap HTML (P1–7) plus CSS awal: format soal konsep + praktik satu halaman, alokasi waktu, dan daftar periksa (tag tertutup, `alt`, `href`, label, titik koma CSS).

## Tahap CSS (Pertemuan 9–12)

### P9 — Cara Kerja CSS & Selektor Dasar
- **Topik:** Cascade (cara kerja CSS) · selektor elemen & grup
- **Gambaran:** Memahami aturan `selector { properti: nilai; }`, tiga cara pemasangan (inline/internal/eksternal via `<link>`), dan selektor tag serta grup koma.

### P10 — Class, ID, Warna & Tipografi
- **Topik:** Class vs ID · warna HEX & tipografi
- **Gambaran:** Membedakan `.class` (berulang) vs `#id` (unik), membaca kode warna HEX, dan mengatur huruf (`font-family/size/weight`, `line-height`, kontras).

### P11 — Box Model: Kotak di Balik Semua Hal
- **Topik:** Empat lapisan kotak · jarak antar elemen
- **Gambaran:** Memahami `content → padding → border → margin`, `box-sizing: border-box`, shorthand, dan margin vertikal yang bertumpuk (collapsing).

### P12 — Layout: Flexbox & Responsif
- **Topik:** Flexbox satu dimensi · responsif dengan media query · review gabungan · cicipan DOM (jembatan)
- **Gambaran:** Menyusun posisi dengan `display: flex` (`justify-content`, `align-items`, `gap`), menyesuaikan layout HP via `meta viewport` + `@media`, mereview campuran HTML+CSS, dan mencicipi `querySelector`/`textContent` sebagai pintu masuk JS.

## Tahap JS (Pertemuan 13–15)

### P13 — Variabel, Tipe Data & Operator
- **Topik:** Variabel (kotak bernama) · operator & `console.log`
- **Gambaran:** Menyimpan data dengan `const`/`let`, mengenal `string`/`number`/`boolean`, operator aritmatika–perbandingan (disiplin `===`), dan template literal.

### P14 — Logika Percabangan
- **Topik:** `if` / `else if` / `else` · operator logika & ternary
- **Gambaran:** Membuat keputusan program bercabang, menggabungkan syarat (`&&`, `||`, `!`), dan bentuk ringkas ternary untuk nilai dua jalur.

### P15 — Perulangan & Fungsi
- **Topik:** `for` & `while` · fungsi (resep yang dipanggil)
- **Gambaran:** Mengulang tugas dengan loop (`break`/`continue`, waspada off-by-one) dan membereskan logika jadi fungsi berparameter dengan `return` (termasuk arrow function).

## UAS (Pertemuan 16)

### P16 — DOM, Event & Mini App (Gladi UAS)
- **Topik:** DOM (jembatan JS↔HTML) · merangkai mini app · lingkup & format UAS · alur 50 menit
- **Gambaran:** Menghubungkan JS dengan halaman (`querySelector`, `addEventListener("click")`, `textContent`) lewat pola counter, lalu strategi UAS: aplikasi mini HTML+CSS+JS satu berkas dengan alur pengerjaan 50 menit dan uji kasus tepi.
