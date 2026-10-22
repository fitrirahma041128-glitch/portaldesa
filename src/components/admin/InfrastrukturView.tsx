import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { Infrastruktur, KondisiInfrastruktur, KategoriInfrastruktur } from '../../types';
import { exportToCSV, printOfficialDocument } from '../../utils/exportUtils';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Printer,
  X,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const InfrastrukturView: React.FC = () => {
  const {
    infrastrukturList,
    addInfrastruktur,
    updateInfrastruktur,
    deleteInfrastruktur,
  } = useVillageData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [filterKondisi, setFilterKondisi] = useState('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Infrastruktur | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<Infrastruktur | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Jalan Aspal' as KategoriInfrastruktur,
    lokasi: '',
    dusun: 'Cisalak',
    kondisi: 'Baik' as KondisiInfrastruktur,
    tahunPembangunan: 2024,
    dimensi: '',
    sumberAnggaran: 'Dana Desa (DDS)',
    anggaran: 100000000,
    latitude: -7.3245,
    longitude: 108.6872,
    keterangan: '',
  });

  const filtered = infrastrukturList.filter((inf) => {
    const matchSearch =
      inf.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.dusun.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = filterKategori === 'Semua' || inf.kategori === filterKategori;
    const matchKondisi = filterKondisi === 'Semua' || inf.kondisi === filterKondisi;
    return matchSearch && matchKategori && matchKondisi;
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
      nama: '',
      kategori: 'Jalan Aspal',
      lokasi: '',
      dusun: 'Cisalak',
      kondisi: 'Baik',
      tahunPembangunan: 2025,
      dimensi: 'Panjang 500 m x Lebar 3 m',
      sumberAnggaran: 'Dana Desa (DDS) 2025',
      anggaran: 150000000,
      latitude: -7.3245,
      longitude: 108.6872,
      keterangan: '',
    });
    setEditItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: Infrastruktur) => {
    setEditItem(item);
    setFormData({
      nama: item.nama,
      kategori: item.kategori,
      lokasi: item.lokasi,
      dusun: item.dusun,
      kondisi: item.kondisi,
      tahunPembangunan: item.tahunPembangunan,
      dimensi: item.dimensi,
      sumberAnggaran: item.sumberAnggaran,
      anggaran: item.anggaran,
      latitude: item.latitude,
      longitude: item.longitude,
      keterangan: item.keterangan || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      updateInfrastruktur(editItem.id, formData);
    } else {
      addInfrastruktur(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    exportToCSV('Data_Infrastruktur_Desa_Adimulya', filtered);
  };

  const handlePrint = () => {
    let rows = '';
    filtered.forEach((inf, idx) => {
      rows += `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${inf.nama}</strong></td>
          <td>${inf.kategori}</td>
          <td>${inf.dusun} (${inf.lokasi})</td>
          <td>${inf.kondisi}</td>
          <td>${inf.dimensi}</td>
          <td>${formatRupiah(inf.anggaran)}</td>
          <td>${inf.sumberAnggaran} (${inf.tahunPembangunan})</td>
        </tr>
      `;
    });
    const content = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Infrastruktur</th>
            <th>Kategori</th>
            <th>Lokasi</th>
            <th>Kondisi</th>
            <th>Dimensi / Ukuran</th>
            <th>Nilai Anggaran</th>
            <th>Sumber & Tahun</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    printOfficialDocument(
      'LAPORAN INVENTARISASI & KONDISI INFRASTRUKTUR DESA ADIMULYA',
      'Pembangunan Desa',
      content
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pengelolaan Infrastruktur & Fasilitas Desa
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan sarana prasarana jalan, jembatan, gedung publik, dan posyandu Desa Adimulya
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
            Cetak Laporan
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Infrastruktur
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
            placeholder="Cari infrastruktur, lokasi, dusun..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Jalan Aspal">Jalan Aspal</option>
            <option value="Jalan Beton">Jalan Beton</option>
            <option value="Jembatan">Jembatan</option>
            <option value="Balai Desa">Balai Desa & Kantor</option>
            <option value="Posyandu & Fasilitas Kesehatan">Posyandu & Kesehatan</option>
            <option value="Irigasi & Drainase">Irigasi & Drainase</option>
          </select>

          <select
            value={filterKondisi}
            onChange={(e) => setFilterKondisi(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Kondisi</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Sedang">Rusak Sedang</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
        </div>
      </div>

      {/* Grid of Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const kondisiColor =
            item.kondisi === 'Baik'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : item.kondisi === 'Rusak Ringan'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-red-50 text-red-700 border-red-200';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              {item.foto && (
                <div className="h-40 w-full overflow-hidden relative">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-md shadow-xs ${kondisiColor}`}>
                      {item.kondisi}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {!item.foto && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {item.kategori}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${kondisiColor}`}>
                        {item.kondisi}
                      </span>
                    </div>
                  )}
                  {item.foto && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1.5">
                      {item.kategori}
                    </span>
                  )}

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.nama}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.lokasi}, Dusun {item.dusun}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Tahun Pembangunan: {item.tahunPembangunan}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-mono text-slate-700 font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{formatRupiah(item.anggaran)}</span>
                      <span className="text-[11px] text-slate-500 font-sans">({item.sumberAnggaran})</span>
                    </p>
                  </div>
                  {item.keterangan && (
                    <p className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg line-clamp-2">
                      {item.keterangan}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">{item.dimensi}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                      title="Ubah Data"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Hapus Data"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT INFRASTRUKTUR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editItem ? 'Edit Data Infrastruktur' : 'Tambah Infrastruktur Desa'}
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
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Sarana / Prasarana*
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Misal: Rabat Beton Jalan Lingkungan RT 02"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriInfrastruktur })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Jalan Aspal">Jalan Aspal</option>
                    <option value="Jalan Beton">Jalan Beton</option>
                    <option value="Jalan Tanah">Jalan Tanah</option>
                    <option value="Jembatan">Jembatan</option>
                    <option value="Balai Desa">Balai Desa</option>
                    <option value="Gedung Pemerintahan">Gedung Pemerintahan</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Posyandu & Fasilitas Kesehatan">Posyandu & Kesehatan</option>
                    <option value="Irigasi & Drainase">Irigasi & Drainase</option>
                    <option value="Fasilitas Umum Lainnya">Fasilitas Umum Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kondisi Fisik</label>
                  <select
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as KondisiInfrastruktur })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Sedang">Rusak Sedang</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
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
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Bangun</label>
                  <input
                    type="number"
                    value={formData.tahunPembangunan}
                    onChange={(e) => setFormData({ ...formData, tahunPembangunan: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lokasi Rinci</label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Ruas jalan / RT RW"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dimensi / Ukuran</label>
                  <input
                    type="text"
                    value={formData.dimensi}
                    onChange={(e) => setFormData({ ...formData, dimensi: e.target.value })}
                    placeholder="Contoh: P 800 m x L 3.5 m"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sumber Anggaran</label>
                  <input
                    type="text"
                    value={formData.sumberAnggaran}
                    onChange={(e) => setFormData({ ...formData, sumberAnggaran: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nilai Anggaran (Rp)</label>
                  <input
                    type="number"
                    value={formData.anggaran}
                    onChange={(e) => setFormData({ ...formData, anggaran: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Catatan</label>
                <textarea
                  rows={2}
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Kondisi terkini, tindak lanjut pemeliharaan..."
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
                  {editItem ? 'Simpan Perubahan' : 'Tambah Infrastruktur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl w-12 h-12 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hapus Data Infrastruktur?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Data infrastruktur ini akan dihapus dari sistem inventarisasi desa.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteInfrastruktur(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
