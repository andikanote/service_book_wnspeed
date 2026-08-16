import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  Activity, 
  Phone, 
  Gauge, 
  Sliders, 
  AlertTriangle,
  Zap,
  Clock,
  Eye,
  Settings,
  Flame,
  Award
} from 'lucide-react';
import { 
  WORKSHOP_STATS, 
  SERVICE_PACKAGES, 
  ServicePackage, 
  ARTICLES_DATA, 
  PARTNERS 
} from '../data/workshopData';
import { ServicePackages } from './ServicePackages';

interface LandingPageProps {
  onBookNow: () => void;
  onSelectPackage: (pkg: ServicePackage) => void;
  onStartDiagnosis: () => void;
  onOpenArticleModal?: (article: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onBookNow,
  onSelectPackage,
  onStartDiagnosis,
  onOpenArticleModal,
}) => {
  // Live Engine Telemetry state for interactive preview
  const [telemetry, setTelemetry] = useState({
    engineHeat: 86,
    compression: 11.4,
    voltage: 12.6,
    isScanning: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        engineHeat: +(85 + Math.random() * 4).toFixed(1),
        compression: +(11.2 + Math.random() * 0.4).toFixed(1),
        voltage: +(12.4 + Math.random() * 0.3).toFixed(1),
        isScanning: false,
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden border border-[#2D3139] bg-[#111318] min-h-[540px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 shadow-2xl">
        
        {/* Background Workshop Imagery with Dark Atmospheric Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80"
            alt="Art N Speed Mechanical Workshop"
            className="w-full h-full object-cover object-center brightness-[0.3] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1115] via-[#0F1115]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent"></div>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl space-y-5 pt-4">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
            <span>PERFORMANCE LABORATORY</span>
          </div>

          {/* Big Typography Header */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.08]">
            Bengkel Spesialis <br />
            <span className="text-indigo-400">
              Motor Matic
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Kami hadir dengan layanan profesional, mekanik berpengalaman, serta penggunaan spare part terbaik untuk menjaga performa motor Anda.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onBookNow}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Booking Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#paket-layanan"
              className="bg-[#181A20] hover:bg-[#1F222A] text-slate-200 border border-[#2D3139] text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all hover:text-white"
            >
              Lihat Layanan
            </a>
          </div>

        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 mt-6 border-t border-[#2D3139]">
          {WORKSHOP_STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* SERVICE PACKAGES SECTION */}
      <ServicePackages
        onSelectPackage={onSelectPackage}
        onViewAllServices={onStartDiagnosis}
      />

      {/* OUR COMMITMENT SECTION: "Kejujuran adalah Spare Part Paling Penting" */}
      <section className="bg-[#181A20] border border-[#2D3139] rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Media Card: Live Diagnostics photo */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#2D3139] min-h-[300px] group shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
              alt="Live Diagnostics Proses Transparan"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-[#181A20]/95 backdrop-blur-md border border-[#2D3139] rounded-xl p-3.5">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                LIVE DIAGNOSTICS
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                Proses Transparan
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                OUR COMMITMENT
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight leading-tight">
                Kejujuran adalah Spare Part Paling Penting
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Di Art N Speed, setiap pengerjaan dilakukan dengan standar yang jelas, terukur, dan bisa dipertanggungjawabkan. Customer bisa melihat langsung semua proses pengerjaan, bertanya langsung ke tim kami, serta mendapatkan penjelasan dengan bahasa yang mudah dipahami.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              
              <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-3.5 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-white block">
                  Edukasi Jelas
                </span>
              </div>

              <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-3.5 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-white block">
                  Tools Pro
                </span>
              </div>

              <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-3.5 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-white block">
                  Garansi Aktif
                </span>
              </div>

            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                onClick={onStartDiagnosis}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Cek Kondisi Motor Sekarang</span>
                <Zap className="w-4 h-4 fill-white" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* DIAGNOSTIC ENGINE V2.4: "Analisa Motor Mandiri" */}
      <section className="bg-[#181A20] border border-[#2D3139] rounded-3xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
        
        {/* Top badge */}
        <div>
          <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">
            DIAGNOSTIC ENGINE V2.4
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight mt-1">
            Analisa Motor Mandiri
          </h2>
        </div>

        {/* Interactive Simulated Terminal Box */}
        <div className="max-w-2xl mx-auto bg-[#111318] border border-[#2D3139] rounded-2xl p-6 sm:p-8 space-y-6 relative">
          
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Settings className="w-6 h-6 animate-spin" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Menginisialisasi Sistem...
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Tunggu sebentar, kami sedang memuat database teknis untuk motor Anda agar diagnosis dapat berjalan akurat.
            </p>
          </div>

          {/* 3 Telemetry Sensors */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            
            <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-3">
              <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider block">ENGINE HEAT</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-indigo-400">
                {telemetry.engineHeat}° C
              </span>
            </div>

            <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-3">
              <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider block">COMPRESSION</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-indigo-400">
                {telemetry.compression} PSI
              </span>
            </div>

            <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-3">
              <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider block">VOLTAGE</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-indigo-400">
                {telemetry.voltage} V
              </span>
            </div>

          </div>

          <button
            onClick={onStartDiagnosis}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20"
          >
            Mulai Diagnosa Kendaraan Anda →
          </button>

        </div>

      </section>

      {/* SPEED JOURNAL / BERITA TERBARU */}
      <section className="space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#2D3139] pb-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              SPEED JOURNAL
            </span>
            <h2 className="text-3xl font-bold text-white font-display tracking-tight uppercase">
              Berita Terbaru
            </h2>
          </div>

          <button
            onClick={() => alert('Semua artikel edukasi & tips teknis telah dimuat.')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1 hover:underline"
          >
            <span>READ MORE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES_DATA.map((article) => (
            <div
              key={article.id}
              onClick={() => onOpenArticleModal && onOpenArticleModal(article)}
              className="bg-[#181A20] border border-[#2D3139] rounded-2xl overflow-hidden hover:border-slate-500 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-85"
                  />
                  <div className="absolute top-3 left-3 bg-[#111318]/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] text-indigo-400 font-bold border border-[#2D3139]">
                    {article.category} • {article.date}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-indigo-400 font-medium">
                <span className="text-slate-500 text-[10px]">{article.readTime}</span>
                <span className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Baca Selengkapnya →
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* PARTNER LOGOS BAR */}
      <section className="border-t border-b border-[#2D3139] py-6">
        <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest mb-4 font-bold">
          OFFICIAL PERFORMANCE & LAB PARTNERS
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
          {PARTNERS.map((p, idx) => (
            <div key={idx} className="text-center group">
              <span className="font-display font-bold text-base text-slate-300 group-hover:text-indigo-400 transition-colors">
                {p.name}
              </span>
              <span className="block text-[9px] text-slate-500">
                {p.type}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
