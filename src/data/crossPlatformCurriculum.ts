/* ==========================================================================
   KURIKULUM SISTEM APLIKASI LINTAS PLATFORM (REACT NATIVE & EXPO)
   Semester 5 | 16 Pertemuan | 3 SKS (2 Teori + 1 Praktikum)
   Referensi Utama: docs.expo.dev & reactnative.dev/docs/environment-setup
   ========================================================================== */

export interface CrossPlatformMeeting {
  no: number;
  phase: "Dasar & Setup" | "UI & State" | "Navigasi & API" | "UTS" | "Global & Backend" | "Native & Build" | "UAS";
  title: string;
  sks: string;
  cpmk: string;
  goal: string;
  outputPraktikum: string;
  materiTeori: {
    title: string;
    points: string[];
    explanation: string;
  }[];
  steps: {
    step: number;
    title: string;
    command?: string;
    desc: string;
    codeSnippet?: string;
    filePath?: string;
  }[];
  files: {
    name: string;
    lang: "javascript" | "json" | "bash";
    code: string;
    description: string;
  }[];
  simId:
    | "hello-world"
    | "components-props"
    | "profile-flexbox"
    | "bmi-calculator"
    | "navigation-stack-tab"
    | "api-asyncstorage"
    | "mini-project-1"
    | "uts-exam"
    | "context-theme-cart"
    | "auth-flow"
    | "backend-crud"
    | "native-camera-gps"
    | "animated-performance"
    | "eas-build-apk"
    | "final-project-lab"
    | "uas-showcase";
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  tugas: {
    title: string;
    description: string;
    rubrik: { criteria: string; bobot: string }[];
  };
}

export const CPMK_LIST = [
  { id: "CPMK1", desc: "Memahami arsitektur aplikasi cross-platform dan ekosistem React Native/Expo" },
  { id: "CPMK2", desc: "Membangun UI responsif menggunakan komponen native dan styling Flexbox" },
  { id: "CPMK3", desc: "Mengimplementasikan state management, navigasi, dan integrasi API" },
  { id: "CPMK4", desc: "Mengakses fitur native device (kamera, lokasi, notifikasi)" },
  { id: "CPMK5", desc: "Melakukan build & deployment aplikasi ke Android/iOS (EAS Build)" },
  { id: "CPMK6", desc: "Merancang, membangun, dan mempresentasikan aplikasi mobile fungsional secara mandiri/tim" },
];

export const CROSS_PLATFORM_MEETINGS: CrossPlatformMeeting[] = [
  {
    no: 1,
    phase: "Dasar & Setup",
    title: "Pengantar & Environment Setup",
    sks: "3 SKS (2 Teori + 1 Praktikum)",
    cpmk: "CPMK1: Memahami arsitektur cross-platform & ekosistem Expo",
    goal: "Mahasiswa memahami konsep cross-platform development dan berhasil menjalankan aplikasi React Native pertama di HP & emulator.",
    outputPraktikum: "Hello World app jalan di emulator Android / Expo Go HP",
    materiTeori: [
      {
        title: "Native vs Hybrid vs Cross-Platform vs PWA",
        points: [
          "Native: Java/Kotlin (Android), Swift/Obj-C (iOS) — performa puncak tapi butuh 2 basis kode terpisah.",
          "Hybrid / Webview: Cordova/Capacitor — membungkus web HTML ke browser dalam app, performa terbatas.",
          "Cross-Platform: React Native & Flutter — satu basis kode JS/TS atau Dart yang merender komponen Native UI asli.",
          "PWA: Web yang bisa di-install lewat browser dengan Service Worker, tapi akses native API terbatas.",
        ],
        explanation:
          "React Native menggabungkan keunggulan belajar sekali tulis di mana saja (Learn once, write anywhere). Kode JS mengendalikan view native langsung via bridge/JSI.",
      },
      {
        title: "Arsitektur React Native (JS Thread, Bridge / JSI, Native UI)",
        points: [
          "JavaScript Thread: Mengeksekusi logika bisnis React, state, hooks, dan networking.",
          "UI / Native Thread: Menggambar widget platform asli (Android View, iOS UIView) di 60/120 FPS.",
          "JSI (JavaScript Interface): Komunikasi langsung C++ tanpa overhead serialisasi JSON lama.",
        ],
        explanation:
          "Dengan New Architecture dan JSI, React Native dapat memanggil modul native secara synchronous tanpa lag.",
      },
      {
        title: "Mengapa Expo? (Managed Workflow vs Bare Workflow)",
        points: [
          "Managed Workflow: Tanpa folder android/ dan ios/ rumit. Expo menangani native build di cloud.",
          "Expo Go: Aplikasi di Play Store / App Store untuk test langsung via Scan QR Code WiFi.",
          "Config Plugins: Menambahkan library native tanpa menyentuh kode Java/Swift manual.",
        ],
        explanation:
          "Expo adalah framework resmi yang direkomendasikan dokumentasi reactnative.dev untuk memulai project modern.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Verifikasi Node.js LTS (Minimal Node 18+)",
        command: "node -v && npm -v",
        desc: "Pastikan Node.js LTS telah terpasang. Node digunakan untuk menjalankan bundler Metro dan npm package manager.",
      },
      {
        step: 2,
        title: "Setup Editor & Extensions",
        desc: "Gunakan VS Code dengan ekstensi: ES7+ React/Redux snippets, Prettier, dan React Native Tools.",
      },
      {
        step: 3,
        title: "Inisialisasi Project Expo Modern via npx",
        command: "npx create-expo-app@latest myfirstapp\ncd myfirstapp\nnpx expo start",
        desc: "Perintah ini akan membuat struktur direktori resmi Expo SDK terbaru dengan template bersih.",
      },
      {
        step: 4,
        title: "Hubungkan ke Expo Go di Smartphone",
        desc: "Unduh Expo Go di Android Play Store atau iOS App Store. Pastikan laptop dan HP di satu WiFi, lalu scan QR Code.",
      },
      {
        step: 5,
        title: "Menjalankan di Emulator Android (Opsional)",
        command: "npx expo start --android",
        desc: "Buka Android Studio, jalankan AVD (Android Virtual Device), lalu tekan tombol 'a' di terminal.",
      },
    ],
    files: [
      {
        name: "App.js",
        lang: "javascript",
        description: "Entry point aplikasi pertama React Native",
        code: `import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo, Sistem Aplikasi Lintas Platform! 🚀</Text>
      <Text style={styles.subtitle}>Pertemuan 1: Expo SDK Ready</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
});`,
      },
      {
        name: "app.json",
        lang: "json",
        description: "Konfigurasi manifest aplikasi Expo",
        code: `{
  "expo": {
    "name": "myfirstapp",
    "slug": "myfirstapp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    }
  }
}`,
      },
    ],
    simId: "hello-world",
    quiz: {
      question: "Mengapa Expo direkomendasikan untuk pengembangan cross-platform React Native?",
      options: [
        "Expo hanya bisa jalan di browser Chrome",
        "Menyediakan managed workflow tanpa perlu setup manual Android Studio & Xcode di awal",
        "Expo menggantikan bahasa JavaScript dengan C++",
        "Expo menghapus semua komponen native Android",
      ],
      answer: 1,
      explanation:
        "Expo Managed Workflow memudahkan developer langsung coding tanpa setup Gradle/Xcode yang rumit di awal.",
    },
    tugas: {
      title: "Instalasi & Hello World Multi-Device",
      description:
        "Instal environment lengkap, jalankan aplikasi 'Hello World' di HP fisik (via Expo Go) atau emulator Android Studio. Upload screenshot dan link repo GitHub ke LMS.",
      rubrik: [
        { criteria: "Environment Node.js & Expo terpasang benar", bobot: "30%" },
        { criteria: "Aplikasi berhasil boot tanpa error", bobot: "40%" },
        { criteria: "Screenshot & dokumentasi repo rapi", bobot: "30%" },
      ],
    },
  },
  {
    no: 2,
    phase: "Dasar & Setup",
    title: "JavaScript ES6+ & React Fundamentals",
    sks: "3 SKS",
    cpmk: "CPMK1 & CPMK2: Fondasi ES6+, JSX, dan Component Composition",
    goal: "Mahasiswa menguasai fitur modern ES6+, aturan JSX, serta menyusun komponen reusable menggunakan props.",
    outputPraktikum: "Komponen fungsional reusable (StudentCard / Greeting) tersusun di satu layar",
    materiTeori: [
      {
        title: "Review Fitur Kunci ES6+ untuk React",
        points: [
          "Arrow Function: `const Card = () => <View />`",
          "Destructuring: `const { name, nim, jurusan } = props`",
          "Spread & Rest Operator: `{ ...defaultProps, custom: true }`",
          "Template Literals: ``Halo, \${name}!``",
          "Async/Await & Promises: konsumsi data asynchronous",
        ],
        explanation: "React Native modern 100% menggunakan syntax ES6+ dan functional components.",
      },
      {
        title: "Aturan Penulisan JSX di React Native",
        points: [
          "JSX bukan HTML: tidak ada `<div>` atau `<span>`, gunakan `<View>` dan `<Text>`.",
          "Semua string teks WAJIB dibungkus di dalam komponen `<Text>`.",
          "Hanya ada satu root element (atau React Fragment `<></>`).",
          "Gunakan `style={styles.card}` bukan class HTML biasa.",
        ],
        explanation: "Karena dirender ke native view OS, teks di luar `<Text>` akan menghasilkan fatal red screen.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Reusable Component",
        filePath: "components/StudentCard.js",
        desc: "Buat file komponen terpisah yang menerima props `nama`, `nim`, dan `jurusan`.",
      },
      {
        step: 2,
        title: "Import dan Looping Data",
        filePath: "App.js",
        desc: "Gunakan `Array.map` untuk merender kumpulan mahasiswa ke dalam layar.",
      },
    ],
    files: [
      {
        name: "components/StudentCard.js",
        lang: "javascript",
        description: "Komponen kartu mahasiswa reusable",
        code: `import { View, Text, StyleSheet } from 'react-native';

export default function StudentCard({ nama, nim, jurusan, ipk }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{nama.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nama}>{nama}</Text>
        <Text style={styles.nim}>NIM: {nim}</Text>
        <Text style={styles.jurusan}>{jurusan}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>IPK {ipk}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  info: { flex: 1 },
  nama: { color: '#f8fafc', fontSize: 15, fontWeight: 'bold' },
  nim: { color: '#94a3b8', fontSize: 12 },
  jurusan: { color: '#38bdf8', fontSize: 12, marginTop: 2 },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
});`,
      },
    ],
    simId: "components-props",
    quiz: {
      question: "Apa yang terjadi jika Anda menulis teks langsung di dalam <View> tanpa komponen <Text>?",
      options: [
        "Teks tetap muncul normal",
        "Aplikasi crash atau memunculkan error 'Text strings must be rendered within a <Text> component'",
        "Teks otomatis berubah jadi heading",
        "Teks disimpan ke AsyncStorage",
      ],
      answer: 1,
      explanation:
        "Di React Native, semua teks wajib berada di dalam komponen <Text> karena View native tidak bisa menampilkan raw string.",
    },
    tugas: {
      title: "Halaman Daftar Mahasiswa Reusable",
      description:
        "Buat minimal 3 komponen reusable (misal: StudentCard, StatBadge, HeaderBar) dan susun halaman Daftar Mahasiswa minimal 5 data.",
      rubrik: [
        { criteria: "Komposisi komponen modular & terpisah", bobot: "40%" },
        { criteria: "Penggunaan props & destructuring benar", bobot: "30%" },
        { criteria: "Kerapian visual & styling", bobot: "30%" },
      ],
    },
  },
  {
    no: 3,
    phase: "UI & State",
    title: "Core Components & Styling (Flexbox)",
    sks: "3 SKS",
    cpmk: "CPMK2: Membangun UI responsif dengan Flexbox & Core Components",
    goal: "Mahasiswa memahami perbedaan Flexbox di React Native dan menguasai Core Components (View, Text, Image, FlatList, ScrollView, TouchableOpacity).",
    outputPraktikum: "Halaman Profile Card & Katalog Produk 2 Kolom responsif",
    materiTeori: [
      {
        title: "Perbedaan Flexbox Web vs React Native",
        points: [
          "Default `flexDirection` adalah `column` (vertikal), bukan `row` seperti di browser web.",
          "Semua komponen secara default memiliki `display: flex`.",
          "Nilai `flex: 1` berarti mengisi seluruh ruang tersisa di layar.",
          "Satuan ukuran: unit density-independent pixels (dp), jangan sertakan 'px'.",
        ],
        explanation:
          "Karena layar HP memanjang ke bawah (portrait), default column membuat alur layout mobile lebih natural.",
      },
      {
        title: "FlatList vs ScrollView",
        points: [
          "ScrollView: Merender seluruh item sekaligus di memori — cocok untuk halaman profil statis pendek.",
          "FlatList: Menggunakan virtualisasi — hanya merender item yang terlihat di layar, sangat hemat memori untuk ribuan data.",
        ],
        explanation: "Selalu gunakan FlatList jika menampilkan list data dinamis dari API.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Profile Card dengan Flexbox",
        desc: "Gunakan flexDirection row untuk stat bar dan column untuk container utama.",
      },
      {
        step: 2,
        title: "Implementasi FlatList 2 Kolom (numColumns=2)",
        desc: "Gunakan props `numColumns={2}` untuk membuat grid katalog produk yang rapi.",
      },
    ],
    files: [
      {
        name: "screens/ProfileCard.js",
        lang: "javascript",
        description: "Profile Card interaktif dengan statistik",
        code: `import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileCard() {
  return (
    <View style={styles.card}>
      <View style={styles.avatarBorder}>
        <View style={styles.avatarInner} />
      </View>
      <Text style={styles.name}>Raka Samudra</Text>
      <Text style={styles.role}>Mobile Cross-Platform Engineer</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>16</Text>
          <Text style={styles.statLabel}>Pertemuan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNum}>3 SKS</Text>
          <Text style={styles.statLabel}>Beban SKS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNum}>Expo</Text>
          <Text style={styles.statLabel}>SDK 52</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.btnFollow} activeOpacity={0.8}>
        <Text style={styles.btnText}>Buka Profil Lengkap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, alignItems: 'center' },
  avatarBorder: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#38bdf8', alignItems: 'center', justifyContent: 'center' },
  avatarInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#0284c7' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginTop: 12 },
  role: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  statsRow: { flexDirection: 'row', width: '100%', marginTop: 16, paddingVertical: 12, backgroundColor: '#0f172a', borderRadius: 12, justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statDivider: { width: 1, height: '80%', backgroundColor: '#334155' },
  statNum: { fontSize: 16, fontWeight: 'bold', color: '#38bdf8' },
  statLabel: { fontSize: 11, color: '#94a3b8' },
  btnFollow: { marginTop: 16, width: '100%', backgroundColor: '#0284c7', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});`,
      },
    ],
    simId: "profile-flexbox",
    quiz: {
      question: "Apakah nilai default dari flexDirection di React Native?",
      options: ["row", "column", "row-reverse", "grid"],
      answer: 1,
      explanation:
        "Di React Native, default flexDirection adalah column karena layout mobile secara alamiah mengalir dari atas ke bawah.",
    },
    tugas: {
      title: "Katalog Produk Grid 2 Kolom",
      description:
        "Buat halaman Katalog Produk menggunakan `FlatList` dengan `numColumns={2}`, lengkap dengan gambar, nama produk, harga, dan tombol 'Beli'.",
      rubrik: [
        { criteria: "Penggunaan FlatList & keyExtractor efisien", bobot: "35%" },
        { criteria: "Responsivitas Grid Flexbox 2 kolom", bobot: "35%" },
        { criteria: "Kerapian estetika & TouchableOpacity", bobot: "30%" },
      ],
    },
  },
  {
    no: 4,
    phase: "UI & State",
    title: "State, Hooks & Event Handling",
    sks: "3 SKS",
    cpmk: "CPMK3: Mengelola state lokal, hooks, dan event input",
    goal: "Mahasiswa mampu memanfaatkan useState dan useEffect untuk interaktivitas layar, event handling, dan controlled form inputs.",
    outputPraktikum: "Aplikasi Kalkulator BMI & Counter interaktif dengan validasi form",
    materiTeori: [
      {
        title: "useState & Re-render Siklus",
        points: [
          "`const [state, setState] = useState(initialValue)`",
          "Setiap pemanggilan `setState` memicu evaluasi ulang komponen dan update tampilan native.",
          "Jangan mutasi state langsung: gunakan setter function.",
        ],
        explanation: "State adalah memori komponen yang menyimpan data dinamis selama aplikasi berjalan.",
      },
      {
        title: "useEffect & Lifecycle Synchronization",
        points: [
          "`useEffect(() => { ... }, [])`: Berjalan sekali saat mount (mirip componentDidMount).",
          "`useEffect(() => { ... }, [dep])`: Berjalan setiap kali nilai dependencies berubah.",
          "Return cleanup function: Untuk unsubscribe listener atau membersihkan timer.",
        ],
        explanation: "useEffect digunakan untuk side-effects seperti fetch API, timer, atau sinkronisasi listener.",
      },
      {
        title: "Event Handling di Mobile",
        points: [
          "`onPress` pada tombol atau TouchableOpacity.",
          "`onChangeText={(text) => setValue(text)}` pada TextInput.",
          "`onSubmitEditing` untuk menangkap tombol enter/selesai di keyboard virtual.",
        ],
        explanation: "Event di mobile berbeda dengan click browser karena menangani gestures sentuhan dan keyboard virtual.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "State Input Berat & Tinggi Badan",
        desc: "Buat dua state `berat` dan `tinggi` untuk menangkap input pengguna.",
      },
      {
        step: 2,
        title: "Kalkulasi Rumus BMI",
        desc: "Rumus BMI = Berat(kg) / ((Tinggi(cm)/100) * (Tinggi(cm)/100)). Tampilkan kategori: Kurang, Ideal, Lebih, Obesitas.",
      },
    ],
    files: [
      {
        name: "screens/BmiCalculator.js",
        lang: "javascript",
        description: "Kalkulator BMI interaktif",
        code: `import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function BmiCalculator() {
  const [weight, setWeight] = useState('65');
  const [height, setHeight] = useState('170');
  const [bmiResult, setBmiResult] = useState(null);

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const score = (w / (h * h)).toFixed(1);
      let cat = 'Normal (Ideal)';
      let col = '#22c55e';
      if (score < 18.5) { cat = 'Kekurangan Berat'; col = '#eab308'; }
      else if (score >= 25 && score < 30) { cat = 'Kelebihan Berat'; col = '#f97316'; }
      else if (score >= 30) { cat = 'Obesitas'; col = '#ef4444'; }
      setBmiResult({ score, cat, col });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Kalkulator BMI ⚖️</Text>
      <TextInput
        style={styles.input}
        placeholder="Berat Badan (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Tinggi Badan (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <TouchableOpacity style={styles.btn} onPress={calculateBmi}>
        <Text style={styles.btnText}>Hitung BMI Sekarang</Text>
      </TouchableOpacity>
      {bmiResult && (
        <View style={[styles.resultCard, { borderColor: bmiResult.col }]}>
          <Text style={styles.scoreText}>{bmiResult.score}</Text>
          <Text style={[styles.catText, { color: bmiResult.col }]}>{bmiResult.cat}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0f172a', borderRadius: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#38bdf8', marginBottom: 12 },
  input: { backgroundColor: '#1e293b', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  btn: { backgroundColor: '#0284c7', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  resultCard: { marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: '#1e293b', borderWidth: 2, alignItems: 'center' },
  scoreText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  catText: { fontSize: 15, fontWeight: 'bold', marginTop: 4 },
});`,
      },
    ],
    simId: "bmi-calculator",
    quiz: {
      question: "Kapan useEffect dengan array dependency kosong `useEffect(() => {}, [])` dieksekusi?",
      options: [
        "Setiap kali ada state yang berubah",
        "Hanya satu kali saat komponen pertama kali dipasang (mount)",
        "Setiap kali tombol di layar diklik",
        "Sebelum komponen dihapus dari DOM",
      ],
      answer: 1,
      explanation:
        "Array dependency kosong memberitahu React bahwa effect ini tidak bergantung pada nilai state apapun, sehingga hanya berjalan sekali setelah initial mount.",
    },
    tugas: {
      title: "Kalkulator Finansial / BMI dengan Validasi",
      description:
        "Buat aplikasi Kalkulator BMI lengkap dengan tombol Reset, input sanitasi angka, dan saran gizi interaktif berdasarkan hasil.",
      rubrik: [
        { criteria: "Pengelolaan state & logic rumus akurat", bobot: "40%" },
        { criteria: "Validasi input angka kosong/negatif", bobot: "30%" },
        { criteria: "Feedback visual warna & kategori", bobot: "30%" },
      ],
    },
  },
  {
    no: 5,
    phase: "Navigasi & API",
    title: "Navigasi (React Navigation)",
    sks: "3 SKS",
    cpmk: "CPMK3: Implementasi alur navigasi multi-screen & passing params",
    goal: "Mahasiswa mampu mengintegrasikan React Navigation (Stack & Bottom Tabs) serta mengirimkan data parameter antar layar.",
    outputPraktikum: "Aplikasi multi-screen (Home, Katalog, Detail Produk, Profile) dengan Nested Navigator",
    materiTeori: [
      {
        title: "Tipe Navigator di React Navigation",
        points: [
          "Native Stack Navigator: Memberikan animasi transisi native OS yang mulus.",
          "Bottom Tab Navigator: Navigasi tab utama di bagian bawah layar.",
          "Drawer Navigator: Menu samping geser (hamburger menu).",
          "Nested Navigator: Memasukkan Stack Navigator di dalam Tab Navigator.",
        ],
        explanation: "React Navigation adalah standar de-facto navigasi di ekosistem React Native.",
      },
      {
        title: "Passing Parameters Antar Screen",
        points: [
          "Kirim data: `navigation.navigate('Detail', { productId: 101, name: 'Laptop' })`",
          "Terima data: `const { productId, name } = route.params`",
          "Gunakan `route.params` untuk memuat data spesifik di layar tujuan.",
        ],
        explanation: "Hindari passing state besar antar route; cukup kirimkan ID dan fetch detail jika diperlukan.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Install Dependencies React Navigation",
        command:
          "npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context",
        desc: "Package ini mencakup core container, stack native, bottom tab, serta native safe area wrapper.",
      },
      {
        step: 2,
        title: "Bungkus App dengan NavigationContainer",
        desc: "NavigationContainer adalah root provider yang mengelola riwayat navigasi (history stack).",
      },
    ],
    files: [
      {
        name: "navigation/AppNavigator.js",
        lang: "javascript",
        description: "Konfigurasi Stack & Tab Navigator",
        code: `import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Contoh alur navigasi tab & stack
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeTab">
        <Stack.Screen name="HomeTab" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detail Item' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
      },
    ],
    simId: "navigation-stack-tab",
    quiz: {
      question: "Bagaimana cara mengambil parameter yang dikirim melalui navigasi ke DetailScreen?",
      options: [
        "const { id } = this.state",
        "const { id } = route.params",
        "const { id } = navigation.params",
        "const { id } = AsyncStorage.get()",
      ],
      answer: 1,
      explanation:
        "Di React Navigation, screen component menerima props `route`, dan parameter yang dikirim dapat diakses via `route.params`.",
    },
    tugas: {
      title: "Nested Navigation 4 Screen",
      description:
        "Bangun aplikasi dengan Bottom Tab (Tab Home & Tab Profile). Di dalam Tab Home, user bisa mengklik produk untuk pindah ke Stack Screen 'Detail' dengan membawa params ID produk.",
      rubrik: [
        { criteria: "Konfigurasi NavigationContainer & Stack", bobot: "40%" },
        { criteria: "Passing & receiving params berjalan akurat", bobot: "30%" },
        { criteria: "Bottom Tab terintegrasi rapi", bobot: "30%" },
      ],
    },
  },
  {
    no: 6,
    phase: "Navigasi & API",
    title: "Integrasi API & AsyncStorage",
    sks: "3 SKS",
    cpmk: "CPMK3: Konsumsi REST API dan persistensi data lokal",
    goal: "Mahasiswa menguasai fetch REST API, pengelolaan state loading/error, serta menyimpan data favorit ke AsyncStorage.",
    outputPraktikum: "Aplikasi berita / post viewer dengan fitur 'Simpan Favorit' ke AsyncStorage",
    materiTeori: [
      {
        title: "Konsumsi REST API (GET & POST)",
        points: [
          "Gunakan built-in `fetch(url)` dengan async/await.",
          "Tangani 3 state utama: Loading (`ActivityIndicator`), Data berhasil, dan Error handling.",
        ],
        explanation: "Aplikasi mobile selalu beroperasi di jaringan tidak stabil, error state wajib diantisipasi.",
      },
      {
        title: "AsyncStorage untuk Penyimpanan Lokal",
        points: [
          "AsyncStorage adalah penyimpanan key-value asynchronous mirip localStorage di browser.",
          "Menyimpan data: `await AsyncStorage.setItem('key', JSON.stringify(data))`",
          "Membaca data: `const raw = await AsyncStorage.getItem('key')`",
        ],
        explanation: "Data tetap bertahan meski aplikasi ditutup atau smartphone di-restart.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Install AsyncStorage",
        command: "npx expo install @react-native-async-storage/async-storage",
        desc: "Modul resmi penyimpanan persistent key-value untuk ekosistem React Native.",
      },
      {
        step: 2,
        title: "Fetch Data dari JSONPlaceholder & Bookmark",
        desc: "Muat data dari https://jsonplaceholder.typicode.com/posts lalu simpan item yang disukai ke AsyncStorage.",
      },
    ],
    files: [
      {
        name: "services/storage.js",
        lang: "javascript",
        description: "Helper fungsi simpan & ambil data lokal",
        code: `import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFavorite = async (item) => {
  try {
    const existing = await getFavorites();
    const updated = [...existing, item];
    await AsyncStorage.setItem('@favorites', JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getFavorites = async () => {
  try {
    const raw = await AsyncStorage.getItem('@favorites');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};`,
      },
    ],
    simId: "api-asyncstorage",
    quiz: {
      question: "Mengapa kita harus menggunakan JSON.stringify saat menyimpan objek ke AsyncStorage?",
      options: [
        "Agar file terenkripsi militer",
        "Karena AsyncStorage hanya menerima data string",
        "Agar memori RAM langsung bersih",
        "JSON.stringify otomatis memanggil REST API",
      ],
      answer: 1,
      explanation:
        "AsyncStorage hanya dapat menyimpan nilai bertipe string. Tipe data objek/array harus diubah ke string JSON terlebih dahulu.",
    },
    tugas: {
      title: "News & Bookmark App",
      description:
        "Buat aplikasi yang fetch data dari API publik (contoh: JSONPlaceholder/Quotes API). Tambahkan tombol bookmark untuk menyimpan artikel favorit ke AsyncStorage.",
      rubrik: [
        { criteria: "Fetch API & ActivityIndicator loading state", bobot: "40%" },
        { criteria: "AsyncStorage simpan & load berfungsi offline", bobot: "40%" },
        { criteria: "Handling error jaringan", bobot: "20%" },
      ],
    },
  },
  {
    no: 7,
    phase: "Navigasi & API",
    title: "MINI PROJECT 1 (Pra-UTS)",
    sks: "3 SKS (Project Lab)",
    cpmk: "CPMK1, CPMK2, CPMK3: Integrasi menyeluruh P1 sampai P6",
    goal: "Mengintegrasikan seluruh materi P1–P6 menjadi satu aplikasi mobile fungsional siap pakai.",
    outputPraktikum: "Aplikasi Todo List / Weather App / Recipe Finder lengkap dengan 3+ screens",
    materiTeori: [
      {
        title: "Requirement Mini Project 1",
        points: [
          "Minimal 3 Screen dengan React Navigation (Stack atau Tab).",
          "Pengelolaan state dinamis (useState & useEffect).",
          "Integrasi data eksternal (REST API) atau persistensi lokal (AsyncStorage).",
          "UI/UX rapi dengan Flexbox & Core Components responsif.",
        ],
        explanation: "Mini project ini menjadi portofolio mahasiswa pertama di semester 5.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Pilih Topik Proyek",
        desc: "Pilihan: 1. Todo List CRUD Lokal | 2. Weather App API | 3. Recipe Finder App.",
      },
      {
        step: 2,
        title: "Pengumpulan Repo & Video Demo",
        desc: "Sertakan file README.md dengan petunjuk instalasi dan video rekaman demo 2-3 menit.",
      },
    ],
    files: [
      {
        name: "README.md",
        lang: "javascript",
        description: "Template dokumentasi proyek",
        code: `# Mini Project 1: Sistem Aplikasi Lintas Platform
**Nama:** Mahasiswa
**NIM:** 12345678
**Tema:** Todo List Mobile App dengan AsyncStorage & React Navigation

### Fitur Utama:
1. Tambah, Hapus, dan Tandai Selesai Tugas
2. Filter status (Semua, Aktif, Selesai)
3. Persistensi lokal menggunakan AsyncStorage
4. Navigasi Detail Tugas`,
      },
    ],
    simId: "mini-project-1",
    quiz: {
      question: "Komponen apa yang wajib ada di root aplikasi saat menggunakan React Navigation?",
      options: ["<NavigationContainer>", "<FlatList>", "<AsyncStorageProvider>", "<AnimatedView>"],
      answer: 0,
      explanation:
        "<NavigationContainer> bertindak sebagai context root yang menyimpan riwayat tumpukan navigasi di seluruh aplikasi.",
    },
    tugas: {
      title: "Submit Mini Project 1",
      description: "Upload link repository GitHub dan video demo fungsionalitas aplikasi di LMS.",
      rubrik: [
        { criteria: "Fungsionalitas CRUD / API jalan tanpa crash", bobot: "40%" },
        { criteria: "UI/UX & Desain Responsif", bobot: "25%" },
        { criteria: "Struktur Komponen & Clean Code", bobot: "20%" },
        { criteria: "Dokumentasi README & Demo", bobot: "15%" },
      ],
    },
  },
  {
    no: 8,
    phase: "UTS",
    title: "UTS (Ujian Tengah Semester)",
    sks: "3 SKS",
    cpmk: "CPMK1, CPMK2, CPMK3: Evaluasi Teori & Ujian Praktikum Koding",
    goal: "Mengukur penguasaan konsep React Native, JSX, state, navigasi, dan kemampuan live-coding studi kasus.",
    outputPraktikum: "Hasil ujian teori + implementasi studi kasus live coding selesai",
    materiTeori: [
      {
        title: "Kisi-Kisi UTS",
        points: [
          "Teori (40%): Arsitektur RN, JSX vs HTML, Props vs State, Lifecycle useEffect, AsyncStorage.",
          "Praktik (60%): Live coding studi kasus (Tambah fitur Search, Filter API, dan Navigasi Detail dengan parameter).",
        ],
        explanation: "Ujian dilaksanakan dalam durasi 90–120 menit di lab komputer / laptop mandiri.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membaca Starter Code UTS",
        desc: "Diberikan starter project dengan screen Home & Detail.",
      },
      {
        step: 2,
        title: "Mengerjakan Fitur Pencarian & Filter",
        desc: "Buat screen baru 'Search', fetch data, dan filter secara real-time berdasarkan input.",
      },
    ],
    files: [
      {
        name: "screens/SearchScreen.js",
        lang: "javascript",
        description: "Solusi studi kasus UTS",
        code: `import { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const data = [
    { id: '1', title: 'Belajar React Native Expo' },
    { id: '2', title: 'Dasar Flexbox & Styling' },
    { id: '3', title: 'React Navigation Stack' },
  ];

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0f172a' }}>
      <TextInput
        placeholder="Cari materi..."
        placeholderTextColor="#64748b"
        value={query}
        onChangeText={setQuery}
        style={{ backgroundColor: '#1e293b', color: '#fff', padding: 12, borderRadius: 10 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Detail', { item })}
            style={{ padding: 14, borderBottomWidth: 1, borderColor: '#334155' }}
          >
            <Text style={{ color: '#f8fafc', fontWeight: 'bold' }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}`,
      },
    ],
    simId: "uts-exam",
    quiz: {
      question: "Apa tujuan utama penggunaan keyExtractor pada komponen FlatList?",
      options: [
        "Menghitung total item secara otomatis",
        "Memberikan identitas unik pada setiap item untuk efisiensi re-render Virtual DOM",
        "Mengubah warna teks secara acak",
        "Mengirim data langsung ke server backend",
      ],
      answer: 1,
      explanation:
        "keyExtractor memberikan key unik ke setiap elemen sehingga React Native hanya me-render ulang baris yang datanya benar-benar berubah.",
    },
    tugas: {
      title: "Pengumpulan Berkas UTS",
      description: "Kumpulkan lembar jawaban teori dan commit kode studi kasus ke repo UTS.",
      rubrik: [
        { criteria: "Ketepatan Ujian Teori", bobot: "40%" },
        { criteria: "Fungsionalitas Live Coding Praktikum", bobot: "60%" },
      ],
    },
  },
  {
    no: 9,
    phase: "Global & Backend",
    title: "Context API & Global State Management",
    sks: "3 SKS",
    cpmk: "CPMK3: Mengatasi prop drilling dan mengelola global state aplikasi",
    goal: "Mahasiswa memahami Context API (createContext, useContext, Provider) untuk mengelola data global seperti Theme Switcher dan Shopping Cart.",
    outputPraktikum: "Aplikasi dengan Dark/Light Mode Switcher & Keranjang Belanja Global",
    materiTeori: [
      {
        title: "Masalah Prop Drilling",
        points: [
          "Meneruskan props melewati banyak komponen perantara yang sebenarnya tidak butuh data tersebut.",
          "Menyulitkan refactoring dan membuat kode saling tergantung erat.",
        ],
        explanation: "Context API menyediakan saluran langsung dari Provider ke Consumer di tingkat komponen manapun.",
      },
      {
        title: "Trio Context API",
        points: [
          "1. `createContext()`: Membuat context object.",
          "2. `<Context.Provider value={...}>`: Membungkus tree komponen yang membutuhkan state.",
          "3. `useContext(Context)`: Custom hook untuk membaca dan memutasi state dari screen manapun.",
        ],
        explanation: "Sangat ideal untuk tema, status login user, preferensi bahasa, dan keranjang belanja.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat ThemeContext.js",
        desc: "Definisikan context dan custom hook `useTheme()`.",
      },
      {
        step: 2,
        title: "Bungkus App.js dengan ThemeProvider",
        desc: "Pasang `<ThemeProvider>` agar semua screen dapat mengakses `isDark` dan `toggleTheme`.",
      },
    ],
    files: [
      {
        name: "context/ThemeContext.js",
        lang: "javascript",
        description: "Global state Theme Provider",
        code: `import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colors = isDark
    ? { bg: '#0f172a', card: '#1e293b', text: '#f8fafc', accent: '#38bdf8' }
    : { bg: '#f8fafc', card: '#ffffff', text: '#0f172a', accent: '#0284c7' };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);`,
      },
    ],
    simId: "context-theme-cart",
    quiz: {
      question: "Apa fungsi utama dari komponen <Context.Provider>?",
      options: [
        "Menyediakan koneksi internet 5G",
        "Menyediakan nilai state global ke seluruh komponen turunan di dalam tree",
        "Menghapus AsyncStorage secara otomatis",
        "Menggantikan fungsi FlatList",
      ],
      answer: 1,
      explanation:
        "Provider bertindak sebagai penyedia nilai data. Setiap komponen turunan yang memanggil useContext akan mendapatkan nilai terkini dari Provider.",
    },
    tugas: {
      title: "Global Shopping Cart Context",
      description:
        "Buat CartContext dengan state keranjang belanja (`cartItems`, `addToCart`, `removeFromCart`). Tampilkan badge jumlah belanja di tab bar.",
      rubrik: [
        { criteria: "Struktur Context & Provider benar", bobot: "40%" },
        { criteria: "Sinkronisasi antar screen (Katalog & Cart)", bobot: "40%" },
        { criteria: "Update badge jumlah item", bobot: "20%" },
      ],
    },
  },
  {
    no: 10,
    phase: "Global & Backend",
    title: "Authentication Flow",
    sks: "3 SKS",
    cpmk: "CPMK3: Conditional routing dan autentikasi pengguna",
    goal: "Mahasiswa mampu merancang Conditional Navigation (AuthStack vs AppStack), validasi form login, dan pengamanan token pengguna.",
    outputPraktikum: "Flow Login -> Register -> Protected Dashboard dengan tombol Logout",
    materiTeori: [
      {
        title: "Pola Conditional Navigation",
        points: [
          "Alih-alih menyembunyikan halaman, ganti tumpukan navigator sepenuhnya.",
          "Jika `userToken == null` -> render `<AuthStack>` (Login, Register).",
          "Jika `userToken != null` -> render `<AppStack>` (Home, Profile, Settings).",
        ],
        explanation: "Pola ini mencegah user menekan tombol 'Back' perangkat untuk kembali ke halaman login setelah login berhasil.",
      },
      {
        title: "Penyimpanan Kredensial & Token",
        points: [
          "Token JWT (JSON Web Token) disimpan di AsyncStorage atau Expo SecureStore.",
          "Cek token saat aplikasi pertama kali boot (Splash screen check).",
        ],
        explanation: "Pastikan logout menghapus token dari storage agar sesi bersih.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat AuthContext",
        desc: "Simpan state `user` dan sediakan method `login(email, pass)` dan `logout()`.",
      },
      {
        step: 2,
        title: "Susun Conditional Stack di Navigation",
        desc: "Cek kondisi `user ? <AppStack /> : <AuthStack />` di dalam root navigator.",
      },
    ],
    files: [
      {
        name: "navigation/RootNavigator.js",
        lang: "javascript",
        description: "Conditional navigation berbasis login",
        code: `import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';

export default function RootNavigator() {
  const { user } = useAuth();
  return user ? <AppStack /> : <AuthStack />;
}`,
      },
    ],
    simId: "auth-flow",
    quiz: {
      question: "Mengapa conditional routing lebih aman dibandingkan tombol navigasi manual saat login?",
      options: [
        "Karena file App.js otomatis terhapus",
        "Karena screen yang dilindungi sama sekali tidak ada di dalam tree navigasi jika user belum terautentikasi",
        "Karena tidak membutuhkan import React",
        "Karena performa HP menjadi 2 kali lebih cepat",
      ],
      answer: 1,
      explanation:
        "Dengan conditional routing, route rahasia tidak terdaftar di navigator, sehingga user tidak bisa mengaksesnya lewat deep-link atau gesture back.",
    },
    tugas: {
      title: "Flow Autentikasi dengan Validasi Form",
      description:
        "Buat flow Login & Register dengan validasi email (harus format valid) dan password (minimal 6 karakter). Tampilkan alert jika gagal.",
      rubrik: [
        { criteria: "Conditional Stack Auth vs App bekerja mulus", bobot: "40%" },
        { criteria: "Validasi form & error messaging", bobot: "30%" },
        { criteria: "Persistensi sesi token saat app dibuka ulang", bobot: "30%" },
      ],
    },
  },
  {
    no: 11,
    phase: "Global & Backend",
    title: "Integrasi Backend (CRUD Lengkap)",
    sks: "3 SKS",
    cpmk: "CPMK3: Operasi CRUD penuh terhubung ke database cloud / REST server",
    goal: "Mahasiswa mampu mengintegrasikan aplikasi dengan database backend (Firestore / Express API) untuk operasi Create, Read, Update, Delete.",
    outputPraktikum: "Aplikasi Task Manager CRUD penuh terhubung ke database cloud",
    materiTeori: [
      {
        title: "Operasi CRUD di Aplikasi Mobile",
        points: [
          "Create: Mengirim data baru (`addDoc` / `POST /api/tasks`).",
          "Read: Mengambil daftar data (`getDocs` / `GET /api/tasks`).",
          "Update: Mengubah status tugas (`updateDoc` / `PUT /api/tasks/:id`).",
          "Delete: Menghapus data (`deleteDoc` / `DELETE /api/tasks/:id`).",
        ],
        explanation: "Aplikasi modern selalu tersinkronisasi dua arah dengan server pusat.",
      },
      {
        title: "Optimistic UI Update",
        points: [
          "Memperbarui tampilan layar secara instan sebelum respons server selesai.",
          "Jika request server gagal, lakukan rollback ke state sebelumnya dan beri tahu user.",
        ],
        explanation: "Memberikan pengalaman pengguna yang sangat cepat tanpa jeda spinner berulang-ulang.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Inisialisasi Koneksi Backend / Firestore",
        command: "npx expo install firebase",
        desc: "Konfigurasikan firebaseConfig atau URL endpoint backend REST API.",
      },
      {
        step: 2,
        title: "Implementasi Fungsi CRUD Penuh",
        desc: "Buat fungsi `createTask`, `readTasks`, `updateTask`, dan `deleteTask`.",
      },
    ],
    files: [
      {
        name: "services/taskService.js",
        lang: "javascript",
        description: "Layanan CRUD backend",
        code: `// Contoh operasi CRUD standar
export const taskService = {
  async getAll() {
    // Simulasi atau fetch real backend
    return [{ id: '1', title: 'Belajar React Native', completed: true }];
  },
  async create(title) {
    return { id: String(Date.now()), title, completed: false };
  },
  async toggle(id, completed) {
    return { id, completed: !completed };
  },
  async remove(id) {
    return true;
  },
};`,
      },
    ],
    simId: "backend-crud",
    quiz: {
      question: "Apa keuntungan menerapkan teknik 'Optimistic UI Update' pada aplikasi mobile?",
      options: [
        "Aplikasi terasa sangat responsif dan instan bagi pengguna",
        "Server tidak perlu menyimpan data",
        "Mengurangi pemakaian baterai hingga 90%",
        "Menghilangkan kebutuhan akan internet",
      ],
      answer: 0,
      explanation:
        "Optimistic UI langsung memperbarui UI di layar saat user menekan tombol tanpa harus menunggu latency jaringan server.",
    },
    tugas: {
      title: "Task Manager CRUD Cloud",
      description:
        "Buat aplikasi Task Manager lengkap dengan fitur tambah tugas, ubah status checklist selesai, edit nama tugas, dan hapus tugas.",
      rubrik: [
        { criteria: "Keempat fungsi CRUD berjalan tanpa bug", bobot: "50%" },
        { criteria: "Loading indicator & feedback sukses/gagal", bobot: "30%" },
        { criteria: "Kerapian struktur service terpisah", bobot: "20%" },
      ],
    },
  },
  {
    no: 12,
    phase: "Native & Build",
    title: "Native Device Features (Expo APIs)",
    sks: "3 SKS",
    cpmk: "CPMK4: Mengakses fitur perangkat keras native (kamera, lokasi, notifikasi)",
    goal: "Mahasiswa mampu mengintegrasikan hardware smartphone: expo-image-picker (kamera/galeri), expo-location (GPS), dan permission handling.",
    outputPraktikum: "Fitur Upload Foto Profil (Kamera/Galeri) + Deteksi Koordinat GPS Lokasi",
    materiTeori: [
      {
        title: "Sistem Permission di Android & iOS",
        points: [
          "Aplikasi wajib meminta izin eksplisit dari pengguna sebelum mengakses sensor pribadi.",
          "Status izin: `granted`, `denied`, atau `undetermined`.",
          "Jika ditolak, arahkan pengguna ke menu Pengaturan perangkat.",
        ],
        explanation: "Kebijakan keamanan sistem operasi mobile modern sangat ketat terhadap privasi user.",
      },
      {
        title: "Library Expo Native Terpopuler",
        points: [
          "`expo-image-picker`: Mengambil foto dari kamera atau memilih dari galeri foto.",
          "`expo-location`: Mengambil koordinat GPS (latitude, longitude, altitude) dan reverse geocoding.",
          "`expo-notifications`: Menjadwalkan local notifications dan push notification.",
        ],
        explanation: "Modul Expo mengabstraksi native Java/Swift API ke interface Promise JS yang ringkas.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Install Expo Image Picker & Location",
        command: "npx expo install expo-image-picker expo-location",
        desc: "Pasang modul native API untuk kamera dan sensor lokasi GPS.",
      },
      {
        step: 2,
        title: "Minta Izin & Akses Sensor",
        desc: "Panggil `requestMediaLibraryPermissionsAsync()` dan `requestForegroundPermissionsAsync()`.",
      },
    ],
    files: [
      {
        name: "screens/NativeFeaturesScreen.js",
        lang: "javascript",
        description: "Contoh akses kamera & GPS",
        code: `import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;
  const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
  return res.canceled ? null : res.assets[0].uri;
};

export const getCurrentGPS = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  const loc = await Location.getCurrentPositionAsync({});
  return loc.coords;
};`,
      },
    ],
    simId: "native-camera-gps",
    quiz: {
      question: "Apa yang harus dilakukan developer sebelum memanggil fungsi kamera atau GPS di React Native?",
      options: [
        "Membeli lisensi berbayar ke Google",
        "Meminta izin (permission request) ke pengguna secara eksplisit",
        "Menyalakan ulang smartphone",
        "Mengubah ekstensi file menjadi .apk",
      ],
      answer: 1,
      explanation:
        "Sistem operasi mobile mewajibkan perizinan runtime sebelum mengizinkan aplikasi mengakses kamera, file galeri, atau sensor GPS.",
    },
    tugas: {
      title: "Presensi Berbasis Foto & Lokasi GPS",
      description:
        "Buat modul 'Presensi Mandiri': ambil foto selfie pengguna via kamera dan sertakan koordinat GPS (Latitude/Longitude) saat tombol kirim ditekan.",
      rubrik: [
        { criteria: "Handling permission kamera & lokasi aman", bobot: "40%" },
        { criteria: "Foto & koordinat GPS berhasil ditangkap", bobot: "40%" },
        { criteria: "Tampilan review sebelum submit", bobot: "20%" },
      ],
    },
  },
  {
    no: 13,
    phase: "Native & Build",
    title: "Animasi & Optimasi Performance",
    sks: "3 SKS",
    cpmk: "CPMK2 & CPMK6: Animasi 60 FPS dan optimasi rendering",
    goal: "Mahasiswa mampu membuat animasi transisi halus dengan Animated API (useNativeDriver: true) dan mengoptimasi FlatList.",
    outputPraktikum: "Aplikasi dengan animasi Fade/Slide dan optimasi memoization (React.memo, useMemo)",
    materiTeori: [
      {
        title: "Animated API & useNativeDriver",
        points: [
          "`Animated.timing(val, { toValue: 1, duration: 800, useNativeDriver: true })`",
          "`useNativeDriver: true`: Animasi dijalankan di thread Native OS tanpa bergantung pada JS Thread.",
          "Mencegah animasi patah-patah saat JS Thread sedang sibuk melakukan perhitungan.",
        ],
        explanation: "Selalu aktifkan useNativeDriver untuk properti transform (scale, translate) dan opacity.",
      },
      {
        title: "Optimasi FlatList untuk List Panjang",
        points: [
          "`getItemLayout`: Menghindari kalkulasi dinamis tinggi tiap baris list.",
          "`windowSize`: Mengatur jumlah viewport yang dipertahankan di memori.",
          "`React.memo()`: Mencegah re-render baris item jika props tidak berubah.",
        ],
        explanation: "Aplikasi mobile profesional tidak boleh lag saat scrolling ribuan data.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Inisialisasi Animated.Value",
        desc: "Gunakan `useRef(new Animated.Value(0)).current` agar instance tidak dibuat ulang tiap render.",
      },
      {
        step: 2,
        title: "Jalankan Animasi Timing",
        desc: "Picu `.start()` di dalam callback event atau useEffect.",
      },
    ],
    files: [
      {
        name: "components/FadeInBox.js",
        lang: "javascript",
        description: "Komponen animasi fade-in dengan native driver",
        code: `import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export default function FadeInBox({ children }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  return <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>;
}`,
      },
    ],
    simId: "animated-performance",
    quiz: {
      question: "Mengapa opsi `useNativeDriver: true` sangat penting dalam animasi React Native?",
      options: [
        "Animasi langsung diproses di UI Native Thread sehingga tetap mulus 60 FPS meski JS Thread sibuk",
        "Menghapus kebutuhan kode CSS",
        "Mengubah warna teks otomatis",
        "Membuat ukuran file APK menjadi 0 MB",
      ],
      answer: 0,
      explanation:
        "useNativeDriver mentransfer konfigurasi animasi ke thread UI native sebelum animasi dimulai, sehingga tidak terpengaruh lag di JS thread.",
    },
    tugas: {
      title: "Animasi Transisi Kartu & Profil",
      description:
        "Terapkan animasi Fade dan Slide-in pada kartu detail produk dan pastikan scrolling FlatList 100+ item tetap lancar tanpa frame drop.",
      rubrik: [
        { criteria: "Penerapan Animated API dengan useNativeDriver", bobot: "50%" },
        { criteria: "Kelancaran 60 FPS dan optimasi FlatList", bobot: "30%" },
        { criteria: "Penggunaan React.memo / useCallback", bobot: "20%" },
      ],
    },
  },
  {
    no: 14,
    phase: "Native & Build",
    title: "Testing, Debugging & Build (EAS Build)",
    sks: "3 SKS",
    cpmk: "CPMK5: Debugging aplikasi dan build APK Android menggunakan Expo Application Services (EAS)",
    goal: "Mahasiswa memahami teknik debugging modern dan berhasil men-generate file APK Android mandiri menggunakan EAS Build.",
    outputPraktikum: "File APK Android siap install di smartphone fisik",
    materiTeori: [
      {
        title: "Debugging Tools di React Native",
        points: [
          "React Native DevTools & Chrome Inspect.",
          "Error Boundary: Menangkap crash tak terduga dan menampilkan pesan fallback ramah user.",
          "Console logs & network monitoring.",
        ],
        explanation: "Kemampuan debugging membedakan developer amatir dengan insinyur software handal.",
      },
      {
        title: "Apa itu EAS Build (Expo Application Services)?",
        points: [
          "Cloud build service yang mengompilasi APK/AAB di server cloud tanpa membebani laptop mahasiswa.",
          "Tidak perlu spek laptop dewa (RAM 16GB) untuk menjalankan build Gradle lokal.",
          "Output: Link download file APK siap install langsung di smartphone Android.",
        ],
        explanation: "EAS Build adalah solusi resmi Expo untuk continuous integration and deployment.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Install EAS CLI & Login",
        command: "npm install -g eas-cli\neas login",
        desc: "Login dengan akun Expo. Buat akun gratis di expo.dev jika belum punya.",
      },
      {
        step: 2,
        title: "Konfigurasi eas.json untuk Build APK",
        command: "eas build:configure",
        desc: "Pilih profile preview dengan buildType 'apk' agar bisa di-install langsung tanpa Google Play Console.",
      },
      {
        step: 3,
        title: "Jalankan Build Cloud",
        command: "eas build -p android --profile preview",
        desc: "Tunggu antrean build di cloud Expo. Link download APK akan muncul di terminal setelah selesai.",
      },
    ],
    files: [
      {
        name: "eas.json",
        lang: "json",
        description: "Konfigurasi build cloud EAS",
        code: `{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}`,
      },
    ],
    simId: "eas-build-apk",
    quiz: {
      question: "Pengaturan apa di file eas.json yang menghasilkan file APK langsung (bukan format AAB Play Store)?",
      options: [
        '"buildType": "apk"',
        '"format": "zip"',
        '"platform": "windows"',
        '"export": "html"',
      ],
      answer: 0,
      explanation:
        "Secara default production menghasilkan AAB (Android App Bundle). Mengatur buildType: 'apk' di profile preview menghasilkan file APK yang bisa langsung di-sideload ke HP.",
    },
    tugas: {
      title: "Build APK Android Mandiri",
      description:
        "Lakukan build APK aplikasi yang sedang dikembangkan menggunakan EAS Build. Unduh dan install di smartphone Android fisik, lalu buat video pengujian.",
      rubrik: [
        { criteria: "Konfigurasi eas.json benar", bobot: "30%" },
        { criteria: "Build cloud berhasil menghasilkan APK", bobot: "40%" },
        { criteria: "Laporan uji coba install di HP fisik", bobot: "30%" },
      ],
    },
  },
  {
    no: 15,
    phase: "UAS",
    title: "MINI PROJECT 2 / FINAL PROJECT LAB",
    sks: "3 SKS (Full Lab Session)",
    cpmk: "CPMK6: Finalisasi rancangan aplikasi akhir terintegrasi",
    goal: "Finalisasi arsitektur Final Project: integrasi auth, navigasi bertingkat, backend CRUD, fitur native, dan styling profesional.",
    outputPraktikum: "Aplikasi Final Project lengkap dengan seluruh kriteria checklist siap diuji",
    materiTeori: [
      {
        title: "Checklist Spesifikasi Final Project (Wajib)",
        points: [
          "1. Autentikasi: Login / Register dengan validasi & session.",
          "2. Navigasi: Nested Navigator (Tab + Stack).",
          "3. State Management: Global Context API / Redux.",
          "4. Integrasi Backend: CRUD penuh (Cloud / REST API).",
          "5. Fitur Hardware Native: Minimal 1 (Kamera, Lokasi GPS, atau Notifikasi).",
          "6. Build: Berhasil di-build menjadi APK via EAS Build.",
        ],
        explanation: "Proyek akhir mencerminkan kesiapan mahasiswa untuk terjun ke industri mobile developer.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Checklist Kelengkapan Fitur",
        desc: "Uji setiap fitur di smartphone fisik untuk memastikan tidak ada fatal crash.",
      },
      {
        step: 2,
        title: "Optimasi Clean Code & Linter",
        desc: "Rapikan struktur folder, bersihkan console.log yang tidak perlu, dan lengkapi README.",
      },
    ],
    files: [
      {
        name: "FINAL-CHECKLIST.md",
        lang: "javascript",
        description: "Checklist verifikasi sebelum UAS",
        code: `# Final Project Checklist
- [x] Login & Register (Auth Flow)
- [x] Multi-Screen Navigation (Tab + Stack)
- [x] Global State (Context API)
- [x] REST / Cloud Database CRUD
- [x] Native Feature (Camera / GPS)
- [x] EAS Build APK Sukses
- [x] Slide Presentasi Siap`,
      },
    ],
    simId: "final-project-lab",
    quiz: {
      question: "Berapa minimal fitur hardware native yang wajib diimplementasikan pada Final Project?",
      options: ["Minimal 1 (Kamera, Lokasi, atau Notifikasi)", "Harus semua 10 sensor", "Tidak boleh ada fitur native", "Hanya boleh webview"],
      answer: 0,
      explanation:
        "Sesuai spesifikasi RPS, Final Project wajib mengintegrasikan minimal 1 fitur native device (kamera, lokasi GPS, atau notifikasi).",
    },
    tugas: {
      title: "Pemeriksaan Pra-UAS (Checklist)",
      description: "Dosen memeriksa checklist kesiapan aplikasi setiap kelompok/individu di sesi lab.",
      rubrik: [
        { criteria: "Kelengkapan checklist fitur wajib", bobot: "50%" },
        { criteria: "Kemajuan file APK", bobot: "30%" },
        { criteria: "Struktur repository GitHub", bobot: "20%" },
      ],
    },
  },
  {
    no: 16,
    phase: "UAS",
    title: "UAS (Presentasi & Demo Final Project)",
    sks: "3 SKS",
    cpmk: "CPMK6: Presentasi, demo produk, dan pertanggungjawaban teknis aplikasi",
    goal: "Mahasiswa mempresentasikan karya aplikasi, mendemonstrasikan APK di smartphone penguji, dan menjawab pertanyaan teknis arsitektur kode.",
    outputPraktikum: "Presentasi produk, live demo APK di HP, dan pengumpulan berkas akhir",
    materiTeori: [
      {
        title: "Format Sidang / Demo UAS (15 Menit)",
        points: [
          "5 Menit: Presentasi slide (Latar belakang masalah, arsitektur sistem, dan stack teknologi).",
          "5 Menit: Live demo interaktif aplikasi langsung dari smartphone Android.",
          "5 Menit: Tanya jawab teknis seputar keputusan arsitektur, clean code, dan error handling.",
        ],
        explanation: "Kecakapan komunikasi teknis sama pentingnya dengan kemampuan koding.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Koneksikan Layar HP ke Proyektor / Screen Share",
        desc: "Gunakan scrcpy atau mirroring untuk menampilkan interaksi layar aplikasi.",
      },
      {
        step: 2,
        title: "Demonstrasikan Skenario Pengguna Lengkap",
        desc: "Mulai dari register, login, navigasi, CRUD data, pengambilan foto/lokasi, hingga logout.",
      },
    ],
    files: [
      {
        name: "UAS-SUBMISSION.md",
        lang: "javascript",
        description: "Format berkas pengumpulan akhir",
        code: `# Pengumpulan UAS Sistem Aplikasi Lintas Platform
**Nama Kelompok:** Mobile Squad
**Link Repo GitHub:** https://github.com/...
**Link Download APK (EAS):** https://expo.dev/artifacts/...
**Link Video Demo YouTube:** https://youtu.be/...
**Laporan PDF:** Terlampir di LMS`,
      },
    ],
    simId: "uas-showcase",
    quiz: {
      question: "Komponen penilaian apa yang memiliki bobot tertinggi pada rubrik penilaian UAS?",
      options: [
        "Kelengkapan fitur sesuai spesifikasi (30%)",
        "Warna tema slide presentasi",
        "Jumlah baris komentar di kode",
        "Nama project yang paling panjang",
      ],
      answer: 0,
      explanation:
        "Kelengkapan fitur sesuai spesifikasi RPS memiliki bobot tertinggi (30%), diikuti kualitas kode (20%), presentasi (20%), UI/UX (15%), dan fungsionalitas build APK (15%).",
    },
    tugas: {
      title: "Pengumpulan Berkas Akhir UAS",
      description: "Kumpulkan link repository GitHub, link download file APK EAS Build, dan laporan PDF lengkap.",
      rubrik: [
        { criteria: "Kelengkapan Fitur sesuai spesifikasi RPS", bobot: "30%" },
        { criteria: "Kualitas Kode & Best Practices", bobot: "20%" },
        { criteria: "Presentasi & Penguasaan Materi", bobot: "20%" },
        { criteria: "UI/UX & Desain Responsif", bobot: "15%" },
        { criteria: "Fungsionalitas APK (jalan tanpa crash)", bobot: "15%" },
      ],
    },
  },
];
