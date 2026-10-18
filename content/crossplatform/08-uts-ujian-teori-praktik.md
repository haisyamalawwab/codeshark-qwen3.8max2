# Pertemuan 8 — Ujian Tengah Semester (UTS)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Evaluasi Tengah Semester
> **Bobot Penilaian:** 20% dari Total Nilai Akhir Semester (10% Teori + 10% Praktik Live Coding)
> **Waktu Pengerjaan:** 100 Menit (2 SKS Teori & Praktik Terpadu)

---

## 1. Komponen Ujian Teori (Bobot: 10%)

Mahasiswa diuji mengenai pemahaman mendalam tentang:
1. Perbandingan arsitektur: Native vs Hybrid vs Cross-Platform (React Native vs Flutter).
2. Peran mesin JS Hermes dan arsitektur JSI C++ dalam performa runtime aplikasi.
3. Alasan mengapa `flexDirection: 'column'` menjadi default di React Native.
4. Perbedaan mendasar antara Props, State lokal, dan AsyncStorage.
5. Mekanisme siklus hidup `useEffect` dan pembersihan memory leak (*cleanup function*).

---

## 2. Komponen Ujian Praktik Live Coding (Bobot: 10%)

### Soal Studi Kasus:
Buatlah aplikasi mobile *"Pencatatan Keuangan Saku Mahasiswa"* dengan ketentuan:
1. Memiliki form input: Nama Pengeluaran (Teks), Nominal Uang (Angka), Kategori (Pilihan Dropdown/Segmented).
2. Menampilkan daftar transaksi menggunakan `<FlatList>` dengan pemformatan mata uang Rupiah.
3. Menghitung secara otomatis total saldo pengeluaran yang muncul di header.
4. Menyimpan data transaksi ke `AsyncStorage`.
5. Memberikan opsi hapus transaksi dengan geser (*swipe*) atau tombol hapus.

### Standar Rubrik Penilaian:
- **Tingkat A (85 - 100)**: Semua fitur berjalan sempurna, UI sangat rapi dengan Flexbox, tidak ada warning di terminal.
- **Tingkat B (70 - 84)**: Fitur CRUD dan persistensi berfungsi, UI standar.
- **Tingkat C (55 - 69)**: Fitur hanya berjalan di memory (data hilang saat reload).
- **Tingkat D (< 55)**: Terdapat error sintaks / runtime crash.
