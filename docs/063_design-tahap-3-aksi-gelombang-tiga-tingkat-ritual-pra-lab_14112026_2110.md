# 063 — Design: Tahap 3 – Aksi, Gelombang Tiga Tingkat & Ritual Pra-Lab

> Disimpan: 14-11-2026 21:10 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: **rancangan; belum ada yang dibangun.** Menggantikan `docs/060_…` §8
> sebagai rancangan yang berlaku. Angka ambang di sini adalah nilai awal.
> Dokumen pasangan: `docs/061_…` (PRD), `docs/062_…` (Requirement), `docs/064_…` (Tasklist).

---

## 1. Lingkup

Dokumen ini menjelaskan cara kebutuhan di `docs/062_…` dibangun di atas kode
yang ada pada `79a66c6`. Bagian yang menyebut hasil percobaan memakai skrip
sementara yang menjalankan kode repo (pemeriksa struktur, data drill, mesin
JavaScript di Node); skripnya tidak disimpan di repo.

---

## 2. Arsitektur

```
Dashboard ── WaveCard ("Ritual Pra-Lab")
   │
   └─► App.tsx  layar "wave" ──► WaveGame (dimuat malas)
                                   ├─ waveEngine   aturan ketik: blok · kartu · boss   (murni)
                                   ├─ waveGen      memilih blok, kartu, baris boss     (murni)
                                   ├─ wavePacing   pengatur ritme                      (murni)
                                   ├─ waveStats    transisi, status, jadwal kartu      (murni)
                                   └─► WaveResults  hasil · pembongkaran · layar bukti
                                          │
                                          └─► App.recordWave() ─► SaveData.wave ─► localStorage ─► sinkron

TypingGame (arena lama) ── hanya ditambah pencatat transisi ──► GameResult.transitions ─► SaveData.wave
```

| Lapis | Berkas baru | Sifat |
|---|---|---|
| Data | `src/data/waveBank.ts` (blok, kartu, baris boss), `src/data/waveConfig.ts` (semua ambang) | Tanpa React |
| Logika | `src/lib/waveStats.ts`, `waveGen.ts`, `waveEngine.ts`, `wavePacing.ts` | Murni; diuji di Node |
| Antarmuka | `src/ui/WaveGame.tsx`, `WaveResults.tsx`, `WaveCard.tsx` | React; memakai ulang gaya arena |
| Uji | `tests/wave.test.mjs`, skrip `test:wave` | Pola sama dengan `tests/ai-trap.test.mjs` (dibundel dengan esbuild) |

| Berkas lama | Perubahan |
|---|---|
| `src/ui/TypingGame.tsx` | Pencatat transisi (§5.3). Tidak ada perubahan perilaku |
| `src/lib/storage.ts` | Irisan opsional `wave` dan penormalnya |
| `src/App.tsx` | Layar `wave`, `recordWave()`, penggabungan transisi dari arena lama |
| `src/ui/Dashboard.tsx` | Memasang `WaveCard` |
| `src/ui/KeyboardHeatmap.tsx` | Tata letak dipisah supaya bisa menyorot satu tombol (`docs/059_…` T5.6) |
| `package.json` | Skrip `test:wave` |

Arah ketergantungan: berkas `wave*` boleh mengimpor `trapLint`, `trapMetrics`
(`SLOW_MS`, fungsi benih), `highlight`, dan `quests`. Tidak ada berkas lama
yang mengimpor dari `wave*` selain `App.tsx`, `Dashboard.tsx`, dan `storage.ts`.

---

## 3. Mesin arena

### 3.1 Yang ada

`TypingGame.tsx` (572 baris) menyatukan aturan ketik, bilah ancaman, skor,
efek, dan tampilan dalam satu komponen. Aturannya: tombol dibandingkan dengan
satu karakter target; yang salah tidak masuk ke teks; baris selesai otomatis
saat karakter terakhir benar; Backspace memundurkan kursor; jendela yang
ditinggalkan menjeda permainan. Indentasi ikut menjadi target: 148 dari 224
baris kode Quest diawali spasi yang harus diketik.

### 3.2 Pilihan

| Pilihan | Untung | Rugi |
|---|---|---|
| A. Menambah mode ke `TypingGame` lewat props | Satu komponen | Tiga aturan baru (samaran, boss, ritual) masuk ke komponen yang dipakai semua sesi; kesalahan merusak Quest, Drill, Juggling |
| B. Komponen baru dengan aturan di reducer murni | Arena lama tidak tersentuh; aturan boss dan samaran bisa diuji di Node | Sebagian tampilan arena ditulis dua kali |
| C. Mengekstrak mesin bersama dari `TypingGame`, dipakai keduanya | Tanpa duplikasi | Merombak arena lama sebelum ada uji alur untuknya |

**Dipilih: B.** C layak dipertimbangkan setelah uji alur browser untuk arena
lama ada di repo (`docs/059_…` T2.3).

### 3.3 `waveEngine`: reducer murni

```ts
type WaveItem =
  | { kind: "blok";  id: string; lang: Lang; lines: string[] }
  | { kind: "kartu"; id: string; lang: Lang; text: string; level: 0 | 1 | 2; label?: string }
  | { kind: "boss";  id: string; lang: Lang; shown: string; answers: string[]; explain: string };

type EngineEvent =
  | { t: "key"; key: string; at: number; repeat: boolean }
  | { t: "backspace" }
  | { t: "enter"; at: number }
  | { t: "break" };                 // jeda, keluar jendela, pindah butir

type Effect =
  | { t: "ok" } | { t: "wrong"; expected: string; got: string }
  | { t: "sample"; key: string; ms: number }        // satu latensi transisi
  | { t: "attempt"; key: string; ok: boolean }      // untuk akurasi transisi
  | { t: "confusion"; pair: string }                // "[→{"
  | { t: "reveal"; pos: number }                    // bantuan Tingkat 2
  | { t: "lineDone"; clean: boolean }
  | { t: "copied" } | { t: "defused" }
  | { t: "itemDone" };

step(state: EngineState, ev: EngineEvent): { state: EngineState; effects: Effect[] }
```

Komponen hanya meneruskan peristiwa keyboard ke `step`, lalu menjalankan efek
(suara, partikel, ancaman, pencatatan). Semua aturan di bagian 5, 7, dan 8
hidup di reducer ini.

Perbedaan dari arena lama, semuanya disengaja:

| Hal | Arena lama | Arena gelombang |
|---|---|---|
| Indentasi | Diketik | Blok dan kartu tanpa indentasi |
| Backspace | Memundurkan kursor | Tidak mengubah teks; membatalkan Blok Bersih |
| Tombol yang ditahan | Dihitung berulang | `repeat` diabaikan untuk latensi |
| Akhir baris boss | — | Enter |
| Jendela ditinggalkan | Menjeda | Di ritual jam tetap berjalan; rantai latensi diputus |

---

## 4. Data

```ts
SaveData.wave?: WaveState

interface TransStat {
  n: number;          // jumlah sampel latensi seumur profil
  recent: number[];   // latensi ms, 10 terakhir
  hist: string;       // hasil 20 percobaan terakhir, "1" benar pertama kali, "0" salah
}
interface CardState {
  level: 0 | 1 | 2;
  box: number;        // 0–4
  due: string;        // YYYY-MM-DD
  passDays: string[]; // tanggal lulus di level sekarang, paling banyak 2
  helped: number;
}
interface BossStat { seen: number; defused: number; copied: number }
interface WaveSessionSummary {
  at: number; mode: "ritual" | "t1" | "t2" | "boss"; lang: Lang; durationMs: number;
  targets: { key: string; before: number | null; after: number | null }[];
  cards: { up: number; down: number; helped: number };
  boss: { defused: number; copied: number };
  hits: number;                       // nyawa yang hilang
  pace: { min: number; max: number };
  cleanLines: number; lines: number;
  cfg: { fluentMs: number };          // ambang yang berlaku saat itu
}
interface WaveState {
  trans: Record<string, TransStat>;           // kunci: "<bahasa>|<kunci transisi>"
  confusions: Record<string, number>;         // "[→{": 4
  cards: Record<string, CardState>;
  boss: Record<string, BossStat>;             // per id baris boss
  sessions: WaveSessionSummary[];             // 20 terakhir
  ritual: { lastDate: string | null; count: number; last?: WaveSessionSummary };
  recentBlocks: string[];                     // id blok sesi terakhir
  bossBriefed?: boolean;
}
```

- **Per bahasa.** Kunci transisi diawali bahasa, karena `a:` di CSS dan `a:`
  di JS adalah konteks yang berbeda.
- **Ambang ikut disimpan** di ringkasan sesi, supaya sesi lama tetap bisa
  dibaca setelah ambang dikalibrasi.
- **Ukuran.** Kode drill dan Quest yang ada memuat 54 kunci transisi untuk
  HTML, 22 untuk CSS, dan 61 untuk JS. Satu `TransStat` kira-kira 100 byte
  sebagai JSON. Dengan bank baru saya perkirakan irisan ini 20–30 kB; ini
  perkiraan, belum diukur. Angka sebenarnya diukur di W1 dan dijaga oleh uji
  W-04 (batas 50 kB).
- **Penormal.** `normalizeWave()` membuang entri yang bentuknya tidak dikenal
  dan memangkas `recent`, `hist`, dan `sessions`, dengan pola
  `normalizeAiTrap()`.
- **Sinkron.** Ikut `save_data`. `validatePayload()` di `server/tidb-sync.mjs`
  membatasi ukuran 1 MB dan memeriksa `xp` serta `coins`; irisan baru lewat
  tanpa perubahan skema. Jalur ini belum pernah dijalankan ke server
  sungguhan, sama seperti irisan `aiTrap`.
- **Riwayat.** Sesi gelombang tidak ditulis ke `history.ts` / `cs_attempts`
  dan tidak mengubah `stats` atau `modules`.

---

## 5. Pengukuran transisi

### 5.1 Kunci transisi

```
golong(c) = "a" bila huruf atau "_" · "9" bila angka · "␣" bila spasi · c bila simbol
kunci(a, b) = golong(a) + golong(b)      dicatat hanya bila a atau b simbol
```

Contoh: `g(` → `a(`; `=>` → `=>`; `) {` → `)␣` lalu `␣{`; `="` → `="`.

Mengapa digolongkan: status butuh 10 sampel. Pasangan persis seperti `g(` atau
`t(` jarang berulang, sedangkan gerak yang dilatih sama, yaitu menjangkau `(`
dari posisi mengetik. Simbol–simbol tetap persis, karena itulah yang dimaksud
naskah (`=>`).

Yang hilang karena penggolongan: jangkauan ke `(` dari huruf tangan kiri dan
tangan kanan tidak dibedakan. Itu diterima untuk rilis pertama.

### 5.2 Aturan sampel

Satu sampel latensi untuk `kunci(sebelumnya, ini)` dicatat bila:

1. kedua tombol benar pada percobaan pertama dan berurutan di baris yang sama;
2. tidak ada salah tekan, Backspace, jeda, atau keluar jendela di antaranya;
3. tombol kedua bukan pengulangan karena ditahan;
4. selangnya ≤ `maxGapMs` (2.000 ms, sama dengan `SLOW_MS` Tahap 1).

Satu **percobaan** untuk akurasi dicatat setiap kali tombol kedua diminta
setelah tombol pertama benar: "1" bila benar pada tekan pertama, "0" bila salah.

Waktu diambil dari `performance.now()` saat `keydown`. Shift bukan peristiwa
tersendiri, jadi latensi ke simbol ber-Shift sudah memuat waktu menekan Shift.

### 5.3 Pencatat di arena lama

Di cabang "tombol benar" pada `TypingGame`, simpan `{ ch, at, baris }`
terakhir; reset pada salah tekan, Backspace, jeda, dan keluar jendela. Sampel
dan percobaan dikumpulkan di memori dan dikembalikan lewat dua kolom opsional
di `GameResult`: `transitions` dan `confusions`. `App.finishPractice()`
menggabungkannya ke `save.wave` hanya bila kelompok usia profil termasuk
sasaran (W-05). Spasi indentasi di awal baris dilewati.

### 5.4 Status

```
sampel < minSamples (10)                         → belum cukup data
median(recent) < fluentMs dan akurasi(hist) > fluentAcc → lancar
selain itu                                        → lambat
```

`akurasi(hist)` = bagian "1" dalam 20 percobaan terakhir.

Tentang ambang: selang rata-rata pada 40 kata per menit adalah 300 ms dan pada
48 kata per menit 250 ms. Arena lama memberi bonus kecepatan mulai 40 kata per
menit. Apakah 250 ms realistis untuk simbol ber-Shift belum diketahui; fase W1
ada untuk menjawabnya.

---

## 6. Tingkat 1: bank dan generator

### 6.1 Blok

```ts
interface WaveBlock {
  id: string; lang: Lang;
  lines: string[];                 // 1–4 baris, tanpa indentasi
  vars?: Record<string, string[]>; // templat: {nama} → ["total", "skor", "harga"]
  lesson: number;                  // pertemuan paling awal yang boleh memakainya
}
```

Indeks `kunci transisi → id blok` dihitung sekali saat modul dimuat.

Kenapa blok dan bukan baris: saat 161 baris drill diperiksa satu per satu
dengan `lintDoc`, 64 di antaranya dilaporkan rusak (23 HTML, 28 CSS, 13 JS),
misalnya `<ul>` tanpa `</ul>` atau `} else {`. Baris seperti itu sah sebagai
bagian kode, tetapi tidak bisa diperiksa sendirian. Blok adalah satuan
terkecil yang bisa diperiksa.

Uji bank (W-14): tiap blok, dan tiap varian templatnya, dibungkus sesuai
bahasanya lalu harus bebas temuan `lintDoc`; blok JS juga harus bisa diurai
`new Function()`.

Saya mencoba ini pada 16 contoh blok (4 HTML, 3 CSS, 9 JS, termasuk fungsi
panah, array, templat string, dan `addEventListener`): 15 lolos. Satu yang
gagal adalah literal regex `/a{2}\(/`, yang oleh `lintDoc` dibaca sebagai
kurung tidak ditutup padahal JavaScript menerimanya. Jadi bank menghindari
literal regex; materi pertemuan 13–16 memang tidak memakainya.

### 6.2 Kunci transisi sasaran

Daftar awal; disesuaikan dengan data W1.

| Bahasa | Kunci transisi sasaran |
|---|---|
| HTML | `<a` `</` `a>` `/>` `="` `">` `"␣` `<!` |
| CSS | `a:` `:␣` `a;` `9;` `␣{` `a-` `.a` `#a` `a(` `9)` |
| JS | `=>` `==` `!=` `);` `a(` `("` `")` `a.` `␣=` `()` `({` `};` `␣{` `[a` `a]` `${` `&&` `\|\|` `+=` |

Keadaan baris drill sekarang terhadap syarat "≥ 6 per kunci" (dihitung per
baris, karena blok belum ada): 17 dari 49 kunci HTML memenuhi, 8 dari 22 kunci
CSS, 20 dari 52 kunci JS. Yang kosong justru yang paling
khas JS: di 37 baris drill JS, `=>` muncul 1 kali, dan `({`, `};`, `[`, `]`,
`${`, serta backtick tidak muncul. Blok JS untuk kunci-kunci itu harus ditulis
baru; isinya dibatasi pada sintaks yang sudah diajarkan pertemuan 13–16.

### 6.3 Generator

Masukan: `WaveState`, bahasa, pertemuan tertinggi yang terbuka, benih acak,
lama sesi. Keluaran: daftar `WaveItem` berjenis blok.

1. **Sasaran.** Ambil kunci berstatus lambat untuk bahasa itu, urutkan dari
   median terbesar, ambil 3 teratas. Bila kurang dari 3, isi dari kunci "belum
   cukup data" menurut urutan benih (§6.4), lalu urutan bawaan di §6.2.
2. **Calon.** Blok dengan `lesson` ≤ pertemuan terbuka yang memuat sedikitnya
   satu sasaran. Nilai blok = jumlah kemunculan sasaran di dalamnya.
3. **Pilih.** Ambil berbobot nilai, tanpa blok di `recentBlocks` selama masih
   ada calon lain. Sedikitnya 60% blok sesi berasal dari calon ini.
4. **Ulangan.** Sisanya blok yang memuat kunci berstatus lancar, supaya yang
   sudah lancar tetap muncul.
5. **Templat.** Varian nama dipilih dengan benih yang sama.

Generator tidak memakai `Math.random` langsung; ia menerima fungsi acak, jadi
uji bisa menetapkan hasilnya.

### 6.4 Benih dari Tahap 1

`trapSeedKeys(save.aiTrap)` (`docs/058_…` §14) mengembalikan tombol lumpuh
percobaan pertama. Kunci transisi yang memuat tombol itu didahulukan di
langkah 1. Benih hanya berlaku selama kunci itu masih "belum cukup data";
begitu ada 10 sampel, data Tahap 3 sendiri yang menentukan.

---

## 7. Tingkat 2: kartu pola

### 7.1 Kartu

```ts
interface WaveCard {
  id: string; lang: Lang; lesson: number;
  text: string;      // bentuk baku, satu baris
  label: string;     // untuk level 2, mis. "[TOMBOL_KLIK: sapa]"
}
```

Kartu adalah baris yang juga muncul di dalam blok Tingkat 1, jadi mahasiswa
sudah mengetiknya utuh sebelum simbolnya disembunyikan.

### 7.2 Tampilan

Target selalu `text`. Untuk posisi `i`:

| Keadaan posisi | Level 0 | Level 1 | Level 2 |
|---|---|---|---|
| Sudah diketik | karakter | karakter | karakter |
| Dibuka oleh bantuan | karakter | karakter | karakter |
| Belum diketik, simbol | karakter | `_` | tidak tampil |
| Belum diketik, lainnya | karakter | karakter | tidak tampil |

Di level 2, label tampil di atas baris yang sedang diketik. Pratinjau baris
mendatang memakai aturan yang sama (W-26); arena lama menampilkan dua baris
mendatang utuh, dan itu akan membocorkan jawaban bila ditiru.

Contoh naskah `<div class="card">`: level 1 tampil sebagai
`_div class__card__`. Naskah menulis `div class__card__`; bedanya hanya `<` di
depan yang juga diganti `_`.

### 7.3 Naik dan turun level

| Dari | Ke | Syarat |
|---|---|---|
| 0 | 1 | Semua kunci transisi sasaran di kartu berstatus lancar (W-25) |
| 1 | 2 | Lulus level 1 tanpa bantuan pada 2 hari yang berbeda |
| 1 atau 2 | turun satu | Gagal: tidak selesai, atau akurasi < 95% |
| apa pun | tetap | Selesai tetapi dibantu |

Syarat dua hari untuk level 2 membuat label menguji ingatan lintas hari, bukan
gema dari baris yang baru saja terlihat.

Bila ambang W-03 ternyata terlalu tinggi, kartu tertahan di level 0. Jalan
keluarnya ada di keputusan K3: ambang direvisi, atau syarat 0 → 1 diganti
"diketik utuh 3 kali dengan akurasi ≥ 95%".

### 7.4 Bantuan

Tiga salah tekan di posisi yang sama membuka karakter di posisi itu (efek
`reveal`) dan menandai kartu dibantu untuk sesi tersebut.

### 7.5 Jadwal

Lima kotak dengan selang `[1, 2, 4, 7, 14]` hari. Lulus: kotak naik, jatuh
tempo = hari ini + selang kotak baru. Gagal: kotak 0, jatuh tempo besok.
Dibantu: kotak tetap, jatuh tempo besok. Sesi Tingkat 2 mengambil kartu yang
jatuh tempo, paling lama tertunda lebih dulu. Selang ini usulan awal; jadwal
lab mingguan mungkin butuh selang lain.

---

## 8. Tingkat 3: Hiu Boss

### 8.1 Baris boss

```ts
interface BossLine {
  id: string; lang: Lang;
  lesson: number;       // pertemuan asal pola ini
  check: "mesin" | "manusia";   // siapa yang memastikan cacatnya nyata
  shown: string;        // yang tampil, bercacat
  answers: string[];    // perbaikan yang sah
  explain: string;      // untuk pembongkaran
}
```

### 8.2 Aturan mesin

`d` = panjang awalan bersama `shown` dengan jawaban; sama untuk semua jawaban.
`hidup` = jawaban yang masih cocok dengan yang sudah diketik.

| Posisi | Tombol | Hasil |
|---|---|---|
| sebelum `d` | sama dengan `shown` | benar |
| mulai `d` | cocok dengan sedikitnya satu jawaban di `hidup` | benar; jawaban yang tidak cocok disisihkan |
| tepat `d` | sama dengan `shown[d]` | **menyalin**: nyawa −1, penjelasan singkat tampil, baris harus tetap diperbaiki |
| mana pun | lainnya | salah tekan biasa |
| — | Enter saat yang diketik sama dengan salah satu jawaban | **dijinakkan** (bila belum pernah menyalin di baris ini) |
| tepat `d`, `shown` sudah habis | Enter | **menyalin** |

Titik cacat pada tujuh contoh, dihitung dengan skrip:

| Yang tampil | Jawaban | `d` | Tampil di `d` | Benar di `d` |
|---|---|---|---|---|
| `if (x = 5) { mulai(); }` | `if (x == 5) …`, `if (x === 5) …` | 7 | spasi | `=` |
| `<h1>Judul</h2>` | `<h1>Judul</h1>` | 12 | `2` | `1` |
| `console.log("Halo";` | `console.log("Halo");` | 18 | `;` | `)` |
| `tombol.addEventListener("click", sapa());` | `…, sapa);` | 37 | `(` | `)` |
| `p { color red; }` | `p { color: red; }` | 9 | spasi | `:` |
| `<a href="profil.html>Profil</a>` | `<a href="profil.html">Profil</a>` | 20 | `>` | `"` |
| `p { color: red;` | `p { color: red; }` | 15 | (baris habis) | spasi |

Baris terakhir menunjukkan kasus "baris yang tampil sudah habis": Enter di
titik itu berarti menyalin.

Untuk `==` dan `===`, kedua jawaban masih hidup setelah `=` pertama; pilihan
baru pasti pada karakter berikutnya.

### 8.3 Pemeriksaan bank

| `check` | Baris yang tampil | Tiap jawaban |
|---|---|---|
| `mesin` | Harus **ditolak**: `lintDoc` punya temuan, atau (JS) `new Function()` melempar | Harus lolos keduanya |
| `manusia` | Lolos keduanya, jadi mesin tidak bisa memastikan cacatnya | Lolos keduanya; `explain` wajib; id-nya ada di daftar yang ditinjau orang |

Ditambah untuk semua: `d` sama untuk semua jawaban; `shown[d]` berbeda dari
karakter tiap jawaban di `d`; tiap jawaban berbeda dari `shown`.

Pemeriksaan ini sudah menyingkirkan tiga calon yang tampak wajar:

| Calon baris | Hasil | Sebab |
|---|---|---|
| `const total = harga * jumlah` (tanpa `;`) | Bukan cacat | JavaScript menerimanya |
| `p { color: red }` (tanpa `;`) | Bukan cacat | Titik koma deklarasi terakhir boleh tidak ada |
| `<img src="logo.png" alt="Logo" >` | Bukan cacat | HTML menerimanya |

Yang ditolak pemeriksa pada percobaan, jadi bisa bertanda `mesin`: tag
penutup yang salah (`html-stray-close`), kutip atribut tidak ditutup
(`html-attr-quote`), titik dua hilang di CSS (`css-missing-colon`), kurung
kurawal CSS tidak ditutup, kurung tidak ditutup di JS (`unclosed-bracket`),
dan kutip yang tidak sepasang (`unclosed-string`).

Yang lolos pemeriksa walaupun cacatnya nyata, jadi harus bertanda `manusia`:
`if (x = 5)`, `sapa()` sebagai ganti `sapa`, dan titik koma yang hilang di
antara dua deklarasi CSS **sebaris** (`p { color: red margin: 0; }`;
`lintDoc` hanya menangkapnya bila deklarasinya di baris terpisah).

Contoh naskah `for i in range(10)` tanpa titik dua adalah Python dan tidak
dipakai selama K1 belum memutuskan lain.

### 8.4 Pembongkaran

Setelah segmen boss, tiap baris ditampilkan: yang tampil, perbaikannya,
penjelasan, dan hasilnya (dijinakkan atau disalin). Di atasnya satu kalimat:
baris-baris ini ditulis tim CodeShark meniru kesalahan yang umum, bukan
keluaran AI. Susunannya mengikuti pembongkaran jebakan di Babak 2 Tahap 1.

Pola cacat Tahap 1 (`TrapDef`) menjadi sumber baris boss: kutip tidak ditutup,
nama variabel yang nyaris sama, kurung yang hilang.

---

## 9. Ritme dan skor

### 9.1 Pengatur ritme

`wavePacing.next(mul, jendela)` dipanggil sekali tiap baris selesai, dengan 20
tombol terakhir.

| Keadaan | Tindakan |
|---|---|
| Salah ≤ 2% dan ancaman < 30 saat baris selesai | `mul + 0,1`, paling tinggi 1,4 |
| 3 salah beruntun, atau salah ≥ 15% | `mul − 0,1`, paling rendah 0,7; sorotan tombol untuk baris berikutnya |
| Lainnya | Tetap |

Kecepatan ancaman = `AgeCfg.threatRate × mul`. Status transisi, kenaikan
kartu, dan hasil boss tidak membaca `mul` (W-46).

Sorotan memakai tata letak keyboard dari `KeyboardHeatmap`. Di Tingkat 2,
sorotan membocorkan jawaban, jadi baris itu ditandai dibantu.

### 9.2 Skor

Arena gelombang tidak memakai pengali combo arena lama. Tiap karakter benar
bernilai 10. Baris yang selesai tanpa salah tekan dan tanpa Backspace (Blok
Bersih) dikalikan 5. Skor hanya tampil di sesi; ia tidak diubah menjadi XP.

---

## 10. Ritual

### 10.1 Urutan

```
pembuka ─► T1 (0:00–4:00) ─► T2 (4:00–8:00) ─► boss (8:00–10:00) ─► bukti
```

- Jam memakai tenggat `performance.now()`, bukan hitungan detak, dan tidak
  berhenti saat jendela ditinggalkan. Tidak ada tombol jeda.
- Perpindahan segmen terjadi di batas baris pertama setelah waktunya lewat.
  Akhir sesi pada 10:00 bersifat keras: baris yang sedang diketik dihentikan.
- Bila tidak ada kartu jatuh tempo, waktu T2 diberikan ke T1. Bila belum ada
  baris boss yang terbuka, waktunya diberikan ke T2 (W-49).
- Bahasa: pertemuan tertinggi yang terbuka menentukan bahasa T1 dan T2.
- Boss di ritual memakai baris yang `lesson`-nya sudah Perak. Naskah
  menempatkan boss "di akhir setiap level bahasa"; bila aturan itu dipakai apa
  adanya di ritual, segmen boss kosong sampai pertemuan 8. Karena itu "Boss
  bahasa" (semua baris satu bahasa, di luar ritual) mengikuti naskah, dan
  ritual memakai aturan per pertemuan (keputusan K12).
- Pengarahan boss (W-37) muncul sekali seumur profil dan memakan waktu segmen
  boss.

### 10.2 Nyawa

Di ritual tidak ada keadaan "mati". Ancaman penuh atau menyalin baris boss
menambah `hits` dan mengembalikan ancaman ke nol. Di luar ritual, sesi
gelombang memakai tiga nyawa seperti arena lama.

Alasannya: dengan aturan tiga nyawa, mahasiswa yang paling lemah akan selesai
dalam satu menit dan kehilangan sembilan menit latihan.

### 10.3 Bukti

Layar bukti menampilkan ringkasan sesi (`WaveSessionSummary`): nama profil,
tanggal dan jam selesai, durasi, transisi sasaran dengan median sebelum dan
sesudah, kartu naik dan turun, baris boss dijinakkan dan disalin, nyawa yang
hilang, lalu pembongkaran boss dan latihan berikutnya. Ringkasan disimpan di
`ritual.last` supaya bisa dibuka lagi pada hari yang sama.

Layar ini bukan pengaman: siapa pun yang membuka alat pengembang bisa
menirunya. Pilihan yang lebih kuat ada di keputusan K8.

### 10.4 Imbalan

Ritual pertama pada suatu hari: 40 XP, `ritual.count + 1`, dan
`recordDailyStreak()` dipanggil seperti sesi latihan lain. Pengali streak
tidak diterapkan pada 40 XP itu. Ritual berikutnya di hari yang sama tidak
menambah apa pun. Semua ini usulan (K9).

---

## 11. Integrasi

- **Layar.** `Screen` di `App.tsx` mendapat
  `{ s: "wave"; mode: "ritual" | "t1" | "t2" | "boss"; k: number }`;
  `WaveGame` dimuat malas seperti `AiTrapModule`.
- **Audiens.** Satu fungsi `waveVisibleFor(age)` di `waveConfig.ts`,
  berdampingan dengan `trapVisibleFor`. Usulan: `academy` dan `senior`.
- **Perangkat.** Memakai `lacksPhysicalKeyboard()` yang sudah ada.
- **Kartu Dashboard.** `WaveCard` di bawah kartu Tahap 1: status ritual hari
  ini, tiga transisi sasaran, tombol mulai, dan tautan ke tingkat satuan.
- **Pengungkapan.** Kartu dan pembuka ritual menyebut bahwa selang antar-tombol
  pada simbol direkam sebagai ringkasan, dan ikut sinkron bila terhubung.
- **Urutan dengan Tahap 1.** Gerbang Tahap 1 tetap lebih dulu; kartu ritual
  baru terlihat setelah Dashboard terbuka.

---

## 12. Konfigurasi

Semua angka di satu berkas (`waveConfig.ts`):

```ts
export const WAVE_CFG = {
  fluentMs: 250, fluentAcc: 0.95, minSamples: 10, recentSamples: 10, accWindow: 20,
  maxGapMs: 2000,
  targetsPerSession: 3, targetBlockShare: 0.6,
  helpAfterWrong: 3, cardPassAcc: 0.95, daysForLabel: 2, leitnerDays: [1, 2, 4, 7, 14],
  pace: { min: 0.7, max: 1.4, step: 0.1, window: 20, upErr: 0.02, upThreat: 30, downErr: 0.15, downStreak: 3 },
  cleanLineMult: 5,
  ritual: { totalMs: 600_000, t1Ms: 240_000, t2Ms: 240_000, bossMs: 120_000, xp: 40 },
  limits: { sessions: 20 },
} as const;
```

Hanya `fluentMs`, `fluentAcc`, dan pembagian waktu ritual yang berasal dari
naskah. Sisanya tebakan awal saya dan perlu dikalibrasi.

---

## 13. Strategi uji

| Lapis | Alat | Cakupan |
|---|---|---|
| Unit | `tests/wave.test.mjs` | Kunci transisi; aturan sampel; status; generator berbenih; samaran; naik-turun kartu; jadwal; aturan boss; pengatur ritme; penormal data |
| Bank | `tests/wave.test.mjs` | Tiap blok dan varian lolos pemeriksa; tiap kunci sasaran punya ≥ 6 blok; tiap baris boss memenuhi §8.3 |
| Tipe | `npm run lint` | Seluruh proyek |
| Regresi | Uji yang ada + uji alur arena lama | W-07, W-50 |
| Alur browser | Skrip uji alur (`docs/059_…` T2.3) diperluas | Ritual dengan jam palsu; menyalin baris boss; kartu tanpa simbol; kelompok usia dan perangkat |
| Lapangan | Satu sesi lab | Ambang, pembagian waktu, bank |

Jam palsu dibutuhkan untuk menguji 10 menit. Catatan dari Tahap 1 berlaku
(`docs/058_…` §8): pakai `fastForward`, bukan `runFor`.

---

## 14. Keputusan rancangan

| Keputusan | Pilihan | Alternatif yang ditolak | Alasan |
|---|---|---|---|
| Mesin | Reducer murni baru | Menambah mode ke `TypingGame` | Arena lama tidak punya uji alur; aturan baru bisa diuji di Node |
| Satuan ukur | Kunci transisi bergolongan | Pasangan persis | Sampel terlalu jarang untuk 10 kemunculan |
| Satuan bank | Blok | Baris | 64 dari 161 baris tidak bisa diperiksa sendirian |
| Isi sesi | Dipilih dari bank | Dirakit mesin | Kode rakitan mudah tidak bermakna |
| Akurasi transisi | 20 percobaan terakhir | Hitungan seumur profil | Kesalahan lama harus bisa pudar |
| Titik cacat boss | Awalan bersama | Membandingkan seluruh baris di akhir | Hukuman terjadi tepat saat menyalin, dan aturannya bisa diuji |
| Boss di ritual | Terbuka per pertemuan | Per bahasa seperti di naskah | Ritual tanpa boss selama delapan pertemuan pertama |
| Nyawa di ritual | Dicatat, tanpa mati | Tiga nyawa | Yang paling lemah harus berlatih paling lama |
| Jam ritual | Terus berjalan | Jeda saat jendela ditinggalkan | Sepuluh menit di lab adalah waktu dinding |
| Imbalan | Tetap, sekali sehari | Berdasarkan skor | Sama dengan Tahap 1; tidak ada alasan mengakali |
| Data | Agregat per transisi | Log ketikan mentah | Pola ketik per orang adalah data perilaku |

## 15. Yang belum diketahui

- Apakah 250 ms tercapai untuk transisi ber-Shift oleh mahasiswa sasaran.
- Apakah median dari 10 sampel cukup stabil antar sesi.
- Seberapa besar pengaruh keyboard yang berbeda (laptop lab dan laptop
  pribadi) terhadap latensi orang yang sama.
- Apakah tekanan bilah ancaman mengubah latensi yang sedang diukur.
- Apakah empat menit per tingkat pembagian yang tepat.
- Berapa blok per kunci yang cukup supaya tidak dihafal; angka 6 adalah tebakan.
- Tata letak selain QWERTY-US: kunci transisi tetap berlaku, tetapi sorotan
  tombol menunjuk posisi yang salah.
