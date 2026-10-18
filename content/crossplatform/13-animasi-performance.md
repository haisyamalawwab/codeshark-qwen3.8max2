# Pertemuan 13 — Animasi & Optimasi Performa (Animated API & FlatList)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Native & Build (Pertemuan 13 dari 16)
> **CPMK2 & CPMK5:** Mahasiswa mampu menciptakan transisi antarmuka fluid 60 FPS menggunakan Animated API dan mengoptimasi rendering list berkecepatan tinggi.
> **Output Praktikum:** Kartu animasi interaktif fluid 60 FPS dan FlatList yang dioptimasi untuk ribuan data.

%%IMG:rn-performance%%

---

## 1. Rahasia Performa Animasi: Mengapa `useNativeDriver: true`?

Di React Native, animasi dapat berjalan melalui dua jalur:

### A. Jalur Tradisional (`useNativeDriver: false`) ❌
Setiap frame (setiap 16 milidetik) dihitung di dalam memori JavaScript, kemudian dikirim satu per satu melalui JSI / Bridge ke thread native Android/iOS. Jika thread JavaScript sedang sibuk (misalnya sedang melakukan parsing JSON berukuran besar atau menghitung rumus matematika), animasi akan **patah-patah (drop frame / lag)**.

### B. Jalur Native Driver (`useNativeDriver: true`) ✅
Seluruh konfigurasi animasi dikirim **hanya sekali** ke thread native platform sebelum animasi dimulai. Thread UI asli (GPU platform) kemudian mengeksekusi animasi secara independen di kecepatan puncak 60 FPS / 120 FPS, bahkan saat JavaScript thread mengalami freeze sesaat!

> ⚠️ **Catatan Penting:** Properti yang didukung oleh Native Driver meliputi: `transform` (seperti `scale`, `translateX`, `translateY`, `rotate`) dan `opacity`. Properti tata letak non-GPU seperti `width`, `height`, dan `backgroundColor` tidak didukung native driver dan harus dihindari untuk animasi frekuensi tinggi.

---

## 2. Pola Pembuatan Animasi Fluida dengan `Animated.timing` & `Animated.spring`

```jsx
import React, { useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';

export default function AnimatedCard() {
  // 1. Inisialisasi Animated.Value di dalam useRef agar tidak ter-reset saat re-render
  const scaleValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0.5)).current;

  // Efek tombol ditekan (Press In)
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true, // WAJIB untuk performa 60 FPS
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Efek tombol dilepas (Press Out)
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4, // Tingkat elastisitas pantulan
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleValue }],
              opacity: fadeValue,
            },
          ]}
        >
          <Text style={styles.cardEmoji}>🚀</Text>
          <Text style={styles.cardTitle}>Kartu Beranimasi Fluida</Text>
          <Text style={styles.cardSub}>Tekan dan tahan untuk melihat efek spring & scale</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#091120' },
  card: {
    backgroundColor: '#111c34',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38bdf8',
    width: 280,
  },
  cardEmoji: { fontSize: 40, marginBottom: 8 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: '#94a3b8', fontSize: 12, textAlign: 'center', marginTop: 4 },
});
```

---

## 3. Optimasi Rendering FlatList untuk Data Raksasa (>1.000 Item)

`<ScrollView>` merender seluruh elemen sekaligus ke dalam memori, sehingga aplikasi akan crash jika menampilkan ribuan data. Sebaliknya, `<FlatList>` hanya merender item yang sedang tampak di layar (*virtualization*).

Untuk performa scrolling sehalus mentega (*butter-smooth*), terapkan 5 konfigurasi wajib berikut:

```jsx
<FlatList
  data={dataRibuan}
  keyExtractor={(item) => item.id}
  renderItem={renderItemMemoized}
  
  // 1. Tentukan ukuran tinggi statis agar engine tidak menghitung ulang tata letak
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}

  // 2. Batasi jumlah item pertama yang dimuat saat aplikasi boot
  initialNumToRender={10}

  // 3. Batasi berapa item yang diproses per batch rendering saat scrolling
  maxToRenderPerBatch={10}

  // 4. Kurangi jangkauan viewport render luar layar (default 21 layar -> perkecil jadi 5)
  windowSize={5}

  // 5. Hapus elemen di luar layar dari pohon rendering native untuk menghemat RAM
  removeClippedSubviews={true}
/>
```

---

## 4. Checklist Evaluasi Performa
- [ ] Semua animasi tombol dan transisi kartu wajib menyertakan `useNativeDriver: true`.
- [ ] Komponen baris di dalam `renderItem` dibungkus dengan `React.memo` untuk mencegah re-render yang tidak perlu.
- [ ] Hindari mendeklarasikan fungsi anonim inline (`renderItem={() => <View />}`) di dalam JSX FlatList; selalu deklarasikan di luar JSX.
- [ ] Aktifkan monitor performa FPS di Expo Go dengan menggoyangkan smartphone dan memilih *"Show Perf Monitor"*.
