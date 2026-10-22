import React from 'react';
import {
  ShieldCheck,
  Target,
  Compass,
  Users,
  MapPin,
  Trees,
  CheckCircle2,
  Building,
} from 'lucide-react';

export const PublicProfil: React.FC = () => {
  const aparatur = [
    { nama: 'Drs. H. Sukirman, M.Si.', jabatan: 'Kepala Desa', periode: '2020 - 2026' },
    { nama: 'Ahmad Fauzi, S.Kom.', jabatan: 'Sekretaris Desa', periode: 'PNS / Perangkat' },
    { nama: 'Sri Wahyuningsih, S.E.', jabatan: 'Kaur Keuangan', periode: 'Perangkat Desa' },
    { nama: 'Bambang Irawan', jabatan: 'Kaur Perencanaan', periode: 'Perangkat Desa' },
    { nama: 'Siti Marwiyah', jabatan: 'Kaur Tata Usaha & Umum', periode: 'Perangkat Desa' },
    { nama: 'Teguh Wicaksono', jabatan: 'Kasi Pemerintahan', periode: 'Perangkat Desa' },
    { nama: 'Rudi Hartono', jabatan: 'Kasi Kesejahteraan', periode: 'Perangkat Desa' },
    { nama: 'Haryanto', jabatan: 'Kasi Pelayanan', periode: 'Perangkat Desa' },
    { nama: 'Kusno (Kadus I)', jabatan: 'Kepala Dusun Cisalak', periode: 'Perangkat Desa' },
    { nama: 'Slamet (Kadus II)', jabatan: 'Kepala Dusun Cihandiwung Lor', periode: 'Perangkat Desa' },
    { nama: 'Supardi (Kadus III)', jabatan: 'Kepala Dusun Cukangleles Kidul', periode: 'Perangkat Desa' },
    { nama: 'Daryanto (Kadus IV)', jabatan: 'Kepala Dusun Cidulang', periode: 'Perangkat Desa' },
    { nama: 'Sujono (Kadus V)', jabatan: 'Kepala Dusun Cilatar', periode: 'Perangkat Desa' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Mengenal Desa Adimulya
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Profil, Sejarah & Visi Misi Desa
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Kecamatan Wanareja, Kabupaten Cilacap, Provinsi Jawa Tengah
        </p>
      </div>

      {/* 1. Tentang Desa & Sejarah */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Sejarah Singkat Desa Adimulya</h2>
          <p>
            Nama <strong>Adimulya</strong> berakar dari dua kata bahasa Jawa Sansekerta: <em>"Adi"</em> yang bermakna luhur, indah, dan utama; serta <em>"Mulya"</em> yang bermakna kemuliaan, kemakmuran, dan kesejahteraan. Desa Adimulya didirikan atas tekad para sesepuh desa untuk mewujudkan masyarakat perdesaan yang menjunjung tinggi budi pekerti luhur dan berkecukupan sandang pangan.
          </p>
          <p>
            Secara historis, wilayah ini dahulunya merupakan kawasan persawahan subur dan perbukitan pohon aren yang dialiri oleh Sungai Cikawung. Seiring perkembangan otonomi perdesaan, masyarakat bergotong royong membangun infrastruktur poros jalan dan sistem irigasi teknis yang kini menjadi penopang utama lumbung pangan Kecamatan Wanareja.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-800">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Terdiri Dari 5 Dusun
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 26 RT & 10 RW
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Luas Wilayah 610,8 Ha
            </span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-80">
          <img
            src="/src/assets/images/desa_adimulya_scenery_1792674813332.jpg"
            alt="Lanskap Desa Adimulya"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 2. Visi dan Misi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xs uppercase tracking-wider text-blue-300 font-bold block mb-1">
              Visi Pembangunan Desa (2020 - 2026)
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              "Terwujudnya Desa Adimulya yang Maju, Mandiri, Religius, Sejahtera, dan Berkeadilan Berbasis Pertanian dan Digitalisasi Pelayanan."
            </h3>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-300">
            Ditetapkan dalam RPJMDes Tahun 2020 - 2026 Desa Adimulya
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-wider text-blue-600 font-bold block mb-1">
            Misi Pembangunan Desa
          </span>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="font-bold text-blue-600 font-mono">1.</span>
              <span>Meningkatkan tata kelola pemerintahan desa yang bersih, transparan, akuntabel, dan berbasis teknologi informasi (SIMPANDADU).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-bold text-blue-600 font-mono">2.</span>
              <span>Membangun sarana dan prasarana infrastruktur jalan perdesaan, irigasi sawah, dan fasilitas sanitasi lingkungan secara merata.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-bold text-blue-600 font-mono">3.</span>
              <span>Mengembangkan potensi ekonomi warga melalui pembinaan UMKM, diversifikasi produk gula aren, kopi robusta, dan optimalisasi BUMDes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-bold text-blue-600 font-mono">4.</span>
              <span>Meningkatkan kualitas pelayanan kesehatan balita, lansia, pencegahan stunting, serta mutu pendidikan usia dini.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Batas Wilayah & Geografis */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Kondisi Geografis & Batas Wilayah</h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          Desa Adimulya terletak pada ketinggian antara 45 - 180 meter di atas permukaan laut dengan topografi dataran rendah persawahan di bagian timur dan selatan, serta perbukitan perkebunan di bagian barat.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Batas Utara</span>
            <span className="font-bold text-slate-900 mt-1 block">Desa Madura</span>
            <span className="text-[11px] text-slate-500">Kec. Wanareja</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Batas Selatan</span>
            <span className="font-bold text-slate-900 mt-1 block">Desa Cisuru</span>
            <span className="text-[11px] text-slate-500">Kec. Cipari</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Batas Timur</span>
            <span className="font-bold text-slate-900 mt-1 block">Desa Bantar</span>
            <span className="text-[11px] text-slate-500">Kec. Wanareja</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Batas Barat</span>
            <span className="font-bold text-slate-900 mt-1 block">Kec. Dayeuhluhur</span>
            <span className="text-[11px] text-slate-500">Kab. Cilacap</span>
          </div>
        </div>
      </div>

      {/* 4. Struktur Organisasi Aparatur Pemerintah Desa */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Pemerintah Desa
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            Struktur Aparatur Desa Adimulya
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Pelayan masyarakat yang siap membantu segala urusan administrasi dan pembangunan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aparatur.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {p.nama.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{p.nama}</h4>
                <p className="text-[11px] font-semibold text-blue-700">{p.jabatan}</p>
                <span className="text-[10px] text-slate-400">{p.periode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
