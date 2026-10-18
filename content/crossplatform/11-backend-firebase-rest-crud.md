# Pertemuan 11 — Integrasi Backend & Cloud Database (CRUD)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Global & Backend (Pertemuan 11 dari 16)
> **CPMK3:** Mahasiswa mampu mengintegrasikan aplikasi mobile dengan REST API eksternal atau Cloud Database (Firebase / Supabase) untuk operasi CRUD penuh.
> **Output Praktikum:** Modul CRUD Produk / Mahasiswa yang tersinkronisasi real-time ke cloud server.

%%IMG:rn-crud-backend%%

---

## 1. Arsitektur Client-Server & Operasi CRUD

Aplikasi mobile modern tidak dapat berdiri sendiri; data harus disimpan di server cloud agar dapat diakses dari banyak perangkat secara sinkron:

- **Create (POST)**: Menambah rekaman data baru ke database server.
- **Read (GET)**: Mengambil daftar data atau detail entitas spesifik dari server.
- **Update (PUT / PATCH)**: Memperbarui kolom atau dokumen data yang sudah ada.
- **Delete (DELETE)**: Menghapus data dari server secara permanen.

### Prinsip Utama Integrasi Mobile Backend:
1. **Asynchronous Non-Blocking**: Semua pemanggilan jaringan harus menggunakan `async/await` agar antarmuka pengguna tidak pernah freeze (*UI thread non-blocking*).
2. **Indikator Status (Feedback UX)**: Wajib menyediakan visual loading (`ActivityIndicator`), visual kosong (*Empty State*), dan pesan error (*Toast/Alert*) jika koneksi internet terputus.
3. **Pull-to-Refresh**: Memungkinkan pengguna menarik layar ke bawah untuk menyegarkan data terbaru.

---

## 2. Abstraksi Layanan Jaringan: `services/apiService.js`

Mengumpulkan semua pemanggilan API ke satu berkas terpusat (*Service Layer Pattern*):

```javascript
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiService = {
  // 1. GET (Read All)
  async getPosts(limit = 10) {
    const res = await fetch(`${BASE_URL}/posts?_limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  },

  // 2. POST (Create)
  async createPost(title, body) {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 }),
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  },

  // 3. PUT (Update)
  async updatePost(id, title, body) {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 }),
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  },

  // 4. DELETE (Delete)
  async deletePost(id) {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return true;
  },
};
```

---

## 3. Implementasi Layar CRUD: `screens/PostListScreen.js`

```jsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { apiService } from '../services/apiService';

export default function PostListScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data awal dari server
  const fetchPosts = async () => {
    try {
      const data = await apiService.getPosts(8);
      setPosts(data);
    } catch (err) {
      Alert.alert('Gagal Mengambil Data', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // Tambah post baru
  const handleCreate = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Peringatan', 'Judul postingan tidak boleh kosong!');
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await apiService.createPost(newTitle.trim(), 'Konten post baru');
      // Optimistic update: masukkan langsung ke tampilan
      setPosts([created, ...posts]);
      setNewTitle('');
      Alert.alert('Sukses', 'Postingan baru berhasil ditambahkan ke Cloud! ☁️');
    } catch (err) {
      Alert.alert('Gagal Menyimpan', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hapus post
  const handleDelete = (id) => {
    Alert.alert('Hapus Post', 'Hapus data ini dari database?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiService.deletePost(id);
            setPosts(posts.filter((p) => p.id !== id));
          } catch (err) {
            Alert.alert('Gagal Hapus', err.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manajemen Cloud Post ☁️</Text>
        <Text style={styles.headerSub}>Sinkronisasi REST API Real-time</Text>
      </View>

      {/* Form Tambah */}
      <View style={styles.formRow}>
        <TextInput
          style={styles.input}
          placeholder="Judul postingan baru..."
          placeholderTextColor="#64748b"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TouchableOpacity
          style={[styles.btnTambah, isSubmitting && styles.btnDisabled]}
          onPress={handleCreate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.btnTambahText}>Kirim</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tampilan Konten */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Menghubungkan ke Cloud Server...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.postId}>#ID {item.id}</Text>
                <Text style={styles.postTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.btnHapus}
              >
                <Text style={styles.btnHapusText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#091120' },
  header: { padding: 18 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  headerSub: { fontSize: 12, color: '#38bdf8', marginTop: 2 },
  formRow: { flexDirection: 'row', paddingHorizontal: 18, gap: 10, marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: '#131e32',
    color: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  btnTambah: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnTambahText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', fontSize: 13, marginTop: 12 },
  list: { paddingHorizontal: 18, paddingBottom: 30 },
  card: {
    backgroundColor: '#111c30',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: { flex: 1, marginRight: 12 },
  postId: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  postTitle: { color: '#e2e8f0', fontSize: 13, fontWeight: '600', marginTop: 2 },
  btnHapus: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  btnHapusText: { color: '#f43f5e', fontSize: 11, fontWeight: 'bold' },
});
```

---

## 4. Checklist Kualitas CRUD Mobile
- [ ] Tersedia indikator loading visual (`ActivityIndicator`) saat menunggu respons jaringan.
- [ ] Fitur *Pull-to-Refresh* (`RefreshControl`) berfungsi lancar pada daftar `<FlatList>`.
- [ ] Tombol submit dinonaktifkan untuk mencegah klik ganda (*double request submission*).
- [ ] Dialog konfirmasi muncul sebelum operasi hapus permanen dieksekusi.
