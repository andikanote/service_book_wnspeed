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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded max-w-md w-full p-6 space-y-4 shadow-2xl relative">
        
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FFE01B]" />
            <h3 className="text-sm font-bold text-[#e5e2e1] uppercase font-display">
              Notifikasi Lab System
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#cec6ab] hover:text-white hover:bg-[#131313] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded border transition-all ${
                n.isNew
                  ? 'bg-[#131313] border-[#FFE01B]/40'
                  : 'bg-[#131313]/60 border-[#1E293B] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#e5e2e1] font-display">
                  {n.title}
                </span>
                {n.isNew && (
                  <span className="w-2 h-2 rounded-full bg-[#FFE01B] shrink-0" />
                )}
              </div>
              <p className="text-xs text-[#cec6ab] mt-1 leading-relaxed font-sans">
                {n.desc}
              </p>
              <div className="text-[10px] text-[#cec6ab] font-mono mt-2 flex items-center gap-1">
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
          className="w-full bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs py-2.5 rounded uppercase tracking-wider transition-colors shadow-md shadow-[#FFE01B]/20 font-mono cursor-pointer"
        >
          Book Sesi Servis Berdasarkan Pengingat
        </button>

      </div>
    </div>
  );
};
