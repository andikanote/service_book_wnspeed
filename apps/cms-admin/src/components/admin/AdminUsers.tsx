import React, { useState, useEffect } from 'react';
import { Users, Search, Bike, Phone, Mail, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/api';

const DEFAULT_RACERS = [
  {
    id: 'racer-01',
    name: 'Aldi Taher Prasetyo',
    racerId: 'WNS-849201',
    tier: 'ELITE MEMBER',
    points: 12450,
    phone: '+62 812-8901-7721',
    email: 'aldi.racer99@wenspeed.my.id',
    bike: 'Yamaha Aerox 155 VVA (B 4992 ELA)',
    totalSpent: 'Rp 14.850.000',
    visits: 12,
    lastVisit: 'Oct 20, 2026',
  },
  {
    id: 'racer-02',
    name: 'Reza Fahlevi',
    racerId: 'WNS-772019',
    tier: 'PRO RACER',
    points: 8200,
    phone: '+62 813-4412-9900',
    email: 'reza.zx25@gmail.com',
    bike: 'Kawasaki Ninja ZX-25R SE (B 3012 SAA)',
    totalSpent: 'Rp 28.400.000',
    visits: 8,
    lastVisit: 'Oct 25, 2026',
  },
  {
    id: 'racer-03',
    name: 'Dimas Setiawan',
    racerId: 'WNS-551092',
    tier: 'PRO RACER',
    points: 5400,
    phone: '+62 878-1200-8341',
    email: 'dimas.cbr@yahoo.com',
    bike: 'Honda CBR250RR SP (B 6211 KTL)',
    totalSpent: 'Rp 11.200.000',
    visits: 6,
    lastVisit: 'Sep 18, 2026',
  },
  {
    id: 'racer-04',
    name: 'Fajar Nugraha',
    racerId: 'WNS-449102',
    tier: 'ROOKIE',
    points: 2150,
    phone: '+62 856-9912-3456',
    email: 'fajar.vespa@gmail.com',
    bike: 'Vespa Sprint 150 i-Get ABS (B 3488 WRE)',
    totalSpent: 'Rp 6.300.000',
    visits: 4,
    lastVisit: 'Aug 14, 2026',
  },
];

export const AdminUsers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [racers, setRacers] = useState<any[]>(DEFAULT_RACERS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRacers = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.get('/racers');
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((r: any) => ({
            id: r.id,
            name: r.user?.name || r.name || 'Racer Member',
            racerId: r.user?.racerUuid || r.racerIdCode || 'WNS-990011',
            tier: r.tier?.replace('_', ' ') || 'ROOKIE',
            points: Number(r.points || 0),
            phone: r.user?.phone || r.phone || '-',
            email: r.user?.email || r.email || '-',
            bike: r.bikes?.[0] ? `${r.bikes[0].brand} ${r.bikes[0].model} (${r.bikes[0].plateNumber})` : 'Yamaha Aerox 155 (B 4992 ELA)',
            totalSpent: `Rp ${Number(r.totalSpent || 0).toLocaleString('id-ID')}`,
            visits: Number(r.visits || 1),
            lastVisit: 'Aug 2026',
          }));
          setRacers(mapped);
        }
      } catch (err) {
        console.warn('Could not load live racers list:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRacers();
  }, []);

  const filteredRacers = racers.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.racerId.toLowerCase().includes(search.toLowerCase()) ||
      r.bike.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#e5e2e1] tracking-tight flex items-center gap-2 font-display uppercase">
            <Users className="w-5 h-5 text-[#FFE01B]" />
            Racer CRM & Loyalty Database
          </h2>
          <p className="text-xs text-[#cec6ab] mt-0.5">
            Track customer telemetry, loyalty point balances, registered garages, and workshop spend
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#cec6ab] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search racer ID, name..."
              className="w-full bg-[#1c1b1b] border border-[#1E293B] text-xs font-mono rounded pl-9 pr-3 py-1.5 text-[#e5e2e1] placeholder-slate-500 focus:outline-none focus:border-[#FFE01B] shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRacers.map((racer) => (
          <div
            key={racer.id}
            className="bg-[#1c1b1b] border border-[#1E293B] hover:border-[#FFE01B]/40 rounded p-5 transition space-y-3.5 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#131313] border border-[#FFE01B]/30 flex items-center justify-center text-[#FFE01B] font-bold text-base font-display">
                  {racer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#e5e2e1] font-display text-sm uppercase">{racer.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-[#FFE01B] font-bold">ID: {racer.racerId}</span>
                    <span className="text-[10px] font-mono text-[#cec6ab]">• {racer.visits} Visits</span>
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  racer.tier === 'ELITE MEMBER'
                    ? 'bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30'
                    : racer.tier === 'PRO RACER'
                    ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30'
                    : 'bg-[#131313] text-[#cec6ab] border border-[#1E293B]'
                }`}
              >
                {racer.tier}
              </span>
            </div>

            <div className="p-3 bg-[#131313] rounded border border-[#1E293B] space-y-1 font-mono text-xs text-[#cec6ab]">
              <div className="flex items-center gap-2">
                <Bike className="w-3.5 h-3.5 text-[#FFE01B] shrink-0" />
                <span className="truncate font-semibold text-white">{racer.bike}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#cec6ab] shrink-0" />
                <span>{racer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#cec6ab] shrink-0" />
                <span>{racer.email}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#1E293B] font-mono">
              <div>
                <span className="text-[10px] font-mono text-[#cec6ab] block uppercase">LOYALTY POIN</span>
                <span className="text-sm font-black font-mono text-[#FFE01B]">
                  {racer.points.toLocaleString('id-ID')} PTS
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#cec6ab] block uppercase">TOTAL CMS SPEND</span>
                <span className="text-xs font-bold font-mono text-[#CCFF00]">{racer.totalSpent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

