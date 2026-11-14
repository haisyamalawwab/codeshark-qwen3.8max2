# 052 — Rencana: Blind Live-Coding Challenge (Tahap 1 – Pemicu / *Disorienting Dilemma Mode*)

> Disimpan: 13-11-2026 21:45 WIB (+07).
> Branch kerja: `arena/25443d5c-codeshark-qwen3-8max2` (dari `main` @ `a3d2d87`).
> Status: **digantikan oleh dokumen 053** (The AI-Trap & Production Crisis
> Simulator) pada 13-11-2026 21:50 WIB. Rencana ini tidak diimplementasikan;
> bagian yang masih berlaku sudah disalin ke 053.

---

## 1. Ringkasan

Sebelum mahasiswa masuk ke latihan reguler (Quest / Drill / Juggling), aplikasi
menjalankan satu sesi **Blind Live-Coding Challenge** selama **3 menit**:
mahasiswa menulis kode dari halaman kosong berdasarkan soal berbahasa manusia,
tanpa kode contoh, tanpa pewarnaan sintaks, tanpa pratinjau, tanpa autocomplete,
dan tanpa tempel.

Setelah waktu habis, aplikasi menampilkan **Rapor Kegagapan Sintaksis**: berapa
kali mahasiswa berhenti lama sebelum `{ }` dan `;`, berapa *syntax error* pada
kodenya, dan berapa lama ia "beku". Rapor inilah pemicu kesadaran (fase 1
Mezirow) sebelum latihan reguler dibuka.

Mode latihan reguler tidak bisa dipakai ulang untuk ini, karena di `TypingGame`
kode acuan selalu terlihat dan tombol salah tidak pernah masuk ke teks. Mode itu
mengukur kecepatan **menyalin**, bukan kemampuan **mengingat sintaks**. Fitur ini
butuh editor bebas dan mesin ukur sendiri.

---

## 2. Keputusan yang perlu dikonfirmasi

Setiap baris punya nilai bawaan. Bila tidak ada keberatan, implementasi memakai
nilai bawaan tersebut.

| # | Keputusan | Bawaan yang diusulkan | Alasan |
|---|---|---|---|
| D1 | Siapa yang wajib mengerjakan | Wajib untuk kelompok `academy` (Mahasiswa/Umum). Opsional untuk `senior`. Tidak ditampilkan untuk `junior` dan `teen`. | Narasi ketergantungan AI ditujukan ke mahasiswa; aplikasi ini juga dipakai anak 10–15 tahun. |
| D2 | Bentuk soal | Satu halaman mini campuran HTML + `<style>` + `<script>`, tiga varian yang dipilih acak. | Hanya soal campuran yang memunculkan `< >`, `{ }`, dan `;` sekaligus. Soal HTML murni tidak punya `{ }` maupun `;`. |
| D3 | Sifat gerbang | Wajib satu kali sebelum latihan pertama, tidak bisa dilewati di laptop. Pengguna lama yang sudah punya progres juga terkena satu kali. Di HP ditunda (lihat 5.4). | Rapor pertama menjadi *baseline* untuk dibandingkan dengan pengulangan di tahap berikutnya. |
| D4 | Nada rapor | Kalimat "kemampuan dasarmu lumpuh" hanya muncul bila angkanya memang buruk. Hasil yang baik mendapat kalimat yang sesuai. | Rapor yang menuduh mahasiswa yang ternyata lancar akan merusak kepercayaan pada alat ukurnya. |
| D5 | Data untuk dosen | MVP: tersimpan di perangkat dan ikut tersinkron sebagai bagian `save_data`. Rekap per kelas dikerjakan sebagai fase lanjutan. | Tidak butuh migrasi skema TiDB sekarang. |
| D6 | Pertanyaan keyakinan diri sebelum mulai | Disertakan: satu pertanyaan skala 1–5, "Seberapa yakin kamu bisa menulis ini tanpa AI?". | Selisih antara keyakinan dan hasil adalah inti dilemanya. Tanpa itu, pemula murni hanya melihat "saya memang belum bisa". |

---

## 3. Alur pengguna

1. Mahasiswa menekan tombol latihan apa pun (peta pertemuan, misi, tantangan
   harian, atau lanjut dari materi).
2. Bila ia terkena gerbang (D1, D3) dan belum punya rapor, aplikasi membuka layar
   **Pengantar** alih-alih arena. Materi bacaan tetap bebas diakses.
3. Layar Pengantar menjelaskan aturan, apa yang direkam (bagian 8.3), dan
   meminta jawaban keyakinan diri (D6).
4. Hitung mundur 3-2-1, lalu soal dan editor kosong tampil. Timer 180 detik
   langsung berjalan.
5. Sesi berakhir saat waktu habis atau mahasiswa menekan **Saya selesai**.
6. **Rapor Kegagapan Sintaksis** tampil (bagian 7).
7. Tombol **Mulai latihan reguler** membawa mahasiswa ke sesi yang tadi ia tuju.

Setelah rapor pertama ada, gerbang tidak muncul lagi. Rapor bisa dibuka ulang
dan tantangan bisa diulang dari Dashboard; hasil ulangan disimpan sebagai
percobaan berikutnya, tidak menimpa *baseline*.

---

## 4. Soal

Soal ditulis sebagai daftar tuntutan, bukan kode. Jawaban acuan dibuat sekitar
170–250 karakter supaya penulis yang lancar bisa selesai dalam 3 menit.

Contoh varian "Tombol Penghitung":

- Buat tombol ber-`id` `btn` bertuliskan "Klik".
- Buat paragraf ber-`id` `angka` berisi `0`.
- Beri tombol itu `padding` 8px dan teks berwarna putih lewat CSS.
- Buat variabel `n` bernilai 0 dan fungsi `tambah` yang menaikkan `n` sebesar 1.

Tiap soal membawa daftar **cek spesifikasi** (misalnya: ada elemen `button`
dengan `id="btn"`; ada aturan CSS dengan dua deklarasi; ada deklarasi fungsi
`tambah`). Rapor menampilkan berapa cek yang terpenuhi, terpisah dari angka
*syntax error*.

Dua varian lain mengikuti pola yang sama (misalnya "Kartu Sapaan" dan "Daftar
Tugas Mini"). Varian dipilih acak, dan percobaan ulang tidak memakai varian yang
sama dengan percobaan sebelumnya.

---

## 5. Aturan "Blind, No-AI & No-Autocomplete"

### 5.1 Yang dihilangkan dari layar

- Kode acuan, petunjuk karakter berikutnya, pewarnaan sintaks, dan pratinjau.
- Umpan balik benar/salah, combo, skor, nyawa, dan hiu selama sesi berjalan.
- Tombol jeda. `Esc` tidak menghentikan timer.

### 5.2 Yang dimatikan di editor

Editor adalah `<textarea>` polos dengan `autocomplete="off"`,
`autocorrect="off"`, `autocapitalize="off"`, `spellcheck={false}`, dan atribut
penolak ekstensi pengisi otomatis. Tidak ada penutup kurung otomatis dan tidak
ada indentasi otomatis. `Tab` menyisipkan dua spasi.

### 5.3 Yang ditolak dan dicatat

| Kejadian | Tindakan |
|---|---|
| Tempel, seret-lepas teks, klik kanan | Ditolak, dihitung sebagai "upaya tempel". |
| Sisipan teks pengganti (saran keyboard, koreksi otomatis) | Ditolak lewat `beforeinput`, dihitung. |
| Peristiwa ketik sintetis (`isTrusted === false`) | Diabaikan, dihitung. |
| Pindah tab atau jendela kehilangan fokus | Timer **tetap jalan**; jumlah dan total detiknya dicatat. |

Timer dihitung dari tenggat `performance.now()`, bukan dari jumlah detak
interval, sehingga tab yang diperlambat browser tidak memperpanjang waktu.

### 5.4 Batas yang harus diakui

- Browser tidak bisa mencegah mahasiswa bertanya ke AI lewat perangkat kedua.
  Fitur ini alat penyadaran, bukan ujian terawasi.
- Untuk menghilangkan alasan curang, hasil tantangan **tidak memengaruhi nilai,
  rank, maupun koin**. Hadiahnya tetap: 30 XP sekali, berapa pun hasilnya.
- Di HP, saran kata keyboard tidak bisa dimatikan sepenuhnya dan simbol sulit
  dijangkau, sehingga angkanya tidak sahih. Di perangkat sentuh tantangan
  ditunda: Dashboard menampilkan kartu "Kerjakan di laptop", dan latihan reguler
  (Coding Tower) tetap terbuka.

---

## 6. Metrik dan definisi operasional

Semua angka dihitung dari log ketikan yang hanya hidup di memori selama sesi.

| Metrik | Definisi | Ambang awal |
|---|---|---|
| Jeda dasar pribadi | Median selang antar-ketik untuk huruf dan angka, tanpa selang di atas 2 detik. | — |
| **Jeda panjang sebelum `{ }`** | Selang sebelum mengetik `{` atau `}` yang melewati ambang. | ≥ 1,5 detik **dan** ≥ 4× jeda dasar |
| **Jeda panjang sebelum `;`** | Sama, untuk `;`. | sama |
| Jeda panjang sebelum simbol lain | Sama, untuk `( ) [ ] < > / = : " '`. | sama |
| Salah tombol simbol | Simbol diketik, dihapus, lalu diganti simbol lain dalam dua ketukan. | — |
| Beku | Selang tanpa ketikan yang tidak diikuti simbol. | ≥ 5 detik |
| Latensi awal | Waktu dari "MULAI" sampai karakter pertama. | — |
| Koreksi | Jumlah ketukan `Backspace`/`Delete`. | — |
| Kecepatan menulis | Karakter bersih per menit, dibandingkan dengan `stats.bestWpm` mode salin bila sudah ada. | — |
| ***Syntax error*** | Jumlah temuan pemeriksa sintaks pada kode akhir (6.1). | — |
| Cek spesifikasi | Tuntutan soal yang terpenuhi, dari total. | — |
| Integritas | Upaya tempel, sisipan ditolak, jumlah dan lama keluar fokus. | — |

Ambang memakai kelipatan jeda dasar pribadi supaya pengetik yang memang lambat
tidak otomatis dicap gagap. Ambang ini **sementara** dan perlu dikalibrasi
setelah uji coba pada satu kelas.

Jeda sebelum simbol adalah indikator, bukan diagnosis: mahasiswa bisa saja
sedang memikirkan logika, bukan mencari tombol. Rapor menyebutnya "jeda sebelum
simbol" dan menyandingkannya dengan "salah tombol simbol" yang lebih tegas.

### 6.1 Pemeriksa sintaks

Pemeriksa dibuat sendiri tanpa dependensi, mengikuti pola `src/lib/highlight.ts`
dan `src/lib/markdown.ts`. Kode dipecah menjadi wilayah HTML, isi `<style>`, dan
isi `<script>`, lalu tiap wilayah diperiksa:

- **Semua wilayah:** pasangan `{ } ( ) [ ]` yang tidak ditutup, tertukar, atau
  berlebih; tanda kutip yang tidak ditutup.
- **HTML:** tag tidak ditutup, tag penutup tanpa pembuka, susunan bersilang,
  `<` tanpa `>`.
- **CSS:** deklarasi tanpa `:`, `;` yang hilang di antara dua deklarasi, aturan
  tanpa selektor.
- **JavaScript:** selain pindaian di atas, kode diuji dengan `new Function(kode)`
  sebagai pemeriksa akhir. Fungsi itu hanya diurai, tidak pernah dijalankan.

Dua hal yang sengaja dibedakan di rapor:

- Di JavaScript, `;` yang hilang **bukan** *syntax error* (ada *automatic
  semicolon insertion*). Ia dilaporkan sebagai "titik koma terlewat", terpisah
  dari hitungan error. Di CSS, `;` yang hilang di antara deklarasi memang error.
- Blok yang belum ditutup karena waktu habis diberi label "belum ditutup saat
  waktu habis", supaya terbedakan dari kesalahan pada baris yang sudah selesai.

*Syntax error* dihitung pada kode akhir saja. Menghitung selama mengetik tidak
andal, karena kode yang sedang ditulis selalu berisi blok terbuka.

---

## 7. Rapor Kegagapan Sintaksis

Urutan isi dari atas ke bawah:

1. **Tiga angka utama:** jeda panjang sebelum `{ }`, jeda panjang sebelum `;`,
   dan jumlah *syntax error*. Masing-masing dengan jeda terlama dalam detik.
2. **Garis waktu 180 detik** (SVG polos): blok mengetik, blok beku, dan penanda
   tiap jeda simbol.
3. **Daftar *syntax error*** dengan nomor baris dan kalimat manusia, misalnya
   "Kurung kurawal `{` di baris 7 tidak pernah ditutup".
4. **Angka pendukung:** waktu beku total dan persentasenya, latensi awal,
   koreksi, salah tombol simbol, cek spesifikasi, kecepatan menulis berbanding
   kecepatan menyalin.
5. **Keyakinan berbanding hasil** (D6): "Kamu menilai dirimu 4 dari 5. Kodemu
   memenuhi 1 dari 4 tuntutan."
6. **Catatan integritas** bila ada upaya tempel atau keluar fokus.
7. **Kalimat penutup** sesuai tingkat, lalu tombol **Mulai latihan reguler**.

Tingkat ditentukan dengan aturan yang ditampilkan terbuka di rapor:

| Tingkat | Aturan sementara |
|---|---|
| Gagap berat | *Syntax error* ≥ 3, **atau** jeda simbol ≥ 5, **atau** beku ≥ 40% waktu |
| Tersendat | Ada *syntax error* atau jeda simbol, tetapi di bawah ambang di atas |
| Lancar | Tanpa *syntax error*, jeda simbol ≤ 1, beku < 15% waktu |

Kalimat penutup untuk "Gagap berat" menyebut terus terang bahwa otot sintaksis
dasarnya tidak bekerja tanpa bantuan. Kalimat untuk "Lancar" mengakui hasilnya
dan mengarahkan ke latihan kecepatan. Semua kalimat menutup dengan arah
tindakan, karena rapor yang hanya mempermalukan akan membuat mahasiswa berhenti,
bukan berefleksi.

---

## 8. Data dan penyimpanan

### 8.1 Bentuk data

`SaveData` mendapat satu irisan opsional baru:

```ts
interface BlindAttempt {
  id: string; at: number; briefId: string;
  durationSec: number; chars: number; confidence?: 1 | 2 | 3 | 4 | 5;
  braceHesitations: number; semicolonHesitations: number; otherSymbolHesitations: number;
  longestSymbolPauseMs: number; symbolFumbles: number;
  freezes: number; frozenMs: number; firstKeyMs: number; corrections: number;
  syntaxErrors: { line: number; region: "html" | "css" | "js"; code: string; unfinished?: boolean }[];
  missingJsSemicolons: number; specPassed: number; specTotal: number;
  pasteAttempts: number; rejectedInserts: number; blurCount: number; blurMs: number;
  level: "lancar" | "tersendat" | "gagap-berat";
  timeline: number[];      // 36 ember × 5 detik: jumlah karakter per ember
  code: string;            // kode akhir, dipotong maksimal 4.000 karakter
}
interface BlindState { attempts: BlindAttempt[]; deferred?: boolean }  // maks. 10 percobaan
```

### 8.2 Dampak ke penyimpanan yang ada

- `parseSave()` sudah menyalin kunci tak dikenal (`...d`), sehingga save lama
  tetap terbaca. Ditambah penormal untuk irisan `blind`.
- Sinkron cloud mengirim seluruh save sebagai `save_data` dan `validatePayload()`
  hanya memeriksa `modules`, `stats`, `xp`, `coins`. Irisan baru ikut tersimpan
  **tanpa migrasi skema**. Sepuluh percobaan berukuran jauh di bawah batas 1 MB.
- Percobaan blind **tidak** dicatat ke `history.ts` / `cs_attempts`. Bentuk
  `AttemptRecord` (bintang, skor, WPM) tidak cocok dan akan mengotori Riwayat
  Misi serta statistik.

### 8.3 Privasi

- Log waktu ketikan mentah tidak disimpan dan tidak dikirim; hanya agregat di
  atas dan kode akhir.
- Layar Pengantar menyebutkan dengan jelas apa yang direkam.

---

## 9. Perubahan berkas

| Berkas | Perubahan |
|---|---|
| `src/lib/blindMetrics.ts` (baru) | Fungsi murni: log ketikan → metrik, tingkat, garis waktu. |
| `src/lib/blindLint.ts` (baru) | Pemeriksa sintaks HTML/CSS/JS dan pemecah wilayah. |
| `src/data/blindChallenges.ts` (baru) | Tiga soal, cek spesifikasi, ambang, daftar kelompok usia yang terkena gerbang. |
| `src/ui/BlindChallenge.tsx` (baru, *lazy chunk*) | Pengantar → hitung mundur → editor → selesai. |
| `src/ui/BlindReportCard.tsx` (baru) | Rapor dan garis waktu SVG. |
| `src/App.tsx` | Layar `blind` dan `blind-report`; gerbang di `enterPractice()`, satu-satunya pintu masuk semua latihan; menyimpan sesi tujuan untuk dilanjutkan. |
| `src/lib/storage.ts` | Tipe `BlindAttempt`/`BlindState` dan penormal di `parseSave()`. |
| `src/ui/Dashboard.tsx` | Kartu "Rapor Kegagapan": lihat rapor, ulangi, atau "Kerjakan di laptop". |
| `src/ui/ui.css` | Gaya editor polos dan rapor, termasuk `prefers-reduced-motion`. |
| `tests/blind-metrics.test.mjs`, `tests/blind-lint.test.mjs` (baru) | Uji unit lewat bundel esbuild, pola `tests/boot-loading.test.mjs`. |
| `package.json` | Skrip `test:blind`. |
| `README.md`, dokumen `docs/053_…` | Fitur dan catatan implementasi. |

Yang dipakai ulang dari kode sekarang: lapisan hitung mundur, token tema, `sfx`,
ikon, dan `isShortcut()` dari `src/lib/typing.ts`.

---

## 10. Tahapan kerja

| Fase | Isi | Selesai bila |
|---|---|---|
| F1 | `blindMetrics.ts`, `blindLint.ts`, dan ujinya | `npm run test:blind` lulus untuk kasus bagian 11 |
| F2 | Editor tantangan: pengantar, timer, pemblokiran, pencatatan | Sesi 180 detik berjalan dan menghasilkan log yang benar |
| F3 | Rapor dan garis waktu | Rapor tampil benar untuk tiga tingkat |
| F4 | Gerbang di `App.tsx`, penyimpanan, kartu Dashboard, penundaan di HP | Pengguna baru dan lama melewati gerbang tepat satu kali |
| F5 | `npm run lint`, `npm run build`, uji manual, README, dokumen 053 | Semua pemeriksaan lulus |
| Lanjutan | Rekap kelas untuk dosen, ekspor CSV, sakelar di panel admin, kalibrasi ambang | Di luar MVP |

Sakelar di panel admin ditunda karena `validateSettings()` memeriksa daftar kunci
secara persis; menambah kunci baru berarti memigrasi dokumen pengaturan yang
sudah tersimpan.

---

## 11. Pengujian dan kriteria terima

Uji unit:

- Jeda 3 detik sebelum `{` terhitung satu jeda kurung kurawal; jeda 3 detik
  sebelum huruf tidak terhitung.
- Pengetik lambat merata (selang 900 ms) tidak menghasilkan jeda simbol.
- `[` lalu hapus lalu `{` terhitung satu salah tombol simbol.
- Pemeriksa sintaks: `{` tak ditutup, `}` berlebih, tag bersilang, deklarasi CSS
  tanpa `;`, kutip tak ditutup, dan kode benar yang menghasilkan nol temuan.
- `;` hilang di JS masuk "titik koma terlewat", bukan *syntax error*.
- Save lama tanpa irisan `blind` terbaca tanpa galat.

Uji manual di peramban:

- Tempel, seret-lepas, dan klik kanan ditolak dan terhitung.
- Pindah tab 10 detik: timer tetap berkurang 10 detik dan tercatat di rapor.
- Muat ulang di tengah sesi: sesi batal, percobaan baru memakai varian soal lain.
- Setelah rapor pertama, tombol latihan langsung membuka arena.
- Profil `junior` dan `teen` tidak pernah melihat gerbang.
- Di perangkat sentuh, kartu penundaan tampil dan Coding Tower tetap bisa dimainkan.
- `/codingshark/` dan `/codingtower/` berperilaku sama dengan entri utama.

---

## 12. Risiko

| Risiko | Penanganan |
|---|---|
| Mahasiswa merasa dipermalukan lalu berhenti memakai aplikasi | Hasil tidak memengaruhi nilai; kalimat penutup selalu memberi arah; nada mengikuti hasil (D4). |
| Pemula murni: gagal dianggap wajar, bukan dilema | Pertanyaan keyakinan diri (D6) dan perbandingan dengan kecepatan menyalin. |
| Ambang jeda keliru mengecap | Ambang relatif terhadap jeda dasar pribadi; aturan tingkat ditampilkan; kalibrasi setelah uji kelas. |
| Pemeriksa sintaks buatan sendiri salah hitung | Cakupan soal sempit dan diketahui; uji unit per aturan; `new Function` sebagai pemeriksa akhir JS. |
| Ekstensi peramban tetap menyisipkan teks | Ditolak lewat `beforeinput` dan `isTrusted`; sisanya tercatat di integritas. |
| Kebutuhan aksesibilitas (motorik, pembaca layar) | Tautan "Saya tidak bisa mengerjakan ini" di Pengantar: menandai `deferred`, membuka latihan, tanpa rapor. |
| Kebijakan CSP di masa depan melarang `new Function` | Saat ini tidak ada CSP di `netlify.toml`, `vercel.json`, maupun templat nginx. Bila ditambahkan, pemeriksa JS jatuh ke pindaian sendiri. |

---

## 13. Di luar cakupan rencana ini

- Tahap 2 dan seterusnya dari modul transformatif (refleksi tertulis, dialog,
  rencana tindakan). Rapor hanya menyiapkan datanya.
- Tabel TiDB khusus dan dasbor dosen.
- Pengawasan ujian (kamera, layar penuh paksa, kunci peramban).
