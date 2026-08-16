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
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase">SEVERITY: SEDANG</span>;
      default:
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase">SEVERITY: RINGAN</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181A20] border border-[#2D3139] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#111318] text-slate-400 hover:text-white border border-[#2D3139] hover:border-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              AI MECHANICAL LAB REPORT
            </span>
            {getSeverityBadge()}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            {result.primaryIssue}
          </h3>

          <p className="text-xs text-slate-400 font-mono">
            Target: <strong className="text-white">{brand} {model || 'Matic'}</strong> • Gejala Terdeteksi: {symptoms.length} items
          </p>
        </div>

        {/* Health Score & Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Health Score */}
          <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">HEALTH SCORE</span>
            <div className="text-3xl font-bold text-indigo-400 font-mono mt-1">
              {result.healthScore}<span className="text-sm text-slate-400">/100</span>
            </div>
            <div className="w-full bg-[#181A20] h-1.5 rounded-full overflow-hidden mt-2 border border-[#2D3139]">
              <div 
                className={`h-full rounded-full ${result.healthScore < 60 ? 'bg-rose-500' : result.healthScore < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${result.healthScore}%` }}
              />
            </div>
          </div>

          {/* Engine Heat */}
          <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">SIMULATED HEAT</span>
            <div className="text-lg font-bold text-white font-mono">
              {result.telemetrySimulation?.engineHeat || '88° C'}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Sensor ECU #1</span>
          </div>

          {/* Compression & Voltage */}
          <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">EST. DURATION</span>
            <div className="text-lg font-bold text-white font-mono">
              {result.estimatedLaborTime}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Standar SOP Bengkel</span>
          </div>

        </div>

        {/* Root cause analysis */}
        <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>Root Cause / Analisa Lab</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {result.rootCause}
          </p>
        </div>

        {/* Parts to inspect */}
        <div className="space-y-2">
          <span className="text-xs uppercase text-slate-300 font-bold tracking-wider">
            Komponen Rekomendasi Pengecekan:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.partsToInspect.map((part, idx) => (
              <div key={idx} className="bg-[#111318] border border-[#2D3139] rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-medium">{part}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Package Action Card */}
        <div className="bg-[#111318] border border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                RECOMMENDED LAB PACKAGE
              </span>
              <h4 className="text-lg font-bold text-white">
                {recommendedPkg.name}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {recommendedPkg.description}
              </p>
            </div>

            <div className="text-right sm:text-right shrink-0">
              <span className="text-[10px] uppercase text-slate-400 font-bold">HARGA PAKET</span>
              <div className="text-xl font-bold text-indigo-400 font-mono">
                {recommendedPkg.priceFormatted}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#2D3139] flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onBookPackage(recommendedPkg);
              }}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwalkan Paket Ini Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-[#181A20] text-slate-300 hover:text-white text-xs border border-[#2D3139] hover:border-slate-500"
            >
              Tutup
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
