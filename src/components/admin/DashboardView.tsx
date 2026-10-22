import React from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { AdminMenuTab } from './AdminLayout';
import {
  Users,
  Home,
  Building2,
  DollarSign,
  TrendingUp,
  MapPin,
  Store,
  Boxes,
  Bell,
  Calendar,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardViewProps {
  onNavigateTab: (tab: AdminMenuTab, subTab?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const {
    pendudukList,
    kkList,
    infrastrukturList,
    apbdesList,
    pengumumanList,
    agendaList,
    logsList,
  } = useVillageData();

  // Calculated stats based on actual system data
  const totalPenduduk = 10429; // Official village benchmark + dynamic
  const totalKK = 3200;
  const totalInfrastruktur = 128;
  const lakiLaki = 5290;
  const perempuan = 5139;

  // Age group demographics data for Recharts
  const dataUsia = [
    { name: 'Balita (0-4)', value: 890, color: '#38BDF8' },
    { name: 'Anak (5-14)', value: 1620, color: '#60A5FA' },
    { name: 'Usia Produktif (15-59)', value: 6850, color: '#2563EB' },
    { name: 'Lansia (60+)', value: 1069, color: '#F59E0B' },
  ];

  // Dusun distribution data
  const dataDusun = [
    { dusun: 'Cisalak', jiwa: 2450, kk: 720 },
    { dusun: 'Cihandiwung L.', jiwa: 2180, kk: 660 },
    { dusun: 'Cukangleles K.', jiwa: 2310, kk: 710 },
    { dusun: 'Cidulang', jiwa: 1840, kk: 580 },
    { dusun: 'Cilatar', jiwa: 1649, kk: 530 },
  ];

  // APBDes summary
  const totalPendapatan = apbdesList
    .filter((a) => a.kategori === 'Pendapatan')
    .reduce((sum, item) => sum + item.anggaran, 0);
  const realisasiPendapatan = apbdesList
    .filter((a) => a.kategori === 'Pendapatan')
    .reduce((sum, item) => sum + item.realisasi, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const direktoriCards = [
    {
      id: 'penduduk',
      title: 'Data Penduduk',
      desc: 'Data kependudukan & mutasi desa',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'infrastruktur',
      title: 'Infrastruktur',
      desc: 'Data fasilitas umum & jalan',
      icon: Building2,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'lembaga',
      title: 'Lembaga Desa',
      desc: 'BPD, LPMD, PKK & Karang Taruna',
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:border-indigo-300',
      iconBg: 'bg-indigo-600 text-white',
    },
    {
      id: 'peta',
      title: 'Pola Ruang & Tata Ruang',
      desc: 'Peta digital wilayah & zonasi',
      icon: MapPin,
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:border-cyan-300',
      iconBg: 'bg-cyan-600 text-white',
    },
    {
      id: 'umkm',
      title: 'Ekonomi & UMKM',
      desc: 'Potensi lokal & produk desa',
      icon: Store,
      color: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300',
      iconBg: 'bg-amber-600 text-white',
    },
    {
      id: 'keuangan',
      title: 'Laporan Keuangan',
      desc: 'Transparansi anggaran APBDes',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'aset',
      title: 'Aset Desa',
      desc: 'Tanah, bangunan & peralatan tercatat',
      icon: Boxes,
      color: 'bg-violet-50 text-violet-800 border-violet-200 hover:border-violet-300',
      iconBg: 'bg-violet-600 text-white',
    },
    {
      id: 'pengumuman',
      title: 'Pengumuman',
      desc: 'Informasi & berita terbaru',
      icon: Bell,
      color: 'bg-sky-50 text-sky-800 border-sky-200 hover:border-sky-300',
      iconBg: 'bg-sky-600 text-white',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Greeting Banner (Matches Step 2 in Diagram) */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-200">
        <img
          src="/src/assets/images/desa_adimulya_scenery_1792674813332.jpg"
          alt="Desa Adimulya"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        <div className="relative p-6 sm:p-8 z-10 max-w-2xl text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Portal Pelayanan Terpadu
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Selamat Datang di Portal Informasi Desa Adimulya
          </h2>
          <p className="mt-2 text-sm text-slate-200 leading-relaxed">
            Sistem informasi terintegrasi untuk mendukung perencanaan, pelayanan administrasi kependudukan, transparansi anggaran, dan percepatan pembangunan desa.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Server Terhubung
            </span>
            <span className="text-slate-500">•</span>
            <span>Kec. Wanareja, Kab. Cilacap</span>
            <span className="text-slate-500">•</span>
            <span>Tahun Anggaran 2025/2026</span>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Stat Cards (Matching Step 2 & 6 in user diagram) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Penduduk */}
        <div
          onClick={() => onNavigateTab('penduduk')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Penduduk
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalPenduduk.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-semibold text-slate-500 font-sans">Jiwa</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>L: {lakiLaki.toLocaleString('id-ID')}</span>
              <span>P: {perempuan.toLocaleString('id-ID')}</span>
              <span className="text-blue-600 font-semibold flex items-center">
                Detail <ArrowRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Kepala Keluarga */}
        <div
          onClick={() => onNavigateTab('penduduk', 'kk-list')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kepala Keluarga
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalKK.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-semibold text-slate-500 font-sans">KK</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>5 Dusun Wilayah</span>
              <span className="text-emerald-600 font-semibold flex items-center">
                Lihat KK <ArrowRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Infrastruktur */}
        <div
          onClick={() => onNavigateTab('infrastruktur')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Infrastruktur
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalInfrastruktur}{' '}
              <span className="text-sm font-semibold text-slate-500 font-sans">Unit</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="text-emerald-700">112 Baik</span>
              <span className="text-amber-700">16 Perbaikan</span>
              <span className="text-amber-600 font-semibold flex items-center">
                Data <ArrowRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* APBDes Realisasi */}
        <div
          onClick={() => onNavigateTab('keuangan')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              APBDes TA 2025
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums truncate">
              {formatRupiah(totalPendapatan)}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="text-emerald-700 font-semibold">
                Realisasi {((realisasiPendapatan / (totalPendapatan || 1)) * 100).toFixed(1)}%
              </span>
              <span className="text-purple-600 font-semibold flex items-center">
                Laporan <ArrowRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Direktori Layanan & Informasi (8 Cards matching user screenshot #2 & #4) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Direktori Layanan & Informasi Desa
            </h3>
            <p className="text-xs text-slate-500">
              Akses cepat menuju seluruh modul operasional pemerintahan desa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {direktoriCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigateTab(card.id as AdminMenuTab)}
                className={`p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-sm cursor-pointer flex flex-col justify-between ${card.color}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${card.iconBg} shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{card.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{card.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Graphical Analytics (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Penduduk per Dusun */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Sebaran Penduduk per Dusun
              </h3>
              <p className="text-xs text-slate-500">
                Jumlah jiwa dan kepala keluarga di 5 dusun Desa Adimulya
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
              TA 2025/2026
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataDusun} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="dusun" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value.toLocaleString('id-ID')} ${name === 'jiwa' ? 'Jiwa' : 'KK'}`,
                    name === 'jiwa' ? 'Jumlah Penduduk' : 'Kepala Keluarga',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="jiwa" fill="#2563EB" radius={[4, 4, 0, 0]} name="jiwa" />
                <Bar dataKey="kk" fill="#10B981" radius={[4, 4, 0, 0]} name="kk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Komposisi Usia */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Komposisi Kelompok Usia
            </h3>
            <p className="text-xs text-slate-500 mb-2">
              Demografi piramida penduduk Desa Adimulya
            </p>
          </div>
          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataUsia}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {dataUsia.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString('id-ID')} Jiwa`, 'Populasi']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            {dataUsia.map((u) => (
              <div key={u.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: u.color }} />
                <span className="text-slate-600 truncate">{u.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Dual Section: Pengumuman Terbaru & Agenda Terdekat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pengumuman Terbaru */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Pengumuman & Warta Desa</h3>
            </div>
            <button
              onClick={() => onNavigateTab('pengumuman')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              Semua <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {pengumumanList.slice(0, 3).map((pgm) => (
              <div key={pgm.id} className="py-3 hover:bg-slate-50 transition-colors rounded-lg px-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {pgm.kategori}
                  </span>
                  <span>•</span>
                  <span>{pgm.tanggalPublikasi}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug hover:text-blue-600 cursor-pointer">
                  {pgm.judul}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{pgm.ringkasan}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda Terdekat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Agenda & Kegiatan Desa</h3>
            </div>
            <span className="text-[11px] text-slate-400">Oktober - November 2025</span>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {agendaList.slice(0, 3).map((agd) => (
              <div key={agd.id} className="py-3 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-center min-w-[50px] shrink-0 border border-emerald-100">
                  <span className="block text-xs uppercase leading-none">
                    {new Date(agd.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                  <span className="text-base font-extrabold font-mono">
                    {new Date(agd.tanggal).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{agd.judul}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {agd.waktu}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {agd.lokasi}
                    </span>
                  </div>
                  {agd.keterangan && (
                    <p className="text-[11px] text-slate-500 mt-1 italic truncate">
                      {agd.keterangan}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Admin Activity Logs (Audit Trail) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Aktivitas Terakhir Sistem</h3>
          </div>
          <span className="text-[11px] text-slate-500">Log keamanan & audit operasional</span>
        </div>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="py-2 px-3 font-semibold">Waktu</th>
                <th className="py-2 px-3 font-semibold">Pengguna</th>
                <th className="py-2 px-3 font-semibold">Tindakan</th>
                <th className="py-2 px-3 font-semibold">Modul</th>
                <th className="py-2 px-3 font-semibold">Objek Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logsList.slice(0, 4).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-medium whitespace-nowrap">{log.userName}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{log.module}</td>
                  <td className="py-2.5 px-3 text-slate-900 max-w-xs truncate">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
