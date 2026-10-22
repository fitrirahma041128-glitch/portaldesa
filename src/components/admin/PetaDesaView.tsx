import React, { useEffect, useRef, useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { PetaLokasi, PolaRuang } from '../../types';
import L from 'leaflet';
import {
  MapPin,
  Plus,
  Layers,
  Search,
  Filter,
  Navigation,
  Upload,
  Info,
  CheckCircle2,
  Trash2,
  X,
  Compass,
} from 'lucide-react';

export const PetaDesaView: React.FC = () => {
  const { petaLokasiList, addPetaLokasi, deletePetaLokasi, polaRuangList } = useVillageData();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [selectedPoint, setSelectedPoint] = useState<PetaLokasi | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // New location form state
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Fasilitas Umum' as PetaLokasi['kategori'],
    latitude: -7.3255,
    longitude: 108.6875,
    alamat: '',
    dusun: 'Cilatar',
    deskripsi: '',
    kontak: '',
  });

  // Filtered Points
  const filteredPoints = petaLokasiList.filter((pt) => {
    if (filterCategory === 'Semua') return true;
    return pt.kategori === filterCategory;
  });

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center coordinates for Desa Adimulya
    const map = L.map(mapContainerRef.current, {
      center: [-7.326, 108.687],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | SIMPANDADU GIS',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when filtered points change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    filteredPoints.forEach((pt) => {
      // Create custom SVG marker icon
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
        }; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([pt.latitude, pt.longitude], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
          <div style="font-size: 10px; font-weight: bold; color: #2563EB; text-transform: uppercase;">${pt.kategori}</div>
          <strong style="font-size: 13px; color: #0F172A; display: block; margin: 2px 0 4px;">${pt.nama}</strong>
          <p style="margin: 0; color: #475569;">${pt.alamat}</p>
          <div style="margin-top: 6px; font-size: 10px; color: #64748B; font-family: monospace;">Koordinat: ${pt.latitude}, ${pt.longitude}</div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedPoint(pt);
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [filteredPoints]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPetaLokasi(formData);
    setIsAddModalOpen(false);
    // Pan map to new point
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([formData.latitude, formData.longitude], 16);
    }
  };

  const handleFocusPoint = (pt: PetaLokasi) => {
    setSelectedPoint(pt);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([pt.latitude, pt.longitude], 17);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Peta Digital & Tata Ruang Desa Adimulya
          </h2>
          <p className="text-xs text-slate-500">
            Sistem Informasi Geografis (GIS) sebaran fasilitas umum, infrastruktur, dan zonasi pola ruang
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Impor CSV Titik
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Titik Lokasi
          </button>
        </div>
      </div>

      {/* Official Boundary Notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Keterangan Batas Wilayah:</span> Data koordinat dan sebaran titik disajikan sebagai referensi perencanaan pembangunan terpadu Desa Adimulya. Batas administratif resmi mengacu pada Peraturan Daerah dan penetapan Badan Informasi Geospasial (BIG).
        </div>
      </div>

      {/* Map Layout: Left Sidebar List & Right Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Location Points Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Titik ({filteredPoints.length})
                </h3>
              </div>

              {/* Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Kantor Pemerintahan">Kantor Pemerintahan</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Infrastruktur">Infrastruktur</option>
                <option value="UMKM Unggulan">Sentra UMKM</option>
                <option value="Fasilitas Umum">Fasilitas Umum</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredPoints.map((pt) => {
                const isSelected = selectedPoint?.id === pt.id;
                return (
                  <div
                    key={pt.id}
                    onClick={() => handleFocusPoint(pt)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
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
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{pt.latitude.toFixed(4)}, {pt.longitude.toFixed(4)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus titik ${pt.nama}?`)) {
                            deletePetaLokasi(pt.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus Titik"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Coordinate Picker Hint */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Klik penanda pada peta untuk melihat informasi rinci atau gunakan tombol tambah titik baru.
          </div>
        </div>

        {/* Right: Leaflet Map Container */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Peta Wilayah Interaktif — OpenStreetMap & Leaflet</span>
            </div>
            <span className="font-mono text-slate-500 text-[11px]">
              Koordinat Pusat: -7.3260, 108.6870
            </span>
          </div>

          <div
            ref={mapContainerRef}
            className="w-full h-[520px] bg-slate-100 z-10"
            style={{ minHeight: '520px' }}
          />
        </div>
      </div>

      {/* POLA RUANG & TATA RUANG SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pola Ruang & Zonasi Wilayah Desa Adimulya
            </h3>
            <p className="text-xs text-slate-500">
              Rencana tata ruang kawasan perdesaan untuk ketahanan pangan, permukiman, dan konservasi alam
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            Total Luas: 610,8 Hektar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {polaRuangList.map((zona) => (
            <div
              key={zona.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
              style={{ borderLeftWidth: '5px', borderLeftColor: zona.warnaHex }}
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {zona.kodeZona}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                  {zona.namaZona}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  {zona.deskripsi}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {zona.luasHa.toLocaleString('id-ID')} Ha
                </span>
                <span className="text-[10px] text-slate-400">
                  {((zona.luasHa / 610.8) * 100).toFixed(1)}% Luas
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: TAMBAH TITIK PETA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Titik Lokasi Peta Desa
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Tempat / Bangunan*</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Misal: Pos Kamling RT 03"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Kantor Pemerintahan">Kantor Pemerintahan</option>
                    <option value="Fasilitas Umum">Fasilitas Umum</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="UMKM Unggulan">UMKM Unggulan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dusun</label>
                  <select
                    value={formData.dusun}
                    onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Cisalak">Cisalak</option>
                    <option value="Cihandiwung Lor">Cihandiwung Lor</option>
                    <option value="Cukangleles Kidul">Cukangleles Kidul</option>
                    <option value="Cidulang">Cidulang</option>
                    <option value="Cilatar">Cilatar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Latitude (Lintang)*</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Longitude (Bujur)*</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat / Lokasi</label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jl. Melati No. 10"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Fasilitas</label>
                <textarea
                  rows={2}
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
                  Simpan Titik Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPOR CSV KOORDINAT */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Impor Koordinat Geospasial dari CSV
              </h3>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Format CSV yang didukung: Nama, Kategori, Latitude, Longitude, Dusun, Alamat.
            </p>
            <div className="mt-4 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Pilih File CSV Koordinat</p>
              <button
                type="button"
                onClick={() => {
                  addPetaLokasi({
                    nama: 'Mata Air Alami Cikawung Indah',
                    kategori: 'Fasilitas Umum',
                    latitude: -7.3331,
                    longitude: 108.6835,
                    deskripsi: 'Sumber mata air bersih pegunungan untuk kebutuhan air minum warga',
                    alamat: 'Hulu Sungai Dusun Cidulang',
                    dusun: 'Cidulang',
                  });
                  alert('Berhasil mengimpor titik koordinat baru dari file CSV!');
                  setIsCsvModalOpen(false);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Simulasi Impor Titik Mata Air
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
