export type Role = 'admin' | 'perangkat' | 'viewer';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  jabatan: string;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
}

export type JenisKelamin = 'Laki-laki' | 'Perempuan';
export type StatusPerkawinan = 'Kawin' | 'Belum Kawin' | 'Cerai Hidup' | 'Cerai Mati';
export type StatusKependudukan = 'Tetap' | 'Sementara' | 'Pindah' | 'Meninggal';
export type Agama = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';

export interface Penduduk {
  id: string;
  nik: string;
  noKk: string;
  namaLengkap: string;
  jenisKelamin: JenisKelamin;
  tempatLahir: string;
  tanggalLahir: string;
  agama: Agama;
  pendidikan: string;
  pekerjaan: string;
  statusPerkawinan: StatusPerkawinan;
  statusKependudukan: StatusKependudukan;
  dusun: string;
  rt: string;
  rw: string;
  alamatLengkap: string;
  golonganDarah?: string;
  kewarganegaraan: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KartuKeluarga {
  id: string;
  noKk: string;
  namaKepalaKeluarga: string;
  nikKepala: string;
  alamat: string;
  dusun: string;
  rt: string;
  rw: string;
  jumlahAnggota: number;
  tanggalDiterbitkan: string;
}

export type JenisMutasi = 'Lahir' | 'Pendatang' | 'Pindah' | 'Kematian';

export interface MutasiPenduduk {
  id: string;
  nik: string;
  nama: string;
  jenisMutasi: JenisMutasi;
  tanggalPeristiwa: string;
  nomorSurat: string;
  keterangan: string;
  dusun: string;
  dicatatOleh: string;
  createdAt: string;
}

export type KondisiInfrastruktur = 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat';
export type KategoriInfrastruktur =
  | 'Jalan Aspal'
  | 'Jalan Beton'
  | 'Jalan Tanah'
  | 'Jembatan'
  | 'Gedung Pemerintahan'
  | 'Balai Desa'
  | 'Sekolah'
  | 'Posyandu & Fasilitas Kesehatan'
  | 'Fasilitas Umum Lainnya'
  | 'Irigasi & Drainase';

export interface Infrastruktur {
  id: string;
  nama: string;
  kategori: KategoriInfrastruktur;
  lokasi: string;
  dusun: string;
  kondisi: KondisiInfrastruktur;
  tahunPembangunan: number;
  dimensi: string; // misal: "Panjang 1.200 m, Lebar 3.5 m" atau "Luas 450 m²"
  sumberAnggaran: string;
  anggaran: number;
  latitude: number;
  longitude: number;
  foto?: string;
  keterangan: string;
}

export interface LembagaDesa {
  id: string;
  nama: string;
  singkatan: string;
  ketua: string;
  deskripsi: string;
  jumlahAnggota: number;
  periode: string;
  kontak: string;
  statusAktif: boolean;
  skPengangkatan: string;
  logoIcon?: string;
}

export interface AnggotaLembaga {
  id: string;
  lembagaId: string;
  nama: string;
  jabatan: string;
  kontak: string;
  periode: string;
}

export type KategoriUMKM =
  | 'Kuliner & Makanan Olahan'
  | 'Pertanian & Perkebunan'
  | 'Kerajinan Tangan'
  | 'Jasa & Perbengkelan'
  | 'Perdagangan & Toko'
  | 'Peternakan & Perikanan';

export interface UMKM {
  id: string;
  namaUsaha: string;
  namaPemilik: string;
  nikPemilik?: string;
  kategori: KategoriUMKM;
  produkUtama: string;
  alamat: string;
  dusun: string;
  kontak: string;
  deskripsi: string;
  omsetBulanan?: number;
  foto?: string;
  statusAktif: boolean;
  tahunBerdiri: number;
}

export type KategoriAPBDes = 'Pendapatan' | 'Belanja' | 'Pembiayaan';

export interface APBDesItem {
  id: string;
  kodeRekening: string;
  kategori: KategoriAPBDes;
  uraian: string;
  tahunAnggaran: number;
  anggaran: number;
  realisasi: number;
  keterangan?: string;
}

export type KategoriAset =
  | 'Tanah Kas Desa'
  | 'Gedung dan Bangunan'
  | 'Peralatan dan Mesin'
  | 'Jalan, Irigasi dan Jaringan'
  | 'Aset Tetap Lainnya'
  | 'Kendaraan Dinas';

export type StatusKepemilikan = 'Hak Milik Desa' | 'Hibah' | 'Penguasaan Negara' | 'Sewa';

export interface AsetDesa {
  id: string;
  kodeAset: string;
  namaAset: string;
  kategori: KategoriAset;
  lokasi: string;
  tahunPerolehan: number;
  nilaiPerolehan: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  statusKepemilikan: StatusKepemilikan;
  sumberPerolehan: string;
  foto?: string;
  keterangan: string;
  terakhirDiperiksa: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  kategori: 'Pemerintahan' | 'Pembangunan' | 'Sosial & Bantuan' | 'Kesehatan' | 'Kegiatan Desa';
  tanggalPublikasi: string;
  fotoSampul?: string;
  status: 'Dipublikasikan' | 'Draft' | 'Diarsipkan';
  penulis: string;
  ringkasan: string;
}

export interface AgendaDesa {
  id: string;
  judul: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  penyelenggara: string;
  keterangan: string;
}

export interface PetaLokasi {
  id: string;
  nama: string;
  kategori: 'Kantor Pemerintahan' | 'Fasilitas Umum' | 'Kesehatan' | 'Pendidikan' | 'Infrastruktur' | 'UMKM Unggulan';
  latitude: number;
  longitude: number;
  deskripsi: string;
  alamat: string;
  dusun: string;
  kontak?: string;
}

export interface PolaRuang {
  id: string;
  kodeZona: string;
  namaZona: string;
  kategori: 'Kawasan Permukiman' | 'Pertanian Lahan Basah' | 'Kawasan Konservasi & Resapan' | 'Pusat Usaha & Jasa';
  luasHa: number;
  warnaHex: string;
  deskripsi: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  target: string;
  timestamp: string;
  ipAddress?: string;
}
