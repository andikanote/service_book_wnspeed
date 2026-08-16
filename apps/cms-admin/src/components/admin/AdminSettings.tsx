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
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Workshop System Settings & Branches
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure workshop operational parameters, branch locations, and system webhooks
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs rounded-lg transition shadow-sm"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'SETTINGS SAVED' : 'SAVE CONFIGURATION'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono text-xs">
        {/* Branch Setup */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            Active Workshop Branches
          </h3>

          <div className="space-y-2.5">
            {[
              { name: 'Depok Central HQ (Main Tuning Lab)', address: 'Jl. Margonda Raya No. 492, Depok', bays: 4, status: 'Active' },
              { name: 'Jakarta Selatan Express Bay', address: 'Jl. Fatmawati No. 88, Jakarta Selatan', bays: 2, status: 'Active' },
              { name: 'Bandung Dyno & Racing Center', address: 'Jl. Buah Batu No. 120, Bandung', bays: 3, status: 'Active' },
            ].map((br, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 text-xs">{br.name}</p>
                  <p className="text-[11px] text-slate-500">{br.address}</p>
                </div>
                <div className="text-right">
                  <span className="text-indigo-600 font-bold block">{br.bays} Bays</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{br.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Thresholds */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-600" />
            Telemetry & Diagnostic Thresholds
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-600 mb-1 uppercase font-semibold">Brake Pad Critical Wear Threshold (%)</label>
              <input
                type="number"
                defaultValue={20}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800 focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 uppercase font-semibold">Oil Service Reminder Interval (KM)</label>
              <input
                type="number"
                defaultValue={2000}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800 focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 uppercase font-semibold">V-Belt Replacement Warning (KM)</label>
              <input
                type="number"
                defaultValue={15000}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800 focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

