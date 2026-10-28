# 047 — Materi MK RPL enam pertemuan beserta ilustrasi raster & diagram

Tanggal: 2026-10-28 17:27 WIB
Status: perubahan lokal siap diajukan melalui pull request.

## Latar & keputusan cakupan

Permintaan pemilik: perbaiki/perluas materi pembelajaran MK Rekayasa
Perangkat Lunak (RPL) pada setiap materi sesuai topik dan tambahkan 2–3
gambar JPG/PNG/WebP per materi mengikuti gaya ilustrasi yang sudah ada.

Pemeriksaan awal membuktikan **materi RPL belum ada sama sekali** di repo
(selaras catatan dokumen 039/042); yang tersedia baru materi HTML
(`content/html/`, 6 pertemuan) untuk MK Pemrograman Web. Karena tidak ada
yang bisa "diperbaiki", materi RPL dibuat baru mengikuti pola yang sama.
Konfirmasi cakupan interaktif dilewati pengguna, sehingga dipakai asumsi
default yang paling konsisten dengan repo:

1. **6 pertemuan** mengikuti pola materi HTML.
2. Integrasi **konten + loader** saja; belum mengubah kurikulum/UI game
   (menunggu keputusan progres/gamifikasi per-MK dokumen 042).
3. Tiap materi mendapat **3 visual**: 2 ilustrasi raster JPG gaya HUD
   selam Neon (konseptual) + 1 diagram SVG se-gaya `figures.tsx` untuk
   notasi yang menuntut akurasi (SDLC, Scrum, UML, level pengujian),
   karena gambar raster generatif tidak andal menggambar notasi baku.

## Materi yang dibuat (`content/rpl/`, total ±600 baris)

Format mengikuti materi HTML: Markdown bahasa Indonesia per pertemuan
dengan tujuan pembelajaran, tabel konseptual, contoh/studi kasus
berkelanjutan (aplikasi perpustakaan kampus), cek paham berjawaban,
latihan mini, dan rangkuman.

| File | Topik inti |
|---|---|
| `01-pengantar-rpl-sdlc.md` | Hakikat PL & krisis PL, definisi RPL, 6 fase SDLC + hasilnya, peran tim, studi kasus perpustakaan |
| `02-model-proses.md` | Waterfall, incremental/iteratif/prototipe/spiral/V-Model, nilai Agile, Scrum (peran/artefak/acara), Kanban, memilih model |
| `03-rekayasa-kebutuhan.md` | Fungsional vs non-fungsional terukur, teknik elisitasi, 4 tahap rekayasa kebutuhan, MoSCoW, user story INVEST + kriteria penerimaan, ciri SRS, verifikasi vs validasi |
| `04-uml-usecase-activity.md` | Use case diagram (aktor, batas sistem, include/extend/generalisasi), skenario use case, activity diagram (keputusan, fork/join, swimlane) |
| `05-uml-class-sequence-desain.md` | Class diagram (visibilitas, multiplisitas, agregasi vs komposisi), sequence diagram, kohesi–kopling, arsitektur berlapis |
| `06-pengujian-pemeliharaan-mini-project.md` | Error–defect–failure, 4 level pengujian, partisi ekivalen & nilai batas, white-box/regresi, kasus uji terlacak, 4 jenis pemeliharaan, paket mini project + checklist gladi UTS |

## Gambar

**Ilustrasi raster (JPG, `src/assets/materi-rpl/`, ±200–310 KB/berkas)** —
dibangkitkan dengan prompt gaya seragam: ilustrasi game edukasi laut dalam
Neon (biru navy, cyan `#45c6ff`, teal `#2ee6c8`, amber `#ffc247`, koral),
karakter hiu/makhluk laut, stasiun kubah futuristik, tanpa teks.
Terbuat lengkap 12 berkas:

- `rpl-p1-pabrik-pl.jpg`, `rpl-p1-siklus-hidup.jpg`
- `rpl-p2-waterfall.jpg`, `rpl-p2-sprint-agile.jpg`
- `rpl-p3-elisitasi.jpg`, `rpl-p3-dokumen-srs.jpg`
- `rpl-p4-aktor-sistem.jpg`, `rpl-p4-alur-aktivitas.jpg`
- `rpl-p5-blok-kelas.jpg`, `rpl-p5-sinyal-urutan.jpg`
- `rpl-p6-inspeksi-bug.jpg`, `rpl-p6-pemeliharaan.jpg` (dibuat pada
  giliran lanjutan karena batas 10 generasi gambar per giliran; kini
  lengkap 12/12 dan terdaftar di katalog)

**Diagram SVG baru (`src/lib/figures.tsx`)** — mengikuti palet & helper
yang ada, ditambah helper `HudBox`, `StickActor`, dan `ClassBox`:

- `rpl-sdlc-fase` — 6 fase SDLC + panah umpan balik
- `rpl-siklus-scrum` — siklus Scrum backlog→sprint→increment→review
- `rpl-alur-kebutuhan` — elisitasi→analisis→spesifikasi→validasi berulang
- `rpl-usecase-perpus` — use case Sistem Perpustakaan (include/extend)
- `rpl-class-diagram-kuis` — kelas Mahasiswa/HasilKuis/Kuis/Soal + komposisi
- `rpl-level-pengujian` — tingkatan unit→integrasi→sistem→penerimaan

## Integrasi teknis

- `src/data/materiRpl.ts` — loader `RPL_DOCS`/`getRplDoc` memuat
  `content/rpl/*.md?raw`, meniru pola `materiHtml.ts` (tipe `MdDoc`
  dipakai ulang). Sengaja **belum** diimpor UI/kurikulum.
- `src/lib/figures.tsx` — 12 import JPG + helper `raster()` mendaftarkan
  ilustrasi sebagai node `<img>` pada katalog `FIGURES`, sehingga
  placeholder `%%IMG:<kunci>%%` bekerja identik untuk SVG maupun raster;
  18 entri katalog RPL baru dengan caption bernomor `Gambar RPL-x.y`.
- `src/ui/ui.css` — aturan `.md-figure-frame img` menyetarakan tampilan
  raster dengan SVG di bingkai HUD materi.

Catatan ukuran: karena katalog `FIGURES` dimuat UI materi, kedua belas JPG
(±2,9 MB total) ikut ter-bundle ke `dist/assets/img/` sejak sekarang
meskipun loader RPL belum ditampilkan UI. Saat integrasi UI per-MK
diputuskan, pertimbangkan pemisahan katalog per MK / lazy-load agar
precache PWA tidak menanggung materi yang belum aktif.

## Validasi

Hasil yang telah dijalankan pada workspace ini:

- Pemeriksaan cakupan kunci: 18 kunci `%%IMG%%` dipakai materi RPL dan
  18 terdaftar lengkap; kunci materi HTML tetap lengkap terdaftar
  (tidak ada regresi katalog).
- `npm run lint` — lolos (`tsc --noEmit`).
- `npm run build` — lolos; kedua belas JPG ter-bundle di
  `dist/assets/img/rpl-*.jpg`, precache PWA 67 entri.
- Dua ilustrasi contoh diperiksa visual: gaya konsisten dengan aset
  CodeShark yang ada. Diagram SVG belum diperiksa lewat tangkapan layar
  browser (sandbox tanpa browser); koordinat mengikuti pola figur lama
  dan lolos kompilasi — pemeriksaan visual final sebaiknya dilakukan
  saat materi dihubungkan ke UI.

## Yang masih tertunda

1. Buat 2 ilustrasi raster P6 (`rpl-p6-inspeksi-bug`, `rpl-p6-pemeliharaan`)
   pada giliran berikutnya, daftarkan ke katalog `FIGURES` (caption
   RPL-6.2 & RPL-6.3), lalu ulangi pemeriksaan cakupan kunci + build.
2. Keputusan integrasi UI/kurikulum RPL bersama desain progres per-MK
   (dokumen 042): pemetaan pertemuan ke `curriculum.ts`/modul, scope
   achievement `rpl:*`, dan pemisahan bundle katalog gambar per MK.
3. Peninjauan visual diagram SVG & keterbacaan materi di perangkat nyata.
