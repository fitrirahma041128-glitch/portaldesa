# PANDUAN KONEKSI DATABASE MYSQL — SIMPANDADU DESA ADIMULYA

Aplikasi **SIMPANDADU** dirancang menggunakan arsitektur full-stack modern. Dokumen ini menjelaskan cara mengimpor skema database ke server MySQL nyata, mengonfigurasi variabel lingkungan, dan menghubungkan backend API.

---

## 1. Persyaratan Sistem
- **Node.js**: v18.0.0 ke atas
- **MySQL Server**: v8.0+ atau **MariaDB**: v10.5+
- **Database Client**: phpMyAdmin, DBeaver, HeidiSQL, atau MySQL CLI

---

## 2. Cara Impor Skema Database

### Opsi A: Melalui Terminal / MySQL Command Line
```bash
# 1. Masuk ke MySQL prompt
mysql -u root -p

# 2. Buat database baru
CREATE DATABASE simpandadu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 3. Jalankan script import skema
mysql -u root -p simpandadu_db < src/db/schema.sql
```

### Opsi B: Melalui phpMyAdmin
1. Buka browser dan buka `http://localhost/phpmyadmin`
2. Klik tab **Databases**, buat database baru bernama `simpandadu_db` dengan collation `utf8mb4_unicode_ci`.
3. Pilih database `simpandadu_db`, klik tab **Import**.
4. Klik **Choose File** dan arahkan ke file `src/db/schema.sql`.
5. Klik tombol **Go / Kirim** di bagian bawah.

---

## 3. Konfigurasi Variabel Lingkungan (.env)

Buat atau edit file `.env` di direktori utama:

```env
# Port aplikasi backend
PORT=3000
NODE_ENV=development

# Konfigurasi Koneksi MySQL Server
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=simpandadu_db
DB_CONNECTION_LIMIT=10

# Keamanan Sesi & JWT
SESSION_SECRET=simpandadu_secret_key_adimulya_2025_secure
TOKEN_EXPIRY=8h
```

---

## 4. Akun Default Pengembang (Demo Development)

Sistem telah dilengkapi akun demo untuk demonstrasi dan evaluasi:

| Peran | Username | Password | Jabatan | Hak Akses |
|---|---|---|---|---|
| **Super Admin** | `admin` | `admin123` | Kepala Desa / Administrator | Penuh (Semua Modul & Pengaturan) |
| **Perangkat Desa** | `sekdes` | `sekdes123` | Sekretaris Desa | Kependudukan, Peta, Infrastruktur |
| **Kaur Keuangan** | `kaurkeu` | `kaurkeu123` | Kaur Keuangan | Laporan APBDes, Aset, UMKM |

> **PERINGATAN KEAMANAN**: Segera ubah password default saat sistem di-deploy ke server produksi melalui menu **Pengaturan Profil > Ganti Password**.

---

## 5. Fitur yang Berjalan
- Autentikasi sesi real-time & role-based routing (Admin, Perangkat Desa).
- CRUD Lengkap Data Penduduk (Validasi NIK, KK, tanggal lahir, status).
- Submodul Mutasi Penduduk (Kelahiran, Kedatangan, Kepindahan, Kematian).
- Ekspor Data ke format CSV, Excel dan Cetak Dokumen PDF resmi ber-Kop Surat.
- Manajemen Infrastruktur & Peta Interaktif Leaflet + OpenStreetMap.
- Monitoring APBDes (Pendapatan, Belanja, Pembiayaan, realisasi persentase otomatis).
- Inventaris Aset Desa dan Rekapitulasi Nilai Aset.
- Direktori UMKM Desa dengan rincian produk dan kontak pelaku usaha.
- Lembaga Desa (BPD, LPMD, PKK, Karang Taruna, RT/RW).
- Portal Informasi Publik untuk warga masyarakat.
