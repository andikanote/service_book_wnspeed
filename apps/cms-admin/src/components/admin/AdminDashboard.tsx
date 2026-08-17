import React, { useState, useEffect } from 'react';
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
  FileCheck,
  Loader2
} from 'lucide-react';
import { Booking, InventoryItem } from '../../types';
import { apiClient } from '../../services/api';

const DEFAULT_STATS = {
  totalRevenue: 84500000,
  revenueGrowth: 14.2,
  activeBookings: 8,
  criticalLowStock: 2,
  avgSatisfaction: 4.9,
  workshopBays: [
    { bayNumber: '01', status: 'In Service', currentBike: 'Yamaha Aerox 155 (B 4992 ELA)', mechanic: 'Chief Tech (Bay 01)', progress: 75 },
    { bayNumber: '02', status: 'In Service', currentBike: 'Kawasaki ZX-25R (B 3012 SAA)', mechanic: 'Bay 2 Tuner', progress: 40 },
    { bayNumber: '03', status: 'Available', currentBike: null, mechanic: null, progress: 0 },
    { bayNumber: '04', status: 'Available', currentBike: null, mechanic: null, progress: 0 },
  ],
};

interface AdminDashboardProps {
  onNavigateTab: (tab: any) => void;
  onOpenReport: () => void;
  onQuickAddBooking: () => void;
  bookings?: Booking[];
  inventory?: InventoryItem[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenReport,
  onQuickAddBooking,
  bookings: propBookings,
  inventory: propInventory,
}) => {
  const [stats, setStats] = useState<any>(DEFAULT_STATS);
  const [liveBookings, setLiveBookings] = useState<Booking[]>(propBookings || []);
  const [liveInventory, setLiveInventory] = useState<InventoryItem[]>(propInventory || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propBookings && propBookings.length > 0) {
      setLiveBookings(propBookings);
    }
  }, [propBookings]);

  useEffect(() => {
    if (propInventory && propInventory.length > 0) {
      setLiveInventory(propInventory);
    }
  }, [propInventory]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, bookingsRes, invRes] = await Promise.allSettled([
          apiClient.get('/workshop/stats'),
          apiClient.get('/bookings'),
          apiClient.get('/inventory'),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setStats(statsRes.value);
        }
        if (bookingsRes.status === 'fulfilled' && Array.isArray(bookingsRes.value) && bookingsRes.value.length > 0) {
          const mapped = bookingsRes.value.map((b: any) => ({
            id: b.id,
            customerName: b.user?.name || b.customerName || 'Customer',
            customerPhone: b.user?.phone || b.customerPhone || '-',
            bikeModel: b.bike?.model || b.bikeModel || 'Motor Matic',
            plateNumber: b.bike?.plateNumber || b.plateNumber || 'B 1234 XXX',
            servicePackage: b.service?.name || b.servicePackage || 'General Service',
            bookingDate: b.bookingDate ? new Date(b.bookingDate).toISOString().slice(0, 10) : '2026-08-17',
            time: b.bookingTime || b.time || '10:00 AM',
            status: b.status || 'PENDING',
            bayNumber: b.bayNumber,
            assignedMechanic: b.assignedMechanic || b.mechanic || 'Chief Tech',
            estimatedCost: Number(b.totalCost || b.estimatedCost || 0),
            notes: b.notes,
            branch: b.branch || 'Bekasi Branch',
          }));
          setLiveBookings(mapped);
        }
        if (invRes.status === 'fulfilled' && Array.isArray(invRes.value) && invRes.value.length > 0) {
          setLiveInventory(invRes.value.map((i: any) => ({
            id: i.id,
            sku: i.sku,
            name: i.name,
            category: i.category,
            stock: i.stock,
            minThreshold: i.minThreshold,
            price: Number(i.price),
            supplier: i.supplier || '',
            location: i.location || 'Rack A-01',
            status: i.status === 'Critical_Out' || i.status === 'Critical Out' ? 'Critical Out' : i.status === 'Low_Stock' || i.status === 'Low Stock' ? 'Low Stock' : 'In Stock',
          })));
        }
      } catch (err) {
        console.warn('Could not fetch live dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const criticalItems = liveInventory.filter(
    (i) => i.status === 'Critical Out' || i.stock <= i.minThreshold
  );

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-sans">
      {/* 4 High Density Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* 1. TOTAL REVENUE CARD */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 shadow-xs flex flex-col justify-between h-40 hover:border-[#FFE01B]/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#cec6ab] uppercase tracking-wider font-mono">
                TOTAL REVENUE
              </span>
              <span className="text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                {stats.revenueGrowth || '+18.4%'}
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
                {stats.totalRevenue || 'Rp 142.500.000'}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#cec6ab] pt-2 border-t border-[#1E293B] font-mono">
            <span>Target: Rp 150M</span>
            <span className="text-[#FFE01B] font-bold">95.0% Achieved</span>
          </div>
        </div>

        {/* 2. ACTIVE BOOKINGS CARD */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 shadow-xs flex flex-col justify-between h-40 hover:border-[#FFE01B]/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#cec6ab] uppercase tracking-wider font-mono">
                ACTIVE BOOKINGS
              </span>
              <span className="text-[#FFE01B] bg-[#FFE01B]/10 border border-[#FFE01B]/30 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                Live Queue
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
                {stats.activeBookings || liveBookings.length}
              </h3>
            </div>
          </div>

          {/* Under progress line */}
          <div className="space-y-1 pt-2 border-t border-[#1E293B]">
            <div className="flex justify-between text-[10px] text-[#cec6ab] font-mono">
              <span>Capacity Utilized</span>
              <span className="font-semibold text-white">65%</span>
            </div>
            <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
              <div className="bg-[#FFE01B] h-full rounded-full w-[65%]"></div>
            </div>
          </div>
        </div>

        {/* 3. LOW STOCK CARD */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 shadow-xs flex flex-col justify-between h-40 hover:border-rose-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#cec6ab] uppercase tracking-wider font-mono">
                LOW STOCK ALERT
              </span>
              <span className="text-rose-300 bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                Critical
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl md:text-3xl font-black text-rose-400 tracking-tight font-display">
                {criticalItems.length} Parts
              </h3>
            </div>
          </div>

          <div className="text-xs text-[#cec6ab] pt-2 border-t border-[#1E293B] font-mono flex items-center justify-between">
            <span className="truncate">
              {criticalItems.map((c) => c.name.split(' ')[0]).slice(0, 2).join(', ') || 'Semua Stock Terpenuhi'}
            </span>
            <span className="text-[#FFE01B] font-bold underline cursor-pointer" onClick={() => onNavigateTab('inventory')}>
              Restock
            </span>
          </div>
        </div>

        {/* 4. CSAT RATING CARD */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 shadow-xs flex flex-col justify-between h-40 hover:border-[#FFE01B]/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#cec6ab] uppercase tracking-wider font-mono">
                CSAT SATISFACTION
              </span>
              <span className="text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                Top Rated
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
                4.9
              </h3>
              <span className="text-sm font-semibold text-[#cec6ab]">/ 5.0</span>
            </div>
          </div>

          {/* 5 Yellow Stars */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
            <div className="flex items-center gap-1 text-[#FFE01B]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-[#FFE01B]" />
              ))}
            </div>
            <span className="text-[10px] text-[#cec6ab] font-mono">894 Racer Reviews</span>
          </div>
        </div>

      </div>

      {/* Workshop Live Bay Telemetry & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Workshop Bays */}
        <div className="lg:col-span-2 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-[#e5e2e1] uppercase tracking-wider font-display">
                  Workshop Bay Telemetry & Status
                </h3>
                <p className="text-xs text-[#cec6ab]">Real-time technician allocation across Depok HQ</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-semibold text-[#FFE01B] hover:underline flex items-center gap-1 font-mono cursor-pointer"
            >
              <span>Manage Bays</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bays Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(stats.bays || WORKSHOP_STATS.bays).map((bay: any) => (
              <div
                key={bay.bayNumber}
                className="p-4 rounded bg-[#131313] border border-[#1E293B] hover:border-[#FFE01B]/40 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#e5e2e1] font-mono">
                    {bay.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      bay.status === 'OCCUPIED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : bay.status === 'IN_USE'
                        ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 animate-pulse'
                        : bay.status === 'STANDBY'
                        ? 'bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30'
                        : 'bg-[#1c1b1b] text-[#cec6ab] border border-[#1E293B]'
                    }`}
                  >
                    {bay.status}
                  </span>
                </div>

                <div className="text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#cec6ab]">Current Bike:</span>
                    <span className="text-[#FFE01B] font-bold">{bay.currentBikePlate || bay.currentBike || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#cec6ab]">Chief Tech:</span>
                    <span className="text-white">{bay.assignedMechanic || bay.mechanic || 'Staff Tech'}</span>
                  </div>
                </div>

                {/* Progress bar */}
                {bay.progress > 0 && (
                  <div className="space-y-1 pt-1 border-t border-[#1E293B]">
                    <div className="flex justify-between text-[10px] font-mono text-[#cec6ab]">
                      <span>Service Completion</span>
                      <span className="font-bold text-[#CCFF00]">{bay.progress}%</span>
                    </div>
                    <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
                      <div
                        className="bg-[#CCFF00] h-full rounded-full transition-all duration-500"
                        style={{ width: `${bay.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Action Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-[#1E293B]">
            <button
              onClick={onQuickAddBooking}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black rounded text-xs font-bold transition shadow-sm shadow-[#FFE01B]/20 font-mono cursor-pointer uppercase"
            >
              <Plus className="w-4 h-4" />
              <span>New Walk-in Booking</span>
            </button>

            <button
              onClick={() => onNavigateTab('inventory')}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#131313] hover:bg-[#201f1f] text-[#e5e2e1] border border-[#1E293B] rounded text-xs font-semibold transition font-mono cursor-pointer uppercase"
            >
              <Wrench className="w-4 h-4 text-[#FFE01B]" />
              <span>Restock Spare Parts</span>
            </button>

            <button
              onClick={onOpenReport}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#131313] hover:bg-[#201f1f] text-[#e5e2e1] border border-[#1E293B] rounded text-xs font-semibold transition font-mono cursor-pointer uppercase"
            >
              <FileCheck className="w-4 h-4 text-[#FFE01B]" />
              <span>Export Shift Audit</span>
            </button>
          </div>
        </div>

        {/* Right: Live Activity & Critical Low Stock Alert */}
        <div className="space-y-6">
          
          {/* Critical Stock Card */}
          <div className="bg-[#1c1b1b] border border-rose-500/30 rounded p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Critical Restock Needed
                </span>
              </div>
              <span className="text-[10px] font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 font-bold">
                {criticalItems.length} Items
              </span>
            </div>

            <div className="space-y-2.5">
              {criticalItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded bg-[#131313] border border-rose-500/30 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#e5e2e1] font-mono truncate max-w-[180px]">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-mono text-[#cec6ab]">
                      Location: {item.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-rose-400">
                      {item.stock} left
                    </span>
                    <p className="text-[10px] font-mono text-[#cec6ab]">min {item.minThreshold}</p>
                  </div>
                </div>
              ))}
              {criticalItems.length === 0 && (
                <p className="text-xs text-[#cec6ab] font-mono py-2 text-center">Semua suku cadang aman / mencukupi.</p>
              )}
            </div>

            <button
              onClick={() => onNavigateTab('inventory')}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition text-center font-mono shadow-xs cursor-pointer uppercase"
            >
              Open Purchase Order Portal →
            </button>
          </div>

          {/* Recent Bookings Feed */}
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <span className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2 font-mono">
                <Clock className="w-4 h-4 text-[#FFE01B]" />
                Recent Service Schedule
              </span>
              <button
                onClick={() => onNavigateTab('bookings')}
                className="text-[11px] font-mono text-[#FFE01B] hover:underline font-semibold cursor-pointer"
              >
                View {liveBookings.length} Active
              </button>
            </div>

            <div className="space-y-2.5">
              {liveBookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded bg-[#131313] border border-[#1E293B] flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-white font-mono">{b.customerName}</p>
                    <p className="text-[11px] text-[#cec6ab]">{b.bikeModel} • {b.time}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      b.status === 'IN_SERVICE'
                        ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30'
                        : 'bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
              {liveBookings.length === 0 && (
                <p className="text-xs text-[#cec6ab] font-mono py-2 text-center">Belum ada booking aktif.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

