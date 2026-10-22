import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { DollarSign, CheckCircle2, TrendingUp, ShieldCheck, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const PublicPerencanaan: React.FC = () => {
  const { apbdesList } = useVillageData();
  const [selectedYear, setSelectedYear] = useState(2025);

  const items = apbdesList.filter((a) => a.tahunAnggaran === selectedYear);

  const totalPendapatan = items
    .filter((a) => a.kategori === 'Pendapatan')
    .reduce((s, a) => s + a.anggaran, 0);
  const realisasiPendapatan = items
    .filter((a) => a.kategori === 'Pendapatan')
    .reduce((s, a) => s + a.realisasi, 0);

  const totalBelanja = items
    .filter((a) => a.kategori === 'Belanja')
    .reduce((s, a) => s + a.anggaran, 0);
  const realisasiBelanja = items
    .filter((a) => a.kategori === 'Belanja')
    .reduce((s, a) => s + a.realisasi, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const chartData = [
    {
      kategori: 'Pendapatan',
      Target: Math.round(totalPendapatan / 1000000),
      Realisasi: Math.round(realisasiPendapatan / 1000000),
    },
    {
      kategori: 'Belanja',
      Target: Math.round(totalBelanja / 1000000),
      Realisasi: Math.round(realisasiBelanja / 1000000),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Transparansi Publik
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Laporan Realisasi APBDes Desa Adimulya
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Keterbukaan informasi keuangan desa untuk mewujudkan akuntabilitas dan partisipasi warga masyarakat
        </p>

        {/* Year Selector */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setSelectedYear(2025)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedYear === 2025
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Tahun Anggaran 2025
          </button>
          <button
            onClick={() => setSelectedYear(2024)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedYear === 2024
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Tahun Anggaran 2024
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Target Pendapatan Desa
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {((realisasiPendapatan / (totalPendapatan || 1)) * 100).toFixed(1)}% Masuk
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {formatRupiah(totalPendapatan)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Realisasi Masuk: <strong className="text-emerald-700 font-mono">{formatRupiah(realisasiPendapatan)}</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Alokasi Belanja Desa
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {((realisasiBelanja / (totalBelanja || 1)) * 100).toFixed(1)}% Terserap
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {formatRupiah(totalBelanja)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Realisasi Serapan: <strong className="text-blue-700 font-mono">{formatRupiah(realisasiBelanja)}</strong>
          </p>
        </div>
      </div>

      {/* Recharts Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Grafik Perbandingan Anggaran & Realisasi (Juta Rupiah)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Transparansi penerimaan dan penyerapan dana desa TA {selectedYear}
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="kategori" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [`Rp ${val.toLocaleString('id-ID')} Juta`, 'Nominal']}
                contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Target" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Realisasi" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-900">
          Rincian Pos Rekening APBDes TA {selectedYear}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Uraian Kegiatan / Sumber</th>
                <th className="py-3 px-4 text-right">Target</th>
                <th className="py-3 px-4 text-right">Realisasi</th>
                <th className="py-3 px-4 text-center">% Capaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {items.map((i) => {
                const pct = i.anggaran > 0 ? ((i.realisasi / i.anggaran) * 100).toFixed(1) : '0';
                return (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{i.kodeRekening}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {i.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{i.uraian}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-800">{formatRupiah(i.anggaran)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">{formatRupiah(i.realisasi)}</td>
                    <td className="py-3 px-4 text-center font-bold font-mono">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
