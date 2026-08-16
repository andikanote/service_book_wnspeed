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
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between h-screen shrink-0 sticky top-0">
      {/* Brand */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
              G
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 font-mono uppercase">
                GARAGE_OS
              </h1>
              <p className="text-[10px] font-mono text-slate-400">
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs font-semibold tracking-wide transition text-left uppercase ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency Button & Logout */}
      <div className="p-3 space-y-2 border-t border-slate-100">
        <button
          onClick={onOpenEmergency}
          className="w-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-mono font-bold text-xs py-2 px-3 rounded-lg tracking-wide uppercase transition flex items-center justify-center gap-2"
        >
          <Headphones className="w-3.5 h-3.5 text-rose-600" />
          <span>EMERGENCY SUPPORT</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 transition text-left uppercase cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400" />
          <span>LOG OUT</span>
        </button>
      </div>
    </aside>
  );
};

