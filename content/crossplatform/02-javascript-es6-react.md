# Pertemuan 2 — JavaScript Modern (ES6+) & Pondasi React

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Dasar & Setup (Pertemuan 2 dari 16)
> **CPMK1:** Mahasiswa memahami sintaks modern JavaScript ES6+ dan paradigma komponen fungsional React.
> **Output Praktikum:** Aplikasi mini modular dengan komponen reusable dan passing props dinamis.

%%IMG:rn-react-foundation%%

---

## 1. Fitur Kunci JavaScript ES6+ untuk Mobile

Sebelum membangun UI di React Native, pengembang wajib menguasai 5 sintaks kunci ES6+:

### A. Arrow Functions & Implicit Return
Fungsi ringkas yang mempertahankan konteks lexical `this`:

```javascript
// Standar lama
function salam(nama) {
  return "Halo, " + nama;
}

// ES6 Arrow Function
const salam = (nama) => `Halo, ${nama}!`;
```

### B. Destructuring Assignment (Objek & Array)
Mengekstrak nilai properti dari props atau state secara instan:

```javascript
const user = { nama: "Raka", prodi: "Teknik Informatika", semester: 5 };
const { nama, semester } = user; // ekstraksi langsung
```

### C. Spread & Rest Operator (`...`)
Menggabungkan state tanpa memutasi (*immutability*):

```javascript
const listAwal = ["HTML", "CSS"];
const listBaru = [...listAwal, "React Native", "Expo"];
```

### D. Array Methods (`map`, `filter`, `reduce`)
Di React Native, perulangan UI tidak menggunakan `for` loop tradisional, melainkan `.map()`:

```javascript
const menuItems = ["Beranda", "Profil", "Pengaturan"];

return (
  <View>
    {menuItems.map((item, index) => (
      <Text key={index}>{item}</Text>
    ))}
  </View>
);
```

---

## 2. Komponen Fungsional & Props di React Native

Di React Native, semua tampilan dibangun dari **komponen**. Komponen menerima input data yang disebut **props** (*properties*) dan mengembalikan elemen visual JSX.

### Sifat Utama Props:
- **Read-Only (Immutable)**: Komponen anak tidak boleh mengubah props yang diterimanya dari induk.
- **Data Flow Searah (Top-Down)**: Data mengalir dari komponen induk (*parent*) ke komponen anak (*child*).

---

## 3. Implementasi Komponen Reusable

Berkas `components/MahasiswaCard.js`:

```jsx
import { StyleSheet, Text, View } from 'react-native';

export default function MahasiswaCard({ nama, nim, ipk, aktif = true }) {
  return (
    <View style={[styles.card, !aktif && styles.cardNonaktif]}>
      <View style={styles.header}>
        <Text style={styles.nama}>{nama}</Text>
        <Text style={styles.status}>{aktif ? '🟢 Aktif' : '🔴 Cuti'}</Text>
      </View>
      <Text style={styles.info}>NIM: {nim}</Text>
      <Text style={styles.info}>IPK Semester: {ipk.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardNonaktif: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nama: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
  },
  info: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
});
```

---

## 4. Evaluasi Mandiri
> ⚠️ **Perhatian Mutasi:** Jangan pernah melakukan `props.nama = "Baru"` di dalam komponen anak. Jika data perlu berubah, gunakan **State** yang akan kita pelajari di Pertemuan 4.
