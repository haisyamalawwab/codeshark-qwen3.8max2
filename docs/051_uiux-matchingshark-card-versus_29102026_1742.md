# 051 — UI/UX MatchingShark Card Versus: Sonar Link Arena

Tanggal: 2026-10-29 17:42 WIB
Status: prototipe interaktif selesai secara lokal pada branch
`arena/1fa1f349-codeshark-qwen3-8max2`; belum commit/push.

Dokumen ini menindaklanjuti konsep visual pada dokumen 050 setelah
pemilik proyek memilih model seperti **game card versus**.

## Hasil utama

Demo MatchingShark di `/matchingshark/#demo` tidak lagi berupa dua
kolom daftar. Model barunya adalah **Sonar Link Arena**:

- deck kartu situasi di kiri;
- deck kartu artefak/keputusan di kanan;
- arena versus besar di tengah;
- dua kartu aktif membesar, miring, dan saling berhadapan;
- panah SVG kiri → kanan menjadi hipotesis hubungan RPL;
- pasangan dinilai hanya setelah pemain menekan **Kunci Panah
  Sonar**;
- link benar berubah solid teal dan masuk **Dock Link
  Terverifikasi**;
- link salah digambar putus berwarna coral dan kartu dapat diganti.

Empat materi demo tetap sama: rekayasa kebutuhan, UML use case,
boundary value analysis, dan Sprint Planning.

## Alur UX

1. Pemain mengetuk kartu dari deck kiri/kanan, atau menyeretnya ke
   slot arena yang sesuai.
2. Selama kartu diseret, slot arena menampilkan pratinjau kartu
   tersebut; slot yang salah jenis memberi highlight penolakan.
3. Kartu aktif tampil besar di arena dengan portrait hiu, ikon,
   judul, isi, level/daya link, dan socket pada tepi yang menghadap
   lawan.
4. Bila dua slot terisi, UI menuliskan hipotesis hubungan, misalnya
   “kebutuhan masih kabur diklarifikasi menjadi kebutuhan terukur”.
5. Tombol **Kunci Panah Sonar** menilai pasangan:
   - benar: panah solid, medali centang, alasan engineering tampil,
     lalu pemain menekan **Duel Berikutnya**;
   - salah: panah putus, kartu bergetar, Kapten Hiu menjelaskan
     konteks yang tertukar, dan pemain dapat mengganti salah satu
     kartu tanpa mengulang seluruh demo.
6. Hint dan XP tetap murni tampilan demo lokal; hint mengurangi XP
   demo 5 poin dan jawaban salah mengurangi 3 poin.
7. `Esc` atau tombol **Batalkan Duel** menarik hipotesis yang belum
   dikunci tanpa penalti percobaan.

## Implementasi

| File | Perubahan |
|---|---|
| `src/matchingshark/MatchingDemo.tsx` | Komponen baru 1.139 baris: deck draggable, slot versus droppable, kartu face-off, panah SVG, state lock/success/error, dock link, feedback Kapten Hiu. |
| `src/matchingshark/matchingDemo.css` | CSS khusus 240 baris: tilt 3D, shine, bobbing face-off, shake, sonar ring, animasi dash panah, gem level, card-back, dan reduced motion. |
| `src/matchingshark/MatchingSharkPage.tsx` | Implementasi demo inline lama (344 baris) dipindahkan ke komponen khusus; copy section demo diperbarui ke card versus. |
| `src/assets/matchingshark/concepts/matching-card-duel.png/.webp` | Dipakai sebagai backdrop halus arena tengah dari konsep dokumen 050. |
| `docs/050_...md` | Status keputusan diperbarui menjadi prototipe terimplementasi. |

Detail teknis penting:

- drag memakai `@dnd-kit/core` yang sudah menjadi dependency proyek;
- `PointerSensor` aktif setelah 6 px dan `TouchSensor` setelah tekan
  180 ms agar scroll sentuh tidak mudah tertukar dengan drag;
- klik/ketuk native `<button>` adalah fallback penuh pada mouse,
  sentuh, dan keyboard;
- kartu situasi hanya diterima slot kiri dan kartu keputusan hanya
  diterima slot kanan agar semantik panah konsisten;
- portrait dipetakan berdasarkan posisi tampil di deck, bukan id
  pasangan, sehingga gambar tidak menjadi jalan pintas mencocokkan
  jawaban tanpa membaca makna;
- kategori kartu jawaban tidak ditampilkan sebelum penguncian agar
  deck kanan tidak membocorkan pasangannya;
- teks kartu tetap DOM, bukan teks yang dibakar ke gambar;
- `prefers-reduced-motion` mematikan tilt, bobbing, sonar, medali,
  dan animasi panah;
- status arena dan feedback menggunakan `aria-live`.

## Batas ruang lingkup

Ini masih demo konsep di halaman campaign:

- tidak ada persistensi localStorage/database;
- tidak ada XP sungguhan, badge, achievement, membership, atau
  progres global;
- tidak ada registrasi sub-game/settings baru;
- tidak ada perubahan scope antar-MK; game penuh tetap direncanakan
  sebagai `rpl:matching-shark`;
- belum ada misi P1–P6 penuh, meter Sprint nyata, backend, suara,
  PixiJS celebration, atau sprite batch final;
- gambar board desktop/mobile dari dokumen 050 tetap referensi dan
  tidak diimpor; hanya duel WebP/PNG yang dipakai sebagai backdrop.

## Validasi

Hasil pada workspace lokal:

- `npm run lint` — lulus (`tsc --noEmit`);
- `npm run build` — lulus; `dist/matchingshark/index.html` terbentuk;
- chunk MatchingShark hasil build: JS 64,75 kB (gzip 17,18 kB) dan
  CSS demo 3,92 kB (gzip 1,37 kB); `@dnd-kit` berada pada shared
  chunk `game-dnd` 37,41 kB (gzip 12,63 kB);
- `npm run test:settings` — 12/12 lulus;
- `npm run test:netlify` — 7/7 lulus;
- `npm run test:boot-loading` — 3/3 lulus;
- dev server Vite pada `0.0.0.0:3000` memberi HTTP 200 untuk
  `/matchingshark/`, `MatchingDemo.tsx`, dan `matchingDemo.css`;
  string `Sonar Link Arena`, `Kartu saling berhadapan`, `Kunci panah
  sonar`, dan `Dock link terverifikasi` ditemukan pada modul hasil
  transformasi Vite.

Batas bukti: sandbox tidak menyediakan executable Chromium, sehingga
drag visual belum diuji lewat screenshot/browser automation. Yang
terbukti adalah typecheck, production build, bundle asset, route,
dan transformasi modul. Interaksi drag mengikuti pola `@dnd-kit`
yang sama dengan implementasi drag yang sudah ada di proyek, dan
klik/ketuk menyediakan jalur penyelesaian penuh bila drag tidak
dipakai.

## Langkah berikutnya yang masuk akal

1. Uji manual pada preview desktop dan HP: klik dua kartu, drag ke
   slot benar/salah, kunci jawaban salah, pakai hint, lalu selesaikan
   4/4.
2. Nilai keterbacaan kartu arena pada lebar ±360 px dan tinggi total
   section demo pada desktop.
3. Bila UX disetujui, baru putuskan apakah pola ini menjadi fondasi
   slice game `rpl:matching-shark`, termasuk data misi dan
   persistensinya.
