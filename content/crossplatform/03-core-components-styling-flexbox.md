# Pertemuan 3 — Core Components & Styling (Flexbox Mobile)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** UI & State (Pertemuan 3 dari 16)
> **CPMK2:** Mahasiswa mampu membangun UI responsif menggunakan komponen native dan styling Flexbox.
> **Output Praktikum:** Halaman Profile Card & Dashboard Stats interaktif dengan tata letak Flexbox responsif.

%%IMG:rn-flexbox%%

---

## 1. Komponen Inti React Native vs Tag HTML Web

Di React Native, kita **tidak menggunakan** tag HTML seperti `<div>`, `<p>`, `<span>`, `<img>`, atau `<button>`. Sebagai gantinya, React Native menyediakan **Core Components** yang langsung dipetakan ke widget native:

| React Native Component | Padanan Web | Komponen Asli Android | Komponen Asli iOS |
|---|---|---|---|
| `<View>` | `<div>` | `android.view.ViewGroup` | `UIView` |
| `<Text>` | `<p>`, `<span>` | `android.widget.TextView` | `UITextView` |
| `<Image>` | `<img>` | `android.widget.ImageView` | `UIImageView` |
| `<ScrollView>` | `<div style="overflow:scroll">` | `android.widget.ScrollView` | `UIScrollView` |
| `<TextInput>` | `<input type="text">` | `android.widget.EditText` | `UITextField` |
| `<TouchableOpacity>` | `<button>` | `ViewGroup` + Alpha feedback | `UIControl` + Alpha feedback |

> ⚠️ **Aturan Emas Teks:** Semua string teks di React Native **wajib** dibungkus dalam tag `<Text>`. Menulis teks langsung di dalam `<View>` akan menyebabkan error fatal runtime: *"Invariant Violation: Text strings must be rendered within a <Text> component"*.

---

## 2. Flexbox di React Native: Perbedaan Kritis dengan CSS Web

Tata letak (*layout*) di React Native 100% menggunakan algoritma **Flexbox**, namun memiliki perbedaan penting dibanding Web CSS biasa:

1. **`flexDirection` default adalah `'column'`** (pada Web default adalah `'row'`). Hal ini karena orientasi layar smartphone umumnya tegak (*portrait*).
2. **Tidak ada satuan `px`, `em`, atau `rem`**. Semua angka dimensi (seperti `width: 100`, `padding: 16`) adalah **Density-independent Pixels (DP)** yang otomatis diskalakan dengan kerapatan layar HP.
3. Nilai `flex: 1` berarti elemen akan mengisi seluruh ruang kosong yang tersedia pada kontainer induknya.

### 4 Properti Utama Flexbox:
- **`flexDirection`**: `'column'` (vertikal) | `'row'` (horizontal).
- **`justifyContent`** (Sejajar dengan Main Axis): `'flex-start'` | `'center'` | `'flex-end'` | `'space-between'` | `'space-around'` | `'space-evenly'`.
- **`alignItems`** (Sejajar dengan Cross Axis): `'stretch'` | `'center'` | `'flex-start'` | `'flex-end'`.
- **`flexWrap`**: `'nowrap'` | `'wrap'`.

---

## 3. Praktikum: Halaman Profile Card Responsif

```jsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Kartu Profil Utama */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Clarissa Vanesa</Text>
        <Text style={styles.role}>Mobile Application Engineer</Text>

        {/* Baris Statistik (Horizontal Flex) */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>34</Text>
            <Text style={styles.statLabel}>Proyek</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>1.2k</Text>
            <Text style={styles.statLabel}>Pengikut</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>98%</Text>
            <Text style={styles.statLabel}>Akurasi</Text>
          </View>
        </View>

        {/* Tombol Interaktif */}
        <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
          <Text style={styles.btnText}>Ikuti Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#091322',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#112240',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#38bdf8',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  role: {
    fontSize: 13,
    color: '#38bdf8',
    marginTop: 4,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(148,163,184,0.2)',
  },
  btn: {
    width: '100%',
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
```
