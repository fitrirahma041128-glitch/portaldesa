import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { AsetDesa, KategoriAset, StatusKepemilikan } from '../../types';
import { exportToCSV, printOfficialDocument } from '../../utils/exportUtils';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Printer,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AsetDesaView: React.FC = () => {
  const { asetList, addAset, updateAset, deleteAset } = useVillageData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AsetDesa | null>(null);

  const [formData, setFormData] = useState({
    kodeAset: '',
    namaAset: '',
    kategori: 'Gedung dan Bangunan' as KategoriAset,
    lokasi: '',
    tahunPerolehan: 2023,
    nilaiPerolehan: 50000000,
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
    statusKepemilikan: 'Hak Milik Desa' as StatusKepemilikan,
    sumberPerolehan: 'APBDes',
    keterangan: '',
    terakhirDiperiksa: new Date().toISOString().slice(0, 10),
  });

  const filtered = asetList.filter((a) => {
    const matchSearch =
      a.namaAset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.kodeAset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = filterKategori === 'Semua' || a.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const totalNilaiAset = asetList.reduce((sum, a) => sum + a.nilaiPerolehan, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenAdd = () => {
    setFormData({
      kodeAset: `AST-${Date.now().toString().slice(-4)}`,
      namaAset: '',
      kategori: 'Gedung dan Bangunan',
      lokasi: 'Dusun Cilatar',
      tahunPerolehan: 2024,
      nilaiPerolehan: 25000000,
      kondisi: 'Baik',
      statusKepemilikan: 'Hak Milik Desa',
      sumberPerolehan: 'Dana Desa APBDes',
      keterangan: '',
      terakhirDiperiksa: new Date().toISOString().slice(0, 10),
    });
    setEditItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (a: AsetDesa) => {
    setEditItem(a);
    setFormData({
      kodeAset: a.kodeAset,
      namaAset: a.namaAset,
      kategori: a.kategori,
      lokasi: a.lokasi,
      tahunPerolehan: a.tahunPerolehan,
      nilaiPerolehan: a.nilaiPerolehan,
      kondisi: a.kondisi,
      statusKepemilikan: a.statusKepemilikan,
      sumberPerolehan: a.sumberPerolehan,
      keterangan: a.keterangan || '',
      terakhirDiperiksa: a.terakhirDiperiksa,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      updateAset(editItem.id, formData);
    } else {
      addAset(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    exportToCSV('Buku_Inventaris_Aset_Desa_Adimulya', filtered);
  };

  const handlePrint = () => {
    let rows = '';
    filtered.forEach((a, idx) => {
      rows += `
        <tr>
          <td>${idx + 1}</td>
          <td><code>${a.kodeAset}</code></td>
          <td><strong>${a.namaAset}</strong></td>
          <td>${a.kategori}</td>
          <td>${a.lokasi}</td>
          <td>${a.tahunPerolehan}</td>
          <td>${a.kondisi}</td>
          <td>${a.statusKepemilikan}</td>
          <td style="text-align:right;">${formatRupiah(a.nilaiPerolehan)}</td>
        </tr>
      `;
    });

    const content = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode Barang</th>
            <th>Nama Barang / Aset</th>
            <th>Kategori</th>
            <th>Lokasi Keberadaan</th>
            <th>Tahun</th>
            <th>Kondisi</th>
            <th>Status Hak</th>
            <th>Nilai Perolehan (Rp)</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top: 15px; font-weight: bold; font-size: 11pt;">Total Rekapitulasi Nilai Aset: ${formatRupiah(totalNilaiAset)}</p>
    `;

    printOfficialDocument(
      'BUKU INVENTARISASI REKAPITULASI ASET MILIK DESA ADIMULYA',
      'Pengelolaan Aset Desa',
      content
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Inventarisasi & Manajemen Aset Desa
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan tanah kas desa, bangunan balai desa, kendaraan operasional, dan peralatan kantor
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
            Cetak Buku Aset
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Catat Aset Baru
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-xs border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block mb-1">
            Rekapitulasi Kekayaan Aset Milik Desa
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {formatRupiah(totalNilaiAset)}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Terdiri dari <span className="font-bold text-white">{asetList.length} item</span> aset tetap tercatat dan diawasi berkala.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Kondisi Baik</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              {asetList.filter((a) => a.kondisi === 'Baik').length} Item
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Dalam Pemeliharaan</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {asetList.filter((a) => a.kondisi !== 'Baik').length} Item
            </span>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama aset, kode, lokasi..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
            >
              <option value="Semua">Semua Kategori Aset</option>
              <option value="Tanah Kas Desa">Tanah Kas Desa</option>
              <option value="Gedung dan Bangunan">Gedung dan Bangunan</option>
              <option value="Kendaraan Dinas">Kendaraan Dinas</option>
              <option value="Peralatan dan Mesin">Peralatan dan Mesin</option>
              <option value="Jalan, Irigasi dan Jaringan">Jaringan & Irigasi</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Kode Aset</th>
                <th className="py-3 px-4">Nama Barang / Aset</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Lokasi Keberadaan</th>
                <th className="py-3 px-4">Tahun</th>
                <th className="py-3 px-4">Kondisi</th>
                <th className="py-3 px-4 text-right">Nilai Perolehan</th>
                <th className="py-3 px-4 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{a.kodeAset}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {a.namaAset}
                    {a.keterangan && (
                      <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                        {a.keterangan}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-blue-700 font-medium">{a.kategori}</td>
                  <td className="py-3 px-4 text-slate-600">{a.lokasi}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{a.tahunPerolehan}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.kondisi === 'Baik'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {a.kondisi}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatRupiah(a.nilaiPerolehan)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(a)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                        title="Edit Aset"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data aset ${a.namaAset}?`)) {
                            deleteAset(a.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Hapus Aset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT ASET */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editItem ? 'Edit Data Aset Desa' : 'Catat Aset Milik Desa'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Aset*</label>
                  <input
                    type="text"
                    value={formData.kodeAset}
                    onChange={(e) => setFormData({ ...formData, kodeAset: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Aset</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriAset })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Tanah Kas Desa">Tanah Kas Desa</option>
                    <option value="Gedung dan Bangunan">Gedung dan Bangunan</option>
                    <option value="Kendaraan Dinas">Kendaraan Dinas</option>
                    <option value="Peralatan dan Mesin">Peralatan dan Mesin</option>
                    <option value="Jalan, Irigasi dan Jaringan">Jalan & Irigasi</option>
                    <option value="Aset Tetap Lainnya">Aset Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Barang / Aset*</label>
                <input
                  type="text"
                  value={formData.namaAset}
                  onChange={(e) => setFormData({ ...formData, namaAset: e.target.value })}
                  placeholder="Misal: Truk Sampah Desa Roda Tiga"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lokasi Penempatan</label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Ruang pelayanan balai desa..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Perolehan</label>
                  <input
                    type="number"
                    value={formData.tahunPerolehan}
                    onChange={(e) => setFormData({ ...formData, tahunPerolehan: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nilai Perolehan (Rp)*</label>
                  <input
                    type="number"
                    value={formData.nilaiPerolehan}
                    onChange={(e) => setFormData({ ...formData, nilaiPerolehan: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kondisi Fisik</label>
                  <select
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Baik">Kondisi Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Nomor sertifikat, plat nomor kendaraan, nomor rangka..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
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
                  Simpan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
