# Pertemuan 13 — Autentikasi Pengguna: Session PHP, Registrasi & Password Hashing

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 13 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK3:** Mahasiswa mampu mengimplementasikan sistem login, session management, dan enkripsi password hash (C3)

---

## 1. Problem Statement (PBL)
> *"Protokol HTTP bersifat 'Stateless' (pelupa): setiap kali browser meminta halaman baru, server tidak mengingat siapa kamu di halaman sebelumnya. Bagaimana cara server PHP mengenali bahwa pengguna sudah berhasil login dan menjaga status login tersebut saat berpindah-pindah menu?"*

---

## 2. Cara Kerja Session di PHP
1. **Inisialisasi Session:** Di baris paling atas skrip PHP, panggil fungsi `session_start();`.
2. **Kuki PHPSESSID:** Server PHP mengirimkan identifier acak melalui kuki browser.
3. **Penyimpanan di Server:** Data login disimpan di dalam array superglobal `$_SESSION['user_id'] = $user['id'];`.
4. **Validasi:** Di setiap halaman terproteksi, sistem memeriksa `if (!isset($_SESSION['logged_in']))`.

---

## 3. Keamanan Password Modern: `password_hash` & `password_verify`
**Peringatan Penting:** Jangan pernah menyimpan password dalam bentuk teks terbuka (*plaintext*) atau algoritma usang seperti `md5()` / `sha1()`.
- **Membuat Hash Password Baru:**
  ```php
  $hash = password_hash($password_input, PASSWORD_BCRYPT);
  ```
- **Memverifikasi Password saat Login:**
  ```php
  if (password_verify($password_input, $password_hash_dari_db)) {
      // Password Benar!
  }
  ```

---

## 4. Implementasi Halaman Login: `login.php`
```php
<?php
// login.php - Halaman Autentikasi Pengguna
session_start();
require_once "config/koneksi.php";
require_once "config/helpers.php";

// Jika sudah login, langsung lempar ke beranda
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    header("Location: index.php");
    exit;
}

$error = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = "Username dan password wajib diisi!";
    } else {
        // Cari user berdasarkan username
        $stmt = mysqli_prepare($conn, "SELECT id, username, password, nama_lengkap, role FROM users WHERE username = ?");
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);

        // Verifikasi kecocokan password hash
        if ($user && password_verify($password, $user['password'])) {
            // Set session login
            $_SESSION['logged_in']    = true;
            $_SESSION['user_id']      = $user['id'];
            $_SESSION['username']     = $user['username'];
            $_SESSION['nama_lengkap'] = $user['nama_lengkap'];
            $_SESSION['role']         = $user['role'];

            header("Location: index.php?pesan=" . urlencode("Selamat datang kembali, " . $user['nama_lengkap'] . "!"));
            exit;
        } else {
            $error = "Username atau password yang Anda masukkan salah!";
        }
    }
}

$judul_halaman = "Login Sistem - SIMPUS Mini";
require_once "templates/header.php";
?>

<div style="max-width: 400px; margin: 3rem auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; margin-bottom: 1.5rem;">Masuk ke SIMPUS-Mini</h2>

    <?php if (!empty($error)): ?>
        <div style="padding: 10px; background: #fee2e2; color: #991b1b; border: 1px solid #f87171; border-radius: 6px; margin-bottom: 1rem;">
            <?= esc($error) ?>
        </div>
    <?php endif; ?>

    <form action="login.php" method="POST">
        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Username:</label>
            <input type="text" name="username" required autofocus style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
        </div>

        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Password:</label>
            <input type="password" name="password" required style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
        </div>

        <button type="submit" style="width: 100%; background: #0284c7; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            Masuk Sekarang
        </button>
    </form>
</div>

<?php require_once "templates/footer.php"; ?>
```

---

## 5. Membuat Script Logout: `logout.php`
```php
<?php
// logout.php - Menghapus Session
session_start();
$_SESSION = [];
session_unset();
session_destroy();

header("Location: login.php?pesan=" . urlencode("Anda telah berhasil logout."));
exit;
?>
```

---

## 6. Tugas Praktikum (RTM-13)
1. Buat user admin default di phpMyAdmin dengan query:
   ```sql
   -- Password default: admin123
   INSERT INTO users (username, password, nama_lengkap, role) 
   VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator Utama', 'admin');
   ```
2. Buat file `login.php` dan `logout.php`.
3. Lakukan pengujian login dengan username `admin` dan password `admin123`.
