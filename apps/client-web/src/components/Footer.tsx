import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Mail,
  Zap,
  Instagram,
  Youtube
} from 'lucide-react';

interface FooterProps {
  onNavigateToBooking: () => void;
  onNavigateToServices: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToBooking,
  onNavigateToServices,
}) => {
  return (
    <footer className="border-t border-[#2D3139] bg-[#0B0C0E] text-slate-400 font-sans mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-indigo-500/20">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg tracking-wide block leading-none font-display">
                  ART N SPEED
                </span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
                  MECHANICAL LAB
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Laboratorium servis dan perawatan presisi spesialis motor matic di Jabodetabek & Bandung. Mengutamakan transparansi data dan SOP mekanik teruji.
            </p>

            {/* Emergency Hotline Box */}
            <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-4 flex items-center justify-between max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 tracking-wider block font-bold">
                    EMERGENCY TOWING & BOOKING
                  </span>
                  <a 
                    href="tel:081329999266" 
                    className="text-sm font-bold text-indigo-400 font-mono hover:underline"
                  >
                    0813 2999 9266
                  </a>
                </div>
              </div>
              <a
                href="https://wa.me/6281329999266"
                target="_blank"
                rel="noreferrer"
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors shadow-sm shadow-indigo-500/20"
              >
                HUBUNGI
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onNavigateToServices} className="hover:text-indigo-400 transition-colors">
                  Paket Regular
                </button>
              </li>
              <li>
                <button onClick={onNavigateToServices} className="hover:text-indigo-400 transition-colors text-indigo-400 font-semibold">
                  Regular Plus (CVT + TB)
                </button>
              </li>
              <li>
                <button onClick={onNavigateToServices} className="hover:text-indigo-400 transition-colors">
                  Full Service Total Care
                </button>
              </li>
              <li>
                <button onClick={onNavigateToServices} className="hover:text-indigo-400 transition-colors">
                  Dyno Test & Calibration
                </button>
              </li>
              <li>
                <button onClick={onNavigateToServices} className="hover:text-indigo-400 transition-colors">
                  Digital Injection Flush
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cabang */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Lokasi Cabang
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>Depok (Margonda Raya)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>Bekasi (Harapan Indah)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>Pamulang Square</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>Cimahi Central (Bandung)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Jam Operasional
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-[#181A20] border border-[#2D3139] rounded-lg p-3 space-y-1">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Senin - Minggu</span>
                </div>
                <div className="text-indigo-400 text-xs font-bold font-mono">
                  08:30 - 18:00 WIB
                </div>
                <div className="text-[10px] text-slate-400">
                  Penerimaan motor terakhir pukul 17:00
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#2D3139] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} ART N SPEED MECHANICAL LAB. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">SOP Certified • Precision Standards</span>
            <span className="text-indigo-400 font-mono">v2.4 Production</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
