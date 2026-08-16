import React from 'react';
import { 
  Wrench, 
  Activity, 
  Gauge, 
  Car, 
  HelpCircle, 
  User, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'diagnostics' | 'services' | 'performance' | 'garage' | 'support';
  onSelectTab: (tab: 'diagnostics' | 'services' | 'performance' | 'garage' | 'support') => void;
  onUpgradePlan: () => void;
  onViewProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onUpgradePlan,
  onViewProfile,
}) => {
  return (
    <aside className="w-64 shrink-0 bg-[#131313] border-r border-[#1E293B] flex flex-col justify-between p-6 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#e5e2e1] text-lg font-display tracking-tight uppercase">
              ART N SPEED
            </span>
          </div>
          <p className="text-[10px] text-[#cec6ab] font-mono tracking-widest uppercase">
            MECHANICAL LAB
          </p>
        </div>

        {/* Member Profile Badge */}
        <button
          onClick={onViewProfile}
          className="w-full bg-[#1c1b1b] hover:bg-[#201f1f] border border-[#1E293B] rounded p-3 flex items-center gap-3 text-left transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded bg-[#FFE01B] border border-[#1E293B] flex items-center justify-center font-bold text-black text-xs shrink-0 shadow-sm shadow-[#FFE01B]/20 group-hover:scale-105 transition-transform font-mono">
            RP
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#e5e2e1] truncate">
                Rian Pratama
              </span>
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.5)]"></span>
            </div>
            <p className="text-[10px] text-[#cec6ab] uppercase tracking-wider font-mono">
              ELITE RACER • PRO
            </p>
          </div>
        </button>

        {/* Navigation Section */}
        <div>
          <p className="text-[10px] font-bold text-[#cec6ab] uppercase tracking-widest mb-3 px-1 font-mono">
            Main Navigation
          </p>

          <nav className="space-y-1 text-sm font-medium">
            
            <button
              onClick={() => onSelectTab('diagnostics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all cursor-pointer ${
                activeTab === 'diagnostics'
                  ? 'bg-[#FFE01B]/15 text-[#FFE01B] border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              <div className={`w-3.5 h-3.5 border-2 rounded-xs ${activeTab === 'diagnostics' ? 'border-[#FFE01B] bg-[#FFE01B]' : 'border-slate-500'}`} />
              <span>Diagnostics</span>
            </button>

            <button
              onClick={() => onSelectTab('services')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#FFE01B]/15 text-[#FFE01B] border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              <div className={`w-3.5 h-3.5 border-2 rounded-xs ${activeTab === 'services' ? 'border-[#FFE01B] bg-[#FFE01B]' : 'border-slate-500'}`} />
              <span>Services</span>
            </button>

            <button
              onClick={() => onSelectTab('performance')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all cursor-pointer ${
                activeTab === 'performance'
                  ? 'bg-[#FFE01B]/15 text-[#FFE01B] border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              <div className={`w-3.5 h-3.5 border-2 rounded-full ${activeTab === 'performance' ? 'border-[#FFE01B] bg-[#FFE01B]' : 'border-slate-500'}`} />
              <span>Performance</span>
            </button>

            <button
              onClick={() => onSelectTab('garage')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all cursor-pointer ${
                activeTab === 'garage'
                  ? 'bg-[#FFE01B]/15 text-[#FFE01B] border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              <div className={`w-3.5 h-3.5 border-2 rotate-45 ${activeTab === 'garage' ? 'border-[#FFE01B] bg-[#FFE01B]' : 'border-slate-500'}`} />
              <span>Garage</span>
            </button>

            <button
              onClick={() => onSelectTab('support')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-[#FFE01B]/15 text-[#FFE01B] border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              <div className={`w-3.5 h-3.5 border-2 rounded-xs ${activeTab === 'support' ? 'border-[#FFE01B] bg-[#FFE01B]' : 'border-slate-500'}`} />
              <span>Support</span>
            </button>

          </nav>
        </div>

        {/* Live Lab Status */}
        <div>
          <p className="text-[10px] font-bold text-[#cec6ab] uppercase tracking-widest mb-3 px-1 font-mono">
            Active Lab Bays
          </p>
          <div className="flex flex-col gap-3 px-1 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.5)]"></div>
                <span className="text-xs font-medium text-[#e5e2e1]">Bay #01 Margonda</span>
              </div>
              <span className="text-[10px] text-[#cec6ab]">12% load</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#FFE01B] shadow-[0_0_8px_rgba(255,224,27,0.4)]"></div>
                <span className="text-xs font-medium text-[#e5e2e1]">Bay #02 Bekasi</span>
              </div>
              <span className="text-[10px] text-[#cec6ab]">84% load</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#bec6e0]"></div>
                <span className="text-xs font-medium text-[#e5e2e1]">Bay #03 Pamulang</span>
              </div>
              <span className="text-[10px] text-[#cec6ab]">45% load</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cloud Telemetry & Upgrade Card */}
      <div className="pt-4 space-y-3">
        <div className="p-4 bg-[#1c1b1b] border border-[#1E293B] rounded">
          <div className="flex justify-between items-center mb-2 font-mono">
            <p className="text-[10px] font-bold text-[#cec6ab] uppercase tracking-wider">OBD Cloud Sync</p>
            <span className="text-[10px] text-[#FFE01B] font-bold">Pro</span>
          </div>
          <div className="w-full h-1.5 bg-[#0e0e0e] rounded-full overflow-hidden">
            <div className="w-[72%] h-full bg-[#FFE01B]"></div>
          </div>
          <p className="text-[10px] text-right mt-1.5 text-[#cec6ab] font-mono">14.2 MB of 20 MB synced</p>
        </div>

        <button
          onClick={onUpgradePlan}
          className="w-full bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs py-2.5 rounded transition-all shadow-md shadow-[#FFE01B]/20 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upgrade to Elite Tier</span>
        </button>
      </div>
    </aside>
  );
};
