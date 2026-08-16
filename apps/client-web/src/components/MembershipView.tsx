import React from 'react';
import { 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Gift, 
  ChevronRight, 
  QrCode,
  User,
  CheckCircle2
} from 'lucide-react';

interface MembershipViewProps {
  onBookService: () => void;
}

export const MembershipView: React.FC<MembershipViewProps> = ({ onBookService }) => {
  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D3139] pb-5">
        <div>
          <div className="text-[11px] font-bold text-indigo-400 tracking-widest uppercase mb-1">
            ART N SPEED VIP PROGRAM
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight uppercase">
            Elite Mechanical Membership
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Exclusive perks, priority bay queueing, and calibrated performance upgrades for member vehicles.
          </p>
        </div>

        <button
          onClick={onBookService}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
        >
          Use VIP Priority Booking
        </button>
      </div>

      {/* Membership Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Virtual Card (6 cols) */}
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden p-8 border border-indigo-500/40 bg-gradient-to-br from-[#181A20] via-[#14161D] to-[#0F1115] shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 text-xl font-display font-bold">⚡ ART N SPEED</span>
              <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">
                PASS
              </span>
            </div>
            <Crown className="w-6 h-6 text-indigo-400" />
          </div>

          <div className="pt-4">
            <span className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">
              MEMBERSHIP TIER
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              ELITE RACER LAB #0492
            </div>
            <span className="text-xs text-slate-300 font-mono block mt-1">
              Member Name: Rian Pratama • Valid Thru: 12/2027
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#2D3139] text-xs">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">SPEED REWARD POINTS</span>
              <span className="text-indigo-400 font-bold text-base font-mono">4,850 PTS</span>
            </div>
            <div className="w-9 h-9 bg-[#111318] border border-[#2D3139] rounded-lg flex items-center justify-center text-indigo-400">
              <QrCode className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Benefits Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-base font-bold text-white uppercase">
            Active Member Privileges
          </h3>

          <div className="space-y-3">
            <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Fast-Track Priority Bay</h4>
                <p className="text-[11px] text-slate-400">Tanpa antri panjang di semua cabang Margonda, Bekasi, Pamulang & Cimahi.</p>
              </div>
            </div>

            <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Diskon Spare Part & Oli Sintetis 10%</h4>
                <p className="text-[11px] text-slate-400">Berlaku untuk Castrol, Dr. Pulley, Kampas Daytona, dan part racing.</p>
              </div>
            </div>

            <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Garansi Servis Diperpanjang (30 Hari)</h4>
                <p className="text-[11px] text-slate-400">Garansi getaran CVT dan servis injeksi 2x lebih lama dari non-member.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
