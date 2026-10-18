# Pertemuan 12 — Fitur Native Perangkat (Kamera, Lokasi & Notifikasi)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Native & Build (Pertemuan 12 dari 16)
> **CPMK4:** Mahasiswa mampu mengakses fitur perangkat keras native smartphone (Kamera, Sensor GPS Lokasi, dan Push Notification).
> **Output Praktikum:** Aplikasi pelacak lokasi presisi dengan fitur jepret foto bukti laporan (Evidence Camera App).

%%IMG:rn-native-hardware%%

---

## 1. Filosofi Izin Akses Runtime (*Runtime Permissions*)

Sistem operasi mobile modern (Android 13+ dan iOS 17+) menerapkan keamanan ketat:
- Aplikasi **tidak boleh** mengakses sensor sensitif tanpa meminta izin tertulis dari pengguna secara eksplisit saat runtime.
- Jika pengguna menolak (*denied*), aplikasi tidak boleh crash, melainkan harus memberikan antarmuka alternatif yang ramah.

---

## 2. Akses Kamera & Galeri Foto (`expo-image-picker`)

Instalasi pustaka resmi:
```bash
npx expo install expo-image-picker
```

Contoh Implementasi Pemilihan Foto dari Galeri:
```javascript
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, Image, View } from 'react-native';

export default function PhotoUploader() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    // 1. Minta Izin
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Izin galeri diperlukan untuk memilih foto!");
      return;
    }

    // 2. Buka Pemilih Berkas Native
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={{ alignItems: 'center', padding: 20 }}>
      <Button title="Pilih Foto dari Galeri" onPress={pickImage} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 240, height: 180, borderRadius: 12, marginTop: 16 }}
        />
      )}
    </View>
  );
}
```

---

## 3. Akses Sensor Lokasi & GPS Presisi (`expo-location`)

Instalasi:
```bash
npx expo install expo-location
```

Mengambil Koordinat Latitude & Longitude Pengguna:
```javascript
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function GpsTracker() {
  const [coords, setCoords] = useState(null);
  const [statusMsg, setStatusMsg] = useState('Mencari sinyal GPS...');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setStatusMsg('Izin akses lokasi ditolak oleh pengguna');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCoords(location.coords);
      setStatusMsg('Lokasi berhasil didapatkan!');
    })();
  }, []);

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontWeight: 'bold' }}>Status GPS: {statusMsg}</Text>
      {coords && (
        <View style={{ marginTop: 12 }}>
          <Text>Latitude: {coords.latitude}</Text>
          <Text>Longitude: {coords.longitude}</Text>
          <Text>Akurasi: ±{coords.accuracy.toFixed(1)} meter</Text>
        </View>
      )}
    </View>
  );
}
```
