# Pertemuan 3 — Rekayasa Kebutuhan: Menggali & Menuliskan "Harus Bisa Apa"

> **Tahap:** RPL (Pertemuan 3 dari 6) · **Fondasi:** kesalahan paling mahal lahir di fase ini — maka gali dengan benar sejak awal.

**Tujuan pertemuan ini:** kamu mampu (1) membedakan kebutuhan fungsional dan non-fungsional, (2) memilih teknik elisitasi yang sesuai, (3) menulis user story beserta kriteria penerimaan, dan (4) mengenali ciri spesifikasi kebutuhan (SRS) yang baik.

Bayangkan memesan makanan dengan instruksi "yang enak ya". Hasilnya hampir pasti tidak sesuai bayanganmu — bukan salah kokinya, melainkan pesanannya tidak jelas. Begitu pula perangkat lunak: **kebutuhan (requirements)** adalah pernyataan tentang apa yang harus dilakukan sistem dan batasan yang harus dipatuhinya. **Rekayasa kebutuhan** adalah proses menemukan, menganalisis, menuliskan, dan memeriksa kebutuhan itu.

## Dua Jenis Kebutuhan

| Jenis | Isi | Contoh pada aplikasi perpustakaan |
|---|---|---|
| Fungsional | Layanan/fungsi yang disediakan sistem | "Mahasiswa dapat meminjam buku bila stok tersedia dan pinjamannya < 3" |
| Non-fungsional | Kualitas & batasan cara sistem bekerja | "Pencarian buku tampil < 2 detik", "hanya pustakawan yang dapat menghapus data", "tersedia pada jam layanan 99% waktu" |

Kebutuhan non-fungsional sering dilupakan, padahal ia menentukan apakah sistem *nyaman dan aman dipakai*: kinerja, keamanan, kemudahan penggunaan (*usability*), keandalan, dan kemudahan perawatan.

> ⚠️ **Kalimat kabur = kebutuhan gagal.** "Sistem harus cepat dan mudah digunakan" tidak bisa diuji. Perbaikannya: "Hasil pencarian tampil maksimal 2 detik untuk 10.000 data buku" dan "mahasiswa baru berhasil meminjam buku tanpa bantuan dalam < 3 menit". Selalu buat kebutuhan **terukur**.

## Elisitasi: Menggali Kebutuhan dari Manusia

**Elisitasi** adalah tahap penggalian. Kebutuhan tidak "dikumpulkan" begitu saja — pengguna sering tidak tahu persis yang ia butuhkan, atau menjelaskan solusi padahal yang penting masalahnya.

%%IMG:rpl-p3-elisitasi%%

| Teknik | Kelebihan | Cocok untuk |
|---|---|---|
| Wawancara | Mendalam, bisa menindaklanjuti jawaban | Memahami proses & masalah pemangku kunci |
| Observasi | Melihat praktik nyata, termasuk kebiasaan tak terucap | Alur kerja manual yang akan digantikan sistem |
| Kuesioner | Menjangkau banyak responden | Pengguna banyak & tersebar |
| Studi dokumen | Murah, mengungkap aturan resmi | Formulir, SOP, laporan, sistem lama |
| Prototipe | Pengguna bereaksi pada contoh nyata | Kebutuhan antarmuka yang sulit dibayangkan |

Praktik yang baik menggabungkan beberapa teknik — misalnya wawancara pustakawan, observasi jam sibuk perpustakaan, plus membaca formulir peminjaman lama. Tokoh yang digali disebut **pemangku kepentingan (stakeholders)**: semua pihak yang terpengaruh sistem, bukan hanya yang membayar.

## Empat Tahap Rekayasa Kebutuhan

%%IMG:rpl-alur-kebutuhan%%

1. **Elisitasi** — menggali dari para pemangku kepentingan.
2. **Analisis** — memeriksa konflik (mis. mahasiswa ingin pinjam 5 buku, pustakawan membatasi 3), mengelompokkan, dan memprioritaskan.
3. **Spesifikasi** — menuliskan hasil analisis ke dokumen/bentuk baku.
4. **Validasi** — memeriksa bersama pemangku kepentingan: "betulkah ini yang dibutuhkan?" Bila belum, kembali ke tahap sebelumnya.

Untuk prioritas, teknik populer adalah **MoSCoW**: *Must have* (wajib), *Should have* (penting), *Could have* (bagus bila sempat), *Won't have* (tidak untuk rilis ini). Pada aplikasi perpustakaan: pinjam-kembali = Must, laporan denda bulanan = Should, reservasi online = Could, aplikasi mobile = Won't (dulu).

## Menulis Kebutuhan ala Agile: User Story

Di proyek Agile, kebutuhan sering ditulis sebagai **user story**:

```text
Sebagai mahasiswa,
saya ingin memesan (reservasi) buku yang sedang dipinjam,
sehingga saya mendapat giliran pertama saat buku kembali.
```

Agar dapat diuji, user story ditemani **kriteria penerimaan (acceptance criteria)**, misalnya pola Diberikan–Ketika–Maka:

```text
Diberikan buku sedang dipinjam mahasiswa lain,
ketika saya menekan tombol Reservasi,
maka saya masuk antrean dan menerima nomor antrean.
```

User story yang baik mengikuti prinsip **INVEST**: *Independent* (mandiri), *Negotiable* (bisa didiskusikan), *Valuable* (bernilai bagi pengguna), *Estimable* (bisa diperkirakan), *Small* (cukup kecil untuk satu sprint), *Testable* (dapat diuji).

## SRS: Dokumen Spesifikasi Kebutuhan

Pada proyek formal, kebutuhan dibukukan sebagai **SRS** (*Software Requirements Specification*). SRS yang baik berciri:

| Ciri | Maksud |
|---|---|
| Benar | Sesuai kebutuhan nyata pemangku kepentingan |
| Tidak ambigu | Setiap kalimat hanya punya satu tafsir |
| Lengkap | Semua fungsi & batasan penting tercakup |
| Konsisten | Tidak ada kebutuhan yang saling bertentangan |
| Dapat diverifikasi | Setiap kebutuhan bisa diuji/diukur |
| Dapat dilacak | Setiap kebutuhan tahu asal-usul & turunannya di desain/uji |

%%IMG:rpl-p3-dokumen-srs%%

> 💡 **Verifikasi vs validasi.** *Verifikasi*: "apakah kita membangun produk **dengan benar**?" (sesuai spesifikasi). *Validasi*: "apakah kita membangun **produk yang benar**?" (sesuai kebutuhan nyata pengguna). Sistem bisa lulus verifikasi tetapi gagal validasi — rapi mengikuti SRS yang ternyata salah paham sejak awal. Itulah mengapa validasi bersama pengguna tidak boleh dilewatkan.

**Cek paham 1:** "Sistem harus merespons dalam waktu yang wajar." Termasuk jenis kebutuhan apa, dan bagaimana memperbaikinya?
*Jawab:* Non-fungsional (kinerja), tetapi kabur. Perbaiki menjadi terukur, mis. "95% permintaan pencarian selesai ≤ 2 detik pada 50 pengguna bersamaan".

**Cek paham 2:** Mengapa wawancara saja sering tidak cukup untuk elisitasi?
*Jawab:* Karena pengguna menjelaskan dari ingatan dan sudut pandangnya saja; kebiasaan nyata, pengecualian, dan aturan tertulis sering baru terlihat lewat observasi dan studi dokumen.

## Latihan Mini

1. Tulis 3 user story untuk aplikasi perpustakaan (satu untuk mahasiswa, satu pustakawan, satu kepala perpustakaan), masing-masing dengan 2 kriteria penerimaan.
2. Klasifikasikan 6 fitur perpustakaan dari Latihan Pertemuan 2 ke MoSCoW dan pertahankan pilihan *Must have*-mu dalam 3 kalimat.

## Rangkuman

- Kebutuhan = fungsional (layanan) + non-fungsional (kualitas & batasan); keduanya harus terukur.
- Elisitasi memadukan wawancara, observasi, kuesioner, studi dokumen, dan prototipe.
- Alur rekayasa kebutuhan: elisitasi → analisis → spesifikasi → validasi (berulang).
- User story + kriteria penerimaan (INVEST) untuk Agile; SRS yang benar, tak ambigu, lengkap, konsisten, terverifikasi, terlacak untuk proyek formal.

Pertemuan berikutnya: kebutuhan yang sudah jelas kita **gambar** menjadi model — mulai dari UML Use Case dan Activity Diagram.
