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
    <aside className="w-64 shrink-0 bg-[#111318] border-r border-[#2D3139] flex flex-col justify-between p-6 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg font-display tracking-tight">
              ART N SPEED
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            MECHANICAL LAB
          </p>
        </div>

        {/* Member Profile Badge */}
        <button
          onClick={onViewProfile}
          className="w-full bg-[#181A20] hover:bg-[#1F222A] border border-[#2D3139] rounded-xl p-3 flex items-center gap-3 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-[#2D3139] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            RP
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate">
                Rian Pratama
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              ELITE RACER • PRO
            </p>
          </div>
        </button>

        {/* Navigation Section */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
            Main Navigation
          </p>

          <nav className="space-y-1 text-sm font-medium">
            
            <button
              onClick={() => onSelectTab('diagnostics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === 'diagnostics'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm ${activeTab === 'diagnostics' ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-500'}`} />
              <span>Diagnostics</span>
            </button>

            <button
              onClick={() => onSelectTab('services')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === 'services'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm ${activeTab === 'services' ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-500'}`} />
              <span>Services</span>
            </button>

            <button
              onClick={() => onSelectTab('performance')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === 'performance'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-full ${activeTab === 'performance' ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-500'}`} />
              <span>Performance</span>
            </button>

            <button
              onClick={() => onSelectTab('garage')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === 'garage'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-4 h-4 border-2 rotate-45 ${activeTab === 'garage' ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-500'}`} />
              <span>Garage</span>
            </button>

            <button
              onClick={() => onSelectTab('support')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === 'support'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm ${activeTab === 'support' ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-500'}`} />
              <span>Support</span>
            </button>

          </nav>
        </div>

        {/* Live Lab Status */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
            Active Lab Bays
          </p>
          <div className="flex flex-col gap-3 px-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
                <span className="text-xs font-medium text-slate-300">Bay #01 Margonda</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">12% load</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-xs font-medium text-slate-300">Bay #02 Bekasi</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">84% load</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <span className="text-xs font-medium text-slate-300">Bay #03 Pamulang</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">45% load</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cloud Telemetry & Upgrade Card */}
      <div className="pt-4 space-y-3">
        <div className="p-4 bg-[#181A20] border border-[#2D3139] rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OBD Cloud Sync</p>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">Pro</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-[72%] h-full bg-indigo-500"></div>
          </div>
          <p className="text-[10px] text-right mt-1.5 text-slate-500 font-mono">14.2 MB of 20 MB synced</p>
        </div>

        <button
          onClick={onUpgradePlan}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upgrade to Elite Tier</span>
        </button>
      </div>
    </aside>
  );
};
