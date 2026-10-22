import React from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { Shield, Award, Users, CheckCircle2 } from 'lucide-react';

export const PublicPemerintahan: React.FC = () => {
  const { lembagaList } = useVillageData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Pemerintahan & Kelembagaan
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Lembaga Kemasyarakatan Desa (LKD)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Mitra strategis Pemerintah Desa Adimulya dalam menampung aspirasi, gotong royong, dan pemberdayaan masyarakat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lembagaList.map((lem) => (
          <div
            key={lem.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Status: Aktif
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{lem.nama}</h3>
              <span className="text-xs font-semibold text-blue-600 block mt-0.5">
                {lem.singkatan}
              </span>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {lem.deskripsi}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p className="flex justify-between">
                  <span className="text-slate-400">Ketua:</span>
                  <span className="font-bold text-slate-900">{lem.ketua}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Jumlah Personil:</span>
                  <span className="font-semibold text-blue-700">{lem.jumlahAnggota} Orang</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Masa Bhakti:</span>
                  <span className="font-medium text-slate-700">{lem.periode}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 truncate">
              Dasar Hukum: {lem.skPengangkatan}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
