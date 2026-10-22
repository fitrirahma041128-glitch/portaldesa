import React, { useState, useMemo } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { Penduduk, JenisKelamin, StatusPerkawinan, StatusKependudukan, Agama, KartuKeluarga, MutasiPenduduk } from '../../types';
import { exportToCSV, printOfficialDocument } from '../../utils/exportUtils';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Printer,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Upload,
  UserCheck,
  UserPlus,
  UserMinus,
  Baby,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface PendudukViewProps {
  initialSubTab?: string;
}

export const PendudukView: React.FC<PendudukViewProps> = ({ initialSubTab = 'penduduk-list' }) => {
  const {
    pendudukList,
    addPenduduk,
    updatePenduduk,
    deletePenduduk,
    kkList,
    addKK,
    deleteKK,
    mutasiList,
    addMutasi,
    deleteMutasi,
    importPendudukBatch,
  } = useVillageData();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDusun, setFilterDusun] = useState('Semua');
  const [filterGender, setFilterGender] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Selected for detail view
  const [selectedPenduduk, setSelectedPenduduk] = useState<Penduduk | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Penduduk | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Penduduk | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddMutasiModalOpen, setIsAddMutasiModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    nik: '',
    noKk: '',
    namaLengkap: '',
    jenisKelamin: 'Laki-laki' as JenisKelamin,
    tempatLahir: '',
    tanggalLahir: '1995-01-01',
    agama: 'Islam' as Agama,
    pendidikan: 'SMA / SMK',
    pekerjaan: 'Wiraswasta',
    statusPerkawinan: 'Kawin' as StatusPerkawinan,
    statusKependudukan: 'Tetap' as StatusKependudukan,
    dusun: 'Cisalak',
    rt: '001',
    rw: '001',
    alamatLengkap: '',
    golonganDarah: 'O',
    kewarganegaraan: 'WNI',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered Residents
  const filteredPenduduk = useMemo(() => {
    return pendudukList.filter((item) => {
      const matchSearch =
        item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nik.includes(searchQuery) ||
        item.noKk.includes(searchQuery);
      const matchDusun = filterDusun === 'Semua' || item.dusun === filterDusun;
      const matchGender = filterGender === 'Semua' || item.jenisKelamin === filterGender;
      const matchStatus = filterStatus === 'Semua' || item.statusKependudukan === filterStatus;
      return matchSearch && matchDusun && matchGender && matchStatus;
    });
  }, [pendudukList, searchQuery, filterDusun, filterGender, filterStatus]);

  const totalPages = Math.ceil(filteredPenduduk.length / pageSize) || 1;
  const paginatedPenduduk = filteredPenduduk.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetForm = () => {
    setFormData({
      nik: '',
      noKk: '',
      namaLengkap: '',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Cilacap',
      tanggalLahir: '1995-01-01',
      agama: 'Islam',
      pendidikan: 'SMA / SMK',
      pekerjaan: 'Wiraswasta',
      statusPerkawinan: 'Kawin',
      statusKependudukan: 'Tetap',
      dusun: 'Cisalak',
      rt: '001',
      rw: '001',
      alamatLengkap: '',
      golonganDarah: 'O',
      kewarganegaraan: 'WNI',
    });
    setFormError('');
    setFormSuccess('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Penduduk) => {
    setEditItem(p);
    setFormData({
      nik: p.nik,
      noKk: p.noKk,
      namaLengkap: p.namaLengkap,
      jenisKelamin: p.jenisKelamin,
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      agama: p.agama,
      pendidikan: p.pendidikan,
      pekerjaan: p.pekerjaan,
      statusPerkawinan: p.statusPerkawinan,
      statusKependudukan: p.statusKependudukan,
      dusun: p.dusun,
      rt: p.rt,
      rw: p.rw,
      alamatLengkap: p.alamatLengkap,
      golonganDarah: p.golonganDarah || 'O',
      kewarganegaraan: p.kewarganegaraan,
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const res = addPenduduk(formData);
    if (res.success) {
      setFormSuccess(res.message);
      setTimeout(() => {
        setIsAddModalOpen(false);
      }, 700);
    } else {
      setFormError(res.message);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    setFormError('');
    const res = updatePenduduk(editItem.id, formData);
    if (res.success) {
      setFormSuccess(res.message);
      if (selectedPenduduk && selectedPenduduk.id === editItem.id) {
        setSelectedPenduduk({ ...selectedPenduduk, ...formData });
      }
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 700);
    } else {
      setFormError(res.message);
    }
  };

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    deletePenduduk(deleteCandidate.id);
    if (selectedPenduduk?.id === deleteCandidate.id) {
      setSelectedPenduduk(null);
    }
    setDeleteCandidate(null);
  };

  // Export functions
  const handleExportCSV = () => {
    const titles = {
      nik: 'NIK',
      noKk: 'No KK',
      namaLengkap: 'Nama Lengkap',
      jenisKelamin: 'Jenis Kelamin',
      tempatLahir: 'Tempat Lahir',
      tanggalLahir: 'Tanggal Lahir',
      agama: 'Agama',
      pendidikan: 'Pendidikan',
      pekerjaan: 'Pekerjaan',
      statusPerkawinan: 'Status Perkawinan',
      statusKependudukan: 'Status',
      dusun: 'Dusun',
      rt: 'RT',
      rw: 'RW',
      alamatLengkap: 'Alamat',
    };
    exportToCSV('Data_Penduduk_Desa_Adimulya', filteredPenduduk, titles);
  };

  const handlePrintTable = () => {
    let rowsHtml = '';
    filteredPenduduk.forEach((p, idx) => {
      rowsHtml += `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>${p.nik}</td>
          <td><strong>${p.namaLengkap}</strong></td>
          <td>${p.jenisKelamin}</td>
          <td>${p.tempatLahir}, ${p.tanggalLahir}</td>
          <td>${p.dusun} RT ${p.rt}/RW ${p.rw}</td>
          <td>${p.pekerjaan}</td>
          <td>${p.statusKependudukan}</td>
        </tr>
      `;
    });

    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>NIK</th>
            <th>Nama Lengkap</th>
            <th>L/P</th>
            <th>Tempat, Tgl Lahir</th>
            <th>Dusun & Alamat</th>
            <th>Pekerjaan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <p style="margin-top: 15px; font-size: 10pt;">Total data dicetak: <strong>${filteredPenduduk.length}</strong> jiwa.</p>
    `;

    printOfficialDocument(
      'LAPORAN BUKU INDUK KEPENDUDUKAN DESA ADIMULYA',
      'Administrasi Kependudukan',
      tableHtml
    );
  };

  const handlePrintDetail = (p: Penduduk) => {
    const content = `
      <div style="border: 1px solid #ccc; padding: 15px; border-radius: 4px;">
        <table style="width: 100%; border: none;">
          <tr style="border: none;"><td style="width: 25%; font-weight: bold; border: none;">Nama Lengkap</td><td style="border: none;">: ${p.namaLengkap}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Nomor Induk Kependudukan (NIK)</td><td style="border: none;">: ${p.nik}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Nomor Kartu Keluarga (KK)</td><td style="border: none;">: ${p.noKk}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Jenis Kelamin</td><td style="border: none;">: ${p.jenisKelamin}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Tempat, Tanggal Lahir</td><td style="border: none;">: ${p.tempatLahir}, ${p.tanggalLahir}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Agama</td><td style="border: none;">: ${p.agama}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Pendidikan Terakhir</td><td style="border: none;">: ${p.pendidikan}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Pekerjaan</td><td style="border: none;">: ${p.pekerjaan}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Status Perkawinan</td><td style="border: none;">: ${p.statusPerkawinan}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Status Kependudukan</td><td style="border: none;">: ${p.statusKependudukan}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Dusun / Wilayah</td><td style="border: none;">: Dusun ${p.dusun}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Rukun Tetangga / RW</td><td style="border: none;">: RT ${p.rt} / RW ${p.rw}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Alamat Lengkap</td><td style="border: none;">: ${p.alamatLengkap}</td></tr>
          <tr style="border: none;"><td style="font-weight: bold; border: none;">Kewarganegaraan</td><td style="border: none;">: ${p.kewarganegaraan}</td></tr>
        </table>
      </div>
    `;

    printOfficialDocument(
      `BIODATA PENDUDUK WARGA DESA - ${p.namaLengkap.toUpperCase()}`,
      'Surat Keterangan Kependudukan',
      content
    );
  };

  // IF DETAIL VIEW IS ACTIVE (MATCHES STEP 5 IN DIAGRAM)
  if (selectedPenduduk) {
    const p = selectedPenduduk;
    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPenduduk(null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Detail Data Penduduk
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePrintDetail(p)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Cetak Biodata
            </button>
            <button
              onClick={() => handlePrintDetail(p)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Unduh PDF
            </button>
          </div>
        </div>

        {/* Profile Card matching Step 5 in screenshot */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Card Top Banner with Avatar & Name */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
                {p.namaLengkap.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-bold text-slate-900">{p.namaLengkap}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  NIK: <span className="font-mono font-semibold text-slate-700">{p.nik}</span> • Dusun {p.dusun}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEdit(p)}
                className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Data
              </button>
              <button
                onClick={() => setDeleteCandidate(p)}
                className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>

          {/* Detailed Data Table matching Step 5 layout */}
          <div className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Informasi Kependudukan Lengkap
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Nomor Induk Kependudukan (NIK)</span>
                <span className="font-mono font-bold text-slate-900">{p.nik}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Nomor Kartu Keluarga (KK)</span>
                <span className="font-mono font-bold text-slate-900">{p.noKk}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Jenis Kelamin</span>
                <span className="font-semibold text-slate-800">{p.jenisKelamin}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Tempat / Tanggal Lahir</span>
                <span className="font-semibold text-slate-800">{p.tempatLahir}, {p.tanggalLahir}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Pendidikan Terakhir</span>
                <span className="font-semibold text-slate-800">{p.pendidikan}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Pekerjaan</span>
                <span className="font-semibold text-slate-800">{p.pekerjaan}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Status Perkawinan</span>
                <span className="font-semibold text-slate-800">{p.statusPerkawinan}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Agama</span>
                <span className="font-semibold text-slate-800">{p.agama}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Dusun</span>
                <span className="font-semibold text-blue-700">{p.dusun}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">RT / RW</span>
                <span className="font-semibold text-slate-800">RT {p.rt} / RW {p.rw}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Golongan Darah</span>
                <span className="font-mono font-semibold text-slate-800">{p.golonganDarah || '-'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Kewarganegaraan</span>
                <span className="font-semibold text-slate-800">{p.kewarganegaraan}</span>
              </div>
              <div className="md:col-span-2 py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium block mb-1">Alamat Domisili Lengkap</span>
                <span className="font-semibold text-slate-800">{p.alamatLengkap}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN LIST VIEW (MATCHES STEP 3 IN DIAGRAM)
  return (
    <div className="space-y-6">
      {/* Top Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Data Penduduk & Kependudukan
          </h2>
          <p className="text-xs text-slate-500">
            Pengelolaan administrasi kependudukan, kartu keluarga, dan mutasi warga Desa Adimulya
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Impor Excel/CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Ekspor CSV
          </button>
          <button
            onClick={handlePrintTable}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Cetak Laporan
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Data
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation (Matching sidebar submenus from screenshot) */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl max-w-full overflow-x-auto">
        <button
          onClick={() => setActiveTab('penduduk-list')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'penduduk-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Data Penduduk ({pendudukList.length})
        </button>
        <button
          onClick={() => setActiveTab('kk-list')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'kk-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kartu Keluarga ({kkList.length})
        </button>
        <button
          onClick={() => setActiveTab('mutasi-list')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'mutasi-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mutasi Warga ({mutasiList.length})
        </button>
      </div>

      {/* VIEW 1: DATA PENDUDUK TABLE */}
      {activeTab === 'penduduk-list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Search & Filter Strip */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50/50">
            {/* Search Input (Cari nama / NIK / KK...) */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama / NIK / KK..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={filterDusun}
                onChange={(e) => {
                  setFilterDusun(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <option value="Semua">Semua Dusun</option>
                <option value="Cisalak">Dusun Cisalak</option>
                <option value="Cihandiwung Lor">Dusun Cihandiwung Lor</option>
                <option value="Cukangleles Kidul">Dusun Cukangleles Kidul</option>
                <option value="Cidulang">Dusun Cidulang</option>
                <option value="Cilatar">Dusun Cilatar</option>
              </select>

              <select
                value={filterGender}
                onChange={(e) => {
                  setFilterGender(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <option value="Semua">Semua Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <option value="Semua">Semua Status</option>
                <option value="Tetap">Tetap</option>
                <option value="Sementara">Sementara</option>
                <option value="Pindah">Pindah</option>
              </select>
            </div>
          </div>

          {/* Table (Matches Step 3 in screenshot) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">NIK</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Jenis Kelamin</th>
                  <th className="py-3 px-4">Dusun</th>
                  <th className="py-3 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedPenduduk.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada data penduduk yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedPenduduk.map((p, idx) => (
                    <tr
                      key={p.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center font-mono text-slate-400">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {p.nik}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {p.namaLengkap}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            p.jenisKelamin === 'Laki-laki'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-pink-50 text-pink-700'
                          }`}
                        >
                          {p.jenisKelamin}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.dusun}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          {/* Detail Button */}
                          <button
                            onClick={() => setSelectedPenduduk(p)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                            title="Lihat Detail Penduduk"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteCandidate(p)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Menampilkan{' '}
              <span className="font-semibold text-slate-700">
                {filteredPenduduk.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              -{' '}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * pageSize, filteredPenduduk.length)}
              </span>{' '}
              dari <span className="font-semibold text-slate-700">{filteredPenduduk.length}</span> warga
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium text-slate-700">
                Hal {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KARTU KELUARGA */}
      {activeTab === 'kk-list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">Buku Register Kartu Keluarga (KK)</h3>
            <span className="text-xs text-slate-500">{kkList.length} KK Terdaftar</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">No KK</th>
                  <th className="py-3 px-4">Kepala Keluarga</th>
                  <th className="py-3 px-4">NIK Kepala</th>
                  <th className="py-3 px-4">Alamat & Dusun</th>
                  <th className="py-3 px-4 text-center">Anggota</th>
                  <th className="py-3 px-4">Tgl Terbit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {kkList.map((kk) => (
                  <tr key={kk.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{kk.noKk}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{kk.namaKepalaKeluarga}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{kk.nikKepala}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {kk.alamat}, Dusun {kk.dusun}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-blue-700">{kk.jumlahAnggota} Jiwa</td>
                    <td className="py-3 px-4 text-slate-500">{kk.tanggalDiterbitkan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: MUTASI WARGA */}
      {activeTab === 'mutasi-list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Pencatatan Peristiwa Mutasi Kependudukan
            </h3>
            <button
              onClick={() => setIsAddMutasiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Catat Mutasi Baru
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Jenis Mutasi</th>
                    <th className="py-3 px-4">Nama Warga</th>
                    <th className="py-3 px-4">NIK</th>
                    <th className="py-3 px-4">Tanggal Peristiwa</th>
                    <th className="py-3 px-4">Nomor Surat Keterangan</th>
                    <th className="py-3 px-4">Keterangan</th>
                    <th className="py-3 px-4">Petugas Pencatat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {mutasiList.map((m) => {
                    const badgeColor =
                      m.jenisMutasi === 'Lahir'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : m.jenisMutasi === 'Pendatang'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : m.jenisMutasi === 'Pindah'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200';
                    return (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${badgeColor}`}>
                            {m.jenisMutasi}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{m.nama}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{m.nik}</td>
                        <td className="py-3 px-4 text-slate-600">{m.tanggalPeristiwa}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">{m.nomorSurat}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs">{m.keterangan}</td>
                        <td className="py-3 px-4 text-slate-500">{m.dicatatOleh}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH DATA PENDUDUK */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Formulir Tambah Data Penduduk
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveAdd} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIK (16 Digit Angka)*
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="3301010101010001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor KK (16 Digit)*
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.noKk}
                    onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                    placeholder="3301010101000001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP*
                </label>
                <input
                  type="text"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  placeholder="Contoh: Ahmad Sanjaya"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as JenisKelamin })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agama</label>
                  <select
                    value={formData.agama}
                    onChange={(e) => setFormData({ ...formData, agama: e.target.value as Agama })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pendidikan</label>
                  <input
                    type="text"
                    value={formData.pendidikan}
                    onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RT / RW</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="RT 001"
                      value={formData.rt}
                      onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                      className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="RW 001"
                      value={formData.rw}
                      onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                      className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Perkawinan</label>
                  <select
                    value={formData.statusPerkawinan}
                    onChange={(e) => setFormData({ ...formData, statusPerkawinan: e.target.value as StatusPerkawinan })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Kawin">Kawin</option>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Domisili
                </label>
                <input
                  type="text"
                  value={formData.alamatLengkap}
                  onChange={(e) => setFormData({ ...formData, alamatLengkap: e.target.value })}
                  placeholder="Jl. Melati No. 12, RT 001 / RW 001, Dusun Cisalak"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
                >
                  Simpan Penduduk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DATA PENDUDUK */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Ubah Data Penduduk: {editItem.namaLengkap}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor KK (16 Digit)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.noKk}
                    onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as JenisKelamin })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Kependudukan</label>
                  <select
                    value={formData.statusKependudukan}
                    onChange={(e) => setFormData({ ...formData, statusKependudukan: e.target.value as StatusKependudukan })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Tetap">Tetap</option>
                    <option value="Sementara">Sementara</option>
                    <option value="Pindah">Pindah</option>
                    <option value="Meninggal">Meninggal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili</label>
                <input
                  type="text"
                  value={formData.alamatLengkap}
                  onChange={(e) => setFormData({ ...formData, alamatLengkap: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm cursor-pointer"
                >
                  Perbarui Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl w-12 h-12 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Hapus Data Penduduk?
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus data{' '}
              <strong className="text-slate-800">{deleteCandidate.namaLengkap}</strong> (NIK:{' '}
              {deleteCandidate.nik})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPOR EXCEL/CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Impor Data Penduduk Massal
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Unggah file CSV dengan kolom standar: NIK, No KK, Nama, Jenis Kelamin, Dusun, RT, RW, Pekerjaan.
            </p>
            <div className="mt-4 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Pilih file CSV / Excel</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Maksimal 5.000 baris data</p>
              <button
                type="button"
                onClick={() => {
                  // Simulate realistic batch import
                  const importedCount = importPendudukBatch([
                    {
                      nik: '3301010101010041',
                      noKk: '3301010101000041',
                      namaLengkap: 'Kurnia Ramadhan',
                      jenisKelamin: 'Laki-laki',
                      tempatLahir: 'Cilacap',
                      tanggalLahir: '1997-04-18',
                      agama: 'Islam',
                      pendidikan: 'S1 Teknik Sipil',
                      pekerjaan: 'Kontraktor Swasta',
                      statusPerkawinan: 'Kawin',
                      statusKependudukan: 'Tetap',
                      dusun: 'Cisalak',
                      rt: '003',
                      rw: '001',
                      alamatLengkap: 'Jl. Melati No. 44, Dusun Cisalak',
                      kewarganegaraan: 'WNI',
                    },
                    {
                      nik: '3301010101010042',
                      noKk: '3301010101000042',
                      namaLengkap: 'Anisa Rahmawati',
                      jenisKelamin: 'Perempuan',
                      tempatLahir: 'Cilacap',
                      tanggalLahir: '2000-08-22',
                      agama: 'Islam',
                      pendidikan: 'D3 Kebidanan',
                      pekerjaan: 'Bidan Praktek Mandiri',
                      statusPerkawinan: 'Belum Kawin',
                      statusKependudukan: 'Tetap',
                      dusun: 'Cidulang',
                      rt: '001',
                      rw: '002',
                      alamatLengkap: 'Jl. Kenanga No. 09, Dusun Cidulang',
                      kewarganegaraan: 'WNI',
                    },
                  ]);
                  alert(`Berhasil mengimpor ${importedCount} data penduduk ke dalam database sistem!`);
                  setIsImportModalOpen(false);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Simulasikan Impor 2 Warga Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH MUTASI WARGA */}
      {isAddMutasiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Pencatatan Peristiwa Mutasi Penduduk
              </h3>
              <button
                onClick={() => setIsAddMutasiModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                addMutasi({
                  nik: form.nik.value,
                  nama: form.nama.value,
                  jenisMutasi: form.jenisMutasi.value,
                  tanggalPeristiwa: form.tanggal.value,
                  nomorSurat: form.nomorSurat.value,
                  keterangan: form.keterangan.value,
                  dusun: form.dusun.value,
                  dicatatOleh: 'Ahmad Fauzi (Sekdes)',
                });
                setIsAddMutasiModalOpen(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Mutasi</label>
                <select
                  name="jenisMutasi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                >
                  <option value="Lahir">Kelahiran Bayi (Lahir)</option>
                  <option value="Pendatang">Penduduk Datang (Masuk)</option>
                  <option value="Pindah">Penduduk Pindah (Keluar)</option>
                  <option value="Kematian">Kematian (Meninggal)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Warga</label>
                <input
                  name="nama"
                  type="text"
                  placeholder="Nama lengkap yang bersangkutan"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK</label>
                  <input
                    name="nik"
                    type="text"
                    maxLength={16}
                    placeholder="16 Digit"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    name="tanggal"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dusun</label>
                  <select
                    name="dusun"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="Cisalak">Cisalak</option>
                    <option value="Cihandiwung Lor">Cihandiwung Lor</option>
                    <option value="Cukangleles Kidul">Cukangleles Kidul</option>
                    <option value="Cidulang">Cidulang</option>
                    <option value="Cilatar">Cilatar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Surat Keterangan</label>
                  <input
                    name="nomorSurat"
                    type="text"
                    placeholder="474.1/099/ADM/X/2025"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
                <textarea
                  name="keterangan"
                  rows={2}
                  placeholder="Catatan peristiwa, rumah sakit, alamat tujuan pindah..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMutasiModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Mutasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
