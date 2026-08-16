import React, { useState } from 'react';
import { Wrench, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_UPCOMING_SERVICE } from '../../data/mockData';

interface ManageServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'manage' | 'details';
}

export const ManageServiceModal: React.FC<ManageServiceModalProps> = ({ isOpen, onClose, mode = 'manage' }) => {
  const [scheduleTime, setScheduleTime] = useState('Oct 25, 10:00 AM');
  const [branch, setBranch] = useState('Depok Branch');
  const [updated, setUpdated] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdated(true);
    confetti({ particleCount: 25, spread: 45 });
    setTimeout(() => {
      onClose();
      setUpdated(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-lg overflow-hidden shadow-2xl font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#131313]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 rounded">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#e5e2e1] font-display uppercase tracking-wider">
                {mode === 'manage' ? 'Manage Upcoming Service' : 'Service Order Details'}
              </h3>
              <p className="text-[11px] text-[#cec6ab]">Regular Plus Service • B 4992 ELA</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#cec6ab] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-[#cec6ab]">
          {/* Service checklist breakdown */}
          <div className="p-4 bg-[#131313] border border-[#1E293B] rounded space-y-2">
            <span className="text-[11px] font-bold text-white uppercase block font-display">
              Scheduled Procedures & Parts:
            </span>
            <ul className="space-y-1 text-[11px]">
              {INITIAL_UPCOMING_SERVICE.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[#cec6ab]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#131313] rounded border border-[#1E293B]">
              <span className="text-[#cec6ab] block text-[10px] uppercase font-semibold">ASSIGNED TUNER</span>
              <span className="font-bold text-white mt-0.5 block">{INITIAL_UPCOMING_SERVICE.mechanic}</span>
            </div>
            <div className="p-3 bg-[#131313] rounded border border-[#1E293B]">
              <span className="text-[#cec6ab] block text-[10px] uppercase font-semibold">ESTIMATED COST</span>
              <span className="font-bold text-[#FFE01B] mt-0.5 block">Rp {INITIAL_UPCOMING_SERVICE.estimatedCost.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {mode === 'manage' && (
            <form onSubmit={handleUpdate} className="space-y-3 pt-2 font-mono">
              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase text-[10px] font-semibold">Reschedule Time Slot</label>
                <select
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                >
                  <option value="Oct 25, 10:00 AM">Oct 25, 10:00 AM (Current)</option>
                  <option value="Oct 25, 02:00 PM">Oct 25, 02:00 PM</option>
                  <option value="Oct 26, 09:30 AM">Oct 26, 09:30 AM</option>
                  <option value="Oct 27, 11:00 AM">Oct 27, 11:00 AM</option>
                </select>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase text-[10px] font-semibold">Select Workshop Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                >
                  <option value="Depok Branch">Depok Branch (Main HQ)</option>
                  <option value="Jakarta Selatan">Jakarta Selatan Express Bay</option>
                  <option value="Bandung Branch">Bandung Dyno & Racing Center</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button type="button" onClick={onClose} className="px-3 py-1.5 text-[#cec6ab] hover:text-white cursor-pointer uppercase">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold rounded uppercase transition shadow-md shadow-[#FFE01B]/20 cursor-pointer tracking-wider"
                >
                  {updated ? 'Saved!' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          )}

          {mode === 'details' && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] text-[#e5e2e1] font-bold rounded uppercase cursor-pointer"
              >
                Close Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

