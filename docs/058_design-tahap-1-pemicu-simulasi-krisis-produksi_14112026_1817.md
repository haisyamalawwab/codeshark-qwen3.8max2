# 058 — Design: Tahap 1 – Pemicu, Simulasi Krisis Produksi

> Disimpan: 14-11-2026 18:17 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: bagian 2–7 menggambarkan **yang sudah dibangun** di `main`;
> bagian 8–11 adalah **rancangan yang belum dibangun** untuk kebutuhan baru di
> `docs/057_…`.
> Dokumen pasangan: `docs/056_…` (PRD), `docs/057_…` (Requirement), `docs/059_…` (Tasklist).
> Diperbarui 14-11-2026 20:15 WIB: bagian 14 (kontrak data ke Tahap 3). Rancangan Tahap 3: `docs/063_…` (diperbarui 14-11-2026 21:10 WIB; sebelumnya `docs/060_…` §8).

---

## 1. Lingkup

Dokumen ini menjelaskan cara modul bekerja dan cara kebutuhan baru akan
dibangun. Rancangan awal ada di `docs/053_…`; enam hal yang berubah saat
dibangun dicatat di `docs/054_…` §3, dan gerbang masuk di `docs/055_…` §4.
Bila dokumen ini berbeda dari 053, dokumen ini yang benar untuk keadaan kode.

---

## 2. Arsitektur yang dibangun

```
codingshark/index.html
  └─ src/codingshark/main.tsx ── <App lockedSubGame="shark" hubHref="../">
       └─ src/App.tsx
            ├─ gerbang: needsTrapEntryGate() / needsTrapGate()
            ├─ layar "trap" ──► AiTrapModule (dimuat malas)
            │                    ├─ Briefing ─► hitung mundur ─► TrapArena ─► AiTrapDiagnostic
            │                    └─ History ─► AiTrapDiagnostic, unduh JSON
            ├─ recordTrap() ──► SaveData.aiTrap ──► localStorage ──► sinkron cloud (save_data)
            └─ Dashboard ─► AiTrapCard

TrapArena
  ├─ <textarea> ── event native ──► log TrapEvent[]
  ├─ trapRunner ──► <iframe sandbox="allow-scripts"> ──postMessage──► RunResult
  ├─ trapLint  ──► temuan struktur (dasar efek domino)
  └─ trapMetrics ─► TrapMetrics, outcome, jadwal putar ulang
```

Tiga lapis, dengan ketergantungan satu arah:

| Lapis | Berkas | Sifat |
|---|---|---|
| Data | `src/data/aiTrapScenarios.ts`, `src/data/aiBenchmark.ts` | Konten dan aturan audiens. Tanpa React |
| Logika | `src/lib/trapLint.ts`, `src/lib/trapMetrics.ts`, `src/lib/trapRunner.ts` | `trapLint` dan `trapMetrics` murni dan diuji di Node; `trapRunner` butuh DOM |
| Antarmuka | `src/ui/AiTrapModule.tsx`, `AiTrapDiagnostic.tsx`, `KeyboardHeatmap.tsx`, `AiTrapCard.tsx` | React; gaya di blok `.trap-*` pada `src/ui/ui.css` |

Berkas lama yang disentuh: `src/App.tsx`, `src/ui/Dashboard.tsx`,
`src/lib/storage.ts`, `src/lib/device.ts`, `src/graphics/Ambient.tsx`,
`package.json`. Uji: `tests/ai-trap.test.mjs` (27 uji, `npm run test:trap`).

---

## 3. Gerbang dan alur layar

### 3.1 Aturan audiens

| Fungsi | Hasil `true` bila |
|---|---|
| `trapVisibleFor(age)` | usia `academy` atau `senior` |
| `needsTrapGate(save, noKeyboard)` | usia `academy`, ada keyboard fisik, belum ditangguhkan, dan belum ada percobaan |
| `needsTrapEntryGate(save, noKeyboard, subGame)` | `subGame === "shark"` dan `needsTrapGate` terpenuhi |

`noKeyboard` berasal dari `lacksPhysicalKeyboard()`: agen pengguna ponsel atau
tablet, atau pointer kasar tanpa pointer presisi. Laptop berlayar sentuh
dianggap punya keyboard.

### 3.2 Dua gerbang

| Gerbang | Tempat | Cara kerja |
|---|---|---|
| Masuk (CodeShark) | `App.tsx`, saat render | Selama syarat terpenuhi dan layar tujuan adalah Dashboard, `screen` diturunkan menjadi `ENTRY_TRAP`. Dashboard tidak pernah ter-mount. Sebuah layout effect menulis `ENTRY_TRAP` ke state supaya layar diagnosis bertahan setelah percobaan tersimpan (saat itu syarat gerbang sudah tidak terpenuhi). |
| Latihan pertama (Coding Tower) | `enterPractice()` | Mengalihkan ke layar `trap` dengan `next` = sesi yang dituju; setelah diagnosis, sesi itu dibuka. |

### 3.3 Fase di dalam modul

```
brief ──(pilih keyakinan 1–5, "Ambil alih insiden")──► count ──► play ──► diag
  │                                                              │
  └─(tautan penangguhan)──► deferred = true ──► Dashboard        ├─ waktu habis   (endedBy: timeout)
                                                                 ├─ Akhiri        (endedBy: manual)
                                                                 └─ produksi pulih (endedBy: recovered)
```

Mode `history` membuka daftar percobaan, diagnosis tiap percobaan, unduhan
telemetri, dan tombol ulangi. Mengulang memanggil `pickTrapScenario(lastId)`
yang menghindari skenario terakhir.

---

## 4. Skenario

Tiap `TrapScenario` berisi kode beracun (`code`), kode acuan (`solution`, hanya
untuk uji), empat `TrapDef`, dan `checks`.

| Slot | Bahasa | Pola cacat | Mengapa dipilih |
|---|---|---|---|
| 1 | HTML | Kutip atribut tidak ditutup | Merusak struktur tanpa pesan error |
| 2 | CSS | Titik koma atau kurung kurawal hilang | Sama; hanya terlihat dari tampilan |
| 3 | JS | Nama variabel yang nyaris sama | Baru ketahuan saat dijalankan |
| 4 | JS | Satu baris terpotong, harus ditulis ulang | Padat simbol; sumber data peta panas |

Skenario saat ini: `keranjang` dan `suka`.

Tiap `TrapDef` punya `fixed(code)`, pemeriksa statis di halaman induk yang
menentukan apakah cacat itu sudah benar. `checks` adalah badan fungsi JS yang
dijalankan di dalam sandbox dan mengembalikan `{ label, ok, detail }[]`.

**Aturan menulis `checks`:** setiap pernyataan diakhiri titik koma, tanpa
komentar `//`, dan tanpa teks penutup tag skrip. Badan ini dipadatkan menjadi
satu baris supaya nomor baris pesan error tetap cocok dengan editor. Sebuah uji
menjaga aturan ini.

---

## 5. Eksekusi kode

1. `runInSandbox()` menolak kode yang memuat perulangan (`hasLoop`) tanpa
   menjalankannya.
2. Dokumen sandbox = skrip pemantau satu baris + kode mahasiswa, dipasang ke
   `iframe.srcdoc`. Pemantau diletakkan **di depan** supaya tidak tertelan oleh
   `<style>`, `<script>`, atau kutip yang belum ditutup.
3. Pemantau menangkap `window.onerror`, menunggu `load` + 40 ms, menjalankan
   `checks`, lalu mengirim `{ token, errors, checks }` lewat `postMessage`.
4. Halaman induk menerima pesan hanya bila sumbernya iframe itu dan tokennya
   cocok. Error dideduplikasi (maksimal 6), pemeriksaan dibatasi 8.
5. Tanpa laporan dalam 2,5 detik, hasilnya `timedOut`.
6. `isRecovered()` = melapor, tanpa error, dan semua pemeriksaan lulus.

Iframe memakai `sandbox="allow-scripts"` tanpa `allow-same-origin`, jadi kode
mahasiswa berjalan di origin buram dan tidak bisa membaca penyimpanan, cookie,
atau halaman induk. Eksekusi diantrekan supaya Jalankan dan pemeriksaan akhir
tidak saling menimpa.

**Kelemahan yang diketahui:** pemantau dan kode mahasiswa berbagi satu dokumen,
jadi kode mahasiswa bisa membaca token dan mengirim laporan sendiri. Lihat §8.1.

---

## 6. Telemetri dan metrik

### 6.1 Rekaman

Semua pencatatan memakai event native pada `<textarea>`. Waktu = milidetik
sejak arena mulai, dari `performance.now()`.

| Peristiwa | Bentuk | Arti |
|---|---|---|
| `e` | `["e", t, posisi, jumlahDihapus, teksDisisipkan]` | Satu suntingan |
| `n` | `["n", t]` | Pindah kursor (mouse atau panah); yang berurutan digabung |
| `r` | `["r", t, temuanLint, lulus, total, errorPertama]` | Jalankan |
| `b` | `["b", tMulai, durasiMs]` | Keluar jendela |
| `x` | `["x", t, jenis]` | Sisipan ditolak: `paste`, `drop`, `replace`, `synthetic` |

Penolakan sisipan berlapis: `beforeinput` (jenis masukan terlarang dan event
tidak tepercaya), `paste`, `drop`, dan pemeriksaan di `input` yang
mengembalikan sisipan lebih dari 2 karakter sekaligus. Undo/redo dan komposisi
IME dikecualikan.

### 6.2 Definisi operasional

| Metrik | Definisi | Konstanta |
|---|---|---|
| Jeda motorik | Selang sebelum sebuah tombol di tengah rangkaian mengetik: posisi kursor bersambung, tanpa pindah kursor, Jalankan, atau keluar jendela di antaranya | — |
| Tombol lumpuh | Jeda motorik > 2 detik | `SLOW_MS = 2000` |
| Beku | Selang tanpa aktivitas ≥ 5 detik, di luar waktu membaca sebelum aksi pertama | `FREEZE_MS = 5000` |
| Efek domino | Temuan `lintKeys` yang belum ada di snapshot sebelumnya (kode awal → tiap Jalankan → kode akhir) | — |
| Jeda pindai | Median waktu dari Jalankan sampai suntingan berikutnya | — |
| Salah sasaran | Rangkaian suntingan pada baris yang tidak bercacat | — |
| Peta panas bermakna | Ketukan bersambung ≥ 8 | `MIN_HEATMAP_KEYS = 8` |
| Hasil | `pulih` bila produksi pulih; `sebagian` bila ≥ separuh cacat diperbaiki; selain itu `gagal` | `outcomeOf()` |

Putar ulang (`buildReplay`) memampatkan sesi ke ±10 detik, menahan tiap beku
cukup lama supaya terbaca, dan memakai definisi beku yang sama dengan metrik.

### 6.3 Angka pembanding AI

Hanya di `src/data/aiBenchmark.ts`: waktu "hitungan detik", biaya "di bawah
Rp 100", dasar ±500 token pada tarif hingga ±US$10 per juta token dan kurs
±Rp 16.500. Ini perkiraan orde besaran, bukan kutipan tarif, dan teks asumsinya
selalu dirender bersama angkanya.

---

## 7. Data

```ts
SaveData.aiTrap?: AiTrapState
AiTrapState   { attempts: AiTrapAttempt[]; deferred?: boolean }
AiTrapAttempt { id, at, scenarioId, confidence, durationMs, limitMs,
                endedBy: "timeout" | "manual" | "recovered",
                fixed: string[], trapTotal, recovered, checksOk, checksTotal,
                lastError, outcome: "pulih" | "sebagian" | "gagal",
                metrics: TrapMetrics, code, log?: TrapEvent[] }
```

| Batas | Nilai | Konstanta |
|---|---|---|
| Percobaan tersimpan | 10 terbaru | `MAX_ATTEMPTS` |
| Percobaan dengan log mentah | 5 terbaru | `MAX_LOGGED_ATTEMPTS` |
| Peristiwa per log | 1.500 | `MAX_LOG_EVENTS` |
| Panjang kode akhir | 4.000 karakter | `MAX_CODE_CHARS` |

- Penyimpanan: kunci `codeshark:save:v1` atau kunci per pengguna
  `codeshark:save:v1:<pengguna>`. `normalizeAiTrap()` membuang entri yang
  bentuknya tidak dikenal; save lama tanpa irisan ini tetap terbaca.
- Sinkron: irisan ini ikut dalam `save_data`. Tidak ada perubahan skema.
  Jalur ini belum pernah dijalankan ke server sungguhan.
- Ekspor: `codeshark-ai-trap-telemetri-<tanggal>.json` berisi `exportedAt`,
  `profileName`, `ageGroup`, `deviceId`, keterangan format peristiwa, dan
  seluruh `attempts`.
- XP: `TRAP_PARTICIPATION_XP = 30`, diberikan saat percobaan pertama tersimpan.
- Percobaan tidak ditulis ke Riwayat Misi.

**Akibat batas 10 percobaan:** `trimAttempts()` menyimpan 10 yang terbaru, jadi
percobaan pertama terbuang pada percobaan ke-11. PRD menyebut hasil pertama
sebagai titik awal; rancangan untuk menjaganya ada di §9.2.

---

## 8. Rancangan R2 — validasi dan kalibrasi

### 8.1 Vonis yang tidak bisa dipalsukan (V-09)

**Cacat.** Kode mahasiswa bisa mengambil token dari elemen skrip pemantau dan
mengirim laporan "semua pemeriksaan lulus" lebih dulu. Halaman induk menerima
pesan pertama yang tokennya cocok. Direproduksi pada `79a66c6` di Chromium
headless: satu baris skrip yang diketik tangan, tanpa memperbaiki cacat apa pun,
menghasilkan `fixed: []`, `recovered: true`, `outcome: "pulih"`, dan layar
`PRODUKSI PULIH`. Tidak ada upaya tempel yang tercatat karena skripnya diketik.

**Dampak.** Tidak menyentuh data lain (sandbox tetap utuh) dan tidak
memengaruhi nilai. Yang rusak adalah kebenaran diagnosis dan data rekap kelas.

**Perbaikan, dua lapis:**

1. *Vonis ditentukan halaman induk.* `pulih` mensyaratkan `isRecovered(hasil)`
   **dan** `fixed.length === trapTotal`. Bila laporan menyatakan pulih tetapi
   pemeriksa statis tidak setuju, arena tidak berakhir otomatis, hasil dihitung
   dari jumlah `fixed`, dan percobaan diberi penanda `mismatch: true` yang
   tampil di catatan integritas. `fixed()` berjalan di halaman induk dan tidak
   bisa disentuh kode mahasiswa.
2. *Token tidak terbaca.* Pemantau menyimpan rujukan `parent` dan token di
   dalam closure, lalu menghapus elemen skripnya sendiri dari dokumen sebelum
   kode mahasiswa berjalan.

Lapis 2 saja tidak cukup: kode yang berjalan di dokumen yang sama masih bisa
mengubah lingkungan yang dibaca `checks`. Lapis 1 yang menjadi jaminan.

**Risiko lapis 1:** perbaikan sah yang tidak dikenali `fixed()` akan ditahan
dari vonis `pulih`. Uji yang ada sudah memastikan kode acuan dikenali. Sebelum
lapis ini digabung, tiap skenario perlu diuji dengan beberapa bentuk perbaikan
lain yang sah (kutip tunggal, `function () {}` sebagai ganti panah, spasi
berbeda). Bila ada bentuk sah yang tertolak, longgarkan `fixed()`-nya.

**Uji:** uji unit untuk aturan vonis baru; uji browser yang mengetik skrip
pemalsu dan memastikan hasilnya bukan `pulih`.

### 8.2 Uji alur browser di dalam repo (V-02)

Repo sudah punya pola: `scripts/test-settings-browser.mjs` memakai
`playwright-core` (sudah menjadi dependensi) dan `CHROMIUM_PATH`.

- Berkas baru `scripts/test-trap-browser.mjs`, skrip npm `test:trap:browser`.
- Skenario: perbaikan penuh, perbaikan sebagian dengan jeda, waktu habis,
  aturan gerbang per usia dan perangkat, gerbang Coding Tower, pindah tab,
  pemalsuan vonis.
- Hal yang sudah dipelajari dan harus dibawa ke skrip itu:
  - sembunyikan `.ambient-root`, karena di perender perangkat lunak tangkapan
    layar bisa macet;
  - skrip awal juga berjalan di iframe sandbox, jadi akses `localStorage` harus
    dijaga dengan `window.top === window`;
  - profil hasil onboarding disimpan di kunci per pengguna;
  - untuk waktu habis, pakai jam palsu dengan `fastForward`, bukan `runFor`
    selama menit;
  - `hasTouch: true` meniru ponsel, bukan laptop berlayar sentuh.

### 8.3 Kalibrasi (V-05, V-06)

Uji coba menghasilkan berkas telemetri per peserta. Yang dibaca dari berkas itu:

| Pertanyaan | Data |
|---|---|
| Apakah 3 menit cukup? | Sebaran `endedBy` dan `fixed.length` |
| Apakah 2 detik memisahkan dengan baik? | Sebaran `keys[*].maxMs` per tombol |
| Apakah 5 detik menangkap beku yang nyata? | `freezes`, `longestFreezeMs`, dibandingkan catatan pengamat |
| Apakah peta panas terisi? | `contiguousKeys` terhadap `MIN_HEATMAP_KEYS` |
| Apakah cacat ke-4 benar-benar ditulis ulang? | `charsTyped`, dan `fixed` memuat `js-baris-terpotong` |

Konstanta hanya diubah bila data menunjukkannya; keputusan dan alasannya
dicatat di dokumen bernomor baru. Bila ambang berubah, percobaan lama tetap
menyimpan metrik yang dihitung dengan ambang lama. Karena itu tiap percobaan
baru perlu menyimpan ambang yang dipakai (`thresholds: { slowMs, freezeMs }`),
supaya rekap tidak mencampur dua definisi.

### 8.4 Tanggal acuan angka AI (V-07)

Tambahkan `asOf` (bulan dan tahun) ke `AI_BENCHMARK` dan sisipkan ke teks
`basis`. Nilainya menunggu keputusan O2 di PRD; sebelum itu dipakai tanggal
terakhir angka diperiksa oleh pemilik proyek.

---

## 9. Rancangan R3 — konten dan diagnosis

### 9.1 Skenario baru (C-01)

Daftar periksa untuk tiap skenario:

1. Empat slot cacat seperti §4; baris terpotong memuat sedikitnya `( ) { } =>`
   atau `;` supaya peta panas terisi.
2. `needle` tiap cacat unik di dalam `code`.
3. Tanpa perulangan, karena `hasLoop` akan menolak eksekusinya.
4. `checks` mematuhi aturan satu baris.
5. Tambahkan ke `TRAP_SCENARIOS`; uji yang ada berjalan per skenario.
6. Panjang kode setara dengan dua skenario sekarang supaya bisa dibaca dalam
   3 menit.

Tema usulan: formulir masuk yang tombolnya tidak merespons; penghitung stok
yang menampilkan `NaN`. Dengan empat skenario, `pickTrapScenario` tetap hanya
menghindari skenario terakhir.

### 9.2 Titik awal dan perbandingan (C-02)

- Tambahkan `AiTrapState.baseline?: AiTrapAttempt` berisi salinan percobaan
  pertama tanpa `log`. Diisi saat percobaan pertama tersimpan, dan untuk data
  lama diisi dari `attempts[0]` saat dinormalkan selama entri itu masih ada.
- `trimAttempts` tidak berubah; `baseline` hidup di luar daftar.
- Diagnosis menerima `baseline` dan menampilkan blok perbandingan bila
  percobaan yang dibuka bukan baseline. Empat angka: cacat diperbaiki, tombol
  lumpuh, waktu beku total, efek domino.
- Skenario bisa berbeda antara dua percobaan; teks blok menyebutkannya dan
  tidak memakai kata "naik" atau "turun" untuk tombol lumpuh bila salah satu
  percobaan punya ketukan bersambung < 8.

### 9.3 Daftar temuan sintaks (C-03)

`lintDoc(kodeAkhir)` sudah mengembalikan wilayah, nomor baris, dan kalimat
(`message`) untuk tiap temuan. Yang tersisa hanya menampilkannya di Cermin 4.
Tidak ada data baru yang disimpan; daftar dihitung dari `code`. Kode akhir
dipotong di 4.000 karakter, jadi daftar bisa tidak lengkap untuk kode yang
lebih panjang dari itu.

### 9.4 Salah tombol simbol (C-04)

Dihitung di `computeMetrics` dari log: suntingan satu karakter simbol, diikuti
hapus satu karakter di posisi yang sama, diikuti simbol lain, semuanya dalam
rangkaian bersambung. Kolom baru `symbolFumbles` bersifat opsional supaya
percobaan lama tetap sah.

---

## 10. Rancangan R4 — alat pengajar dan kontrol

### 10.1 Rekap kelas (P-01) dan CSV (P-02)

- Tanpa backend. Pengajar memilih banyak berkas telemetri; semuanya dibaca di
  browser.
- Tempat: tampilan baru di dalam halaman `admin/` yang sudah ada, atau halaman
  statis tersendiri. Halaman admin menuntut masuk akun admin; pengajar yang
  bukan admin tidak bisa memakainya. **Usulan: halaman tersendiri tanpa
  login**, karena tidak ada data yang keluar dari perangkat pengajar.
- `profileName` dan `deviceId` dibuang saat berkas dibaca. Peserta ditampilkan
  sebagai nomor urut.
- Yang dipakai dari tiap berkas adalah percobaan pertama (atau `baseline`).
- Tampilan: sebaran hasil, cacat yang paling sering lolos, tombol lumpuh
  terbanyak, median waktu beku, keyakinan diri berbanding hasil.
- Fungsi agregasi murni di `src/lib/trapRecap.ts` supaya bisa diuji di Node.
- CSV: satu baris per percobaan. Kolom: nomor peserta, skenario, tanggal,
  keyakinan, hasil, cacat diperbaiki, durasi, cara berakhir, jumlah beku, total
  beku, efek domino, jumlah Jalankan, tombol lumpuh (digabung), upaya tempel,
  keluar jendela.

### 10.2 Persetujuan perekaman (P-03)

Bergantung pada O1. Bila data dipakai untuk penelitian:

- kotak centang wajib di pengarahan, dengan teks yang menyebut tujuan
  penelitian;
- pilihan "ikut tanpa menyimpan log mentah": percobaan disimpan tanpa `log` dan
  tanpa `code`;
- penanda `consent` di tiap percobaan, supaya rekap hanya memakai yang setuju.

### 10.3 Sakelar admin (P-04)

`validateSettings()` di `shared/site-settings.mjs` menolak dokumen yang
kuncinya tidak persis sama dengan daftar. Menambah kunci berarti:

1. tambahkan kunci (usulan: `features: { aiTrap: boolean }`) ke nilai bawaan
   dan ke pemeriksa;
2. tambahkan langkah migrasi baca-saja seperti yang sudah ada untuk
   `RETIRED_GAME_IDS`, yang mengisi kunci itu pada dokumen lama;
3. perbarui `tests/site-settings.test.mjs` dan
   `scripts/test-settings-browser.mjs`;
4. `needsTrapGate` dan `trapVisibleFor` menerima sakelar itu dari `App.tsx`.

Bila pengaturan gagal dimuat, modul tetap aktif.

### 10.4 Hapus data (P-06)

Tombol di riwayat mengosongkan `attempts` dan `baseline`, lalu menyetel
`deferred: true` supaya gerbang tidak muncul lagi. XP yang sudah diberikan
tidak ditarik.

Satu hal yang harus ikut diubah: `recordTrap()` memberi 30 XP bila daftar
percobaan kosong. Setelah data dihapus, percobaan berikutnya akan memberi XP
lagi. Pemberian XP perlu pindah ke penanda tersendiri (`xpGranted: true`).

---

## 11. Rancangan R5 — pengerasan

- **Tata letak keyboard (H-01).** Peta panas memetakan karakter ke posisi
  QWERTY-US. Langkah pertama: tulis keterangan itu di bawah peta. Deteksi tata
  letak lewat `navigator.keyboard.getLayoutMap()` hanya ada di sebagian
  browser, jadi peringatan otomatis bersifat tambahan.
- **Pembaca layar (H-02).** Peta panas butuh alternatif teks berupa daftar
  tombol lumpuh dan jedanya; putar ulang butuh ringkasan teks. Perlu diuji
  dengan pembaca layar sungguhan sebelum diklaim selesai.
- **Jembatan ke Tahap 2 (H-03).** Kolom opsional `reflection` (teks, dibatasi
  panjangnya) pada percobaan, diisi di akhir diagnosis. Bentuk Tahap 2 sendiri
  belum dirancang.

---

## 12. Strategi uji

| Lapis | Alat | Cakupan |
|---|---|---|
| Unit | `node --test tests/ai-trap.test.mjs` | Lint, metrik, putar ulang, skenario, aturan gerbang, pemangkasan riwayat |
| Tipe | `npm run lint` (`tsc --noEmit`) | Seluruh proyek |
| Alur browser | `scripts/test-trap-browser.mjs` (rencana, §8.2) | Gerbang, arena, diagnosis, riwayat, unduhan |
| Manual | Daftar periksa di `docs/059_…` §6 | Firefox, Safari, pembaca layar |
| Lapangan | Uji coba dengan mahasiswa | Ambang, durasi, nada |

Uji alur browser sejauh ini dijalankan dari skrip sementara di luar repo.
Hasilnya tercatat di 054 §7 dan 055 §5, tetapi skripnya tidak tersimpan.

---

## 13. Keputusan rancangan

| Keputusan | Pilihan | Alternatif yang ditolak | Alasan |
|---|---|---|---|
| Eksekusi | iframe ter-sandbox | Web Worker dengan DOM tiruan (053) | Skenario HTML dan CSS butuh DOM sungguhan |
| Perulangan | Tidak dijalankan | Batas waktu saja | Tidak ada jaminan iframe berjalan di proses terpisah di semua browser; perulangan tak berujung bisa membekukan arena. Skenario tidak membutuhkan perulangan |
| Pemantau | Di depan kode, satu baris | Di belakang kode | Tidak tertelan tag yang belum ditutup; nomor baris tetap cocok |
| Efek domino | Per identitas temuan | Selisih jumlah temuan | Menukar satu error dengan error lain tetap kerusakan baru |
| Deteksi perangkat | `lacksPhysicalKeyboard()` | `isTouchDevice()` | Laptop berlayar sentuh tidak boleh lolos |
| Letak gerbang masuk | Diturunkan saat render | Effect setelah Dashboard tampil | Dashboard tidak boleh sempat terlihat |
| Penyimpanan | Irisan di `save_data` | Tabel khusus | Tanpa migrasi skema |
| Log mentah | Di dalam save, 5 terbaru | Kunci lokal terpisah, 1 terbaru (053 K5) | Keputusan pemilik: simpan log, rekaman, riwayat |
| Peta panas | Hanya jeda di tengah rangkaian | Semua jeda sebelum tombol | Jeda setelah pindah kursor adalah waktu membaca |

---

## 14. Kontrak data ke Tahap 3 – Aksi

Tahap 3 (`docs/060_…`) membaca hasil Tahap 1 dan memakai ulang sebagian
kodenya. Belum ada yang dibangun.

| Yang dipakai Tahap 3 | Sumber di Tahap 1 | Catatan |
|---|---|---|
| Benih urutan latihan | `aiTrap.baseline.metrics.slowKeys` (atau percobaan pertama) | Per tombol, bukan per pasangan. Hanya dipakai bila `contiguousKeys ≥ MIN_HEATMAP_KEYS` |
| Batas "berhenti berpikir" | `SLOW_MS = 2000` | Selang antar-tombol di atas ini tidak masuk latensi transisi |
| Tata letak keyboard | `KeyboardHeatmap.tsx` (`ROWS`) | Perlu dipisah supaya bisa menyorot satu tombol tanpa data jeda (X-03) |
| Pemeriksa struktur | `trapLint.ts` (`lintDoc`) | Memeriksa bank **per blok** dan jawaban baris boss saat uji. Tidak bisa dipakai per baris: 64 dari 161 baris drill dilaporkan rusak bila berdiri sendiri. Tidak melihat cacat seperti `if (x = 5)` (`docs/063_…` §6.1, §8.3) |
| Pola cacat | `TrapDef` di `aiTrapScenarios.ts` | Kutip tidak ditutup, titik koma hilang di antara dua deklarasi CSS, nama variabel nyaris sama: dipakai ulang sebagai baris boss |
| Prinsip pembongkaran | Cermin 5 | Layar setelah boss menyebut baris itu buatan tim |

**X-01, fungsi benih.** `trapSeedKeys(state: AiTrapState | undefined): string[]`
di `trapMetrics.ts`: ambil `baseline` bila ada, selain itu `attempts[0]`;
kembalikan `slowKeys` bila ketukan bersambung cukup, selain itu daftar kosong.
Murni dan teruji di Node.

**Arah ketergantungan.** Tahap 3 boleh mengimpor dari berkas `trap*`; berkas
`trap*` tidak mengimpor apa pun dari Tahap 3. Data Tahap 3 hidup di irisan
`SaveData.wave` yang terpisah dari `aiTrap`.

**Dua data ketik, dua definisi.** Tahap 1 mengukur jeda sebelum satu tombol di
editor bebas; Tahap 3 mengukur selang antara dua tombol benar di arena yang
menolak salah tekan. Angkanya tidak bisa dibandingkan langsung. Pembanding
sebelum dan sesudah yang sah adalah mengulang simulasi Tahap 1.
