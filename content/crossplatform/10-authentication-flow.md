# Pertemuan 10 — Alur Autentikasi & Rute Terproteksi

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Global & Backend (Pertemuan 10 dari 16)
> **CPMK3:** Mahasiswa mampu mengimplementasikan alur otentikasi pengguna (Login, Register, Logout) dengan Protected Routes dan Token Persistence.
> **Output Praktikum:** Alur autentikasi mobile lengkap dengan validasi token dan proteksi layar privat.

%%IMG:rn-auth-protected%%

---

## 1. Konsep Conditional Screen Rendering untuk Keamanan Mobile

Di aplikasi mobile native, kita **tidak boleh** membiarkan pengguna mengakses layar privat (seperti Dashboard, Profil, Pengaturan Akun) jika mereka belum memiliki token otentikasi yang valid.

Alih-alih menyembunyikan elemen dengan CSS atau melakukan pengecekan `if (!token) navigate('Login')` di setiap halaman, pola resmi **React Navigation** adalah melakukan **Conditional Rendering** langsung pada tumpukan Stack Navigator:

```jsx
<Stack.Navigator>
  {userToken == null ? (
    // Tumpukan Publik (Hanya Muncul Jika Belum Login)
    <Stack.Group screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Group>
  ) : (
    // Tumpukan Terproteksi (Hanya Muncul Jika Sudah Login)
    <Stack.Group>
      <Stack.Screen name="AppHome" component={HomeScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Group>
  )}
</Stack.Navigator>
```

### Mengapa Pola Ini Jauh Lebih Aman?
1. **Kebal Tombol Back Fisik Android**: Ketika pengguna berada di halaman Home, halaman Login sudah dihapus dari memori tumpukan (*navigation state*). Menekan tombol Back fisik tidak akan pernah kembali ke halaman Login!
2. **Transisi Instan saat Logout**: Begitu state `userToken` diubah menjadi `null`, React Navigation otomatis membongkar tumpukan privat dan menggantinya dengan tumpukan publik secara mulus (*declarative transition*).

---

## 2. Implementasi Lengkap `context/AuthContext.js`

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@user_access_token';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cek apakah ada sesi login tersimpan saat aplikasi dibuka
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const savedUser = await AsyncStorage.getItem('@user_profile_data');
        if (savedToken) {
          setUserToken(savedToken);
          if (savedUser) setUserData(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Gagal membaca sesi auth:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 2. Fungsi Login
  const signIn = async (email, password) => {
    // Simulasi panggilan API REST ke server backend
    if (email === 'mahasiswa@kampus.ac.id' && password === 'rahasia123') {
      const mockToken = 'jwt-token-xyz-12345';
      const mockProfile = { name: 'Ahmad Mahasiswa', email, role: 'Mahasiswa' };

      await AsyncStorage.setItem(TOKEN_KEY, mockToken);
      await AsyncStorage.setItem('@user_profile_data', JSON.stringify(mockProfile));

      setUserToken(mockToken);
      setUserData(mockProfile);
      return { success: true };
    } else {
      return { success: false, message: 'Email atau kata sandi tidak cocok!' };
    }
  };

  // 3. Fungsi Logout
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem('@user_profile_data');
      setUserToken(null);
      setUserData(null);
    } catch (e) {
      console.error('Error saat logout:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, userData, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 3. Layar Login: `screens/SignInScreen.js`

```jsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const [email, setEmail] = useState('mahasiswa@kampus.ac.id');
  const [password, setPassword] = useState('rahasia123');
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Perhatian', 'Harap isi email dan kata sandi!');
      return;
    }
    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);

    if (!res.success) {
      Alert.alert('Gagal Masuk', res.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandBox}>
        <Text style={styles.logo}>📱</Text>
        <Text style={styles.title}>Portal Mahasiswa</Text>
        <Text style={styles.subtitle}>Sistem Aplikasi Lintas Platform</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Alamat Email Kampus</Text>
        <TextInput
          style={styles.input}
          placeholder="nama@kampus.ac.id"
          placeholderTextColor="#64748b"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Kata Sandi</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#64748b"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Masuk ke Akun</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#091120', justifyContent: 'center', padding: 24 },
  brandBox: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 13, color: '#38bdf8', marginTop: 4 },
  form: { backgroundColor: '#111c34', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#1e2d4d' },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#15223c',
    color: '#ffffff',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1e2f52',
  },
  button: {
    backgroundColor: '#0284c7',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});
```

---

## 4. Checklist Keamanan Otentikasi Mobile
- [ ] Kata sandi selalu disembunyikan menggunakan properti `secureTextEntry={true}` pada `<TextInput>`.
- [ ] Tombol Login dinonaktifkan (*disabled*) dan menampilkan `<ActivityIndicator>` saat proses request sedang berlangsung.
- [ ] Token disimpan pada penyimpanan terproteksi (`AsyncStorage` untuk latihan, atau `expo-secure-store` untuk enkripsi hardware Android Keystore / iOS Keychain pada aplikasi perbankan).
- [ ] Penanganan pesan kesalahan yang jelas dan aman (jangan bocorkan apakah email ada atau kata sandi yang salah secara spesifik).
