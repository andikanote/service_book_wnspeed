import React from 'react';
import { RacerTab } from '../../types';
import { 
  Gauge, 
  Cpu, 
  Calendar, 
  Star, 
  User, 
  Headphones, 
  LogOut 
} from 'lucide-react';

interface RacerSidebarProps {
  currentTab: RacerTab;
  onTabChange: (tab: RacerTab) => void;
  onOpenEmergency: () => void;
  onLogout: () => void;
}

export const RacerSidebar: React.FC<RacerSidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenEmergency,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard' as RacerTab, label: 'DASHBOARD', icon: Gauge },
    { id: 'diagnostics' as RacerTab, label: 'DIAGNOSTICS', icon: Cpu },
    { id: 'bookings' as RacerTab, label: 'BOOKINGS', icon: Calendar },
    { id: 'membership' as RacerTab, label: 'MEMBERSHIP', icon: Star },
    { id: 'profile' as RacerTab, label: 'PROFILE', icon: User },
  ];

  return (
    <aside className="w-60 bg-[#131313] border-r border-[#1E293B] flex flex-col justify-between h-screen shrink-0 sticky top-0 font-sans">
      {/* Brand */}
      <div>
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#FFE01B] flex items-center justify-center text-black font-mono font-black text-sm shadow-md shadow-[#FFE01B]/20">
              G
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#e5e2e1] font-display uppercase">
                GARAGE_OS
              </h1>
              <p className="text-[10px] font-mono text-[#cec6ab]">
                v2.0.4 • Racer Portal
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded font-mono text-xs font-semibold tracking-wide transition text-left uppercase cursor-pointer ${
                  isActive
                    ? 'bg-[#FFE01B] text-black font-bold shadow-xs'
                    : 'text-[#cec6ab] hover:text-white hover:bg-[#1c1b1b]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#cec6ab]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency Button & Logout */}
      <div className="p-3 space-y-2 border-t border-[#1E293B]">
        <button
          onClick={onOpenEmergency}
          className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 font-mono font-bold text-xs py-2 px-3 rounded tracking-wide uppercase transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Headphones className="w-3.5 h-3.5 text-rose-400" />
          <span>EMERGENCY SUPPORT</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-mono text-[#cec6ab] hover:text-white transition text-left uppercase cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-[#cec6ab]" />
          <span>LOG OUT</span>
        </button>
      </div>
    </aside>
  );
};

