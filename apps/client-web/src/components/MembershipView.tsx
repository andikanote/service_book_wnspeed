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
    <div className="space-y-8 py-4 max-w-7xl mx-auto font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="text-[11px] font-bold text-[#FFE01B] tracking-widest uppercase mb-1 font-mono">
            ART N SPEED VIP PROGRAM
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#e5e2e1] font-display tracking-tight uppercase">
            Elite Mechanical Membership
          </h1>
          <p className="text-xs sm:text-sm text-[#cec6ab] mt-1">
            Exclusive perks, priority bay queueing, and calibrated performance upgrades for member vehicles.
          </p>
        </div>

        <button
          onClick={onBookService}
          className="bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs px-5 py-3 rounded transition-all shadow-md shadow-[#FFE01B]/20 uppercase tracking-wider cursor-pointer"
        >
          Use VIP Priority Booking
        </button>
      </div>

      {/* Membership Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Virtual Card (6 cols) */}
        <div className="lg:col-span-6 relative rounded overflow-hidden p-8 border border-[#FFE01B]/40 bg-gradient-to-br from-[#0F172A] via-[#1c1b1b] to-[#131313] shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#FFE01B] text-xl font-display font-bold">⚡ ART N SPEED</span>
              <span className="text-[9px] bg-[#FFE01B] text-black px-1.5 py-0.5 rounded font-bold font-mono">
                PASS
              </span>
            </div>
            <Crown className="w-6 h-6 text-[#FFE01B]" />
          </div>

          <div className="pt-4 font-mono">
            <span className="text-[10px] uppercase text-[#cec6ab] tracking-wider font-bold">
              MEMBERSHIP TIER
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#e5e2e1] tracking-tight">
              ELITE RACER LAB #0492
            </div>
            <span className="text-xs text-[#cec6ab] block mt-1">
              Member Name: Rian Pratama • Valid Thru: 12/2027
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1E293B] text-xs font-mono">
            <div>
              <span className="text-[#cec6ab] block text-[9px] uppercase font-bold">SPEED REWARD POINTS</span>
              <span className="text-[#CCFF00] font-bold text-base font-mono">4,850 PTS</span>
            </div>
            <div className="w-9 h-9 bg-[#131313] border border-[#1E293B] rounded flex items-center justify-center text-[#FFE01B]">
              <QrCode className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Benefits Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-base font-bold text-[#e5e2e1] uppercase font-display">
            Active Member Privileges
          </h3>

          <div className="space-y-3">
            <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#e5e2e1] font-display">Fast-Track Priority Bay</h4>
                <p className="text-[11px] text-[#cec6ab]">Tanpa antri panjang di semua cabang Margonda, Bekasi, Pamulang & Cimahi.</p>
              </div>
            </div>

            <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#e5e2e1] font-display">Diskon Spare Part & Oli Sintetis 10%</h4>
                <p className="text-[11px] text-[#cec6ab]">Berlaku untuk Castrol, Dr. Pulley, Kampas Daytona, dan part racing.</p>
              </div>
            </div>

            <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#e5e2e1] font-display">Garansi Servis Diperpanjang (30 Hari)</h4>
                <p className="text-[11px] text-[#cec6ab]">Garansi getaran CVT dan servis injeksi 2x lebih lama dari non-member.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
