# Pertemuan 13 — Animasi Interaktif & Optimasi Performa Mobile

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Native & Build (Pertemuan 13 dari 16)
> **CPMK2 & CPMK6:** Mahasiswa mampu mengimplementasikan animasi antarmuka 60 FPS dan teknik optimasi performa memory rendering.
> **Output Praktikum:** Aplikasi dengan animasi transisi smooth (Animated API / Reanimated) dan rendering list bebas lag.

---

## 1. Menjaga 60 FPS: UI Thread vs JavaScript Thread

Animasi di mobile harus berjalan pada kecepatan **60 frame per detik (FPS)** (atau 120 FPS pada layar ProMotion) agar terasa natural.

Jika kita mengubah state React biasa (`useState`) secara berulang-ulang untuk menggerakkan elemen, setiap frame akan memaksa kompilasi ulang JS thread, menyebabkan **frame drop (lag)**.

Solusi: Gunakan **`useNativeDriver: true`** pada Animated API React Native. Properti ini mengirimkan seluruh instruksi kurva animasi ke thread native (C++/Java) sekali saja di awal, sehingga animasi tetap berjalan mulus meskipun thread JavaScript sedang sibuk mengambil data internet!

---

## 2. Praktikum Animasi Fade & Scale Interaktif

```jsx
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SmoothCard() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animasi Fade In saat muncul
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true, // Wajib agar 60 FPS!
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.cardTitle}>Kartu Responsif Beranimasi</Text>
        <Text style={styles.cardDesc}>Sentuh kartu ini untuk melihat efek pantulan pegas halus.</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#38bdf8',
    margin: 20,
  },
  cardTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardDesc: { color: '#94a3b8', fontSize: 13, lineHeight: 20 },
});
```

---

## 3. Checklist Optimasi Performa Mobile
1. Gunakan format gambar modern **WebP** daripada PNG/JPG mentah yang berukuran besar.
2. Pasang properti `initialNumToRender={10}` dan `maxToRenderPerBatch={10}` pada `<FlatList>`.
3. Bungkus fungsi callback di dalam `useCallback()` dan kalkulasi berat di dalam `useMemo()`.
