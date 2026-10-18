# Pertemuan 6 — Integrasi REST API & Offline Storage (AsyncStorage)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Navigasi & API (Pertemuan 6 dari 16)
> **CPMK3:** Mahasiswa mampu mengonsumsi data dari REST API eksternal dan menyimpan data lokal secara persisten menggunakan AsyncStorage.
> **Output Praktikum:** Aplikasi Berita / Katalog Produk yang dapat bekerja secara offline berkat caching data lokal.

%%IMG:rn-data-flow%%

---

## 1. Menghubungkan Aplikasi Mobile ke REST API

Aplikasi modern membutuhkan data dinamis dari internet. Di React Native, kita dapat menggunakan fungsi bawaan `fetch()` atau pustaka `axios`.

### Pola Standar Pengambilan Data Asinkron:
1. State loading awal bernilai `true`.
2. Lakukan request HTTP (`GET`, `POST`, dll) di dalam `useEffect`.
3. Setelah respons diterima dan diubah ke format JSON, simpan data ke state dan set loading ke `false`.
4. Jika koneksi terputus, tangkap error di blok `catch`.

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

const loadData = async () => {
  try {
    setLoading(true);
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
    const json = await res.json();
    setData(json);
    // Simpan ke offline cache
    await AsyncStorage.setItem('CACHE_POSTS', JSON.stringify(json));
  } catch (err) {
    console.warn("Gagal fetch online, membaca dari cache offline...");
    const cached = await AsyncStorage.getItem('CACHE_POSTS');
    if (cached) setData(JSON.parse(cached));
  } finally {
    setLoading(false);
  }
};
```

---

## 2. Penyimpanan Lokal Persisten: `@react-native-async-storage/async-storage`

State React akan hilang begitu aplikasi ditutup oleh pengguna. Untuk mempertahankan data (misalnya: token login, keranjang belanja, tema dark mode, data offline), kita menggunakan **AsyncStorage**.

### Instalasi:
```bash
npx expo install @react-native-async-storage/async-storage
```

### Operasi Dasar CRUD AsyncStorage:
- **Simpan Data**:
  ```javascript
  await AsyncStorage.setItem('NAMA_KUNCI', JSON.stringify(nilai));
  ```
- **Baca Data**:
  ```javascript
  const raw = await AsyncStorage.getItem('NAMA_KUNCI');
  const nilai = raw ? JSON.parse(raw) : null;
  ```
- **Hapus Data**:
  ```javascript
  await AsyncStorage.removeItem('NAMA_KUNCI');
  ```

---

## 3. Komponen `<FlatList>` untuk Performa Rendering Tinggi

> ⚠️ **Peringatan Performa:** Jangan pernah menggunakan `<ScrollView>` + `.map()` untuk menampilkan ratusan atau ribuan data! Gunakan `<FlatList>` karena ia melakukan **virtualisasi memori** (hanya merender item yang sedang tampak di layar).

```jsx
<FlatList
  data={data}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </View>
  )}
  refreshing={loading}
  onRefresh={loadData}
/>
```
