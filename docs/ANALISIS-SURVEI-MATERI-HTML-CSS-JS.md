# Analisis Mendalam dan Survei Materi HTML, CSS, dan JavaScript

> **Proyek:** CodeShark Academy · **Tanggal audit:** 21 Oktober 2026 (UTC)  
> **Basis:** checkout repositori pada cabang `arena/2522a47d-codeshark-qwen3-8max2`, berbasis commit `cb5f7aa`.  
> **Jenis dokumen:** audit materi, survei cakupan kompetensi, dan rekomendasi pengembangan; bukan implementasi perbaikan aplikasi.

## Daftar isi

1. [Ringkasan eksekutif](#1-ringkasan-eksekutif)
2. [Tujuan, metode, dan batasan](#2-tujuan-metode-dan-batasan)
3. [Inventaris dan arsitektur materi](#3-inventaris-dan-arsitektur-materi)
4. [Survei cakupan 16 pertemuan](#4-survei-cakupan-16-pertemuan)
5. [Analisis materi HTML](#5-analisis-materi-html)
6. [Analisis materi CSS](#6-analisis-materi-css)
7. [Analisis materi JavaScript](#7-analisis-materi-javascript)
8. [Evaluasi pedagogi dan asesmen](#8-evaluasi-pedagogi-dan-asesmen)
9. [Audit penyajian Markdown](#9-audit-penyajian-markdown)
10. [Prioritas dan rencana pengembangan](#10-prioritas-dan-rencana-pengembangan)
11. [Rancangan paket materi Markdown](#11-rancangan-paket-materi-markdown)
12. [Contoh proyek integrasi](#12-contoh-proyek-integrasi)
13. [Rancangan survei pengguna](#13-rancangan-survei-pengguna)
14. [Validasi dan kriteria penerimaan](#14-validasi-dan-kriteria-penerimaan)
15. [Sumber dan referensi lanjutan](#15-sumber-dan-referensi-lanjutan)

## 1. Ringkasan eksekutif

CodeShark sudah memiliki jalur pengantar web yang masuk akal: struktur HTML → tampilan CSS → logika JavaScript → DOM dan aplikasi mini. Kekuatan utamanya adalah bahasa Indonesia yang komunikatif, contoh bertema konsisten, latihan ketik berjenjang, serta tujuan per pertemuan yang eksplisit.

Namun, **kelengkapan silabus belum sama dengan kelengkapan bahan ajar Markdown maupun bukti penguasaan kompetensi**. HTML mempunyai enam dokumen `.md`, sedangkan CSS dan JavaScript masih disajikan melalui data slide TypeScript. Ada tujuh pertemuan berfase HTML, sehingga satu pertemuan HTML belum terwakili dalam registri dokumen.

### Temuan utama

| Aspek | Kondisi yang ditemukan | Implikasi |
|---|---|---|
| Struktur kurikulum | 16 pertemuan, 36 slide, 14 blok kuis dalam `CURRICULUM` | Kerangka semester sudah tersedia; jumlah slide bukan ukuran kedalaman |
| Dokumen HTML | Enam berkas, mencakup P1–P6; fase HTML mencakup P1–P7 | Navigasi P7 bisa menunjuk dokumen yang tidak ada |
| Dokumen CSS/JS | Belum ada direktori khusus `content/css` dan `content/js` | Materi kedua bahasa belum setara dengan HTML dalam format `.md` |
| Urutan UTS | P8 menguji HTML + CSS, pengajaran CSS terstruktur baru P9 | Perlu jembatan CSS sebelum UTS atau penyesuaian lingkup ujian |
| Akurasi konsep | Ada penyederhanaan HTML/HTTP, cascade, dan margin | Perlu revisi editorial agar analogi tidak menjadi miskonsepsi |
| Asesmen | Kelulusan sesi berpusat pada penyelesaian dan akurasi ketik | Belum cukup untuk menyimpulkan kemampuan membuat atau men-debug aplikasi |
| Penyajian Markdown | Ada risiko dokumen kosong, isi tabel ditafsirkan sebagai HTML, dan URL tidak difilter | Ketepatan tampilan serta batas kepercayaan konten perlu diperbaiki |
| Beban akhir semester | P15 menggabungkan loop + fungsi; P16 DOM + event + persiapan UAS | Risiko beban kognitif tinggi; perlu latihan bertahap sebelum P16 |

**Rekomendasi utama:** perbaiki jalur materi yang rusak dan keamanan renderer terlebih dahulu; lengkapi dokumen CSS/JS sesudahnya; pertahankan typing sebagai latihan kelancaran sintaks, tetapi pisahkan dari penilaian kompetensi pemrograman.

## 2. Tujuan, metode, dan batasan

### 2.1 Tujuan

- Memetakan materi HTML, CSS, dan JavaScript yang benar-benar tersedia.
- Menilai kesesuaian tujuan, penjelasan, contoh, latihan, dan ujian.
- Mengidentifikasi kesalahan konsep, materi yang hanya disebut sekilas, dan celah penting.
- Memberikan rancangan bahan ajar `.md` yang dapat ditindaklanjuti tanpa mengubah struktur 16 pertemuan secara sembarangan.

### 2.2 Metode

1. Inventaris berkas `content/`, `src/data/`, komponen materi, dan dokumentasi kurikulum.
2. Pembacaan enam dokumen HTML serta data kurikulum, modul ringkas, dan pembangkit sesi latihan.
3. Penelusuran alur `App` → `Pertemuan`/`MateriHtml` → registri dokumen → parser Markdown.
4. Eksekusi modul kurikulum dan parser menggunakan Node.js v22.22.3 dengan `--experimental-strip-types` melalui salinan sementara di luar repositori.
5. Penyusunan matriks kompetensi dan prioritas berdasarkan dampak pembelajaran serta risiko teknis.

**Arti “survei” dalam laporan ini:** survei isi dan cakupan bahan ajar berbasis repositori. Belum ada survei responden, wawancara guru, pengujian kelas, atau pengumpulan data pengguna. Instrumen survei lapangan disediakan pada bagian 13 sebagai usulan, bukan hasil penelitian.

### 2.3 Batasan dan label bukti

- **Teramati:** terlihat langsung pada berkas atau keluaran pemeriksaan lokal.
- **Inferensi:** konsekuensi yang diturunkan dari alur kode; belum diuji di browser jika tidak dinyatakan sebaliknya.
- **Rekomendasi:** rancangan perbaikan; bukan fitur atau materi yang sudah tersedia.
- Referensi web di bagian akhir adalah rujukan lanjutan. Halaman eksternal tersebut tidak diambil atau diverifikasi secara langsung dalam audit ini.
- Tidak dilakukan build penuh, instalasi dependensi, uji lint proyek, audit seluruh fitur backend, atau pengujian aksesibilitas dengan pembaca layar.
- Temuan keamanan adalah hasil inspeksi dan reproduksi keluaran parser; bukan bukti adanya eksploitasi pada deployment.

## 3. Inventaris dan arsitektur materi

### 3.1 Sumber materi yang aktif

| Sumber | Fungsi | Status |
|---|---|---|
| [`content/html/`](../content/html/) | Materi naratif HTML per pertemuan | Enam dokumen |
| [`src/data/materiHtml.ts`](../src/data/materiHtml.ts) | Import `.md?raw`, judul, dan pemetaan nomor | Hanya P1–P6 |
| [`src/data/curriculum.ts`](../src/data/curriculum.ts) | Tujuan, slide, contoh, kuis, dan kode quest | 16 pertemuan |
| [`src/data/modules.ts`](../src/data/modules.ts) | Modul ringkas HTML/CSS/JS, kode misi, preview | Jalur materi lain yang perlu diselaraskan |
| [`src/data/quests.ts`](../src/data/quests.ts) | Quest, drill, juggling, dan tugas mandiri | Tiga jenis sesi per pertemuan |
| [`src/ui/MateriHtml.tsx`](../src/ui/MateriHtml.tsx) | Pembaca dokumen dan kartu praktik | Spesifik HTML |
| [`src/ui/Pertemuan.tsx`](../src/ui/Pertemuan.tsx) | Pembaca slide pertemuan dan navigasi sesi | Memiliki tombol dokumen untuk fase HTML |
| [`src/lib/markdown.ts`](../src/lib/markdown.ts) | Parser Markdown subset buatan sendiri | Bukan parser CommonMark lengkap |
| [`PETA-PERTEMUAN-16.md`](../PETA-PERTEMUAN-16.md) | Ringkasan peta belajar | Mengacu pada kurikulum TypeScript |
| [`KURIKULUM-QUEST-16-PERTEMUAN.md`](../KURIKULUM-QUEST-16-PERTEMUAN.md) | Dokumentasi sesi dan tugas | Harus mengikuti perubahan data sumber |

Dokumen backend dan cross-platform memang ada, tetapi tidak dihitung sebagai dokumen khusus jalur web HTML/CSS/JS. Keberadaan materi ES6 pada jalur cross-platform tidak otomatis menutup kebutuhan JS pemula di jalur ini.

### 3.2 Ukuran enam dokumen HTML

Penghitungan baris mengabaikan newline penutup. “Token spasi” dihitung dengan pemisahan whitespace, termasuk kode dan tabel; bukan jumlah kata naratif atau ukuran mutu.

| Dokumen | Baris | Token spasi | Blok kode | Placeholder ilustrasi |
|---|---:|---:|---:|---:|
| `01-mengenal-html.md` | 44 | 333 | 1 | 2 |
| `02-anatomi-dokumen.md` | 48 | 262 | 2 | 1 |
| `03-teks-dan-daftar.md` | 52 | 261 | 2 | 2 |
| `04-media-navigasi.md` | 42 | 265 | 2 | 1 |
| `05-formulir-semantik.md` | 56 | 298 | 2 | 1 |
| `06-mini-project-gladi-uts.md` | 37 | 237 | 1 | 1 |
| **Total** | **279** | **1.656** | **10** | **8** |

Materi cukup ringkas untuk pengantar, tetapi belum memuat banyak variasi kasus, contoh salah, tantangan mandiri, dan rubrik. Menambah panjang semata tidak menyelesaikan masalah; tambahan harus mengisi kebutuhan belajar yang spesifik.

### 3.3 Distribusi pertemuan

Hasil evaluasi `CURRICULUM`:

```text
Nomor: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
Fase: HTML=7, UTS=1, CSS=4, JS=3, UAS=1
Slide=36
Blok kuis=14
Pertemuan HTML tanpa dokumen terdaftar: 7
```

P16 berfase `UAS`, tetapi isinya memuat DOM dan event JavaScript. Karena itu, angka `JS=3` tidak berarti DOM tidak diajarkan. Pertemuan evaluasi dan proyek juga tidak dapat diperlakukan sebagai durasi belajar efektif yang sama dengan satu pertemuan teori.

### 3.4 Duplikasi sumber dan tata kelola

Penjelasan konsep yang serupa muncul pada dokumen HTML, `curriculum.ts`, dan `modules.ts`. Contohnya, penyederhanaan HTML sebagai bahasa komunikasi browser–server muncul pada dokumen P1 dan slide P1.

**Risiko:** memperbaiki satu sumber saja menyisakan versi lama pada layar lain.

**Usulan pembagian tanggung jawab:**

- `.md`: penjelasan lengkap, contoh, latihan, rangkuman, referensi.
- `curriculum.ts`: metadata nomor, fase, tujuan terukur, ringkasan, tautan materi.
- `quests.ts`: data latihan sintaks dan ambang kelulusan mekanis.
- `modules.ts`: ringkasan orientasi; hindari menyalin seluruh penjelasan panjang.
- Tes konsistensi: setiap nomor wajib mempunyai materi, target praktik, dan tujuan yang sesuai.

## 4. Survei cakupan 16 pertemuan

**Legenda:** “Ada” berarti terlihat pada sumber; “perlu penguatan” tidak selalu berarti sama sekali tidak disebut.

| P | Materi utama | Representasi sekarang | Celah dan tindak lanjut |
|---|---|---|---|
| 1 | HTML, alat, alur web | Slide + MD | Bedakan HTML sebagai dokumen dari HTTP sebagai protokol; beri contoh hasil render |
| 2 | Anatomi dokumen | Slide + MD | Perkenalkan viewport lebih awal; jelaskan doctype, elemen void, dan tag opsional secara proporsional |
| 3 | Teks dan daftar | Slide + MD | Tegaskan heading untuk struktur, bukan ukuran; lunakkan klaim SEO yang deterministik |
| 4 | Media dan navigasi | Slide + MD | Tambahkan alt dekoratif, path relatif bertingkat, ukuran gambar dan keamanan tautan |
| 5 | Form dan semantik | Slide + MD | Tambahkan `name`, alur submit, pengelompokan field, serta batas validasi browser |
| 6 | Proyek profil | Slide + MD | Contoh MD masih potongan body; tambah proyek lengkap dan rubrik |
| 7 | Presentasi dan review | Slide; MD tidak tersedia | Buat dokumen review sejawat dan pastikan navigasi tidak mengakses dokumen kosong |
| 8 | UTS HTML + CSS | Slide dan quest | Selaraskan cakupan dengan prasyarat CSS sebelum ujian |
| 9 | CSS dan selektor | Slide + modul CSS ringkas | Tambah contoh cascade dengan konflik aturan; sediakan MD |
| 10 | Class, ID, warna, tipografi | Slide + modul CSS ringkas | Tambah specificity dan pengukuran kontras, bukan hanya penilaian subjektif |
| 11 | Box model | Slide | Koreksi auto margin dan batas margin collapse; tambah soal perhitungan |
| 12 | Flexbox, responsif, jembatan DOM | Slide | Perbaiki kesesuaian narasi dengan quest; demonstrasikan perubahan sumbu flex |
| 13 | Variabel, tipe, operator | Slide + modul JS ringkas | Tambah konversi nilai input, scope dasar, dan hasil eksekusi |
| 14 | Percabangan | Slide | Tambah tabel uji batas dan validasi nilai; luruskan konteks operator logika |
| 15 | Loop dan fungsi | Slide | Array hanya pengantar; pecah latihan menjadi bagian kecil dengan trace |
| 16 | DOM, event, mini app, UAS | Slide gabungan | Jadikan integrasi, bukan perkenalan semua konsep DOM; tambah aplikasi runnable dan pengujian |

**Kesimpulan cakupan:** jalur ini layak diposisikan sebagai pengantar web dasar. Belum cukup untuk diklaim sebagai kurikulum front-end lengkap yang meliputi arsitektur aplikasi, pengambilan data asinkron, pengujian otomatis, dan deployment proyek secara mendalam.

## 5. Analisis materi HTML

### 5.1 Kekuatan

- Menjelaskan HTML sebagai markup, bukan bahasa pemrograman.
- Menghubungkan teori dengan aktivitas nyata: membuat berkas, menyimpan, membuka, dan reload.
- Memperkenalkan `lang`, charset, heading, daftar, navigasi, dan semantik.
- Mendorong pasangan `label for` dan `id`, atribut `alt`, serta penggunaan validator.
- Tema profil dan dunia laut menjaga konsistensi konteks.

### 5.2 Koreksi konsep dan redaksi

| Redaksi/kondisi sekarang | Masalah | Redaksi atau pendekatan yang disarankan |
|---|---|---|
| HTML sebagai bahasa server dan browser untuk “saling bicara” | Mencampur format dokumen dengan protokol komunikasi | Browser meminta resource menggunakan HTTP/HTTPS; HTML menandai struktur dan makna konten yang diterima |
| Satu halaman web = satu berkas HTML | Baik sebagai model proyek statis, terlalu mutlak untuk web dinamis | Dalam latihan awal, satu halaman dibuat sebagai satu berkas; aplikasi nyata dapat membangkitkan konten secara dinamis |
| HTML/CSS/JS “selalu bekerja bersama” | Tidak semua halaman membutuhkan CSS atau JS | Ketiganya sering dipakai bersama; HTML sederhana dapat ditampilkan tanpa CSS atau JS |
| Empat pilar digambarkan seolah semuanya tag yang ditutup | Doctype bukan elemen; beberapa end tag HTML boleh dihilangkan pada kondisi tertentu | Ajarkan bentuk eksplisit untuk pemula, tetapi bedakan deklarasi, elemen biasa, dan elemen void |
| “Gunakan SATU h1” sebagai aturan mutlak | Rekomendasi struktur disamakan dengan aturan validitas universal | Gunakan satu judul utama yang jelas sebagai konvensi kursus; pertahankan hierarki heading yang masuk akal |
| Heading acak berarti halaman sulit ditemukan | Menyederhanakan hubungan heading dan SEO menjadi jaminan sebab-akibat | Heading membantu pemahaman struktur oleh pengguna dan mesin; peringkat pencarian dipengaruhi banyak faktor |
| Semua gambar seolah harus mempunyai alt deskriptif | Gambar dekoratif tidak memerlukan narasi yang mengganggu | Gambar informatif: alt sesuai fungsi; dekoratif: `alt=""` |
| Contoh form tidak memakai `name` | `id` untuk identitas DOM/label tidak menggantikan nama field saat submit | Tunjukkan `id` dan `name`, lalu jelaskan peran masing-masing |

### 5.3 Materi yang perlu ditambahkan

**Prioritas dasar:**

1. Path relatif: `./`, `../`, perbedaan folder halaman dan folder aset.
2. Elemen void (`img`, `input`, `meta`, `br`) tidak mempunyai end tag; garis miring akhir bukan kewajiban sintaks HTML.
3. Entitas karakter untuk menampilkan `<`, `>`, dan `&` sebagai teks.
4. Tombol aksi memakai `<button>`, navigasi memakai `<a>`.
5. Form: `name`, `value`, `method`, dan `action` pada tingkat pengantar.
6. `fieldset` dan `legend` untuk kelompok pilihan; label tetap dibutuhkan meski ada placeholder.
7. Navigasi keyboard dan indikator fokus.
8. Validasi HTML membantu pengguna, tetapi validasi server tetap diperlukan saat data dikirim ke backend.

**Pengayaan, bukan syarat awal:** tabel data dengan `caption`/`th`, `figure`/`figcaption`, media audio/video, serta gambar responsif. Jangan memakai tabel untuk tata letak.

### 5.4 Aktivitas yang menguji pemahaman

- Perbaiki tiga kesalahan: `href` keliru, `for` tidak cocok dengan `id`, dan gambar informatif tanpa alt.
- Pilih `ul` atau `ol` berdasarkan makna, lalu jelaskan alasan.
- Ubah sekumpulan `div` menjadi landmark semantik tanpa mengubah konten.
- Buka halaman dengan keyboard; temukan kontrol yang tidak dapat dioperasikan.
- Buat ulang profil dengan data sendiri tanpa menyalin contoh utuh.

**Kriteria lulus yang disarankan:** struktur dapat dijelaskan; tautan dan gambar berfungsi; field memiliki label; hasil pemeriksaan validitas ditindaklanjuti. Akurasi mengetik tetap dicatat terpisah.

## 6. Analisis materi CSS

### 6.1 Kekuatan

Urutan selektor → class/ID → warna dan tipografi → box model → Flexbox/responsif sudah logis. Materi mengenalkan stylesheet eksternal, `border-box`, unit `rem`, viewport, media query, dan `gap`.

### 6.2 Titik koreksi penting

**A. Cascade terlalu disederhanakan.**

Slide P9 menjelaskan aturan yang lebih spesifik atau lebih akhir sebagai pemenang. Ini berguna pada kasus sederhana, tetapi belum menjelaskan konteksnya. Untuk pemula, batasi contoh pada deklarasi author normal dalam konteks yang sama, kemudian ajarkan specificity dan urutan sumber. Setelah itu beri catatan bahwa origin, importance, dan layer ikut memengaruhi cascade.

**B. Pemusatan dengan auto margin keliru secara konseptual.**

P11 menyatakan `margin: 16px auto` membuat elemen melebar penuh lalu terpusat. Auto margin mendistribusikan ruang horizontal yang tersedia; pada blok biasa yang sudah memenuhi lebar wadah, efek pemusatan sering tidak terlihat. Gunakan contoh dengan batas lebar:

```css
.kartu {
  width: min(100% - 2rem, 40rem);
  margin: 1rem auto;
  padding: 1rem;
  box-sizing: border-box;
}
```

**C. Margin collapse terlalu digeneralisasi.**

Tidak semua margin vertikal bersebelahan runtuh. Jelaskan contoh blok dalam normal flow dan bedakan dengan flex/grid. Rumus sederhana “ambil yang terbesar” hanya aman untuk kasus margin positif yang sedang dicontohkan, bukan semua kombinasi nilai.

**D. Sumbu Flexbox perlu dibuat eksplisit.**

`justify-content` mengikuti main axis dan `align-items` mengikuti cross axis. Saat `flex-direction: column`, main axis bukan lagi horizontal. Tambahkan latihan prediksi susunan sebelum mengubah kode.

**E. Narasi dan kode quest P12 tidak selaras.**

Slide review menyebut latihan ketik P12 mencampur HTML dan CSS serta berpindah dari `<style>`. Akan tetapi `practice.code` P12 berupa aturan CSS saja. Pilih salah satu: ubah narasi menjadi latihan CSS, atau siapkan quest gabungan beserta bahasa dan preview yang sesuai.

### 6.3 Celah dasar versus pengayaan

| Kompetensi | Penguatan yang dibutuhkan | Prioritas |
|---|---|---|
| Specificity | Bandingkan tag, class, ID dengan output yang dapat diprediksi | Wajib dasar |
| Inheritance | Bandingkan properti diwariskan seperti `color` dengan `margin` | Wajib dasar |
| Display dan flow | Bedakan block, inline, dan flex melalui contoh | Wajib dasar |
| Responsif | Mobile-first, lebar fleksibel, gambar tidak overflow | Wajib dasar |
| State kontrol | `:hover`, `:focus-visible`, fokus tidak dihapus sembarangan | Wajib dasar |
| Debugging | Panel Styles, Computed, dan overlay box model DevTools | Wajib dasar |
| CSS Grid | Tata letak dua dimensi sederhana | Pengayaan setelah Flexbox |
| Custom properties | Token warna dan jarak yang konsisten | Pengayaan |
| Animasi | Gerakan sederhana dan preferensi reduced motion | Pengayaan |

### 6.4 Praktik yang disarankan

- Prediksi deklarasi warna yang menang dan jelaskan alasan.
- Hitung ukuran kotak: `width: 200px`, padding 20px, border 2px menghasilkan border-box 244px pada `content-box`, tetapi tetap 200px pada `border-box`.
- Perbaiki kartu yang overflow tanpa menyembunyikan masalah dengan `overflow-x: hidden`.
- Uji layout pada lebar usulan 360px, 768px, dan 1280px; ukuran ini target pengujian, bukan hasil uji yang sudah dilakukan.
- Pastikan kontrol tetap mempunyai indikator fokus dan konten tetap dapat digunakan ketika diperbesar.

## 7. Analisis materi JavaScript

### 7.1 Kekuatan

- Mendahulukan `const` dan `let`, serta menganjurkan `===`.
- Menghubungkan variabel dengan perhitungan konkret.
- Memperkenalkan percabangan, loop, parameter, `return`, dan event listener.
- Membedakan `return` dari `console.log`.
- Menyebut penempatan script dengan `defer` atau setelah elemen HTML tersedia.
- Memakai `textContent` untuk output teks pada contoh DOM.

### 7.2 Kekurangan dan implikasinya

| Area | Kondisi teramati | Dampak pembelajaran | Penguatan |
|---|---|---|---|
| Konversi input | Belum menjadi latihan inti yang runtut | Penjumlahan input bisa menjadi konkatenasi string | `.value`, `Number`, string kosong, `Number.isFinite` |
| Array/objek | Array disebut pada pengantar loop; objek belum menjadi unit inti | Proyek daftar tugas lebih rumit daripada persiapan yang diberikan | Array item dan objek sederhana sebelum proyek berbasis koleksi |
| Scope | Belum dijabarkan sebagai bahasan mandiri | Sulit memahami variabel handler dan nilai yang berubah | Block scope dan contoh variabel lokal |
| Operator logika | Penjelasan berfokus boolean | Siswa dapat mengira `&&`/`||` selalu mengembalikan boolean | Sebut bahwa operator mengembalikan operand; gunakan boolean dulu pada latihan dasar |
| DOM | Pemilihan elemen dan event dasar tersedia | Selector yang gagal dapat menimbulkan error saat dipakai | `querySelector` dapat menghasilkan `null`; beri latihan selector salah |
| Form event | Counter klik dominan | Perilaku Enter/submit dan reload form belum terlatih | Event `submit` serta `preventDefault` |
| Debugging | Anjuran membaca Console ada | Belum menjadi prosedur yang dapat diikuti | Reproduksi → baca pesan → isolasi → perbaiki → uji ulang |
| Proyek integrasi | Quest P16 berupa JavaScript counter | Belum membuktikan kemampuan merakit HTML/CSS/JS sendiri | Tugas mandiri runnable dan rubrik fungsional |

### 7.3 Prinsip pengajaran yang disarankan

1. **Prediksi sebelum eksekusi.** Tulis output yang diperkirakan, jalankan, lalu jelaskan perbedaannya.
2. **Trace state.** Tabel nilai `i` dan `total` lebih berguna daripada menghafal bentuk `for`.
3. **Pisahkan sintaks dari perilaku.** Program yang valid secara sintaks belum tentu benar secara logika.
4. **Uji batas, bukan hanya jalur sukses.** Untuk nilai 0–100, uji kosong, 0, batas kelulusan, 100, negatif, dan lebih dari 100.
5. **Perkenalkan fungsi dengan satu tugas.** Bedakan fungsi penghitung dari fungsi yang menulis ke DOM.
6. **Jangan menjadikan hafalan counter sebagai kompetensi akhir.** Minta siswa mengubah kebutuhan: tambah reset, baca input, atau ubah aturan penilaian.

### 7.4 Batas lingkup yang realistis

`fetch`, Promise, `async/await`, module JavaScript, dan penyimpanan lokal baik untuk lanjutan. Tidak semuanya harus dimasukkan ke semester dasar yang sudah padat. Array/objek menjadi prasyarat bila proyek akhir wajib berupa daftar tugas; konverter nilai atau kalkulator sederhana membutuhkan prasyarat yang lebih ringan.

## 8. Evaluasi pedagogi dan asesmen

### 8.1 Typing membantu kelancaran, bukan bukti tunggal pemahaman

`quests.ts` menetapkan target akurasi 90% untuk quest dan drill, serta 85% untuk juggling. `progress.ts` menetapkan sesi lulus bila percobaan selesai dengan status menang dan akurasi memenuhi ambang. Pertemuan berikutnya terbuka setelah level Perak pada pertemuan sebelumnya.

Ini cocok untuk latihan simbol dan konsistensi sintaks. Namun, siswa bisa menyalin kode dengan akurat tanpa memahami hasilnya. Sebaliknya, siswa yang paham konsep bisa terhambat motorik, perangkat, atau kecepatan mengetik.

**Usulan dua jalur penilaian:**

- **Kelancaran sintaks:** akurasi, pola kesalahan, dan peningkatan pribadi.
- **Kompetensi web:** menjelaskan, memodifikasi, men-debug, membuat produk, dan menguji kasus batas.

WPM tidak sebaiknya menjadi penentu utama nilai konsep. Sediakan alternatif latihan tanpa batas waktu atau penyusunan blok bila diperlukan, lalu nilai hasil konseptual dengan standar yang setara.

### 8.2 Juggling tidak sama dengan program yang dapat dijalankan

`interleave` menganyam baris drill sekarang dan sebelumnya. Urutan hasil adalah stimulus latihan, bukan jaminan dokumen HTML, CSS, atau program JS yang valid. Dengan demikian:

- Beri label “latihan baris sintaks, bukan program utuh”.
- Hindari menganggap error preview juggling sebagai kesalahan pemahaman siswa.
- Contoh runnable perlu disediakan terpisah.

Istilah spaced review pada komentar kode menjelaskan niat desain. Efektivitas terhadap retensi belum dapat disimpulkan tanpa data kelas dan pengujian tertunda.

### 8.3 UTS dan UAS

**UTS:** P8 meminta CSS dasar, tetapi tahap CSS dimulai P9. Pilihan perbaikan:

1. Tambahkan mini-unit CSS sebelum UTS pada P6/P7, nyatakan kompetensinya, lalu batasi soal pada yang sudah dilatih; atau
2. Jadikan UTS berfokus HTML dan pindahkan bobot CSS ke asesmen berikutnya.

**UAS:** jangan menempatkan konsep DOM yang benar-benar baru bersamaan dengan ujian berisiko tinggi. P12 sudah menyediakan cicipan DOM; lanjutkan dengan latihan kecil di P13–P15 agar P16 menjadi integrasi dan review. Jika P16 adalah gladi, jelaskan kapan ujian formal dan pengumpulan berlangsung tanpa menambah nomor pertemuan implisit.

### 8.4 Rubrik proyek usulan

Rubrik berikut adalah rekomendasi, bukan aturan nilai aplikasi saat ini.

| Komponen | Bobot | Bukti |
|---|---:|---|
| Struktur HTML dan aksesibilitas | 25% | Landmark, label, heading, navigasi keyboard |
| CSS dan responsivitas | 20% | Layout terbaca dan tidak overflow pada ukuran uji |
| Logika JavaScript | 25% | Perhitungan, kondisi, fungsi, dan event sesuai kebutuhan |
| Pengujian dan debugging | 20% | Catatan kasus uji beserta hasil aktual |
| Penjelasan dan kerapian | 10% | Siswa menjelaskan keputusan dan struktur kode |
| **Total** | **100%** | Akurasi ketik dilaporkan terpisah |

## 9. Audit penyajian Markdown

### 9.1 Ketidaksesuaian P7 dan registri dokumen — prioritas tinggi

**Bukti:**

- `CURRICULUM` mempunyai fase HTML untuk P1–P7.
- `HTML_DOCS` hanya berisi nomor 1–6.
- `Pertemuan.tsx` menawarkan dokumen MD untuk semua pertemuan fase HTML.
- `MateriHtml.tsx` membangun daftar nomor dari fase HTML, lalu mengambil `getHtmlDoc(no)!` dan membaca `doc.source`.

**Inferensi:** membuka materi P7 dari layar pertemuan, atau melanjutkan dari P6 ke P7, dapat menghasilkan error ketika `doc` bernilai `undefined`. Non-null assertion `!` hanya memengaruhi TypeScript, bukan melindungi runtime. Audit ini memverifikasi ketidaksesuaian data dan alur kode; belum menjalankan reproduksi antarmuka browser.

**Perbaikan yang disarankan:** tambahkan dokumen P7; jangan gunakan assertion sebagai guard; bangun navigasi dari dokumen yang tersedia; tampilkan fallback untuk nomor yang tidak ditemukan; hitung total dari metadata, bukan angka `/6` yang ditulis manual.

### 9.2 Tabel melewati pemrosesan inline — prioritas tinggi

`parseMd` menyimpan sel tabel sebagai teks mentah. Renderer tabel pada `MateriHtml.tsx` mengirimkannya ke `dangerouslySetInnerHTML` tanpa `mdInline`/escaping yang konsisten.

Reproduksi lokal:

```text
Input sel: `<nav>`
Hasil parser: teks sel masih berisi backtick dan tag mentah
Renderer: teks tersebut dipasang sebagai HTML
```

**Dampak:** tag contoh seperti `<nav>` atau `<html lang="id">` dapat diperlakukan sebagai elemen HTML, bukan ditampilkan sebagai kode. Tabel yang sudah ada pada dokumen P2 dan P5 memakai pola ini. Ada pula risiko injeksi jika sumber materi kelak tidak sepenuhnya tepercaya.

**Usulan:** gunakan renderer inline yang sama untuk seluruh sel dan header, dengan escaping serta sanitasi yang sesuai. Uji bahwa teks tag terlihat persis dan tidak menciptakan elemen DOM yang tidak dimaksudkan.

### 9.3 Interpolasi atribut dan URL — prioritas tinggi untuk pengerasan

`mdInline` meng-escape `&`, `<`, dan `>`, tetapi tidak meng-escape kutip ketika URL dan alt dimasukkan ke atribut HTML. Protokol URL juga belum dibatasi.

Reproduksi aman pada keluaran parser:

```text
Input: [contoh](https://example.invalid/" data-audit="yes)
Keluaran: elemen tautan dengan atribut tambahan data-audit="yes"

Input: [contoh](javascript:alert)
Keluaran: href tetap diawali javascript:
```

Keluaran ini membuktikan batas escaping dan validasi, bukan membuktikan payload sudah dieksekusi di browser. Materi saat ini diimpor dari repositori saat build; tingkat eksposur berbeda jika nanti materi berasal dari CMS, unggahan guru, atau input siswa.

**Usulan:** pilih renderer berbasis elemen React atau parser yang terawat; validasi protokol URL; escape konteks atribut; sanitasi HTML bila HTML mentah diizinkan. Pertahankan `rel="noopener noreferrer"` pada tautan eksternal. Hardening jangan dianggap selesai hanya dengan mengganti pustaka.

### 9.4 Hierarki heading — prioritas menengah

Renderer mengubah level heading menjadi `level + 2`. Subbab `##` menjadi `<h4>`, sedangkan judul dokumen tampil sebagai `<h1>`. Hal ini membuat level heading melompat.

**Usulan:** petakan subbab utama ke `<h2>` dan pertahankan struktur semantik. Ukuran visual diatur dengan CSS, bukan dengan menaikkan angka heading.

### 9.5 Batas subset Markdown

Parser mendukung heading sampai level empat, paragraf, list sederhana, fenced code, kutipan, tabel pipe, gambar, dan placeholder ilustrasi. Namun:

- List bersarang tidak membentuk hierarki bertingkat yang sebenarnya.
- Sel tabel dipisah memakai karakter `|`; karakter pipe dalam contoh kode berpotensi memecah kolom.
- Inline code diproses dengan rangkaian regex; karakter `*` di dalam kode berpotensi terpengaruh pemrosesan emphasis berikutnya.
- Task list, front matter, dan sintaks Markdown tingkat lanjut tidak boleh diasumsikan didukung.

Berkas laporan ini ditujukan untuk pembaca Markdown repositori dan tidak didaftarkan sebagai materi dalam aplikasi. Sebelum template baru diintegrasikan, uji pada renderer aplikasi, bukan hanya preview editor.

## 10. Prioritas dan rencana pengembangan

| ID | Prioritas | Pekerjaan | Kriteria selesai |
|---|---|---|---|
| R1 | P0 | Tutup mismatch P7 dan guard dokumen kosong | Semua tombol materi membuka dokumen atau fallback yang jelas; tidak crash |
| R2 | P0 | Perbaiki escaping tabel serta atribut/URL | Tag kode tampil sebagai teks; URL terlarang ditolak; atribut tidak dapat disisipkan |
| R3 | P1 | Selaraskan prasyarat CSS dan UTS | Setiap kompetensi yang diuji sudah mempunyai latihan sebelum P8 |
| R4 | P1 | Koreksi HTML/HTTP, margin, cascade, dan narasi P12 | Semua sumber penjelasan terkait diperbarui konsisten |
| R5 | P1 | Lengkapi dokumen CSS P9–P12 dan JS P13–P16 | Delapan dokumen baru terhubung metadata dan dapat dibaca |
| R6 | P1 | Tambahkan praktik modifikasi/debugging | Setiap unit mempunyai minimal satu bukti pemahaman selain penyalinan |
| R7 | P2 | Tambahkan rubrik, keluaran contoh, dan kasus uji | Produk dapat dinilai dengan indikator terukur |
| R8 | P2 | Perbaiki heading dan aksesibilitas pembaca | Hierarki heading teratur; navigasi keyboard dan fokus diuji |
| R9 | P2 | Tambahkan tes konsistensi sumber | Nomor, materi, tujuan, sesi, dan bahasa preview tervalidasi |
| R10 | P3 | Materi pengayaan Grid, API, dan storage | Diletakkan sesudah kompetensi inti, bukan menggusur prasyarat |

P0 berarti masalah yang perlu ditangani sebelum memperluas distribusi materi, bukan pernyataan bahwa insiden produksi telah terjadi.

### Tahapan implementasi usulan

1. **Stabilisasi:** R1 dan R2, diikuti tes regresi.
2. **Penyelarasan editorial:** R3 dan R4 pada MD, slide, serta ringkasan modul.
3. **Pengembangan isi:** R5, R6, dan R7; utamakan alur proyek yang bertahap.
4. **Validasi pengguna:** R8 dan survei lapangan, lalu iterasi berdasarkan hasil.
5. **Keberlanjutan:** R9 dan pengayaan R10 setelah kebutuhan inti terpenuhi.

Tidak diberikan estimasi waktu pasti karena kapasitas penulis, reviewer, dan jadwal pengajaran belum diketahui.

## 11. Rancangan paket materi Markdown

Struktur berikut adalah **usulan**, bukan daftar berkas yang sudah dibuat:

```text
content/
  html/
    01-mengenal-html.md
    02-anatomi-dokumen.md
    03-teks-dan-daftar.md
    04-media-navigasi.md
    05-formulir-semantik.md
    06-mini-project-gladi-uts.md
    07-presentasi-review-sejawat.md          [baru]
  assessment/
    08-panduan-uts-html-css.md              [baru]
  css/
    09-cara-kerja-css-selektor.md           [baru]
    10-class-id-warna-tipografi.md          [baru]
    11-box-model-spacing.md                [baru]
    12-flexbox-responsif.md                 [baru]
  js/
    13-variabel-tipe-operator.md            [baru]
    14-percabangan-validasi.md              [baru]
    15-perulangan-fungsi.md                 [baru]
    16-dom-event-mini-app-uas.md            [baru]
```

Targetnya satu dokumen utama per pertemuan: enam tersedia, sepuluh tambahan diusulkan. Delapan tambahan berfokus CSS/JS, satu review HTML, dan satu panduan UTS. Integrasi memerlukan registri umum; menambah berkas di folder saja tidak membuatnya muncul di aplikasi.

### Template penulisan per unit

1. Judul, nomor pertemuan, dan prasyarat.
2. Dua sampai empat tujuan terukur: “membuat”, “membedakan”, “menguji”; hindari hanya “memahami”.
3. Model mental singkat dan batas penyederhanaannya.
4. Contoh minimal dengan nama berkas dan lokasi kode yang jelas.
5. Hasil yang diharapkan, berupa output konsol atau deskripsi perilaku.
6. Penjelasan bagian penting, bukan parafrasa setiap karakter.
7. Contoh salah dan prosedur debugging.
8. Latihan bertingkat: meniru → memodifikasi → membuat mandiri.
9. Cek pemahaman tanpa jawaban langsung di baris yang sama.
10. Kasus uji, kriteria keberhasilan, dan rubrik ringkas.
11. Rangkuman dan referensi.

Untuk renderer saat ini, gunakan heading `#` sampai `####`, list satu tingkat, dan tabel sederhana. Front matter atau elemen interaktif baru harus didukung terlebih dahulu, bukan diasumsikan tersedia.

### Metadata yang disarankan

Simpan `no`, `phase`, `title`, `prerequisites`, `objectives`, dan referensi dokumen pada registri bertipe. Estimasi durasi boleh ditambahkan setelah diuji pada kelas. Gunakan nomor unik agar tautan dokumen tidak bergantung pada posisi array atau nama fase semata.

## 12. Contoh proyek integrasi

**Usulan proyek:** konverter nilai. Alurnya menyatukan form berlabel, CSS responsif, konversi angka, fungsi, percabangan, event submit, dan output teks.

Contoh berikut adalah bahan ajar usulan; belum dijalankan sebagai halaman browser dalam audit ini. Simpan sebagai `index.html` untuk pengujian mandiri.

```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Konverter Nilai</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: sans-serif; line-height: 1.6; }
    main { width: min(100% - 2rem, 36rem); margin: 2rem auto; }
    form { display: flex; flex-direction: column; gap: 0.75rem; }
    input, button { font: inherit; padding: 0.75rem; }
    :focus-visible { outline: 3px solid #005fcc; outline-offset: 3px; }
  </style>
</head>
<body>
  <main>
    <h1>Konverter Nilai</h1>
    <form id="form-nilai">
      <label for="nilai">Nilai 0 sampai 100</label>
      <input id="nilai" name="nilai" type="number"
             min="0" max="100" step="1" required>
      <button type="submit">Hitung grade</button>
    </form>
    <p id="hasil" role="status">Hasil akan muncul di sini.</p>
  </main>
  <script>
    const form = document.querySelector("#form-nilai");
    const input = document.querySelector("#nilai");
    const hasil = document.querySelector("#hasil");

    function grade(nilai) {
      if (nilai >= 90) return "A";
      if (nilai >= 75) return "B";
      if (nilai >= 60) return "C";
      return "Perlu latihan";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const teks = input.value.trim();
      const nilai = Number(teks);

      if (teks === "" || !Number.isFinite(nilai) ||
          !Number.isInteger(nilai) || nilai < 0 || nilai > 100) {
        hasil.textContent = "Masukkan bilangan bulat dari 0 sampai 100.";
        return;
      }

      hasil.textContent = "Grade: " + grade(nilai);
    });
  </script>
</body>
</html>
```

**Catatan pengajaran:** selector di contoh sesuai dengan elemen yang ada dan script ditempatkan setelah markup. Untuk latihan lanjutan, sengaja ubah selector lalu jelaskan `null` dan guard. Validasi browser biasanya mencegah event submit untuk field yang tidak valid; pemeriksaan JavaScript di atas adalah lapisan tambahan, bukan validasi server.

| Kasus uji | Hasil yang diharapkan |
|---|---|
| Kosong | Browser meminta input; tidak menghasilkan grade |
| 0 dan 59 | Perlu latihan |
| 60 dan 74 | C |
| 75 dan 89 | B |
| 90 dan 100 | A |
| -1 atau 101 | Ditolak oleh constraint input |
| Angka pecahan | Ditolak karena `step="1"`; pemeriksaan JS juga membatasi bilangan bulat |
| Tekan Enter pada input valid | Form memproses tanpa memuat ulang halaman |
| Operasikan dengan Tab dan keyboard | Label dan fokus jelas; tombol bisa dijalankan |

Tantangan pengembangan: tambah reset, pindahkan CSS/JS ke berkas terpisah, dan tulis tabel pengujian sendiri. Loop tidak perlu dipaksakan ke proyek ini; nilai kemampuan loop melalui tugas trace atau pengolahan kumpulan data yang sesuai.

## 13. Rancangan survei pengguna

Bagian ini menyiapkan survei empiris untuk tahap berikutnya. **Belum ada responden atau hasil persentase.**

### 13.1 Pertanyaan penelitian

- Apakah siswa memahami perbedaan peran HTML, CSS, dan JS setelah belajar?
- Apakah latihan typing membantu penulisan kode tanpa menggantikan pemahaman?
- Pada pertemuan mana beban belajar terasa terlalu tinggi?
- Apakah penggunaan Markdown dan ilustrasi memudahkan akses pada perangkat siswa?

### 13.2 Instrumen singkat

Gunakan skala 1–5: sangat tidak setuju sampai sangat setuju. Sediakan pilihan “belum mempelajari/tidak relevan” agar jawaban tidak dipaksakan.

| Kode | Pernyataan |
|---|---|
| S1 | Tujuan setiap pertemuan jelas bagi saya |
| S2 | Saya dapat menjelaskan perbedaan HTML, CSS, dan JavaScript |
| S3 | Saya dapat mengubah contoh untuk kebutuhan baru tanpa menyalin semuanya |
| S4 | Contoh materi cukup untuk mengerjakan tugas mandiri |
| S5 | Saya mengetahui langkah yang harus dilakukan ketika kode error |
| S6 | Latihan mengetik membantu saya menulis simbol kode dengan lebih lancar |
| S7 | Tekanan waktu atau ancaman permainan mengganggu proses memahami materi |
| S8 | Materi dapat dibaca dan dinavigasi dengan baik pada perangkat saya |
| S9 | Materi yang diujikan sudah pernah dijelaskan dan dilatih |
| S10 | Kriteria penilaian proyek jelas sebelum saya mulai |

Pertanyaan terbuka:

1. Konsep apa yang paling sulit, dan pada contoh mana kesulitan muncul?
2. Apa perbedaan antara bisa mengetik contoh dan bisa membuat program sendiri menurut pengalamanmu?
3. Perubahan materi atau antarmuka apa yang paling membantu?

### 13.3 Pengumpulan dan interpretasi

- Catat kelompok belajar dan tipe perangkat seperlunya; jangan kumpulkan identitas pribadi yang tidak dibutuhkan.
- Jelaskan tujuan survei, sifat sukarela, dan bahwa jawaban tidak memengaruhi nilai.
- Gunakan pre-test dan post-test konsep serta tugas modifikasi dengan tingkat kesulitan sebanding.
- Tambahkan tes retensi setelah jeda bila ingin mengevaluasi juggling; gunakan tugas baru yang menguji konsep sama.
- Laporkan jumlah responden, tingkat respons, median/distribusi jawaban, dan tema komentar; jangan hanya satu skor rata-rata.
- Bandingkan persepsi dengan hasil tugas. Rasa percaya diri tinggi tidak selalu berarti kemampuan tinggi.
- Tanpa rancangan pembanding dan kontrol faktor lain, jangan menyimpulkan peningkatan disebabkan oleh gamifikasi saja.

## 14. Validasi dan kriteria penerimaan

### 14.1 Pemeriksaan yang benar-benar dijalankan

| Pemeriksaan | Hasil |
|---|---|
| Inventaris `content/`, data, dan komponen materi | Enam MD HTML; tidak ada folder khusus CSS/JS |
| Evaluasi array `CURRICULUM` | 16 nomor berurutan, 36 slide, 14 blok kuis |
| Pencocokan nomor fase HTML dengan nama berkas MD | P7 tidak mempunyai dokumen |
| Parsing enam dokumen HTML | Statistik baris/blok tercantum pada bagian 3.2 |
| Uji parser sel tabel bertag | Sel dikembalikan sebagai teks mentah yang diteruskan renderer ke HTML |
| Uji URL berkutip | Atribut tambahan muncul pada string HTML hasil parser |
| Uji skema URL | Skema `javascript:` tetap berada pada hasil parser |
| Perhitungan heading renderer | Heading `##` dipetakan ke level 4 |
| Pemeriksaan contoh ekspresi JS | `7 % 3 = 1`, `true && false = false`, penjumlahan 1–5 = 15 |

Untuk mereproduksi hitungan data tanpa build aplikasi:

```bash
mkdir -p /home/user/.cache/codeshark-audit
cp src/data/curriculum.ts /home/user/.cache/codeshark-audit/curriculum.mts
node --experimental-strip-types --input-type=module <<'JS'
import { CURRICULUM } from '/home/user/.cache/codeshark-audit/curriculum.mts';
console.log(CURRICULUM.map((lesson) => lesson.no));
console.log(CURRICULUM.reduce((total, lesson) => total + lesson.slides.length, 0));
console.log(CURRICULUM.reduce((total, lesson) => total + lesson.slides.reduce(
  (count, slide) => count + slide.blocks.filter((block) => block.t === 'quiz').length, 0
), 0));
JS
```

Salinan sementara diperlukan untuk memisahkan evaluasi data murni dari pemuatan aplikasi. Angka dapat berubah setelah sumber diperbarui; laporan ini adalah snapshot audit.

### 14.2 Pengujian lanjutan yang direkomendasikan

- Buka setiap pertemuan dan seluruh tombol MD; uji nomor tidak ditemukan.
- Tambahkan tes bahwa setiap pertemuan yang menawarkan dokumen benar-benar mempunyai dokumen.
- Uji tabel dengan tag, backtick, ampersand, dan pipe.
- Uji tautan serta gambar dengan kutip, skema terlarang, dan path relatif.
- Pastikan inline code tidak berubah menjadi emphasis atau tautan.
- Uji heading, fokus, kontras, pembesaran teks, dan navigasi keyboard.
- Jalankan `npm run lint` dan `npm run build` setelah implementasi perbaikan; belum dijalankan pada audit dokumentasi ini.
- Uji proyek runnable di browser pada jalur normal dan kasus batas.
- Periksa preview quest sesuai elemen yang dipilih: template CSS generik saat ini tidak otomatis mempunyai `.bar`, `.kartu`, atau `#hero` untuk semua latihan.
- Jangan menuntut preview juggling menghasilkan program valid; bedakan mode latihan sintaks dari mode proyek.

### 14.3 Definisi selesai untuk pengembangan materi

- Seluruh 16 pertemuan mempunyai sumber materi yang jelas dan dapat dibuka.
- Tidak ada dokumen yang hilang, total hard-coded yang menyesatkan, atau nomor pertemuan ganda.
- Istilah dan penjelasan konsisten pada MD, slide, dan ringkasan modul.
- Setiap unit mempunyai tujuan terukur, contoh, hasil yang diharapkan, latihan modifikasi, serta kriteria keberhasilan.
- Kompetensi ujian sudah diajarkan dan dilatih sebelumnya.
- Renderer menampilkan kode sebagai teks, memvalidasi URL, dan menangani dokumen kosong dengan aman.
- Penilaian kemampuan membuat aplikasi tidak disamakan dengan akurasi penyalinan.

## 15. Sumber dan referensi lanjutan

### 15.1 Bukti primer repositori

- [Enam dokumen HTML](../content/html/) — isi naratif, contoh, dan cek paham.
- [Registri materi HTML](../src/data/materiHtml.ts) — pemetaan P1–P6.
- [Kurikulum](../src/data/curriculum.ts) — blok `htmlLessons`, `cssLessons`, `jsLessons`, `utsLesson`, dan `uasMerged`.
- [Modul ringkas](../src/data/modules.ts) — materi dan pembungkus preview HTML/CSS/JS.
- [Pembangkit sesi](../src/data/quests.ts) — `PASS_ACC`, `LESSON_LANG`, `DRILLS`, `interleave`, dan `getSession`.
- [Aturan progres](../src/lib/progress.ts) — `meetingLevel`, `meetingUnlocked`, dan `applyAttempt`.
- [Parser Markdown](../src/lib/markdown.ts) — `mdInline` dan `parseMd`.
- [Renderer materi HTML](../src/ui/MateriHtml.tsx) — `MdView`, navigasi dokumen, dan akses `doc.source`.
- [Layar pertemuan](../src/ui/Pertemuan.tsx) — tombol dokumen berdasarkan fase HTML.
- [Routing aplikasi](../src/App.tsx) — alur `materi-html` dan modul ringkas.
- [Peta 16 pertemuan](../PETA-PERTEMUAN-16.md) dan [panduan quest](../KURIKULUM-QUEST-16-PERTEMUAN.md).

### 15.2 Referensi eksternal untuk pendalaman

Tautan berikut disediakan untuk pembaca dan reviewer. Audit ini tidak mengklaim telah mengambil versi terbaru atau membandingkan isi halaman tersebut secara langsung.

| Rujukan | Kegunaan |
|---|---|
| [WHATWG HTML Living Standard](https://html.spec.whatwg.org/) | Rujukan normatif sintaks dan elemen HTML |
| [MDN Learn Web Development](https://developer.mozilla.org/en-US/docs/Learn_web_development) | Jalur pembelajaran, latihan, dan penjelasan web |
| [MDN CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade) | Pendalaman cascade dan urutan penentuan deklarasi |
| [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) | Variabel, alur kontrol, fungsi, objek, dan topik lanjutan |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Acuan persyaratan aksesibilitas yang perlu dipilih dan diuji |
| [WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/) | Label, instruksi, kelompok field, dan umpan balik formulir |
| [Nu HTML Checker](https://validator.w3.org/nu/) | Pemeriksaan markup; bukan jaminan aksesibilitas atau kebenaran aplikasi |
| [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) | Encoding sesuai konteks, sanitasi, dan batas kepercayaan konten |

---

**Kesimpulan akhir:** fondasi CodeShark cukup baik untuk pembelajaran web pemula, khususnya pembiasaan sintaks. Prioritas berikutnya adalah menyamakan kelengkapan materi antarbahasa, memperbaiki ketepatan konsep dan penyajian Markdown, menyelaraskan prasyarat ujian, serta menambahkan bukti kemampuan memodifikasi dan membangun aplikasi. Dokumen ini memetakan pekerjaan tersebut; belum mengimplementasikan perbaikan kode atau menerbitkan seluruh paket materi baru.
