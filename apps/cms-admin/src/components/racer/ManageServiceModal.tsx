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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                {mode === 'manage' ? 'Manage Upcoming Service' : 'Service Order Details'}
              </h3>
              <p className="text-[11px] text-slate-500">Regular Plus Service • B 4992 ELA</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-slate-700">
          {/* Service checklist breakdown */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-900 uppercase block">
              Scheduled Procedures & Parts:
            </span>
            <ul className="space-y-1 text-[11px]">
              {INITIAL_UPCOMING_SERVICE.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">ASSIGNED TUNER</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{INITIAL_UPCOMING_SERVICE.mechanic}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">ESTIMATED COST</span>
              <span className="font-bold text-indigo-700 mt-0.5 block">Rp {INITIAL_UPCOMING_SERVICE.estimatedCost.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {mode === 'manage' && (
            <form onSubmit={handleUpdate} className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-600 mb-1 uppercase text-[10px] font-semibold">Reschedule Time Slot</label>
                <select
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Oct 25, 10:00 AM">Oct 25, 10:00 AM (Current)</option>
                  <option value="Oct 25, 02:00 PM">Oct 25, 02:00 PM</option>
                  <option value="Oct 26, 09:30 AM">Oct 26, 09:30 AM</option>
                  <option value="Oct 27, 11:00 AM">Oct 27, 11:00 AM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 uppercase text-[10px] font-semibold">Select Workshop Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Depok Branch">Depok Branch (Main HQ)</option>
                  <option value="Jakarta Selatan">Jakarta Selatan Express Bay</option>
                  <option value="Bandung Branch">Bandung Dyno & Racing Center</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-3 py-1.5 text-slate-500 hover:text-slate-800">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg uppercase transition shadow-xs"
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
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg uppercase"
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

