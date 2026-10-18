# Pertemuan 16 — Ujian Akhir Semester (UAS Showcase & Demo)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** UAS (Pertemuan 16 dari 16)
> **Bobot Penilaian:** 20% dari Total Nilai Akhir Semester (Presentasi, Demo Live APK & Sidang CPMK)
> **Output Akhir:** Presentasi profesional dan demonstrasi aplikasi mobile yang terinstall langsung di smartphone Android.

%%IMG:rn-uas-showcase%%

---

## 1. Format Sidang & Demonstrasi Proyek UAS

Setiap mahasiswa / tim diberikan alokasi waktu **15 menit** dengan pembagian:
- **5 Menit**: Presentasi slide latar belakang masalah, arsitektur sistem, skema database, dan diagram navigasi.
- **6 Menit**: Demonstrasi Live Aplikasi langsung dari smartphone fisik penguji (menampilkan alur autentikasi, CRUD data, dan fitur native kamera/GPS).
- **4 Menit**: Tanya jawab teknis seputar keputusan arsitektur kode sumber dan penguasaan CPMK 1 s.d. CPMK 6.

### Setup Demonstrasi Layar Smartphone ke Proyektor:
Gunakan utilitas mirroring gratis seperti **`scrcpy`** (Screen Copy) untuk menampilkan layar smartphone Android ke proyektor laptop via kabel USB tanpa lag:
```bash
# Install scrcpy (macOS / Linux / Windows)
brew install scrcpy  # macOS
# Jalankan mirroring dengan kontrol keyboard & mouse:
scrcpy --max-size 1080
```

---

## 2. Pipeline Publishing ke Google Play Store & Apple App Store

Setelah aplikasi lulus evaluasi, aplikasi siap didistribusikan ke publik global:

### A. Konfigurasi Metadata Produksi: `app.json`
```json
{
  "expo": {
    "name": "MyCampus Mobile",
    "slug": "mycampus-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#091120"
    },
    "android": {
      "package": "com.namakamu.mycampus",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#091120"
      },
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

### B. Menghasilkan Android App Bundle (.aab) via EAS Build
Google Play Store mewajibkan format **AAB (Android App Bundle)** untuk rilis resmi toko:
```bash
# 1. Login ke akun Expo
npx eas login

# 2. Inisialisasi konfigurasi EAS
npx eas build:configure

# 3. Jalankan build cloud untuk profil production
npx eas build --platform android --profile production
```

Server cloud Expo akan mengompilasi kode sumber, menandatangani berkas dengan Android Keystore resmi, dan memberikan tautan download berkas `.aab` yang siap diunggah ke Google Play Console!

---

## 3. Rubrik Evaluasi Penilaian Sidang UAS (Bobot: 20%)

| Komponen Evaluasi | Bobot | Kriteria Penilaian |
|---|---|---|
| **Kelengkapan Fitur & CRUD** | 30% | Semua skenario CRUD berjalan lancar, data tersinkron ke cloud backend, persistensi offline berfungsi sempurna. |
| **Kestabilan Build APK** | 20% | Berkas APK terinstall di HP fisik penguji tanpa force close, waktu peluncuran cepat, bebas warning konsol. |
| **Penguasaan Teori & Tanya Jawab** | 20% | Mampu menjelaskan arsitektur React Native (JSI, Hermes, State, Navigation, Async) dengan lugas dan tepat. |
| **Kualitas Desain UI/UX** | 15% | Desain konsisten, mematuhi prinsip Flexbox mobile, kontras warna ramah mata, transisi fluid 60 FPS. |
| **Penerapan Fitur Native** | 15% | Integrasi kamera, GPS, atau notifikasi lokal dengan penanganan izin (*runtime permissions*) yang aman. |

---

## 4. Ucapan Kelulusan & Langkah Selanjutnya

🎓 **Selamat atas kelulusanmu!** Kamu telah menyelesaikan seluruh 16 modul kurikulum **Sistem Aplikasi Lintas Platform (React Native & Expo SDK)**.

Kini kamu menguasai:
- Arsitektur modern mobile development (JSI & Hermes Engine).
- Desain antarmuka fleksibel dengan Flexbox & Core Native Components.
- Navigasi bertingkat (Stack & Bottom Tabs) dengan rute terproteksi.
- State management lokal & global (Context API & AsyncStorage).
- Komunikasi jaringan REST API & sinkronisasi data cloud.
- Akses perangkat keras native (Kamera, Lokasi GPS, Notifikasi).
- Animasi fluida 60 FPS dan optimasi rendering list raksasa.
- Kompilasi cloud otomatis hingga menghasilkan berkas APK & AAB rilis store.

Jadikan aplikasi ini sebagai portofolio unggulan di profil LinkedIn dan GitHub kamu untuk melangkah percaya diri ke industri mobile developer profesional! 🚀
