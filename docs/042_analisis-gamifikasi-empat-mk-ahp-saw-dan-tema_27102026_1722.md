# 042 — Analisis Kritis & Pemetaan Gamifikasi Empat MK, AHP-SAW, UI/UX, Aset, dan Tema

- Tanggal analisis: 27 Oktober 2026
- Basis repo: `arena/bca0facd-codeshark-qwen3-8max2`, HEAD `5cf7675` setelah `git pull --ff-only origin main`
- Acuan utama: `docs/011_master-prompt-gamifikasi-edukasi_13102026_1954.md`
- Acuan pola lama: `arsip/sistem-aplikasi-web-backend-dasar_26102026_1915.zip`, `arsip/cross-platform_26102026_2007.zip`, doc 040, dan doc 041
- Status dokumen: **blueprint analisis dan gerbang keputusan; belum implementasi kode**

## 1. Putusan eksekutif

Permintaan dapat dilaksanakan, tetapi **tidak cukup dengan mengganti label achievement atau menambahkan filter MK pada UI**. Kondisi repo saat analisis menunjukkan empat masalah fondasi:

1. Aplikasi aktif hanya mengekspos dua arena/mode Pemrograman Web, yaitu `tower` dan `shark`. Halaman MK Sistem Aplikasi Web dan MK Lintas Platform sudah diarsipkan serta dilepas dari aplikasi pada pekerjaan sebelumnya.
2. MK RPL belum memiliki halaman, kurikulum, konten, aktivitas, atau subgame.
3. XP, koin, statistik, streak, daily challenge, milestone multiplier, rank, katalog achievement, status klaim, dan hadiah klaim saat ini masih global. Aktivitas pada satu area dapat memengaruhi tampilan dan ekonomi area lain.
4. Tidak ditemukan implementasi SAW maupun AHP pada `src/`, `shared/`, `server/`, `tests/`, atau dokumentasi. AHP-SAW harus dirancang sebagai modul baru, bukan sekadar mengubah konfigurasi yang sudah ada.

Rekomendasi arsitektur:

- Jadikan **MK → Jalur Belajar → Aktivitas** sebagai hierarki domain resmi.
- Pisahkan progres pada level **Jalur Belajar** sebagai silo terkecil.
- Sediakan achievement khusus jalur dan segel capaian MK yang hanya membaca jalur di MK yang sama.
- Jangan membuat total XP platform, rank platform, leaderboard lintas MK, atau mata uang yang dapat dipindahkan antar-MK/antarjalur.
- Gunakan AHP-SAW **di dalam satu silo** untuk indeks kesiapan/masteri dan rekomendasi aktivitas berikutnya. AHP-SAW tidak boleh menjadi kotak hitam penentu achievement dan tidak boleh membandingkan capaian antar-MK.
- Pertahankan loop wajib Master KELAS6185: teori → praktik terpandu → hasil instan → umpan balik pedagogis → rekomendasi langkah berikutnya.
- Pertahankan gerbang non-kompensasi: Quest lulus = Perunggu, Quest + Drill lulus = Perak dan membuka pertemuan berikut, ditambah Juggle lulus = Emas.
- Terapkan tema sebagai paket token/aset yang dapat dipilih pengguna. Tema mengubah presentasi, bukan kesulitan, skor, bobot AHP-SAW, atau syarat achievement.

## 2. Bukti kondisi saat ini

### 2.1 Registry aktif bukan registry MK

`src/data/subgames.ts` hanya berisi:

- `tower` — Coding Tower, mode susun;
- `shark` — CodeShark, mode ketik.

Keduanya adalah **mode/arena interaksi**, bukan identitas mata kuliah. Katalog ini tidak boleh diperlakukan sebagai katalog empat MK. Sistem baru membutuhkan registry terpisah untuk:

- `CourseDef` — MK;
- `LearningPathDef` — Jalur Belajar di dalam MK;
- `ActivityDef` — pertemuan, Quest, Drill, Juggle, simulator, proyek, UTS, UAS;
- `PlayModeDef` — renderer seperti typing, tower, simulator, model builder, kuis, atau rubric task.

### 2.2 Save dan achievement masih global

`SaveData` saat ini menyimpan satu `xp`, satu `coins`, satu `stats`, satu `streak`, satu `dailyChallenge`, milestone multiplier global, dan satu `claimedAchievements`. `src/lib/achievements.ts` membaca metrik global tersebut. `App.finishPractice` memperbarui total global, sedangkan `claimAchievement` menambahkan hadiah ke XP/koin global.

Akibatnya, kebutuhan berikut **belum terpenuhi**:

> Mahasiswa yang fokus pada satu MK hanya melihat dan memperoleh capaian pada MK tersebut; capaian itu tidak berdampak ke MK lain.

Vektor kontaminasi lintas scope yang harus ditutup:

| Vektor saat ini | Dampak lintas scope | Perlakuan target |
|---|---|---|
| `xp` dan rank global | Aktivitas satu MK menaikkan rank semua halaman | XP dan rank per Jalur Belajar |
| `coins` global | Farming di MK mudah membiayai MK lain | Token/koin per jalur, tidak dapat ditransfer |
| `stats` global | WPM/combo/lines membuka badge global | Statistik aktivitas per jalur |
| `modules` tanpa namespace MK/jalur | Risiko tabrakan ID dan atribusi keliru | Activity ID ter-namespace penuh |
| `dailyChallenge` global | Daily satu MK tercatat sebagai daily platform | Daily per jalur dengan pool aktivitas jalur |
| streak dan multiplier global | Konsistensi satu MK memberi bonus di MK lain | Streak/multiplier hanya dari aktivitas jalur yang sama |
| ID achievement global, misalnya `lines-50` | Klaim sekali mengunci semua konteks | ID achievement ter-namespace scope |
| Hadiah klaim ke saldo global | Ekonomi bocor antar-MK | Hadiah hanya masuk saldo scope pemilik achievement |
| Sync `xp`/`coins` tingkat save | Server tidak tahu pemilik scope | Payload dan skema sync wajib membawa `scopeKey` |

### 2.3 Pola Sistem Aplikasi Web dan Lintas Platform dari arsip

Arsip Sistem Aplikasi Web memberi pola yang layak dipertahankan:

- 16 pertemuan dengan CPMK/Sub-CPMK, indikator, masalah, tujuan, output praktikum, milestone proyek, tools, alokasi waktu, teori, langkah, berkas kode, simulator, kuis, tugas, dan rubrik;
- halaman lab berbasis pertemuan dan simulator;
- materi Markdown per pertemuan;
- pemisahan jalur melalui `onSwitchTrack`.

Arsip Lintas Platform memberi pola HUD yang layak dipertahankan:

- hero progres 16 pertemuan;
- tombol “lanjut pertemuan berikut”;
- filter fase Pra-UTS/UTS/Pasca-UTS/UAS;
- pencarian topik;
- tampilan daftar/grid;
- daftar pertemuan dengan status selesai.

Namun pola visual ini belum membuktikan isolasi achievement. Restore halaman dari arsip tanpa mengganti model progres hanya akan memindahkan masalah global ke halaman baru.

### 2.4 Temuan kritis tentang empat Jalur Belajar Sistem Aplikasi Web

Instruksi pemilik platform menyatakan MK Sistem Aplikasi Web memiliki empat Jalur Belajar. Kandidat taksonomi yang paling masuk akal ialah:

1. PHP Native;
2. CodeIgniter 4;
3. Python Flask;
4. Python Django.

Namun arsip saat ini hanya memiliki dua lab terimplementasi:

- `ci_backend`;
- `py_backend`.

Audit isi arsip menemukan ketidaksinkronan penting:

- File kurikulum `ciBackendCurriculum.ts` berjudul Backend Dasar **PHP & MySQL Native** dan fokus pada PHP 8 Native, bukan kurikulum CodeIgniter yang berdiri sendiri.
- Branding lab menyebut CI4/CodeIgniter, sedangkan isi dan materi masih bercampur dengan PHP Native.
- `content/ci_backend` dan `content/php_backend` pada arsip byte-identical.
- Kurikulum Python berfokus utama pada Flask; Django hadir sebagai perbandingan/analogi, bukan 16 pertemuan Django yang mandiri.

Kesimpulan kritis: empat silo Sistem Aplikasi Web **tidak dapat diperoleh hanya dengan mengganti nama dua arsip menjadi empat kartu**. Bila taksonomi empat jalur di atas disetujui, kurikulum dan materi CodeIgniter 4 serta Django harus dipisah/ditulis sebagai jalur mandiri; PHP Native dan Flask perlu diaudit agar tidak membawa materi jalur lain.

### 2.5 MK RPL adalah pembangunan baru

Tidak ditemukan halaman, kurikulum, konten, atau aktivitas RPL. RPL juga tidak cocok dipaksa memakai metrik typing/WPM sebagai bukti utama. Aktivitas RPL harus menilai artefak dan keputusan rekayasa, misalnya kebutuhan, use case, UML, traceability, desain, pengujian, dan dokumentasi.

## 3. Kontrak isolasi scope

### 3.1 Definisi scope

Gunakan kunci kanonis:

```text
scopeKey = {courseId}:{pathId}
```

Kandidat registry:

| MK (`courseId`) | Jalur Belajar (`pathId`) | `scopeKey` | Status sumber |
|---|---|---|---|
| `pemrograman-web` | `inti` | `pemrograman-web:inti` | Aktif; HTML → CSS → JS |
| `sistem-aplikasi-web` | `php-native` | `sistem-aplikasi-web:php-native` | Arsip; perlu audit/pemisahan |
| `sistem-aplikasi-web` | `codeigniter-4` | `sistem-aplikasi-web:codeigniter-4` | Belum mandiri; perlu kurikulum |
| `sistem-aplikasi-web` | `python-flask` | `sistem-aplikasi-web:python-flask` | Arsip; basis terkuat Python |
| `sistem-aplikasi-web` | `python-django` | `sistem-aplikasi-web:python-django` | Belum mandiri; perlu kurikulum |
| `Lintas Platform` | `react-native-expo` | `Lintas Platform:react-native-expo` | Arsip lengkap |
| `rpl` | `sdlc-uml-testing` | `rpl:sdlc-uml-testing` | Belum ada; pembangunan baru |

Total awal: **4 MK dan 7 silo Jalur Belajar**, dengan catatan taksonomi Sistem Aplikasi Web masih memerlukan pengesahan pemilik.

### 3.2 Aturan yang tidak boleh dilanggar

1. Setiap attempt wajib membawa `courseId`, `pathId`, `activityId`, `modeId`, dan versi kurikulum.
2. Fungsi penyelesaian aktivitas tidak boleh menebak scope dari arena visual yang sedang dipilih.
3. XP, token, rank, statistik, streak, daily, milestone, unlock, dan klaim hanya berubah pada `scopeKey` attempt.
4. Achievement jalur hanya boleh membaca progres jalurnya.
5. Segel MK hanya boleh membaca jalur pada MK yang sama dan tidak boleh mengembalikan XP/token ke jalur mana pun.
6. Tidak ada leaderboard, total XP, total badge, atau rank gabungan platform.
7. Hub platform hanya menampilkan kartu status terpisah per MK; tidak menjumlahkan skor lintas MK.
8. Reset progres harus dapat dilakukan per jalur tanpa menyentuh jalur lain. Reset profil global adalah tindakan terpisah dengan konfirmasi lebih kuat.
9. Tema, suara, gerak, dan preferensi aksesibilitas boleh global karena bukan capaian belajar; nilainya tidak boleh memengaruhi reward.
10. Mode bermain tidak menentukan pemilik capaian. Satu aktivitas Pemrograman Web tetap milik Pemrograman Web baik dimainkan sebagai Tower maupun Shark.

### 3.3 Model data target

```ts
type ScopeKey = `${string}:${string}`;

interface ScopeProgress {
  xp: number;
  tokens: number;
  activities: Record<string, ActivityProgress>;
  stats: ScopeStats;
  streak: DailyStreak;
  dailyChallenge: DailyChallengeRecord;
  unlockedStreakMilestones: number[];
  claimedAchievements: Record<string, number>;
  lastActivityAt: number | null;
  masterySnapshots?: Record<string, AhpSawSnapshot>;
}

interface SaveDataV2 {
  schemaVersion: 2;
  profile: Profile | null;
  preferences: {
    themeId: string;
    sound: boolean;
    reducedMotion: boolean;
  };
  scopes: Partial<Record<ScopeKey, ScopeProgress>>;
  deviceId: string;
  updatedAt: number;
}
```

Rank tidak disimpan sebagai sumber kebenaran; rank diturunkan dari XP **scope aktif** menggunakan tangga rank MK terkait.

### 3.4 Migrasi save lama

Migrasi harus konservatif dan dapat diaudit:

1. Simpan salinan cadangan save v1 sebelum migrasi.
2. Petakan progres aktif yang terbukti berasal dari kurikulum HTML/CSS/JS ke `pemrograman-web:inti`.
3. Jangan membagi XP, koin, WPM, combo, lines, streak, atau daily global lama ke MK lain; data historis tersebut tidak memiliki atribusi yang cukup.
4. Kunci modul yatim dari modul yang pernah dilepas hanya boleh dipulihkan sebagai status aktivitas bila format ID-nya dapat dibuktikan. Saldo XP/token scope hasil restore tidak boleh direkonstruksi dari saldo global lama.
5. Bila diperlukan, berikan penanda historis non-ekonomi seperti “Penjelajah Legacy” pada scope terkait, tanpa XP/token dan tanpa membuka gerbang kurikulum secara otomatis.
6. Migrasi harus idempoten: menjalankan loader dua kali tidak menggandakan saldo atau klaim.

## 4. Pemetaan Master KELAS6185

| Bagian 011 | Penerapan empat MK | Penyesuaian kritis |
|---|---|---|
| 1.1 Core Learning Loop | Tiap pertemuan: teori singkat → Quest terpandu → Drill → Juggle/simulator/proyek → hasil → refleksi | Urutan tidak boleh dibalik menjadi game dulu tanpa konsep |
| 1.2 Motivasi | Autonomy melalui MK/jalur/mode/tema; competence melalui progres scope; relatedness melalui identitas MK; purpose melalui milestone proyek | Pilihan tema/mode tidak mengubah reward |
| 1.3 Flow | Hint bertingkat, retry tanpa hukuman saldo, rekomendasi AHP-SAW | Kesulitan adaptif tidak melewati prasyarat Perak |
| 3. Engine & validasi | Typing validator untuk Web; deterministic checker untuk lab/simulator; rubric checker untuk RPL | WPM bukan metrik universal |
| 4.1 XP anti-farm | `applyAttempt` per aktivitas dalam scope; hanya delta di atas best | Best XP/token disimpan per aktivitas dan scope |
| 4.2 Rank & badge | Tangga rank per MK/jalur; badge namespace scope | Tidak ada rank platform |
| 4.3 Quest/Drill/Juggle | Quest = artefak utama; Drill = mikro-keterampilan; Juggle = interleaving topik sekarang + sebelumnya | Bentuk aktivitas menyesuaikan domain, fungsi pedagogis tetap |
| 5.1 Design token | Token tema global + aksen/ikon MK | Warna bukan satu-satunya pembeda status |
| 5.2 HUD | Maksimal lima elemen persisten | Scope breadcrumb selalu terlihat agar mahasiswa tidak salah MK/jalur |
| 5.3 Feedback <120 ms | Validasi lokal, bunyi/visual langsung | Status juga diumumkan secara aksesibel, bukan audio saja |
| 5.4 Result screen | Skor, bukti mastery, kesalahan utama, saran berikut | Jelaskan rekomendasi AHP-SAW dengan faktor teratas |
| 6. Performance | Lazy-load halaman MK, tema, dan aset jalur | Arsip tidak dibundel sebelum scope dipilih bila memungkinkan |
| 7. Curriculum | 16 pertemuan, fase, UTS, UAS, CPMK, output praktikum | Setiap aktivitas memetakan CPMK dan indikator |
| 8. Audio-visual | SFX prosedural, partikel hemat, maskot reaktif | Hormati mute, reduced motion, dan hemat baterai |
| 9. Accessibility | WCAG 2.1 AA, keyboard, alternatif sentuh, label status | Aktivitas keyboard harus punya alternatif non-keyboard bila memungkinkan |
| 10. Testing/KPI | Unit scope isolation, AHP consistency, SAW determinism, migrasi, browser smoke | KPI dihitung per scope, bukan digabung untuk ranking mahasiswa |

## 5. Desain AHP-SAW per scope

### 5.1 Keputusan yang sebenarnya didukung

AHP-SAW digunakan untuk dua keluaran formatif dalam satu scope:

1. **Indeks Kesiapan/Masteri** per pertemuan dan per jalur;
2. **Peringkat rekomendasi aktivitas berikutnya**, misalnya ulasan teori, Drill fokus kesalahan, ulangi Quest, Juggle, simulator/proyek, atau daily jalur.

AHP-SAW **tidak** digunakan untuk:

- membuka achievement secara tersembunyi;
- menentukan nilai akhir mata kuliah tanpa validasi instrumen;
- membandingkan mahasiswa antar-MK;
- menggantikan gerbang Quest/Drill/Juggle;
- mengompensasi kegagalan kritis, misalnya akurasi rendah tertutup kecepatan tinggi.

Achievement tetap memakai syarat eksplisit yang dapat dibaca mahasiswa. AHP-SAW memberi arahan “apa langkah paling bermanfaat berikutnya” dan ringkasan kesiapan.

### 5.2 Hierarki kriteria bersama

Level tujuan: kesiapan belajar dan prioritas aktivitas berikutnya **pada satu `scopeKey`**.

| Kode | Dimensi | Makna | Sifat SAW |
|---|---|---|---|
| C1 | Bukti mastery | Kualitas hasil Quest/proyek/rubrik terhadap target | Benefit |
| C2 | Retensi & transfer | Juggle, review berjarak, tugas campuran | Benefit |
| C3 | Cakupan penyelesaian | Proporsi aktivitas/pertemuan yang lulus | Benefit |
| C4 | Pemulihan kesalahan & kualitas | Penurunan error berulang, keberhasilan debugging/validasi | Benefit; error mentah adalah cost |
| C5 | Konsistensi scope | Hari aktif dan daily hanya pada scope yang sama | Benefit, dibatasi agar tidak menghukum jadwal mahasiswa |
| C6 | Efisiensi sesuai konteks | WPM untuk typing; langkah/waktu debugging untuk lab; kejelasan artefak untuk RPL | Benefit setelah diubah ke skala rubrik; bobot kecil |

Kriteria bersama hanya kerangka. Operasionalisasi dan bobot akhir bersifat lokal per MK/jalur.

### 5.3 Operasionalisasi per MK/jalur

| Scope | C1 Mastery | C2 Retensi | C4 Kualitas/error | C6 Efisiensi |
|---|---|---|---|---|
| Pemrograman Web | Akurasi Quest, validitas hasil preview, semantik | Juggle HTML/CSS/JS | Error karakter/tag berulang, perbaikan Drill | WPM terbatasi dan hanya dihitung sesudah ambang akurasi |
| SAW PHP Native | CRUD berjalan, SQL benar, session & validasi | Campuran routing–DB–form–auth | SQL injection/XSS guard, debugging request | Langkah penyelesaian simulator |
| SAW CodeIgniter 4 | Route–Controller–Model–View, migration, validation | Campuran MVC lintas pertemuan | Error route/model, keamanan form | Keberhasilan build/test simulator |
| SAW Flask | Route, template, DB/ORM, auth | Campuran request lifecycle | Error WSGI/route/query, debugging | Langkah penyelesaian lab |
| SAW Django | Model, view, template, admin, ORM | Campuran MVT lintas pertemuan | Error migration/query/form | Keberhasilan test/cek proyek |
| Lintas Platform | Komponen, layout, state, navigation, API, build | Campuran UI–state–API | Bug UI/state, keberhasilan perangkat | Waktu/lankah build di simulator |
| RPL | Kebutuhan, UML, desain, traceability, test plan | Kasus lintas fase SDLC | Inkonsistensi artefak yang diperbaiki | Kejelasan dan ketepatan artefak, bukan WPM |

### 5.4 Bobot awal untuk lokakarya AHP

Angka berikut adalah **prior awal untuk elisitasi pairwise**, bukan bobot final yang boleh diklaim valid:

| MK | C1 | C2 | C3 | C4 | C5 | C6 |
|---|---:|---:|---:|---:|---:|---:|
| Pemrograman Web | 0,32 | 0,22 | 0,18 | 0,12 | 0,08 | 0,08 |
| Sistem Aplikasi Web | 0,36 | 0,20 | 0,16 | 0,16 | 0,07 | 0,05 |
| Lintas Platform | 0,34 | 0,20 | 0,17 | 0,15 | 0,07 | 0,07 |
| RPL | 0,38 | 0,20 | 0,16 | 0,16 | 0,06 | 0,04 |

Bobot final per jalur harus dihasilkan dari matriks perbandingan berpasangan yang disetujui pengampu, disimpan sebagai konfigurasi berversi, dan diterbitkan bersama riwayat perubahannya. Konfigurasi tidak valid bila CR > 0,10.

### 5.5 Prosedur AHP

Untuk enam kriteria:

1. Bentuk matriks pairwise `A = [a_ij]`, dengan `a_ii = 1` dan `a_ji = 1 / a_ij`.
2. Hitung vektor prioritas `w` dengan eigenvector utama atau metode geometric mean yang didokumentasikan.
3. Normalisasi sehingga `Σ w_j = 1`.
4. Hitung `λmax` dari `Aw`.
5. Hitung Consistency Index: `CI = (λmax − n) / (n − 1)`.
6. Hitung Consistency Ratio: `CR = CI / RI`; untuk `n = 6`, RI standar Saaty adalah 1,24.
7. Tolak konfigurasi bila `CR > 0,10`, ada nilai non-positif, reciprocal rusak, atau jumlah bobot menyimpang melewati toleransi.
8. Simpan `criteriaVersion`, matriks, bobot, `λmax`, CI, CR, penyetuju, dan tanggal berlaku.
9. Lakukan sensitivity check: perubahan kecil bobot tidak boleh mengubah rekomendasi secara liar tanpa penjelasan.

### 5.6 Prosedur SAW dengan anchor tetap

SAW murni yang menormalisasi dengan maksimum/peserta lain berisiko rank reversal dan tidak cocok untuk indeks mastery personal. Karena itu gunakan **SAW beranchor rubrik tetap** dalam scope:

Untuk kriteria benefit:

```text
r_ij = clamp((x_ij − min_j) / (max_j − min_j), 0, 1)
```

Untuk kriteria cost:

```text
r_ij = clamp((max_j − x_ij) / (max_j − min_j), 0, 1)
```

Skor:

```text
MasteryIndex_i = 100 × Σ(w_j × r_ij)
```

Anchor `min_j` dan `max_j` berasal dari rubrik kurikulum, bukan dari mahasiswa lain. Skor disimpan sebagai snapshot turunan beserta versi kriteria/bobot; progres mentah tetap menjadi sumber kebenaran.

### 5.7 Gerbang non-kompensasi

SAW bersifat kompensatoris. Tanpa gerbang, kecepatan dapat menutupi ketidakakuratan. Karena itu:

- Quest belum mencapai target → status pertemuan belum Perunggu, apa pun indeks SAW;
- Quest + Drill belum lulus → pertemuan berikut tetap terkunci;
- rubrik kritis keamanan/validitas di bawah minimum → rekomendasi wajib remedial;
- C6 untuk Pemrograman Web bernilai nol dalam rekomendasi kelulusan bila akurasi di bawah target;
- indeks ditampilkan sebagai rentang kesiapan, bukan pengganti status lulus.

Usulan label indeks:

| Indeks | Label | Makna UI |
|---:|---|---|
| 0–39 | Fondasi | Perlu teori/Drill terbimbing |
| 40–59 | Berkembang | Perkuat kesalahan dominan |
| 60–74 | Siap Berlatih Mandiri | Juggle/simulator dianjurkan |
| 75–89 | Kuat | Proyek/tantangan campuran |
| 90–100 | Masteri | Capstone/optimalisasi |

Label ini tidak mengubah Perunggu/Perak/Emas.

### 5.8 Penjelasan rekomendasi

Setiap rekomendasi harus membawa alasan teratas, contohnya:

> Drill simbol disarankan karena pemulihan kesalahan masih rendah dan akurasi Quest belum mencapai 90%.

UI tidak cukup menampilkan angka `0,82`. Simpan kontribusi `w_j × r_ij` agar dosen dapat mengaudit alasan rekomendasi dan mahasiswa memahami tindakan berikutnya.

## 6. Katalog achievement dan identitas

### 6.1 Struktur katalog

Setiap jalur memiliki katalog sendiri. Pola ID:

```text
{scopeKey}:badge:{slug}
```

Contoh:

```text
pemrograman-web:inti:badge:quest-pertama
sistem-aplikasi-web:python-flask:badge:crud-master
Lintas Platform:react-native-expo:badge:eas-builder
rpl:sdlc-uml-testing:badge:traceability-keeper
```

Setiap definisi wajib mencantumkan:

- `courseId` dan `pathId`;
- kategori: mastery, retensi, Konsistensi, kualitas, proyek, atau eksplorasi;
- target yang dapat dibaca;
- metrik scope;
- tier Perunggu/Perak/Emas/Berlian;
- motif grafis;
- hadiah XP/token **scope yang sama**;
- CPMK/indikator terkait bila relevan.

### 6.2 Template capaian per jalur

Template awal 12 capaian dapat dipakai agar setiap jalur terasa setara tanpa menyamakan identitas:

1. langkah pertama pada jalur;
2. 4 Quest lulus;
3. 8 Quest lulus;
4. 16 Quest/pertemuan inti lulus;
5. 4 status Perak;
6. 8 status Emas;
7. akurasi/rubrik tinggi dengan bukti minimum;
8. 4 Juggle/aktivitas campuran lulus;
9. perbaikan kesalahan dominan;
10. daily jalur 1/5/10 kali atau streak jalur bertingkat;
11. milestone UTS/proyek tengah;
12. capstone/UAS jalur.

Jumlah final boleh berbeda sesuai kurikulum, tetapi setiap target harus mungkin dicapai dari aktivitas jalur itu sendiri.

### 6.3 Identitas capaian spesifik

| Scope | Contoh identitas badge |
|---|---|
| Pemrograman Web | Penjaga Semantik, Arsitek Kotak CSS, Penjinak Flexbox, Penggerak DOM, Pelaut Responsif |
| SAW PHP Native | Penjaga Request, Pandai CRUD, Penjaga SQL, Sentinel Session, Kapten Deploy |
| SAW CodeIgniter 4 | Marshal Route, Artisan MVC, Master Migrasi, Perisai Validasi, Kapten Rilis |
| SAW Flask | Pelari Route, Perajin Jinja, Penjinak Database, Penjaga Auth, Pilot WSGI |
| SAW Django | Pembentuk Model, Penenun View, Ahli ORM, Penjaga Admin, Marshal Deployment |
| Lintas Platform | Perajin Komponen, Navigator Flexbox, Pilot State, Penghubung API, Penjelajah Perangkat, Builder EAS |
| RPL | Pramuka Kebutuhan, Kartografer Use Case, Arsitek UML, Penjaga Traceability, Strategis Uji, Auditor Rilis |

Nama-nama di atas adalah draf kreatif, bukan kurikulum final.

### 6.4 Segel MK

Selain achievement jalur, MK dapat memiliki segel turunan:

- Pemrograman Web: segel kelulusan jalur inti;
- Sistem Aplikasi Web: segel untuk tiap jalur dan segel “Empat Arus Backend” bila keempat jalur tuntas;
- Lintas Platform: segel builder lintas perangkat;
- RPL: segel rekayasawan perangkat lunak.

Segel MK bersifat baca-saja dari jalur MK yang sama. Segel tidak menambah XP/token global dan tidak membuka aktivitas MK lain.

## 7. Pemetaan pola Quest/Drill/Juggle per MK

| MK/jalur | Quest | Drill | Juggle/campuran | Bukti utama |
|---|---|---|---|---|
| Pemrograman Web | Mengetik/menyusun kode utuh pertemuan | Baris sintaks pendek | Drill pertemuan ini + bahasa/topik sebelumnya | Akurasi, hasil preview, retensi |
| SAW PHP Native | Membangun fitur PHP/MySQL terbimbing | Potongan PHP, SQL, form, session | Kasus debug request–DB–auth lintas pertemuan | Fungsi, keamanan, debugging |
| SAW CodeIgniter 4 | Membangun fitur MVC | Route/model/query/validation | Kasus campuran route–migration–view | Arsitektur MVC dan fungsi |
| SAW Flask | Membangun route/fitur Flask | Decorator, template, query, auth | Debug lifecycle lintas topik | Fungsi dan pemahaman WSGI |
| SAW Django | Membangun fitur MVT | Model, URL, view, form, ORM | Perubahan schema dan alur lintas app | Model/data dan fungsi |
| Lintas Platform | Membangun layar/fitur aplikasi | JSX, styling, state, navigation | Campuran UI–API–perangkat | Hasil simulator dan build readiness |
| RPL | Menghasilkan artefak kasus per fase | Keputusan istilah/elemen model | Skenario perubahan kebutuhan lintas fase | Ketepatan, konsistensi, traceability, uji |

Pertemuan ke-8 dan ke-16 mempertahankan pola UTS/UAS atau milestone proyek sesuai RPS masing-masing.

## 8. Blueprint UI/UX

### 8.1 Hierarki navigasi

```text
Hub Platform
└─ Pilih MK
   └─ Pilih Jalur Belajar (wajib untuk Sistem Aplikasi Web)
      └─ Dashboard Scope
         ├─ Peta 16 Pertemuan
         ├─ Detail Pertemuan
         │  ├─ Teori/Materi
         │  ├─ Quest
         │  ├─ Drill
         │  ├─ Juggle
         │  └─ Simulator/Proyek/Rubrik
         ├─ Achievement Scope
         ├─ Daily Scope
         └─ Pengaturan Tema & Aksesibilitas
```

### 8.2 Hub platform

Hub menampilkan empat kartu MK. Setiap kartu hanya berisi:

- emblem dan nama MK;
- jalur terakhir dibuka;
- status per jalur secara terpisah;
- tombol masuk;
- penanda “progres tersimpan terpisah”.

Hub tidak menampilkan XP total, koin total, rank gabungan, atau jumlah badge gabungan.

### 8.3 Dashboard scope

HUD persisten maksimal lima elemen sesuai Master KELAS6185:

1. identitas MK/jalur;
2. rank dan XP scope;
3. token scope;
4. streak scope;
5. progres menuju gerbang/pertemuan berikut.

Di bawah HUD:

- kartu “Lanjutkan” berisi rekomendasi AHP-SAW dan alasannya;
- peta pertemuan dengan fase, pencarian, serta status terkunci/tersedia/Perunggu/Perak/Emas;
- daily khusus scope;
- ringkasan achievement scope dan tombol klaim;
- segel MK pada tab terpisah;
- pemilih mode bermain hanya pada aktivitas yang mendukung lebih dari satu renderer.

### 8.4 Halaman achievement

- Filter default terkunci ke scope aktif.
- Tab hanya: “Jalur Ini” dan “Segel MK”.
- Tidak ada tab “Semua MK”.
- Badge terkunci menampilkan syarat dan progres scope, bukan progres dari MK lain.
- Klaim menampilkan tujuan saldo secara eksplisit, misalnya “+80 XP Flask”.

### 8.5 Layar hasil

Layar hasil mengikuti anatomi 011:

1. status lulus/belum dan perubahan Perunggu/Perak/Emas;
2. XP/token delta anti-farm;
3. bukti kinerja utama;
4. kesalahan dominan/miskonsepsi;
5. perubahan Indeks Kesiapan AHP-SAW;
6. satu rekomendasi aktivitas berikut beserta alasan;
7. pilihan ulangi, kembali ke peta, atau lanjut rekomendasi.

### 8.6 Perlindungan dari salah scope

- Breadcrumb selalu menampilkan MK dan jalur.
- Kartu daily, achievement, dan streak mencantumkan nama jalur.
- Dialog reset menyebut `scopeKey` dalam bahasa manusia.
- Deep link tanpa jalur untuk Sistem Aplikasi Web harus membuka pemilih jalur, bukan menebak jalur terakhir secara diam-diam bila konteks tautan dapat menyesatkan. Jalur terakhir boleh disorot sebagai saran.

## 9. Sistem tema interaktif dan identitas visual

### 9.1 Pisahkan tema dari identitas MK

Dua lapisan visual harus dipisahkan:

1. **Skin tema global** — dipilih pengguna; mengatur token warna, permukaan, bingkai HUD, latar, gaya maskot, dan paket bunyi.
2. **Motif MK/jalur** — tetap; mengatur emblem, ikonografi, kosakata badge, dan aksen domain.

Pemisahan ini mencegah mahasiswa kehilangan orientasi MK hanya karena mengganti tema.

### 9.2 Kandidat skin tema

| Kandidat | Karakter | Kekuatan | Risiko |
|---|---|---|---|
| Samudra CodeShark | Laut dalam, Captain Shark, teal/cyan/amber | Paling selaras aset aktif; biaya terendah | Domain server/RPL perlu motif tambahan |
| Cyber Harbor / Neon Lab | Pelabuhan server, sirkuit, hologram | Kuat untuk SAW dan Lintas Platform | Kontras dan stimulasi visual harus diuji |
| Campus Blueprint | Kertas/grid terang, biru blueprint | Sangat terbaca; kuat untuk RPL | Rasa game lebih ringan |
| Archipelago Expedition | Kepulauan/biome per MK, peta ekspedisi | Empat MK terasa sebagai dunia utuh | Kebutuhan ilustrasi lebih besar |

Rekomendasi MVP: gunakan **Samudra CodeShark sebagai skin bawaan**, lalu sediakan **Campus Blueprint** sebagai skin terang/aksesibel dan **Cyber Harbor** sebagai skin alternatif. Archipelago Expedition dapat menjadi arah peta jangka panjang bila asetnya disetujui.

### 9.3 Motif tetap per MK/jalur

| Scope | Motif | Aksen awal | Ikonografi |
|---|---|---|---|
| Pemrograman Web | Terumbu & bengkel halaman | Teal, cyan, amber | Tag, jendela browser, blok layout |
| SAW PHP Native | Bengkel server | Indigo, amber | Gulungan script, kunci pas, database |
| SAW CodeIgniter 4 | Tempa rute | Oranye, merah | Api terkendali, rel route, perisai |
| SAW Flask | Laboratorium alkimia digital | Slate, cyan | Labu ukur, pipa request, formula |
| SAW Django | Benteng model | Emerald, slate | Blok model, gerbang, peta relasi |
| Lintas Platform | Skyport perangkat | Sky, violet | Ponsel, orbit, jembatan API |
| RPL | Benteng blueprint | Biru, putih, kuning aksen | Kompas, cetak biru, simpul UML, daftar uji |

Warna hanya aksen. Status selesai/terkunci/lulus wajib juga dibedakan oleh ikon, label, pola, atau bentuk.

### 9.4 Pengalaman pemilih tema

- Radio card berisi pratinjau mini HUD, kartu pertemuan, badge, dan tombol.
- Perubahan diterapkan langsung pada pratinjau.
- Setiap kartu menampilkan status kontras dan catatan gerak.
- Kontrol reduced motion terpisah dari pilihan warna.
- Tema tersimpan sebagai preferensi profil, bukan achievement.
- Tombol reset mengembalikan Samudra CodeShark.
- Tema tidak mengubah urutan kurikulum, target, skor, bobot, atau reward.

## 10. Inventaris dan rencana aset grafis

### 10.1 Aset yang dapat dipakai ulang

Repo aktif telah memiliki:

- Captain Shark dan Cyber Shark;
- lapisan laut SVG;
- stasiun karang/dome/lab;
- atlas HUD;
- sprite badge enabled/disabled WebP/PNG dan generator badge;
- ikon UI internal;
- karakter/maskot reaktif.

Aset tersebut cukup untuk MVP Pemrograman Web dan skin Samudra. Aset tidak otomatis cukup untuk membedakan tujuh scope.

### 10.2 Aset baru yang diperlukan

| Kelompok | Jumlah awal | Catatan produksi |
|---|---:|---|
| Emblem MK | 4 | Tanpa teks di dalam gambar; versi terang/gelap diuji kontras |
| Emblem jalur Sistem Aplikasi Web | 4 | Menggunakan bingkai MK sama, motif dan aksen berbeda |
| Latar hero/biome | 4 | Responsive crop; WebP utama, PNG/JPG fallback seperlunya |
| Tekstur/pola peta | 4 | Dekoratif, tidak menurunkan keterbacaan node |
| Bingkai badge per MK | 4 | Generator data-driven; status enabled/disabled |
| Motif glyph badge | ±24 reusable | Digabung dengan tier dan bingkai MK untuk menghemat atlas |
| Segel capstone | 4–7 | Satu per jalur/MK sesuai keputusan katalog |
| Varian maskot/skin | 2–3 | Hanya kosmetik; ekspresi tetap konsisten |
| Ilustrasi empty/locked/completed | 3 pola reusable | Dapat berupa ikon/komposisi CSS pada MVP |

### 10.3 Aturan aset

- Jangan membakar teks penting ke dalam raster.
- Sediakan alt text atau tandai dekoratif dengan benar.
- Lazy-load aset MK/jalur yang tidak aktif.
- Gunakan sprite/atlas untuk badge berulang.
- Uji ukuran unduhan awal dan performa perangkat rendah.
- Badge generator saat ini perlu diubah dari switch berbasis daftar global menjadi konfigurasi motif + tier + scope agar dapat diskalakan ke puluhan badge.
- Jangan membuat aset final empat jalur sebelum taksonomi Sistem Aplikasi Web disahkan.

## 11. Rencana implementasi bertahap

### Fase 0 — Keputusan domain dan kurikulum

- Sahkan empat Jalur Belajar Sistem Aplikasi Web.
- Sahkan batas ekonomi scope dan keberadaan segel MK.
- Sahkan arah skin tema MVP.
- Audit kurikulum arsip per pertemuan; tandai materi PHP Native, CodeIgniter, Flask, Django, React Native/Expo.
- Susun kerangka 16 pertemuan RPL beserta CPMK dan artefak penilaiannya.
- Lokakarya pairwise AHP dengan pengampu; hasilkan konfigurasi CR valid.

### Fase 1 — Fondasi scope dan AHP-SAW

- Tambahkan registry MK/jalur/aktivitas/mode.
- Implementasikan SaveData v2 dan migrasi idempoten.
- Ubah `applyAttempt`, unlock, daily, streak, rank, dan klaim menjadi scope-aware.
- Namespace seluruh activity dan achievement ID.
- Implementasikan validator AHP, kalkulator SAW beranchor, snapshot, dan penjelasan rekomendasi.
- Tambahkan test isolasi: attempt pada scope A tidak mengubah byte progres scope B selain metadata yang memang global.

### Fase 2 — Pilot Pemrograman Web

- Terapkan dashboard scope pada kurikulum aktif.
- Petakan achievement lama ke `pemrograman-web:inti` atau ganti dengan katalog baru yang ekuivalen.
- Terapkan daily/streak scope dan layar hasil berpenjelasan.
- Terapkan token tema dan pemilih tema MVP.
- Jadikan fase ini bukti pola sebelum restore massal.

### Fase 3 — Restore dan pembangunan MK lain

- Restore Lintas Platform melalui adapter scope baru, bukan menghidupkan save global lama.
- Restore Sistem Aplikasi Web setelah pemisahan empat kurikulum; jangan menerbitkan jalur yang materinya belum mandiri sebagai jalur selesai.
- Bangun RPL dengan aktivitas artefak/rubrik, bukan sekadar mengganti teks typing.
- Tambahkan registry penyediaan fitur agar MK yang belum siap tidak tampil sebagai halaman kosong yang menyesatkan.

### Fase 4 — Aset, tema, dan polish

- Produksi emblem, biome, bingkai badge, dan segel berdasarkan tema terpilih.
- Regenerasi atlas badge per scope/kelompok motif.
- Uji kontras, reduced motion, keyboard, layar kecil, dan performa.
- Uji kebingungan scope dengan skenario pengguna: mahasiswa harus selalu dapat menjawab MK dan jalur yang sedang dibuka.

### Fase 5 — Sinkronisasi dan analitik

- Perluas payload attempt dan save cloud dengan `scopeKey`, versi kurikulum, serta versi AHP-SAW.
- Pertahankan Env-Gated Graceful Fallback: scope lokal tetap berjalan saat auth/cloud tidak siap.
- Analitik KPI hanya diagregasi untuk evaluasi desain per scope; jangan mengubahnya menjadi leaderboard lintas MK.
- Sediakan ekspor konfigurasi AHP dan snapshot untuk audit dosen.

## 12. Matriks pengujian wajib

| Area | Skenario lulus |
|---|---|
| Isolasi XP/token | Selesaikan aktivitas Flask; saldo PHP Native, Web, Lintas Platform, RPL tetap sama |
| Isolasi achievement | Target Flask tercapai; badge jalur lain tetap terkunci dan tidak dapat diklaim |
| Isolasi daily/streak | Daily Web selesai; daily dan streak jalur lain tidak bertambah |
| Anti-farm | Replay skor sama menghasilkan delta XP/token nol pada scope yang sama |
| Unlock | Perak pada satu jalur tidak membuka pertemuan jalur lain |
| Klaim | Hadiah badge Django hanya masuk saldo Django |
| Migrasi | Save v1 dimigrasikan sekali; tidak ada saldo yang disebar ke MK lain |
| AHP | Matriks reciprocal valid diterima; CR >0,10 ditolak |
| SAW | Anchor tetap menghasilkan skor deterministik; urutan input tidak mengubah hasil |
| Gerbang | Indeks tinggi tetapi akurasi Quest rendah tetap belum lulus |
| Tema | Mengganti tema tidak mengubah progres, bobot, target, atau reward |
| Reset | Reset satu jalur tidak menyentuh enam scope lain |
| Sync | Attempt membawa `scopeKey`; payload tanpa scope ditolak atau masuk karantina legacy |
| Aksesibilitas | Status tidak hanya warna; keyboard dan reduced motion bekerja |
| Performa | Halaman MK tidak memuat seluruh aset tujuh scope sekaligus |

## 13. Risiko dan anti-pola

1. **Menamai ulang arena sebagai MK.** Tower/Shark adalah mode, bukan mata kuliah.
2. **Restore arsip mentah.** Halaman lama mengasumsikan konteks global dan mengandung ketidaksinkronan kurikulum Sistem Aplikasi Web.
3. **AHP-SAW sebagai nilai akhir.** Bobot AHP bersifat judgment; perlu validasi dan tidak boleh mengaburkan rubrik resmi.
4. **Normalisasi antar-mahasiswa.** Melanggar privasi tujuan formatif dan memicu kompetisi yang tidak diminta.
5. **Satu metrik untuk semua MK.** WPM tidak valid sebagai bukti utama RPL atau backend.
6. **Ekonomi bersama berkedok kosmetik.** Token bersama tetap memungkinkan transfer usaha antar-MK.
7. **Badge berlimpah tanpa bukti belajar.** Setiap badge harus terhubung ke perilaku/artefak yang bermakna.
8. **Tema sebagai membedakan kesulitan.** Tema adalah presentasi; kesulitan berasal dari kurikulum dan adaptasi pedagogis.
9. **Migrasi yang mengarang atribusi.** Data global lama yang tidak diketahui pemiliknya tidak boleh dibagi secara spekulatif.
10. **Halaman placeholder dianggap selesai.** Registry boleh mengenal MK yang belum terbit, tetapi UI harus jujur membedakan aktif, arsip siap restore, dan belum dibangun.

## 14. Gerbang keputusan interaktif

Sebelum kode fondasi ditulis, pemilik perlu mengesahkan:

1. ruang lingkup fase pertama: fondasi + pilot Web, restore bertahap, atau pembangunan seluruh halaman sekaligus;
2. taksonomi resmi empat Jalur Belajar Sistem Aplikasi Web;
3. kebijakan ekonomi: silo ketat per jalur dengan segel MK baca-saja, atau varian lain;
4. arah skin tema MVP yang dapat dipilih pengguna.

Keputusan tersebut menentukan registry, migrasi, katalog badge, aset, dan urutan implementasi. Dokumen ini tidak mengklaim halaman Lintas Platform, RPL, Sistem Aplikasi Web empat jalur, atau AHP-SAW telah tersedia sebelum keputusan dan implementasinya selesai.
