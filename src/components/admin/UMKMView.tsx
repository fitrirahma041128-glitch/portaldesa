import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { UMKM, KategoriUMKM } from '../../types';
import { exportToCSV, printOfficialDocument } from '../../utils/exportUtils';
import {
  Store,
  Plus,
  Search,
  Filter,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Printer,
  X,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const UMKMView: React.FC = () => {
  const { umkmList, addUMKM, updateUMKM, deleteUMKM } = useVillageData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<UMKM | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    namaUsaha: '',
    namaPemilik: '',
    nikPemilik: '',
    kategori: 'Kuliner & Makanan Olahan' as KategoriUMKM,
    produkUtama: '',
    alamat: '',
    dusun: 'Cisalak',
    kontak: '',
    deskripsi: '',
    omsetBulanan: 10000000,
    statusAktif: true,
    tahunBerdiri: 2022,
  });

  const filtered = umkmList.filter((u) => {
    const matchSearch =
      u.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.namaPemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.produkUtama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = filterKategori === 'Semua' || u.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenAdd = () => {
    setFormData({
      namaUsaha: '',
      namaPemilik: '',
      nikPemilik: '',
      kategori: 'Kuliner & Makanan Olahan',
      produkUtama: '',
      alamat: '',
      dusun: 'Cisalak',
      kontak: '0812-3456-7890',
      deskripsi: '',
      omsetBulanan: 10000000,
      statusAktif: true,
      tahunBerdiri: 2023,
    });
    setEditItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (u: UMKM) => {
    setEditItem(u);
    setFormData({
      namaUsaha: u.namaUsaha,
      namaPemilik: u.namaPemilik,
      nikPemilik: u.nikPemilik || '',
      kategori: u.kategori,
      produkUtama: u.produkUtama,
      alamat: u.alamat,
      dusun: u.dusun,
      kontak: u.kontak,
      deskripsi: u.deskripsi,
      omsetBulanan: u.omsetBulanan || 0,
      statusAktif: u.statusAktif,
      tahunBerdiri: u.tahunBerdiri,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      updateUMKM(editItem.id, formData);
    } else {
      addUMKM(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    exportToCSV('Data_UMKM_Desa_Adimulya', filtered);
  };

  const handlePrint = () => {
    let rows = '';
    filtered.forEach((u, idx) => {
      rows += `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${u.namaUsaha}</strong></td>
          <td>${u.namaPemilik}</td>
          <td>${u.kategori}</td>
          <td>${u.produkUtama}</td>
          <td>${u.dusun} (${u.alamat})</td>
          <td>${formatRupiah(u.omsetBulanan || 0)}</td>
          <td>${u.kontak}</td>
        </tr>
      `;
    });
    const content = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Usaha</th>
            <th>Pemilik Usaha</th>
            <th>Kategori</th>
            <th>Produk Utama</th>
            <th>Dusun & Alamat</th>
            <th>Omset / Bulan</th>
            <th>Kontak</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    printOfficialDocument(
      'DIREKTORI PELAKU USAHA MIKRO KECIL DAN MENENGAH (UMKM) DESA ADIMULYA',
      'Ekonomi & Pemberdayaan',
      content
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Direktori Ekonomi & UMKM Desa
          </h2>
          <p className="text-xs text-slate-500">
            Pendataan pelaku usaha mikro, kecil, produk unggulan lokal, dan potensi ekonomi Desa Adimulya
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Ekspor CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Cetak Direktori
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Daftarkan UMKM
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari UMKM, pemilik, atau produk..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Kategori Usaha</option>
            <option value="Kuliner & Makanan Olahan">Kuliner & Makanan</option>
            <option value="Pertanian & Perkebunan">Pertanian & Perkebunan</option>
            <option value="Kerajinan Tangan">Kerajinan Tangan</option>
            <option value="Jasa & Perbengkelan">Jasa & Bengkel</option>
            <option value="Perdagangan & Toko">Perdagangan & Toko</option>
            <option value="Peternakan & Perikanan">Peternakan & Perikanan</option>
          </select>
        </div>
      </div>

      {/* Cards of MSMEs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {u.kategori}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Aktif
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                {u.namaUsaha}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pemilik: <span className="text-slate-800 font-semibold">{u.namaPemilik}</span>
              </p>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  Produk Unggulan:
                </span>
                <p className="font-medium text-slate-800">{u.produkUtama}</p>
              </div>

              <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {u.deskripsi}
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{u.alamat}, Dusun {u.dusun}</span>
                </p>
                <p className="flex items-center gap-1.5 font-mono text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{u.kontak}</span>
                </p>
                {u.omsetBulanan && (
                  <p className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500">Omset Rata-rata:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatRupiah(u.omsetBulanan)} / bln
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://wa.me/${u.kontak.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(u)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                  title="Edit UMKM"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus data usaha ${u.namaUsaha}?`)) {
                      deleteUMKM(u.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Hapus UMKM"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT UMKM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editItem ? 'Edit Data UMKM' : 'Daftarkan Usaha UMKM Baru'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Usaha / Merek*</label>
                <input
                  type="text"
                  value={formData.namaUsaha}
                  onChange={(e) => setFormData({ ...formData, namaUsaha: e.target.value })}
                  placeholder="Misal: Madu Hutan Wanareja"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Pemilik*</label>
                  <input
                    type="text"
                    value={formData.namaPemilik}
                    onChange={(e) => setFormData({ ...formData, namaPemilik: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Usaha</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriUMKM })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Kuliner & Makanan Olahan">Kuliner & Makanan Olahan</option>
                    <option value="Pertanian & Perkebunan">Pertanian & Perkebunan</option>
                    <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                    <option value="Jasa & Perbengkelan">Jasa & Perbengkelan</option>
                    <option value="Perdagangan & Toko">Perdagangan & Toko</option>
                    <option value="Peternakan & Perikanan">Peternakan & Perikanan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Produk atau Layanan Utama*</label>
                <input
                  type="text"
                  value={formData.produkUtama}
                  onChange={(e) => setFormData({ ...formData, produkUtama: e.target.value })}
                  placeholder="Contoh: Gula semut aren, sirup aren kemasan"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dusun</label>
                  <select
                    value={formData.dusun}
                    onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Cisalak">Cisalak</option>
                    <option value="Cihandiwung Lor">Cihandiwung Lor</option>
                    <option value="Cukangleles Kidul">Cukangleles Kidul</option>
                    <option value="Cidulang">Cidulang</option>
                    <option value="Cilatar">Cilatar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kontak WhatsApp / Telp</label>
                  <input
                    type="text"
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    placeholder="0812-..."
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Rinci</label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jl. Raya Adimulya No. ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimasi Omset Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={formData.omsetBulanan}
                    onChange={(e) => setFormData({ ...formData, omsetBulanan: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Berdiri</label>
                  <input
                    type="number"
                    value={formData.tahunBerdiri}
                    onChange={(e) => setFormData({ ...formData, tahunBerdiri: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat Usaha</label>
                <textarea
                  rows={2}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Deskripsi keunggulan produk..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan UMKM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
