import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Gauge, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { DiagnosisResult } from '../services/aiDiagnosis';
import { SERVICE_PACKAGES, ServicePackage } from '../data/workshopData';

interface DiagnosisResultModalProps {
  result: DiagnosisResult | null;
  brand: string;
  model: string;
  symptoms: string[];
  onClose: () => void;
  onBookPackage: (pkg: ServicePackage) => void;
}

export const DiagnosisResultModal: React.FC<DiagnosisResultModalProps> = ({
  result,
  brand,
  model,
  symptoms,
  onClose,
  onBookPackage,
}) => {
  if (!result) return null;

  const recommendedPkg = SERVICE_PACKAGES.find(
    (p) => p.id === result.recommendedPackageId
  ) || SERVICE_PACKAGES[1];

  const getSeverityBadge = () => {
    switch (result.severity) {
      case 'Kritis':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase">SEVERITY: KRITIS</span>;
      case 'Sedang':
        return <span className="bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase">SEVERITY: SEDANG</span>;
      default:
        return <span className="bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase">SEVERITY: RINGAN</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded bg-[#131313] text-[#cec6ab] hover:text-white border border-[#1E293B] hover:border-[#FFE01B]/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#FFE01B] uppercase tracking-wider font-mono">
              AI MECHANICAL LAB REPORT
            </span>
            {getSeverityBadge()}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#e5e2e1] font-display uppercase">
            {result.primaryIssue}
          </h3>

          <p className="text-xs text-[#cec6ab] font-mono">
            Target: <strong className="text-white">{brand} {model || 'Matic'}</strong> • Gejala Terdeteksi: {symptoms.length} items
          </p>
        </div>

        {/* Health Score & Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          
          {/* Health Score */}
          <div className="bg-[#131313] border border-[#1E293B] rounded p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-[#cec6ab]">HEALTH SCORE</span>
            <div className="text-3xl font-bold text-[#FFE01B] tracking-tight mt-1">
              {result.healthScore}<span className="text-sm text-[#cec6ab]">/100</span>
            </div>
            <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden mt-2 border border-[#1E293B]">
              <div 
                className={`h-full rounded-full ${result.healthScore < 60 ? 'bg-rose-500' : result.healthScore < 80 ? 'bg-[#FFE01B]' : 'bg-[#22C55E]'}`}
                style={{ width: `${result.healthScore}%` }}
              />
            </div>
          </div>

          {/* Engine Heat */}
          <div className="bg-[#131313] border border-[#1E293B] rounded p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#cec6ab]">SIMULATED HEAT</span>
            <div className="text-lg font-bold text-[#CCFF00]">
              {result.telemetrySimulation?.engineHeat || '88° C'}
            </div>
            <span className="text-[10px] text-[#cec6ab]">Sensor ECU #1</span>
          </div>

          {/* Compression & Voltage */}
          <div className="bg-[#131313] border border-[#1E293B] rounded p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#cec6ab]">EST. DURATION</span>
            <div className="text-lg font-bold text-white">
              {result.estimatedLaborTime}
            </div>
            <span className="text-[10px] text-[#cec6ab]">Standar SOP Bengkel</span>
          </div>

        </div>

        {/* Root cause analysis */}
        <div className="bg-[#131313] border border-[#1E293B] rounded p-4 space-y-2">
          <div className="text-xs font-bold text-[#FFE01B] uppercase flex items-center gap-1.5 font-mono">
            <Cpu className="w-4 h-4" />
            <span>Root Cause / Analisa Lab</span>
          </div>
          <p className="text-xs text-[#cec6ab] leading-relaxed font-sans">
            {result.rootCause}
          </p>
        </div>

        {/* Parts to inspect */}
        <div className="space-y-2">
          <span className="text-xs uppercase text-[#e5e2e1] font-bold tracking-wider font-mono">
            Komponen Rekomendasi Pengecekan:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.partsToInspect.map((part, idx) => (
              <div key={idx} className="bg-[#131313] border border-[#1E293B] rounded px-3 py-2 text-xs text-[#e5e2e1] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                <span className="font-medium">{part}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Package Action Card */}
        <div className="bg-[#0F172A] border border-[#FFE01B]/40 rounded p-5 space-y-4 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#FFE01B] uppercase tracking-wider font-mono">
                RECOMMENDED LAB PACKAGE
              </span>
              <h4 className="text-lg font-bold text-[#e5e2e1] font-display uppercase">
                {recommendedPkg.name}
              </h4>
              <p className="text-xs text-[#cec6ab] mt-0.5 font-sans">
                {recommendedPkg.description}
              </p>
            </div>

            <div className="text-right sm:text-right shrink-0 font-mono">
              <span className="text-[10px] uppercase text-[#cec6ab] font-bold">HARGA PAKET</span>
              <div className="text-xl font-bold text-[#FFE01B]">
                {recommendedPkg.priceFormatted}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex flex-col sm:flex-row gap-3 font-mono">
            <button
              onClick={() => {
                onClose();
                onBookPackage(recommendedPkg);
              }}
              className="flex-1 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs sm:text-sm py-3 rounded transition-all shadow-md shadow-[#FFE01B]/20 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwalkan Paket Ini Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded bg-[#131313] text-[#cec6ab] hover:text-white text-xs border border-[#1E293B] hover:border-[#FFE01B]/40 cursor-pointer uppercase"
            >
              Tutup
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
