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
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#FFE01B] font-bold uppercase tracking-wider mb-1">
            <Star className="w-4 h-4 fill-[#FFE01B] text-[#FFE01B]" />
            <span>ART N SPEED RACING CLUB</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display uppercase">
            Elite Membership & Rewards Store
          </h2>
          <p className="text-xs text-[#cec6ab] mt-0.5">
            Redeem loyalty reward points accumulated from workshop tuning, dyno runs, and parts purchases
          </p>
        </div>

        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 flex items-center gap-4 shadow-xs">
          <div>
            <span className="text-[10px] text-[#cec6ab] uppercase tracking-wider block font-semibold">AVAILABLE BALANCE</span>
            <span className="text-2xl font-bold text-white">
              {points.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-[#FFE01B] ml-1 font-bold">POIN</span>
          </div>
          <span className="bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 font-bold text-[10px] px-2.5 py-1 rounded uppercase">
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
              className="bg-[#1c1b1b] border border-[#1E293B] hover:border-[#FFE01B]/40 rounded p-5 flex flex-col justify-between space-y-4 shadow-xs transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#FFE01B] uppercase font-bold bg-[#FFE01B]/10 px-2 py-0.5 rounded border border-[#FFE01B]/30">
                    {perk.category}
                  </span>
                  <span className="text-xs font-bold text-[#CCFF00]">
                    {perk.pointsCost.toLocaleString('id-ID')} PTS
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-2 font-display uppercase">{perk.title}</h3>
                <p className="text-xs text-[#cec6ab] mt-1 leading-relaxed font-sans">{perk.desc}</p>
              </div>

              <div className="pt-3 border-t border-[#1E293B]">
                {isRedeemed ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded text-xs font-bold uppercase">
                    <Check className="w-4 h-4" />
                    <span>CLAIM CODE: VOUCHER-ANS-{perk.id}88</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeem(perk)}
                    disabled={!canAfford}
                    className="w-full py-2 bg-[#FFE01B] hover:bg-[#ffe241] disabled:bg-[#131313] disabled:text-[#cec6ab] disabled:border disabled:border-[#1E293B] text-black font-bold text-xs rounded uppercase tracking-wider transition shadow-md shadow-[#FFE01B]/20 cursor-pointer"
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

