import React from 'react';
import { AdminTab } from '../../types';
import { LayoutGrid, Calendar, Wrench, Package, Users, Settings, HelpCircle, LogOut, FileText, Activity } from 'lucide-react';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onOpenReport: () => void;
  onOpenSupport: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenReport,
  onOpenSupport,
  onLogout,
}) => {
  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutGrid },
    { id: 'bookings' as AdminTab, label: 'Bookings', icon: Calendar },
    { id: 'services' as AdminTab, label: 'Services', icon: Wrench },
    { id: 'inventory' as AdminTab, label: 'Inventory', icon: Package },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col justify-between h-screen shrink-0 sticky top-0 text-slate-300 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-600/30">
              AS
            </div>
            <div>
              <h1 className="text-base font-black tracking-wider text-white font-brand uppercase">
                ART N SPEED
              </h1>
              <p className="text-[10px] font-mono text-slate-400 tracking-tight">
                High Density CMS v2.4
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'bookings' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    48
                  </span>
                )}
                {item.id === 'inventory' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    2 Low
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Capacity & Action Section */}
      <div className="p-3 space-y-3">
        {/* High Density Bay Capacity Widget */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Bay Load
            </span>
            <span className="font-bold text-white font-mono">75%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full w-3/4"></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>3 of 4 Bays Active</span>
            <span className="text-emerald-400 font-semibold">1 Available</span>
          </div>
        </div>

        {/* Generate Report Button */}
        <button
          onClick={onOpenReport}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs py-2.5 px-3 rounded-lg tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>GENERATE REPORT</span>
        </button>

        <div className="border-t border-slate-800 pt-2 space-y-0.5">
          <button
            onClick={onOpenSupport}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition text-left rounded-md hover:bg-slate-800/50 font-mono"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Help & Support</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 transition text-left rounded-md hover:bg-rose-500/10 font-mono cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

