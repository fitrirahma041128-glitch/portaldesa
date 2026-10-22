import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { Pengumuman } from '../../types';
import {
  Bell,
  Plus,
  Search,
  Calendar,
  User,
  Edit2,
  Trash2,
  Eye,
  X,
  CheckCircle,
  FileText,
  Clock,
} from 'lucide-react';

export const PengumumanView: React.FC = () => {
  const { pengumumanList, addPengumuman, updatePengumuman, deletePengumuman } = useVillageData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Pengumuman | null>(null);
  const [previewItem, setPreviewItem] = useState<Pengumuman | null>(null);

  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    ringkasan: '',
    kategori: 'Pembangunan' as Pengumuman['kategori'],
    tanggalPublikasi: new Date().toISOString().slice(0, 10),
    status: 'Dipublikasikan' as Pengumuman['status'],
    penulis: 'Sekretariat Desa',
  });

  const filtered = pengumumanList.filter((p) => {
    const matchSearch =
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.isi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterKategori === 'Semua' || p.kategori === filterKategori;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setFormData({
      judul: '',
      isi: '',
      ringkasan: '',
      kategori: 'Pembangunan',
      tanggalPublikasi: new Date().toISOString().slice(0, 10),
      status: 'Dipublikasikan',
      penulis: 'Sekretariat Desa',
    });
    setEditItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Pengumuman) => {
    setEditItem(p);
    setFormData({
      judul: p.judul,
      isi: p.isi,
      ringkasan: p.ringkasan,
      kategori: p.kategori,
      tanggalPublikasi: p.tanggalPublikasi,
      status: p.status,
      penulis: p.penulis,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      updatePengumuman(editItem.id, formData);
    } else {
      addPengumuman(formData);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pengumuman & Warta Berita Desa
          </h2>
          <p className="text-xs text-slate-500">
            Publikasi informasi resmi pemerintah desa, agenda musyawarah, dan penyaluran bantuan sosial
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Buat Pengumuman Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul berita atau pengumuman..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Pemerintahan">Pemerintahan</option>
            <option value="Pembangunan">Pembangunan</option>
            <option value="Sosial & Bantuan">Sosial & Bantuan</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Kegiatan Desa">Kegiatan Desa</option>
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            {item.fotoSampul && (
              <div className="h-44 w-full overflow-hidden relative">
                <img
                  src={item.fotoSampul}
                  alt={item.judul}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                    {item.kategori}
                  </span>
                </div>
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {!item.fotoSampul && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      {item.kategori}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>
                )}

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.judul}
                </h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.ringkasan || item.isi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.tanggalPublikasi}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                    title="Pratinjau"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                    title="Edit Berita"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus pengumuman "${item.judul}"?`)) {
                        deletePengumuman(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Hapus Berita"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: PREVIEW PENGUMUMAN */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {previewItem.kategori}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {previewItem.judul}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 pb-3 border-b border-slate-100">
                <span>Diterbitkan: {previewItem.tanggalPublikasi}</span>
                <span>•</span>
                <span>Penulis: {previewItem.penulis}</span>
              </div>
              <div className="mt-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {previewItem.isi}
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PENGUMUMAN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editItem ? 'Edit Pengumuman' : 'Tulis Pengumuman Baru'}
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
                <label className="block font-semibold text-slate-700 mb-1">Judul Pengumuman*</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Judul warta atau pengumuman..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Sosial & Bantuan">Sosial & Bantuan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Kegiatan Desa">Kegiatan Desa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Dipublikasikan">Dipublikasikan</option>
                    <option value="Draft">Draft (Konsep)</option>
                    <option value="Diarsipkan">Diarsipkan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Terbit</label>
                  <input
                    type="date"
                    value={formData.tanggalPublikasi}
                    onChange={(e) => setFormData({ ...formData, tanggalPublikasi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penulis / Sumber</label>
                  <input
                    type="text"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan Singkat</label>
                <input
                  type="text"
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                  placeholder="Intisari pengumuman 1-2 kalimat..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Berita Lengkap*</label>
                <textarea
                  rows={4}
                  value={formData.isi}
                  onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  placeholder="Tuliskan isi pengumuman atau berita secara lengkap..."
                  required
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
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
