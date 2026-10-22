import React from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { PublicNavTab } from './PublicNavbar';
import {
  Users,
  Home,
  Building2,
  DollarSign,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  Shield,
  CheckCircle2,
  Store,
  ChevronRight,
  Quote,
} from 'lucide-react';

interface PublicHomeProps {
  onSelectTab: (tab: PublicNavTab) => void;
  onGoToLogin: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onSelectTab, onGoToLogin }) => {
  const { pengumumanList, agendaList, umkmList, infrastrukturList } = useVillageData();

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[520px] flex items-center justify-center bg-slate-900 overflow-hidden">
        <img
          src="/src/assets/images/desa_adimulya_scenery_1792674813332.jpg"
          alt="Lanskap Desa Adimulya"
          className="absolute inset-0 w-full h-full object-cover opacity-45 transform scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Navy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white py-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Portal Resmi Pemerintah Desa Adimulya • Cilacap
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Membangun Desa Mandiri, Sejahtera, dan Berkelanjutan
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Selamat datang di portal informasi resmi Desa Adimulya. Akses transparansi perencanaan pembangunan, layanan administrasi terpadu, dan potensi produk lokal.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onSelectTab('profil')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs sm:text-sm"
            >
              Jelajahi Profil Desa
            </button>
            <button
              onClick={() => onSelectTab('peta')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-xs transition-all cursor-pointer text-xs sm:text-sm"
            >
              Buka Peta Wilayah
            </button>
            <button
              onClick={onGoToLogin}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs sm:text-sm"
            >
              Login Perangkat Desa
            </button>
          </div>
        </div>
      </section>

      {/* 2. Quick Statistical Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="p-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Penduduk
            </span>
            <div className="text-3xl font-extrabold text-blue-700 font-mono">
              10.429 <span className="text-xs font-semibold text-slate-500 font-sans">Jiwa</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">5 Dusun Administratif</p>
          </div>

          <div className="p-2 pt-6 lg:pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Kepala Keluarga
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 font-mono">
              3.200 <span className="text-xs font-semibold text-slate-500 font-sans">KK</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Tertib Administrasi KTP/KK</p>
          </div>

          <div className="p-2 pt-6 lg:pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Infrastruktur Fisik
            </span>
            <div className="text-3xl font-extrabold text-amber-600 font-mono">
              128 <span className="text-xs font-semibold text-slate-500 font-sans">Unit</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Jalan, Jembatan, Bangunan</p>
          </div>

          <div className="p-2 pt-6 lg:pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Kawasan Pola Ruang
            </span>
            <div className="text-3xl font-extrabold text-purple-600 font-mono">
              610,8 <span className="text-xs font-semibold text-slate-500 font-sans">Ha</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Pertanian & Permukiman</p>
          </div>
        </div>
      </section>

      {/* 3. Sambutan Kepala Desa Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-10">
          {/* Kepala Desa Photo / Avatar Card */}
          <div className="w-full lg:w-4/12 flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-48 h-56 rounded-2xl bg-gradient-to-b from-blue-700 to-slate-900 p-1.5 shadow-lg overflow-hidden">
                <img
                  src="/src/assets/images/kantor_desa_adimulya_1792674813705.jpg"
                  alt="Kantor Desa Adimulya"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full shadow-md uppercase tracking-wider whitespace-nowrap">
                Kepala Desa Adimulya
              </div>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-5">
              Drs. H. Sukirman, M.Si.
            </h3>
            <p className="text-xs text-slate-500">Masa Bhakti 2020 - 2026</p>
          </div>

          {/* Sambutan Text */}
          <div className="flex-1 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="inline-flex p-2 bg-blue-100 text-blue-800 rounded-xl mb-1">
              <Quote className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sambutan Kepala Desa Adimulya
            </h2>
            <p className="italic text-slate-600 font-serif text-sm sm:text-base">
              "Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera untuk kita semua."
            </p>
            <p>
              Puji syukur kehadirat Allah SWT, atas limpahan rahmat-Nya, Pemerintah Desa Adimulya kini menghadirkan portal resmi terpadu <strong>SIMPANDADU</strong> (Sistem Informasi Perencanaan dan Administrasi Desa Adimulya Terpadu).
            </p>
            <p>
              Era digital menuntut transparansi, kecepatan pelayanan, serta akurasi data kependudukan dan keuangan desa. Melalui sistem ini, warga masyarakat dapat memantau pembangunan desa, realisasi APBDes, serta mengakses peta wilayah dan potensi ekonomi UMKM secara terbuka.
            </p>
            <p className="font-semibold text-slate-900">
              Mari bersama-sama kita jaga gotong royong, transparansi, dan sinergi demi kemajuan Desa Adimulya yang lebih berkah dan sejahtera.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Direktori Layanan Desa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Pelayanan Publik
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Layanan Informasi Desa Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Kemudahan akses informasi kependudukan, tata ruang, lembaga masyarakat, dan transparansi anggaran
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => onSelectTab('profil')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Profil & Sejarah Desa</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mengenal sejarah panjang, visi misi pembangunan jangka menengah, serta potensi geografis Desa Adimulya.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
              Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onSelectTab('peta')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Peta Digital & Fasilitas</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Peta interaktif berbasis OpenStreetMap menampilkan lokasi balai desa, posyandu, sekolah, dan batas dusun.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
              Buka Peta <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onSelectTab('perencanaan')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Transparansi APBDes</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Keterbukaan alokasi dana transfer, pendapatan asli desa, serta realisasi pembangunan per bidang.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1">
              Lihat Anggaran <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* 5. Warta Berita & Agenda Terkini */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Berita Terbaru (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Pengumuman & Warta Terbaru</h2>
              <span className="text-xs text-slate-500">Pembaruan berkala</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pengumumanList.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {item.fotoSampul && (
                    <img
                      src={item.fotoSampul}
                      alt={item.judul}
                      className="h-40 w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {item.kategori}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                        {item.judul}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {item.ringkasan || item.isi}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{item.tanggalPublikasi}</span>
                      <span className="font-semibold text-blue-600">Baca Warta</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda Kegiatan Desa (1 col) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Agenda Kegiatan</h2>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs divide-y divide-slate-100">
              {agendaList.slice(0, 3).map((agd) => (
                <div key={agd.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-center min-w-[50px] border border-emerald-100 shrink-0">
                    <span className="block text-[10px] uppercase font-mono leading-none">
                      {new Date(agd.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                    </span>
                    <span className="text-base font-extrabold font-mono">
                      {new Date(agd.tanggal).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{agd.judul}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {agd.waktu}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {agd.lokasi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Spotlight UMKM Desa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl border border-amber-200/80 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Pemberdayaan Ekonomi Lokal
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Produk Unggulan UMKM Desa Adimulya
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Dukung produk karya warga: Gula Semut Aren Organik, Kopi Robusta, dan Anyaman Bambu
              </p>
            </div>
            <button
              onClick={() => onSelectTab('umkm')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Lihat Semua UMKM ({umkmList.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {umkmList.slice(0, 3).map((u) => (
              <div key={u.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {u.kategori}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{u.namaUsaha}</h3>
                <p className="text-xs text-slate-500">Oleh: {u.namaPemilik}</p>
                <p className="text-xs text-slate-600 mt-2 font-medium bg-slate-50 p-2 rounded-lg">
                  {u.produkUtama}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{u.dusun}</span>
                  <a
                    href={`https://wa.me/${u.kontak.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Hubungi Pemilik →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
