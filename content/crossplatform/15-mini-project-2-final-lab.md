# Pertemuan 15 — Mini Project 2 / Final Project Lab

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** UAS (Pertemuan 15 dari 16)
> **Bobot Penilaian:** 15% dari Total Nilai Akhir Semester (Mini Project 2 / Proyek Pra-UAS)
> **Target:** Finalisasi dan pemolesan menyeluruh aplikasi mobile sebelum dipresentasikan di sidang UAS.

---

## 1. Sasaran Proyek Akhir

Mahasiswa secara individu atau kelompok (maksimal 2 orang) membangun satu aplikasi mobile fungsional utuh dengan tema bebas (contoh: *E-Commerce*, *Klinik Kesehatan*, *Pencatatan Akademik*, *Delivery Makanan*, *Travel Guide*).

### Syarat Wajib Arsitektur Proyek:
1. **Navigasi Gabungan**: Menggunakan Stack Navigator dan Bottom Tab Navigator.
2. **State Management Terpusat**: Menggunakan Context API atau Zustand untuk state global.
3. **Integrasi Backend**: Terhubung ke REST API atau Firebase Firestore (operasi Create, Read, Update, Delete).
4. **Fitur Hardware Device**: Memanfaatkan minimal 1 fitur native (Kamera, Lokasi GPS, atau Notifikasi Lokal).
5. **Persistensi Data**: Data cache tersimpan di AsyncStorage agar tidak kosong saat offline.
6. **Build Sukses**: Berkas APK mandiri telah berhasil di-compile melalui EAS Build.

---

## 2. Checklist Lab Quality Assurance (QA)
- [ ] Uji coba rotasi layar dan keyboard overlap (gunakan `<KeyboardAvoidingView>`).
- [ ] Penanganan kondisi jaringan putus (*offline fallback alert*).
- [ ] Penggunaan komponen `<SafeAreaView>` agar UI tidak tertabrak *notch* kamera atau bilah navigasi HP.
- [ ] Tidak ada warning konsol atau error yang belum ditangani.
