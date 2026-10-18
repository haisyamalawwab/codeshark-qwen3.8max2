# Pertemuan 12 — Fitur Native Perangkat (Kamera, Lokasi & Notifikasi)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Native & Build (Pertemuan 12 dari 16)
> **CPMK4:** Mahasiswa mampu mengakses fitur perangkat keras native smartphone (Kamera, Sensor GPS Lokasi, dan Local Notifications) dengan pengelolaan izin runtime modern.
> **Output Praktikum:** Aplikasi pelacak lokasi presisi dengan fitur jepret foto bukti laporan lapangan (*Evidence Camera App*) dan pengingat lokal.

%%IMG:rn-native-hardware%%

---

## 1. Filosofi Izin Akses Runtime (*Runtime Permissions*)

Sistem operasi mobile modern (Android 13+ dan iOS 17+) menerapkan arsitektur keamanan *Zero Trust*:
- Aplikasi **tidak boleh** mengakses sensor sensitif tanpa persetujuan eksplisit pengguna saat runtime.
- Izin tidak lagi diminta saat instalasi di Play Store, melainkan diminta secara *just-in-time* ketika fitur tersebut hendak digunakan.
- Jika pengguna menolak (*permission denied*), aplikasi tidak boleh *crash* atau *freeze*, melainkan harus menampilkan antarmuka alternatif (*fallback UI*) dan opsi membuka menu Settings OS.

---

## 2. Akses Kamera & Galeri Foto (`expo-image-picker`)

Modul `expo-image-picker` menyediakan antarmuka terpadu untuk membuka galeri foto ponsel (*Photo Library*) atau mengaktifkan kamera fisik (*Hardware Camera*).

### Instalasi:
```bash
npx expo install expo-image-picker
```

### Konfigurasi Izin di `app.json`:
Tambahkan pesan alasan izin pada plugin Expo:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Aplikasi memerlukan akses galeri untuk mengunggah foto profil.",
          "cameraPermission": "Aplikasi memerlukan akses kamera untuk mengambil bukti absensi."
        }
      ]
    ]
  }
}
```

### Implementasi Lengkap Pengambilan Foto:
```javascript
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EvidenceCamera() {
  const [photoUri, setPhotoUri] = useState(null);

  // 1. Ambil Foto Langsung dari Kamera
  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Akses kamera dibutuhkan untuk mengambil foto bukti.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // 2. Pilih dari Galeri
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Akses galeri dibutuhkan untuk memilih foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bukti Foto Lapangan</Text>

      <View style={styles.previewBox}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Belum ada foto yang dipilih</Text>
        )}
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnCamera} onPress={takePhotoWithCamera}>
          <Text style={styles.btnText}>📷 Buka Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGallery} onPress={pickFromGallery}>
          <Text style={styles.btnText}>🖼️ Dari Galeri</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f172a', alignItems: 'center' },
  header: { fontSize: 18, fontWeight: 'bold', color: '#38bdf8', marginBottom: 16 },
  previewBox: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: { width: '100%', height: '100%' },
  placeholderText: { color: '#64748b', fontSize: 13 },
  btnRow: { flexDirection: 'row', gap: 12 },
  btnCamera: { flex: 1, backgroundColor: '#0284c7', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnGallery: { flex: 1, backgroundColor: '#334155', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
```

---

## 3. Akses Sensor Lokasi & GPS Presisi (`expo-location`)

Modul `expo-location` memungkinkan pengambilan posisi geografis ponsel secara presisi melalui kombinasi satelit GPS, pemancar seluler, dan WiFi triangulasi.

### Instalasi:
```bash
npx expo install expo-location
```

### Implementasi Pengambilan Koordinat dan Reverse Geocoding (Alamat):
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function GpsWidget() {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Izin akses lokasi ditolak oleh pengguna.');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCoords(location.coords);

        // Reverse Geocoding: Mengubah Latitude & Longitude menjadi nama jalan & kota
        const reverse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverse.length > 0) {
          const item = reverse[0];
          setAddress(`${item.street || item.name || ''}, ${item.subregion || item.city || ''}, ${item.region || ''}`);
        }
      } catch (err) {
        setErrorMsg('Gagal mengunci sinyal GPS.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#38bdf8" />
        <Text style={styles.subText}>Mengunci koordinat satelit GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📍 Sensor Lokasi Perangkat</Text>
      {errorMsg ? (
        <Text style={styles.err}>{errorMsg}</Text>
      ) : (
        <View style={styles.infoBox}>
          <Text style={styles.info}>Latitude: <Text style={styles.val}>{coords?.latitude.toFixed(6)}</Text></Text>
          <Text style={styles.info}>Longitude: <Text style={styles.val}>{coords?.longitude.toFixed(6)}</Text></Text>
          <Text style={styles.info}>Akurasi: <Text style={styles.val}>±{coords?.accuracy.toFixed(1)} m</Text></Text>
          {address ? <Text style={styles.address}>🏠 {address}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 14, fontWeight: 'bold', color: '#38bdf8', marginBottom: 8 },
  subText: { color: '#94a3b8', fontSize: 12, marginTop: 6 },
  err: { color: '#f43f5e', fontSize: 12 },
  infoBox: { marginTop: 4, gap: 4 },
  info: { color: '#94a3b8', fontSize: 12 },
  val: { color: '#f8fafc', fontWeight: 'bold' },
  address: { color: '#34d399', fontSize: 11, marginTop: 6, fontStyle: 'italic' },
});
```

---

## 4. Notifikasi Lokal Terjadwal (`expo-notifications`)

Aplikasi mobile dapat mengirimkan pemberitahuan banner lokal ke pusat notifikasi OS tanpa memerlukan server backend push notification.

### Penjadwalan Notifikasi Lokal:
```javascript
import * as Notifications from 'expo-notifications';

export const scheduleLocalReminder = async (title, body, secondsDelay) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: 'default',
    },
    trigger: {
      seconds: secondsDelay,
    },
  });
};
```
