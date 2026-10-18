# Pertemuan 7 — Mini Project 1 (Pra-UTS)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Navigasi & API (Pertemuan 7 dari 16)
> **Bobot Penilaian:** 15% dari Total Nilai Akhir Semester (Mini Project 1)
> **Target:** Membangun aplikasi utuh (Todo List interaktif atau Weather App) yang menggabungkan seluruh materi Pertemuan 1 s.d. 6.

---

## 1. Spesifikasi Teknis Proyek Pra-UTS

Mahasiswa diwajibkan mengintegrasikan seluruh konsep dasar yang telah dipelajari:

1. **Tata Letak & Desain (Flexbox)**: Desain mobile-friendly, clean UI, penataan kartu rapi, responsif terhadap berbagai ukuran layar smartphone.
2. **State Management & Interaktivitas**: Operasi Tambah, Hapus, dan Centang Selesai (Toggle Complete) berjalan instan.
3. **Penyimpanan Lokal Persisten**: Seluruh data tersimpan otomatis di `AsyncStorage` sehingga tidak hilang saat aplikasi ditutup/reboot.
4. **Navigasi Multi-Screen (Opsional / Nilai Tambah)**: Memisahkan halaman daftar tugas utama dan halaman detail/tambah tugas menggunakan Stack Navigator.

---

## 2. Rubrik & Indikator Penilaian Mini Project 1 (15%)

| Kriteria Penilaian | Bobot | Indikator Keberhasilan |
|---|---|---|
| **Fungsionalitas CRUD** | 35% | Aplikasi dapat membuat, membaca, memperbarui status, dan menghapus tugas tanpa error. |
| **Persistensi Data** | 25% | Data tersimpan aman di AsyncStorage dan termuat kembali saat aplikasi dibuka ulang. |
| **Desain UI/UX & Flexbox** | 25% | Penggunaan komponen native, visual rapi, kontras warna nyaman, tombol memiliki touch feedback. |
| **Kebersihan Kode & Struktur** | 15% | Kode terpisah secara modular, penamaan variabel jelas, tidak ada memory leak. |

---

## 3. Checklist Sebelum Penyerahan
- [ ] Aplikasi berjalan tanpa crash di Expo Go Android.
- [ ] Fitur tambah item memiliki validasi input kosong (*empty input check*).
- [ ] Fitur hapus memiliki dialog konfirmasi (*Alert.alert*).
- [ ] Kode sumber diunggah ke repositori GitHub pribadi.
