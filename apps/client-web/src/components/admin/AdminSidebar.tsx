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
    <aside className="w-64 bg-[#131313] border-r border-[#1E293B] flex flex-col justify-between h-screen shrink-0 sticky top-0 text-[#cec6ab] font-sans select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#FFE01B] flex items-center justify-center text-black font-black text-sm shadow-md shadow-[#FFE01B]/20">
              AS
            </div>
            <div>
              <h1 className="text-base font-black tracking-wider text-[#e5e2e1] font-display uppercase">
                ART N SPEED
              </h1>
              <p className="text-[10px] font-mono text-[#cec6ab] tracking-tight">
                High Density CMS v2.4
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" title="System Online" />
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#cec6ab] uppercase tracking-wider font-mono">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#FFE01B] text-black shadow-sm font-bold'
                    : 'text-[#cec6ab] hover:text-white hover:bg-[#1c1b1b]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#cec6ab]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'bookings' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive ? 'bg-black text-[#FFE01B]' : 'bg-[#1c1b1b] text-[#cec6ab]'
                  }`}>
                    48
                  </span>
                )}
                {item.id === 'inventory' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive ? 'bg-black text-[#FFE01B]' : 'bg-rose-500/20 text-rose-300'
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
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-3 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#cec6ab] font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#FFE01B]" />
              Bay Load
            </span>
            <span className="font-bold text-[#e5e2e1] font-mono">75%</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
            <div className="bg-[#CCFF00] h-full rounded-full w-3/4"></div>
          </div>
          <div className="flex justify-between text-[10px] text-[#cec6ab] font-mono">
            <span>3 of 4 Bays Active</span>
            <span className="text-[#CCFF00] font-semibold">1 Available</span>
          </div>
        </div>

        {/* Generate Report Button */}
        <button
          onClick={onOpenReport}
          className="w-full bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs py-2.5 px-3 rounded tracking-wider uppercase transition shadow-md shadow-[#FFE01B]/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>GENERATE REPORT</span>
        </button>

        <div className="border-t border-[#1E293B] pt-2 space-y-0.5">
          <button
            onClick={onOpenSupport}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#cec6ab] hover:text-white transition text-left rounded hover:bg-[#1c1b1b] font-mono cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#cec6ab]" />
            <span>Help & Support</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 transition text-left rounded hover:bg-rose-500/10 font-mono cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

