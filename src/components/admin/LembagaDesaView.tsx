import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { LembagaDesa } from '../../types';
import { printOfficialDocument } from '../../utils/exportUtils';
import {
  Network,
  Plus,
  Users,
  Phone,
  FileCheck,
  Edit2,
  Trash2,
  Printer,
  X,
  Layers,
  ChevronRight,
  Shield,
  Award,
} from 'lucide-react';

export const LembagaDesaView: React.FC = () => {
  const { lembagaList, addLembaga, updateLembaga, deleteLembaga } = useVillageData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<LembagaDesa | null>(null);
  const [selectedLembaga, setSelectedLembaga] = useState<LembagaDesa | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    singkatan: '',
    ketua: '',
    deskripsi: '',
    jumlahAnggota: 10,
    periode: '2024 - 2029',
    kontak: '',
    statusAktif: true,
    skPengangkatan: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      nama: '',
      singkatan: '',
      ketua: '',
      deskripsi: '',
      jumlahAnggota: 10,
      periode: '2024 - 2029',
      kontak: '',
      statusAktif: true,
      skPengangkatan: 'SK Kepala Desa No. 188.4/01/2025',
    });
    setEditItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (lem: LembagaDesa) => {
    setEditItem(lem);
    setFormData({
      nama: lem.nama,
      singkatan: lem.singkatan,
      ketua: lem.ketua,
      deskripsi: lem.deskripsi,
      jumlahAnggota: lem.jumlahAnggota,
      periode: lem.periode,
      kontak: lem.kontak,
      statusAktif: lem.statusAktif,
      skPengangkatan: lem.skPengangkatan,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      updateLembaga(editItem.id, formData);
    } else {
      addLembaga(formData);
    }
    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    let rows = '';
    lembagaList.forEach((lem, idx) => {
      rows += `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${lem.nama} (${lem.singkatan})</strong></td>
          <td>${lem.ketua}</td>
          <td>${lem.jumlahAnggota} Orang</td>
          <td>${lem.periode}</td>
          <td>${lem.skPengangkatan}</td>
          <td>${lem.kontak}</td>
        </tr>
      `;
    });
    const content = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Lembaga Desa</th>
            <th>Ketua Pengurus</th>
            <th>Anggota</th>
            <th>Periode Bhakti</th>
            <th>Dasar Hukum (SK)</th>
            <th>Kontak</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    printOfficialDocument(
      'DAFTAR LEMBAGA KEMASYARAKATAN DESA (LKD) ADIMULYA',
      'Pemberdayaan Masyarakat',
      content
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Lembaga Kemasyarakatan Desa (LKD)
          </h2>
          <p className="text-xs text-slate-500">
            Pengelolaan kepengurusan BPD, LPMD, TP-PKK, Karang Taruna, dan RT/RW Desa Adimulya
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Cetak Daftar Lembaga
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Lembaga
          </button>
        </div>
      </div>

      {/* Grid of Lembaga Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lembagaList.map((lem) => (
          <div
            key={lem.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Aktif
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {lem.nama}
              </h3>
              <span className="text-xs font-semibold text-blue-600 mt-0.5 block">
                {lem.singkatan}
              </span>

              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
                {lem.deskripsi}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ketua Lembaga</span>
                  <span className="font-bold text-slate-900">{lem.ketua}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Jumlah Personil</span>
                  <span className="font-semibold text-blue-700">{lem.jumlahAnggota} Anggota</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Masa Bhakti</span>
                  <span className="font-medium text-slate-700">{lem.periode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kontak Sekretariat</span>
                  <span className="font-mono text-slate-700">{lem.kontak}</span>
                </div>
                <div className="pt-1 text-[11px] text-slate-400 truncate">
                  SK: {lem.skPengangkatan}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(lem)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                title="Edit Lembaga"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus lembaga ${lem.nama}?`)) {
                    deleteLembaga(lem.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                title="Hapus Lembaga"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT LEMBAGA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editItem ? 'Edit Lembaga Desa' : 'Tambah Lembaga Desa'}
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
                <label className="block font-semibold text-slate-700 mb-1">Nama Lembaga*</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Misal: Satuan Perlindungan Masyarakat (Satlinmas)"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Singkatan / Akronim</label>
                  <input
                    type="text"
                    value={formData.singkatan}
                    onChange={(e) => setFormData({ ...formData, singkatan: e.target.value })}
                    placeholder="Contoh: LINMAS"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ketua*</label>
                  <input
                    type="text"
                    value={formData.ketua}
                    onChange={(e) => setFormData({ ...formData, ketua: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Anggota</label>
                  <input
                    type="number"
                    value={formData.jumlahAnggota}
                    onChange={(e) => setFormData({ ...formData, jumlahAnggota: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Periode Kepengurusan</label>
                  <input
                    type="text"
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    placeholder="2024 - 2029"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dasar Hukum (SK Pengangkatan)</label>
                <input
                  type="text"
                  value={formData.skPengangkatan}
                  onChange={(e) => setFormData({ ...formData, skPengangkatan: e.target.value })}
                  placeholder="SK Kepala Desa No. ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tugas & Fungsi (Deskripsi)</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
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
                  Simpan Lembaga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
