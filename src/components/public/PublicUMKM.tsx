import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { Store, Search, Phone, MessageCircle, MapPin, Sparkles } from 'lucide-react';

export const PublicUMKM: React.FC = () => {
  const { umkmList } = useVillageData();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Semua');

  const filtered = umkmList.filter((u) => {
    const matchSearch =
      u.namaUsaha.toLowerCase().includes(search.toLowerCase()) ||
      u.produkUtama.toLowerCase().includes(search.toLowerCase()) ||
      u.namaPemilik.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'Semua' || u.kategori === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Katalog Usaha Warga
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Sentra UMKM & Produk Unggulan Desa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Dukung pertumbuhan ekonomi pedesaan dengan membeli produk berkualitas langsung dari petani dan pengrajin Desa Adimulya
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk gula aren, kopi, keripik..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
        >
          <option value="Semua">Semua Kategori Produk</option>
          <option value="Kuliner & Makanan Olahan">Kuliner & Makanan</option>
          <option value="Pertanian & Perkebunan">Pertanian & Kopi</option>
          <option value="Kerajinan Tangan">Kerajinan Bambu</option>
          <option value="Peternakan & Perikanan">Madu & Peternakan</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {u.kategori}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Berdiri {u.tahunBerdiri}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">{u.namaUsaha}</h3>
              <p className="text-xs text-slate-500">Pemilik: <strong>{u.namaPemilik}</strong></p>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  Produk / Layanan:
                </span>
                <p className="font-semibold text-slate-800">{u.produkUtama}</p>
              </div>

              <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {u.deskripsi}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{u.alamat}, Dusun {u.dusun}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">{u.kontak}</span>
              <a
                href={`https://wa.me/${u.kontak.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(u.namaPemilik)},%20saya%20melihat%20produk%20${encodeURIComponent(u.namaUsaha)}%20di%20portal%20resmi%20Desa%20Adimulya.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Pesan WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
