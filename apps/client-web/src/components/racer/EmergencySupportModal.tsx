import React, { useState } from 'react';
import { Truck, MapPin, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencySupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySupportModal: React.FC<EmergencySupportModalProps> = ({ isOpen, onClose }) => {
  const [dispatched, setDispatched] = useState(false);
  const [location, setLocation] = useState('Jl. Margonda Raya KM 4.5, Depok (GPS Locked)');
  const [issue, setIssue] = useState('CVT Belt snapped / Flat tire on highway');

  if (!isOpen) return null;

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatched(true);
    confetti({ particleCount: 30, spread: 60 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#131313]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#e5e2e1] font-display uppercase tracking-wider">
                Emergency Towing & SOS Support
              </h3>
              <p className="text-xs text-rose-400 font-mono">24/7 WE N SPEED Elite Roadside Unit</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#cec6ab] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {dispatched ? (
          <div className="p-6 space-y-4 text-center font-mono">
            <div className="w-14 h-14 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-display uppercase">TOW TRUCK DISPATCHED!</h4>
              <p className="text-xs text-[#cec6ab] mt-0.5 font-sans">
                Rescue Unit #TOW-04 is en route to your GPS coordinate.
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#1E293B] rounded text-left space-y-2 text-xs text-[#cec6ab]">
              <div className="flex justify-between">
                <span className="text-[#cec6ab]">Driver & Mechanic:</span>
                <span className="text-white font-bold">Gunawan (0812-7711-9922)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#cec6ab]">Estimated Arrival:</span>
                <span className="text-[#FFE01B] font-bold">14 Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#cec6ab]">Destination:</span>
                <span className="text-white">Depok Central Workshop</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#cec6ab]">Elite Member Rate:</span>
                <span className="text-[#22C55E] font-bold">FREE (Tier Benefit)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold rounded uppercase text-xs transition shadow-md shadow-[#FFE01B]/20 cursor-pointer tracking-wider"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="p-6 space-y-4 font-mono text-xs text-[#cec6ab]">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded flex items-center gap-2.5 text-amber-300 font-sans">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Elite Member Benefit: 100% Free towing within Jabodetabek & Bandung area.</span>
            </div>

            <div>
              <label className="block text-[#cec6ab] font-semibold mb-1 uppercase">Your Current GPS Location</label>
              <div className="flex items-center gap-2 bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1]">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-[#e5e2e1] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#cec6ab] font-semibold mb-1 uppercase">Breakdown Condition / Emergency Note</label>
              <textarea
                rows={3}
                required
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-[#cec6ab] hover:text-white cursor-pointer uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded uppercase flex items-center gap-2 shadow-xs transition cursor-pointer tracking-wider"
              >
                <Truck className="w-4 h-4" />
                <span>DISPATCH RESCUE TRUCK</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

