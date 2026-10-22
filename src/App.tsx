import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VillageDataProvider } from './context/VillageDataContext';

// Auth Components
import { LoginPage } from './components/auth/LoginPage';

// Admin Components
import { AdminLayout, AdminMenuTab } from './components/admin/AdminLayout';
import { DashboardView } from './components/admin/DashboardView';
import { PendudukView } from './components/admin/PendudukView';
import { InfrastrukturView } from './components/admin/InfrastrukturView';
import { LembagaDesaView } from './components/admin/LembagaDesaView';
import { PetaDesaView } from './components/admin/PetaDesaView';
import { UMKMView } from './components/admin/UMKMView';
import { KeuanganView } from './components/admin/KeuanganView';
import { AsetDesaView } from './components/admin/AsetDesaView';
import { PengumumanView } from './components/admin/PengumumanView';
import { PengaturanProfilView } from './components/admin/PengaturanProfilView';

// Public Components
import { PublicNavbar, PublicNavTab } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { PublicHome } from './components/public/PublicHome';
import { PublicProfil } from './components/public/PublicProfil';
import { PublicPeta } from './components/public/PublicPeta';
import { PublicPerencanaan } from './components/public/PublicPerencanaan';
import { PublicUMKM } from './components/public/PublicUMKM';
import { PublicPemerintahan } from './components/public/PublicPemerintahan';
import { PublicKontak } from './components/public/PublicKontak';

type ViewMode = 'public' | 'login' | 'admin';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Primary view routing
  const [viewMode, setViewMode] = useState<ViewMode>('public');

  // Admin internal tabs
  const [adminTab, setAdminTab] = useState<AdminMenuTab>('dashboard');
  const [adminSubTab, setAdminSubTab] = useState<string>('penduduk-list');

  // Public internal tabs
  const [publicTab, setPublicTab] = useState<PublicNavTab>('beranda');

  // Sync authentication state changes
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && viewMode === 'login') {
        setViewMode('admin');
      } else if (!isAuthenticated && viewMode === 'admin') {
        setViewMode('login');
      }
    }
  }, [isAuthenticated, isLoading, viewMode]);

  // Loading indicator for session check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-semibold text-slate-300">Memuat Sistem SIMPANDADU...</p>
        </div>
      </div>
    );
  }

  // 1. LOGIN PAGE VIEW (Matches Step 1 in diagram)
  if (viewMode === 'login') {
    return (
      <LoginPage
        onBackToPortal={() => setViewMode('public')}
        onLoginSuccess={() => {
          setViewMode('admin');
          setAdminTab('dashboard');
        }}
      />
    );
  }

  // 2. ADMIN DASHBOARD & MODULES VIEW (Matches Steps 2, 3, 4, 5, 6, 7)
  if (viewMode === 'admin' && isAuthenticated) {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => setAdminTab(tab)}
        onOpenPublicPortal={() => setViewMode('public')}
        activeSubTab={adminSubTab}
        onSelectSubTab={(sub) => setAdminSubTab(sub)}
      >
        {adminTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={(tab, subTab) => {
              setAdminTab(tab);
              if (subTab) setAdminSubTab(subTab);
            }}
          />
        )}
        {adminTab === 'penduduk' && <PendudukView initialSubTab={adminSubTab} />}
        {adminTab === 'infrastruktur' && <InfrastrukturView />}
        {adminTab === 'lembaga' && <LembagaDesaView />}
        {adminTab === 'peta' && <PetaDesaView />}
        {adminTab === 'umkm' && <UMKMView />}
        {adminTab === 'keuangan' && <KeuanganView />}
        {adminTab === 'aset' && <AsetDesaView />}
        {adminTab === 'pengumuman' && <PengumumanView />}
        {adminTab === 'pengaturan' && <PengaturanProfilView />}
      </AdminLayout>
    );
  }

  // 3. PUBLIC CITIZEN PORTAL VIEW (Accessible without login)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PublicNavbar
          currentTab={publicTab}
          onSelectTab={(tab) => setPublicTab(tab)}
          onGoToLogin={() => setViewMode('login')}
        />

        <main>
          {publicTab === 'beranda' && (
            <PublicHome
              onSelectTab={(tab) => setPublicTab(tab)}
              onGoToLogin={() => setViewMode('login')}
            />
          )}
          {publicTab === 'profil' && <PublicProfil />}
          {publicTab === 'pemerintahan' && <PublicPemerintahan />}
          {publicTab === 'peta' && <PublicPeta />}
          {publicTab === 'perencanaan' && <PublicPerencanaan />}
          {publicTab === 'umkm' && <PublicUMKM />}
          {publicTab === 'kontak' && <PublicKontak />}
        </main>
      </div>

      <PublicFooter
        onSelectTab={(tab) => setPublicTab(tab)}
        onGoToLogin={() => setViewMode('login')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <VillageDataProvider>
        <MainApp />
      </VillageDataProvider>
    </AuthProvider>
  );
}
