import React, { useEffect, useRef, useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { PetaLokasi } from '../../types';
import L from 'leaflet';
import { MapPin, Navigation, Info, Compass, Phone } from 'lucide-react';

export const PublicPeta: React.FC = () => {
  const { petaLokasiList } = useVillageData();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPoint, setSelectedPoint] = useState<PetaLokasi | null>(null);

  const categories = [
    'Semua',
    'Kantor Pemerintahan',
    'Fasilitas Umum',
    'Kesehatan',
    'Pendidikan',
    'Infrastruktur',
    'UMKM Unggulan',
  ];

  const filtered = petaLokasiList.filter((pt) => {
    if (activeCategory === 'Semua') return true;
    return pt.kategori === activeCategory;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-7.326, 108.687],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | SIMPANDADU GIS',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    filtered.forEach((pt) => {
      const iconHtml = `
        <div style="background-color: ${
          pt.kategori === 'Kantor Pemerintahan'
            ? '#2563EB'
            : pt.kategori === 'Kesehatan'
            ? '#10B981'
            : pt.kategori === 'Pendidikan'
            ? '#8B5CF6'
            : pt.kategori === 'Infrastruktur'
            ? '#F59E0B'
            : '#EC4899'
        }; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
      `;

      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'public-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker([pt.latitude, pt.longitude], { icon: markerIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <div style="font-size: 10px; font-weight: bold; color: #2563EB; text-transform: uppercase;">${pt.kategori}</div>
          <strong style="font-size: 13px; color: #0F172A; display: block; margin: 2px 0 4px;">${pt.nama}</strong>
          <p style="margin: 0; color: #475569;">${pt.alamat}</p>
        </div>
      `);

      marker.on('click', () => {
        setSelectedPoint(pt);
      });
    });
  }, [filtered]);

  const handleSelectPoint = (pt: PetaLokasi) => {
    setSelectedPoint(pt);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([pt.latitude, pt.longitude], 17);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Geospasial & Peta Wilayah
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Peta Fasilitas & Tata Ruang Desa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Temukan lokasi balai desa, posyandu, sarana pendidikan, dan sentra UMKM di Desa Adimulya
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Points Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
              Daftar Lokasi ({filtered.length} Titik)
            </h3>
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filtered.map((pt) => (
                <div
                  key={pt.id}
                  onClick={() => handleSelectPoint(pt)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedPoint?.id === pt.id
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-900">{pt.nama}</span>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">
                      {pt.kategori}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 line-clamp-1">{pt.alamat}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">Dusun {pt.dusun}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Sumber Data: OpenStreetMap & Pemetaan Mandiri Desa Adimulya
          </div>
        </div>

        {/* Leaflet Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <span className="font-bold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" /> Peta Interaktif Desa Adimulya
            </span>
            <span className="text-slate-400 text-[11px]">Kecamatan Wanareja, Cilacap</span>
          </div>
          <div
            ref={mapContainerRef}
            className="w-full h-[520px] bg-slate-100 z-10"
            style={{ minHeight: '520px' }}
          />
        </div>
      </div>
    </div>
  );
};
