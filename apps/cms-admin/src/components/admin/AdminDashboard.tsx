import React from 'react';
import { 
  Banknote, 
  Calendar, 
  AlertTriangle, 
  ThumbsUp, 
  TrendingUp, 
  Star, 
  ArrowUpRight, 
  Clock, 
  Wrench, 
  Activity, 
  CheckCircle, 
  Flame,
  Plus,
  Car,
  FileCheck
} from 'lucide-react';
import { WORKSHOP_STATS, INITIAL_BOOKINGS, INITIAL_INVENTORY } from '../../data/mockData';

interface AdminDashboardProps {
  onNavigateTab: (tab: any) => void;
  onOpenReport: () => void;
  onQuickAddBooking: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenReport,
  onQuickAddBooking,
}) => {
  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800">
      {/* 4 High Density Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* 1. TOTAL REVENUE CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-40 hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                TOTAL REVENUE
              </span>
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                {WORKSHOP_STATS.revenueGrowth}
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-brand">
                {WORKSHOP_STATS.totalRevenue}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
            <span>Target: Rp 150M</span>
            <span className="text-indigo-600 font-bold">95.0% Achieved</span>
          </div>
        </div>

        {/* 2. ACTIVE BOOKINGS CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-40 hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ACTIVE BOOKINGS
              </span>
              <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                Live Queue
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-racing">
                {WORKSHOP_STATS.activeBookings}
              </h3>
            </div>
          </div>

          {/* Under progress line */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Capacity Utilized</span>
              <span className="font-semibold text-slate-700">65%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full w-[65%]"></div>
            </div>
          </div>
        </div>

        {/* 3. LOW STOCK CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-40 hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                LOW STOCK ALERT
              </span>
              <span className="text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                Critical
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl md:text-3xl font-black text-rose-600 tracking-tight font-racing">
                {WORKSHOP_STATS.lowStockCount} Parts
              </h3>
            </div>
          </div>

          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono flex items-center justify-between">
            <span className="truncate">V-Belts, Brake Pads</span>
            <span className="text-rose-600 font-bold underline cursor-pointer" onClick={() => onNavigateTab('inventory')}>
              Restock
            </span>
          </div>
        </div>

        {/* 4. CSAT RATING CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-40 hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                CSAT SATISFACTION
              </span>
              <span className="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                Top Rated
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-racing">
                4.9
              </h3>
              <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
            </div>
          </div>

          {/* 5 Yellow Stars */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">894 Racer Reviews</span>
          </div>
        </div>

      </div>

      {/* Workshop Live Bay Telemetry & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Workshop Bays */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-800 uppercase tracking-wider">
                  Workshop Bay Telemetry & Status
                </h3>
                <p className="text-xs text-slate-500">Real-time technician allocation across Depok HQ</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-mono"
            >
              <span>Manage Bays</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bays Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WORKSHOP_STATS.bays.map((bay) => (
              <div
                key={bay.bayNumber}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {bay.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      bay.status === 'OCCUPIED'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : bay.status === 'IN_USE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse'
                        : bay.status === 'STANDBY'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {bay.status}
                  </span>
                </div>

                <div className="text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Bike:</span>
                    <span className="text-slate-800 font-bold">{bay.currentBike}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chief Tech:</span>
                    <span className="text-slate-700">{bay.mechanic}</span>
                  </div>
                </div>

                {/* Progress bar */}
                {bay.progress > 0 && (
                  <div className="space-y-1 pt-1 border-t border-slate-200/60">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Service Completion</span>
                      <span className="font-bold text-indigo-600">{bay.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${bay.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Action Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-slate-100">
            <button
              onClick={onQuickAddBooking}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>New Walk-in Booking</span>
            </button>

            <button
              onClick={() => onNavigateTab('inventory')}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition font-mono"
            >
              <Wrench className="w-4 h-4 text-slate-500" />
              <span>Restock Spare Parts</span>
            </button>

            <button
              onClick={onOpenReport}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition font-mono"
            >
              <FileCheck className="w-4 h-4 text-slate-500" />
              <span>Export Shift Audit</span>
            </button>
          </div>
        </div>

        {/* Right: Live Activity & Critical Low Stock Alert */}
        <div className="space-y-6">
          
          {/* Critical Stock Card */}
          <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Critical Restock Needed
                </span>
              </div>
              <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                2 Items
              </span>
            </div>

            <div className="space-y-2.5">
              {INITIAL_INVENTORY.filter((i) => i.status === 'Critical Out').map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 font-mono truncate max-w-[180px]">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500">
                      Location: {item.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-rose-600">
                      {item.stock} left
                    </span>
                    <p className="text-[10px] font-mono text-slate-400">min {item.minThreshold}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('inventory')}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition text-center font-mono shadow-xs"
            >
              Open Purchase Order Portal →
            </button>
          </div>

          {/* Recent Bookings Feed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Clock className="w-4 h-4 text-indigo-600" />
                Recent Service Schedule
              </span>
              <button
                onClick={() => onNavigateTab('bookings')}
                className="text-[11px] font-mono text-indigo-600 hover:underline font-semibold"
              >
                View 48 Active
              </button>
            </div>

            <div className="space-y-2.5">
              {INITIAL_BOOKINGS.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800 font-mono">{b.customerName}</p>
                    <p className="text-[11px] text-slate-500">{b.bikeModel} • {b.time}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      b.status === 'IN_SERVICE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

