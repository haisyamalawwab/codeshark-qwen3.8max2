# Pertemuan 5 — Navigasi Multi-Screen (React Navigation)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Navigasi & API (Pertemuan 5 dari 16)
> **CPMK3:** Mahasiswa mampu mengimplementasikan sistem navigasi multi-screen menggunakan React Navigation (Native Stack & Bottom Tabs).
> **Output Praktikum:** Aplikasi Multi-Screen fungsional dengan Stack Navigator dan Bottom Tab Navigator.

%%IMG:rn-navigation%%

---

## 1. Arsitektur Navigasi Aplikasi Mobile

Berbeda dengan aplikasi Web yang mengandalkan URL pada bilah peramban (`window.location`), aplikasi mobile mengelola layar menggunakan struktur data **Tumpukan (Stack)**:

- **Push (Maju ke Layar Baru)**: Layar baru ditaruh di atas layar sebelumnya dengan animasi geser (*slide*).
- **Pop / Go Back (Kembali)**: Layar paling atas dicopot, mengungkap layar sebelumnya tanpa memuat ulang data.
- **Hardware Back Button (Android)**: React Navigation otomatis mengikat tombol *back* fisik Android sehingga pengguna dapat kembali dengan mulus.

---

## 2. Instalasi Paket React Navigation di Expo

Jalankan perintah instalasi pustaka inti dan dependensi native pendukungnya:

```bash
npx expo install @react-navigation/native react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native-stack @react-navigation/bottom-tabs
```

---

## 3. Struktur Hierarki Navigasi Komprehensif

Dalam aplikasi produksi, kita biasanya menggabungkan **Stack Navigator** dan **Bottom Tab Navigator**:

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Layar Beranda (Home)
function HomeScreen({ navigation }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>🏠 Layar Beranda</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Detail', { itemId: 42, title: 'Produk Unggulan' })}
      >
        <Text style={styles.btnText}>Buka Detail Produk →</Text>
      </TouchableOpacity>
    </View>
  );
}

// 2. Layar Profil
function ProfileScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>👤 Layar Profil Mahasiswa</Text>
    </View>
  );
}

// 3. Layar Detail (Stack Screen dengan Parameter)
function DetailScreen({ route, navigation }) {
  const { itemId, title } = route.params;

  return (
    <View style={styles.center}>
      <Text style={styles.title}>📦 {title}</Text>
      <Text style={styles.desc}>ID Produk yang diterima: #{itemId}</Text>
      <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.goBack()}>
        <Text style={styles.btnOutlineText}>← Kembali ke Beranda</Text>
      </TouchableOpacity>
    </View>
  );
}

// 4. Tab Navigator Induk
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

// 5. Root Navigation Container
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detail Item' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#0a1628',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 16,
  },
  desc: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnOutlineText: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
});
```

---

## 4. Pertanyaan Uji Paham
> 💡 **Cek Paham:** Bagaimana cara membaca data yang dikirimkan saat `navigation.navigate('Detail', { id: 10 })`?
> Di layar tujuan, ambil lewat `route.params.id`.
