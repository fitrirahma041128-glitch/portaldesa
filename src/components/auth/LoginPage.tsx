import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VillageEmblem, Logo } from '../common/Logo';
import { User, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onBackToPortal: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToPortal, onLoginSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim()) {
      setErrorMessage('Username atau Email wajib diisi.');
      return;
    }
    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(username, password, rememberMe);
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan saat memproses login. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      {/* Left Column: Visual Scenery & Branding */}
      <div className="relative md:w-5/12 lg:w-1/2 min-h-[300px] md:min-h-screen flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden">
        {/* Background photo */}
        <img
          src="/src/assets/images/desa_adimulya_scenery_1792674813332.jpg"
          alt="Pemandangan Desa Adimulya"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Navy Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/50 backdrop-blur-[1px]" />

        {/* Top brand header */}
        <div className="relative z-10 flex items-center justify-between">
          <Logo size="md" lightMode />
          <button
            onClick={onBackToPortal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Portal Publik
          </button>
        </div>

        {/* Center editorial slogan */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Portal Administrasi Resmi
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Bersama Membangun Desa yang Lebih Baik
          </h1>
          <p className="mt-3 text-slate-200 text-sm md:text-base leading-relaxed max-w-lg">
            Sistem terintegrasi untuk perencanaan pembangunan, administrasi kependudukan, transparansi anggaran APBDes, dan tata ruang Desa Adimulya.
          </p>

          {/* Quick Demo Acccount Switcher Pills */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <p className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-2.5">
              Akun Demonstrasi Cepat:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20"
              >
                👑 Admin Utama (<span className="text-amber-300">admin</span>)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('sekdes', 'sekdes123')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20"
              >
                🏛️ Sekdes (<span className="text-amber-300">sekdes</span>)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('kaurkeu', 'kaurkeu123')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20"
              >
                💰 Keuangan (<span className="text-amber-300">kaurkeu</span>)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom footer credit */}
        <div className="relative z-10 text-xs text-slate-400">
          Kecamatan Wanareja, Kabupaten Cilacap • Jawa Tengah
        </div>
      </div>

      {/* Right Column: Clean SaaS Login Form */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/80">
          {/* Logo & Greeting */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-4 shadow-xs">
              <VillageEmblem size={58} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang di SIMPANDADU
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Silakan login untuk melanjutkan ke panel kerja desa
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage} Mengalihkan ke dashboard...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono tracking-tight"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Ingat Saya</span>
              </label>
              <span className="text-slate-400 text-[11px]">Bantuan: Hubungi Sekdes</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <span>Login ke SIMPANDADU</span>
              )}
            </button>
          </form>

          {/* Bottom Back Link & Copyright */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
            <button
              onClick={onBackToPortal}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Portal Publik Desa Adimulya
            </button>
            <p className="text-[11px] text-slate-400">
              Desa Adimulya © 2025 • Sistem Informasi Perencanaan & Administrasi Terpadu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
