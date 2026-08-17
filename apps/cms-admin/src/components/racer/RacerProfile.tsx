import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  FileText, 
  Phone, 
  Mail, 
  Download, 
  Pencil, 
  RotateCw, 
  Check, 
  X, 
  Loader2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { apiClient } from '../../services/api';
import confetti from 'canvas-confetti';

interface ProfileData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  racerId: string;
  racerUuid?: string;
  racerIdCode?: string;
  tier: string;
  points: number;
  joinedDate: string;
  avatarUrl?: string | null;
  primaryBike?: {
    id: string;
    brand?: string;
    model: string;
    plate: string;
    plateNumber?: string;
    year: number;
    engineCc?: number;
    engineSpec?: string;
    ecuMapping?: string;
  } | null;
  bikes?: any[];
}

export const RacerProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Aldi Taher Prasetyo',
    phone: '+62 812-8901-7721',
    email: 'aldi.racer99@wenspeed.my.id',
    racerId: 'WNS-849201',
    racerUuid: 'WNS-849201',
    tier: 'ELITE MEMBER',
    points: 12450,
    joinedDate: 'Agustus 2026',
    primaryBike: {
      id: 'bike-01',
      brand: 'Yamaha',
      model: 'All New Aerox 155 Connected Cyber City',
      plate: 'B 4992 ELA',
      year: 2024,
      engineCc: 155,
      engineSpec: 'Standar Factory Tuned (155cc 4-Valve VVA)',
      ecuMapping: 'Standar OEM Mapping (Peak 15.4 HP @ 8000 RPM)',
    },
    bikes: [],
  });

  const [serviceLogs, setServiceLogs] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit form state (Racer UUID is permanent and Loyalty Points are calculated from package orders)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // 1. Fetch Profile from GET /api/v1/racer/profile & Primary Bike from GET /api/v1/racer/bikes/primary
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.get('/racer/profile');
      let primaryBikeData = data?.primaryBike || null;

      try {
        const primaryRes = await apiClient.get('/racer/bikes/primary');
        if (primaryRes && primaryRes.id) {
          primaryBikeData = {
            id: primaryRes.id,
            brand: primaryRes.brand || 'Yamaha',
            model: primaryRes.model,
            plate: primaryRes.plateNumber,
            plateNumber: primaryRes.plateNumber,
            year: primaryRes.year || 2023,
            engineCc: primaryRes.engineCc || 155,
            engineSpec: primaryRes.engineSpec || 'Standar Factory Tuned',
            ecuMapping: primaryRes.ecuMapping || 'Standar OEM Mapping',
            isPrimary: true,
          };
        }
      } catch {
        // Fallback to data.primaryBike
      }

      if (data && data.name) {
        const racerUuid = data.racerUuid || data.racerId || data.racerIdCode || 'WNS-849201';
        setProfile({
          id: data.id,
          name: data.name || 'Aldi Taher Prasetyo',
          phone: data.phone || '+62 812-8901-7721',
          email: data.email || 'aldi.racer99@wenspeed.my.id',
          racerId: racerUuid,
          racerUuid: racerUuid,
          tier: data.tier || 'ELITE MEMBER',
          points: Number(data.points) || 12450,
          joinedDate: data.joinedDate || 'Agustus 2026',
          avatarUrl: data.avatarUrl,
          primaryBike: primaryBikeData || data.primaryBike || null,
          bikes: data.bikes || [],
        });
      }
      // Also fetch bookings for the logbook
      try {
        const bookingsRes = await apiClient.get('/bookings');
        if (Array.isArray(bookingsRes)) {
          const logs = bookingsRes
            .filter((b: any) => b.status === 'COMPLETED' || b.status === 'IN_SERVICE')
            .map((b: any) => ({
              id: b.id,
              serviceName: b.service?.name || b.servicePackage || 'Precision Service',
              status: b.status,
              date: b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : '10 Agu',
              branch: b.branch || 'Bekasi HQ',
              mechanic: b.assignedMechanic || 'Chief Tuner',
              notes: b.notes || 'Full diagnostic and service completed according to manual standards.',
              cost: Number(b.totalCost || b.estimatedCost || 385000),
            }));
          if (logs.length > 0) {
            setServiceLogs(logs);
          }
        }
      } catch {
        // Continue
      }
    } catch (err: any) {
      console.warn('Could not fetch live profile from API:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openEditModal = () => {
    setEditForm({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
    });
    setErrorMessage(null);
    setIsEditing(true);
  };

  // 2. Save Profile via POST / PUT /api/v1/racer/profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      email: editForm.email.trim(),
    };

    try {
      const updated = await apiClient.put('/racer/profile', payload);
      if (updated) {
        setProfile((prev) => ({
          ...prev,
          name: updated.name || payload.name,
          phone: updated.phone || payload.phone,
          email: updated.email || payload.email,
          racerUuid: updated.racerUuid || prev.racerUuid,
          racerId: updated.racerUuid || prev.racerId,
          primaryBike: updated.primaryBike || prev.primaryBike,
          bikes: updated.bikes || prev.bikes,
        }));
      } else {
        setProfile((prev) => ({
          ...prev,
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
        }));
      }

      setIsEditing(false);
      setSuccessMessage('Profil Racer berhasil diperbarui!');
      confetti({ particleCount: 40, spread: 60 });
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        setErrorMessage(err.message);
      } else {
        // Local state fallback
        setProfile((prev) => ({
          ...prev,
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          tier: payload.tier,
        }));
        setIsEditing(false);
        setSuccessMessage('Profil Racer berhasil diperbarui secara lokal!');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadInvoice = (logName: string) => {
    const invoiceText = `WE N SPEED PRECISION WORKSHOP\nOfficial Digital Service Receipt\nCustomer: ${profile.name} (${profile.racerId})\nVehicle: ${profile.primaryBike?.model || 'Yamaha Racing Machine'} (${profile.primaryBike?.plate || profile.primaryBike?.plateNumber || 'B 4101 ANS'})\nService: ${logName}\nStatus: PAID & COMPLETED\nWorkshop HQ: Bekasi Branch (Precision Tuning Center)`;
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_WNS_${logName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-mono">
      {/* Toast Success / Error */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded flex items-center justify-between text-emerald-400 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded bg-[#131313] border border-[#FFE01B]/40 flex items-center justify-center text-[#FFE01B] font-extrabold text-2xl font-display shadow-md shadow-[#FFE01B]/20 shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white font-display uppercase">{profile.name}</h2>
              <span className="bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {profile.tier}
              </span>
            </div>
            <p className="text-xs text-[#cec6ab]">
              Racer UUID: <span className="text-[#FFE01B] font-bold">{profile.racerId}</span> • Joined {profile.joinedDate}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#cec6ab] pt-0.5">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#FFE01B]" /> {profile.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#FFE01B]" /> {profile.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end md:self-center border-t md:border-t-0 border-[#1E293B] pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-[#cec6ab] uppercase tracking-wider block font-semibold">
              LOYALTY VAULT
            </span>
            <span className="text-2xl font-bold text-white font-mono">
              {profile.points.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-[#FFE01B] ml-1 font-bold">POIN</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openEditModal}
              title="Edit Profil"
              className="p-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold rounded transition flex items-center justify-center shadow-md shadow-[#FFE01B]/20 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={fetchProfile}
              disabled={isLoading}
              title="Refresh Data Profil"
              className="p-2 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] text-[#cec6ab] hover:text-[#FFE01B] rounded transition cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FFE01B]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Garage Motorcycle Specs & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Primary Bike Specs */}
        <div className="lg:col-span-7 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <span className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2 font-display">
              <Bike className="w-4 h-4 text-[#FFE01B]" />
              Primary Registered Race Machine
            </span>
            {profile.primaryBike && (
              <span className="text-[11px] text-[#FFE01B] bg-[#FFE01B]/10 px-2 py-0.5 rounded border border-[#FFE01B]/30 font-bold">
                {profile.primaryBike.plate || profile.primaryBike.plateNumber}
              </span>
            )}
          </div>

          {profile.primaryBike ? (
            <div>
              <h3 className="text-lg font-bold text-white font-display uppercase">
                {profile.primaryBike.brand ? `${profile.primaryBike.brand} ` : ''}{profile.primaryBike.model}
              </h3>
              <p className="text-xs text-[#cec6ab] mt-0.5">
                Year: {profile.primaryBike.year} • Kapasitas: {profile.primaryBike.engineCc || 150} CC
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#cec6ab]">Belum ada unit motor utama yang diset.</p>
          )}

          {profile.primaryBike && (
            <div className="p-3.5 bg-[#131313] border border-[#1E293B] rounded space-y-2 text-xs text-[#cec6ab]">
              <div className="flex justify-between py-1 border-b border-[#1E293B]">
                <span className="text-[#cec6ab]">Engine Build Spec:</span>
                <span className="text-white font-bold">{profile.primaryBike.engineSpec || 'Standar Factory Tuned'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#cec6ab]">ECU Calibration:</span>
                <span className="text-[#FFE01B] font-bold">{profile.primaryBike.ecuMapping || 'Standar OEM Mapping'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Member Privileges Card */}
        <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <span className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2 font-display">
                <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                Privilege & Benefit Status
              </span>
              <span className="text-[10px] text-[#cec6ab]">Bekasi HQ</span>
            </div>

            <div className="space-y-2.5 mt-3 text-xs">
              <div className="p-2.5 bg-[#131313] rounded border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#cec6ab]">Towing Darurat 24/7</span>
                <span className="text-[#22C55E] font-bold">100% GRATIS</span>
              </div>
              <div className="p-2.5 bg-[#131313] rounded border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#cec6ab]">Fast-Track Priority Bay</span>
                <span className="text-[#FFE01B] font-bold">AKTIF</span>
              </div>
              <div className="p-2.5 bg-[#131313] rounded border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#cec6ab]">Diskon Sparepart Racing</span>
                <span className="text-[#CCFF00] font-bold">10% VIP RATE</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#cec6ab] leading-snug font-sans pt-2">
            Status membership diperbarui otomatis berdasarkan transaksi reservasi dan perawatan berkala.
          </p>
        </div>

      </div>

      {/* Maintenance History Logbook */}
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <span className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2 font-display">
            <FileText className="w-4 h-4 text-[#FFE01B]" />
            Digital Workshop Maintenance Logbook
          </span>
          <span className="text-xs text-[#cec6ab]">{serviceLogs.length} Certified Records</span>
        </div>

        <div className="divide-y divide-[#1E293B]">
          {serviceLogs.length === 0 ? (
            <p className="text-xs font-mono text-[#cec6ab] py-4 text-center">Belum ada riwayat service yang selesai.</p>
          ) : (
            serviceLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{log.serviceName}</span>
                    <span className="text-[10px] bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] px-2 py-0.5 rounded font-bold uppercase">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#cec6ab]">
                    {log.date} • {log.branch} • Tuner: {log.mechanic}
                  </p>
                  <p className="text-[11px] text-[#cec6ab] italic">{log.notes}</p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-bold text-[#FFE01B]">
                    Rp {Number(log.cost || 0).toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => handleDownloadInvoice(log.serviceName)}
                    className="p-1.5 rounded bg-[#131313] hover:bg-[#FFE01B] hover:text-black text-[#FFE01B] border border-[#1E293B] transition cursor-pointer"
                    title="Download Digital Invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-lg p-6 space-y-5 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] text-base flex items-center gap-2 font-display uppercase">
                <Pencil className="w-4 h-4 text-[#FFE01B]" />
                Edit Profil Racer & Akun
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[#cec6ab] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 font-mono text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 font-mono">
              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold text-[11px]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Aldi Taher Prasetyo"
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold text-[11px]">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+62 812-8901-7721"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold text-[11px]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="aldi.racer99@wenspeed.my.id"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold text-[11px]">
                  Racer UUID
                </label>
                <input
                  type="text"
                  disabled
                  readOnly
                  value={profile.racerUuid || profile.racerId}
                  className="w-full bg-[#131313]/60 border border-[#2a2929] rounded p-2.5 text-xs text-[#FFE01B] font-bold font-mono cursor-not-allowed opacity-80 select-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold rounded uppercase tracking-wider transition shadow-md shadow-[#FFE01B]/20 flex items-center gap-2 cursor-pointer text-xs"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

