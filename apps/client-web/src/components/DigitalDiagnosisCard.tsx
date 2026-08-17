import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  ChevronDown, 
  Wrench, 
  Award, 
  Activity, 
  Zap, 
  Sparkles,
  Sliders,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { VEHICLE_DATA, MECHANICAL_SYMPTOMS } from '../data/workshopData';

interface DigitalDiagnosisCardProps {
  onAnalyze: (brand: string, model: string, symptoms: string[]) => void;
  onSelectServicePackage?: (pkgId: string) => void;
}

export const DigitalDiagnosisCard: React.FC<DigitalDiagnosisCardProps> = ({
  onAnalyze,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('YAMAHA');
  const [selectedModel, setSelectedModel] = useState<string>('NMAX 155 Connected / Turbo');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['brebet', 'gredeg']);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const brandOptions = ['HONDA', 'YAMAHA', 'VESPA', 'OTHER'];

  const currentBrandModels = VEHICLE_DATA.find((v) => v.brand === selectedBrand)?.models || [];

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const newModels = VEHICLE_DATA.find((v) => v.brand === brand)?.models;
    if (newModels && newModels.length > 0) {
      setSelectedModel(newModels[0].name);
    } else {
      setSelectedModel('');
    }
  };

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onAnalyze(selectedBrand, selectedModel, selectedSymptoms);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Diagnostic Console & Sub-cards (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Main Digital Diagnosis Console */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded-lg p-6 lg:p-7 relative overflow-hidden shadow-2xl">
          
          {/* Ambient high-tech glow background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFE01B]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Status Badge */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFE01B] animate-pulse"></span>
              <span className="text-[10px] font-bold text-[#cec6ab] uppercase tracking-widest font-mono">
                DIAGNOSTIC ENGINE
              </span>
            </div>
            
            <div className="bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider">
              SYSTEM ACTIVE v2.4
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e5e2e1] font-display tracking-tight mb-2 uppercase">
            Digital Diagnosis System
          </h2>
          <p className="text-xs sm:text-sm text-[#cec6ab] leading-relaxed mb-6 max-w-2xl font-sans">
            Every vibration tells a story. Use our expert AI-assisted tool to narrow down your mechanical symptoms before booking.
          </p>

          {/* Section 01: Vehicle Identity */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#cec6ab] uppercase tracking-wider font-mono">
              <span className="text-[#FFE01B]">01.</span>
              <span>VEHICLE IDENTITY</span>
            </div>

            {/* Brand Switcher Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {brandOptions.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrandChange(brand)}
                  className={`py-2.5 px-3 rounded text-xs font-bold tracking-wider transition-all uppercase font-mono cursor-pointer ${
                    selectedBrand === brand
                      ? 'bg-[#FFE01B] text-black shadow-md shadow-[#FFE01B]/20'
                      : 'bg-[#131313] text-[#e5e2e1] border border-[#1E293B] hover:border-[#FFE01B]/40 hover:text-white'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Select Model Dropdown */}
            <div className="relative mt-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#131313] text-[#e5e2e1] border border-[#1E293B] rounded px-3.5 py-3 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#FFE01B] appearance-none cursor-pointer transition-colors"
              >
                <option value="" disabled>Select Model (e.g., NMAX, Aerox, Vario, Vespa Sprint)</option>
                {currentBrandModels.map((m) => (
                  <option key={m.name} value={m.name} className="bg-[#131313] text-[#e5e2e1]">
                    {m.name} • {m.cc} ({m.year})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#cec6ab] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Section 02: System Symptoms */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-[#cec6ab] uppercase tracking-wider font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#FFE01B]">02.</span>
                <span>SYSTEM SYMPTOMS</span>
              </div>
              <span className="text-[11px] text-[#cec6ab]">
                {selectedSymptoms.length} selected
              </span>
            </div>

            {/* Symptoms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MECHANICAL_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`flex items-center gap-3 p-3 rounded text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFE01B]/10 border-[#FFE01B]/50 text-white shadow-sm shadow-[#FFE01B]/10'
                        : 'bg-[#131313] border-[#1E293B] text-[#cec6ab] hover:border-slate-500'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#FFE01B]' : 'bg-slate-600'}`} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <span className="text-xs font-mono font-medium block truncate">
                        {sym.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1E293B]">
            
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.5)]"></span>
              <span className="text-xs font-bold text-[#CCFF00] uppercase tracking-wider font-mono">
                ● ANALYSIS READY
              </span>
            </div>

            {/* Recommended Service CTA Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold font-mono text-xs sm:text-sm px-6 py-3 rounded transition-all shadow-md shadow-[#FFE01B]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer uppercase tracking-wider"
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-black" />
                  <span>Computing Lab SOP...</span>
                </>
              ) : (
                <>
                  <span>View Recommended Service</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Bottom Sub-cards: Precision Engineering & Certified Experts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Precision Engineering */}
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 flex items-start gap-3.5">
            <div className="w-14 h-14 rounded overflow-hidden shrink-0 border border-[#1E293B] bg-black">
              <img
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80"
                alt="Precision Engineering"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider mb-1 font-display">
                Precision Engineering
              </h4>
              <p className="text-[11px] text-[#cec6ab] leading-relaxed font-sans">
                Our lab uses surgical-grade tools to ensure every bolt is torqued to factory specifications.
              </p>
            </div>
          </div>

          {/* Card 2: Certified Experts */}
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 flex items-start gap-3.5">
            <div className="w-14 h-14 rounded overflow-hidden shrink-0 border border-[#1E293B] bg-black">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80"
                alt="Certified Experts"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider mb-1 font-display">
                Certified Experts
              </h4>
              <p className="text-[11px] text-[#cec6ab] leading-relaxed font-sans">
                Mekanik bersertifikat with over 15,000 handled motors across our laboratory branches.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Right Column: Lab Status & Workshop Hero (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Workshop Inspection Visual Card */}
        <div className="relative rounded overflow-hidden border border-[#1E293B] bg-[#0F172A] flex-1 min-h-[440px] flex flex-col justify-end p-5 group shadow-2xl">
          
          {/* Background Image with Dark Vignette */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80"
              alt="We n Speed Mechanical Workshop"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/70 to-transparent"></div>
          </div>

          {/* Workshop Brand Watermark in background */}
          <div className="absolute top-4 right-4 z-10 opacity-90 font-mono">
            <div className="text-right">
              <span className="text-xs font-bold text-[#FFE01B] tracking-wider">
                WE N SPEED
              </span>
              <p className="text-[9px] text-[#cec6ab]">BAY #01 INSPECTION</p>
            </div>
          </div>

          {/* Live Telemetry Tag */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-[#131313]/90 backdrop-blur-md border border-[#1E293B] px-2.5 py-1 rounded text-[10px] text-[#e5e2e1] flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
              <span>LIVE CAM • MARGONDA</span>
            </div>
          </div>

          {/* Bottom Lab Status Box */}
          <div className="relative z-10 bg-[#1c1b1b]/95 backdrop-blur-md border border-[#1E293B] rounded p-4.5 space-y-3 font-mono">
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#e5e2e1] font-display uppercase tracking-wider">
                Lab Status
              </span>
              <span className="bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 text-[10px] font-bold px-2 py-0.5 rounded">
                ONLINE
              </span>
            </div>

            {/* Active Services progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#cec6ab]">Active Services</span>
                <span className="text-white font-bold">12 units</span>
              </div>
              <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#FFE01B] h-full rounded-full w-[78%]"></div>
              </div>
            </div>

            {/* Technician Load */}
            <div className="flex justify-between items-center text-xs pt-1 border-t border-[#1E293B]">
              <span className="text-[#cec6ab]">Technician Load</span>
              <span className="text-[#FFE01B] font-bold bg-[#FFE01B]/10 px-2 py-0.5 rounded border border-[#FFE01B]/30 text-[10px]">
                High (84%)
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
