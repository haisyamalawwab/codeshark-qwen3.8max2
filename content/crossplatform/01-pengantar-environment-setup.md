# Pertemuan 1 — Pengantar & Environment Setup

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Dasar & Setup (Pertemuan 1 dari 16)
> **CPMK1:** Mahasiswa mampu memahami arsitektur aplikasi cross-platform dan ekosistem React Native/Expo.
> **Output Praktikum:** Hello World app berjalan di emulator Android & Expo Go HP fisik.

%%IMG:rn-architecture%%

---

## 1. Konsep Dasar Cross-Platform Development

Dalam pengembangan aplikasi mobile, terdapat beberapa paradigma arsitektur utama:

1. **Native (Android: Kotlin/Java, iOS: Swift/Objective-C)**:
   - Menghasilkan performa puncak dan akses perangkat keras tanpa perantara.
   - Kekurangan: Perusahaan harus memelihara **dua tim dan dua basis kode terpisah**, melipatgandakan biaya serta waktu rilis.
2. **Hybrid / Webview (Cordova, Capacitor, Ionic)**:
   - Membungkus halaman web (HTML/CSS/JS) di dalam browser mini (Webview).
   - Kekurangan: Performa animasi lambat (terasa "berat" seperti web biasa), scrolling tidak natural pada layar sentuh.
3. **Cross-Platform Asli (React Native & Flutter)**:
   - **Satu basis kode**, tetapi merender **widget native asli** platform (bukan Webview).
   - Mengusung filosofi *"Learn once, write anywhere"*.

| Paradigma | Bahasa | Mesin Render | Performa | Akses Native |
|---|---|---|---|---|
| Native Murni | Kotlin / Swift | Android View / UIKit | Paling Cepat | Langsung (100%) |
| Hybrid / Webview | HTML, CSS, JS | Webview Browser | Sedang | Lewat Plugin |
| **React Native** | **JavaScript / TypeScript** | **Native View via JSI** | **Tinggi (60-120 FPS)** | **Lengkap via Modules** |

---

## 2. Arsitektur React Native Modern (JSI & Hermes Engine)

React Native modern tidak lagi menggunakan JSON Bridge lama yang lambat, melainkan:

- **Hermes JavaScript Engine**: Mesin JS ringan rancangan Meta yang dikompilasi ke bytecode di awal (*Ahead-of-Time*), membuat startup aplikasi sangat cepat dan hemat RAM.
- **JSI (JavaScript Interface)**: Lapisan C++ yang memungkinkan kode JavaScript memanggil fungsi native Android/iOS secara langsung di memori tanpa serialisasi string JSON.
- **Fabric UI Renderer**: Menjamin tata letak responsif dan rendering sinkron dengan platform host.

%%IMG:expo-workflow%%

---

## 3. Mengapa Memilih Expo? (Managed vs Bare Workflow)

Expo adalah ekosistem dan framework resmi yang direkomendasikan oleh tim React Native:

- **Expo Managed Workflow**: Pengembang fokus 100% pada kode JavaScript/TypeScript. Expo menangani konfigurasi Gradle Android, CocoaPods iOS, splash screen, ikon aplikasi, dan perizinan secara otomatis melalui `app.json`.
- **Expo Go App**: Aplikasi di Google Play Store & Apple App Store yang memungkinkan kita menguji kode secara langsung di HP fisik hanya dengan memindai **QR Code**, tanpa perlu kabel data atau install Android Studio bergiga-giga!

---

## 4. Panduan Praktikum Step-by-Step

### Langkah 1 — Verifikasi Lingkungan Node.js
Pastikan Node.js LTS (versi 18 ke atas) telah terpasang:

```bash
node -v
npm -v
```

### Langkah 2 — Membuat Proyek Expo Baru
Gunakan utilitas `npx` (tidak perlu install Expo CLI secara global):

```bash
npx create-expo-app@latest myfirstapp
cd myfirstapp
```

### Langkah 3 — Menjalankan Server Metro Bundler
Jalankan bundler pengembangan:

```bash
npx expo start
```

Terminal akan menampilkan **QR Code**. Buka aplikasi **Expo Go** di HP Android, pilih *"Scan QR Code"*, dan aplikasi pertamamu akan langsung muncul di layar HP!

### Langkah 4 — Modifikasi `App.js` Pertama

```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo, Sistem Aplikasi Lintas Platform! 🚀</Text>
      <Text style={styles.subtitle}>Pertemuan 01 • Expo SDK 52 Berhasil Berjalan</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
```

> 💡 **Tip Dosen:** Pastikan laptop dan HP fisik kamu terhubung ke jaringan Wi-Fi yang sama agar Metro Bundler dapat mengirim bundle JavaScript secara nirkabel. Jika menggunakan jaringan seluler, jalankan perintah `npx expo start --tunnel`.

---

## 5. Tugas Mandiri & Checklist Kelulusan
- [ ] Berhasil membuat proyek Expo via terminal.
- [ ] Berhasil menghubungkan Expo Go di HP atau emulator Android.
- [ ] Mengubah teks nama, NIM, dan warna latar belakang aplikasi di `App.js`.
