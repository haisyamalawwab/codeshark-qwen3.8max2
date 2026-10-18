# Pertemuan 9 — Context API & Global State Management

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Global & Backend (Pertemuan 9 dari 16)
> **CPMK3:** Mahasiswa mampu mengimplementasikan manajemen state global dengan Context API untuk mencegah prop drilling.
> **Output Praktikum:** Aplikasi dengan fitur Dark/Light Theme Switcher global & Global Shopping Cart.

---

## 1. Masalah "Prop Drilling" dan Solusi Context API

Pada aplikasi berskala menengah ke atas, seringkali data harus diakses oleh banyak komponen yang berada di cabang pohon (*component tree*) yang berjauhan (contoh: status login user, tema gelap/terang, bahasa, keranjang belanja).

Jika hanya mengandalkan props biasa, kita terpaksa meneruskan data melewati puluhan komponen perantara yang sebenarnya tidak membutuhkan data tersebut. Masalah ini disebut **Prop Drilling**.

**React Context API** memecahkan masalah ini dengan menyediakan saluran data global (*teleportasi state*) langsung dari Provider induk ke Consumer mana pun.

---

## 2. Pola Implementasi Tiga Serangkai Context

1. **`createContext`**: Membuat wadah konteks.
2. **`Provider`**: Komponen pembungkus di level root yang membagikan nilai state.
3. **`useContext` Hook**: Hook kustom untuk membaca dan memanipulasi state dari komponen anak mana pun.

```jsx
// context/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = {
    isDark,
    bg: isDark ? '#0a1628' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#0f172a',
    accent: '#38bdf8',
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook kustom untuk kemudahan akses
export const useTheme = () => useContext(ThemeContext);
```

---

## 3. Mengonsumsi Context di Komponen Anak

```jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './context/ThemeContext';

export default function HeaderComponent() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.box, { backgroundColor: theme.card }]}>
      <Text style={[styles.txt, { color: theme.text }]}>
        Mode Saat Ini: {isDark ? '🌙 Gelap' : '☀️ Terang'}
      </Text>
      <TouchableOpacity style={styles.btn} onPress={toggleTheme}>
        <Text style={styles.btnText}>Ganti Tema</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 20, borderRadius: 16, alignItems: 'center', margin: 16 },
  txt: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  btn: { backgroundColor: '#0284c7', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
```
