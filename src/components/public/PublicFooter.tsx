import React from 'react';
import { Logo } from '../common/Logo';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const PublicFooter: React.FC<{ onSelectTab?: (tab: any) => void; onGoToLogin?: () => void }> = ({
  onSelectTab,
  onGoToLogin,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Identity & Motto */}
          <div className="space-y-4">
            <Logo size="md" lightMode />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>SIMPANDADU</strong> adalah Sistem Informasi Perencanaan dan Administrasi Desa Adimulya Terpadu. Menghadirkan pelayanan publik modern, akuntabel, transparan, dan partisipatif.
            </p>
            <div className="pt-2 text-xs text-amber-400 font-semibold italic">
              "Melayani • Transparan • Membangun Desa"
            </div>
          </div>

          {/* Col 2: Pelayanan & Jam Kerja */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Pelayanan Kantor Desa
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Senin - Kamis</p>
                  <p>08.00 - 15.30 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Jumat</p>
                  <p>08.00 - 14.30 WIB (Istirahat Sholat)</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Sabtu, Minggu & Hari Libur Nasional tutup. Layanan gawat darurat ambulans siaga 24 jam.
              </p>
            </div>
          </div>

          {/* Col 3: Alamat & Kontak Resmi */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Kontak & Alamat
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Jl. Merdeka No. 01, Dusun Cilatar, Desa Adimulya, Kec. Wanareja, Kab. Cilacap, Jawa Tengah 53265
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">(0280) 626123 / 0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>pemdes@adimulya.desa.id</span>
              </div>
            </div>
          </div>

          {/* Col 4: Tautan Cepat & Akses Internal */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Tautan & Akses
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('profil')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Profil & Sejarah Desa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('pemerintahan')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Struktur Pemerintahan Desa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('perencanaan')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Transparansi APBDes & Perencanaan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('umkm')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sentra UMKM & Produk Unggulan
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onGoToLogin}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white font-semibold transition-colors cursor-pointer border border-blue-500/40 inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Masuk Administrator (SIMPANDADU)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Pemerintah Desa Adimulya • Kabupaten Cilacap, Jawa Tengah. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privasi Data Kependudukan Terjaga</span>
            <span>•</span>
            <span>Sistem Informasi Desa Resmi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
