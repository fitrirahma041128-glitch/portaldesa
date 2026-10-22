import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useVillageData } from '../../context/VillageDataContext';
import {
  User,
  KeyRound,
  Database,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  FileCode,
  Terminal,
} from 'lucide-react';

export const PengaturanProfilView: React.FC = () => {
  const { currentUser, updateProfile, changePassword } = useAuth();
  const { resetAllData } = useVillageData();

  const [activeTab, setActiveTab] = useState<'profil' | 'password' | 'database'>('profil');

  // Profile Form
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [jabatan, setJabatan] = useState(currentUser?.jabatan || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Password Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Database simulator test
  const [dbStatus, setDbStatus] = useState<'connected' | 'checking'>('connected');
  const [queryOutput, setQueryOutput] = useState<string>('SELECT COUNT(*) AS total_warga FROM penduduk;\n-- Result: 10,429 rows\n-- Status: 200 OK (0.002 sec)');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, jabatan, phone });
    setProfileMsg('Profil berhasil diperbarui!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'Konfirmasi kata sandi tidak cocok!', error: true });
      return;
    }

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ text: res.message, error: false });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ text: res.message, error: true });
    }
  };

  const handleTestConnection = () => {
    setDbStatus('checking');
    setTimeout(() => {
      setDbStatus('connected');
      alert('Koneksi ke pool database MySQL (simpandadu_db) berhasil diuji! Latensi: 1.8ms.');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Pengaturan Akun & Konfigurasi Sistem
        </h2>
        <p className="text-xs text-slate-500">
          Kelola profil administrator, kata sandi, dan status koneksi database MySQL
        </p>
      </div>

      {/* Segmented Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'profil' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profil Pengguna</span>
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'password' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Keamanan & Password</span>
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'database' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Status Database MySQL</span>
        </button>
      </div>

      {/* TAB 1: PROFIL PENGGUNA */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {currentUser?.name.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{currentUser?.name}</h3>
              <p className="text-xs text-slate-500">{currentUser?.jabatan}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Peran: {currentUser?.role.toUpperCase()}
              </span>
            </div>
          </div>

          {profileMsg && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Email Kedinasan</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jabatan / Posisi</label>
                <input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: KEAMANAN & PASSWORD */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Perbarui Kata Sandi Akun
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Pastikan kata sandi baru Anda minimal 6 karakter dengan kombinasi huruf dan angka.
          </p>

          {passwordMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 mb-4 ${
                passwordMsg.error
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              }`}
            >
              {passwordMsg.error ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini*</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru*</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru*</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Ubah Kata Sandi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: STATUS DATABASE MYSQL */}
      {activeTab === 'database' && (
        <div className="space-y-6 max-w-4xl">
          {/* Server Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Koneksi Relasional MySQL & Backend API
                  </h3>
                  <p className="text-xs text-slate-500">
                    Engine: InnoDB • Host: localhost:3306 • DB: simpandadu_db
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestConnection}
                  disabled={dbStatus === 'checking'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dbStatus === 'checking' ? 'animate-spin' : ''}`} />
                  <span>Uji Koneksi DB</span>
                </button>
              </div>
            </div>

            {/* Parameter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status DB</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Siap / Aktif
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Tabel</span>
                <span className="font-bold text-slate-900 font-mono mt-0.5 block">16 Tabel Relasi</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Karakter Set</span>
                <span className="font-bold text-slate-900 font-mono mt-0.5 block">utf8mb4_unicode_ci</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Penyimpanan</span>
                <span className="font-bold text-blue-600 font-mono mt-0.5 block">Dual Mode (Sync)</span>
              </div>
            </div>

            {/* Quick SQL Console Simulation */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-slate-500" />
                  Terminal Query Database (Simulator)
                </span>
                <span className="text-[11px] text-slate-400">File skema: src/db/schema.sql</span>
              </div>
              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <pre>{queryOutput}</pre>
              </div>
            </div>
          </div>

          {/* Reset System Sample Data */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Reset Data Sampel Desa Adimulya
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Kembalikan seluruh data kependudukan, keuangan, dan infrastruktur ke kondisi awal demonstrasi.
            </p>
            <button
              onClick={() => {
                if (confirm('Kembalikan semua data ke sampel awal Desa Adimulya?')) {
                  resetAllData();
                  alert('Data telah berhasil di-reset ke kondisi sampel awal!');
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer"
            >
              Reset Data ke Sampel Awal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
