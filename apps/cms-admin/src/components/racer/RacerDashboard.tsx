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
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800 relative">
      
      {/* Top Welcome & Loyalty Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        {/* Left: Greeting & Status */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Selamat Datang, Racer!
          </h1>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 px-3 py-1 rounded-md font-mono text-xs shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-700 font-semibold tracking-wide">SYSTEM ONLINE</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">ID: {racerData.racerId}</span>
          </div>
        </div>

        {/* Right: Loyalty Status Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 w-full lg:w-72 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
              LOYALTY STATUS
            </span>
            <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            </div>
          </div>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
              12.450
            </span>
            <span className="text-xs font-bold font-mono text-amber-600 uppercase">
              POIN
            </span>
          </div>

          <div className="mt-2">
            <span className="inline-block bg-amber-100 text-amber-800 border border-amber-200 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              {racerData.tier}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Service & Elite Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* 1. UPCOMING SERVICE CARD (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"></div>

          <div>
            <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
              <Zap className="w-4 h-4 fill-indigo-600" />
              <span>UPCOMING SERVICE</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
              {INITIAL_UPCOMING_SERVICE.serviceName}
            </h2>
          </div>

          {/* Engine image & details row */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Motorcycle Engine Thumbnail */}
            <div className="sm:col-span-5 aspect-video sm:aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-inner relative group">
              <img
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80"
                alt="Motorcycle Engine Service"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded">
                  Yamaha Aerox 155 VVA
                </span>
              </div>
            </div>

            {/* Location & Schedule Info */}
            <div className="sm:col-span-7 space-y-3">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">
                  LOCATION
                </span>
                <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                  {INITIAL_UPCOMING_SERVICE.location}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">
                  SCHEDULE
                </span>
                <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                  {INITIAL_UPCOMING_SERVICE.schedule}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center gap-2.5">
                <button
                  onClick={() => setManageServiceModal('manage')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs rounded-lg uppercase tracking-wider transition shadow-xs"
                >
                  MANAGE
                </button>
                <button
                  onClick={() => setManageServiceModal('details')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono font-bold text-xs rounded-lg uppercase tracking-wider transition"
                >
                  DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ELITE DIRECTIVES CARD (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Elite Directives
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Quick-access protocols for premium members.
            </p>
          </div>

          <div className="space-y-2.5 mt-4">
            {/* Button 1: FREE TOWING */}
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-800">
                  FREE TOWING
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Button 2: PRIORITY QUEUE */}
            <button
              onClick={() => setIsPriorityOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-800">
                  PRIORITY QUEUE
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Grid: System Diagnostics & Service Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* 3. SYSTEM DIAGNOSTICS CARD (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              System Diagnostics
            </h3>
            
            <button
              onClick={handleRefreshDiagnostics}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition"
              title="Refresh Telemetry"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="tracking-wide">LAST UPDATED: {racerData.diagnostics.lastUpdated}</span>
            </button>
          </div>

          {/* 3 Diagnostic Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* 1. OIL HEALTH (65%) */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-600">
                  <span>OIL HEALTH</span>
                  <span>{racerData.diagnostics.oilHealth}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${racerData.diagnostics.oilHealth}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
                Optimal range. Change in ~1,200km.
              </p>
            </div>

            {/* 2. V-BELT COND. (88%) */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-600">
                  <span>V-BELT COND.</span>
                  <span>{racerData.diagnostics.vbeltCond}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${racerData.diagnostics.vbeltCond}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
                Excellent condition. Minimal wear.
              </p>
            </div>

            {/* 3. BRAKE PADS (15%) */}
            <div className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-200 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-600">
                  <span>BRAKE PADS</span>
                  <span>{racerData.diagnostics.brakePads}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-rose-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${racerData.diagnostics.brakePads}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-rose-700 leading-relaxed">
                Critical wear. Service immediately.
              </p>
            </div>

          </div>
        </div>

        {/* 4. SERVICE LOG CARD (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              SERVICE LOG
            </span>
            <button
              onClick={() => onNavigateTab('profile')}
              className="text-xs font-mono font-bold text-indigo-600 hover:underline uppercase tracking-wider"
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
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {log.serviceName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {log.date}
                  </span>
                </div>

                <div className="pl-4">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700">
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
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-mono font-bold transition uppercase tracking-wider text-center"
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

