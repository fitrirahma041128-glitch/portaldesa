import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { LogoutModal } from '../auth/LogoutModal';
import {
  LayoutDashboard,
  Users,
  Building2,
  Network,
  MapPin,
  Store,
  DollarSign,
  Boxes,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  KeyRound,
  User as UserIcon,
  HelpCircle,
} from 'lucide-react';

export type AdminMenuTab =
  | 'dashboard'
  | 'penduduk'
  | 'infrastruktur'
  | 'lembaga'
  | 'peta'
  | 'umkm'
  | 'keuangan'
  | 'aset'
  | 'pengumuman'
  | 'pengaturan';

interface AdminLayoutProps {
  currentTab: AdminMenuTab;
  onSelectTab: (tab: AdminMenuTab) => void;
  onOpenPublicPortal: () => void;
  children: React.ReactNode;
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onOpenPublicPortal,
  children,
  activeSubTab,
  onSelectSubTab,
}) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendudukSubmenuOpen, setPendudukSubmenuOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'penduduk',
      label: 'Data Penduduk',
      icon: Users,
      hasSubmenu: true,
      submenus: [
        { id: 'penduduk-list', label: 'Data Penduduk' },
        { id: 'kk-list', label: 'Kartu Keluarga' },
        { id: 'mutasi-lahir', label: 'Kelahiran' },
        { id: 'mutasi-pendatang', label: 'Penduduk Datang' },
        { id: 'mutasi-pindah', label: 'Penduduk Pindah' },
        { id: 'mutasi-kematian', label: 'Kematian' },
      ],
    },
    {
      id: 'infrastruktur',
      label: 'Infrastruktur',
      icon: Building2,
      badge: '128',
    },
    {
      id: 'lembaga',
      label: 'Lembaga Desa',
      icon: Network,
      badge: null,
    },
    {
      id: 'peta',
      label: 'Peta & Tata Ruang',
      icon: MapPin,
      badge: 'GIS',
    },
    {
      id: 'umkm',
      label: 'Ekonomi & UMKM',
      icon: Store,
      badge: null,
    },
    {
      id: 'keuangan',
      label: 'Laporan Keuangan',
      icon: DollarSign,
      badge: 'APBDes',
    },
    {
      id: 'aset',
      label: 'Aset Desa',
      icon: Boxes,
      badge: null,
    },
    {
      id: 'pengumuman',
      label: 'Pengumuman & Berita',
      icon: Bell,
      badge: 'Baru',
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan Profil',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs h-16 flex items-center justify-between px-4 lg:px-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <Logo size="sm" withText={true} />
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penduduk (NIK), infrastruktur, UMKM, aset..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right: Public link, Notifications & User Dropdown */}
        <div className="flex items-center gap-2 lg:gap-3">
          <button
            onClick={onOpenPublicPortal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Buka Portal Publik Warga"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Portal Publik</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Notifikasi sistem"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-800">
                  <span>Pemberitahuan Sistem</span>
                  <span className="text-[10px] text-blue-600 cursor-pointer">Tandai telah dibaca</span>
                </div>
                <div className="divide-y divide-slate-100 mt-1 max-h-64 overflow-y-auto">
                  <div className="py-2.5 px-2 hover:bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-800">Musrenbangdes TA 2026</p>
                    <p className="text-slate-500 mt-0.5">Jadwal musyawarah penyusunan draf usulan RKPDes dimulai tanggal 28 Oktober.</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Baru saja</span>
                  </div>
                  <div className="py-2.5 px-2 hover:bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-800">Pencairan Dana Desa Tahap II</p>
                    <p className="text-slate-500 mt-0.5">Realisasi anggaran telah disinkronkan ke laporan keuangan APBDes.</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">1 jam lalu</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.name || 'Administrator'}
                </span>
                <span className="text-[11px] text-slate-500 leading-none">
                  {currentUser?.role === 'admin' ? 'Super Admin' : 'Perangkat Desa'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">{currentUser?.name}</p>
                  <p className="text-slate-500 text-[11px] truncate">{currentUser?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectTab('pengaturan');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <span>Profil Pengguna</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('pengaturan');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <KeyRound className="w-4 h-4 text-slate-500" />
                    <span>Ganti Password</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navy Blue Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Top: Menu List */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className="px-3 pb-3 mb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Menu Utama Sistem
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 font-mono">
                v2.5
              </span>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              if (item.hasSubmenu) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        onSelectTab('penduduk');
                        setPendudukSubmenuOpen(!pendudukSubmenuOpen);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          pendudukSubmenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {pendudukSubmenuOpen && (
                      <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-slate-800 ml-4">
                        {item.submenus?.map((sub) => {
                          const isSubActive =
                            currentTab === 'penduduk' &&
                            (activeSubTab === sub.id || (!activeSubTab && sub.id === 'penduduk-list'));
                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                onSelectTab('penduduk');
                                if (onSelectSubTab) onSelectSubTab(sub.id);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left cursor-pointer ${
                                isSubActive
                                  ? 'bg-blue-500/20 text-blue-300 font-semibold'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                              }`}
                            >
                              <span>{sub.label}</span>
                              {isSubActive && <ChevronRight className="w-3 h-3 text-blue-400" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id as AdminMenuTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Bottom: User & Logout */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/40">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-bold text-white truncate">
                    Desa Adimulya
                  </span>
                  <span className="text-[10px] text-slate-400">Online • Terenkripsi</span>
                </div>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Keluar dari Sistem"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};
