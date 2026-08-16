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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#131313]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 rounded">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#e5e2e1] font-display uppercase tracking-wider">
                Priority Queue Pass
              </h3>
              <p className="text-xs text-[#FFE01B] font-mono">Skip the General Line</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#cec6ab] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 font-mono text-xs text-[#cec6ab]">
          {activated ? (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase font-display">FAST-TRACK BAY RESERVED</h4>
              <p className="text-[#cec6ab] font-sans">
                Your Priority Pass <span className="text-[#FFE01B] font-bold">#VIP-009</span> has bumped you to the head of the queue at Depok Branch.
              </p>
              <div className="p-3 bg-[#131313] border border-[#1E293B] rounded text-left space-y-1 text-[#cec6ab]">
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Assigned Bay:</span>
                  <span className="text-[#FFE01B] font-bold">Bay #02 (CVT Overhaul Station)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Estimated Wait:</span>
                  <span className="text-[#22C55E] font-bold">0 Minutes (Immediate Ingest)</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold rounded uppercase shadow-md shadow-[#FFE01B]/20 transition cursor-pointer tracking-wider"
              >
                Close & Proceed
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[#cec6ab] leading-relaxed font-sans">
                As an <strong className="text-[#FFE01B]">ELITE MEMBER</strong>, you have access to instantaneous bay slot prioritization without waiting behind standard walk-in queues.
              </p>

              <div className="p-3 bg-[#131313] rounded border border-[#1E293B] space-y-2">
                <div className="flex items-center gap-2 text-[#e5e2e1]">
                  <Zap className="w-4 h-4 text-[#FFE01B]" />
                  <span>Dedicated Chief Mechanic allocation</span>
                </div>
                <div className="flex items-center gap-2 text-[#e5e2e1]">
                  <Clock className="w-4 h-4 text-[#22C55E]" />
                  <span>Estimated turnaround expedited by 40%</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button onClick={onClose} className="px-3 py-1.5 text-[#cec6ab] hover:text-white cursor-pointer uppercase">
                  Cancel
                </button>
                <button
                  onClick={handleActivate}
                  className="px-4 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold rounded uppercase shadow-md shadow-[#FFE01B]/20 transition cursor-pointer tracking-wider"
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

