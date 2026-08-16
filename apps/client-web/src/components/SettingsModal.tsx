import React, { useState } from 'react';
import { X, Settings, ShieldCheck, MapPin, Bell, Moon, Sun, Save } from 'lucide-react';
import { BRANCH_LOCATIONS } from '../data/workshopData';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [preferredBranch, setPreferredBranch] = useState<string>('depok');
  const [telemetryAlerts, setTelemetryAlerts] = useState<boolean>(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        
        <div className="flex items-center justify-between border-b border-[#2D3139] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase">
              Garage & Lab Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#111318] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Preferred Branch */}
          <div className="space-y-1.5">
            <label className="text-slate-300 uppercase tracking-wider block font-bold text-[10px]">
              Default Garage Branch
            </label>
            <select
              value={preferredBranch}
              onChange={(e) => setPreferredBranch(e.target.value)}
              className="w-full bg-[#111318] text-white border border-[#2D3139] rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500"
            >
              {BRANCH_LOCATIONS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.address})
                </option>
              ))}
            </select>
          </div>

          {/* Toggle 1: Telemetry */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111318] border border-[#2D3139]">
            <div>
              <span className="text-white font-bold block">Live Telemetry Diagnostics</span>
              <span className="text-[10px] text-slate-400 font-sans">Simulasi sensor OBD & reminder getar CVT</span>
            </div>
            <input
              type="checkbox"
              checked={telemetryAlerts}
              onChange={(e) => setTelemetryAlerts(e.target.checked)}
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Toggle 2: WA Notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111318] border border-[#2D3139]">
            <div>
              <span className="text-white font-bold block">WhatsApp Lab Session Updates</span>
              <span className="text-[10px] text-slate-400 font-sans">Kirim foto inspeksi spare part saat pengerjaan</span>
            </div>
            <input
              type="checkbox"
              checked={whatsappNotifications}
              onChange={(e) => setWhatsappNotifications(e.target.checked)}
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
            />
          </div>

        </div>

        <button
          onClick={handleSave}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
        </button>

      </div>
    </div>
  );
};
