import React, { useState } from 'react';
import { Settings, Save, MapPin, Wrench, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminSettings: React.FC = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    confetti({ particleCount: 25, spread: 45 });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#e5e2e1] tracking-tight flex items-center gap-2 font-display uppercase">
            <Settings className="w-5 h-5 text-[#FFE01B]" />
            Workshop System Settings & Branches
          </h2>
          <p className="text-xs text-[#cec6ab] mt-0.5">
            Configure workshop operational parameters, branch locations, and system webhooks
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs rounded transition shadow-md shadow-[#FFE01B]/20 cursor-pointer uppercase tracking-wider"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'SETTINGS SAVED' : 'SAVE CONFIGURATION'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono text-xs">
        {/* Branch Setup */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-[#e5e2e1] uppercase flex items-center gap-2 font-display">
            <MapPin className="w-4 h-4 text-[#FFE01B]" />
            Active Workshop Branches
          </h3>

          <div className="space-y-2.5">
            {[
              { name: 'Depok Central HQ (Main Tuning Lab)', address: 'Jl. Margonda Raya No. 492, Depok', bays: 4, status: 'Active' },
              { name: 'Jakarta Selatan Express Bay', address: 'Jl. Fatmawati No. 88, Jakarta Selatan', bays: 2, status: 'Active' },
              { name: 'Bandung Dyno & Racing Center', address: 'Jl. Buah Batu No. 120, Bandung', bays: 3, status: 'Active' },
            ].map((br, i) => (
              <div key={i} className="p-3 bg-[#131313] border border-[#1E293B] rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#e5e2e1] text-xs">{br.name}</p>
                  <p className="text-[11px] text-[#cec6ab] font-sans">{br.address}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[#FFE01B] font-bold block">{br.bays} Bays</span>
                  <span className="text-[10px] text-[#22C55E] font-semibold uppercase">{br.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Thresholds */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-[#e5e2e1] uppercase flex items-center gap-2 font-display">
            <Wrench className="w-4 h-4 text-[#FFE01B]" />
            Telemetry & Diagnostic Thresholds
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Brake Pad Critical Wear Threshold (%)</label>
              <input
                type="number"
                defaultValue={20}
                className="w-full bg-[#131313] border border-[#1E293B] p-2 rounded text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Oil Service Reminder Interval (KM)</label>
              <input
                type="number"
                defaultValue={2000}
                className="w-full bg-[#131313] border border-[#1E293B] p-2 rounded text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">V-Belt Replacement Warning (KM)</label>
              <input
                type="number"
                defaultValue={15000}
                className="w-full bg-[#131313] border border-[#1E293B] p-2 rounded text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

