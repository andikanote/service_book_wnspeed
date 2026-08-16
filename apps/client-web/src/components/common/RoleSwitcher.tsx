import React from 'react';
import { AppRole } from '../../types';
import { Gauge, ShieldCheck } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: AppRole;
  onChangeRole: (role: AppRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onChangeRole }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center bg-[#1c1b1b]/95 backdrop-blur-md border border-[#1E293B] p-1.5 rounded shadow-2xl">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChangeRole('admin')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
            currentRole === 'admin'
              ? 'bg-[#FFE01B] text-black shadow-md shadow-[#FFE01B]/20 font-mono'
              : 'text-[#cec6ab] hover:text-white hover:bg-[#201f1f] font-mono'
          }`}
          title="Switch to ART N SPEED Workshop CMS (Admin Dashboard)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ART N SPEED (Admin CMS)</span>
        </button>

        <button
          onClick={() => onChangeRole('racer')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
            currentRole === 'racer'
              ? 'bg-[#FFE01B] text-black shadow-md shadow-[#FFE01B]/20 font-mono'
              : 'text-[#cec6ab] hover:text-white hover:bg-[#201f1f] font-mono'
          }`}
          title="Switch to GARAGE_OS Racer Portal"
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>GARAGE_OS (Racer View)</span>
        </button>
      </div>
    </div>
  );
};

