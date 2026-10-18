# Pertemuan 9 — Context API & Global State Management

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Global & Backend (Pertemuan 9 dari 16)
> **CPMK3:** Mahasiswa mampu mengimplementasikan manajemen state global dengan Context API untuk mencegah prop drilling.
> **Output Praktikum:** Aplikasi dengan fitur Dark/Light Theme Switcher global & Global Shopping Cart.

%%IMG:rn-context-global%%

---

## 1. Masalah "Prop Drilling" dan Solusi Context API

Pada aplikasi berskala menengah ke atas, seringkali data harus diakses oleh banyak komponen yang berada di cabang pohon (*component tree*) yang berjauhan (contoh: status login user, tema gelap/terang, bahasa, keranjang belanja).

Jika hanya mengandalkan props biasa, kita terpaksa meneruskan data melewati puluhan komponen perantara yang sebenarnya tidak membutuhkan data tersebut. Masalah ini disebut **Prop Drilling**.

**React Context API** memecahkan masalah ini dengan menyediakan saluran data global (*teleportasi state*) langsung dari Provider induk ke Consumer mana pun tanpa perantara.

---

## 2. Pola Implementasi Tiga Serangkai Context

1. **`createContext`**: Membuat wadah penampung data.
2. **`Provider`**: Komponen pembungkus di level root yang membagikan nilai state.
3. **`useContext` Hook**: Hook kustom untuk membaca dan memanipulasi state dari komponen anak mana pun.

### Implementasi Context 1: `context/ThemeContext.js`
```jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = {
    isDark,
    bg: isDark ? '#0a1628' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#0f172a',
    accent: '#38bdf8',
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook untuk kemudahan akses
export const useTheme = () => useContext(ThemeContext);
```

---

## 3. Implementasi State Global Kompleks: `context/CartContext.js`

Selain state primitif boolean (tema), Context API sangat ideal untuk mengelola struktur data array seperti keranjang belanja (*Shopping Cart*):

```jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Tambah item ke keranjang belanja
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  // Kurang / Hapus item
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Hitung total harga barang
  const totalBelanja = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, totalBelanja, totalItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

---

## 4. Membungkus Root App dengan Multi-Provider

Agar Context dapat diakses di mana saja, bungkus `<App />` di berkas utama:

```jsx
// App.js
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import MainNavigator from './navigation/MainNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <MainNavigator />
      </CartProvider>
    </ThemeProvider>
  );
}
```

---

## 5. Mengonsumsi Context di Komponen Anak

```jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function CatalogItem({ product }) {
  const { theme } = useTheme();
  const { addToCart } = useCart();

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>{product.name}</Text>
      <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
      
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => addToCart(product)}
      >
        <Text style={styles.buyText}>+ Masukkan Keranjang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 14, marginVertical: 8, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#38bdf8', fontSize: 14, fontWeight: '700', marginVertical: 6 },
  buyButton: { backgroundColor: '#0284c7', padding: 10, borderRadius: 10, alignItems: 'center' },
  buyText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
});
```

---

## 6. Tips Performa & Best Practices
> 💡 **Kiat Optimasi:** Jangan memasukkan state yang berubah setiap milidetik (misalnya koordinat sensor akselerometer atau posisi drag gesture) ke dalam root Context, karena akan memicu re-render ke seluruh cabang komponen di bawahnya. Untuk data frekuensi sangat tinggi, gunakan referensi lokal (`useRef`) atau modul animasi native.
