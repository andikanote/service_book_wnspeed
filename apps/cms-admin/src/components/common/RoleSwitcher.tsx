import React from 'react';
import { AppRole } from '../../types';
import { Gauge, ShieldCheck, ArrowRightLeft } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: AppRole;
  onChangeRole: (role: AppRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onChangeRole }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center bg-white/95 backdrop-blur-md border border-slate-300 p-1.5 rounded-xl shadow-xl">
      <div className="flex items-center gap-1.5 text-xs font-mono mr-2 px-2.5 py-1 text-slate-500 border-r border-slate-200 hidden sm:flex">
        <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
        <span>PORTAL VIEW:</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChangeRole('admin')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            currentRole === 'admin'
              ? 'bg-indigo-600 text-white shadow-xs font-mono'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-mono'
          }`}
          title="Switch to ART N SPEED Workshop CMS (Admin Dashboard)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ART N SPEED (Admin CMS)</span>
        </button>

        <button
          onClick={() => onChangeRole('racer')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            currentRole === 'racer'
              ? 'bg-indigo-600 text-white shadow-xs font-mono'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-mono'
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

