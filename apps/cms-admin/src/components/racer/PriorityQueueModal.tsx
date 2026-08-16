import React, { useState } from 'react';
import { Flame, CheckCircle2, Clock, Zap, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PriorityQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriorityQueueModal: React.FC<PriorityQueueModalProps> = ({ isOpen, onClose }) => {
  const [activated, setActivated] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    setActivated(true);
    confetti({ particleCount: 35, spread: 60 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-mono uppercase tracking-wider">
                Priority Queue Pass
              </h3>
              <p className="text-xs text-amber-800 font-mono">Skip the General Line</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 font-mono text-xs text-slate-700">
          {activated ? (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase">FAST-TRACK BAY RESERVED</h4>
              <p className="text-slate-600">
                Your Priority Pass <span className="text-indigo-600 font-bold">#VIP-009</span> has bumped you to the head of the queue at Depok Branch.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-left space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Bay:</span>
                  <span className="text-indigo-700 font-bold">Bay #02 (CVT Overhaul Station)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Wait:</span>
                  <span className="text-emerald-700 font-bold">0 Minutes (Immediate Ingest)</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg uppercase shadow-xs transition"
              >
                Close & Proceed
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                As an <strong className="text-indigo-700">ELITE MEMBER</strong>, you have access to instantaneous bay slot prioritization without waiting behind standard walk-in queues.
              </p>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-800">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Dedicated Chief Mechanic allocation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Estimated turnaround expedited by 40%</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button onClick={onClose} className="px-3 py-1.5 text-slate-500 hover:text-slate-800">
                  Cancel
                </button>
                <button
                  onClick={handleActivate}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg uppercase shadow-xs transition"
                >
                  Activate Priority Queue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

