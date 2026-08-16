import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Sparkles, Clock, Calendar } from 'lucide-react';

interface NotificationsModalProps {
  onClose: () => void;
  onNavigateToBooking: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  onClose,
  onNavigateToBooking,
}) => {
  const notifications = [
    {
      id: '1',
      title: 'Pengingat Servis Berkala (2.500 KM)',
      time: '2 jam yang lalu',
      desc: 'Yamaha NMAX (B 4592 KNL) telah mencapai interval penggantian oli mesin & pengecekan berkala CVT.',
      type: 'warning',
      isNew: true,
    },
    {
      id: '2',
      title: 'SOP Kalibrasi Dyno Siap di Cabang Depok',
      time: '1 hari yang lalu',
      desc: 'Bay #01 Margonda kini dilengkapi Dyno Test sensor generasi terbaru untuk analisis torsi motor matic.',
      type: 'info',
      isNew: true,
    },
    {
      id: '3',
      title: 'Diskon 10% Member Elite Diperbarui',
      time: '3 hari yang lalu',
      desc: 'Voucher servis Regular Plus telah dimasukkan ke akun Anda.',
      type: 'success',
      isNew: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
        
        <div className="flex items-center justify-between border-b border-[#2D3139] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase">
              Notifikasi Lab System
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#111318] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-xl border transition-all ${
                n.isNew
                  ? 'bg-[#111318] border-indigo-500/30'
                  : 'bg-[#111318]/60 border-[#2D3139] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">
                  {n.title}
                </span>
                {n.isNew && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                {n.desc}
              </p>
              <div className="text-[10px] text-slate-500 font-mono mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{n.time}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            onClose();
            onNavigateToBooking();
          }}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/20"
        >
          Book Sesi Servis Berdasarkan Pengingat
        </button>

      </div>
    </div>
  );
};
