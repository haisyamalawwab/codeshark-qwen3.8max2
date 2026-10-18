# Pertemuan 10 — Alur Autentikasi & Rute Terproteksi

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Global & Backend (Pertemuan 10 dari 16)
> **CPMK3:** Mahasiswa mampu mengimplementasikan alur otentikasi pengguna (Login, Register, Logout) dengan Protected Routes dan Token Persistence.
> **Output Praktikum:** Alur autentikasi mobile lengkap dengan validasi token dan proteksi layar privat.

---

## 1. Konsep Conditional Screen Rendering untuk Keamanan

Di aplikasi mobile native, kita **tidak boleh** membiarkan pengguna mengakses layar privat (seperti Dashboard, Profil, Pengaturan Akun) jika mereka belum memiliki token otentikasi yang valid.

Alih-alih menyembunyikan elemen dengan CSS, pola resmi React Navigation adalah melakukan **Conditional Rendering** pada tumpukan Stack Navigator:

```jsx
<Stack.Navigator>
  {userToken == null ? (
    // Rute Publik (Pengguna Belum Login)
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </>
  ) : (
    // Rute Terproteksi (Hanya Pengguna yang Sudah Login)
    <>
      <Stack.Screen name="AppHome" component={HomeScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </>
  )}
</Stack.Navigator>
```

Keuntungan pola ini:
- Pengguna tidak bisa "membajak" rute dengan tombol back fisik karena rute publik sudah tidak ada lagi di dalam memori Stack!
- Saat pengguna menekan tombol *Logout*, state token diset ke `null`, dan React Navigation secara otomatis mengembalikan tampilan ke halaman Login dengan animasi transisi yang mulus.

---

## 2. Penyimpanan Token dengan Secure Persistence

Token otentikasi (JWT atau Session ID) harus disimpan agar pengguna tidak perlu login berulang kali setiap kali membuka aplikasi:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Saat Login Berhasil
await AsyncStorage.setItem('USER_TOKEN', response.data.token);

// Saat Aplikasi Pertama Kali Dibuka (Splash Loading)
const token = await AsyncStorage.getItem('USER_TOKEN');
if (token) {
  setUserToken(token);
}
setIsLoading(false);
```

---

## 3. Checklist Keamanan Otentikasi Mobile
- [ ] Kata sandi di-mask menggunakan properti `secureTextEntry={true}` pada `<TextInput>`.
- [ ] Tombol Login dinonaktifkan (*disabled*) dan menampilkan indikator `<ActivityIndicator>` saat proses request sedang berjalan.
- [ ] Penanganan pesan kesalahan yang ramah (*User-friendly Error Message*) jika email atau sandi salah.
