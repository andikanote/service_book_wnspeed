import React, { useState, useEffect } from 'react';
import { MemberBike } from '../../types';
import { apiClient } from '../../services/api';
import { 
  Bike, 
  Plus, 
  Search, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  Trash2, 
  Info,
  Edit,
  RefreshCw,
  Loader2,
  Calendar,
  AlertTriangle,
  Cpu,
  Wrench
} from 'lucide-react';
import confetti from 'canvas-confetti';

function transformBackendBike(b: any): MemberBike {
  return {
    id: b.id,
    model: b.model,
    brand: b.brand || 'Yamaha',
    plateNumber: b.plateNumber,
    year: Number(b.year) || new Date().getFullYear(),
    engineCc: Number(b.engineCc || b.engine_cc || 150),
    mileageKm: Number(b.mileage || 0),
    isPrimary: Boolean(b.isPrimary),
    status: 'READY',
    engineSpec: b.engineSpec || b.engine_spec || 'Standar Factory Tuned',
    ecuMapping: b.ecuMapping || b.ecu_mapping || 'Standar OEM Mapping',
    dynoHp: Number(b.dynoHp || 0),
    dynoTorque: Number(b.dynoTorque || 0),
    lastServiceDate: 'Terverifikasi',
    diagnostics: {
      oilHealth: 100,
      brakePads: 100,
      vbeltCond: 100,
      batteryVoltage: 12.8,
      tirePressureFront: 29,
      tirePressureRear: 33,
      engineTemp: 82,
    },
    notes: '',
  };
}

interface RacerBikesProps {
  onNavigateToBooking?: () => void;
  onNavigateToDiagnostics?: () => void;
}

export const RacerBikes: React.FC<RacerBikesProps> = ({
  onNavigateToBooking,
}) => {
  const [bikes, setBikes] = useState<MemberBike[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPlate, setCopiedPlate] = useState<string | null>(null);

  // Modals State
  const [isAddModalOpen, setIsAddOpen] = useState(false);
  const [isEditModalOpen, setIsEditOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<MemberBike | null>(null);
  const [selectedBikeDetail, setSelectedBikeDetail] = useState<MemberBike | null>(null);
  const [deletingBike, setDeletingBike] = useState<MemberBike | null>(null);

  // Add Form State (Brand, Model, Plate, CC, Year, Engine_Spec, ECU_Spec)
  const [newBrand, setNewBrand] = useState('Yamaha');
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newCc, setNewCc] = useState<number | string>(155);
  const [newYear, setNewYear] = useState<number | string>(new Date().getFullYear());
  const [newEngineSpec, setNewEngineSpec] = useState('');
  const [newEcuSpec, setNewEcuSpec] = useState('');

  // Edit Form State
  const [editBrand, setEditBrand] = useState('Yamaha');
  const [editModel, setEditModel] = useState('');
  const [editPlate, setEditPlate] = useState('');
  const [editCc, setEditCc] = useState<number | string>(155);
  const [editYear, setEditYear] = useState<number | string>(new Date().getFullYear());
  const [editEngineSpec, setEditEngineSpec] = useState('');
  const [editEcuSpec, setEditEcuSpec] = useState('');

  // Fetch Bikes from API
  const fetchBikes = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.get('/racer/bikes');
      if (Array.isArray(data)) {
        setBikes(data.map(transformBackendBike));
        setApiConnected(true);
      }
    } catch (err: any) {
      console.warn('Backend API error or offline:', err.message);
      setApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  // Handle Plate Copy
  const handleCopyPlate = (plate: string) => {
    navigator.clipboard?.writeText(plate);
    setCopiedPlate(plate);
    setTimeout(() => setCopiedPlate(null), 2000);
  };

  // Handle Set Primary Bike (API PATCH /racer/bikes/:id/primary)
  const handleSetPrimary = async (bikeId: string) => {
    try {
      await apiClient.patch(`/racer/bikes/${bikeId}/primary`, {});
      setBikes((prev) =>
        prev.map((b) => ({
          ...b,
          isPrimary: b.id === bikeId,
        }))
      );
      confetti({ particleCount: 30, spread: 50 });
    } catch (err: any) {
      setBikes((prev) =>
        prev.map((b) => ({
          ...b,
          isPrimary: b.id === bikeId,
        }))
      );
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (bike: MemberBike) => {
    setEditingBike(bike);
    setEditBrand(bike.brand);
    setEditModel(bike.model);
    setEditPlate(bike.plateNumber);
    setEditCc(bike.engineCc || 155);
    setEditYear(bike.year || new Date().getFullYear());
    setEditEngineSpec(bike.engineSpec || '');
    setEditEcuSpec(bike.ecuMapping || '');
    setIsEditOpen(true);
  };

  // Submit Edit Bike (API PUT /racer/bikes/:id)
  const handleEditBikeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBike) return;

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      brand: editBrand,
      model: editModel.trim(),
      plateNumber: editPlate.trim().toUpperCase(),
      engineCc: Number(editCc) || 150,
      year: Number(editYear) || new Date().getFullYear(),
      engineSpec: editEngineSpec.trim() || 'Standar Factory Tuned',
      ecuMapping: editEcuSpec.trim() || 'Standar OEM Mapping',
    };

    try {
      const updated = await apiClient.put(`/racer/bikes/${editingBike.id}`, payload);
      const transformed = transformBackendBike(updated);
      setBikes((prev) => prev.map((b) => (b.id === editingBike.id ? transformed : b)));
      setIsEditOpen(false);
      setEditingBike(null);
      confetti({ particleCount: 40, spread: 60 });
    } catch (err: any) {
      // Local fallback
      setBikes((prev) =>
        prev.map((b) =>
          b.id === editingBike.id
            ? {
                ...b,
                brand: payload.brand,
                model: payload.model,
                plateNumber: payload.plateNumber,
                engineCc: payload.engineCc,
                year: payload.year,
                engineSpec: payload.engineSpec,
                ecuMapping: payload.ecuMapping,
              }
            : b
        )
      );
      setIsEditOpen(false);
      setEditingBike(null);
      confetti({ particleCount: 40, spread: 60 });
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Add New Bike (API POST /racer/bikes)
  const handleAddBikeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      brand: newBrand,
      model: newModel.trim(),
      plateNumber: newPlate.trim().toUpperCase(),
      engineCc: Number(newCc) || 150,
      year: Number(newYear) || new Date().getFullYear(),
      engineSpec: newEngineSpec.trim() || 'Standar Factory Tuned',
      ecuMapping: newEcuSpec.trim() || 'Standar OEM Mapping',
    };

    try {
      const created = await apiClient.post('/racer/bikes', payload);
      const transformed = transformBackendBike(created);
      setBikes((prev) => [transformed, ...prev]);
      setIsAddOpen(false);
      setNewModel('');
      setNewPlate('');
      setNewEngineSpec('');
      setNewEcuSpec('');
      confetti({ particleCount: 50, spread: 70 });
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        setErrorMessage(err.message);
        setIsSaving(false);
        return;
      }

      // Offline fallback
      const createdBike: MemberBike = {
        id: `bike-${Date.now()}`,
        brand: payload.brand,
        model: payload.model,
        plateNumber: payload.plateNumber,
        year: payload.year,
        engineCc: payload.engineCc,
        mileageKm: 0,
        isPrimary: bikes.length === 0,
        status: 'READY',
        engineSpec: payload.engineSpec,
        ecuMapping: payload.ecuMapping,
        dynoHp: 0,
        dynoTorque: 0,
        lastServiceDate: 'Baru Didaftarkan',
        diagnostics: {
          oilHealth: 100,
          brakePads: 100,
          vbeltCond: 100,
          batteryVoltage: 12.8,
          tirePressureFront: 29,
          tirePressureRear: 33,
          engineTemp: 80,
        },
        notes: '',
      };
      setBikes((prev) => [createdBike, ...prev]);
      setIsAddOpen(false);
      setNewModel('');
      setNewPlate('');
      setNewEngineSpec('');
      setNewEcuSpec('');
      confetti({ particleCount: 50, spread: 70 });
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm Delete Bike (API DELETE /racer/bikes/:id)
  const handleConfirmDelete = async () => {
    if (!deletingBike) return;
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await apiClient.delete(`/racer/bikes/${deletingBike.id}`);
      setBikes((prev) => prev.filter((b) => b.id !== deletingBike.id));
      setDeletingBike(null);
    } catch (err: any) {
      if (err.message && (err.message.includes('tidak ditemukan') || err.message.includes('404'))) {
        setBikes((prev) => prev.filter((b) => b.id !== deletingBike.id));
        setDeletingBike(null);
        setErrorMessage(null);
      } else if (err.message && !err.message.includes('Failed to fetch')) {
        setErrorMessage(err.message);
      } else {
        setBikes((prev) => prev.filter((b) => b.id !== deletingBike.id));
        setDeletingBike(null);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered Bikes
  const filteredBikes = bikes.filter((b) => {
    return (
      b.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const primaryBike = bikes.find((b) => b.isPrimary) || bikes[0];

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#e5e2e1] tracking-tight flex items-center gap-2 font-display uppercase">
              <Bike className="w-5 h-5 text-[#FFE01B]" />
              List Motor Member & Garasi
            </h2>
            <span className="px-2 py-0.5 rounded bg-[#FFE01B]/10 border border-[#FFE01B]/30 text-[#FFE01B] font-mono text-[10px] font-bold">
              {bikes.length} MOTOR TERDAFTAR
            </span>
            {apiConnected ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                API LIVE SYNC
              </span>
            ) : null}
          </div>
          <p className="text-xs text-[#cec6ab] mt-0.5 font-mono">
            Kelola data motor, kapasitas mesin, plat nomor, tahun, spesifikasi mesin & ECU
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBikes}
            disabled={isLoading}
            title="Refresh Data Motor"
            className="p-2 bg-[#1c1b1b] hover:bg-[#252525] border border-[#1E293B] hover:border-[#FFE01B]/40 text-[#cec6ab] hover:text-[#FFE01B] rounded transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FFE01B]' : ''}`} />
          </button>

          <button
            onClick={() => {
              setErrorMessage(null);
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs rounded transition shadow-md shadow-[#FFE01B]/20 cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>TAMBAH MOTOR BARU</span>
          </button>
        </div>
      </div>

      {/* Global Alert Notification */}
      {errorMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded flex items-center justify-between gap-3 text-rose-400 text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 space-y-1">
          <span className="text-[10px] text-[#cec6ab] uppercase font-bold">Total Unit di Garasi</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[#e5e2e1]">{bikes.length} Unit</span>
            <Bike className="w-4 h-4 text-[#FFE01B]" />
          </div>
          <span className="text-[10px] text-emerald-400">Garasi Member Aktif</span>
        </div>

        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 space-y-1">
          <span className="text-[10px] text-[#cec6ab] uppercase font-bold">Motor Utama (Aktif)</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FFE01B] truncate max-w-[140px]">
              {primaryBike ? primaryBike.plateNumber : '-'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-[#cec6ab] truncate block">
            {primaryBike ? primaryBike.model : 'Belum ditentukan'}
          </span>
        </div>

        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] text-[#cec6ab] uppercase font-bold">Merek Terdaftar</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[#CCFF00]">
              {new Set(bikes.map((b) => b.brand)).size} Merek
            </span>
            <Wrench className="w-4 h-4 text-[#CCFF00]" />
          </div>
          <span className="text-[10px] text-[#cec6ab]">Spesifikasi Terintegrasi</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#1c1b1b] p-3 rounded border border-[#1E293B]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#cec6ab] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan jenis model, plat nomor, atau merek motor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131313] border border-[#1E293B] rounded pl-9 pr-4 py-2 text-xs font-mono text-[#e5e2e1] placeholder-slate-500 focus:outline-none focus:border-[#FFE01B]"
          />
        </div>
      </div>

      {/* Bike Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#1c1b1b] border border-[#1E293B] rounded text-center space-y-3 font-mono">
          <Loader2 className="w-8 h-8 text-[#FFE01B] animate-spin" />
          <p className="text-xs text-[#cec6ab]">Memuat daftar motor member dari API...</p>
        </div>
      ) : filteredBikes.length === 0 ? (
        <div className="p-12 text-center bg-[#1c1b1b] border border-[#1E293B] rounded space-y-4 font-mono">
          <Bike className="w-12 h-12 text-[#FFE01B] mx-auto opacity-70" />
          <div>
            <h4 className="text-sm font-bold text-white uppercase">Belum Ada Motor Terdaftar</h4>
            <p className="text-xs text-[#cec6ab] mt-1">
              Garasi masih kosong. Klik tombol &ldquo;Tambah Motor Baru&rdquo; untuk mendaftarkan motor Anda.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs rounded transition uppercase tracking-wider cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Daftarkan Motor Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredBikes.map((bike) => (
            <div
              key={bike.id}
              className={`bg-[#1c1b1b] border rounded p-5 space-y-4 relative transition overflow-hidden ${
                bike.isPrimary
                  ? 'border-[#FFE01B]/70 shadow-lg shadow-[#FFE01B]/5'
                  : 'border-[#1E293B] hover:border-[#FFE01B]/30'
              }`}
            >
              {/* Primary Badge */}
              {bike.isPrimary && (
                <div className="absolute top-0 right-0 bg-[#FFE01B] text-black text-[10px] font-mono font-black px-3 py-0.5 rounded-bl uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  MOTOR UTAMA (ACTIVE)
                </div>
              )}

              {/* Header Unit */}
              <div className="flex items-start justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#131313] border border-[#1E293B] text-[10px] font-mono text-[#FFE01B] font-bold uppercase">
                      {bike.brand} • {bike.year}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#131313] border border-[#1E293B] text-[10px] font-mono text-[#CCFF00] font-bold">
                      {bike.engineCc} CC
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#e5e2e1] font-display uppercase tracking-tight">
                    {bike.model}
                  </h3>
                </div>

                {/* Plat Nomor Pill with Copy */}
                <button
                  onClick={() => handleCopyPlate(bike.plateNumber)}
                  title="Salin Plat Nomor"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#131313] border border-[#1E293B] hover:border-[#FFE01B]/50 rounded font-mono text-xs text-[#FFE01B] font-bold cursor-pointer transition shrink-0"
                >
                  <span>{bike.plateNumber}</span>
                  {copiedPlate === bike.plateNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#cec6ab]" />
                  )}
                </button>
              </div>

              {/* Specs & ECU Badges */}
              {(bike.engineSpec || bike.ecuMapping) && (
                <div className="p-2.5 bg-[#131313] rounded border border-[#1E293B] space-y-1 font-mono text-xs">
                  {bike.engineSpec && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#cec6ab]">
                      <Wrench className="w-3.5 h-3.5 text-[#FFE01B] shrink-0" />
                      <span className="truncate"><strong>Engine:</strong> {bike.engineSpec}</span>
                    </div>
                  )}
                  {bike.ecuMapping && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#cec6ab]">
                      <Cpu className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                      <span className="truncate"><strong>ECU:</strong> {bike.ecuMapping}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Bar */}
              <div className="border-t border-[#1E293B] pt-3.5 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  {!bike.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(bike.id)}
                      className="px-2.5 py-1.5 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] hover:border-[#FFE01B]/40 text-[#FFE01B] font-bold rounded text-[11px] uppercase transition cursor-pointer"
                    >
                      Set Utama
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEdit(bike)}
                    className="px-2.5 py-1.5 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] hover:text-[#FFE01B] text-[#cec6ab] rounded text-[11px] uppercase transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setSelectedBikeDetail(bike)}
                    className="px-2.5 py-1.5 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] hover:text-white text-[#cec6ab] rounded text-[11px] uppercase transition cursor-pointer flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>Detail</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {onNavigateToBooking && (
                    <button
                      onClick={onNavigateToBooking}
                      className="px-3 py-1.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold rounded text-[11px] uppercase transition cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Booking Lab</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setErrorMessage(null);
                      setDeletingBike(bike);
                    }}
                    title="Hapus Motor"
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Tambah Motor Member Baru (POST /racer/bikes) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-md p-6 space-y-4 shadow-2xl font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] font-display text-base flex items-center gap-2 uppercase">
                <Plus className="w-5 h-5 text-[#FFE01B]" />
                Registrasi Motor Member Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBikeSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Merek Motor *</label>
                <select
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                >
                  <option value="Yamaha">Yamaha</option>
                  <option value="Honda">Honda</option>
                  <option value="Kawasaki">Kawasaki</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Vespa">Vespa</option>
                  <option value="Ducati">Ducati</option>
                  <option value="KTM">KTM</option>
                  <option value="Aprilia">Aprilia</option>
                  <option value="BMW Motorrad">BMW Motorrad</option>
                </select>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Jenis Motor *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aerox 155 / Ninja ZX-25R / Vespa Sprint"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Plat Motor *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 1234 XYZ"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#FFE01B] font-bold uppercase placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">CC Motor</label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    placeholder="Contoh: 155"
                    value={newCc}
                    onChange={(e) => setNewCc(e.target.value)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Tahun (Year)</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    placeholder="Contoh: 2024"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Engine Spec</label>
                <input
                  type="text"
                  placeholder="Contoh: Bore Up 183cc Ceramic / Standar Factory Tuned"
                  value={newEngineSpec}
                  onChange={(e) => setNewEngineSpec(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">ECU Spec</label>
                <input
                  type="text"
                  placeholder="Contoh: aRacer Super X / OEM Remap / Standar"
                  value={newEcuSpec}
                  onChange={(e) => setNewEcuSpec(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase font-mono"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold rounded uppercase tracking-wider cursor-pointer shadow-md shadow-[#FFE01B]/20 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Motor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Motor (PUT /racer/bikes/:id) */}
      {isEditModalOpen && editingBike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-md p-6 space-y-4 shadow-2xl font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] font-display text-base flex items-center gap-2 uppercase">
                <Edit className="w-5 h-5 text-[#FFE01B]" />
                Edit Data Motor Member
              </h3>
              <button onClick={() => setIsEditOpen(false)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditBikeSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Merek Motor *</label>
                <select
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                >
                  <option value="Yamaha">Yamaha</option>
                  <option value="Honda">Honda</option>
                  <option value="Kawasaki">Kawasaki</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Vespa">Vespa</option>
                  <option value="Ducati">Ducati</option>
                  <option value="KTM">KTM</option>
                  <option value="Aprilia">Aprilia</option>
                  <option value="BMW Motorrad">BMW Motorrad</option>
                </select>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Jenis Motor *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aerox 155 / Ninja ZX-25R / Vespa Sprint"
                  value={editModel}
                  onChange={(e) => setEditModel(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Plat Motor *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 1234 XYZ"
                  value={editPlate}
                  onChange={(e) => setEditPlate(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#FFE01B] font-bold uppercase placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">CC Motor</label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    placeholder="Contoh: 155"
                    value={editCc}
                    onChange={(e) => setEditCc(e.target.value)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Tahun (Year)</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    placeholder="Contoh: 2024"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Engine Spec</label>
                <input
                  type="text"
                  placeholder="Contoh: Bore Up 183cc Ceramic / Standar Factory Tuned"
                  value={editEngineSpec}
                  onChange={(e) => setEditEngineSpec(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">ECU Spec</label>
                <input
                  type="text"
                  placeholder="Contoh: aRacer Super X / OEM Remap / Standar"
                  value={editEcuSpec}
                  onChange={(e) => setEditEcuSpec(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] placeholder-slate-500 focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase font-mono"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold rounded uppercase tracking-wider cursor-pointer shadow-md shadow-[#FFE01B]/20 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? 'Memperbarui...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation (DELETE /racer/bikes/:id) */}
      {deletingBike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-rose-500/40 rounded w-full max-w-md p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-rose-400 font-display text-base flex items-center gap-2 uppercase">
                <Trash2 className="w-5 h-5" />
                Konfirmasi Hapus Motor
              </h3>
              <button onClick={() => setDeletingBike(null)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 font-mono leading-relaxed">
              Apakah Anda yakin ingin menghapus motor{' '}
              <strong className="text-white">{deletingBike.model}</strong> dengan plat nomor{' '}
              <strong className="text-[#FFE01B]">{deletingBike.plateNumber}</strong> dari garasi member?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => setDeletingBike(null)}
                className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase font-mono"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSaving}
                className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold rounded uppercase tracking-wider cursor-pointer shadow-md shadow-rose-500/20 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSaving ? 'Menghapus...' : 'Ya, Hapus Motor'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detail Spesifikasi Motor (Cleaned) */}
      {selectedBikeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-md p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#FFE01B]" />
                <div>
                  <h3 className="font-bold text-[#e5e2e1] font-display text-sm uppercase">
                    {selectedBikeDetail.model}
                  </h3>
                  <span className="text-[10px] font-mono text-[#FFE01B] font-bold">
                    {selectedBikeDetail.plateNumber}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedBikeDetail(null)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-[#131313] rounded border border-[#1E293B] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Merek Motor:</span>
                  <span className="text-[#e5e2e1] font-bold">{selectedBikeDetail.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Jenis Motor:</span>
                  <span className="text-[#e5e2e1] font-bold">{selectedBikeDetail.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Plat Nomor:</span>
                  <span className="text-[#FFE01B] font-bold">{selectedBikeDetail.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Tahun Pembuatan:</span>
                  <span className="text-[#e5e2e1] font-bold">{selectedBikeDetail.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Kapasitas Mesin:</span>
                  <span className="text-[#CCFF00] font-bold">{selectedBikeDetail.engineCc} CC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Engine Spec:</span>
                  <span className="text-[#e5e2e1] font-bold">{selectedBikeDetail.engineSpec || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">ECU Spec:</span>
                  <span className="text-[#e5e2e1] font-bold">{selectedBikeDetail.ecuMapping || '-'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => setSelectedBikeDetail(null)}
                className="w-full py-2 bg-[#FFE01B] text-black font-mono font-bold rounded uppercase cursor-pointer text-center"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
