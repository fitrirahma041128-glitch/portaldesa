import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { LogIn, Menu, X, ChevronRight, Phone } from 'lucide-react';

export type PublicNavTab =
  | 'beranda'
  | 'profil'
  | 'pemerintahan'
  | 'peta'
  | 'perencanaan'
  | 'umkm'
  | 'kontak';

interface PublicNavbarProps {
  currentTab: PublicNavTab;
  onSelectTab: (tab: PublicNavTab) => void;
  onGoToLogin: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentTab,
  onSelectTab,
  onGoToLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil Desa' },
    { id: 'pemerintahan', label: 'Pemerintahan' },
    { id: 'peta', label: 'Peta Desa' },
    { id: 'perencanaan', label: 'Perencanaan' },
    { id: 'umkm', label: 'UMKM Desa' },
    { id: 'kontak', label: 'Kontak' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('beranda')}
          className="flex items-center gap-3 text-left cursor-pointer shrink-0"
        >
          <Logo size="md" withText={true} />
        </button>

        {/* Zone 2: Navigation Links (Strict Single-Line Contract) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id as PublicNavTab)}
                className={`whitespace-nowrap transition-colors py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action (Login Admin) & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onGoToLogin}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login Admin</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 animate-in fade-in">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id as PublicNavTab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
