# Pertemuan 14 — Testing, Debugging & Build APK Mandiri (EAS Build)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Native & Build (Pertemuan 14 dari 16)
> **CPMK5:** Mahasiswa mampu melakukan build dan deployment aplikasi mobile ke artefak instalasi Android (.APK mandiri) via EAS Build.
> **Output Praktikum:** File APK Android mandiri (*standalone installer*) yang dapat di-share dan diinstall di HP siapa pun tanpa Expo Go!

%%IMG:expo-workflow%%

---

## 1. Menyiapkan Konfigurasi `app.json`

Sebelum melakukan build, sesuaikan metadata aplikasi di `app.json`:

```json
{
  "expo": {
    "name": "Catatan Kampus",
    "slug": "catatan-kampus",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0b1528"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0b1528"
      },
      "package": "com.namakamu.catatankampus"
    }
  }
}
```

> ⚠️ **Package Name Unik:** Nilai `android.package` harus unik dan menggunakan format reverse domain, contoh: `com.haisyam.myfirstapp`.

---

## 2. Menyiapkan Expo Application Services (EAS)

EAS Build adalah layanan cloud resmi Expo yang mengompilasi kode React Native menjadi berkas biner `.apk` dan `.aab` di server cloud (bebas dari kewajiban menginstall Android Studio atau SDK Java 20GB di laptop!).

### Langkah 1: Install EAS CLI secara Global
```bash
npm install -g eas-cli
```

### Langkah 2: Login ke Akun Expo
```bash
eas login
```

### Langkah 3: Konfigurasi Profil Build (`eas.json`)
Jalankan perintah inisialisasi:
```bash
eas build:configure
```

Buka berkas `eas.json` yang dihasilkan dan tambahkan konfigurasi `"buildType": "apk"` pada profil preview:

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 3. Menjalankan Cloud Build APK Android

Jalankan perintah pembuatan APK:

```bash
eas build -p android --profile preview
```

Server cloud Expo akan:
1. Mengemas dependensi dan aset gambar.
2. Menjalankan kompilasi Gradle native Android.
3. Menandatangani berkas APK dengan Android Keystore otomatis.
4. Memberikan tautan **Download Link (.apk)** dan **QR Code** langsung di terminal!

Kamu cukup mengunduh berkas APK tersebut dan menginstallnya di HP fisik Android. Aplikasi kini dapat berjalan mandiri 100% tanpa butuh koneksi ke laptop atau Expo Go!
