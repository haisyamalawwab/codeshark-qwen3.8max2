# Pertemuan 6 — Integrasi REST API & Offline Storage (AsyncStorage)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Navigasi & API (Pertemuan 6 dari 16)
> **CPMK3:** Mahasiswa mampu mengonsumsi data dari REST API eksternal dan menyimpan data lokal secara persisten menggunakan AsyncStorage dengan strategi offline-first.
> **Output Praktikum:** Aplikasi Berita / Katalog Produk yang dapat bekerja secara offline berkat caching data lokal dengan indikator sinkronisasi.

%%IMG:rn-data-flow%%

---

## 1. Arsitektur Komunikasi Mobile: REST API & Lifecycle Asinkron

Aplikasi mobile modern berinteraksi dengan server backend melalui protokol HTTP/HTTPS dengan format pertukaran data JSON (*JavaScript Object Notation*).

Di React Native, runtime JavaScript menyediakan Web Standard API `fetch()` serta mendukung pustaka populer `axios`.

### Tiga Keadaan Wajib (*Tri-State UI Lifecycle*):
Saat mengambil data jaringan di perangkat seluler, kondisi sinyal pengguna tidak menentu (3G/4G/5G, subway, mode pesawat, atau kuota habis). Aplikasi profesional **wajib** menangani 3 state berikut:

1. **Loading State (`loading = true`)**: Tampilkan `ActivityIndicator` atau *skeleton shimmer*, hindari layar kosong hitam/putih.
2. **Success State (`data = [...]`)**: Tampilkan data ke `<FlatList>` secara efisien.
3. **Error State (`error = string | null`)**: Tampilkan pesan ramah pengguna dan tombol **Coba Lagi (Retry)**.

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

export default function ArticleFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=15');
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const json = await response.json();
      setArticles(json);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memuat data berita.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.subText}>Mengambil data dari server...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errText}>⚠️ {errorMsg}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchArticles}>
          <Text style={styles.retryText}>Muat Ulang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  subText: { marginTop: 10, color: '#94a3b8', fontSize: 13 },
  errText: { color: '#f43f5e', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  retryBtn: { backgroundColor: '#0284c7', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#ffffff', fontWeight: 'bold' },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 12 },
  title: { color: '#38bdf8', fontSize: 15, fontWeight: 'bold', marginBottom: 6, textTransform: 'capitalize' },
  body: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
});
```

---

## 2. Penyimpanan Lokal Persisten: `@react-native-async-storage/async-storage`

State React yang disimpan dengan `useState` hanya bertahan di dalam RAM (*volatile memory*). Jika aplikasi di-minimize dan dimatikan oleh sistem operasi Android/iOS untuk menghemat daya, seluruh state akan lenyap.

**AsyncStorage** adalah sistem penyimpanan key-value asinkron yang tidak terenkripsi, persisten, dan global untuk seluruh aplikasi mobile Anda:
- Pada **Android**: Didukung oleh SQLite lokal atau RocksDB bawaan OS.
- Pada **iOS**: Menggunakan native file storage atau serialisasi dictionary.

### Instalasi Resmi Expo:
```bash
npx expo install @react-native-async-storage/async-storage
```

### Operasi Inti CRUD:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. CREATE & UPDATE (Simpan Data — Wajib string / JSON.stringify)
export const saveUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem('@app_user_session', jsonValue);
  } catch (e) {
    console.error('Gagal menyimpan sesi ke AsyncStorage', e);
  }
};

// 2. READ (Baca Data — Parse kembali ke Objek JavaScript)
export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@app_user_session');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Gagal membaca sesi', e);
    return null;
  }
};

// 3. DELETE (Hapus Kunci Tertentu saat Logout)
export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem('@app_user_session');
  } catch (e) {
    console.error('Gagal menghapus sesi', e);
  }
};
```

> 💡 **Best Practice Penamaan Kunci:** Gunakan awalan simbol `@` dan nama aplikasi untuk mencegah tabrakan nama, contoh: `@mycampus_auth_token` atau `@mycampus_cart_items`.

---

## 3. Pola Strategi Cache-Then-Network (*Offline-First*)

Aplikasi mobile kelas dunia (seperti WhatsApp, Instagram, dan Twitter) tidak membiarkan pengguna melihat layar kosong saat membuka aplikasi di tempat tanpa sinyal.

Mekanisme **Cache-Then-Network**:
1. Saat komponen dimount, langsung baca data yang ada di `AsyncStorage` dan render seketika (*instant visual feedback*).
2. Di saat yang sama (secara paralel di background), jalankan request `fetch()` ke internet.
3. Begitu data jaringan yang lebih baru tiba, update UI dan perbarui cache `AsyncStorage`.
4. Jika fetch gagal (karena offline), pengguna tetap dapat membaca konten tanpa hambatan!

```javascript
const loadArticlesWithCache = async () => {
  // Langkah 1: Baca cache lokal
  const cachedData = await AsyncStorage.getItem('@cache_articles');
  if (cachedData) {
    setArticles(JSON.parse(cachedData));
    setLoading(false); // Pengguna langsung melihat data tanpa menunggu internet!
  }

  // Langkah 2: Ambil data segar dari server
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=15');
    if (res.ok) {
      const freshData = await res.json();
      setArticles(freshData);
      // Langkah 3: Perbarui cache
      await AsyncStorage.setItem('@cache_articles', JSON.stringify(freshData));
    }
  } catch (networkError) {
    console.log('Mode offline aktif: menyajikan data dari cache lokal.');
  } finally {
    setLoading(false);
  }
};
```

---

## 4. Virtualisasi List: Mengapa `<FlatList>` Wajib Dipakai?

> ⚠️ **Hukum Mutlak Performa Mobile:** Jangan pernah menggabungkan `<ScrollView>` dengan perulangan array `.map()` untuk daftar data panjang!

Perbandingan teknis:
| Fitur | `<ScrollView> + map()` | `<FlatList>` |
| :--- | :--- | :--- |
| **Pola Rendering** | Merender SEMUA elemen sekaligus sejak awal. | Hanya merender item yang muat di layar HP (*Windowing*). |
| **Konsumsi RAM** | Melonjak drastis hingga 500MB+ jika ada 1.000 item. | Tetap stabil dan konstan (±30MB - 50MB). |
| **Frame Drop (FPS)** | Lagging dan sering force-close / OOM Crash. | Sangat mulus (60–120 FPS). |
| **Fitur Bawaan** | Kosong (harus rakit sendiri). | `refreshing` (tarik ke bawah untuk refresh), `onEndReached` (*infinite scroll*), `ListEmptyComponent`. |
