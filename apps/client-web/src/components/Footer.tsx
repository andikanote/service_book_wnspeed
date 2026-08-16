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
    <footer className="border-t border-[#1E293B] bg-[#0e0e0e] text-[#cec6ab] font-sans mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#FFE01B] flex items-center justify-center text-black font-bold text-base shadow-sm shadow-[#FFE01B]/20">
                <Zap className="w-4 h-4 fill-black" />
              </div>
              <div>
                <span className="font-bold text-[#e5e2e1] text-lg tracking-wide block leading-none font-display uppercase">
                  ART N SPEED
                </span>
                <span className="text-[9px] text-[#cec6ab] font-mono tracking-widest uppercase">
                  MECHANICAL LAB
                </span>
              </div>
            </div>

            <p className="text-xs text-[#cec6ab] leading-relaxed max-w-sm font-sans">
              Laboratorium servis dan perawatan presisi spesialis motor matic di Jabodetabek & Bandung. Mengutamakan transparansi data dan SOP mekanik teruji.
            </p>

            {/* Emergency Hotline Box */}
            <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 flex items-center justify-between max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase text-[#cec6ab] tracking-wider block font-bold font-mono">
                    EMERGENCY TOWING & BOOKING
                  </span>
                  <a 
                    href="tel:081329999266" 
                    className="text-sm font-bold text-[#FFE01B] font-mono hover:underline"
                  >
                    0813 2999 9266
                  </a>
                </div>
              </div>
              <a
                href="https://wa.me/6281329999266"
                target="_blank"
                rel="noreferrer"
                className="bg-[#FFE01B] hover:bg-[#ffe241] text-black text-[10px] font-bold px-2.5 py-1.5 rounded transition-colors shadow-sm shadow-[#FFE01B]/20 font-mono uppercase"
              >
                HUBUNGI
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider font-display">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <button onClick={onNavigateToServices} className="hover:text-[#FFE01B] transition-colors cursor-pointer">
                  Paket Regular
                </button>
              </li>
              <li>
                <button onClick={onNavigateToServices} className="hover:text-[#FFE01B] transition-colors text-[#FFE01B] font-semibold cursor-pointer">
                  Regular Plus (CVT + TB)
                </button>
              </li>
              <li>
                <button onClick={onNavigateToServices} className="hover:text-[#FFE01B] transition-colors cursor-pointer">
                  Full Service Total Care
                </button>
              </li>
              <li>
                <button onClick={onNavigateToServices} className="hover:text-[#FFE01B] transition-colors cursor-pointer">
                  Dyno Test & Calibration
                </button>
              </li>
              <li>
                <button onClick={onNavigateToServices} className="hover:text-[#FFE01B] transition-colors cursor-pointer">
                  Digital Injection Flush
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cabang */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider font-display">
              Lokasi Cabang
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#FFE01B] shrink-0" />
                <span>Depok (Margonda Raya)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#FFE01B] shrink-0" />
                <span>Bekasi (Harapan Indah)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#FFE01B] shrink-0" />
                <span>Pamulang Square</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#FFE01B] shrink-0" />
                <span>Cimahi Central (Bandung)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Operating Hours */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider font-display">
              Jam Operasional
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-3 space-y-1">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFE01B]" />
                  <span>Senin - Minggu</span>
                </div>
                <div className="text-[#FFE01B] text-xs font-bold font-mono">
                  08:30 - 18:00 WIB
                </div>
                <div className="text-[10px] text-[#cec6ab] font-sans">
                  Penerimaan motor terakhir pukul 17:00
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#cec6ab] font-mono">
          <div>
            © {new Date().getFullYear()} ART N SPEED MECHANICAL LAB. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">SOP Certified • Precision Standards</span>
            <span className="text-[#FFE01B] font-mono">v2.4 Velocity Precision</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
