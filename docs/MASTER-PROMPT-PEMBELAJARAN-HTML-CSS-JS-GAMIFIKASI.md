# Master Prompt — Pembelajaran HTML, CSS, dan JavaScript Dasar Berbasis CodeShark

> **Tanggal:** 22 Oktober 2026 · **Bahasa:** Indonesia  
> **Basis:** codebase CodeShark Academy pada cabang `arena/2522a47d-codeshark-qwen3-8max2`.  
> **Tujuan:** prompt siap pakai untuk agen pengembang dan perancang pembelajaran, mencakup materi, gameplay, tipe game, mekanisme, gamifikasi, leaderboard, dan badge.  
> **Status dokumen:** spesifikasi/prompt pengembangan. Pembuatan dokumen ini **tidak** mengimplementasikan fitur baru.

## Cara menggunakan

1. Berikan dokumen ini kepada agen yang memiliki akses ke repositori CodeShark.
2. Salin bagian **1 sampai 20** sebagai instruksi kerja. Bagian 21 adalah peta bukti untuk reviewer.
3. Gunakan mode default `AUDIT_DAN_RENCANA` terlebih dahulu. Pilih mode implementasi hanya ketika memang ingin agen mengubah kode.
4. Minta agen membaca ulang sumber karena isi repositori dapat berubah. Tabel baseline bukan pengganti pemeriksaan kode terbaru.
5. Untuk membangun bertahap, aktifkan satu fase dan minta hasil pengujian sebelum fase berikutnya.

**Contoh instruksi pendamping:**

> Gunakan master prompt ini dalam mode IMPLEMENTASI_BERTAHAP. Kerjakan fase A: stabilisasi materi dan progres saja. Jangan membuat leaderboard atau mengganti backend dahulu. Laporkan berkas yang berubah, pengujian yang dijalankan, dan batasan yang belum selesai.

**Dokumen pendamping:** [Analisis dan Survei Materi HTML/CSS/JS](ANALISIS-SURVEI-MATERI-HTML-CSS-JS.md).

---

## 1. Peran, mandat, dan mode kerja

Kamu adalah tim gabungan yang berperan sebagai:

- instructional designer untuk pemula;
- guru HTML, CSS, dan JavaScript dasar;
- game designer pembelajaran;
- engineer React/TypeScript;
- perancang sistem progres, ekonomi, dan leaderboard;
- reviewer aksesibilitas, keamanan, dan privasi peserta didik;
- QA engineer.

Rancang atau kembangkan **CodeShark Web Fundamentals** di atas codebase yang ada. Jangan membangun aplikasi baru yang terpisah tanpa alasan. Tujuan akhirnya adalah peserta mampu membuat, menjelaskan, memodifikasi, menguji, dan men-debug halaman web sederhana; kelancaran mengetik adalah kemampuan pendukung, bukan definisi tunggal kompetensi.

### Parameter kerja

| Parameter | Default |
|---|---|
| Mode | `AUDIT_DAN_RENCANA` |
| Sasaran materi | HTML/CSS/JS dasar, tanpa prasyarat framework |
| Bahasa antarmuka/materi | Bahasa Indonesia, istilah teknis diberi penjelasan |
| Jalur inti | 16 pertemuan |
| Arena inti | Shark Typer dan Coding Tower |
| Perangkat | Desktop berkeyboard untuk Typer; sentuh/mouse/keyboard untuk Tower |
| Penyimpanan awal | Local-first; cloud opsional sampai validasinya siap |
| Leaderboard | Fitur baru; kompetisi daring tidak aktif sebelum trust boundary selesai |
| Lingkup eksekusi | Hanya fase yang diminta pengguna |

Mode yang tersedia:

1. `AUDIT_DAN_RENCANA`: baca kode, hasilkan rancangan dan backlog; jangan ubah runtime aplikasi.
2. `MATERI_SAJA`: tulis atau revisi materi Markdown beserta latihan/rubrik; integrasi runtime hanya bila diminta.
3. `IMPLEMENTASI_BERTAHAP`: implementasikan fase terpilih, tambahkan tes, dan laporkan hasil aktual.

Jangan mengklaim telah mengimplementasikan atau menguji sesuatu yang baru ditulis sebagai rancangan.

## 2. Kontrak pembacaan codebase

Sebelum merancang perubahan, baca minimal:

```text
package.json
src/App.tsx
src/data/curriculum.ts
src/data/modules.ts
src/data/quests.ts
src/data/subgames.ts
src/data/towerLevels.ts
src/data/dailyChallenges.ts
src/data/materiHtml.ts
src/ui/TypingGame.tsx
src/ui/TowerPuzzle.tsx
src/ui/Pertemuan.tsx
src/ui/Materi.tsx
src/ui/MateriHtml.tsx
src/ui/Results.tsx
src/ui/Dashboard.tsx
src/ui/AchievementsSection.tsx
src/lib/progress.ts
src/lib/storage.ts
src/lib/history.ts
src/lib/achievements.ts
src/lib/streakMultiplier.ts
src/lib/markdown.ts
src/lib/auth.ts
src/lib/supabaseClient.ts
src/lib/sync.ts
src/lib/gameDb.ts
api/sync-progress.mjs
db/schema.sql
db/supabase-schema.sql
vite.config.ts
content/html/*.md
```

Klasifikasikan setiap kemampuan:

- **ADA:** definisi dan jalur kode ditemukan; belum berarti deployment sudah bekerja.
- **SEBAGIAN:** ada fondasi, tetapi jalur produksi, ketepatan, atau validasi belum lengkap.
- **BARU:** rancangan yang belum ditemukan sebagai implementasi.
- **PERLU_VERIFIKASI:** belum cukup bukti; tuliskan pemeriksaan yang dibutuhkan.

Laporkan perbedaan antara baseline dokumen dan kondisi terbaru. Hormati perubahan pengguna, struktur repositori, serta aturan cabang sesi. Jangan menghapus fitur backend/cross-platform hanya karena fokus tugas adalah web dasar.

## 3. Baseline faktual yang harus dipertahankan atau dimigrasikan secara eksplisit

### 3.1 Stack dan struktur aplikasi

- React 19, TypeScript, Vite 7, Tailwind CSS 4.
- Pustaka tersedia mencakup dnd-kit, Matter.js, Pixi.js, p5, Recharts, dan sql.js.
- Ada konfigurasi PWA dan beberapa entry: hub, CodeShark, Coding Tower, dan cross-platform.
- `npm run lint` menjalankan `tsc --noEmit`; ini pemeriksaan tipe, bukan bukti seluruh kualitas lint atau tes perilaku.
- `npm run build` menjalankan Vite build.
- Jangan menambah seluruh pustaka grafis ke jalur render awal. Gunakan aset dan komponen yang sudah ada bila sesuai.
- Keberadaan dependensi tidak berarti seluruh kemampuannya telah dipakai pada setiap arena.

### 3.2 Matriks fitur baseline

| Komponen | Status baseline | Catatan |
|---|---|---|
| Shark Typer | ADA | Ketik karakter target, combo, ancaman, tiga nyawa, pause, hasil |
| Coding Tower | ADA | Susun blok melalui ketuk/drag, tahap, pengecoh, hint, ancaman |
| Quest/Drill/Juggling | ADA | Jenis sesi, bukan tiga arena terpisah |
| Daily challenge | ADA | Rotasi deterministik berdasarkan tanggal lokal dan bank tantangan |
| XP/koin | ADA | Reward sesi dan selisih rekor; ada reward lain di luar sesi |
| Rank XP | ADA | Tujuh rank personal; bukan posisi di papan peringkat |
| Achievement/badge | ADA | 17 definisi, empat kategori, empat tier, klaim hadiah |
| Streak latihan/login | ADA | Ada tier pengali permanen yang mengikuti rekor/milestone |
| Riwayat dan outbox | ADA | Masing-masing dibatasi 200 record pada helper saat audit |
| Materi HTML Markdown | SEBAGIAN | Enam dokumen P1–P6, sedangkan fase HTML mencakup P1–P7 |
| Materi CSS/JS Markdown khusus | BARU | Materi sudah ada pada slide TypeScript, belum menjadi paket MD setara |
| Login/cloud | SEBAGIAN | Abstraksi dan skema ada; dependensi, runtime import, deployment, dan alur sinkron perlu diverifikasi |
| Leaderboard kelas/global | BARU | Tidak ditemukan implementasi leaderboard pada `src`, `api`, dan `db` saat audit |
| Debug Quest/Concept Challenge | BARU | Perlu kontrak sesi dan asesmen tersendiri |
| Project Lab dengan editor bebas | BARU | Preview kode contoh yang ada bukan editor proyek mandiri lengkap |

### 3.3 Persoalan baseline yang tidak boleh diwariskan diam-diam

1. **P7 tidak mempunyai dokumen:** navigasi fase HTML bisa mengakses `getHtmlDoc(7)` yang tidak tersedia. Tambahkan guard dan materi sebelum memperluas jalur.
2. **UTS menguji CSS sebelum tahap CSS terstruktur:** pilih jembatan CSS sebelum P8 atau ubah lingkup UTS.
3. **Renderer Markdown:** sel tabel diteruskan sebagai HTML mentah; escaping atribut dan pembatasan URL belum memadai; heading subbab dipetakan terlalu dalam.
4. **Narasi P12 tidak cocok dengan quest:** narasi menyebut latihan campuran HTML/CSS, kode quest berupa CSS saja.
5. **Pengukuran lintas arena:** Tower mengisi field `wpm` dengan laju ekuivalen karakter blok tersusun, bukan ketukan fisik.
6. **Badge `missions-done`:** menghitung seluruh entri `modules` dengan `completions > 0`, bukan secara khusus tiga modul HTML/CSS/JS seperti deskripsinya.
7. **Daily reward:** bonus dan pencatatan selesai memakai `r.won`, bukan sekaligus pemeriksaan ambang `passed`; tentukan dan uji kebijakan baru secara eksplisit.
8. **Sinkronisasi bukan validasi kompetisi:** endpoint menerima statistik klien dan tidak memverifikasi bearer token pada handler yang diperiksa.
9. **Mock dan warning dapat tampak sukses:** endpoint dapat mengembalikan HTTP 200 dengan `mock: true` atau warning; klien menganggap HTTP sukses cukup untuk mengosongkan outbox.
10. **Dua skema berbeda:** endpoint sinkron saat ini menulis tabel berbasis `device_id`; skema cloud owner-only memakai `user_id`. Jangan menganggap keduanya sudah saling cocok.

## 4. Visi produk dan prinsip pembelajaran

Bangun pengalaman **akademi koding bawah laut**. Peserta adalah kadet yang memperbaiki stasiun samudra melalui kode. Pertahankan bahasa visual HUD laut, aksen teal/amber/coral, karakter hiu, stasiun, dan aset lokal yang relevan.

Prinsip wajib:

- **Meaning before speed:** peserta tahu fungsi kode sebelum ditantang cepat.
- **Learn → predict → practice → modify → explain → create → reflect.**
- **Kesalahan adalah informasi:** tampilkan kategori salah dan saran berikutnya, bukan hukuman yang mempermalukan.
- **Mastery terpisah dari ekonomi:** XP, koin, rank, badge, dan kemenangan tidak otomatis sama dengan penguasaan materi.
- **Akses materi tetap terbuka:** gate boleh mengatur tantangan, bukan menghalangi membaca dan mencari bantuan.
- **Tidak pay-to-win:** koin tidak membeli jawaban ujian, kelulusan, atau posisi leaderboard.
- **Progressive disclosure:** antarmuka dasar sederhana; metrik lanjutan dapat dibuka bila perlu.
- **Aksesibilitas bukan mode kelas dua:** mode tanpa ancaman dan alternatif perangkat memperoleh pengakuan belajar yang setara.

Jika umur profil saat ini mengatur kesulitan, pertahankan kompatibilitas data, tetapi rancang pilihan dukungan berdasarkan kebutuhan pemain; jangan menganggap usia selalu sama dengan kemampuan motorik atau pengetahuan.

## 5. Capaian pembelajaran dan kurikulum 16 pertemuan

Setelah jalur dasar selesai, peserta mampu:

1. Menjelaskan HTML sebagai struktur, CSS sebagai gaya, dan JavaScript sebagai perilaku.
2. Menulis HTML semantik dengan navigasi, gambar, dan formulir berlabel.
3. Memakai selektor, box model, Flexbox, serta media query untuk layout dasar.
4. Menulis variabel, kondisi, loop, dan fungsi sederhana.
5. Membaca input, memvalidasi nilai, menangani event, dan memperbarui DOM.
6. Mendiagnosis kesalahan dengan DevTools, contoh uji, dan penjelasan sebab.
7. Membuat aplikasi mini yang dapat dipakai dengan keyboard dan pada layar kecil.

### Peta default yang selaras dengan struktur saat ini

| P | Materi | Produk/bukti belajar | Aktivitas game |
|---|---|---|---|
| 1 | Peran HTML, browser/server, alat | Halaman pertama dan penjelasan peran HTML | Typer simbol atau Tower pasangan tag |
| 2 | Doctype, head/body, lang, charset, viewport | Kerangka dokumen | Tower struktur dan drill kerangka |
| 3 | Heading, paragraf, strong/em, list | Konten terstruktur | Tower hierarki dan Concept Challenge usulan |
| 4 | Gambar, alt, path, link/anchor | Dua halaman saling tertaut | Typer atribut dan Debug Quest path usulan |
| 5 | Form, label/name, semantik | Form aksesibel | Tower pasangan label/input |
| 6 | Proyek profil | Profil semantik runnable | Quest integrasi dan modifikasi mandiri |
| 7 | Review sejawat dan persiapan UTS | Checklist, revisi, demo | Review; jembatan CSS jika dipilih untuk UTS |
| 8 | UTS | Halaman sesuai kompetensi yang sudah diajarkan | Asesmen terpisah dari kecepatan game |
| 9 | CSS, pemasangan, selector/cascade | Stylesheet eksternal sederhana | Typer selector, prediksi aturan menang |
| 10 | Class/ID, warna, tipografi, fokus | Kartu dengan kelas reusable | Drill serta tantangan konflik selector |
| 11 | Box model, flow, spacing | Layout tanpa overflow | Tower blok CSS; Debug Quest ukuran usulan |
| 12 | Flexbox, responsif, jembatan DOM | Layout mobile/desktop | Quest layout dan pengenalan interaksi |
| 13 | const/let, tipe, operator, konversi | Perhitungan dari nilai/input | Typer dan prediksi output |
| 14 | if/else, logika, validasi | Konverter nilai dengan kasus batas | Debug kondisi dan trace |
| 15 | Loop, fungsi, scope dasar | Fungsi teruji dan tabel trace loop | Tower urutan logika dan latihan modifikasi |
| 16 | DOM, event, mini app, review UAS | Aplikasi mini dan laporan uji | Project Lab usulan atau tugas mandiri terintegrasi |

Jangan mengajarkan CSS Grid, array method kompleks, API asinkron, dan framework sebagai syarat dasar mendadak. Bank daily saat ini memuat topik pengayaan; tambahkan tag prasyarat dan pilihan review yang sudah dipelajari. Jelaskan jadwal ujian formal bila P16 berfungsi sebagai gladi, bukan menambah pertemuan ke-17 secara tersirat.

## 6. Desain materi Markdown

Setiap pertemuan harus mempunyai satu sumber materi utama yang terdaftar pada metadata bertipe.

Isi wajib:

1. Tujuan terukur dan prasyarat.
2. Model mental singkat beserta batas analogi.
3. Contoh minimal yang dapat dijalankan; nyatakan nama berkas dan penempatan kode.
4. Output/perilaku yang diharapkan.
5. Contoh kesalahan umum dan langkah debugging.
6. Latihan meniru, memodifikasi, dan membuat mandiri.
7. Cek pemahaman dan penjelasan jawaban yang tidak langsung membocorkan soal.
8. Kasus uji serta kriteria keberhasilan.
9. Rangkuman dan referensi.

Gunakan konten yang sudah ada sebelum menulis ulang. Buat registri lintas HTML/CSS/JS, fallback dokumen, dan validasi nomor. Jangan menganggap menambah berkas MD otomatis menambah menu aplikasi.

### Akurasi isi wajib

- HTTP/HTTPS adalah protokol komunikasi; HTML adalah markup dokumen.
- Doctype bukan elemen dan tidak membutuhkan end tag.
- Elemen void berbeda dari tag berpasangan.
- Heading mengikuti struktur, bukan dipilih untuk ukuran visual.
- Gambar dekoratif menggunakan `alt=""`; gambar informatif mempunyai alt sesuai fungsi.
- `id` dan `name` form berbeda peran; placeholder tidak menggantikan label.
- Specificity dan urutan sumber dijelaskan dalam konteks cascade yang benar.
- `margin: auto` membutuhkan ruang tersisa agar efek pemusatan terlihat; tidak membuat blok otomatis “melebar penuh lalu terpusat”.
- Margin collapse tidak berlaku universal pada semua layout.
- Sumbu Flexbox mengikuti `flex-direction`.
- `.value` adalah string; konversi dan validasi angka diajarkan eksplisit.
- `querySelector` bisa menghasilkan `null`.
- `return` berbeda dengan mencetak output; program yang valid sintaks belum tentu benar logika.

Perbaiki parser sebelum menerima konten tidak tepercaya. Hindari HTML mentah tanpa sanitasi, validasi URL, dan uji tabel yang berisi tag HTML serta karakter pipe.

## 7. Arsitektur gameplay: arena, sesi, dan konteks

Pisahkan tiga dimensi:

```text
Arena: cara berinteraksi (Typer / Tower / arena baru)
Sesi: pola latihan (Quest / Drill / Juggling / jenis baru)
Konteks: pertemuan / daily / remedial / asesmen
```

Jangan memakai ID sesi sebagai pengganti seluruh metadata arena dan versi konten. ID lama seperti `q:5:quest` harus tetap dapat dibaca. Tambahkan versi/skema dan metadata melalui migrasi teruji, bukan menghapus save lama.

### 7.1 Shark Typer — ADA

**Tujuan:** pembiasaan simbol, urutan sintaks, dan kelancaran kode.

**Loop:** briefing → countdown → ketik target → umpan balik karakter/baris → ancaman atau relief → selesai/gagal → hasil → rekomendasi latihan.

Aturan baseline yang perlu dibaca ulang sebelum diubah:

- Tiga nyawa; ancaman meningkat selama bermain.
- Ketikan benar menaikkan combo dan skor.
- Salah menaikkan ancaman serta mereset combo.
- Selesai baris memberi bonus skor dan menurunkan ancaman.
- Ancaman penuh mengurangi nyawa dan mereset ancaman.
- Ada pause; durasi pause dikeluarkan dari waktu aktif.
- Shortcut browser dengan modifier tidak dihitung sebagai ketikan biasa; AltGr harus tetap didukung.
- Hasil mencakup skor, akurasi, WPM, combo, karakter salah, dan jumlah baris.

Pengembangan wajib bila arena disentuh:

- Bedakan latihan bebas tanpa ancaman dengan tantangan kompetitif.
- Tampilkan makna snippet sebelum/selepas latihan.
- Jangan memberi bonus kompetitif dari membuka kembali tab, countdown, atau durasi pause.
- Tangani input komposisi/IME, karakter Unicode, dan layout keyboard secara sadar; uji sebelum mengklaim didukung.
- Beri alasan “mengapa salah” pada latihan konsep, bukan hanya warna merah.

### 7.2 Coding Tower — ADA

**Tujuan:** mengenali susunan, struktur, dan urutan kode melalui blok.

**Loop:** briefing mekanik → countdown → pilih blok berikutnya → bangun tahap → pilih tahap berikutnya → preview/penjelasan → hasil.

Baseline:

- Baris non-kosong dipecah menjadi blok dan diacak.
- Pemain mengetuk atau menyeret blok; sistem membandingkan dengan target urutan.
- Ada bank pengecoh, hint, ancaman, tiga nyawa, dan combo.
- Level P1–P8 memiliki konfigurasi khusus; CSS/JS memakai level generik.
- Hint dibatasi per level dan dapat menaikkan ancaman.
- Ada komponen render/visual pendukung; jangan memindahkan logika kelulusan ke physics engine.

Batas konseptual yang harus ditampilkan:

- Urutan yang diminta adalah urutan target latihan, **bukan satu-satunya bentuk program valid**.
- Pengecoh harus salah untuk konteks tugas, bukan dilabeli salah secara universal. Contoh `<button>Kirim</button>` atau gambar tanpa width tidak otomatis salah dalam semua konteks.
- Susunan blok tidak membuktikan peserta mampu menulis fungsi dari nol.
- Laju ekuivalen karakter hasil susunan bukan WPM mengetik.

Pengembangan:

- Akses keyboard selain drag dan tap; target sentuh besar dan fokus terlihat.
- Jelaskan kesalahan pasangan tag, selector, atau urutan logika.
- Buat level CSS/JS berdasarkan miskonsepsi, bukan hanya menambah blok acak.
- Untuk tantangan semantik, tentukan apakah beberapa jawaban valid diterima; bila tidak, jelaskan bahwa ini latihan urutan contoh.

### 7.3 Quest, Drill, dan Juggling — ADA

| Jenis sesi | Fungsi | Baseline kelulusan | Catatan |
|---|---|---|---|
| Quest | Menyelesaikan kode target pertemuan | Menang dan akurasi ≥90% | Kode dari kurikulum |
| Drill | Potongan sintaks inti | Menang dan akurasi ≥90% | Ancaman lebih ringan pada Typer |
| Juggling | Menganyam drill sebahasa sebelumnya | Menang dan akurasi ≥85% | Stimulus latihan, bukan program runnable |

Typer memakai `threatMul` baseline quest 1, drill 0,6, juggling 1,3. Tower memiliki perhitungan ancaman sendiri: konfigurasi usia × level, dengan modifier drill 0,8 dan juggling 1,25. Jangan menganggap konstanta kedua arena sama.

Juggling pertama per bahasa memakai drill sendiri dalam urutan terbalik sebagai pasangan. Untuk setiap mode, labeli dengan jelas bahwa potongan teranyam tidak harus dapat dieksekusi sebagai satu program.

### 7.4 Tipe game baru — BARU, bangun setelah fondasi stabil

| Game usulan | Interaksi | Bukti belajar | Evaluasi |
|---|---|---|---|
| Concept Challenge | Pilih/prediksi lalu jelaskan | Perbedaan tag, cascade, output | Jawaban + alasan, bukan klik cepat saja |
| Debug Quest | Perbaiki kode rusak | Diagnosis dan perbaikan | Kasus uji dan penjelasan akar masalah |
| Project Lab | Edit HTML/CSS/JS bebas | Transfer pengetahuan | Rubrik produk, perilaku, dan pengujian |
| Review Expedition | Menilai contoh dengan checklist | Semantik, aksesibilitas, kerapian | Kriteria review dan revisi |

Jangan langsung menambahkan semua mode ke `SessionKind` lama tanpa mengaudit `getSession`, routing, tipe hasil, progres, riwayat, dan penyimpanan. Gunakan discriminated union atau kontrak asesmen baru; migrasikan secara bertahap.

## 8. State machine dan kondisi menang/gagal

Definisikan state eksplisit:

```text
loading → briefing → countdown → playing ↔ paused
playing → won / failed
won / failed → results → retry / remedial / next / hub
loading → recoverable_error → retry / hub
```

Ini kontrak usulan lintas arena; nama state internal lama boleh berbeda dengan adapter. Jangan merusak transisi yang sudah ada demi menyeragamkan nama saja.

Invarian:

- Input tidak memberi skor saat briefing, countdown, pause, atau setelah hasil final.
- Pause menghentikan timer aktif dan ancaman.
- Satu run menghasilkan maksimal satu pencatatan hasil dan satu transaksi reward.
- Retry membuat run baru dan mereset state sementara, bukan seluruh progres.
- Komponen unmount membersihkan interval, timeout, listener, dan engine grafis.
- Kehilangan fokus mempunyai kebijakan jelas; kompetisi dapat auto-pause atau menandai run sesuai aturan yang diumumkan.
- Gagal tetap menawarkan umpan balik dan akses materi, bukan jalan buntu.
- Fitur baru tidak boleh memperkenalkan countdown yang macet saat transisi GO.

## 9. Pengukuran dan skor

### 9.1 Pisahkan empat lapisan

1. **Skor run:** performa pada satu tantangan dan satu aturan skor.
2. **Reward ekonomi:** XP/koin yang benar-benar dikreditkan.
3. **Progres belajar:** pertemuan terbuka, bukti konsep, asesmen produk.
4. **Peringkat kompetisi:** posisi dalam cohort/arena/sesi/versi yang sebanding.

Jangan menggunakan satu angka untuk seluruh lapisan tersebut.

### 9.2 Formula baseline yang perlu dijaga atau dimigrasikan

**Typer:**

```text
accuracy = round(correct / (correct + errors) × 100)
activeSeconds = max(5, elapsedWithoutPause)
wpm = round((correct / 5) / (activeSeconds / 60))
comboMultiplier = 1 + min(combo, 100) × 0.02
correctKeyScore = round(10 × comboMultiplier) + speedBonus
speedBonus = 3 jika liveWpm ≥40, selain itu 0
completedLineBonus = 40
stars = 3 jika menang dan accuracy ≥95
        2 jika menang dan accuracy ≥85
        1 jika menang dan di bawah 85
        0 jika kalah
```

**Tower:**

```text
accuracy = round(correctBlocks / (correctBlocks + wrongChoices) × 100)
correctBlockScore = round(22 × (1 + min(combo, 60) × 0.03))
```

Kode saat ini juga menghitung `wpm` Tower dari panjang teks blok tersusun. Pertahankan pembacaan legacy bila diperlukan, tetapi beri label `assemblyRate` pada metrik baru. Jangan memasukkan nilai tersebut ke badge kecepatan mengetik atau leaderboard Typer tanpa pemisahan.

**Catatan bintang:** dua bintang pada akurasi 88% tidak otomatis lulus Quest yang mensyaratkan 90%. UI wajib membedakan `won`, `stars`, dan `passed`.

### 9.3 Nilai akademik usulan

Gunakan rubrik terpisah, misalnya HTML/aksesibilitas 25%, CSS/responsif 20%, logika JS 25%, pengujian/debugging 20%, penjelasan 10%. Ini usulan, bukan bobot yang sudah dipakai codebase. Skor otomatis boleh membantu, tetapi jangan menilai keindahan visual atau kualitas penjelasan hanya dari jumlah karakter.

## 10. Progres, unlock, remedial, dan adaptasi

Baseline:

```text
Perunggu = Quest lulus
Perak = Quest + Drill lulus
Emas = Quest + Drill + Juggling lulus
P1 selalu terbuka
Pn terbuka jika P(n−1) minimal Perak
```

Ketentuan pengembangan:

- Pertahankan ID dan arti level lama kecuali ada migrasi yang jelas.
- Tambahkan evidence kompetensi terpisah; jangan menyamakan Perak dengan kemampuan proyek mandiri.
- Pertemuan terkunci tetap boleh dibaca materinya.
- Rekomendasi remedial berasal dari pola kesalahan: label/id, kurung, selector, batas kondisi, dan sebagainya.
- Kesulitan dapat mengatur panjang snippet, jumlah pengecoh, hint, dan ancaman; jangan menurunkan tujuan konsep secara diam-diam.
- Mode latihan santai dapat memberi progres belajar, tetapi tidak disamakan dengan kondisi run kompetitif yang berbeda aturan.
- Jelaskan keputusan eligibility per run, bukan menghukum identitas atau perangkat pemain.

## 11. Ekonomi XP, koin, streak, dan daily challenge

### 11.1 Reward sesi baseline

```text
Jika menang:
  xpSession = 50 + stars ×25 + round(accuracy /5)
  coinsSession = 10 + stars ×10 + round(accuracy /10)
Jika kalah:
  xpSession = round(score /25)
  coinsSession = 0

xpDelta = max(0, xpSession − previousXpBest)
coinsDelta = max(0, coinsSession − previousCoinsBest)
```

`applyAttempt` mempertahankan status pernah lulus dan memperbarui rekor. Reward delta ini mengurangi farming replay sesi yang sama, tetapi **bukan** sistem anti-cheat menyeluruh. Formula reward kalah juga harus diuji agar tidak memberi insentif mengeksploitasi input/skor; jangan mengubah diam-diam saat memperbaiki bagian lain.

Contoh baseline tanpa bonus: menang, tiga bintang, akurasi 100% menghasilkan basis 145 XP dan 50 koin. Replay identik menghasilkan delta nol. Bila tier streak 1,25× aktif, delta pertama menjadi 181 XP dan 63 koin setelah pembulatan bonus. Reward lain dihitung menurut jalur masing-masing.

### 11.2 Rank personal baseline

| XP minimum | Rank |
|---:|---|
| 0 | Kadet Baru |
| 120 | Ikan Kecil |
| 280 | Kuda Laut |
| 500 | Lumba-Lumba |
| 800 | Hiu Muda |
| 1.200 | Megalodon |
| 1.700 | Legenda Samudra |

Rank adalah level akumulasi XP, bukan posisi kompetisi atau sertifikat penguasaan HTML/CSS/JS.

### 11.3 Streak dan pengali baseline

| Rekor streak | Pengali permanen |
|---:|---:|
| Awal | 1× |
| 3 hari | 1,1× |
| 7 hari | 1,25× |
| 14 hari | 1,4× |
| 21 hari | 1,65× |
| 30 hari | 2× |

Kode mengevaluasi rekor latihan/login dan milestone. Setelah tier terbuka, pengali tidak turun hanya karena streak aktif putus. Login tidak boleh disamakan dengan belajar; tampilkan dua aktivitas tersebut secara berbeda.

Pengali diterapkan pada delta reward sesi dan bonus daily melalui jalur `finishPractice`; penyelesaian materi menggunakan jalur sendiri; klaim badge menambahkan reward definisi secara langsung. Jangan mengklaim semua reward selalu mendapat pengali yang sama.

Usulan keseimbangan:

- Gunakan skor mentah/tervalidasi untuk kompetisi, bukan XP yang dipengaruhi pengali permanen.
- Hindari tekanan kehilangan hadiah berlebihan; streak aktif boleh reset, pengakuan rekor tetap ada.
- Penggunaan koin awal bersifat kosmetik/opsional; toko baru hanya dibuat bila diminta.
- Uji plafon, duplikasi klaim, reward kalah, dan perubahan versi formula.

### 11.4 Daily challenge

Baseline memakai ID `daily:YYYY-MM-DD` dan rotasi bank berdasarkan indeks hari dalam tahun. Ini bukan generator acak/adaptif. Tanggal mengikuti perangkat lokal.

Perbaikan usulan:

- Bedakan `attempted`, `won`, `passed`, dan `rewardClaimed`.
- Bonus satu kali diberikan sesuai kebijakan eksplisit; default baru: harus `passed`, bukan sekadar selesai.
- Prasyarat mencegah pemula dipaksa mengerjakan array reduce sebelum mempelajarinya.
- Latihan lokal mengikuti tanggal lokal; event kompetitif menggunakan timezone server yang diumumkan, default kelas `Asia/Jakarta` bila disepakati.
- Offline daily tidak boleh otomatis dianggap valid kompetisi berdasarkan jam klien.
- Riwayat dan nilai “hari ini” harus benar saat pergantian hari, bukan mewarisi maksimum hari sebelumnya.

## 12. Badge dan achievement

### 12.1 Baseline badge

Ada 17 definisi pada empat kategori dengan tier bronze, silver, gold, diamond.

| Kategori | Target baseline |
|---|---|
| Lines | 50, 250, 500, 1.000, 2.500 baris |
| Daily | 1, 3, 5, 10 tantangan selesai |
| Speed | 30, 50, 70 WPM; combo 50 |
| Adventure | Streak 3/7 hari; tiga modul; rank 1.200 XP |

Status membedakan locked, unlocked, dan claimed melalui `claimedAchievements`. Klaim lokal saat ini mempunyai guard agar ID yang sudah diklaim tidak diberi lagi, tetapi validitas eligibility dan transaksi server belum menjadi jaminan.

Audit dan perbaiki:

- `missions-done` harus sesuai deskripsi: hitung modul yang memang dimaksud, bukan sembarang tiga sesi.
- `stats.linesTyped`, `bestWpm`, dan `bestCombo` saat ini dapat dipengaruhi hasil dari jalur arena bersama. Tentukan metrik mana typing, assembling, atau aktivitas belajar sebelum memakai label badge.
- Reward dikalkulasi dari definisi trusted, bukan menerima nominal bebas dari klien sebagai kebenaran server.
- Jika semantik badge berubah, tentukan grandfathering: simpan pencapaian legacy dengan label versi atau migrasikan tanpa menghapus hadiah yang sah.

### 12.2 Badge kompetensi baru — BARU

| ID usulan | Nama | Bukti, bukan hanya aktivitas |
|---|---|---|
| `html-semantic-builder-v1` | Arsitek Semantik | Landmark, heading, dan struktur memenuhi kasus uji/rubrik |
| `html-form-accessible-v1` | Penjaga Formulir | Label, keyboard, instruksi, dan validasi jelas |
| `css-box-model-v1` | Penata Kotak | Prediksi ukuran benar dan memperbaiki overflow |
| `css-responsive-v1` | Navigator Responsif | Layout lolos ukuran uji dan pembesaran teks |
| `js-logic-v1` | Penyelam Logika | Kasus batas kondisi dan fungsi sesuai spesifikasi |
| `js-debugger-v1` | Pemburu Bug | Memperbaiki bug baru serta menjelaskan sebab |
| `web-mini-app-v1` | Perakit Aplikasi | Produk HTML/CSS/JS sesuai rubrik dan demo |

Tetapkan sumber bukti, evaluator (otomatis/guru), versi rubrik, status verifikasi, waktu perolehan, serta kebijakan klaim. Pemeriksaan otomatis sederhana tidak boleh mengklaim seluruh WCAG atau kualitas aplikasi sudah terpenuhi.

Default reward badge baru adalah pengakuan kosmetik dahulu; jumlah XP/koin ditentukan setelah simulasi ekonomi, bukan angka arbitrer untuk mengejar engagement.

## 13. Leaderboard — fitur baru, bukan kemampuan baseline

### 13.1 Tujuan dan ruang lingkup

Bangun perbandingan yang membantu motivasi tanpa mempermalukan pemula. Prioritaskan personal best dan kelas privat opt-in sebelum papan global. Rank XP dan koleksi badge harus tetap tersedia tanpa partisipasi leaderboard.

| Jenis | Sumber | Status yang boleh diklaim |
|---|---|---|
| Personal best | Riwayat lokal pemain | Lokal/tidak terverifikasi |
| Demo leaderboard | Fixture data yang diberi label | Demo, bukan pemain sungguhan |
| Leaderboard kelas | Attempt tervalidasi dan keanggotaan kelas | Terverifikasi sesuai tingkat validasi |
| Leaderboard global | Layanan validasi dan kebijakan privasi matang | Ditunda kecuali diminta eksplisit |

Jangan menampilkan nama pemain atau statistik fiktif sebagai data live.

### 13.2 Segmentasi wajib

Kunci kompetisi minimal:

```text
cohortId + arena + sessionId + contentVersion + rulesVersion
+ difficultyRules + seasonId
```

- Pisahkan Tower dan Typer.
- Pisahkan sesi/konten dengan panjang dan mekanik berbeda.
- Pisahkan latihan santai dengan mode kompetitif.
- Jika hint atau tekanan waktu berbeda, gunakan aturan/kelas kompetisi yang berbeda atau deklarasikan kebijakannya.
- Jangan memfilter publik berdasarkan tanggal lahir/usia rinci; gunakan kelas atau aturan kesulitan yang tidak mengekspos identitas sensitif.

### 13.3 Aturan ranking deterministik usulan

Untuk satu kunci kompetisi yang sebanding:

1. Ambil attempt yang eligible, selesai, passed, dan diterima validator.
2. Pilih satu attempt terbaik per peserta.
3. Urutkan `normalizedScore` menurun.
4. Jika sama, urutkan akurasi menurun.
5. Jika masih sama, urutkan waktu aktif meningkat.
6. Gunakan timestamp penerimaan server dan ID attempt sebagai tie-break stabil.

Definisikan `normalizedScore` secara versioned: untuk tahap awal gunakan skor mentah tervalidasi **di dalam sesi dan aturan yang identik**, tanpa klaim dapat dibandingkan lintas sesi. Jangan menggunakan multiplier streak, XP badge, koin, atau umur akun sebagai bonus kompetitif.

Untuk papan “penguasaan kelas”, gunakan evidence/rubrik dan jumlah unit tuntas dengan kebijakan tersendiri, bukan menjumlahkan skor Typer dan Tower yang tidak sebanding.

### 13.4 Eligibility dan pencegahan manipulasi

Backend harus:

- Memverifikasi identitas dan keanggotaan cohort di server; jangan percaya `userId` dari body.
- Menerbitkan run ID/nonce kompetisi, session/rules/content version, dan waktu kedaluwarsa.
- Memvalidasi transisi run, durasi, batas skor, dan event minimal yang diperlukan.
- Menghitung ulang reward serta metrik yang bisa diverifikasi; tandai keterbatasan telemetry browser.
- Menolak duplikasi/replay nonce; idempotensi memakai attempt ID unik dan unique constraint.
- Membatasi laju request dan ukuran payload.
- Mencatat audit status `pending`, `accepted`, `rejected`, `flagged` beserta alasan yang aman.
- Memisahkan run offline/tidak tepercaya dari kompetisi terverifikasi.

Tidak ada anti-cheat browser yang sempurna. Jangan menyebut skor “pasti bebas curang” hanya karena token valid atau nilai berada dalam rentang masuk akal. Untuk asesmen penting, tambahkan pengawasan/demo proyek atau verifikasi guru sesuai konteks.

### 13.5 Privasi dan pengalaman UI

- Default opt-out untuk publik; gunakan alias, bukan email atau nama lengkap wajib.
- Kelas privat hanya dapat dibaca anggota/guru yang berwenang.
- Tampilkan posisi sendiri, personal best, dan perubahan positif; hindari label “terburuk”.
- Sediakan opt-out, koreksi alias, dan penghapusan data sesuai kebijakan.
- Jangan mengekspos tanggal lahir, email, device ID, token, atau jejak ketikan mentah di papan.
- Tetapkan retensi telemetry yang pendek dan proporsional; jangan merekam aktivitas keyboard di luar arena.
- Tampilkan empty, loading, error, offline, pending verification, dan stale state dengan jelas.
- Umumkan jadwal reset season dan timezone. Reset kompetisi tidak menghapus portofolio belajar.

## 14. Kontrak data, storage, dan sinkronisasi

Gunakan model berikut sebagai **usulan**, bukan nama tabel/API yang sudah tersedia:

```ts
type ArenaId = "shark" | "tower";
type VerificationStatus = "local" | "pending" | "accepted" | "rejected" | "flagged";

interface LearningAttemptV2 {
  id: string;
  legacySessionId: string;
  arena: ArenaId;
  contentVersion: string;
  rulesVersion: string;
  difficultyRules: string;
  startedAt: number;
  activeTimeMs: number;
  won: boolean;
  passed: boolean;
  accuracy: number;
  rawScore: number;
  hintsUsed: number;
  typingWpm?: number;
  assemblyRate?: number;
  verification: VerificationStatus;
}
```

Identitas server, cohort, waktu penerimaan, dan verdict harus ditetapkan server; jangan menganggap field payload klien sebagai otoritas. Simpan data minimum untuk kebutuhan produk dan verifikasi.

### Entitas server usulan

- `profiles`: identitas minimal dan alias publik terpisah dari identitas privat.
- `cohorts`, `memberships`: akses kelas dan peran guru/peserta.
- `challenge_versions`: konten, aturan, dan hash/versi target.
- `competition_runs`: nonce, aturan, waktu mulai/akhir.
- `verified_attempts`: metrik dan verdict server.
- `reward_ledger`: transaksi XP/koin dengan sumber unik.
- `achievement_awards`: evidence, versi badge, klaim idempoten.
- `leaderboard_entries` atau agregasi aman: hanya data minimal yang layak dibaca.

### Aturan migrasi dan sinkronisasi

1. Tambahkan versi skema dan adapter save lama; jangan menghapus penyimpanan lokal.
2. Bedakan data run, reward ledger, dan saldo agregat; jangan merge saldo koin dengan `greatest` bila koin dapat dibelanjakan.
3. Setiap transaksi reward memakai source ID unik dan atomic commit.
4. Outbox hanya menghapus attempt yang diakui durable oleh server, bukan semua request HTTP 200.
5. Respons `mock`, warning, kegagalan parsial, dan autentikasi gagal tidak boleh ditampilkan sebagai sinkronisasi cloud berhasil.
6. Pisahkan snapshot save mutakhir dari state sebelum update; audit urutan `finishPractice` yang saat ini memanggil push sebelum `setSave` selesai.
7. Outbox harus menangani attempt baru yang masuk ketika request lama masih berjalan; jangan menggantinya dengan array kosong tanpa acknowledgement per ID.
8. Ukuran history lokal 200 record bukan sumber kebenaran sepanjang masa untuk kompetisi/portofolio. Tetapkan pagination/retensi cloud dan ekspor yang sesuai.
9. Jangan menganggap pemilihan provider `sqlite` pada adapter berarti seluruh data sudah tersimpan di database SQLite nyata; verifikasi implementasinya.
10. RLS owner-only bukan API leaderboard lintas pengguna. Buat view/prosedur server yang hanya memaparkan alias dan metrik yang diizinkan; jangan membuka seluruh tabel saves/attempts.

Pilih satu jalur backend resmi untuk fitur kompetitif setelah memeriksa infrastruktur yang benar-benar tersedia. Jangan mencampur skema Neon berbasis device dan skema owner-only berbasis user tanpa migrasi. Secret database/service-role tidak boleh masuk bundle klien atau variabel `VITE_*`.

## 15. UX, visual, aksesibilitas, dan performa

### Layar inti

1. Onboarding dan preferensi dukungan/perangkat.
2. Hub pemilihan arena.
3. Peta 16 pertemuan dan progres.
4. Pembaca materi dan ilustrasi konsep.
5. Briefing tujuan, aturan, dan eligibility.
6. Arena game.
7. Hasil: performa, kelulusan, reward delta, kesalahan, langkah berikutnya.
8. Koleksi badge dengan locked/unlocked/claimed.
9. Riwayat dan personal best.
10. Leaderboard kelas, hanya jika backend dan izin siap.
11. Project Lab/rubrik jika fase pengembangan tersebut diaktifkan.

### Ketentuan UI

- Gunakan aset lokal dan token tema yang sudah ada sebelum membuat aset baru.
- Pisahkan preview belajar dari HUD permainan agar konten tetap terbaca.
- Jangan mengandalkan warna saja untuk benar/salah; gunakan teks/ikon.
- Gunakan heading semantik, label kontrol, fokus terlihat, dan urutan Tab logis.
- Sediakan alternatif keyboard untuk drag-and-drop.
- Hormati `prefers-reduced-motion`, mute, dan pengaturan efek; animasi tidak menutupi kode.
- Jangan membacakan perubahan skor setiap karakter melalui live region; umumkan ringkasan penting secukupnya.
- Uji layar kecil, teks diperbesar, serta kontrol sentuh.
- Lazy-load arena/engine berat; bersihkan engine saat keluar; jangan memasang beberapa loop render yang tidak diperlukan.
- Nyatakan status PWA/offline berdasarkan uji nyata, bukan hanya keberadaan plugin.

Untuk live preview pengembangan: server bind ke `0.0.0.0`, menerima host preview, dan API browser menggunakan URL relatif. Jangan mengirim request browser ke localhost sandbox.

## 16. Keamanan eksekusi kode dan batas kepercayaan

- Pertahankan preview terisolasi dalam iframe sandbox; jangan menambah `allow-same-origin` bersama `allow-scripts` tanpa analisis risiko yang kuat.
- Kode peserta jangan dieksekusi dengan `eval`/`new Function` dalam konteks aplikasi utama.
- Validasi pesan `postMessage` berdasarkan `event.source` frame yang diharapkan, bentuk payload, dan nonce/channel. Sandbox dapat menghasilkan origin opaque; jangan mengandalkan pemeriksaan origin saja.
- Batasi loop tak berujung dan output berlebihan pada Project Lab baru; jelaskan batasan runner HTML/JS di iframe dan kebutuhan isolasi lebih kuat bila diperlukan.
- Gunakan `textContent` untuk teks yang berasal dari input peserta; sanitasi bila HTML diperlukan.
- Validasi URL/atribut renderer materi serta larang skema berbahaya.
- Endpoint kompetitif memverifikasi token server-side; hanya menerima hak minimum.
- Jangan merekam password, token, email, atau input sensitif sebagai log telemetry.
- Tes negative-path harus mencakup akses lintas akun/cohort, manipulasi reward, dan payload rusak.

## 17. Roadmap implementasi bertahap

### Fase A — Stabilisasi fondasi

- Perbaiki mismatch materi P7, fallback, dan total hard-coded.
- Perbaiki keamanan/ketepatan renderer Markdown serta heading.
- Selaraskan materi, quest, prasyarat UTS, dan narasi P12.
- Pisahkan pengertian WPM Typer dan assembling Tower pada model baru.
- Tambahkan tes regresi progres, reward delta, dan penyelesaian run.

**Gate:** tidak ada jalur materi yang crash; save lama terbaca; tes inti lulus.

### Fase B — Paket materi dan bukti belajar

- Lengkapi MD P1–P16, termasuk review dan ujian.
- Tambahkan latihan prediksi, modifikasi, debug, serta kasus uji.
- Implementasikan metadata prasyarat daily dan state passed/reward yang jelas.
- Tambahkan bukti kompetensi tanpa mengganti seluruh ekonomi.

**Gate:** contoh runnable, tujuan dan asesmen cocok, seluruh link materi valid.

### Fase C — Gamifikasi yang adil

- Perbaiki definisi badge dan metrik per arena.
- Tambahkan transaksi klaim idempoten sesuai scope lokal/server.
- Tambahkan badge kompetensi dan pengakuan personal best.
- Simulasikan ekonomi streak/daily/replay; dokumentasikan migrasi.

**Gate:** tidak ada reward ganda; badge sesuai bukti; mode aksesibel tidak kehilangan pengakuan belajar.

### Fase D — Leaderboard privat tervalidasi

- Tetapkan backend resmi, autentikasi, membership, dan kebijakan privasi.
- Buat run/validator, acknowledgement per attempt, ledger, dan agregasi.
- Implementasikan ranking tersegmentasi, season, tie-break, pagination, dan UI state lengkap.
- Label demo/offline/pending secara jujur.

**Gate:** tes akses, idempotensi, validasi, privasi, dan kegagalan sinkron lulus sebelum kompetisi diaktifkan.

### Fase E — Game pembelajaran baru

- Bangun Concept Challenge, Debug Quest, atau Project Lab satu per satu sesuai permintaan.
- Gunakan kontrak asesmen dan runner aman; jangan memaksakan semua hasil menjadi `GameResult` typing.
- Uji bersama peserta/guru, termasuk pengguna perangkat sentuh dan kebutuhan aksesibilitas.

**Gate:** ada bukti kegunaan belajar, bukan hanya tambahan animasi dan skor.

## 18. Acceptance criteria dan strategi tes

### Materi

- Seluruh pertemuan yang menawarkan materi mempunyai dokumen valid atau fallback yang jelas.
- Kompetensi yang diuji sudah diperkenalkan dan dilatih.
- Snippet runnable dibedakan dari drill/juggling yang tidak utuh.
- Tabel bertag HTML tampil sebagai kode, bukan markup aktif.
- Contoh JS mempunyai output dan kasus batas.

### Gameplay

- Countdown dapat berakhir; input di luar `playing` tidak menghasilkan skor.
- Pause menghentikan ancaman dan mengurangi waktu aktif secara konsisten.
- Run hanya selesai sekali walau callback/timer ganda terpicu.
- Shortcut, backspace, karakter simbol, dan AltGr diuji.
- Tower dapat dipakai tanpa drag, serta mempunyai jalur keyboard.
- Salah blok dan hint tidak memicu race pada stage terakhir.

### Progres dan ekonomi

- Quest 89% tidak lulus; Quest 90% lulus jika menang.
- Juggling 84% tidak lulus; 85% lulus jika menang.
- Dua bintang tidak otomatis membuka pertemuan berikutnya.
- Replay identik memberi delta reward nol.
- Contoh tiga bintang/100% menghasilkan basis 145 XP dan 50 koin; tier 1,25× memberi 181 XP dan 63 koin untuk delta pertama.
- Reward dan passed mempunyai pengujian terpisah pada run kalah serta daily.
- Klaim badge berulang idempoten; nominal reward tidak dipercaya dari klien.
- Mengubah jam lokal atau replay request tidak memberi bonus kompetisi tambahan.
- Membeli kosmetik tidak merusak sinkronisasi saldo jika fitur belanja ditambahkan.

### Leaderboard

- Tidak ada perbandingan Typer vs Tower dalam ranking yang sama.
- Perbedaan versi konten/aturan/kesulitan tidak tergabung diam-diam.
- Hanya attempt eligible diterima; tie-break stabil dan satu best attempt per peserta.
- Klaim `userId` palsu, cohort palsu, nonce berulang, dan token invalid ditolak.
- HTTP 200 dengan `mock`/warning tidak membuang outbox sebagai sudah durable.
- Request concurrent tidak menghapus attempt baru yang belum diakui.
- Alias dan data minimum saja yang terlihat; tabel privat tetap terlindungi.
- Empty/loading/offline/pending/error state bisa direproduksi.

### Kompatibilitas dan pengujian aktual

- `npm run lint` dan `npm run build` dijalankan pada fase implementasi setelah dependensi tersedia.
- Tambahkan unit test untuk fungsi murni; gunakan test runner ringan yang sesuai repositori bila belum ada.
- Gunakan browser test untuk alur hub → materi → arena → hasil → progres; uji leaderboard hanya jika backend terkait tersedia.
- Jangan mengklaim seluruh fitur cloud/PWA sudah diuji dari build saja.
- Laporkan command, hasil, serta tes yang tidak dijalankan dan alasannya.

## 19. Format keluaran yang wajib dihasilkan agen

Untuk mode audit/rencana:

1. Ringkasan tujuan dan asumsi.
2. Peta fitur `ADA/SEBAGIAN/BARU/PERLU_VERIFIKASI` beserta path bukti.
3. Kurikulum dan pemetaan tujuan → aktivitas → bukti asesmen.
4. Aturan gameplay dan state machine.
5. Model progres, reward, streak, badge, serta simulasi minimal.
6. Desain leaderboard lengkap dengan trust boundary dan privasi.
7. Rencana file/perubahan, migrasi, fase, serta acceptance criteria.
8. Risiko, keputusan yang masih terbuka, dan rekomendasi langkah pertama.

Untuk mode implementasi:

1. Nyatakan fase yang dikerjakan dan batas scope.
2. Perubahan aktual beserta alasan dan jalur berkas.
3. Tes yang ditambahkan dan hasil perintah nyata.
4. Migrasi/kompatibilitas save dan fallback offline.
5. Fitur yang masih demo, mock, belum terverifikasi, atau belum dibuat.
6. Cara mencoba alur yang baru.
7. Langkah berikutnya tanpa mengklaim fase lain sudah selesai.

Simpan dokumentasi dalam Markdown pada `docs/` dengan nama deskriptif. Jangan commit atau push kecuali diminta dan ikuti aturan repositori/sesi yang berlaku.

## 20. Larangan, keputusan terbuka, dan definisi selesai

### Jangan lakukan

- Menulis ulang aplikasi dari nol tanpa kebutuhan.
- Menghapus jalur backend/cross-platform yang tidak terkait.
- Menyamakan rank XP dengan leaderboard.
- Menganggap sinkronisasi, autentikasi, dan RLS berarti validasi skor sudah selesai.
- Mengklaim SQLite aktif hanya dari flag provider atau PWA offline penuh hanya dari plugin.
- Menampilkan fake leaderboard sebagai pengguna asli.
- Menerima XP/koin/claim eligibility dari klien sebagai otoritas server.
- Menggunakan WPM Tower untuk mengklaim kemampuan mengetik.
- Mengunci materi atau kelulusan akademik di balik transaksi koin.
- Mengganti semua konstanta ekonomi sekaligus tanpa simulasi dan migrasi.
- Menyebut efektivitas pedagogis terbukti tanpa data pengguna.
- Mengerjakan semua fase ketika permintaan hanya materi atau rancangan.

### Keputusan yang harus dinyatakan sebelum fase terkait

- Apakah UTS tetap menguji CSS dengan jembatan sebelum P8, atau fokus HTML?
- Apakah P16 gladi atau ujian formal, dan bagaimana jadwal pengumpulannya?
- Backend resmi mana yang tersedia dan siapa pengelola kelas?
- Apakah kompetisi privat opt-in sudah cukup, atau ada kebutuhan global yang nyata?
- Bagaimana timezone season, retensi, dan kebijakan peserta di bawah umur?
- Badge lama dipertahankan berlabel legacy atau dimigrasikan dengan aturan apa?

Gunakan default aman dan dokumentasikan asumsi yang tidak mengubah data sensitif. Minta klarifikasi hanya untuk keputusan yang benar-benar menghalangi fase berjalan; jangan menunda perbaikan lokal yang jelas demi keputusan cloud yang belum relevan.

### Definisi selesai

Hasil dianggap selesai untuk fase yang dipilih bila peserta dapat mengikuti alur yang konsisten, fitur aktual sesuai klaim, save lama aman, tes relevan dilaporkan, dan dokumentasi membedakan belajar, permainan, ekonomi, serta kompetisi. Produk tidak dianggap selesai hanya karena HUD terlihat menarik atau badge bertambah.

---

## 21. Peta bukti codebase untuk reviewer

Bagian ini bukan klaim bahwa fitur telah diuji di deployment. Gunakan simbol/fungsi berikut untuk memeriksa fakta baseline.

| Area | Sumber | Simbol/bukti |
|---|---|---|
| Stack dan scripts | [package.json](../package.json) | dependencies, `lint`, `build` |
| Arena | [subgames.ts](../src/data/subgames.ts) | `SUBGAMES`, `SubGameId`, `mode` |
| Kurikulum | [curriculum.ts](../src/data/curriculum.ts) | `CURRICULUM`, `htmlLessons`, `uasMerged` |
| Sesi | [quests.ts](../src/data/quests.ts) | `PASS_ACC`, `LESSON_LANG`, `interleave`, `getSession` |
| Konfigurasi dukungan | [modules.ts](../src/data/modules.ts) | `AGE_GROUPS`, template preview |
| Typer | [TypingGame.tsx](../src/ui/TypingGame.tsx) | `computeResult`, `hurt`, loop ancaman, scoring karakter |
| Tower | [TowerPuzzle.tsx](../src/ui/TowerPuzzle.tsx) | `win`, `tap`, hint, drag, stage |
| Level Tower | [towerLevels.ts](../src/data/towerLevels.ts) | `HTML_LEVELS`, `genericLevel`, `buildStages` |
| Progres | [progress.ts](../src/lib/progress.ts) | `meetingLevel`, `meetingUnlocked`, `applyAttempt` |
| Reward dan daily selesai | [App.tsx](../src/App.tsx) | `completeMateri`, `finishPractice`, `claimAchievement` |
| Rank dan save | [storage.ts](../src/lib/storage.ts) | `SaveData`, `RANKS`, streak helpers |
| Badge | [achievements.ts](../src/lib/achievements.ts) | `ACHIEVEMENTS`, `getAchievementStatus`, `missions-done` |
| Pengali streak | [streakMultiplier.ts](../src/lib/streakMultiplier.ts) | `STREAK_MULTIPLIER_TIERS`, `applyStreakMultiplier` |
| Daily | [dailyChallenges.ts](../src/data/dailyChallenges.ts) | `getDayOfYear`, `getDailyChallenge`, `dailyChallengeToSession` |
| Materi MD | [materiHtml.ts](../src/data/materiHtml.ts) dan [content/html](../content/html/) | Enam import MD, `HTML_DOCS` |
| Renderer MD | [markdown.ts](../src/lib/markdown.ts) dan [MateriHtml.tsx](../src/ui/MateriHtml.tsx) | `mdInline`, `parseMd`, `MdView` |
| Riwayat | [history.ts](../src/lib/history.ts) | `AttemptRecord`, `MAX_ITEMS` |
| Sinkronisasi | [sync.ts](../src/lib/sync.ts) | `pushOutbox`, `replaceOutbox`, batas outbox |
| Backend sinkron | [sync-progress.mjs](../api/sync-progress.mjs) | Respons mock, warning, penulisan berbasis `device_id` |
| Identitas dan cloud opsional | [auth.ts](../src/lib/auth.ts), [supabaseClient.ts](../src/lib/supabaseClient.ts) | guest, OAuth, lazy import, env |
| Skema | [schema.sql](../db/schema.sql), [supabase-schema.sql](../db/supabase-schema.sql) | Perbedaan `device_id`/`user_id`, policy owner-only |
| Adapter SQLite | [gameDb.ts](../src/lib/gameDb.ts) | Flag provider dan `initSqlite` bukan bukti persistensi SQL penuh |
| Preview/PWA | [vite.config.ts](../vite.config.ts) | Mock dev API, server host, plugin PWA |

### Pemeriksaan penyusunan dokumen ini

- Dilakukan inspeksi source pada area gameplay, reward, progres, badge, daily, storage, auth, dan sinkronisasi.
- Pencarian istilah leaderboard pada `src`, `api`, dan `db` tidak menemukan implementasi saat penyusunan.
- Tidak dijalankan build, tes browser, koneksi database, migrasi, atau validasi cloud untuk membuat dokumen ini.
- Tabel fitur baru, kontrak data V2, leaderboard, serta game tambahan adalah instruksi desain, bukan hasil implementasi.
