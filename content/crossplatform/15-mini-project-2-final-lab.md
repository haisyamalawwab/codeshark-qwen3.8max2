# Pertemuan 15 — Mini Project 2 / Final Project Lab

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** UAS (Pertemuan 15 dari 16)
> **Bobot Penilaian:** 15% dari Total Nilai Akhir Semester (Mini Project 2 / Proyek Pra-UAS)
> **Target:** Finalisasi dan pemolesan menyeluruh aplikasi mobile sebelum dipresentasikan di sidang UAS.

%%IMG:rn-final-architecture%%

---

## 1. Sasaran & Spesifikasi Proyek Akhir

Mahasiswa secara individu atau kelompok (maksimal 2 orang) membangun satu aplikasi mobile fungsional utuh dengan tema pilihan:
- *E-Commerce & Belanja Kampus*
- *Klinik & Reservasi Janji Temu Dokter*
- *Pencatatan Akademik & Jadwal Kuliah*
- *Food Delivery & Restoran*
- *Panduan Wisata & Destinasi Lokal (GPS Map)*

### Syarat Wajib Arsitektur Proyek (6 Pilar):
1. **Navigasi Bersarang (Nested Navigation)**: Menggabungkan `createBottomTabNavigator` untuk menu utama dan `createNativeStackNavigator` untuk alur detail layar.
2. **State Management Terpusat**: Menggunakan Context API atau Zustand untuk mengelola sesi otentikasi dan data bersama lintas layar.
3. **Integrasi Backend Cloud**: Terhubung ke REST API atau Cloud Database (Firebase Firestore / Supabase) dengan operasi CRUD lengkap (Create, Read, Update, Delete).
4. **Fitur Hardware Device**: Memanfaatkan minimal 1 fitur native perangkat (`expo-camera`, `expo-location`, atau `expo-notifications`).
5. **Persistensi Data Offline**: Data cache tersimpan di `AsyncStorage` agar layar tidak kosong saat perangkat kehilangan koneksi internet.
6. **Build APK Sukses**: Berkas APK mandiri telah berhasil di-compile melalui EAS Build dan dapat diinstall di smartphone Android fisik.

---

## 2. Struktur Direktori Standar Industri

Struktur direktori yang direkomendasikan untuk proyek produksi:

```text
my-capstone-app/
├── app.json                 # Metadata, package name, icon, dan splash
├── eas.json                 # Konfigurasi build cloud APK Android & iOS
├── App.js                   # Root App, Providers & SafeAreaProvider
├── src/
│   ├── api/
│   │   ├── client.js        # Axios / Fetch client dengan Interceptor token
│   │   └── endpoints.js     # Definisi URL CRUD backend
│   ├── context/
│   │   ├── AuthContext.js   # State sesi login & logout
│   │   └── AppContext.js    # State data aplikasi & tema
│   ├── navigation/
│   │   ├── RootNavigator.js # Conditional rendering Public vs Protected
│   │   ├── TabNavigator.js  # Bottom Tabs: Beranda, Eksplorasi, Notif, Profil
│   │   └── StackNavigator.js# Stack detail dan form modal
│   ├── screens/
│   │   ├── auth/            # LoginScreen.js, RegisterScreen.js
│   │   ├── home/            # HomeScreen.js, NotificationScreen.js
│   │   ├── product/         # DetailScreen.js, AddItemScreen.js
│   │   └── profile/         # ProfileScreen.js, SettingsScreen.js
│   ├── components/          # Reusable: Button, Card, Header, InputField
│   └── utils/
│       ├── formatters.js    # Pemformat mata uang Rupiah & tanggal
│       └── storage.js       # Helper AsyncStorage wrapper
```

---

## 3. Checklist Lab Quality Assurance (QA)

Sebelum menyerahkan aplikasi ke meja penguji, lakukan pengujian berikut:

### A. Uji Coba Input & Keyboard (UX Test)
- [ ] Formulir input tidak tertutup oleh keyboard virtual saat diketik (bungkus menggunakan `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>`).
- [ ] Tombol submit memvalidasi data kosong (*empty validation*) sebelum mengirim request.

### B. Uji Coba Layar & Notch Kamera (Layout Test)
- [ ] Header dan tombol navigasi tidak tertutup oleh lekukan kamera (*notch*) atau bilah navigasi bawah (gunakan `<SafeAreaView>` atau library `react-native-safe-area-context`).
- [ ] Aplikasi tampak seimbang dan proporsional di berbagai resolusi layar HP.

### C. Uji Coba Offline & Error Handling (Stress Test)
- [ ] Matikan koneksi WiFi/Data HP: Aplikasi tidak boleh crash (*force close*); tampilkan banner atau dialog peringatan koneksi terputus.
- [ ] Data terakhir tetap muncul berkat cache lokal `AsyncStorage`.

---

## 4. Format Laporan Penyerahan Lab
1. Link Repositori GitHub publik yang berisi kode sumber bersih.
2. Link unduhan berkas APK Android yang dihasilkan oleh server EAS Build.
3. Berkas `README.md` yang memuat screenshot antarmuka dan petunjuk instalasi.
