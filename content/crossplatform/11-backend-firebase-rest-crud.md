# Pertemuan 11 — Integrasi Backend & Cloud Database (CRUD)

> **Mata Kuliah:** Sistem Aplikasi Lintas Platform (React Native & Expo SDK) · **Fase:** Global & Backend (Pertemuan 11 dari 16)
> **CPMK3:** Mahasiswa mampu mengintegrasikan aplikasi mobile dengan basis data cloud (Firebase Firestore / RESTful API) untuk operasi CRUD lengkap.
> **Output Praktikum:** Aplikasi CRUD Cloud Real-Time dengan Sinkronisasi Data Multi-Device.

---

## 1. Arsitektur Backend untuk Aplikasi Mobile

Aplikasi mobile dapat terhubung ke server backend melalui dua pendekatan utama:
1. **RESTful API / GraphQL kustom**: Backend dibangun menggunakan Node.js (Express), Python (FastAPI), atau Go, dengan database SQL (PostgreSQL) atau NoSQL.
2. **Backend-as-a-Service (BaaS) seperti Firebase / Supabase**: Sangat populer di ekosistem mobile karena menyediakan autentikasi instan, basis data real-time, dan penyimpanan berkas tanpa harus mengelola server Linux sendiri.

---

## 2. Operasi CRUD di Cloud Firestore

### A. Konfigurasi Client
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSy...",
  projectId: "crossplatform-app",
  // ... kredensial proyek
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### B. Membuat Data Baru (Create)
```javascript
const tambahCatatan = async (judul, konten) => {
  await addDoc(collection(db, "notes"), {
    title: judul,
    body: konten,
    createdAt: new Date().toISOString()
  });
};
```

### C. Sinkronisasi Real-Time (Read / Listen)
Dengan `onSnapshot`, ketika data diubah oleh pengguna lain atau lewat browser, layar HP akan terbarui secara instan tanpa perlu refresh manual:

```javascript
useEffect(() => {
  const unsub = onSnapshot(collection(db, "notes"), (snapshot) => {
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotes(list);
  });
  return () => unsub(); // Hentikan listener saat unmount
}, []);
```

### D. Memperbarui (Update) & Menghapus (Delete)
```javascript
// Update
await updateDoc(doc(db, "notes", id), { title: "Judul Baru" });

// Delete
await deleteDoc(doc(db, "notes", id));
```
