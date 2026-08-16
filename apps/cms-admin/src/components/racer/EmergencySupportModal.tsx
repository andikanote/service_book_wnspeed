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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-mono uppercase tracking-wider">
                Emergency Towing & SOS Support
              </h3>
              <p className="text-xs text-rose-700 font-mono">24/7 ART N SPEED Elite Roadside Unit</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {dispatched ? (
          <div className="p-6 space-y-4 text-center font-mono">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">TOW TRUCK DISPATCHED!</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Rescue Unit #TOW-04 is en route to your GPS coordinate.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Driver & Mechanic:</span>
                <span className="text-slate-900 font-bold">Gunawan (0812-7711-9922)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Arrival:</span>
                <span className="text-indigo-600 font-bold">14 Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="text-slate-900">Depok Central Workshop</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Elite Member Rate:</span>
                <span className="text-emerald-700 font-bold">FREE (Tier Benefit)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg uppercase text-xs transition shadow-xs"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="p-6 space-y-4 font-mono text-xs text-slate-700">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2.5 text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Elite Member Benefit: 100% Free towing within Jabodetabek & Bandung area.</span>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1 uppercase">Your Current GPS Location</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1 uppercase">Breakdown Condition / Emergency Note</label>
              <textarea
                rows={3}
                required
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg uppercase flex items-center gap-2 shadow-xs transition"
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

