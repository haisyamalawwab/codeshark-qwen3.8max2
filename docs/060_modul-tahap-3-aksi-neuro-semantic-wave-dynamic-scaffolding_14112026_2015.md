# 060 — Modul Tahap 3 – Aksi: 3-Tier Neuro-Semantic Wave & Dynamic Scaffolding Protocol

> Disimpan: 14-11-2026 20:15 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: **rencana; belum ada kode yang dibangun.** Bagian 2 adalah naskah modul
> dari pemilik proyek, disimpan apa adanya. Bagian 3–11 adalah analisis dan
> rencana pelaksanaannya di CodeShark.
> Terkait: Tahap 1 – Pemicu di `docs/056_…`–`docs/059_…`.
> Diperbarui 14-11-2026 21:10 WIB: bagian 6–9 kini dirinci di `docs/061_…` (PRD),
> `docs/062_…` (Requirement), `docs/063_…` (Design), dan `docs/064_…` (Tasklist).
> Bila berbeda, dokumen 061–064 yang berlaku. Koreksi atas dokumen ini ada di
> bagian 12.

---

## 1. Ringkasan

Tahap 3 mengubah arena ketik CodeShark dari "menyalin kode yang terlihat"
menjadi tiga tingkat latihan yang menyesuaikan diri dengan tiap mahasiswa:

| Tingkat | Nama di naskah | Yang dilatih |
|---|---|---|
| 1 | Motoric Imprinting Wave | Kelancaran jari pada pasangan simbol yang masih lambat |
| 2 | Fading Scaffolding / Cloze-Syntax Wave | Menulis sintaks dari ingatan saat petunjuk di layar dikurangi |
| 3 | Boss Wave – Anti-Hallucination & Logic Defusal | Membaca kode yang cacat dan mengetik versi benarnya |

Ditambah tiga pengatur ritme: kecepatan yang menyesuaikan, bonus blok tanpa
koreksi, dan ritual 10 menit sebelum praktikum.

Arena yang ada sekarang belum punya satu pun dari ini. Sembilan hal di naskah
perlu disesuaikan supaya bisa dibangun dan supaya angkanya bisa
dipertanggungjawabkan; semuanya ada di bagian 4. Delapan keputusan menunggu
pemilik proyek (bagian 5); empat lagi (K9–K12) ditambahkan di `docs/061_…` §10.

---

## 2. Naskah modul

Teks di bawah ini disalin dari naskah pemilik proyek. Susunan kalimat tidak
diubah; yang ditambahkan hanya format markdown (judul, butir, dan tanda kode).

### Nama Modul Baru

**"3-Tier Neuro-Semantic Wave & Dynamic Scaffolding Protocol"** (Protokol
Gelombang Neuro-Semantik 3 Tingkat & Perancah Dinamis)

Alih-alih hiu selalu menampilkan teks kode secara utuh untuk disalin
mentah-mentah oleh mata dan jari mahasiswa, setiap gelombang (Wave) di Coding
Shark dibagi menjadi 3 Tingkat Evolusi Kognitif-Motorik yang digerakkan oleh
algoritma adaptif (Spaced Repetition & Keystroke Dynamics):

### Tingkat 1: Motoric Imprinting Wave (Fokus: Otomatisasi Jari & Penghapusan Beban Simbol)

- **Mekanisme:** Hiu menampilkan sintaks utuh (HTML, CSS, JS, Python, atau
  Dart), namun dipersonalisasi berdasarkan Motoric Paralysis Heatmap dari
  Tahap 1 & 2.
- **Inovasi Teknis (Biometric N-Gram Drilling):** Algoritma tidak sekadar
  mengulang seluruh baris secara acak, melainkan melacak Transisi Karakter
  (Digraph/Trigraph Latency).
- **Contoh:** Jika sistem mendeteksi jeda jari mahasiswa antara karakter `=`
  dan `>` pada `=>` adalah 1.400 ms (lambat), atau sering salah menekan `[`
  menjadi `{` di Python/JS, maka algoritma Wave Generator secara dinamis
  merakit variasi kode baru yang memadatkan pasangan simbol tersebut hingga
  key-strike latency mahasiswa turun di bawah ambang batas kelancaran (fluency
  threshold < 250 ms) dengan akurasi > 95%.

### Tingkat 2: Fading Scaffolding / Cloze-Syntax Wave (Fokus: Menghentikan Kebiasaan Menyalin Visual ke Memori Aktif)

- **Masalah yang Dipecahkan:** Pada gim mengetik biasa, mata mahasiswa hanya
  menyalin huruf di layar tanpa memproses maknanya di otak (mirip copy-paste
  lewat jari).
- **Mekanisme Fading Hint:** Begitu latency motorik mahasiswa pada suatu pola
  sintaks sudah lulus di Tingkat 1, hiu yang datang berikutnya tidak lagi
  menampilkan sintaks secara lengkap, melainkan menggunakan teknik Perancah
  Memudar (Fading Scaffolding):
  - Gelombang Awal: `<div class="card">` (Ditampilkan penuh).
  - Gelombang Menengah (Simbol Dihilangkan): `div class__card__` -> Mahasiswa
    harus mengetik `<div class="card">` secara utuh dari ingatan motoriknya!
  - Gelombang Lanjut (Keyword Dihilangkan): `[ASYNC_FETCH_JS: url]` -> Hiu
    hanya membawa petunjuk logika singkat, dan jari mahasiswa harus secara
    refleks menembakkan `const res = await fetch(url);`.
- **Dampak Transformatif:** Mahasiswa tidak lagi "menyalin teks di punggung
  hiu", melainkan memanggil struktur sintaks langsung dari memori jangka
  panjang dan muscle memory jarinya.

### Tingkat 3: Boss Wave – Anti-Hallucination & Logic Defusal (Fokus: Mengasah Logika & Kedaulatan atas AI Generatif)

- **Mekanisme:** Di akhir setiap level bahasa (HTML/CSS/JS/Python/Dart), muncul
  Hiu Boss ("The AI Hallucinator") yang berenang membawa sebaris kode yang
  tampak meyakinkan tetapi mengandung 1 cacat logika atau sintaks jebakan
  (misalnya: `for i in range(10)` tanpa titik dua di Python, `if (x = 5)`
  bukannya `===` di JS, atau tag HTML yang salah tutup).
- **Tindakan Mahasiswa:** Mahasiswa dilarang mengetik persis apa yang tertulis
  di punggung hiu tersebut! Jika mereka mengetik mentah-mentah (mentalitas
  copy-paste), hiu justru meledak dan mengurangi nyawa. Mahasiswa harus
  mengetik versi perbaikan kodenya secara langsung saat hiu berenang mendekat.
- **Dampak Transformatif:** Ini melatih otak Gen Z untuk selalu skeptis,
  kritis, dan otomatis mengoreksi kode yang salah dalam hitungan
  detik—kemampuan inti yang wajib dimiliki saat bekerja berdampingan dengan AI
  Generatif di dunia nyata.

### Mekanisme Psikologis Pembentuk Kebiasaan Gen Z (Anti-Lazy & Flow State Mechanics)

Agar mahasiswa Gen Z yang mudah bosan dan suka instan justru ketagihan berlatih
di Tahap 3 ini, modul Aksi dilengkapi dengan pengatur ritme psikologis:

**Dynamic Flow-State Pacing (Penyesuaian Kecepatan Berbasis Frustration/Boredom Index):**

- Jika mahasiswa mengetik terlalu lancar, kecepatan berenang hiu naik otomatis
  agar menantang (anti-boredom).
- Jika mahasiswa mengalami typo beruntun (tanda mulai panik/frustrasi), sistem
  menurunkan kecepatan sedikit namun menyorot warna tombol simbol yang benar di
  panduan layar (visual cue), menjaga mereka tetap berada di zona Flow State
  (tidak menyerah karena terlalu sulit, tidak malas karena terlalu mudah).

**Combo Multiplier "Zero-Backspace" (Penghargaan atas Ketelitian Berpikir):**

- Gen Z suka mengetik asal cepat lalu menekan Backspace berkali-kali. Di modul
  ini, skor tertinggi (Streak Combo 5x) hanya diberikan jika mahasiswa mengetik
  satu blok sintaks tanpa menyentuh tombol Backspace sama sekali. Ini memaksa
  mereka menyatukan fokus mata, pikiran, dan jari sebelum menekan tombol.

**Ritual "10-Minute Pre-Lab Ignition" (Integrasi Perkuliahan Nyata):**

- Di dalam proposal SATRIA, tegaskan bahwa Tahap 3 ini bukan sekadar tugas
  mandiri yang dilepas begitu saja, melainkan Ritual Pembuka 10 Menit Pertama
  di Laboratorium sebelum mahasiswa diizinkan membuka VS Code / IDE untuk
  mengerjakan praktikum mata kuliah.

---

## 3. Arena yang ada sekarang

Dibaca dari kode pada `79a66c6`.

| Hal | Keadaan | Berkas |
|---|---|---|
| Bahasa | `html`, `css`, `js` saja | `src/lib/highlight.ts` (`Lang`) |
| Bentuk sesi | Satu blok kode per sesi, diketik baris demi baris; kode selalu tampil utuh | `src/ui/TypingGame.tsx` |
| Jenis sesi | Misi, lalu Quest, Drill, dan Juggling untuk tiap dari 16 pertemuan; ada juga tantangan harian | `src/data/quests.ts` |
| Ancaman | Satu bilah ancaman 0–100 yang naik tiap 100 ms; penuh = kehilangan 1 dari 3 nyawa; menyelesaikan baris menurunkannya | `TypingGame.tsx`, `AgeCfg` di `src/data/modules.ts` |
| Salah tombol | **Tidak masuk ke teks.** Dihitung salah, combo kembali 0, ancaman naik | `TypingGame.tsx` |
| Backspace | Memundurkan kursor satu karakter, tanpa penalti | `TypingGame.tsx` |
| Combo | Per karakter benar; pengali skor `1 + min(combo, 100) × 0,02`, jadi paling tinggi 3× | `TypingGame.tsx` |
| Yang direkam | Jumlah benar dan salah, WPM, dan `missed` (karakter target yang salah ditekan). **Tidak ada waktu antar-tombol** | `GameResult` |
| Pengulangan berjarak | Juggling menganyam drill pertemuan ini dengan pertemuan sebahasa sebelumnya. Tidak ada penjadwalan per pola | `quests.ts` |
| Petunjuk tombol | `AgeCfg.hints` menampilkan karakter berikutnya untuk Kadet dan Ranger | `modules.ts` |
| Bank baris | `DRILLS`: 161 baris untuk 16 pertemuan | `quests.ts` |
| XP | Saat menang: `50 + bintang × 25 + akurasi / 5`; tidak bergantung pada skor | `src/App.tsx` |
| Data ketik dari Tahap 1 | Jeda per **tombol** (`metrics.keys`, `slowKeys`) dari satu sesi 3 menit | `src/lib/trapMetrics.ts` |

Catatan: "hiu membawa teks di punggungnya" adalah gambaran di naskah. Di arena
sekarang kode tampil di panel dan hiu diwakili bilah ancaman. Rencana ini
memakai mekanik yang ada, bukan membuat hiu-hiu terpisah yang berenang membawa
teks. Bila tampilan seperti itu yang diinginkan, itu pekerjaan grafis tersendiri.

---

## 4. Penyesuaian terhadap naskah

### 4.1 Python dan Dart belum ada di aplikasi

`Lang` hanya `html | css | js`, dan silabus 16 pertemuan seluruhnya
HTML → CSS → JS. Modul backend Python (`py_backend`) dan modul Cross Platform
(`crossplatform`) pernah ada, lalu diarsipkan dan dilepas dari aplikasi pada
26-10-2026 (`docs/040_…`, `docs/041_…`).

Berbeda dari Tahap 1, Tahap 3 tidak perlu **menjalankan** kode, jadi Python dan
Dart bisa ditambahkan: aturan pewarnaan, bank baris, dan tempatnya di silabus.
Itu membalik keputusan pelepasan tadi, jadi saya jadikan keputusan pemilik (K1).
**Usulan: MVP memakai HTML, CSS, JS.** Contoh naskah yang memakai Python
(`for i in range(10)` tanpa titik dua) diganti padanan JS dan CSS.

### 4.2 "Heatmap dari Tahap 1 & 2" tidak cukup sebagai sumber personalisasi

- Tahap 1 merekam jeda per **tombol**, bukan per **pasangan** tombol. Naskah
  meminta latensi digraf (`=` → `>`).
- Datanya berasal dari satu sesi 3 menit; peta panas Tahap 1 sudah dianggap
  bermakna dengan 8 ketukan bersambung. Itu terlalu tipis untuk memilih pola
  latihan.
- Naskah Tahap 2 tidak ada di repo ini. Saya tidak tahu apakah Tahap 2
  menghasilkan data ketik.

**Penyesuaian:** arena Tahap 3 mengukur latensi digrafnya sendiri di setiap
sesi. Data Tahap 1 dipakai hanya sebagai benih urutan awal: pasangan yang
memuat tombol di `slowKeys` didahulukan pada sesi pertama.

### 4.3 Ambang 250 ms perlu dikalibrasi, dan butuh jumlah sampel minimum

Selang rata-rata antar-tombol pada 40 kata per menit adalah
60.000 ÷ (40 × 5) = 300 ms; pada 48 kata per menit, 250 ms. Arena sekarang
memberi bonus kecepatan mulai 40 kata per menit. Jadi ambang 250 ms meminta
pasangan simbol, yang sering butuh Shift, diketik lebih cepat daripada tempo
yang hari ini sudah dihadiahi bonus. Bisa jadi itu target yang tepat, bisa jadi
terlalu tinggi; belum ada data mahasiswa untuk memutuskannya.

**Penyesuaian:**

- 250 ms dan 95% dipakai sebagai **nilai awal**, disimpan di satu tempat.
- "Lulus" dihitung dari median 10 kemunculan terakhir pasangan itu, bukan dari
  satu ketukan. Tanpa 10 sampel, statusnya "data belum cukup".
- Fase pertama pembangunan hanya merekam latensi, tanpa mengubah latihan
  (bagian 9, W1), supaya ambang bisa diperiksa terhadap data sungguhan sebelum
  algoritmanya bergantung padanya.

### 4.4 "Merakit variasi kode baru secara dinamis" diganti pemilihan dari bank baris

Kode yang dirakit mesin dari potongan simbol mudah menjadi kode yang tidak
bermakna, dan mahasiswa akan melatih pola yang tidak pernah dipakai. Aplikasi
ini juga berjalan lokal tanpa model bahasa.

**Penyesuaian:** generator **memilih dan menyusun** baris dari bank baris yang
ditulis tangan dan diindeks per digraf. Variasi datang dari templat dengan
nama yang diganti-ganti (`const total = harga => harga * 2;` dengan beberapa
pasang nama), bukan dari perakitan bebas.

Bank yang ada tidak cukup untuk contoh utama naskah: dari 161 baris drill,
hanya 1 yang memuat `=>` dan 1 yang memuat `===`. Pasangan yang banyak tersedia
adalah milik HTML (`</` 54 kali, `="` 42 kali). Bank baris simbol untuk JS dan
CSS harus ditulis baru.

### 4.5 Tingkat 2 butuh jawaban yang tunggal

Mesin arena membandingkan tiap tombol dengan satu karakter target.

- **Simbol dihilangkan** (`div class__card__`): jawabannya tunggal bila baris
  itu sudah pernah diketik utuh. Ini cocok dengan syarat naskah (lulus
  Tingkat 1 dulu).
- **Kata kunci dihilangkan** (`[ASYNC_FETCH_JS: url]`): jawaban yang sah lebih
  dari satu (`res` atau `response`, `const` atau `let`). Menuntut satu bentuk
  tanpa pernah mengajarkannya akan menghukum jawaban yang benar.

**Penyesuaian:** petunjuk logika hanya dipakai untuk **kartu pola** yang
bentuk bakunya sudah diketik utuh beberapa kali di tingkat sebelumnya, dan
layar menyebut bahwa yang diminta adalah bentuk baku itu. Setelah 3 kali salah
di posisi yang sama, karakter itu ditampilkan, kartu ditandai "dibantu", dan
kartu itu tidak naik tingkat pada sesi tersebut.

Tentang klaim: yang terukur di sini adalah **mengingat kembali bentuk yang
sudah dilatih tanpa melihatnya**. Itu lebih dari menyalin, tetapi belum
membuktikan mahasiswa memahami logikanya. Teks di layar sebaiknya tidak
menyebut "memori jangka panjang" sebagai hasil ukur.

### 4.6 Hiu Boss: aturan "menyalin" harus pasti, dan jebakannya dibuka

Tiga hal perlu ditetapkan supaya mekanik ini adil:

1. **Kapan dianggap menyalin.** Baris yang tampil dan baris yang benar sama
   sampai titik cacat. Di titik itu: menekan karakter yang tampil = menyalin
   (hiu meledak, nyawa berkurang); menekan karakter yang benar = menjinakkan.
   Untuk cacat berupa karakter yang hilang di ujung baris (misalnya kurung
   tutup), baris boss diakhiri dengan Enter; menekan Enter saat baris
   masih cacat = menyalin.
2. **Perbaikan yang sah bisa lebih dari satu.** `if (x = 5)` bisa diperbaiki
   menjadi `==` atau `===`. Tiap baris boss menyimpan daftar jawaban sah.
3. **Tepat satu cacat, dan cacatnya di satu tempat.** Dijaga dengan uji
   otomatis atas bank boss.

Sejalan dengan prinsip Tahap 1 (`docs/056_…` §6 butir 4): baris boss ditulis
tim CodeShark meniru kesalahan yang umum, **bukan keluaran AI sungguhan**.
Nama "The AI Hallucinator" boleh dipakai sebagai tokoh, tetapi layar setelah
boss menjelaskan tiap cacat dan menyebut asal barisnya. Pola cacat Tahap 1
(kutip tidak ditutup, titik koma hilang di antara dua deklarasi CSS, nama
variabel nyaris sama) bisa dipakai ulang di sini.

Boss muncul per bahasa. Dengan silabus sekarang itu berarti tiga boss: HTML
setelah pertemuan 8, CSS setelah pertemuan 12, JS setelah pertemuan 16.

### 4.7 "Frustration/Boredom Index" adalah sinyal ketikan, bukan ukuran emosi

Sistem hanya melihat salah tekan beruntun dan tempo. Itu bisa berarti panik,
bisa juga keyboard yang berbeda atau gangguan di kelas.

**Penyesuaian:**

- Di kode dan di layar disebut "pengatur ritme", tanpa kata frustrasi atau bosan.
- Kecepatan ancaman berubah dalam rentang terbatas, paling banyak satu langkah
  per baris, supaya tidak berayun.
- Syarat lulus tidak bergantung pada kecepatan yang sedang berlaku.
- Sorotan tombol memakai tata letak keyboard yang sudah dibuat untuk Tahap 1
  (`KeyboardHeatmap`). Di Tingkat 2, sorotan membocorkan jawaban, jadi baris
  yang disorot ditandai "dibantu" seperti di 4.5.

### 4.8 "Zero-Backspace" tidak bermakna di mesin arena sekarang

Salah tombol tidak pernah masuk ke teks, jadi tidak ada yang perlu dihapus.
Backspace hanya memundurkan kursor. Bonus "tanpa Backspace" akan didapat hampir
semua orang, termasuk yang salah tekan sepuluh kali.

Dua jalan:

| | Pilihan | Akibat |
|---|---|---|
| A | **Blok Bersih**: bonus 5× untuk satu baris tanpa salah tekan dan tanpa Backspace | Cocok dengan mesin sekarang; maksud naskah (teliti sebelum menekan) tercapai |
| B | Ubah mesin jadi ketik bebas: salah tombol masuk ke teks dan harus dihapus | Sesuai kata-kata naskah, tetapi mengubah semua sesi yang ada dan cara akurasi dihitung |

**Usulan: A** (K5). Pengali 5× berlaku per baris dan menggantikan pengali combo
untuk baris itu. XP saat menang tidak bergantung pada skor, jadi bonus ini
tidak mengubah laju kenaikan rank.

### 4.9 Ritual 10 menit: aplikasi bisa mengatur waktu, bukan mengunci IDE

Aplikasi web tidak bisa mencegah mahasiswa membuka VS Code. "Sebelum
diizinkan" ditegakkan pengajar di lab.

**Yang bisa dibangun:** sesi berbatas waktu 10 menit yang menyusun Tingkat 1,
2, dan 3 dari data mahasiswa itu, lalu layar bukti di akhir (nama, tanggal,
durasi, ringkasan) yang bisa ditunjukkan ke pengajar. Layar bukti ini bukan
pengaman; ia bisa ditiru. Rekap kelas untuk Tahap 1 (`docs/059_…` T4.2–T4.4)
bisa diperluas untuk Tahap 3.

Tentang proposal SATRIA: saya tidak punya dokumen atau format proposal itu,
jadi saya tidak menulis bagiannya. Kalimat yang didukung rencana ini: "Tahap 3
dijalankan sebagai pembuka 10 menit di awal sesi laboratorium; aplikasi
mengatur waktu dan menghasilkan bukti penyelesaian, dan pengajar menahan
praktikum sampai bukti itu ditunjukkan."

### 4.10 Tiga catatan lintas bagian

- **Klaim.** Naskah memakai "Neuro-Semantic", "muscle memory", "melatih otak
  Gen Z", dan "ketagihan". Aplikasi tidak mengukur satu pun dari itu. Yang
  terukur: latensi per pasangan simbol, akurasi, keberhasilan mengingat tanpa
  petunjuk, dan seberapa sering baris cacat disalin. Nama modul bisa tetap,
  tetapi teks di layar mengikuti prinsip Tahap 1: hanya hasil ukur.
- **"Ketagihan".** Rencana ini merancang kebiasaan lewat sesi pendek yang
  punya akhir (10 menit, sekali sehari yang dihitung), bukan lewat mekanik yang
  mendorong bermain tanpa henti.
- **"Biometric".** Pola ketik per orang adalah data perilaku yang bisa
  mengenali orangnya. Rencana ini menyimpan agregat per pasangan (median,
  jumlah, 10 nilai terakhir), bukan aliran ketikan mentah. Keputusan O1 di
  `docs/056_…` (apakah data dipakai untuk penelitian) berlaku juga di sini.

---

## 5. Keputusan yang perlu dikonfirmasi

| # | Pertanyaan | Usulan bawaan | Menahan |
|---|---|---|---|
| K1 | Bahasa: HTML/CSS/JS saja, atau Python dan Dart dihidupkan lagi? | HTML/CSS/JS untuk MVP | W2, W4 |
| K2 | Siapa yang mendapat Tahap 3? | Academy wajib lewat ritual; Senior opsional; Kadet dan Ranger tetap arena sekarang | W6 |
| K3 | Ambang kelancaran: 250 ms tetap, atau ditetapkan dari data? | Nilai awal 250 ms; diputuskan setelah W1 mengumpulkan data | W2 |
| K4 | Tingkat 2 lanjut: satu bentuk baku per kartu pola? | Ya, dengan bentuk baku yang diajarkan lebih dulu | W3 |
| K5 | "Zero-Backspace": Blok Bersih (A) atau ketik bebas (B)? | A | W5 |
| K6 | Tempat modul: mode baru di samping Quest/Drill/Juggling, atau menggantikan Drill dan Juggling? | Mode baru; level pertemuan (Perunggu/Perak/Emas) tidak berubah | W2 |
| K7 | Apa isi Tahap 2, dan apakah menghasilkan data ketik? | Tahap 3 tidak bergantung pada Tahap 2 | — |
| K8 | Bukti ritual: layar bukti saja, atau kode kelas yang dicatat ke server? | Layar bukti untuk MVP | W6 |

---

## 6. PRD ringkas

> Versi lengkap: `docs/061_…`.

**Masalah.** Arena sekarang melatih kecepatan menyalin: kode selalu terlihat
dan salah tombol tidak masuk ke teks. Mahasiswa bisa mendapat akurasi tinggi
tanpa pernah menulis sintaks dari ingatan atau menilai benar-salahnya kode.

**Tujuan.**

1. Latihan mengikuti pasangan simbol yang masih lambat pada tiap mahasiswa.
2. Petunjuk di layar berkurang seiring kelancaran, sampai mahasiswa menulis
   pola tanpa melihatnya.
3. Mahasiswa berlatih menolak kode cacat dan menulis perbaikannya.
4. Latihan muat dalam 10 menit di awal praktikum.

**Bukan tujuan.** Menjalankan kode; menilai logika program buatan mahasiswa;
mengunci IDE; menggantikan Quest, Drill, dan Juggling di MVP.

**Ukuran keberhasilan.** Belum ada data dasar; semua target adalah usulan yang
dikonfirmasi setelah uji coba.

| Ukuran | Cara mengukur |
|---|---|
| Latensi pasangan yang dilatih turun | Median per pasangan, sesi pertama dibanding sesi ke-5 |
| Pola naik tingkat | Jumlah kartu yang mencapai "tanpa simbol" dan "petunjuk logika" tanpa bantuan |
| Baris cacat tidak disalin | Proporsi baris boss yang disalin, percobaan pertama dibanding berikutnya |
| Ritual selesai | Sesi 10 menit yang selesai per mahasiswa per minggu |
| Dibanding titik awal Tahap 1 | Tombol lumpuh pada pengulangan simulasi Tahap 1 setelah beberapa minggu ritual |

---

## 7. Requirement

> Daftar yang berlaku: `docs/062_…` (ID sama; perubahan dicatat di §9 dokumen itu).

Prioritas: **P0** = MVP, **P1** = setelah MVP, **P2** = kemudian. Semuanya
berstatus belum dibangun.

### 7.1 Pengukuran

| ID | Prio | Kebutuhan | Kriteria terima |
|---|---|---|---|
| W-01 | P0 | Arena merekam latensi tiap pasangan karakter yang memuat simbol. | Latensi = selang dua tombol benar berurutan di baris yang sama, tanpa salah tekan, jeda, atau keluar jendela di antaranya. Selang di atas 2 detik tidak dihitung. |
| W-02 | P0 | Arena merekam pasangan tertukar (diminta → ditekan). | `[` yang ditekan sebagai `{` tercatat sebagai satu kejadian `[→{`. |
| W-03 | P0 | Status tiap pasangan: belum cukup data, lambat, atau lancar. | Lancar = median 10 kemunculan terakhir di bawah ambang **dan** akurasi pada pasangan itu di atas 95%. |
| W-04 | P0 | Hanya agregat yang disimpan. | Tidak ada aliran ketikan mentah di save; ukuran irisan data di bawah 50 kB. |

### 7.2 Tingkat 1

| ID | Prio | Kebutuhan | Kriteria terima |
|---|---|---|---|
| W-10 | P0 | Generator menyusun sesi dari baris yang memuat pasangan lambat. | Dengan data uji yang menandai `=>` lambat, sedikitnya 60% baris sesi memuat `=>`. Hasil sama untuk benih acak yang sama. |
| W-11 | P0 | Bank baris simbol untuk HTML, CSS, JS. | Tiap pasangan simbol yang umum punya sedikitnya 6 baris; tiap baris lolos pemeriksa struktur. |
| W-12 | P0 | Sesi pertama memakai tombol lumpuh Tahap 1 sebagai benih. | Profil dengan `slowKeys` memuat `{` mendapat baris ber-`{` lebih dulu. Profil tanpa data Tahap 1 mendapat urutan bawaan. |
| W-13 | P1 | Layar hasil menampilkan pasangan yang dilatih dan perubahannya. | Tiap pasangan tampil dengan median sebelum dan sesudah sesi. |

### 7.3 Tingkat 2

| ID | Prio | Kebutuhan | Kriteria terima |
|---|---|---|---|
| W-20 | P0 | Tiga tingkat tampilan per kartu pola: utuh, tanpa simbol, petunjuk logika. | Target ketikan sama di ketiganya; hanya tampilannya yang berbeda. |
| W-21 | P0 | Kartu naik tingkat hanya setelah lulus tanpa bantuan. | Kartu yang "dibantu" tidak naik; kartu yang gagal turun satu tingkat. |
| W-22 | P0 | Bantuan setelah 3 salah di posisi yang sama. | Karakter ditampilkan; kartu ditandai dibantu. |
| W-23 | P1 | Penjadwalan ulang berjarak per kartu. | Kartu yang lulus muncul lagi pada selang yang memanjang; kartu yang gagal kembali ke selang terpendek. |
| W-24 | P0 | Petunjuk logika hanya untuk kartu yang bentuk bakunya sudah dilatih. | Kartu tidak bisa mencapai tingkat petunjuk logika sebelum lulus dua tingkat sebelumnya. |

### 7.4 Tingkat 3

| ID | Prio | Kebutuhan | Kriteria terima |
|---|---|---|---|
| W-30 | P0 | Baris boss menampilkan kode bercacat tunggal; targetnya adalah versi benar. | Uji otomatis: tiap baris boss berbeda dari tiap jawabannya di tepat satu tempat. |
| W-31 | P0 | Menyalin karakter cacat mengurangi nyawa. | Menekan karakter yang tampil di titik cacat, atau Enter saat baris masih cacat, mengurangi 1 nyawa dan membuka penjelasan. |
| W-32 | P0 | Lebih dari satu perbaikan sah diterima. | `==` dan `===` sama-sama menjinakkan `if (x = 5)`. |
| W-33 | P0 | Pembongkaran setelah boss. | Tiap cacat ditampilkan dengan sebelum, sesudah, dan penjelasan; layar menyebut baris itu buatan tim, bukan keluaran AI. |
| W-34 | P1 | Boss per bahasa terbuka setelah pertemuan terakhir bahasa itu. | HTML setelah P8, CSS setelah P12, JS setelah P16. |

### 7.5 Ritme, skor, ritual

| ID | Prio | Kebutuhan | Kriteria terima |
|---|---|---|---|
| W-40 | P1 | Kecepatan ancaman menyesuaikan dalam rentang terbatas. | Paling banyak satu langkah per baris; rentang 0,7×–1,4× dari kecepatan dasar; syarat lulus tidak berubah. |
| W-41 | P1 | Sorotan tombol setelah salah tekan beruntun. | Setelah 3 salah beruntun, tombol berikutnya disorot pada keyboard layar untuk satu baris. |
| W-42 | P1 | Bonus Blok Bersih 5×. | Baris tanpa salah tekan dan tanpa Backspace mendapat pengali 5×; satu salah tekan membatalkannya. |
| W-43 | P0 | Sesi ritual 10 menit. | Berhenti pada 10:00 menurut jam, bukan jumlah baris. Jam tetap berjalan saat sesi dijeda atau jendela ditinggalkan. |
| W-44 | P0 | Layar bukti di akhir ritual. | Menampilkan nama, tanggal, durasi, dan ringkasan tiga tingkat. |
| W-45 | P1 | Satu ritual per hari yang dihitung. | Ritual kedua di hari yang sama boleh dimainkan tetapi tidak menambah hitungan. |

### 7.6 Non-fungsional

| ID | Kebutuhan |
|---|---|
| W-50 | Sesi yang ada (Misi, Quest, Drill, Juggling, tantangan harian) tidak berubah perilakunya. |
| W-51 | Fungsi statistik, generator, dan penjadwal murni dan teruji di Node. |
| W-52 | Tanpa dependensi baru dan tanpa panggilan ke layanan AI. |
| W-53 | Save lama tanpa irisan baru terbaca tanpa galat; data ikut sinkron tanpa perubahan skema. |
| W-54 | Semua ambang ada di satu berkas. |

---

## 8. Design

> Rancangan yang berlaku: `docs/063_…`. Dua hal di bawah ini sudah diganti di
> sana: satuan ukur (kunci transisi bergolongan, bukan pasangan persis) dan
> satuan bank (blok, bukan baris).

### 8.1 Berkas

| Berkas baru | Isi |
|---|---|
| `src/lib/waveStats.ts` | Statistik digraf, status kelancaran, pasangan tertukar. Murni |
| `src/lib/waveGen.ts` | Generator sesi dan penjadwal kartu. Murni, menerima benih acak |
| `src/lib/wavePacing.ts` | Pengatur ritme. Murni |
| `src/data/waveBank.ts` | Bank baris simbol, kartu pola, baris boss, ambang |
| `src/ui/WaveGame.tsx` | Arena tiga tingkat dan sesi ritual |
| `src/ui/WaveResults.tsx` | Hasil sesi, pembongkaran boss, layar bukti |
| `tests/wave.test.mjs` | Uji unit; skrip `test:wave` |

| Berkas yang diubah | Perubahan |
|---|---|
| `src/ui/TypingGame.tsx` | W1 saja: mencatat waktu tombol benar dan pasangan tertukar ke `GameResult`. Perilaku tidak berubah |
| `src/lib/storage.ts` | Irisan opsional `wave` di `SaveData` |
| `src/App.tsx` | Layar `wave`; menyimpan hasil sesi |
| `src/ui/Dashboard.tsx` | Kartu "Ritual Pra-Lab" |

`TypingGame.tsx` dipakai semua sesi yang ada. Arena baru dibuat sebagai
komponen terpisah yang memakai ulang gaya dan komponen tampilan, supaya
kesalahan di Tahap 3 tidak merusak Quest, Drill, dan Juggling.

### 8.2 Data

```ts
SaveData.wave?: WaveState

interface DigraphStat {
  n: number;          // total kemunculan
  recent: number[];   // latensi ms, paling banyak 10 terakhir
  miss: number;       // salah tekan pada karakter kedua
}
interface CardState {
  level: 0 | 1 | 2;   // utuh · tanpa simbol · petunjuk logika
  box: number;        // kotak penjadwalan 0–4
  due: string;        // YYYY-MM-DD
  helped: number;     // berapa kali butuh bantuan
}
interface WaveState {
  digraphs: Record<string, DigraphStat>;   // hanya pasangan yang memuat simbol
  confusions: Record<string, number>;      // "[→{": 4
  cards: Record<string, CardState>;
  boss: Record<string, { tries: number; defused: number; copied: number }>;
  sessions: WaveSessionSummary[];          // paling banyak 20 terakhir
  ritual: { lastDate: string | null; count: number };
}
```

Pasangan dibatasi pada yang memuat sedikitnya satu simbol, jadi jumlah
entrinya terbatas. Ukurannya saya perkirakan belasan kB; angka ini perlu
diukur saat W1 selesai.

### 8.3 Mengukur latensi digraf

Pada tiap tombol benar, arena menyimpan waktunya. Latensi pasangan
(karakter sebelumnya, karakter ini) dicatat bila:

- keduanya di baris yang sama dan berurutan;
- tidak ada salah tekan, Backspace, jeda, atau keluar jendela di antaranya;
- selangnya tidak lebih dari 2 detik (sama dengan `SLOW_MS` Tahap 1; di atas
  itu dianggap berhenti berpikir, bukan gerak jari).

Waktu diambil dari `keydown`. Shift tidak dihitung sebagai tombol tersendiri,
jadi latensi pasangan yang butuh Shift sudah memuat waktu menekan Shift.

### 8.4 Generator Tingkat 1

1. Ambil pasangan berstatus lambat, urutkan dari median terbesar. Bila belum
   ada data, pakai benih Tahap 1 (4.2), lalu urutan bawaan per bahasa.
2. Pilih 3 pasangan teratas sebagai sasaran sesi.
3. Dari indeks digraf → baris, ambil baris yang memuat sasaran; baris yang
   memuat lebih banyak kemunculan didahulukan; baris yang baru saja dimainkan
   dihindari.
4. Sisipkan beberapa baris ulangan dari pasangan yang sudah lancar.
5. Susun sebagai satu blok kode untuk mesin arena.

### 8.5 Tampilan Tingkat 2

Target tetap satu baris utuh. Yang berubah adalah apa yang digambar:

| Level | Tampilan untuk `<div class="card">` |
|---|---|
| 0 | `<div class="card">` |
| 1 | `_div class__card__` (tiap simbol diganti `_`, termasuk `<` di depan; naskah menulisnya `div class__card__`) |
| 2 | `[DIV_BERKELAS: card]` (label yang ditulis tangan per kartu) |

Karakter yang sudah diketik benar ditampilkan apa adanya di ketiga level.
Penjadwalan memakai lima kotak dengan selang 1, 2, 4, 7, dan 14 hari; nilai
ini usulan awal.

### 8.6 Baris boss

```ts
interface BossLine {
  id: string; lang: Lang;
  shown: string;        // yang tampil, bercacat
  answers: string[];    // perbaikan yang sah
  explain: string;      // untuk pembongkaran
}
```

`d` = panjang awalan bersama antara `shown` dan `answers`. Sebelum `d`, mesin
berjalan seperti biasa. Di `d`: karakter `shown[d]` = menyalin; karakter yang
cocok dengan salah satu jawaban = lanjut, dan jawaban yang tidak cocok lagi
disisihkan (untuk `==` dan `===`, pilihannya baru pasti satu karakter
kemudian); lainnya = salah tekan biasa. Baris boss ditutup dengan Enter.

Uji bank: semua jawaban punya `d` yang sama terhadap `shown`; `shown[d]`
berbeda dari tiap `answers[k][d]`; tiap jawaban lolos pemeriksa struktur
(`trapLint`); `shown` dan jawaban berbeda di satu rentang saja.

### 8.7 Pengatur ritme

Dievaluasi sekali tiap baris selesai, dari 20 tombol terakhir:

| Keadaan | Tindakan |
|---|---|
| Salah ≤ 2% dan ancaman di bawah 30 saat baris selesai | Pengali kecepatan +0,1 (maksimal 1,4) |
| 3 salah beruntun, atau salah ≥ 15% | Pengali −0,1 (minimal 0,7) dan sorotan tombol untuk baris berikutnya |
| Lainnya | Tetap |

Angka-angka ini tebakan awal untuk dikalibrasi. Pengali terendah dan tertinggi
tiap sesi dicatat di ringkasan sesi supaya hasil antarsesi bisa dibandingkan.

### 8.8 Sesi ritual

Waktu 10 menit dibagi menurut jam: Tingkat 1 selama 4 menit, Tingkat 2 selama
4 menit, boss 2 menit. Arena sekarang berhenti otomatis saat jendela
ditinggalkan; di sesi ritual jam tetap berjalan. Bila boss belum terbuka atau belum ada kartu yang
siap, waktunya diberikan ke tingkat sebelumnya. Sesi berakhir pada 10:00
walaupun baris belum habis. Sesi ritual tidak menulis ke progres pertemuan
dan tidak masuk Riwayat Misi.

---

## 9. Tasklist

> Tasklist yang berlaku: `docs/064_…` (fase W0–W7 sama; tugasnya dirinci dan
> ditambah).

Ukuran: S = kurang dari setengah hari, M = sekitar satu hari, L = beberapa
hari. Perkiraan kasar.

| | ID | Pekerjaan | Req | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|
| [ ] | W0 | Putuskan K1–K8 | — | — | pemilik | Keputusan tertulis |
| [ ] | W1.1 | `waveStats.ts` + uji unit | W-01–W-04 | M | kode | `npm run test:wave` lulus |
| [ ] | W1.2 | Rekam latensi digraf dan pasangan tertukar di arena yang ada, tanpa mengubah perilaku | W-01, W-02, W-50 | M | kode | Data terisi setelah satu sesi Drill; uji yang ada tetap lulus |
| [ ] | W1.3 | Periksa ambang 250 ms terhadap data dari beberapa orang | W-03 | S | keduanya | Ambang dipertahankan atau diubah dengan alasan tertulis |
| [ ] | W2.1 | Bank baris simbol HTML, CSS, JS + indeks digraf | W-11 | L | kode | Tiap pasangan umum punya ≥ 6 baris yang lolos pemeriksa |
| [ ] | W2.2 | Generator Tingkat 1 + benih Tahap 1 | W-10, W-12 | M | kode | Uji generator lulus |
| [ ] | W2.3 | `WaveGame` Tingkat 1, layar hasil, kartu Dashboard | W-13 | L | kode | Satu sesi Tingkat 1 bisa dimainkan dari Dashboard |
| [ ] | W3.1 | Kartu pola dan tiga level tampilan | W-20, W-24 | M | kode | Kartu contoh tampil benar di tiga level |
| [ ] | W3.2 | Naik-turun level, bantuan, penjadwalan | W-21–W-23 | M | kode | Uji penjadwal lulus |
| [ ] | W4.1 | Bank boss + uji satu-cacat | W-30, W-32 | M | kode | Uji bank lulus |
| [ ] | W4.2 | Mekanik boss di arena + pembongkaran | W-31, W-33, W-34 | L | kode | Menyalin mengurangi nyawa; dua perbaikan sah diterima |
| [ ] | W5.1 | Pengatur ritme + sorotan tombol | W-40, W-41 | M | kode | Uji pengatur lulus; rentang tidak terlampaui |
| [ ] | W5.2 | Bonus Blok Bersih | W-42 | S | kode | Sesuai keputusan K5 |
| [ ] | W6.1 | Sesi ritual 10 menit + layar bukti | W-43–W-45 | M | kode | Berhenti tepat 10:00; bukti tampil |
| [ ] | W7.1 | Uji alur browser untuk Tahap 3 | W-50 | M | kode | Ikut skrip uji alur (`docs/059_…` T2.3) |
| [ ] | W7.2 | Uji coba di satu sesi lab; kalibrasi ambang dan ritme | — | M | pemilik | Catatan dan data terkumpul |
| [ ] | W7.3 | Perluas rekap kelas ke data Tahap 3 | — | M | kode | Setelah `docs/059_…` T4.3 |

**Urutan dan ketergantungan.** W1 lebih dulu dan berdiri sendiri: ia memberi
data untuk memutuskan K3 sebelum generator dibangun. W2 butuh W1. W3 butuh W2
(syarat lulus Tingkat 1). W4 tidak bergantung pada W2 dan W3. W6 butuh
sedikitnya W2. W7.1 butuh skrip uji alur dari Tahap 1.

**MVP yang saya usulkan:** W1 → W2 → W4 → W6 dengan Tingkat 2 level 1 saja
(tanpa simbol). Petunjuk logika (level 2), pengatur ritme, dan penjadwalan
menyusul.

**Kaitan dengan Tahap 1.** Tiga tugas di `docs/059_…` sebaiknya selesai
sebelum W2.2, karena benih personalisasi dan pembanding jangka panjang memakai
data Tahap 1: T2.1 (pemalsuan vonis), T3.1 (menjaga percobaan pertama), dan
T3.9 (fungsi benih). W5.1 butuh T5.6 (keyboard layar yang bisa menyorot satu
tombol). Kontrak datanya ada di `docs/058_…` §14.

---

## 10. Pengujian dan risiko

**Uji unit:** latensi di atas 2 detik tidak tercatat; pasangan dengan 9 sampel
berstatus belum cukup data; 10 sampel bermedian 240 ms dengan akurasi 96%
berstatus lancar; generator memberi hasil sama untuk benih sama; kartu yang
dibantu tidak naik level; tiap baris boss bercacat tunggal; pengali ritme
tidak keluar rentang.

**Uji alur:** sesi Tingkat 1 dari Dashboard; baris tanpa simbol bisa
diselesaikan; menyalin baris boss mengurangi nyawa; ritual berhenti pada
10:00; Quest, Drill, dan Juggling berperilaku sama seperti sebelumnya.

| Risiko | Penanganan |
|---|---|
| Ambang 250 ms tidak tercapai dan mahasiswa tertahan di Tingkat 1 | W1.3 memeriksa ambang lebih dulu; kartu bisa naik lewat akurasi bila ambang direvisi |
| Bank baris terlalu kecil sehingga baris dihafal, bukan pasangannya yang dilatih | Templat dengan nama berganti; hindari baris yang baru dimainkan |
| Tingkat 2 terasa menghukum | Bantuan setelah 3 salah; turun satu level, bukan mengulang dari awal |
| Aturan boss membingungkan | Pengarahan singkat sebelum boss pertama; pembongkaran setelahnya |
| Pengatur ritme membuat hasil tidak sebanding | Pengali dicatat per sesi; syarat lulus tidak bergantung padanya |
| Perubahan mesin merusak sesi yang ada | Arena baru terpisah; W1.2 hanya menambah pencatatan |
| Data pola ketik per orang | Hanya agregat; keputusan O1 berlaku |
| Sepuluh menit tidak cukup untuk tiga tingkat | Pembagian waktu diatur dari satu tempat; dikalibrasi di W7.2 |

## 11. Di luar cakupan

- Menjalankan kode Python, Dart, atau bahasa lain.
- Hiu-hiu terpisah yang berenang membawa teks (perubahan grafis arena).
- Pembuatan baris oleh layanan AI saat aplikasi berjalan.
- Mengunci atau mendeteksi IDE di komputer lab.
- Tahap 2, yang naskahnya belum ada di repo ini.
- Teks proposal SATRIA.

---

## 12. Koreksi (14-11-2026 21:10 WIB)

Saat merinci dokumen ini menjadi `docs/061_…`–`docs/064_…`, saya menjalankan
beberapa percobaan atas kode yang ada. Empat pernyataan di atas ternyata keliru
atau kurang tepat:

| Di dokumen ini | Hasil percobaan | Yang berlaku sekarang |
|---|---|---|
| W-11 dan 8.6: "tiap baris lolos pemeriksa struktur" | 64 dari 161 baris drill dilaporkan rusak bila diperiksa sendirian (`<ul>` tanpa `</ul>`, `} else {`) | Bank disusun dan diperiksa per **blok** 1–4 baris (`docs/063_…` §6.1) |
| 8.3–8.4: latensi dan indeks per pasangan karakter | Pasangan persis terlalu jarang berulang: hanya 1 pasangan CSS dan 6 pasangan JS muncul di ≥ 6 baris drill | **Kunci transisi**: huruf, angka, dan spasi digolongkan; simbol tetap persis (`docs/063_…` §5.1) |
| 4.6: titik koma yang hilang di ujung baris sebagai contoh cacat | JavaScript menerima pernyataan tanpa titik koma; CSS menerima deklarasi terakhir tanpa titik koma | Bukan baris boss. Titik koma di antara dua deklarasi CSS tetap cacat yang sah |
| 8.6: "tiap jawaban lolos pemeriksa" cukup sebagai uji bank | Pemeriksa tidak melihat `if (x = 5)`, `sapa()` sebagai ganti `sapa`, atau titik koma hilang di antara dua deklarasi CSS sebaris | Tiap baris boss bertanda `mesin` atau `manusia`; yang kedua ditinjau orang (`docs/063_…` §8.3) |

Tiga hal ditambahkan dan tidak ada di dokumen ini: ritual tanpa "game over"
(K10), imbalan ritual (K9), dan baris boss yang terbuka per pertemuan di dalam
ritual (K12).
