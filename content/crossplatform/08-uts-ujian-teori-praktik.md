# Pertemuan 8 — Ujian Tengah Semester (UTS)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Evaluasi Tengah Semester
> **Bobot Penilaian:** 20% dari Total Nilai Akhir Semester (10% Teori + 10% Praktik Live Coding)
> **Waktu Pengerjaan:** 100 Menit (2 SKS Teori & Praktik Terpadu)

%%IMG:rn-uts-matrix%%

---

## 1. Komponen Ujian Teori (Bobot: 10%)

Mahasiswa diuji mengenai pemahaman mendalam tentang konsep arsitektur aplikasi mobile lintas platform:

### Soal 1: Perbandingan Arsitektur Native vs Hybrid vs Cross-Platform
- **Pertanyaan:** Jelaskan perbedaan mendasar antara aplikasi Native murni (Kotlin/Swift), Hybrid Webview (Cordova/Capacitor), dan Cross-Platform (React Native). Mengapa React Native menawarkan performa yang lebih mendekati native dibanding WebView?
- **Kunci Jawaban:** Hybrid membungkus HTML/CSS/JS dalam browser mini (WebView) yang memiliki batas FPS dan overhead rendering DOM. Sebaliknya, React Native menggunakan arsitektur bridge/JSI di mana kode JavaScript mengontrol komponen UI asli platform (seperti `ViewGroup` di Android dan `UIView` di iOS) sehingga rendering berjalan langsung di layer native 60–120 FPS.

### Soal 2: Mesin JavaScript Hermes & Arsitektur JSI C++
- **Pertanyaan:** Apa keunggulan mesin JavaScript Hermes yang menjadi standar default di Expo/React Native modern dibanding mesin JavaScriptCore konvensional?
- **Kunci Jawaban:** Hermes melakukan Bytecode Precompilation saat waktu build (*AOT Compilation*), mengurangi waktu peluncuran awal aplikasi (*Time to Interactive*), menghemat konsumsi memori RAM, dan menggunakan JSI (*JavaScript Interface*) untuk pemanggilan C++ secara sinkron tanpa serialisasi string JSON.

### Soal 3: Tata Letak Flexbox Mobile vs Web
- **Pertanyaan:** Mengapa properti default `flexDirection` pada React Native bernilai `'column'`, berbeda dengan CSS web yang bernilai `'row'`?
- **Kunci Jawaban:** Karena rasio layar smartphone secara vertikal memanjang ke bawah (orientasi portrait). Konten mobile secara alami disusun berjejer dari atas ke bawah untuk kenyamanan scrolling satu tangan.

### Soal 4: Props vs State vs AsyncStorage
- **Pertanyaan:** Buatlah tabel perbandingan antara Props, State Lokal, dan AsyncStorage dari segi: sifat mutasi, cakupan (*scope*), dan persistensi data saat aplikasi ditutup!
- **Kunci Jawaban:**
  | Parameter | Props | State Lokal | AsyncStorage |
  |---|---|---|---|
  | **Mutabilitas** | Read-only (Immutable) | Dapat diubah via setState | Read / Write via API asinkron |
  | **Cakupan** | Diwariskan dari Parent | Terisolasi di komponen | Global di seluruh aplikasi |
  | **Persistensi** | Hilang saat re-render parent | Hilang saat app ditutup | Permanen di memori fisik HP |

### Soal 5: Siklus Hidup `useEffect` & Pencegahan Memory Leak
- **Pertanyaan:** Mengapa kita harus menyediakan fungsi pembersih (*cleanup function*) pada `useEffect` yang berlangganan event listener, sensor, atau timer?
- **Kunci Jawaban:** Jika komponen dilepas (*unmount*) tanpa membersihkan listener atau interval, proses tersebut akan terus berjalan di latar belakang memori JavaScript (*memory leak*), menyebabkan konsumsi baterai boros dan crash saat mencoba memperbarui state pada komponen yang sudah tidak ada di layar.

---

## 2. Komponen Ujian Praktik Live Coding (Bobot: 10%)

### Soal Studi Kasus: "Pencatatan Keuangan Saku Mahasiswa"
Buatlah aplikasi mobile satu layar (*single screen*) yang dapat:
1. Memiliki form input: Nama Pengeluaran (Teks), Nominal Uang (Angka).
2. Memilih tipe transaksi via tombol: Pengeluaran 🔴 vs Pemasukan 🟢.
3. Menampilkan daftar riwayat transaksi menggunakan `<FlatList>` dengan format mata uang Rupiah (`Rp xxx.xxx`).
4. Menghitung total saldo saat ini secara real-time di kartu ringkasan atas.
5. Menyimpan dan memuat data transaksi dari `AsyncStorage`.
6. Menghapus transaksi yang dipilih dengan konfirmasi.

### Solusi Referensi Live Coding (UTS Ready)

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
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@uts_keuangan_v1';

export default function UtsKeuanganApp() {
  const [transaksi, setTransaksi] = useState([]);
  const [judul, setJudul] = useState('');
  const [nominal, setNominal] = useState('');
  const [tipe, setTipe] = useState('keluar'); // 'keluar' | 'masuk'

  // 1. Muat data saat aplikasi dibuka
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setTransaksi(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // 2. Simpan setiap ada perubahan transaksi
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transaksi));
  }, [transaksi]);

  // Tambah Transaksi
  const handleSimpan = () => {
    const angka = parseFloat(nominal);
    if (!judul.trim() || isNaN(angka) || angka <= 0) {
      Alert.alert('Error', 'Mohon isi nama pengeluaran dan nominal uang yang valid!');
      return;
    }

    const itemBaru = {
      id: Date.now().toString(),
      judul: judul.trim(),
      nominal: angka,
      tipe: tipe,
      tanggal: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setTransaksi([itemBaru, ...transaksi]);
    setJudul('');
    setNominal('');
  };

  // Hapus Transaksi
  const handleHapus = (id) => {
    setTransaksi(transaksi.filter((t) => t.id !== id));
  };

  // Kalkulasi Saldo
  const totalPemasukan = transaksi
    .filter((t) => t.tipe === 'masuk')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalPengeluaran = transaksi
    .filter((t) => t.tipe === 'keluar')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Kartu Saldo */}
      <View style={styles.saldoCard}>
        <Text style={styles.saldoLabel}>Total Saldo Mahasiswa</Text>
        <Text style={[styles.saldoValue, saldoAkhir < 0 && styles.saldoMinus]}>
          {formatRupiah(saldoAkhir)}
        </Text>
        <View style={styles.ringkasanRow}>
          <Text style={styles.masukLabel}>Masuk: +{formatRupiah(totalPemasukan)}</Text>
          <Text style={styles.keluarLabel}>Keluar: -{formatRupiah(totalPengeluaran)}</Text>
        </View>
      </View>

      {/* Form Input */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nama transaksi (misal: Makan Siang)"
          placeholderTextColor="#64748b"
          value={judul}
          onChangeText={setJudul}
        />
        <TextInput
          style={styles.input}
          placeholder="Nominal uang (Rp)"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={nominal}
          onChangeText={setNominal}
        />

        {/* Pilihan Tipe Transaksi */}
        <View style={styles.tipeRow}>
          <TouchableOpacity
            onPress={() => setTipe('keluar')}
            style={[styles.tipeBtn, tipe === 'keluar' && styles.tipeBtnKeluar]}
          >
            <Text style={[styles.tipeBtnText, tipe === 'keluar' && styles.tipeBtnTextActive]}>
              🔴 Pengeluaran
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTipe('masuk')}
            style={[styles.tipeBtn, tipe === 'masuk' && styles.tipeBtnMasuk]}
          >
            <Text style={[styles.tipeBtnText, tipe === 'masuk' && styles.tipeBtnTextActive]}>
              🟢 Pemasukan
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnSimpan} onPress={handleSimpan}>
          <Text style={styles.btnSimpanText}>+ Simpan Transaksi</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar Transaksi */}
      <FlatList
        data={transaksi}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listArea}
        ListEmptyComponent={
          <Text style={styles.kosongText}>Belum ada catatan transaksi 📋</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemJudul}>{item.judul}</Text>
              <Text style={styles.itemTanggal}>{item.tanggal}</Text>
            </View>
            <View style={styles.itemKanan}>
              <Text
                style={[
                  styles.itemNominal,
                  item.tipe === 'masuk' ? styles.nomMasuk : styles.nomKeluar,
                ]}
              >
                {item.tipe === 'masuk' ? '+' : '-'} {formatRupiah(item.nominal)}
              </Text>
              <TouchableOpacity onPress={() => handleHapus(item.id)}>
                <Text style={styles.btnHapusIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a101f' },
  saldoCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#111c34',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e2d4d',
    alignItems: 'center',
  },
  saldoLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  saldoValue: { color: '#38bdf8', fontSize: 28, fontWeight: '900', marginVertical: 6 },
  saldoMinus: { color: '#f43f5e' },
  ringkasanRow: { flexDirection: 'row', gap: 16, marginTop: 4 },
  masukLabel: { color: '#34d399', fontSize: 11, fontWeight: '700' },
  keluarLabel: { color: '#f87171', fontSize: 11, fontWeight: '700' },
  formContainer: { paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  input: {
    backgroundColor: '#15223c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2f52',
    fontSize: 13,
  },
  tipeRow: { flexDirection: 'row', gap: 10 },
  tipeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#15223c',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e2f52',
  },
  tipeBtnKeluar: { backgroundColor: '#881337', borderColor: '#f43f5e' },
  tipeBtnMasuk: { backgroundColor: '#064e3b', borderColor: '#34d399' },
  tipeBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  tipeBtnTextActive: { color: '#ffffff' },
  btnSimpan: {
    backgroundColor: '#0284c7',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSimpanText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  listArea: { paddingHorizontal: 16, paddingBottom: 40 },
  kosongText: { color: '#64748b', textAlign: 'center', marginTop: 40, fontStyle: 'italic' },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111c34',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e2d4d',
  },
  itemJudul: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold' },
  itemTanggal: { color: '#64748b', fontSize: 11, marginTop: 2 },
  itemKanan: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemNominal: { fontSize: 14, fontWeight: '800' },
  nomMasuk: { color: '#34d399' },
  nomKeluar: { color: '#f87171' },
  btnHapusIcon: { color: '#94a3b8', fontSize: 16, padding: 4 },
});
```

---

## 3. Rubrik Standar Penilaian UTS (Bobot 20%)

| Grade Nilai | Rentang Skor | Kriteria Kinerja Mahasiswa |
|---|---|---|
| **Nilai A (Puncak)** | 85 – 100 | Menjawab semua teori dengan tepat, kode live coding berjalan mulus, validasi input aktif, format mata uang rapi, data tersimpan di AsyncStorage, zero warning. |
| **Nilai B (Baik)** | 70 – 84 | Teori dipahami dengan baik, fitur live coding CRUD dan saldo berfungsi, UI standar, ada sedikit catatan minor pada gaya kode. |
| **Nilai C (Cukup)** | 55 – 69 | Teori terjawab sebagian, live coding hanya berjalan di memori tanpa penyimpanan AsyncStorage (data hilang saat reload). |
| **Nilai D / E (Gagal)** | < 55 | Terdapat crash runtime fatal atau tidak mengumpulkan hasil ujian. |
