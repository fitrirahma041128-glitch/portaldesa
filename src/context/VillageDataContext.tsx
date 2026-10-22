import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Penduduk,
  KartuKeluarga,
  MutasiPenduduk,
  Infrastruktur,
  LembagaDesa,
  UMKM,
  APBDesItem,
  AsetDesa,
  Pengumuman,
  AgendaDesa,
  PetaLokasi,
  PolaRuang,
  ActivityLog,
} from '../types';
import {
  INITIAL_PENDUDUK,
  INITIAL_KARTU_KELUARGA,
  INITIAL_MUTASI,
  INITIAL_INFRASTRUKTUR,
  INITIAL_LEMBAGA,
  INITIAL_UMKM,
  INITIAL_APBDES,
  INITIAL_ASET,
  INITIAL_PENGUMUMAN,
  INITIAL_AGENDA,
  INITIAL_PETA_LOKASI,
  INITIAL_POLA_RUANG,
  INITIAL_LOGS,
} from '../data/mockData';

interface VillageDataContextType {
  // Penduduk
  pendudukList: Penduduk[];
  addPenduduk: (p: Omit<Penduduk, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; message: string; data?: Penduduk };
  updatePenduduk: (id: string, p: Partial<Penduduk>) => { success: boolean; message: string };
  deletePenduduk: (id: string) => { success: boolean; message: string };
  getPendudukById: (id: string) => Penduduk | undefined;
  importPendudukBatch: (items: Omit<Penduduk, 'id' | 'createdAt' | 'updatedAt'>[]) => number;

  // Kartu Keluarga
  kkList: KartuKeluarga[];
  addKK: (kk: Omit<KartuKeluarga, 'id'>) => { success: boolean; message: string };
  deleteKK: (id: string) => void;

  // Mutasi
  mutasiList: MutasiPenduduk[];
  addMutasi: (m: Omit<MutasiPenduduk, 'id' | 'createdAt'>) => { success: boolean; message: string };
  deleteMutasi: (id: string) => void;

  // Infrastruktur
  infrastrukturList: Infrastruktur[];
  addInfrastruktur: (inf: Omit<Infrastruktur, 'id'>) => { success: boolean; message: string };
  updateInfrastruktur: (id: string, inf: Partial<Infrastruktur>) => { success: boolean; message: string };
  deleteInfrastruktur: (id: string) => void;

  // Lembaga Desa
  lembagaList: LembagaDesa[];
  addLembaga: (l: Omit<LembagaDesa, 'id'>) => { success: boolean; message: string };
  updateLembaga: (id: string, l: Partial<LembagaDesa>) => { success: boolean; message: string };
  deleteLembaga: (id: string) => void;

  // UMKM
  umkmList: UMKM[];
  addUMKM: (u: Omit<UMKM, 'id'>) => { success: boolean; message: string };
  updateUMKM: (id: string, u: Partial<UMKM>) => { success: boolean; message: string };
  deleteUMKM: (id: string) => void;

  // APBDes
  apbdesList: APBDesItem[];
  addAPBDes: (item: Omit<APBDesItem, 'id'>) => { success: boolean; message: string };
  updateAPBDes: (id: string, item: Partial<APBDesItem>) => { success: boolean; message: string };
  deleteAPBDes: (id: string) => void;

  // Aset Desa
  asetList: AsetDesa[];
  addAset: (a: Omit<AsetDesa, 'id'>) => { success: boolean; message: string };
  updateAset: (id: string, a: Partial<AsetDesa>) => { success: boolean; message: string };
  deleteAset: (id: string) => void;

  // Pengumuman & Berita
  pengumumanList: Pengumuman[];
  addPengumuman: (p: Omit<Pengumuman, 'id'>) => { success: boolean; message: string };
  updatePengumuman: (id: string, p: Partial<Pengumuman>) => { success: boolean; message: string };
  deletePengumuman: (id: string) => void;

  // Agenda
  agendaList: AgendaDesa[];
  addAgenda: (a: Omit<AgendaDesa, 'id'>) => { success: boolean; message: string };
  deleteAgenda: (id: string) => void;

  // Peta & Pola Ruang
  petaLokasiList: PetaLokasi[];
  addPetaLokasi: (pl: Omit<PetaLokasi, 'id'>) => { success: boolean; message: string };
  deletePetaLokasi: (id: string) => void;
  polaRuangList: PolaRuang[];

  // Activity Logs
  logsList: ActivityLog[];
  addLog: (action: string, module: string, target: string, userName?: string) => void;

  // Utilities
  resetAllData: () => void;
}

const VillageDataContext = createContext<VillageDataContextType | undefined>(undefined);

const STORAGE_PREFIX = 'simpandadu_data_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

export const VillageDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendudukList, setPendudukList] = useState<Penduduk[]>(() =>
    loadFromStorage('penduduk', INITIAL_PENDUDUK)
  );
  const [kkList, setKkList] = useState<KartuKeluarga[]>(() =>
    loadFromStorage('kk', INITIAL_KARTU_KELUARGA)
  );
  const [mutasiList, setMutasiList] = useState<MutasiPenduduk[]>(() =>
    loadFromStorage('mutasi', INITIAL_MUTASI)
  );
  const [infrastrukturList, setInfrastrukturList] = useState<Infrastruktur[]>(() =>
    loadFromStorage('infrastruktur', INITIAL_INFRASTRUKTUR)
  );
  const [lembagaList, setLembagaList] = useState<LembagaDesa[]>(() =>
    loadFromStorage('lembaga', INITIAL_LEMBAGA)
  );
  const [umkmList, setUmkmList] = useState<UMKM[]>(() =>
    loadFromStorage('umkm', INITIAL_UMKM)
  );
  const [apbdesList, setApbdesList] = useState<APBDesItem[]>(() =>
    loadFromStorage('apbdes', INITIAL_APBDES)
  );
  const [asetList, setAsetList] = useState<AsetDesa[]>(() =>
    loadFromStorage('aset', INITIAL_ASET)
  );
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(() =>
    loadFromStorage('pengumuman', INITIAL_PENGUMUMAN)
  );
  const [agendaList, setAgendaList] = useState<AgendaDesa[]>(() =>
    loadFromStorage('agenda', INITIAL_AGENDA)
  );
  const [petaLokasiList, setPetaLokasiList] = useState<PetaLokasi[]>(() =>
    loadFromStorage('peta', INITIAL_PETA_LOKASI)
  );
  const [polaRuangList] = useState<PolaRuang[]>(INITIAL_POLA_RUANG);
  const [logsList, setLogsList] = useState<ActivityLog[]>(() =>
    loadFromStorage('logs', INITIAL_LOGS)
  );

  // Sync state changes to storage
  useEffect(() => saveToStorage('penduduk', pendudukList), [pendudukList]);
  useEffect(() => saveToStorage('kk', kkList), [kkList]);
  useEffect(() => saveToStorage('mutasi', mutasiList), [mutasiList]);
  useEffect(() => saveToStorage('infrastruktur', infrastrukturList), [infrastrukturList]);
  useEffect(() => saveToStorage('lembaga', lembagaList), [lembagaList]);
  useEffect(() => saveToStorage('umkm', umkmList), [umkmList]);
  useEffect(() => saveToStorage('apbdes', apbdesList), [apbdesList]);
  useEffect(() => saveToStorage('aset', asetList), [asetList]);
  useEffect(() => saveToStorage('pengumuman', pengumumanList), [pengumumanList]);
  useEffect(() => saveToStorage('agenda', agendaList), [agendaList]);
  useEffect(() => saveToStorage('peta', petaLokasiList), [petaLokasiList]);
  useEffect(() => saveToStorage('logs', logsList), [logsList]);

  const addLog = (action: string, module: string, target: string, userName?: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: 'u-current',
      userName: userName || 'Admin Desa',
      action,
      module,
      target,
      timestamp:
        new Date().toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB',
      ipAddress: '192.168.1.10',
    };
    setLogsList((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // PENDUDUK CRUD
  const addPenduduk = (
    p: Omit<Penduduk, 'id' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; message: string; data?: Penduduk } => {
    // Validate NIK
    if (!p.nik || p.nik.length !== 16 || !/^\d+$/.test(p.nik)) {
      return { success: false, message: 'NIK harus tepat 16 digit angka.' };
    }
    if (!p.noKk || p.noKk.length !== 16 || !/^\d+$/.test(p.noKk)) {
      return { success: false, message: 'Nomor Kartu Keluarga harus 16 digit angka.' };
    }
    if (pendudukList.some((item) => item.nik === p.nik)) {
      return { success: false, message: `NIK ${p.nik} sudah terdaftar dalam sistem.` };
    }
    if (!p.namaLengkap.trim()) {
      return { success: false, message: 'Nama lengkap wajib diisi.' };
    }

    const today = new Date().toISOString().slice(0, 10);
    const newPenduduk: Penduduk = {
      ...p,
      id: `p-${Date.now()}`,
      createdAt: today,
      updatedAt: today,
    };

    setPendudukList((prev) => [newPenduduk, ...prev]);
    addLog('Tambah Penduduk', 'Kependudukan', `${newPenduduk.namaLengkap} (NIK: ${newPenduduk.nik})`);
    return { success: true, message: 'Data penduduk berhasil ditambahkan!', data: newPenduduk };
  };

  const updatePenduduk = (id: string, p: Partial<Penduduk>): { success: boolean; message: string } => {
    if (p.nik) {
      if (p.nik.length !== 16 || !/^\d+$/.test(p.nik)) {
        return { success: false, message: 'NIK harus tepat 16 digit angka.' };
      }
      const duplicate = pendudukList.some((item) => item.id !== id && item.nik === p.nik);
      if (duplicate) {
        return { success: false, message: `NIK ${p.nik} sudah digunakan oleh warga lain.` };
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    setPendudukList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...p, updatedAt: today } : item))
    );
    addLog('Ubah Data', 'Kependudukan', `ID: ${id}`);
    return { success: true, message: 'Data penduduk berhasil diperbarui!' };
  };

  const deletePenduduk = (id: string): { success: boolean; message: string } => {
    const target = pendudukList.find((p) => p.id === id);
    setPendudukList((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      addLog('Hapus Penduduk', 'Kependudukan', `${target.namaLengkap} (${target.nik})`);
    }
    return { success: true, message: 'Data penduduk berhasil dihapus.' };
  };

  const getPendudukById = (id: string) => {
    return pendudukList.find((p) => p.id === id || p.nik === id);
  };

  const importPendudukBatch = (items: Omit<Penduduk, 'id' | 'createdAt' | 'updatedAt'>[]): number => {
    const today = new Date().toISOString().slice(0, 10);
    let imported = 0;
    const toAdd: Penduduk[] = [];

    items.forEach((p, idx) => {
      if (p.nik && !pendudukList.some((existing) => existing.nik === p.nik)) {
        toAdd.push({
          ...p,
          id: `p-imp-${Date.now()}-${idx}`,
          createdAt: today,
          updatedAt: today,
        });
        imported++;
      }
    });

    if (toAdd.length > 0) {
      setPendudukList((prev) => [...toAdd, ...prev]);
      addLog('Impor Data', 'Kependudukan', `${imported} warga berhasil diimpor`);
    }
    return imported;
  };

  // KARTU KELUARGA
  const addKK = (kk: Omit<KartuKeluarga, 'id'>) => {
    if (kkList.some((item) => item.noKk === kk.noKk)) {
      return { success: false, message: `Nomor KK ${kk.noKk} sudah terdaftar.` };
    }
    const newKk: KartuKeluarga = { ...kk, id: `kk-${Date.now()}` };
    setKkList((prev) => [newKk, ...prev]);
    addLog('Tambah KK', 'Kependudukan', `KK: ${kk.noKk} a.n ${kk.namaKepalaKeluarga}`);
    return { success: true, message: 'Kartu Keluarga berhasil ditambahkan!' };
  };

  const deleteKK = (id: string) => {
    setKkList((prev) => prev.filter((kk) => kk.id !== id));
    addLog('Hapus KK', 'Kependudukan', `ID: ${id}`);
  };

  // MUTASI
  const addMutasi = (m: Omit<MutasiPenduduk, 'id' | 'createdAt'>) => {
    const today = new Date().toISOString().slice(0, 10);
    const newM: MutasiPenduduk = { ...m, id: `m-${Date.now()}`, createdAt: today };
    setMutasiList((prev) => [newM, ...prev]);
    addLog('Pencatatan Mutasi', 'Kependudukan', `${m.jenisMutasi}: ${m.nama}`);
    return { success: true, message: `Mutasi ${m.jenisMutasi} berhasil dicatat!` };
  };

  const deleteMutasi = (id: string) => {
    setMutasiList((prev) => prev.filter((m) => m.id !== id));
  };

  // INFRASTRUKTUR
  const addInfrastruktur = (inf: Omit<Infrastruktur, 'id'>) => {
    const newInf: Infrastruktur = { ...inf, id: `inf-${Date.now()}` };
    setInfrastrukturList((prev) => [newInf, ...prev]);
    addLog('Tambah Infrastruktur', 'Infrastruktur', inf.nama);
    return { success: true, message: 'Infrastruktur berhasil ditambahkan!' };
  };

  const updateInfrastruktur = (id: string, inf: Partial<Infrastruktur>) => {
    setInfrastrukturList((prev) => prev.map((item) => (item.id === id ? { ...item, ...inf } : item)));
    addLog('Ubah Infrastruktur', 'Infrastruktur', `ID: ${id}`);
    return { success: true, message: 'Infrastruktur berhasil diperbarui!' };
  };

  const deleteInfrastruktur = (id: string) => {
    setInfrastrukturList((prev) => prev.filter((item) => item.id !== id));
    addLog('Hapus Infrastruktur', 'Infrastruktur', `ID: ${id}`);
  };

  // LEMBAGA
  const addLembaga = (l: Omit<LembagaDesa, 'id'>) => {
    const newL: LembagaDesa = { ...l, id: `lem-${Date.now()}` };
    setLembagaList((prev) => [newL, ...prev]);
    addLog('Tambah Lembaga', 'Lembaga Desa', l.nama);
    return { success: true, message: 'Lembaga Desa berhasil ditambahkan!' };
  };

  const updateLembaga = (id: string, l: Partial<LembagaDesa>) => {
    setLembagaList((prev) => prev.map((item) => (item.id === id ? { ...item, ...l } : item)));
    return { success: true, message: 'Lembaga Desa berhasil diperbarui!' };
  };

  const deleteLembaga = (id: string) => {
    setLembagaList((prev) => prev.filter((item) => item.id !== id));
  };

  // UMKM
  const addUMKM = (u: Omit<UMKM, 'id'>) => {
    const newU: UMKM = { ...u, id: `umkm-${Date.now()}` };
    setUmkmList((prev) => [newU, ...prev]);
    addLog('Tambah UMKM', 'Ekonomi & UMKM', u.namaUsaha);
    return { success: true, message: 'Data UMKM berhasil didaftarkan!' };
  };

  const updateUMKM = (id: string, u: Partial<UMKM>) => {
    setUmkmList((prev) => prev.map((item) => (item.id === id ? { ...item, ...u } : item)));
    return { success: true, message: 'Data UMKM berhasil diperbarui!' };
  };

  const deleteUMKM = (id: string) => {
    setUmkmList((prev) => prev.filter((item) => item.id !== id));
  };

  // APBDES
  const addAPBDes = (item: Omit<APBDesItem, 'id'>) => {
    const newItem: APBDesItem = { ...item, id: `apb-${Date.now()}` };
    setApbdesList((prev) => [newItem, ...prev]);
    addLog('Tambah Pos APBDes', 'Keuangan', `${item.kategori}: ${item.uraian}`);
    return { success: true, message: 'Pos APBDes berhasil ditambahkan!' };
  };

  const updateAPBDes = (id: string, item: Partial<APBDesItem>) => {
    setApbdesList((prev) => prev.map((i) => (i.id === id ? { ...i, ...item } : i)));
    return { success: true, message: 'Pos APBDes berhasil diperbarui!' };
  };

  const deleteAPBDes = (id: string) => {
    setApbdesList((prev) => prev.filter((i) => i.id !== id));
  };

  // ASET
  const addAset = (a: Omit<AsetDesa, 'id'>) => {
    const newA: AsetDesa = { ...a, id: `ast-${Date.now()}` };
    setAsetList((prev) => [newA, ...prev]);
    addLog('Tambah Aset', 'Aset Desa', a.namaAset);
    return { success: true, message: 'Aset Desa berhasil didata!' };
  };

  const updateAset = (id: string, a: Partial<AsetDesa>) => {
    setAsetList((prev) => prev.map((item) => (item.id === id ? { ...item, ...a } : item)));
    return { success: true, message: 'Data Aset berhasil diperbarui!' };
  };

  const deleteAset = (id: string) => {
    setAsetList((prev) => prev.filter((item) => item.id !== id));
  };

  // PENGUMUMAN
  const addPengumuman = (p: Omit<Pengumuman, 'id'>) => {
    const newP: Pengumuman = { ...p, id: `pgm-${Date.now()}` };
    setPengumumanList((prev) => [newP, ...prev]);
    addLog('Buat Pengumuman', 'Pengumuman', p.judul);
    return { success: true, message: 'Pengumuman berhasil dipublikasikan!' };
  };

  const updatePengumuman = (id: string, p: Partial<Pengumuman>) => {
    setPengumumanList((prev) => prev.map((item) => (item.id === id ? { ...item, ...p } : item)));
    return { success: true, message: 'Pengumuman berhasil diperbarui!' };
  };

  const deletePengumuman = (id: string) => {
    setPengumumanList((prev) => prev.filter((item) => item.id !== id));
  };

  // AGENDA
  const addAgenda = (a: Omit<AgendaDesa, 'id'>) => {
    const newA: AgendaDesa = { ...a, id: `agd-${Date.now()}` };
    setAgendaList((prev) => [newA, ...prev]);
    return { success: true, message: 'Agenda desa berhasil ditambahkan!' };
  };

  const deleteAgenda = (id: string) => {
    setAgendaList((prev) => prev.filter((item) => item.id !== id));
  };

  // PETA
  const addPetaLokasi = (pl: Omit<PetaLokasi, 'id'>) => {
    const newPl: PetaLokasi = { ...pl, id: `pt-${Date.now()}` };
    setPetaLokasiList((prev) => [newPl, ...prev]);
    addLog('Tambah Titik Peta', 'Peta Desa', pl.nama);
    return { success: true, message: 'Titik koordinat berhasil ditambahkan ke peta!' };
  };

  const deletePetaLokasi = (id: string) => {
    setPetaLokasiList((prev) => prev.filter((item) => item.id !== id));
  };

  const resetAllData = () => {
    localStorage.clear();
    setPendudukList(INITIAL_PENDUDUK);
    setKkList(INITIAL_KARTU_KELUARGA);
    setMutasiList(INITIAL_MUTASI);
    setInfrastrukturList(INITIAL_INFRASTRUKTUR);
    setLembagaList(INITIAL_LEMBAGA);
    setUmkmList(INITIAL_UMKM);
    setApbdesList(INITIAL_APBDES);
    setAsetList(INITIAL_ASET);
    setPengumumanList(INITIAL_PENGUMUMAN);
    setAgendaList(INITIAL_AGENDA);
    setPetaLokasiList(INITIAL_PETA_LOKASI);
    setLogsList(INITIAL_LOGS);
    addLog('Reset Sistem', 'Pengaturan', 'Data dikembalikan ke sampel default');
  };

  return (
    <VillageDataContext.Provider
      value={{
        pendudukList,
        addPenduduk,
        updatePenduduk,
        deletePenduduk,
        getPendudukById,
        importPendudukBatch,
        kkList,
        addKK,
        deleteKK,
        mutasiList,
        addMutasi,
        deleteMutasi,
        infrastrukturList,
        addInfrastruktur,
        updateInfrastruktur,
        deleteInfrastruktur,
        lembagaList,
        addLembaga,
        updateLembaga,
        deleteLembaga,
        umkmList,
        addUMKM,
        updateUMKM,
        deleteUMKM,
        apbdesList,
        addAPBDes,
        updateAPBDes,
        deleteAPBDes,
        asetList,
        addAset,
        updateAset,
        deleteAset,
        pengumumanList,
        addPengumuman,
        updatePengumuman,
        deletePengumuman,
        agendaList,
        addAgenda,
        deleteAgenda,
        petaLokasiList,
        addPetaLokasi,
        deletePetaLokasi,
        polaRuangList,
        logsList,
        addLog,
        resetAllData,
      }}
    >
      {children}
    </VillageDataContext.Provider>
  );
};

export const useVillageData = () => {
  const context = useContext(VillageDataContext);
  if (!context) {
    throw new Error('useVillageData must be used within a VillageDataProvider');
  }
  return context;
};
