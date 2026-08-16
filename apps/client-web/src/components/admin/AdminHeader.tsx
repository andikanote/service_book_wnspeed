import React, { useState } from 'react';
import { Search, Bell, HelpCircle, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenProfile: () => void;
  onOpenHelp: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'Admin Dashboard',
  searchQuery,
  onSearchChange,
  onOpenProfile,
  onOpenHelp,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: 'Low Stock Alert: Gates V-Belts',
      desc: 'Only 2 units left in Rack A-03. Immediate restock needed.',
      time: '10m ago',
      type: 'warning',
    },
    {
      id: 2,
      title: 'New Service Booking: Ninja ZX-25R',
      desc: 'Racer Reza Fahlevi booked Dyno Remap for Bay #01.',
      time: '35m ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'Diagnostics Uploaded: AX-9924',
      desc: 'Brake pad wear critical (15%). Alert sent to customer.',
      time: '2h ago',
      type: 'warning',
    },
  ];

  return (
    <header className="h-16 border-b border-[#1E293B] bg-[#131313] px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 font-sans select-none">
      {/* Title & Status */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#e5e2e1] font-display uppercase">
            {title}
          </h2>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-[11px] font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
          HQ ONLINE
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative w-48 sm:w-64 md:w-72">
          <Search className="w-4 h-4 text-[#cec6ab] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search systems & parts..."
            className="w-full bg-[#1c1b1b] border border-[#1E293B] rounded pl-9 pr-3 py-1.5 text-xs text-[#e5e2e1] placeholder-slate-500 focus:outline-none focus:border-[#FFE01B] font-mono transition"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="p-2 rounded text-[#cec6ab] hover:text-white hover:bg-[#1c1b1b] border border-[#1E293B] transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFE01B] text-black text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1c1b1b] border border-[#1E293B] rounded shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 font-sans">
              <div className="p-3 border-b border-[#1E293B] bg-[#131313] flex items-center justify-between">
                <span className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Bell className="w-3.5 h-3.5 text-[#FFE01B]" />
                  Workshop Notifications
                </span>
                <span className="text-[10px] text-[#cec6ab] font-mono">Live Feed</span>
              </div>
              <div className="divide-y divide-[#1E293B] max-h-80 overflow-y-auto font-sans">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#131313] transition space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#e5e2e1] flex items-center gap-1.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#FFE01B] shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                        )}
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#cec6ab]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#cec6ab] pl-5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help icon */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded text-[#cec6ab] hover:text-white hover:bg-[#1c1b1b] border border-[#1E293B] transition cursor-pointer"
          title="CMS System Manual"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Block */}
        <div className="border-l border-[#1E293B] pl-3">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 p-1 rounded hover:bg-[#1c1b1b] transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FFE01B]/40 bg-[#131313] flex items-center justify-center text-[#FFE01B] font-bold text-xs font-mono">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-[#e5e2e1] leading-tight font-display">M. Reza</p>
              <p className="text-[10px] text-[#cec6ab] leading-tight font-mono">Lead Tuner</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#cec6ab] group-hover:text-white hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

