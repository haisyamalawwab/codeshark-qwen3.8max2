# Pertemuan 2 — Model Proses: dari Waterfall sampai Agile & Scrum

> **Tahap:** RPL (Pertemuan 2 dari 6) · **Fondasi:** fase SDLC yang sama bisa dirangkai dengan strategi yang berbeda.

**Tujuan pertemuan ini:** kamu mampu (1) membedakan model Waterfall, iteratif/inkremental, prototipe, dan spiral, (2) menjelaskan nilai Agile dan kerangka Scrum, dan (3) memilih model yang masuk akal untuk sebuah situasi proyek.

Di Pertemuan 1 kamu mengenal enam fase SDLC. Pertanyaan berikutnya: fase-fase itu dijalankan **sekali berurutan sampai selesai**, atau **berputar berkali-kali dalam potongan kecil**? Jawaban atas pertanyaan itulah yang disebut **model proses** (model SDLC).

## Waterfall: Sekali Jalan, Berurutan

**Waterfall** menjalankan fase secara berurutan dan kaku: analisis selesai total → desain selesai total → implementasi → pengujian → rilis. Seperti air terjun, aliran hanya bergerak turun; kembali ke fase sebelumnya itu mahal dan tidak direncanakan.

%%IMG:rpl-p2-waterfall%%

- **Kelebihan:** terstruktur, terdokumentasi lengkap, mudah dikelola untuk kebutuhan yang pasti.
- **Kelemahan:** pengguna baru melihat hasil di akhir; perubahan kebutuhan di tengah jalan sangat mahal; kesalahan analisis baru ketahuan saat pengujian.

Waterfall tetap masuk akal untuk proyek yang kebutuhannya **stabil dan diatur ketat**, misalnya perangkat lunak alat medis atau sistem kontrak pemerintah dengan spesifikasi yang dikunci di awal.

## Keluarga Model Lainnya

| Model | Gagasan utama | Cocok bila |
|---|---|---|
| Incremental | Sistem dibangun & dirilis **per bagian fitur** yang berfungsi | Fitur inti dibutuhkan cepat, sisanya menyusul |
| Iteratif | Seluruh sistem dibangun kasar dulu, lalu **disempurnakan berulang** | Gambaran besar jelas, detail belum pasti |
| Prototipe | Buat **versi contoh cepat** untuk digali tanggapannya, lalu dibuang/dikembangkan | Pengguna sulit menjelaskan keinginannya |
| Spiral | Putaran iterasi yang tiap putarannya menilai **risiko** terbesar dulu | Proyek besar & berisiko tinggi |
| V-Model | Waterfall yang menekankan pengujian sejajar tiap fase pengembangan | Sistem yang kritis terhadap keselamatan |

> 💡 **Cara mengingat.** *Incremental* = menambah **ruangan** satu per satu pada rumah yang sudah bisa dihuni. *Iteratif* = melukis sketsa seluruh lukisan dulu, lalu memperhalusnya berputar-putar.

## Agile: Beradaptasi terhadap Perubahan

Kenyataannya, kebutuhan hampir selalu berubah: pengguna baru tahu yang ia mau setelah melihat hasilnya. **Agile** adalah pola pikir yang dirumuskan dalam *Agile Manifesto* (2001). Empat nilainya (diparafrasekan):

1. Individu & interaksi **di atas** proses & alat.
2. Perangkat lunak yang bekerja **di atas** dokumentasi yang lengkap.
3. Kolaborasi dengan pelanggan **di atas** negosiasi kontrak.
4. Menanggapi perubahan **di atas** mengikuti rencana.

"Di atas" bukan berarti yang kanan dibuang — dokumentasi dan rencana tetap perlu — tetapi yang kiri **lebih diutamakan**. Agile diwujudkan lewat iterasi pendek, umpan balik cepat, dan perangkat lunak yang selalu dalam keadaan bisa dipakai.

> ⚠️ **Miskonsepsi umum.** Agile bukan berarti "tanpa rencana dan tanpa dokumentasi". Agile berarti rencana dibuat **secukupnya dan disesuaikan terus** berdasarkan umpan balik nyata.

## Scrum: Kerangka Agile yang Paling Populer

**Scrum** membagi pekerjaan ke dalam **sprint** — iterasi tetap 1–4 minggu yang selalu menghasilkan **increment** (hasil yang bisa dipakai).

**Tiga peran:**

| Peran | Tanggung jawab |
|---|---|
| Product Owner | Mewakili pengguna; menentukan & memprioritaskan fitur |
| Scrum Master | Menjaga proses, menghilangkan hambatan tim |
| Developers | Membangun increment setiap sprint |

**Artefak (benda kerja):** *Product Backlog* (daftar semua fitur terprioritaskan), *Sprint Backlog* (fitur pilihan sprint ini + rencana pengerjaannya), dan *Increment*.

**Acara (events):** Sprint Planning (memilih pekerjaan), Daily Scrum (sinkronisasi ≤15 menit), Sprint Review (demo ke pemangku kepentingan), Sprint Retrospective (evaluasi cara kerja).

%%IMG:rpl-siklus-scrum%%

%%IMG:rpl-p2-sprint-agile%%

Contoh satu sprint 2 minggu untuk aplikasi perpustakaan kita:

| Waktu | Kegiatan |
|---|---|
| Hari 1 | Sprint Planning: tim memilih fitur "pinjam buku" & "kembalikan buku" |
| Hari 2–9 | Daily Scrum 15 menit + pembangunan & pengujian fitur |
| Hari 10 pagi | Sprint Review: demo ke pustakawan, catat masukan |
| Hari 10 sore | Retrospective: sepakati satu perbaikan cara kerja untuk sprint berikut |

Selain Scrum, ada **Kanban**: pekerjaan divisualkan sebagai kartu yang mengalir pada papan kolom (To Do → Doing → Done) dengan batas jumlah pekerjaan berjalan. Kanban cocok untuk aliran tugas yang terus-menerus seperti pemeliharaan dan dukungan.

## Memilih Model: Tidak Ada yang Selalu Terbaik

| Faktor | Cenderung Waterfall | Cenderung Agile/iteratif |
|---|---|---|
| Kestabilan kebutuhan | Tetap & terkunci kontrak | Sering berubah |
| Keterlibatan pengguna | Sulit ditemui, di awal & akhir saja | Tersedia rutin memberi umpan balik |
| Risiko kegagalan | Diatur regulasi ketat, dokumen wajib lengkap | Pasar tidak pasti, perlu cepat belajar |
| Ukuran & pengalaman tim | Besar, terdistribusi, butuh koordinasi formal | Kecil–sedang, satu lokasi/virtual rapat |

Banyak organisasi memakai campuran: kontrak & arsitektur besar direncanakan di awal, pengerjaan fitur dilakukan per sprint.

**Cek paham 1:** Sebuah startup membuat aplikasi yang fiturnya akan ditentukan dari respons pengguna tiap bulan. Model apa yang paling masuk akal, dan mengapa?
*Jawab:* Agile/iteratif — kebutuhannya berubah cepat dan pengguna tersedia memberi umpan balik; Waterfall akan mengunci fitur yang mungkin sudah tidak relevan saat rilis.

**Cek paham 2:** Apa beda Product Backlog dan Sprint Backlog?
*Jawab:* Product Backlog berisi *semua* fitur terurut prioritas untuk produk; Sprint Backlog hanya berisi fitur yang dipilih untuk *satu sprint* beserta rencana pengerjaannya.

## Latihan Mini

1. Susun Product Backlog 6 fitur untuk aplikasi perpustakaan, urutkan dari yang paling penting. Fitur mana yang kamu masukkan ke Sprint 1? Jelaskan alasannya.
2. Berikan satu contoh proyek yang menurutmu lebih cocok Waterfall daripada Agile, dengan alasan berbasis tabel faktor di atas.

## Rangkuman

- Model proses mengatur *bagaimana* fase SDLC dirangkai: sekali jalan (Waterfall) atau berputar (iteratif/inkremental/Spiral/Agile).
- Waterfall kuat di kepastian & dokumentasi; lemah menghadapi perubahan.
- Agile mengutamakan umpan balik dan adaptasi; Scrum mewujudkannya lewat sprint, 3 peran, 3 artefak, dan 4 acara.
- Pilihan model bergantung pada kestabilan kebutuhan, ketersediaan pengguna, risiko, dan tim.

Pertemuan berikutnya kita masuk fase paling menentukan: **rekayasa kebutuhan** — cara menggali dan menuliskan "sistem harus bisa apa".
