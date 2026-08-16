import React from 'react';
import { 
  Wrench, 
  Settings, 
  Bell, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  User, 
  Sparkles,
  Search,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HeaderNavProps {
  currentView: 'dashboard' | 'landing' | 'booking' | 'telemetry' | 'membership';
  onNavigate: (view: 'dashboard' | 'landing' | 'booking' | 'telemetry' | 'membership') => void;
  onOpenBooking: () => void;
  onOpenDiagnosis: () => void;
  activeNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onNavigate,
  onOpenBooking,
  onOpenDiagnosis,
  activeNotificationsCount = 2,
  onOpenNotifications,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#181A20]/95 backdrop-blur-md border-b border-[#2D3139] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 group text-left transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-[1px]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base md:text-lg font-display uppercase group-hover:text-indigo-400 transition-colors">
                  ART N SPEED
                </span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                  LAB
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider font-mono uppercase">
                MECHANICAL LAB
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'landing'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'dashboard'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => onNavigate('booking')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'booking'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Booking
            </button>
            <button
              onClick={() => onNavigate('telemetry')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'telemetry'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Diagnostics Live
            </button>
            <button
              onClick={() => onNavigate('membership')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'membership'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Membership
            </button>
          </nav>
        </div>

        {/* Action Controls & Book CTA */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick View switcher preview pill */}
          <div className="hidden lg:flex items-center bg-[#111318] border border-[#2D3139] rounded-lg p-1 text-[11px] font-medium">
            <button 
              onClick={() => onNavigate('dashboard')}
              title="Service Selection & Diagnostics Dashboard"
              className={`px-3 py-1 rounded-md transition-colors ${currentView === 'dashboard' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Lab Hub
            </button>
            <button 
              onClick={() => onNavigate('landing')}
              title="Brand Landing Page"
              className={`px-3 py-1 rounded-md transition-colors ${currentView === 'landing' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Landing
            </button>
            <button 
              onClick={() => onNavigate('booking')}
              title="Lab Session Scheduler"
              className={`px-3 py-1 rounded-md transition-colors ${currentView === 'booking' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Schedule
            </button>
          </div>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-[#181A20] border border-[#2D3139] text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {activeNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {activeNotificationsCount}
              </span>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-[#181A20] border border-[#2D3139] text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Book Now Main Button */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>

      </div>
    </header>
  );
};
