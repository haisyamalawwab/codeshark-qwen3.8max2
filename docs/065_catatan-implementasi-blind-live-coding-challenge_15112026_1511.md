# 065 — Catatan Implementasi: Blind Live-Coding Challenge (Tahap 1 – Pemicu)

> Disimpan: 15-11-2026 15:11 WIB (+07).
> Branch kerja: `arena/bb025040-codeshark-qwen3-8max2` (dari `main` @ `d52c04e`).
> Rancangan: [`052`](./052_rencana-blind-live-coding-challenge-tahap-1-pemicu_13112026_2145.md).
> Status: **dibangun dan diuji di Chromium headless.** Belum diuji pada murid,
> belum diuji di Firefox/Safari, belum diuji dengan sinkron cloud.

---

## 1. Ringkasan

Dokumen 052 semula ditandai "digantikan oleh 053" dan tidak dibangun. Atas
permintaan pemilik, 052 sekarang dibangun **sebagai modul kedua** di samping
Simulasi Krisis Produksi (053), bukan sebagai penggantinya.

Kelompok Mahasiswa/Umum (`academy`) kini melewati dua langkah wajib, masing-masing
satu kali:

1. **Simulasi Krisis Produksi** di pintu masuk CodeShark (sudah ada, tidak diubah).
2. **Blind Live-Coding Challenge** sebelum latihan pertama (baru).

Di Coding Tower keduanya muncul berurutan saat tombol latihan pertama ditekan.

---

## 2. Keputusan

| # | Keputusan | Dipakai |
|---|---|---|
| D1 | Siapa yang mengerjakan | Wajib `academy`; opsional `senior` lewat kartu Dashboard; tidak tampil untuk `junior` dan `teen`. |
| D2 | Bentuk soal | Satu halaman mini HTML + `<style>` + `<script>`, tiga varian. |
| D3 | Sifat gerbang | **Wajib satu kali sebelum latihan pertama** (pilihan pemilik). Pengguna lama yang sudah punya progres ikut terkena satu kali. Tanpa keyboard fisik: ditunda. |
| D4 | Nada rapor | Kalimat keras hanya muncul bila angkanya buruk. |
| D5 | Penyimpanan | Irisan `blind` di `SaveData`; ikut sinkron sebagai `save_data`; tanpa migrasi skema. |
| D6 | Keyakinan diri | Skala 1–5 sebelum mulai; tombol mulai terkunci sampai dipilih. |

---

## 3. Yang dibangun

| Berkas | Isi |
|---|---|
| `src/lib/blindMetrics.ts` | Log ketikan → metrik (jeda dasar, jeda sebelum simbol, salah tombol simbol, beku, garis waktu), aturan tingkat, pemangkas riwayat, penormal save. |
| `src/lib/blindLint.ts` | Pemeriksa sintaks kode akhir. Memakai ulang `splitRegions` dan `lintDoc` dari `trapLint.ts`, ditambah aturan CSS tanpa selektor, pemeriksa akhir JS (`new Function`, hanya diurai), hitungan titik koma JS terlewat, dan tanda "belum ditutup saat waktu habis". |
| `src/lib/blindAttempt.ts` | Menggabungkan metrik, pemeriksa sintaks, dan cek spesifikasi menjadi satu rapor. |
| `src/data/blindChallenges.ts` | Tiga soal dan cek spesifikasinya, pemilih varian, daftar kelompok usia, aturan gerbang, sakelar `BLIND_GATE_ENABLED`. |
| `src/ui/BlindChallenge.tsx` (*lazy chunk*) | Pengantar → hitung mundur → editor 3 menit → rapor; juga layar riwayat rapor. |
| `src/ui/BlindReportCard.tsx` | Rapor Kegagapan Sintaksis dan garis waktu SVG. |
| `src/ui/BlindCard.tsx` | Kartu Dashboard: mulai, lihat rapor, ulangi, atau "Kerjakan di laptop". |
| `src/App.tsx` | Layar `blind`; gerbang `enterAfterTrap()` setelah gerbang simulasi krisis; simpan rapor, tunda, catat varian. |
| `src/lib/storage.ts` | `SaveData.blind` dan penormal di `parseSave()`. |
| `src/ui/Dashboard.tsx`, `src/ui/ui.css` | Kartu dan gaya `blind-*`. Editor memakai ulang kelas `trap-editor*`. |
| `tests/blind-lint.test.mjs`, `tests/blind-metrics.test.mjs` | 50 uji unit. Skrip: `npm run test:blind`. |

### 3.1 Tiga soal

| id | Judul | Panjang jawaban acuan |
|---|---|---|
| `penghitung` | Tombol Penghitung | 171 karakter |
| `sapaan` | Kartu Sapaan | 213 karakter |
| `tugas` | Daftar Tugas Mini | 218 karakter |

Tiap soal punya empat tuntutan: dua elemen HTML, satu aturan CSS dengan dua
deklarasi, satu variabel dan satu fungsi JavaScript. Jawaban acuan tidak pernah
ditampilkan; dipakai uji unit untuk memastikan soal bisa dijawab.

### 3.2 Alur gerbang

```
tombol latihan apa pun
  └─ enterPractice(id)
       ├─ butuh simulasi krisis?  → layar trap  ── lanjut ──┐
       └─ tidak                                             │
            └─ enterAfterTrap(id) ◄─────────────────────────┘
                 ├─ butuh blind?  → layar blind ── "Mulai latihan reguler" ─→ arena
                 └─ tidak         → arena
```

Gerbang blind berlaku bila: kelompok `academy`, ada keyboard fisik, belum ada
rapor, dan belum ditunda. Dari layar Pengantar ada tiga jalan keluar: mulai,
"Kembali ke Dashboard" (gerbang tetap berlaku), dan tautan aksesibilitas
(gerbang dilepas tanpa rapor dan tanpa XP).

---

## 4. Yang berbeda dari 052

| Hal | 052 | Yang dibangun | Alasan |
|---|---|---|---|
| Aturan "Gagap berat" | tiga syarat | ditambah syarat keempat: **kode akhir di bawah 40 karakter** | Tanpa itu, orang yang mengetik 20 karakter lalu menekan "Saya selesai" mendapat "Lancar". Syarat ini ditampilkan di rapor bersama tiga lainnya. |
| `BlindState` | `attempts`, `deferred` | ditambah `lastBriefId` | Sesi yang batal karena muat ulang tidak menghasilkan rapor; tanpa kolom ini soal yang sudah terlihat bisa muncul lagi. |
| `BlindAttempt` | lihat 052 §8.1 | ditambah `limitSec`, `endedBy`, `baselineMs`, `longestBracePauseMs`, `longestSemicolonPauseMs`, `specMet`, `wpm`, `pauseMarks`, `freezeSpans`; `syntaxErrors[]` membawa `message`; `firstKeyMs` boleh `null` | Rapor harus bisa dibuka ulang dari riwayat tanpa log ketikan. Rapor untuk jawaban acuan berukuran di bawah 4 kB; kode akhir dipotong pada 4.000 karakter. |
| Riwayat | maksimal 10 | rapor pertama + 9 terbaru | Rapor pertama adalah *baseline* dan tidak boleh tergeser. |
| Pemecah wilayah | dibuat baru | memakai `trapLint.ts` | Sudah ada dan sudah teruji; 052 ditulis sebelum berkas itu ada. |
| `isShortcut()` | dipakai ulang | tidak dipakai | Editor mencatat lewat event `input`, bukan `keydown`. |
| Catatan implementasi | "dokumen 053" | dokumen ini (065) | Nomor 053 sudah terpakai. |

Yang **tidak** ditambahkan: "Saya selesai" tidak dikunci sampai kode mencapai
panjang tertentu. 052 menyebut sesi berakhir saat tombol itu ditekan. Akibatnya
ada di bagian 7.

---

## 5. Definisi yang dipakai rapor

- **Jeda dasar pribadi:** median selang antar-ketik huruf dan angka, tanpa selang
  di atas 2 detik. Butuh sedikitnya 5 sampel; bila kurang, ambang jeda memakai
  batas tetap 1,5 detik dan rapor mengatakannya.
- **Jeda panjang sebelum simbol:** selang ≥ 1,5 detik **dan** ≥ 4× jeda dasar,
  tepat sebelum simbol. Hanya dihitung pada rangkaian ketikan yang tidak terputus:
  pindah kursor atau keluar jendela memutus rangkaian.
- **Salah tombol simbol:** satu simbol diketik, dihapus, lalu diganti simbol lain
  di posisi yang sama.
- **Beku:** selang ≥ 5 detik yang tidak sudah terhitung sebagai jeda simbol. Diam
  sampai sesi berakhir ikut dihitung. Waktu membaca soal sebelum karakter pertama
  dilaporkan terpisah sebagai latensi awal.
- ***Syntax error*:** dihitung pada kode akhir saja. Titik koma JS yang hilang
  dilaporkan terpisah dan tidak dihitung. Temuan pada blok yang sedang ditulis
  ketika waktu habis diberi tanda dan tidak dihitung dalam aturan tingkat.

---

## 6. Hasil uji

Dijalankan pada commit ini.

| Pemeriksaan | Hasil |
|---|---|
| `npx tsc --noEmit` | bersih |
| `npm run test:blind` | 50 dari 50 lulus (22 pemeriksa sintaks dan soal, 28 metrik dan penyimpanan) |
| `npm run test:trap` | 27 dari 27 lulus |
| `node --test tests/*.test.mjs` | 187 dari 188 lulus; satu yang gagal (`settings tables checked read-only…`) juga gagal di `main` sebelum perubahan ini |
| `npm run build` | berhasil; `BlindChallenge` menjadi chunk sendiri, 34,5 kB (11,1 kB gzip) |
| Chromium headless, server dev, skenario A | 57 dari 57 |
| Chromium headless, server dev, skenario B–H | 43 dari 43 |
| Chromium headless, build produksi (`vite preview`) | 3 dari 3 (uji asap) |

Skenario browser:

| | Isi |
|---|---|
| A | Pengguna lama `academy`: tombol latihan → Pengantar → sesi → rapor → lanjut ke sesi yang dituju; gerbang tidak muncul lagi setelah muat ulang; ulangan dari Dashboard memakai varian lain dan tidak menimpa rapor pertama; XP +30 hanya sekali. Di dalam sesi: jeda 3 detik sebelum `{` terukur, `[` → hapus → `{` terhitung satu salah tombol, Tab = dua spasi, tempel/klik kanan/sisipan skrip ditolak dan dihitung, `Esc` tidak menghentikan timer. |
| B | Waktu habis: blok terbuka bertanda "belum ditutup saat waktu habis", diam sampai akhir terhitung beku, keluar jendela tercatat. |
| C | Tidak mengetik sama sekali: rapor konsisten, tanpa angka kosong. |
| D | `senior`: kartu ada, tidak digerbang. `junior` dan `teen`: kartu tidak ada, tidak digerbang. |
| E | Tanpa keyboard fisik: kartu "Kerjakan di laptop", latihan tetap terbuka, gerbang tidak dianggap selesai. |
| F | "Kembali ke Dashboard" tidak melepas gerbang; tautan aksesibilitas melepasnya tanpa rapor dan tanpa XP. |
| G | Muat ulang di tengah sesi: tidak ada rapor, gerbang muncul lagi, varian berganti. |
| H | Rantai dua gerbang di CodeShark dan di Coding Tower. |

Waktu habis diuji dengan menggeser `performance.now()`, bukan dengan menunggu
180 detik sungguhan.

---

## 7. Batas dan hal yang belum diuji

**Batas yang diketahui**

1. **Gerbang bisa dilewati dalam beberapa detik** dengan menekan "Saya selesai"
   dua kali. Rapornya tercatat apa adanya ("Dalam 4 detik hanya 0 karakter yang
   tertulis", Gagap berat) dan menjadi *baseline* yang tidak bisa diganti.
2. **Cek spesifikasi memakai pola teks**, bukan pengurai. Bentuk yang setara
   tetapi tidak dikenali akan dinilai tidak terpenuhi, misalnya
   `n = 1 + n`, `padding: 8px 8px`, atau `color: rgb(255, 255, 255)`.
   Cek spesifikasi tidak memengaruhi tingkat.
3. **Pemeriksa sintaks dibuat sendiri** dan tidak selengkap pengurai browser.
   HTML yang salah tetapi masih seimbang kurungnya (misalnya nama atribut salah
   ketik) tidak terdeteksi.
4. **Jeda sebelum spasi tidak dihitung.** Bila murid berhenti, mengetik spasi,
   lalu mengetik `{`, jedanya jatuh sebelum spasi dan tidak masuk hitungan.
5. **Semua ambang masih sementara** (1,5 detik, 4×, 5 detik, 3 error, 5 jeda,
   40%, 15%, 40 karakter). Belum ada data kelas untuk mengkalibrasinya.
6. **Pengguna baru `academy` menghadapi dua sesi wajib berurutan**, sekitar 6
   menit ditambah dua layar hasil, sebelum latihan pertama.
7. **Pemeriksa akhir JS memakai `new Function`.** Bila situs kelak diberi
   Content-Security-Policy tanpa `unsafe-eval`, pemeriksa itu dilewati tanpa
   pesan dan hanya pindaian sendiri yang bekerja.
8. Browser tidak bisa mencegah murid bertanya ke AI lewat perangkat kedua.

**Belum diuji**

- Murid sungguhan, dan apakah rapor ini memang memicu refleksi.
- Firefox dan Safari. Perilaku `beforeinput` dan `execCommand` berbeda antar-browser.
- Tata letak keyboard selain QWERTY-US, *dead key*, dan IME.
- Sinkron cloud dengan irisan `blind`, dan login akun.
- Pembaca layar.
- Deploy Netlify yang sesungguhnya.

**Di luar cakupan (052 §10 "Lanjutan")**: rekap kelas untuk dosen, ekspor CSV,
sakelar di panel admin, kalibrasi ambang.

---

## 8. Cara mengubah

- **Mematikan gerbang:** `BLIND_GATE_ENABLED = false` di
  `src/data/blindChallenges.ts`. Kartu Dashboard tetap ada.
- **Mengubah siapa yang terkena:** `BLIND_REQUIRED_AGES` dan `BLIND_OPTIONAL_AGES`.
- **Mengubah ambang:** konstanta di awal `src/lib/blindMetrics.ts`
  (`LEVEL_RULES`, `HESITATION_MIN_MS`, `HESITATION_FACTOR`, `BLIND_FREEZE_MS`).
  Rapor membaca konstanta yang sama, jadi teks aturannya ikut berubah.
- **Menambah soal:** tambahkan objek `BlindBrief` ke `BLIND_BRIEFS`, lalu
  jalankan `npm run test:blind`. Uji memeriksa bahwa jawaban acuan 170–250
  karakter, bebas temuan, dan memenuhi semua tuntutannya sendiri.
