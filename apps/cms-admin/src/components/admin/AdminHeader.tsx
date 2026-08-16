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
    <header className="h-16 border-b border-slate-200 bg-white px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Title & Status */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800">
            {title}
          </h2>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          HQ ONLINE
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative w-48 sm:w-64 md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search systems & parts..."
            className="w-full bg-slate-100/80 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-600" />
                  Workshop Notifications
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Live Feed</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        )}
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 pl-5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help icon */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
          title="CMS System Manual"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Block */}
        <div className="border-l border-slate-200 pl-3">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs">
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
              <p className="text-xs font-semibold text-slate-800 leading-tight">M. Reza</p>
              <p className="text-[10px] text-slate-400 leading-tight font-mono">Lead Tuner</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

