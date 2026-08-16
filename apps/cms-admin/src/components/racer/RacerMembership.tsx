import React, { useState } from 'react';
import { Star, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RacerMembership: React.FC = () => {
  const [points, setPoints] = useState(12450);
  const [redeemedIds, setRedeemedIds] = useState<number[]>([]);

  const perks = [
    {
      id: 1,
      title: 'Free Dyno Test Session (3 Pulls)',
      pointsCost: 3500,
      category: 'Tuning Lab',
      desc: 'Full horsepower & torque benchmark on our Dynojet 250i dynamometer.',
    },
    {
      id: 2,
      title: '50% Discount on Motul 300V Ester Oil',
      pointsCost: 2000,
      category: 'Fluids & Maintenance',
      desc: 'Applicable for 1 bottle Motul 300V Factory Line 10W-40 racing synthetic oil.',
    },
    {
      id: 3,
      title: 'ART N SPEED Titanium Bolt Dress-up Set',
      pointsCost: 5000,
      category: 'Merch & Hardware',
      desc: 'Grade 5 GR5 Titanium crankcase bolt kit (Gold or Burnt Titanium finish).',
    },
    {
      id: 4,
      title: 'Official ART N SPEED Team Hoodie (Limited)',
      pointsCost: 6500,
      category: 'Apparel',
      desc: 'Heavyweight cotton racing hoodie with embroidered Japanese cyber patch.',
    },
  ];

  const handleRedeem = (perk: (typeof perks)[0]) => {
    if (points >= perk.pointsCost) {
      setPoints(points - perk.pointsCost);
      setRedeemedIds([...redeemedIds, perk.id]);
      confetti({ particleCount: 45, spread: 65 });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>ART N SPEED RACING CLUB</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Elite Membership & Rewards Store
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Redeem loyalty reward points accumulated from workshop tuning, dyno runs, and parts purchases
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">AVAILABLE BALANCE</span>
            <span className="text-2xl font-bold text-slate-900">
              {points.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-amber-600 ml-1 font-bold">POIN</span>
          </div>
          <span className="bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px] px-2.5 py-1 rounded uppercase">
            ELITE TIER
          </span>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perks.map((perk) => {
          const isRedeemed = redeemedIds.includes(perk.id);
          const canAfford = points >= perk.pointsCost;

          return (
            <div
              key={perk.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-indigo-700 uppercase font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {perk.category}
                  </span>
                  <span className="text-xs font-bold text-amber-600">
                    {perk.pointsCost.toLocaleString('id-ID')} PTS
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{perk.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{perk.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                {isRedeemed ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold uppercase">
                    <Check className="w-4 h-4" />
                    <span>CLAIM CODE: VOUCHER-ANS-{perk.id}88</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeem(perk)}
                    disabled={!canAfford}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition shadow-xs"
                  >
                    {canAfford ? `Redeem for ${perk.pointsCost} Pts` : 'Insufficient Points'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

