# Pertemuan 7 — Mini Project 1 (Pra-UTS)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Navigasi & API (Pertemuan 7 dari 16)
> **Bobot Penilaian:** 15% dari Total Nilai Akhir Semester (Mini Project 1)
> **Target:** Membangun aplikasi utuh (Todo List interaktif atau Weather App) yang menggabungkan seluruh materi Pertemuan 1 s.d. 6.

%%IMG:rn-project-checklist%%

---

## 1. Sasaran & Spesifikasi Teknis Proyek

Mini Project 1 adalah tonggak evaluasi tengah semester untuk membuktikan penguasaan komprehensif mahasiswa dalam memadukan:
1. **Desain Tata Letak Mobile (Flexbox)**: Desain responsif, proporsional, ramah jempol (*thumb-friendly*), dan konsisten di berbagai ukuran layar smartphone.
2. **State Management Lokal & Interaktivitas**: Operasi Tambah tugas, Hapus tugas, dan Tandai Selesai (*Toggle Complete*) berjalan instan tanpa lag.
3. **Penyimpanan Lokal Persisten (`AsyncStorage`)**: Seluruh data tersimpan otomatis di memori internal perangkat sehingga data tidak hilang saat aplikasi ditutup atau smartphone di-reboot.
4. **Navigasi Multi-Screen (React Navigation)**: Pemisahan halaman utama (Daftar Tugas) dan halaman Detail / Tambah Tugas menggunakan Stack Navigator.

---

## 2. Arsitektur Komponen & Alur Data

Struktur modul yang disarankan untuk Mini Project 1:

```text
my-mini-project/
├── App.js                   # NavigationContainer & Stack Setup
├── screens/
│   ├── HomeScreen.js        # FlatList tugas, Filter status, Header ringkasan
│   ├── AddTodoScreen.js     # Form input tugas baru dengan validasi
│   └── DetailScreen.js      # Informasi detail tugas & waktu pembuatan
├── components/
│   ├── TodoItem.js          # Kartu baris tugas dengan tombol checklist & hapus
│   └── FilterTabs.js        # Tab filter: Semua, Aktif, Selesai
└── utils/
    └── storage.js           # Helper fungsi simpan & muat AsyncStorage
```

---

## 3. Implementasi Kode Lengkap (Ready-to-Run)

### A. Helper Penyimpanan: `utils/storage.js`
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@my_todos_v1';

export const loadTodosFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Gagal memuat data dari AsyncStorage:', error);
    return [];
  }
};

export const saveTodosToStorage = async (todos) => {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Gagal menyimpan data ke AsyncStorage:', error);
  }
};
```

### B. Komponen Layar Utama: `screens/HomeScreen.js`
```jsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { loadTodosFromStorage, saveTodosToStorage } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'done'

  // 1. Muat data saat aplikasi pertama kali dibuka (Mount)
  useEffect(() => {
    (async () => {
      const data = await loadTodosFromStorage();
      setTodos(data);
    })();
  }, []);

  // 2. Simpan setiap kali state todos mengalami perubahan
  useEffect(() => {
    saveTodosToStorage(todos);
  }, [todos]);

  // Tambah item tugas baru
  const handleAddTodo = () => {
    if (!inputText.trim()) {
      Alert.alert('Peringatan', 'Judul tugas tidak boleh kosong!');
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date().toLocaleDateString('id-ID'),
    };
    setTodos([newEntry, ...todos]);
    setInputText('');
  };

  // Toggle status selesai
  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Hapus tugas dengan konfirmasi dialog
  const handleDeleteTodo = (id) => {
    Alert.alert('Hapus Tugas', 'Apakah kamu yakin ingin menghapus tugas ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => setTodos(todos.filter((t) => t.id !== id)),
      },
    ]);
  };

  // Filter daftar tugas
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Tugas Ku 📝</Text>
        <Text style={styles.headerSubtitle}>
          {todos.filter((t) => t.completed).length} dari {todos.length} selesai
        </Text>
      </View>

      {/* Input Form Bar */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Tulis rencana tugas baru..."
          placeholderTextColor="#64748b"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Filter */}
      <View style={styles.filterRow}>
        {['all', 'active', 'done'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setFilter(tab)}
            style={[styles.filterChip, filter === tab && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
              {tab === 'all' ? 'Semua' : tab === 'active' ? 'Aktif' : 'Selesai'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daftar Tugas dengan FlatList */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada tugas dalam kategori ini 🎉</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.checkArea}
              onPress={() => handleToggleTodo(item.id)}
            >
              <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                {item.completed && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text
                style={[styles.cardText, item.completed && styles.cardTextDone]}
                numberOfLines={2}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteTodo(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#091120' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#f8fafc' },
  headerSubtitle: { fontSize: 13, color: '#38bdf8', marginTop: 4, fontWeight: '600' },
  inputRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: '#131e32',
    color: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  addButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 18,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#131e32',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  filterChipActive: { backgroundColor: '#0369a1', borderColor: '#38bdf8' },
  filterText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#ffffff' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111c30',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  checkArea: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#38bdf8' },
  checkMark: { color: '#091120', fontSize: 12, fontWeight: '900' },
  cardText: { color: '#e2e8f0', fontSize: 14, flex: 1 },
  cardTextDone: { textDecorationLine: 'line-through', color: '#64748b' },
  deleteButton: { padding: 6 },
  deleteText: { fontSize: 16 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 13, fontStyle: 'italic' },
});
```

---

## 4. Rubrik & Indikator Penilaian Mini Project 1 (15%)

| Kriteria Penilaian | Bobot | Indikator Keberhasilan |
|---|---|---|
| **Fungsionalitas CRUD State** | 35% | Aplikasi dapat membuat tugas, membaca via FlatList, toggle status selesai, dan menghapus item tanpa runtime error. |
| **Persistensi Data (AsyncStorage)** | 25% | Data tersimpan aman di penyimpanan lokal smartphone dan termuat kembali saat aplikasi dibuka ulang. |
| **Desain UI/UX & Flexbox Mobile** | 25% | Penggunaan tata letak Flexbox rapi, kontras warna nyaman, tombol memiliki touch feedback, tidak tertabrak bilah status. |
| **Kebersihan Kode & Dokumentasi** | 15% | Kode modular, pemisahan folder jelas, tidak ada memory leak, dilengkapi berkas `README.md` dan video demo 2 menit. |

---

## 5. Checklist Verifikasi Sebelum Penyerahan
- [ ] Aplikasi berjalan tanpa crash di Expo Go Android & iOS.
- [ ] Fitur tambah item memiliki validasi input kosong (*empty input check*).
- [ ] Fitur hapus item memiliki dialog konfirmasi (*Alert.alert*).
- [ ] Repositori GitHub bersifat publik dengan petunjuk `README.md` yang lengkap.
