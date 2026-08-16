import React from 'react';
import { 
  CheckCircle2, 
  ArrowDown, 
  ArrowRight, 
  Sparkles, 
  Gauge, 
  Sliders, 
  ShieldCheck, 
  Wrench,
  Zap,
  Info
} from 'lucide-react';
import { SERVICE_PACKAGES, ServicePackage } from '../data/workshopData';

interface ServicePackagesProps {
  onSelectPackage: (pkg: ServicePackage) => void;
  onViewAllServices?: () => void;
  selectedPackageId?: string;
}

export const ServicePackages: React.FC<ServicePackagesProps> = ({
  onSelectPackage,
  onViewAllServices,
  selectedPackageId,
}) => {
  return (
    <section className="py-8 space-y-8" id="paket-layanan">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="text-[10px] font-bold text-[#FFE01B] uppercase tracking-widest mb-1 font-mono">
            LAYANAN & SERVICE STANDAR LAB
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e5e2e1] font-display tracking-tight uppercase">
            PAKET SERVICE PILIHAN
          </h2>
          <p className="text-xs sm:text-sm text-[#cec6ab] max-w-2xl mt-1 font-sans">
            Standardized technical protocols designed to restore peak performance to your scooter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onViewAllServices ? (
            <button
              onClick={onViewAllServices}
              className="text-xs font-bold text-[#FFE01B] hover:text-[#ffe241] uppercase tracking-wider flex items-center gap-1.5 hover:underline font-mono cursor-pointer"
            >
              <span>LIHAT SEMUA LAYANAN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#cec6ab] font-mono">
              <span>Scroll to explore</span>
              <ArrowDown className="w-4 h-4 text-[#FFE01B] animate-bounce" />
            </div>
          )}
        </div>
      </div>

      {/* 3 Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {SERVICE_PACKAGES.map((pkg) => {
          const isPopular = pkg.isPopular;
          const isSelected = selectedPackageId === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`relative rounded flex flex-col justify-between transition-all duration-300 ${
                isPopular
                  ? 'bg-[#0F172A] border-t-4 border-t-[#CCFF00] border-x border-b border-[#1E293B] shadow-xl shadow-[#CCFF00]/5 md:-translate-y-1'
                  : 'bg-[#1c1b1b] border border-[#1E293B] hover:border-[#FFE01B]/40'
              } p-6`}
            >
              {/* Popular Flag Badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#CCFF00] text-black text-[10px] font-bold tracking-widest px-3 py-0.5 rounded uppercase shadow-md font-mono">
                  SOP VERIFIED • POPULER
                </div>
              )}

              {/* Package Header */}
              <div className="space-y-4">
                
                {/* Icon & Title */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${
                    isPopular ? 'bg-[#FFE01B] text-black shadow-md shadow-[#FFE01B]/20' : 'bg-[#131313] text-[#FFE01B] border border-[#1E293B]'
                  }`}>
                    {pkg.id === 'paket-regular' && <Gauge className="w-5 h-5" />}
                    {pkg.id === 'regular-plus' && <Sliders className="w-5 h-5" />}
                    {pkg.id === 'full-service' && <ShieldCheck className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#e5e2e1] font-display uppercase tracking-wide">
                      {pkg.name}
                    </h3>
                    <span className="text-[11px] text-[#cec6ab] font-mono">
                      Estimasi durasi {pkg.durationMin} menit
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#cec6ab] leading-relaxed font-sans min-h-[36px]">
                  {pkg.description}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 pt-3 border-t border-[#1E293B]">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#e5e2e1]">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isPopular ? 'text-[#CCFF00]' : 'text-[#22C55E]'
                      }`} />
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Package Price & Action Button */}
              <div className="pt-6 mt-6 border-t border-[#1E293B] space-y-4">
                
                <div>
                  <div className="text-[10px] uppercase text-[#cec6ab] font-bold tracking-wider font-mono">
                    {isPopular ? 'INVESTMENT' : pkg.id === 'full-service' ? 'TOTAL CARE' : 'STARTS FROM'}
                  </div>
                  <div className="text-2xl font-bold text-[#e5e2e1] font-mono tracking-tight mt-0.5">
                    {pkg.priceFormatted}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`w-full py-3 px-4 rounded text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer font-mono ${
                    isPopular
                      ? 'bg-[#FFE01B] hover:bg-[#ffe241] text-black shadow-md shadow-[#FFE01B]/20 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-[#131313] hover:bg-[#201f1f] text-[#e5e2e1] border border-[#1E293B] hover:border-[#FFE01B]/40'
                  }`}
                >
                  <span>{isPopular ? 'Book This Package' : 'Select Package'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
};
