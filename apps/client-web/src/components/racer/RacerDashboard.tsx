import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Zap, 
  Truck, 
  Flame, 
  RotateCw, 
  ArrowRight,
  Loader2 
} from 'lucide-react';
import { apiClient } from '../../services/api';
import { EmergencySupportModal } from './EmergencySupportModal';
import { PriorityQueueModal } from './PriorityQueueModal';
import { ManageServiceModal } from './ManageServiceModal';

const DEFAULT_RACER_STATE = {
  name: 'Aldi Taher Prasetyo',
  email: 'aldi.racer99@wenspeed.my.id',
  racerId: 'WNS-849201',
  tier: 'ELITE MEMBER',
  loyaltyVaultPoints: 12450,
};

interface RacerDashboardProps {
  onNavigateTab: (tab: any) => void;
}

export const RacerDashboard: React.FC<RacerDashboardProps> = ({ onNavigateTab }) => {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [manageServiceModal, setManageServiceModal] = useState<'manage' | 'details' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [racerData, setRacerData] = useState<any>(DEFAULT_RACER_STATE);
  const [primaryBike, setPrimaryBike] = useState<any>(null);
  const [upcomingBooking, setUpcomingBooking] = useState<any>(null);
  const [serviceLogs, setServiceLogs] = useState<any[]>([]);

  const fetchRacerData = async () => {
    try {
      const [profileRes, primaryBikeRes, bookingsRes] = await Promise.allSettled([
        apiClient.get('/racer/profile'),
        apiClient.get('/racer/bikes/primary'),
        apiClient.get('/bookings'),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        const p = profileRes.value;
        setRacerData((prev: any) => ({
          ...prev,
          name: p.name || prev.name,
          email: p.email || prev.email,
          racerId: p.racerUuid || p.racerIdCode || prev.racerId,
          tier: p.tier?.replace('_', ' ') || prev.tier,
          loyaltyVaultPoints: p.points || prev.loyaltyVaultPoints,
        }));
      }

      if (primaryBikeRes.status === 'fulfilled' && primaryBikeRes.value) {
        setPrimaryBike(primaryBikeRes.value);
      }

      if (bookingsRes.status === 'fulfilled' && Array.isArray(bookingsRes.value)) {
        const b = bookingsRes.value;
        const upcoming = b.find((item: any) => item.status === 'IN_SERVICE' || item.status === 'CONFIRMED' || item.status === 'PENDING');
        if (upcoming) {
          setUpcomingBooking(upcoming);
        }
        const completed = b.filter((item: any) => item.status === 'COMPLETED').map((item: any) => ({
          id: item.id,
          serviceName: item.service?.name || item.servicePackage || 'Precision Maintenance',
          date: item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '10 Agu 2026',
          status: 'COMPLETED',
          cost: Number(item.totalCost || item.estimatedCost || 385000),
        }));
        if (completed.length > 0) {
          setServiceLogs(completed);
        }
      }
    } catch (e) {
      console.warn('Could not fetch live racer dashboard:', e);
    }
  };

  useEffect(() => {
    fetchRacerData();
  }, []);

  const handleRefreshDiagnostics = async () => {
    setIsRefreshing(true);
    await fetchRacerData();
    setIsRefreshing(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] relative font-sans">
      
      {/* Top Welcome & Loyalty Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        {/* Left: Greeting & Status */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display uppercase">
            Selamat Datang, Racer!
          </h1>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 bg-[#1c1b1b] border border-[#1E293B] px-3 py-1 rounded font-mono text-xs shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span className="text-[#e5e2e1] font-semibold tracking-wide">SYSTEM ONLINE</span>
            </div>
            <span className="text-[#4c4732]">|</span>
            <span className="text-[#cec6ab]">ID: {racerData.racerId}</span>
          </div>
        </div>

        {/* Right: Loyalty Status Card */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 w-full lg:w-72 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-[#cec6ab] uppercase font-semibold">
              LOYALTY STATUS
            </span>
            <div className="w-5 h-5 rounded-full bg-[#FFE01B]/10 border border-[#FFE01B]/30 flex items-center justify-center text-[#FFE01B]">
              <Star className="w-3 h-3 fill-[#FFE01B] text-[#FFE01B]" />
            </div>
          </div>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">
              {Number(racerData.loyaltyVaultPoints || 12450).toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-bold font-mono text-[#FFE01B] uppercase">
              POIN
            </span>
          </div>

          <div className="mt-2">
            <span className="inline-block bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              {racerData.tier || 'ELITE MEMBER'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Service & Elite Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* 1. UPCOMING SERVICE CARD (7 Cols) */}
        <div className="lg:col-span-7 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFE01B]"></div>

          <div>
            <div className="flex items-center gap-1.5 text-[#FFE01B] text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
              <Zap className="w-4 h-4 fill-[#FFE01B]" />
              <span>UPCOMING SERVICE</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#e5e2e1] font-display uppercase">
              {upcomingBooking?.service?.name || upcomingBooking?.servicePackage || '21-Point Precision Lab Service'}
            </h2>
          </div>

          {/* Engine image & details row */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Motorcycle Engine Thumbnail */}
            <div className="sm:col-span-5 aspect-video sm:aspect-square rounded overflow-hidden border border-[#1E293B] bg-[#131313] shadow-inner relative group">
              <img
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80"
                alt="Motorcycle Engine Service"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-mono text-[#FFE01B] bg-black/80 px-2 py-0.5 rounded border border-[#1E293B] truncate max-w-full">
                  {primaryBike ? `${primaryBike.brand} ${primaryBike.model}` : 'Yamaha Aerox 155 VVA'}
                </span>
              </div>
            </div>

            {/* Location & Schedule Info */}
            <div className="sm:col-span-7 space-y-3 font-mono">
              <div>
                <span className="text-[10px] tracking-wider text-[#cec6ab] uppercase font-bold block">
                  LOCATION
                </span>
                <p className="text-sm font-bold text-[#e5e2e1] mt-0.5">
                  {upcomingBooking?.branch || 'WE N SPEED - Bekasi HQ (Bay 01)'}
                </p>
              </div>

              <div>
                <span className="text-[10px] tracking-wider text-[#cec6ab] uppercase font-bold block">
                  SCHEDULE
                </span>
                <p className="text-sm font-bold text-[#e5e2e1] mt-0.5">
                  {upcomingBooking ? `${new Date(upcomingBooking.bookingDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • ${upcomingBooking.bookingTime}` : 'Senin, 17 Agu 2026 • 10:00 WIB'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center gap-2.5">
                <button
                  onClick={() => setManageServiceModal('manage')}
                  className="px-4 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs rounded uppercase tracking-wider transition shadow-sm shadow-[#FFE01B]/20 cursor-pointer"
                >
                  MANAGE
                </button>
                <button
                  onClick={() => setManageServiceModal('details')}
                  className="px-4 py-2 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] text-[#e5e2e1] font-mono font-bold text-xs rounded uppercase tracking-wider transition cursor-pointer"
                >
                  DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ELITE DIRECTIVES CARD (5 Cols) */}
        <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#e5e2e1] tracking-tight font-display uppercase">
              Elite Directives
            </h3>
            <p className="text-xs text-[#cec6ab] font-sans">
              Quick-access protocols for premium members.
            </p>
          </div>

          <div className="space-y-2.5 mt-4 font-mono">
            {/* Button 1: FREE TOWING */}
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] text-[#e5e2e1] transition group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#e5e2e1]">
                  FREE TOWING
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#cec6ab] group-hover:text-[#FFE01B] group-hover:translate-x-0.5 transition" />
            </button>

            {/* Button 2: PRIORITY QUEUE */}
            <button
              onClick={() => setIsPriorityOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] text-[#e5e2e1] transition group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#e5e2e1]">
                  PRIORITY QUEUE
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#cec6ab] group-hover:text-[#FFE01B] group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Service Log */}
      <div className="grid grid-cols-1 gap-5">
        {/* SERVICE LOG CARD */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-[#e5e2e1] uppercase tracking-wider font-display">
                SERVICE LOG & RIWAYAT PERAWATAN
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FFE01B]/10 text-[#FFE01B] font-mono text-[10px] font-bold">
                {serviceLogs.length} RECORDS
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('profile')}
              className="text-xs font-mono font-bold text-[#FFE01B] hover:underline uppercase tracking-wider cursor-pointer"
            >
              VIEW ALL
            </button>
          </div>

          {/* Service Log Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {serviceLogs.slice(0, 3).map((log: any) => (
              <div key={log.id} className="p-3.5 bg-[#131313] rounded border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0"></span>
                    <span className="text-xs font-bold text-white font-mono">
                      {log.serviceName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#cec6ab]">
                    {log.date}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
                    {log.status}
                  </span>
                  <span className="text-[11px] font-mono text-[#CCFF00] font-bold">
                    Rp {Number(log.cost || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Prompt */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateTab('bookings')}
              className="px-5 py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black rounded text-xs font-mono font-bold transition uppercase tracking-wider text-center cursor-pointer shadow-md shadow-[#FFE01B]/20"
            >
              Schedule New Maintenance Slot
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EmergencySupportModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <PriorityQueueModal
        isOpen={isPriorityOpen}
        onClose={() => setIsPriorityOpen(false)}
      />

      <ManageServiceModal
        isOpen={manageServiceModal !== null}
        mode={manageServiceModal || 'manage'}
        onClose={() => setManageServiceModal(null)}
      />

    </div>
  );
};

