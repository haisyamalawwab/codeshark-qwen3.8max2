# Pertemuan 4 — State, Hooks & Event Handling

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** UI & State (Pertemuan 4 dari 16)
> **CPMK3:** Mahasiswa mampu mengimplementasikan state management lokal, hooks, dan event handling interaktif pada aplikasi mobile.
> **Output Praktikum:** Aplikasi Kalkulator BMI Interaktif & Form Validasi real-time.

---

## 1. Konsep State vs Props

- **Props**: Data yang diwariskan dari komponen induk, sifatnya tetap (*immutable*).
- **State**: Memori internal komponen yang dapat berubah seiring waktu akibat aksi pengguna (misalnya mengetik, mengetuk tombol, atau menerima respons data internet). Ketika state diperbarui, komponen akan me-render ulang (*re-render*) secara otomatis untuk menampilkan data terkini.

---

## 2. Hook `useState` & `useEffect`

### A. Hook `useState`
Sintaks standar:

```javascript
const [count, setCount] = useState(0);

// Cara memperbarui state yang benar:
setCount(count + 1); // atau setCount(prev => prev + 1);
```

### B. Hook `useEffect` (Efek Samping & Siklus Hidup)
Digunakan untuk mendengarkan perubahan data, memuat data saat aplikasi pertama kali dibuka (*mount*), atau membersihkan timer/listener (*cleanup*):

```javascript
useEffect(() => {
  console.log("Komponen berhasil dimuat ke layar HP!");
  
  return () => {
    console.log("Komponen ditutup / dibongkar (unmounted)");
  };
}, []); // Array dependensi kosong = jalan 1x saat pertama kali muncul
```

---

## 3. Praktikum: Kalkulator Indeks Massa Tubuh (BMI)

```jsx
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BmiCalculator() {
  const [berat, setBerat] = useState('');
  const [tinggi, setTinggi] = useState('');
  const [hasilBmi, setHasilBmi] = useState(null);
  const [kategori, setKategori] = useState('');

  const hitungBmi = () => {
    const b = parseFloat(berat);
    const t = parseFloat(tinggi) / 100; // konversi cm ke meter

    if (b > 0 && t > 0) {
      const score = (b / (t * t)).toFixed(1);
      setHasilBmi(score);

      if (score < 18.5) setKategori('Kurus (Kurang Berat)');
      else if (score < 24.9) setKategori('Normal (Ideal) 🟢');
      else if (score < 29.9) setKategori('Kelebihan Berat (Gemuk) 🟡');
      else setKategori('Obesitas 🔴');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kalkulator BMI Mobile</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Berat Badan (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Contoh: 65"
          placeholderTextColor="#64748b"
          value={berat}
          onChangeText={setBerat}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tinggi Badan (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Contoh: 170"
          placeholderTextColor="#64748b"
          value={tinggi}
          onChangeText={setTinggi}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={hitungBmi}>
        <Text style={styles.btnText}>Hitung Sekarang</Text>
      </TouchableOpacity>

      {hasilBmi && (
        <View style={styles.resultBox}>
          <Text style={styles.resultNum}>{hasilBmi}</Text>
          <Text style={styles.resultKat}>{kategori}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
    color: '#f8fafc',
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#0284c7',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 24,
    backgroundColor: 'rgba(56,189,248,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#38bdf8',
    padding: 20,
    alignItems: 'center',
  },
  resultNum: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  resultKat: {
    fontSize: 15,
    color: '#f8fafc',
    marginTop: 4,
    fontWeight: '600',
  },
});
```
