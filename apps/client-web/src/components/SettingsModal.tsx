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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#FFE01B]" />
            <h3 className="text-sm font-bold text-[#e5e2e1] uppercase font-display">
              Garage & Lab Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#cec6ab] hover:text-white hover:bg-[#131313] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-sans">
          
          {/* Preferred Branch */}
          <div className="space-y-1.5">
            <label className="text-[#cec6ab] uppercase tracking-wider block font-bold text-[10px] font-mono">
              Default Garage Branch
            </label>
            <select
              value={preferredBranch}
              onChange={(e) => setPreferredBranch(e.target.value)}
              className="w-full bg-[#131313] text-[#e5e2e1] border border-[#1E293B] rounded p-2.5 text-xs focus:outline-none focus:border-[#FFE01B] font-mono"
            >
              {BRANCH_LOCATIONS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.address})
                </option>
              ))}
            </select>
          </div>

          {/* Toggle 1: Telemetry */}
          <div className="flex items-center justify-between p-3 rounded bg-[#131313] border border-[#1E293B]">
            <div>
              <span className="text-[#e5e2e1] font-bold block font-display">Live Telemetry Diagnostics</span>
              <span className="text-[10px] text-[#cec6ab] font-sans">Simulasi sensor OBD & reminder getar CVT</span>
            </div>
            <input
              type="checkbox"
              checked={telemetryAlerts}
              onChange={(e) => setTelemetryAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#FFE01B] cursor-pointer"
            />
          </div>

          {/* Toggle 2: WA Notifications */}
          <div className="flex items-center justify-between p-3 rounded bg-[#131313] border border-[#1E293B]">
            <div>
              <span className="text-[#e5e2e1] font-bold block font-display">WhatsApp Lab Session Updates</span>
              <span className="text-[10px] text-[#cec6ab] font-sans">Kirim foto inspeksi spare part saat pengerjaan</span>
            </div>
            <input
              type="checkbox"
              checked={whatsappNotifications}
              onChange={(e) => setWhatsappNotifications(e.target.checked)}
              className="w-4 h-4 accent-[#FFE01B] cursor-pointer"
            />
          </div>

        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs py-2.5 rounded uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#FFE01B]/20 font-mono cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
        </button>

      </div>
    </div>
  );
};
