import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { APBDesItem, KategoriAPBDes } from '../../types';
import { exportToCSV, printOfficialDocument } from '../../utils/exportUtils';
import {
  DollarSign,
  Plus,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Edit2,
  Trash2,
  X,
  PieChart as PieIcon,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export const KeuanganView: React.FC = () => {
  const { apbdesList, addAPBDes, updateAPBDes, deleteAPBDes } = useVillageData();

  const [filterTahun, setFilterTahun] = useState<number>(2025);
  const [filterKategori, setFilterKategori] = useState<string>('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<APBDesItem | null>(null);

  const [formData, setFormData] = useState({
    kodeRekening: '',
    kategori: 'Pendapatan' as KategoriAPBDes,
    uraian: '',
    tahunAnggaran: 2025,
    anggaran: 100000000,
    realisasi: 95000000,
    keterangan: '',
  });

  const filteredItems = apbdesList.filter((item) => {
    const matchYear = item.tahunAnggaran === filterTahun;
    const matchCat = filterKategori === 'Semua' || item.kategori === filterKategori;
    return matchYear && matchCat;
  });

  // Calculate Totals
  const totalPendapatan = apbdesList
    .filter((i) => i.tahunAnggaran === filterTahun && i.kategori === 'Pendapatan')
    .reduce((s, i) => s + i.anggaran, 0);
  const realisasiPendapatan = apbdesList
    .filter((i) => i.tahunAnggaran === filterTahun && i.kategori === 'Pendapatan')
    .reduce((s, i) => s + i.realisasi, 0);

  const totalBelanja = apbdesList
    .filter((i) => i.tahunAnggaran === filterTahun && i.kategori === 'Belanja')
    .reduce((s, i) => s + i.anggaran, 0);
  const realisasiBelanja = apbdesList
    .filter((i) => i.tahunAnggaran === filterTahun && i.kategori === 'Belanja')
    .reduce((s, i) => s + i.realisasi, 0);

  const totalPembiayaan = apbdesList
    .filter((i) => i.tahunAnggaran === filterTahun && i.kategori === 'Pembiayaan')
    .reduce((s, i) => s + i.anggaran, 0);
  const realisasiPembiayaan = apbdesList
    .filter((i) => i.tahunAnggaran === filterTahun && i.kategori === 'Pembiayaan')
    .reduce((s, i) => s + i.realisasi, 0);

  // Chart Data: Anggaran vs Realisasi
  const chartData = [
    {
      kategori: 'Pendapatan',
      Anggaran: Math.round(totalPendapatan / 1000000),
      Realisasi: Math.round(realisasiPendapatan / 1000000),
    },
    {
      kategori: 'Belanja',
      Anggaran: Math.round(totalBelanja / 1000000),
      Realisasi: Math.round(realisasiBelanja / 1000000),
    },
    {
      kategori: 'Pembiayaan',
      Anggaran: Math.round(totalPembiayaan / 1000000),
      Realisasi: Math.round(realisasiPembiayaan / 1000000),
    },
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenAdd = () => {
    setFormData({
      kodeRekening: '5.2.1',
      kategori: 'Belanja',
      uraian: '',
      tahunAnggaran: filterTahun,
      anggaran: 50000000,
      realisasi: 0,
      keterangan: '',
    });
    setEditItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: APBDesItem) => {
    setEditItem(item);
    setFormData({
      kodeRekening: item.kodeRekening,
      kategori: item.kategori,
      uraian: item.uraian,
      tahunAnggaran: item.tahunAnggaran,
      anggaran: item.anggaran,
      realisasi: item.realisasi,
      keterangan: item.keterangan || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      updateAPBDes(editItem.id, formData);
    } else {
      addAPBDes(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    exportToCSV(`Laporan_APBDes_Adimulya_TA_${filterTahun}`, filteredItems);
  };

  const handlePrint = () => {
    let rows = '';
    filteredItems.forEach((i, idx) => {
      const pct = i.anggaran > 0 ? ((i.realisasi / i.anggaran) * 100).toFixed(1) : '0';
      rows += `
        <tr>
          <td>${idx + 1}</td>
          <td><code>${i.kodeRekening}</code></td>
          <td><strong>${i.kategori}</strong></td>
          <td>${i.uraian}</td>
          <td style="text-align:right;">${formatRupiah(i.anggaran)}</td>
          <td style="text-align:right;">${formatRupiah(i.realisasi)}</td>
          <td style="text-align:center;">${pct}%</td>
        </tr>
      `;
    });

    const content = `
      <p>Tahun Anggaran: <strong>${filterTahun}</strong></p>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode Rekening</th>
            <th>Kategori</th>
            <th>Uraian Kegiatan / Sumber</th>
            <th>Target Anggaran</th>
            <th>Realisasi (Rp)</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top: 20px; font-size: 11pt;">
        <p>Total Pendapatan: <strong>${formatRupiah(totalPendapatan)}</strong> (Realisasi: ${formatRupiah(realisasiPendapatan)})</p>
        <p>Total Belanja: <strong>${formatRupiah(totalBelanja)}</strong> (Realisasi: ${formatRupiah(realisasiBelanja)})</p>
      </div>
    `;

    printOfficialDocument(
      `LAPORAN REALISASI ANGGARAN PENDAPATAN & BELANJA DESA (APBDES) TA ${filterTahun}`,
      'Keuangan Desa Terpadu',
      content
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Transparansi Keuangan & APBDes
          </h2>
          <p className="text-xs text-slate-500">
            Anggaran Pendapatan dan Belanja Desa (APBDes) Desa Adimulya, Kec. Wanareja
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year selector */}
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-xs cursor-pointer"
          >
            <option value={2026}>Tahun Anggaran 2026</option>
            <option value={2025}>Tahun Anggaran 2025</option>
            <option value={2024}>Tahun Anggaran 2024</option>
          </select>

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
            Cetak APBDes
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Pos APBDes
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Pendapatan */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              1. Pendapatan Desa
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              {((realisasiPendapatan / (totalPendapatan || 1)) * 100).toFixed(1)}% Realisasi
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatRupiah(totalPendapatan)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Terealisasi: <strong className="text-emerald-700 font-mono">{formatRupiah(realisasiPendapatan)}</strong>
            </p>
          </div>
        </div>

        {/* Card 2: Belanja */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              2. Belanja Desa
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {((realisasiBelanja / (totalBelanja || 1)) * 100).toFixed(1)}% Terserap
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatRupiah(totalBelanja)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Terealisasi: <strong className="text-blue-700 font-mono">{formatRupiah(realisasiBelanja)}</strong>
            </p>
          </div>
        </div>

        {/* Card 3: Pembiayaan */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              3. Pembiayaan Desa
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
              Netto
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatRupiah(totalPembiayaan)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Terealisasi: <strong className="text-purple-700 font-mono">{formatRupiah(realisasiPembiayaan)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Chart: Anggaran vs Realisasi */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Perbandingan Anggaran vs Realisasi (dalam Juta Rupiah)
            </h3>
            <p className="text-xs text-slate-500">
              Grafik komparasi alokasi dan serapan APBDes TA {filterTahun}
            </p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="kategori" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [`Rp ${val.toLocaleString('id-ID')} Juta`, 'Nominal']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Anggaran" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Realisasi" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Table of Budget Line Items */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">
            Rincian Pos APBDes TA {filterTahun}
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Pendapatan">Pendapatan</option>
              <option value="Belanja">Belanja</option>
              <option value="Pembiayaan">Pembiayaan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Uraian Rekening</th>
                <th className="py-3 px-4 text-right">Target Anggaran</th>
                <th className="py-3 px-4 text-right">Realisasi</th>
                <th className="py-3 px-4 text-center">% Realisasi</th>
                <th className="py-3 px-4 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.map((item) => {
                const percent =
                  item.anggaran > 0 ? ((item.realisasi / item.anggaran) * 100).toFixed(1) : '0';
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.kodeRekening}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.kategori === 'Pendapatan'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.kategori === 'Belanja'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {item.uraian}
                      {item.keterangan && (
                        <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                          {item.keterangan}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                      {formatRupiah(item.anggaran)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {formatRupiah(item.realisasi)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                        {percent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                          title="Edit Pos"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pos rekening ${item.uraian}?`)) {
                              deleteAPBDes(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Hapus Pos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT POS APBDES */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editItem ? 'Edit Pos Rekening APBDes' : 'Tambah Pos Rekening APBDes'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Kode Rekening*</label>
                  <input
                    type="text"
                    value={formData.kodeRekening}
                    onChange={(e) => setFormData({ ...formData, kodeRekening: e.target.value })}
                    placeholder="Contoh: 5.2.1"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriAPBDes })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Pendapatan">Pendapatan</option>
                    <option value="Belanja">Belanja</option>
                    <option value="Pembiayaan">Pembiayaan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian Kegiatan / Pos Rekening*</label>
                <input
                  type="text"
                  value={formData.uraian}
                  onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
                  placeholder="Misal: Bantuan Pembangunan Posyandu Dusun Cidulang"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Anggaran (Rp)*</label>
                  <input
                    type="number"
                    value={formData.anggaran}
                    onChange={(e) => setFormData({ ...formData, anggaran: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Realisasi Sementara (Rp)</label>
                  <input
                    type="number"
                    value={formData.realisasi}
                    onChange={(e) => setFormData({ ...formData, realisasi: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan / Keterangan</label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Sumber transfer, nomor PMK, termin cair..."
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
                  Simpan Rekening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
