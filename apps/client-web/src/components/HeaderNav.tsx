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
  ChevronRight,
  LogIn
} from 'lucide-react';

interface HeaderNavProps {
  currentView: 'dashboard' | 'landing' | 'booking' | 'telemetry' | 'membership';
  onNavigate: (view: 'dashboard' | 'landing' | 'booking' | 'telemetry' | 'membership') => void;
  onOpenBooking: () => void;
  onOpenDiagnosis: () => void;
  activeNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenPortal?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onNavigate,
  onOpenBooking,
  onOpenDiagnosis,
  activeNotificationsCount = 2,
  onOpenNotifications,
  onOpenSettings,
  onOpenPortal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#131313]/90 backdrop-blur-md border-b border-[#1E293B] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 group text-left transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded bg-[#FFE01B] flex items-center justify-center text-black shadow-md shadow-[#FFE01B]/20 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 bg-black rounded-xs rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#FFE01B] rounded-[1px]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-[#e5e2e1] text-base md:text-lg font-display uppercase group-hover:text-[#FFE01B] transition-colors">
                  ART N SPEED
                </span>
                <span className="text-[10px] bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 px-2 py-0.5 rounded font-mono font-semibold">
                  LAB
                </span>
              </div>
              <p className="text-[10px] text-[#cec6ab] tracking-wider font-mono uppercase">
                MECHANICAL LAB
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currentView === 'landing'
                  ? 'text-[#FFE01B] bg-[#FFE01B]/10 border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-[#FFE01B] bg-[#FFE01B]/10 border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => onNavigate('booking')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currentView === 'booking'
                  ? 'text-[#FFE01B] bg-[#FFE01B]/10 border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              Booking
            </button>
            <button
              onClick={() => onNavigate('telemetry')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'telemetry'
                  ? 'text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#CCFF00]" />
              Diagnostics Live
            </button>
            <button
              onClick={() => onNavigate('membership')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currentView === 'membership'
                  ? 'text-[#FFE01B] bg-[#FFE01B]/10 border border-[#FFE01B]/30 font-semibold'
                  : 'text-[#e5e2e1]/70 hover:text-white hover:bg-[#1c1b1b]'
              }`}
            >
              Membership
            </button>
          </nav>
        </div>

        {/* Action Controls & Book CTA */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick View switcher preview pill */}
          <div className="hidden lg:flex items-center bg-[#1c1b1b] border border-[#1E293B] rounded p-1 text-[11px] font-medium font-mono">
            <button 
              onClick={() => onNavigate('landing')}
              title="Brand Landing Page"
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${currentView === 'landing' ? 'bg-[#FFE01B]/15 text-[#FFE01B] border border-[#FFE01B]/30 font-bold' : 'text-[#e5e2e1]/60 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              title="Service Selection & Diagnostics Dashboard"
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${currentView === 'dashboard' ? 'bg-[#FFE01B]/15 text-[#FFE01B] border border-[#FFE01B]/30 font-bold' : 'text-[#e5e2e1]/60 hover:text-white'}`}
            >
              Services
            </button>
            <button 
              onClick={() => onNavigate('booking')}
              title="Lab Session Scheduler"
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${currentView === 'booking' ? 'bg-[#FFE01B]/15 text-[#FFE01B] border border-[#FFE01B]/30 font-bold' : 'text-[#e5e2e1]/60 hover:text-white'}`}
            >
              Schedule
            </button>
          </div>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded bg-[#1c1b1b] border border-[#1E293B] text-[#e5e2e1] hover:text-[#FFE01B] hover:border-[#FFE01B]/40 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {activeNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFE01B] text-black text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {activeNotificationsCount}
              </span>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded bg-[#1c1b1b] border border-[#1E293B] text-[#e5e2e1] hover:text-[#FFE01B] hover:border-[#FFE01B]/40 transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Book Now Main Button (Placed before Masuk) */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs px-4 py-2 rounded transition-all shadow-md shadow-[#FFE01B]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer font-mono uppercase tracking-wider"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>

          {/* Masuk (Login / Portal Access Button) */}
          {onOpenPortal && (
            <button
              onClick={onOpenPortal}
              title="Masuk ke Portal ART N SPEED (Admin CMS & Racer Portal)"
              className="flex items-center gap-1.5 bg-[#1c1b1b] hover:bg-[#2a2a2a] border border-[#1E293B] hover:border-[#FFE01B]/40 text-[#FFE01B] font-bold text-xs px-3.5 py-2 rounded transition-all cursor-pointer font-mono uppercase tracking-wider"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FFE01B]" />
              <span>Masuk</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
