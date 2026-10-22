-- ============================================================================
-- SIMPANDADU - Sistem Informasi Perencanaan dan Administrasi Desa Adimulya Terpadu
-- Database: MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4 COLLATE utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `simpandadu_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `simpandadu_db`;

-- 1. ROLES
CREATE TABLE IF NOT EXISTS `roles` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `roles` (`id`, `role_name`, `display_name`, `description`) VALUES
('r-1', 'admin', 'Administrator Utama', 'Akses penuh seluruh modul sistem SIMPANDADU'),
('r-2', 'perangkat', 'Perangkat Desa', 'Pengelolaan data kependudukan, keuangan, dan infrastruktur'),
('r-3', 'viewer', 'Masyarakat / Pengawas', 'Akses baca dan laporan publik desa')
ON DUPLICATE KEY UPDATE `display_name`=VALUES(`display_name`);

-- 2. USERS
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `role_id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `jabatan` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `avatar` VARCHAR(255) NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. WILAYAH DESA (DUSUN, RW, RT)
CREATE TABLE IF NOT EXISTS `wilayah_desa` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `nama_dusun` VARCHAR(100) NOT NULL,
  `kode_dusun` VARCHAR(20) NOT NULL UNIQUE,
  `kepala_dusun` VARCHAR(150) NOT NULL,
  `jumlah_rw` INT NOT NULL DEFAULT 0,
  `jumlah_rt` INT NOT NULL DEFAULT 0,
  `luas_wilayah_ha` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. KARTU KELUARGA
CREATE TABLE IF NOT EXISTS `kartu_keluarga` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `no_kk` VARCHAR(16) NOT NULL UNIQUE,
  `nama_kepala_keluarga` VARCHAR(150) NOT NULL,
  `nik_kepala` VARCHAR(16) NOT NULL,
  `alamat` VARCHAR(255) NOT NULL,
  `dusun` VARCHAR(100) NOT NULL,
  `rt` VARCHAR(5) NOT NULL,
  `rw` VARCHAR(5) NOT NULL,
  `jumlah_anggota` INT NOT NULL DEFAULT 1,
  `tanggal_diterbitkan` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_kk_nomor` (`no_kk`),
  INDEX `idx_kk_dusun` (`dusun`)
) ENGINE=InnoDB;

-- 5. PENDUDUK
CREATE TABLE IF NOT EXISTS `penduduk` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `nik` VARCHAR(16) NOT NULL UNIQUE,
  `no_kk` VARCHAR(16) NOT NULL,
  `nama_lengkap` VARCHAR(150) NOT NULL,
  `jenis_kelamin` ENUM('Laki-laki', 'Perempuan') NOT NULL,
  `tempat_lahir` VARCHAR(100) NOT NULL,
  `tanggal_lahir` DATE NOT NULL,
  `agama` ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu') NOT NULL DEFAULT 'Islam',
  `pendidikan` VARCHAR(100) NOT NULL,
  `pekerjaan` VARCHAR(100) NOT NULL,
  `status_perkawinan` ENUM('Kawin', 'Belum Kawin', 'Cerai Hidup', 'Cerai Mati') NOT NULL,
  `status_kependudukan` ENUM('Tetap', 'Sementara', 'Pindah', 'Meninggal') NOT NULL DEFAULT 'Tetap',
  `dusun` VARCHAR(100) NOT NULL,
  `rt` VARCHAR(5) NOT NULL,
  `rw` VARCHAR(5) NOT NULL,
  `alamat_lengkap` TEXT NOT NULL,
  `golongan_darah` VARCHAR(5) NULL,
  `kewarganegaraan` VARCHAR(10) NOT NULL DEFAULT 'WNI',
  `foto` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_penduduk_nik` (`nik`),
  INDEX `idx_penduduk_nama` (`nama_lengkap`),
  INDEX `idx_penduduk_dusun` (`dusun`),
  INDEX `idx_penduduk_kk` (`no_kk`)
) ENGINE=InnoDB;

-- 6. MUTASI PENDUDUK
CREATE TABLE IF NOT EXISTS `mutasi_penduduk` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `penduduk_id` VARCHAR(36) NULL,
  `nik` VARCHAR(16) NOT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `jenis_mutasi` ENUM('Lahir', 'Pendatang', 'Pindah', 'Kematian') NOT NULL,
  `tanggal_peristiwa` DATE NOT NULL,
  `nomor_surat` VARCHAR(100) NOT NULL,
  `keterangan` TEXT NOT NULL,
  `dusun` VARCHAR(100) NOT NULL,
  `dicatat_oleh` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_mutasi_nik` (`nik`),
  INDEX `idx_mutasi_jenis` (`jenis_mutasi`)
) ENGINE=InnoDB;

-- 7. INFRASTRUKTUR
CREATE TABLE IF NOT EXISTS `infrastruktur` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `nama` VARCHAR(200) NOT NULL,
  `kategori` VARCHAR(100) NOT NULL,
  `lokasi` VARCHAR(255) NOT NULL,
  `dusun` VARCHAR(100) NOT NULL,
  `kondisi` ENUM('Baik', 'Rusak Ringan', 'Rusak Sedang', 'Rusak Berat') NOT NULL DEFAULT 'Baik',
  `tahun_pembangunan` INT NOT NULL,
  `dimensi` VARCHAR(150) NOT NULL,
  `sumber_anggaran` VARCHAR(150) NOT NULL,
  `anggaran` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `foto` VARCHAR(255) NULL,
  `keterangan` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_inf_kategori` (`kategori`),
  INDEX `idx_inf_kondisi` (`kondisi`)
) ENGINE=InnoDB;

-- 8. LEMBAGA DESA
CREATE TABLE IF NOT EXISTS `lembaga` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `nama` VARCHAR(200) NOT NULL,
  `singkatan` VARCHAR(50) NOT NULL,
  `ketua` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `jumlah_anggota` INT NOT NULL DEFAULT 0,
  `periode` VARCHAR(50) NOT NULL,
  `kontak` VARCHAR(50) NOT NULL,
  `status_aktif` BOOLEAN DEFAULT TRUE,
  `sk_pengangkatan` VARCHAR(150) NOT NULL,
  `logo_icon` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. ANGGOTA LEMBAGA
CREATE TABLE IF NOT EXISTS `anggota_lembaga` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `lembaga_id` VARCHAR(36) NOT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `jabatan` VARCHAR(100) NOT NULL,
  `kontak` VARCHAR(50) NULL,
  `periode` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lembaga_id`) REFERENCES `lembaga`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. UMKM
CREATE TABLE IF NOT EXISTS `umkm` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `nama_usaha` VARCHAR(200) NOT NULL,
  `nama_pemilik` VARCHAR(150) NOT NULL,
  `nik_pemilik` VARCHAR(16) NULL,
  `kategori` VARCHAR(100) NOT NULL,
  `produk_utama` TEXT NOT NULL,
  `alamat` VARCHAR(255) NOT NULL,
  `dusun` VARCHAR(100) NOT NULL,
  `kontak` VARCHAR(50) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `omset_bulanan` DECIMAL(15,2) DEFAULT 0.00,
  `foto` VARCHAR(255) NULL,
  `status_aktif` BOOLEAN DEFAULT TRUE,
  `tahun_berdiri` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_umkm_kategori` (`kategori`)
) ENGINE=InnoDB;

-- 11. ANGGARAN & REALISASI DESA (APBDES)
CREATE TABLE IF NOT EXISTS `anggaran_desa` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `kode_rekening` VARCHAR(50) NOT NULL,
  `kategori` ENUM('Pendapatan', 'Belanja', 'Pembiayaan') NOT NULL,
  `uraian` VARCHAR(255) NOT NULL,
  `tahun_anggaran` INT NOT NULL,
  `anggaran` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `realisasi` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `keterangan` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_anggaran_tahun` (`tahun_anggaran`),
  INDEX `idx_anggaran_kategori` (`kategori`)
) ENGINE=InnoDB;

-- 12. ASET DESA
CREATE TABLE IF NOT EXISTS `aset_desa` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `kode_aset` VARCHAR(50) NOT NULL UNIQUE,
  `nama_aset` VARCHAR(200) NOT NULL,
  `kategori` VARCHAR(100) NOT NULL,
  `lokasi` VARCHAR(255) NOT NULL,
  `tahun_perolehan` INT NOT NULL,
  `nilai_perolehan` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `kondisi` ENUM('Baik', 'Rusak Ringan', 'Rusak Berat') NOT NULL DEFAULT 'Baik',
  `status_kepemilikan` VARCHAR(100) NOT NULL,
  `sumber_perolehan` VARCHAR(150) NOT NULL,
  `foto` VARCHAR(255) NULL,
  `keterangan` TEXT NULL,
  `terakhir_diperiksa` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_aset_kode` (`kode_aset`),
  INDEX `idx_aset_kategori` (`kategori`)
) ENGINE=InnoDB;

-- 13. PENGUMUMAN DAN BERITA
CREATE TABLE IF NOT EXISTS `pengumuman` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `isi` LONGTEXT NOT NULL,
  `ringkasan` TEXT NOT NULL,
  `kategori` VARCHAR(100) NOT NULL,
  `tanggal_publikasi` DATE NOT NULL,
  `foto_sampul` VARCHAR(255) NULL,
  `status` ENUM('Dipublikasikan', 'Draft', 'Diarsipkan') NOT NULL DEFAULT 'Dipublikasikan',
  `penulis` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_pengumuman_status` (`status`)
) ENGINE=InnoDB;

-- 14. AGENDA DESA
CREATE TABLE IF NOT EXISTS `agenda` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `tanggal` DATE NOT NULL,
  `waktu` VARCHAR(50) NOT NULL,
  `lokasi` VARCHAR(255) NOT NULL,
  `penyelenggara` VARCHAR(150) NOT NULL,
  `keterangan` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 15. PETA DAN TATA RUANG
CREATE TABLE IF NOT EXISTS `pola_ruang` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `kode_zona` VARCHAR(20) NOT NULL UNIQUE,
  `nama_zona` VARCHAR(150) NOT NULL,
  `kategori` VARCHAR(100) NOT NULL,
  `luas_ha` DECIMAL(10,2) NOT NULL,
  `warna_hex` VARCHAR(10) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 16. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `target` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(50) NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_log_user` (`user_id`),
  INDEX `idx_log_module` (`module`)
) ENGINE=InnoDB;
