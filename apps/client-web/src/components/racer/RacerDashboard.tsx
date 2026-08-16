import React, { useState } from 'react';
import { 
  Star, 
  Zap, 
  Truck, 
  Flame, 
  RotateCw, 
  ArrowRight 
} from 'lucide-react';
import { 
  INITIAL_RACER, 
  INITIAL_UPCOMING_SERVICE, 
  INITIAL_SERVICE_LOGS 
} from '../../data/mockData';
import { EmergencySupportModal } from './EmergencySupportModal';
import { PriorityQueueModal } from './PriorityQueueModal';
import { ManageServiceModal } from './ManageServiceModal';

interface RacerDashboardProps {
  onNavigateTab: (tab: any) => void;
}

export const RacerDashboard: React.FC<RacerDashboardProps> = ({ onNavigateTab }) => {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [manageServiceModal, setManageServiceModal] = useState<'manage' | 'details' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [racerData, setRacerData] = useState(INITIAL_RACER);

  const handleRefreshDiagnostics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRacerData((prev) => ({
        ...prev,
        diagnostics: {
          ...prev.diagnostics,
          lastUpdated: 'JUST NOW',
        },
      }));
    }, 600);
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
              12.450
            </span>
            <span className="text-xs font-bold font-mono text-[#FFE01B] uppercase">
              POIN
            </span>
          </div>

          <div className="mt-2">
            <span className="inline-block bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              {racerData.tier}
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
              {INITIAL_UPCOMING_SERVICE.serviceName}
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
                <span className="text-[10px] font-mono text-[#FFE01B] bg-black/80 px-2 py-0.5 rounded border border-[#1E293B]">
                  Yamaha Aerox 155 VVA
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
                  {INITIAL_UPCOMING_SERVICE.location}
                </p>
              </div>

              <div>
                <span className="text-[10px] tracking-wider text-[#cec6ab] uppercase font-bold block">
                  SCHEDULE
                </span>
                <p className="text-sm font-bold text-[#e5e2e1] mt-0.5">
                  {INITIAL_UPCOMING_SERVICE.schedule}
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

      {/* Bottom Grid: System Diagnostics & Service Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* 3. SYSTEM DIAGNOSTICS CARD (7 Cols) */}
        <div className="lg:col-span-7 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-base font-bold text-[#e5e2e1] tracking-tight font-display uppercase">
              System Diagnostics
            </h3>
            
            <button
              onClick={handleRefreshDiagnostics}
              className="flex items-center gap-1.5 text-xs font-mono text-[#cec6ab] hover:text-[#FFE01B] transition cursor-pointer"
              title="Refresh Telemetry"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FFE01B]' : ''}`} />
              <span className="tracking-wide">LAST UPDATED: {racerData.diagnostics.lastUpdated}</span>
            </button>
          </div>

          {/* 3 Diagnostic Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* 1. OIL HEALTH (65%) */}
            <div className="p-3.5 rounded bg-[#131313] border border-[#1E293B] space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#FFE01B]">
                  <span>OIL HEALTH</span>
                  <span>{racerData.diagnostics.oilHealth}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full mt-1.5 overflow-hidden border border-[#1E293B]">
                  <div
                    className="bg-[#FFE01B] h-full rounded-full"
                    style={{ width: `${racerData.diagnostics.oilHealth}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-[#cec6ab] leading-relaxed">
                Optimal range. Change in ~1,200km.
              </p>
            </div>

            {/* 2. V-BELT COND. (88%) */}
            <div className="p-3.5 rounded bg-[#131313] border border-[#1E293B] space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#22C55E]">
                  <span>V-BELT COND.</span>
                  <span>{racerData.diagnostics.vbeltCond}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full mt-1.5 overflow-hidden border border-[#1E293B]">
                  <div
                    className="bg-[#22C55E] h-full rounded-full"
                    style={{ width: `${racerData.diagnostics.vbeltCond}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-[#cec6ab] leading-relaxed">
                Excellent condition. Minimal wear.
              </p>
            </div>

            {/* 3. BRAKE PADS (15%) */}
            <div className="p-3.5 rounded bg-[#131313] border border-rose-500/30 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
                  <span>BRAKE PADS</span>
                  <span>{racerData.diagnostics.brakePads}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full mt-1.5 overflow-hidden border border-[#1E293B]">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${racerData.diagnostics.brakePads}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-rose-300 leading-relaxed">
                Critical wear. Service immediately.
              </p>
            </div>

          </div>
        </div>

        {/* 4. SERVICE LOG CARD (5 Cols) */}
        <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <span className="text-xs font-mono font-bold text-[#e5e2e1] uppercase tracking-wider font-display">
              SERVICE LOG
            </span>
            <button
              onClick={() => onNavigateTab('profile')}
              className="text-xs font-mono font-bold text-[#FFE01B] hover:underline uppercase tracking-wider cursor-pointer"
            >
              VIEW ALL
            </button>
          </div>

          {/* Service Log Entries */}
          <div className="space-y-3">
            {INITIAL_SERVICE_LOGS.slice(0, 3).map((log) => (
              <div key={log.id} className="space-y-1">
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

                <div className="pl-4">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Prompt */}
          <div className="pt-1">
            <button
              onClick={() => onNavigateTab('bookings')}
              className="w-full py-2 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] text-[#e5e2e1] hover:text-white rounded text-xs font-mono font-bold transition uppercase tracking-wider text-center cursor-pointer"
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

