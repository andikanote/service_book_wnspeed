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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D3139] pb-5">
        <div>
          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
            LAYANAN & SERVICE STANDAR LAB
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight uppercase">
            PAKET SERVICE PILIHAN
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Standardized technical protocols designed to restore peak performance to your scooter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onViewAllServices ? (
            <button
              onClick={onViewAllServices}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 hover:underline"
            >
              <span>LIHAT SEMUA LAYANAN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Scroll to explore</span>
              <ArrowDown className="w-4 h-4 text-indigo-400 animate-bounce" />
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
              className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                isPopular
                  ? 'bg-[#181A20] border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02] md:-translate-y-2'
                  : 'bg-[#181A20] border border-[#2D3139] hover:border-slate-500'
              } p-6`}
            >
              {/* Popular Flag Badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold tracking-widest px-4 py-1 rounded-full uppercase shadow-lg shadow-indigo-500/30">
                  PALING POPULER
                </div>
              )}

              {/* Package Header */}
              <div className="space-y-4">
                
                {/* Icon & Title */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isPopular ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {pkg.id === 'paket-regular' && <Gauge className="w-5 h-5" />}
                    {pkg.id === 'regular-plus' && <Sliders className="w-5 h-5" />}
                    {pkg.id === 'full-service' && <ShieldCheck className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">
                      {pkg.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Estimasi durasi {pkg.durationMin} menit
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans min-h-[36px]">
                  {pkg.description}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 pt-3 border-t border-[#2D3139]">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isPopular ? 'text-indigo-400' : 'text-emerald-400'
                      }`} />
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Package Price & Action Button */}
              <div className="pt-6 mt-6 border-t border-[#2D3139] space-y-4">
                
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                    {isPopular ? 'INVESTMENT' : pkg.id === 'full-service' ? 'TOTAL CARE' : 'STARTS FROM'}
                  </div>
                  <div className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    {pkg.priceFormatted}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`w-full py-3 px-4 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-[#111318] hover:bg-slate-800/60 text-slate-200 border border-[#2D3139] hover:border-slate-500'
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
