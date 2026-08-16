import React, { useState } from 'react';
import { Users, Search, Bike, Phone, Mail } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [search, setSearch] = useState('');

  const racers = [
    {
      id: 'racer-01',
      name: 'Aldi Taher Prasetyo',
      racerId: 'AX-9924',
      tier: 'ELITE MEMBER',
      points: 12450,
      phone: '+62 812-8901-7721',
      email: 'aldi.racer99@artnspeed.id',
      bike: 'Yamaha Aerox 155 VVA (B 4992 ELA)',
      totalSpent: 'Rp 14.850.000',
      visits: 12,
      lastVisit: 'Oct 20, 2026',
    },
    {
      id: 'racer-02',
      name: 'Reza Fahlevi',
      racerId: 'AX-8812',
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
      racerId: 'AX-7741',
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
      racerId: 'AX-6502',
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

  const filteredRacers = racers.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.racerId.toLowerCase().includes(search.toLowerCase()) ||
      r.bike.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Racer CRM & Loyalty Database
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer telemetry, loyalty point balances, registered garages, and workshop spend
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search racer ID, name..."
              className="w-full bg-white border border-slate-200 text-xs font-mono rounded-lg pl-9 pr-3 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRacers.map((racer) => (
          <div
            key={racer.id}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 transition space-y-3.5 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-base font-mono">
                  {racer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-mono text-sm">{racer.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-indigo-600 font-bold">ID: {racer.racerId}</span>
                    <span className="text-[10px] font-mono text-slate-400">• {racer.visits} Visits</span>
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  racer.tier === 'ELITE MEMBER'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : racer.tier === 'PRO RACER'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {racer.tier}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 font-mono text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Bike className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate font-semibold text-slate-800">{racer.bike}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{racer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{racer.email}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">LOYALTY POIN</span>
                <span className="text-sm font-black font-mono text-indigo-600">
                  {racer.points.toLocaleString('id-ID')} PTS
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">TOTAL CMS SPEND</span>
                <span className="text-xs font-bold font-mono text-slate-900">{racer.totalSpent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

