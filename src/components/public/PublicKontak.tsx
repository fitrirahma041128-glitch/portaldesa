import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PublicKontak: React.FC = () => {
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [pesan, setPesan] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setNama('');
      setNik('');
      setPesan('');
      setSubmitted(false);
      alert('Pesan dan aspirasi Anda telah diterima oleh Sekretariat Desa Adimulya. Terima kasih!');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Layanan Komunikasi Warga
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Kontak & Pengaduan Pelayanan Desa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Hubungi Pemerintah Desa Adimulya untuk informasi administrasi, permohonan surat keterangan, atau bantuan darurat
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Contact Info & Emergency Hotline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs sm:text-sm">
            <h3 className="text-base font-bold text-slate-900">
              Kantor Balai Desa Adimulya
            </h3>
            <div className="space-y-3 text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Alamat Kantor:</strong>
                  <span>Jl. Merdeka No. 01, Dusun Cilatar, Desa Adimulya, Kec. Wanareja, Kab. Cilacap, Jawa Tengah 53265</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Telepon / WhatsApp Kantor:</strong>
                  <span className="font-mono">(0280) 626123 / 0812-3456-7890</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Email Resmi:</strong>
                  <span>pemdes@adimulya.desa.id</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Jam Operasional Pelayanan:</strong>
                  <span>Senin - Kamis: 08.00 - 15.30 WIB<br />Jumat: 08.00 - 14.30 WIB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Hotline */}
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-6 text-xs text-red-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-red-700">
              <ShieldAlert className="w-5 h-5" />
              <span>Nomor Kontak Darurat 24 Jam</span>
            </div>
            <p className="text-slate-600">
              Layanan mobil siaga desa / ambulans darurat dan posko bencana desa:
            </p>
            <div className="pt-2 flex flex-col gap-1.5 font-mono font-bold">
              <span className="text-red-700">🚑 Driver Ambulans Siaga: 0813-9988-7766</span>
              <span className="text-slate-800">👮 Babinsa / Bhabinkamtibmas: 0812-2233-4455</span>
            </div>
          </div>
        </div>

        {/* Right: Message / Aspirations Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Kirim Saran & Aspirasi Masyarakat
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Pesan Anda akan diteruskan kepada pimpinan dan kaur terkait untuk ditindaklanjuti.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap*</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Anda"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIK (Nomor Induk Kependudukan)*</label>
              <input
                type="text"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="16 Digit NIK KTP Anda"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Isi Aspirasi / Pertanyaan*</label>
              <textarea
                rows={4}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Tuliskan aspirasi, usulan pembangunan, atau permohonan informasi secara jelas..."
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Mengirimkan Aspirasi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan ke Pemerintah Desa</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
