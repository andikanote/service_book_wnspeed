import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Flame, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw,
  Cpu,
  BarChart3
} from 'lucide-react';

interface TelemetryViewProps {
  onBookTuneUp: () => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ onBookTuneUp }) => {
  const [rpm, setRpm] = useState<number>(3850);
  const [speed, setSpeed] = useState<number>(45);
  const [temp, setTemp] = useState<number>(86.5);
  const [voltage, setVoltage] = useState<number>(12.6);
  const [throttlePercent, setThrottlePercent] = useState<number>(32);
  const [vbeltWear, setVbeltWear] = useState<number>(18); // 18% wear

  useEffect(() => {
    const timer = setInterval(() => {
      setRpm(3600 + Math.floor(Math.random() * 800));
      setSpeed(42 + Math.floor(Math.random() * 12));
      setTemp(+(85 + Math.random() * 3).toFixed(1));
      setVoltage(+(12.4 + Math.random() * 0.4).toFixed(1));
      setThrottlePercent(30 + Math.floor(Math.random() * 15));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D3139] pb-5">
        <div>
          <div className="text-[11px] text-indigo-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE OBD & SENSOR TELEMETRY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight uppercase">
            Garage Telemetry & Health Scan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time ECU parameter monitoring for Yamaha NMAX / Honda Vario registered in your garage profile.
          </p>
        </div>

        <button
          onClick={onBookTuneUp}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Zap className="w-4 h-4" />
          <span>Book Dyno Calibration</span>
        </button>
      </div>

      {/* Primary Gauges Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* RPM */}
        <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>ENGINE SPEED</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-2">
            {rpm} <span className="text-xs text-indigo-400">RPM</span>
          </div>
          <div className="w-full bg-[#111318] h-1.5 rounded-full overflow-hidden mt-3 border border-[#2D3139]">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${(rpm / 9000) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-2 block">Optimal Idle: 1,500 - 1,700</span>
        </div>

        {/* Engine Temp */}
        <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>COOLANT TEMP</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-2">
            {temp}° <span className="text-xs text-slate-400">C</span>
          </div>
          <div className="w-full bg-[#111318] h-1.5 rounded-full overflow-hidden mt-3 border border-[#2D3139]">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(temp / 120) * 100}%` }} />
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-2 block">Status: Normal Thermal Zone</span>
        </div>

        {/* Battery Voltage */}
        <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>ACCU CHARGING</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-2">
            {voltage} <span className="text-xs text-slate-400">V</span>
          </div>
          <div className="w-full bg-[#111318] h-1.5 rounded-full overflow-hidden mt-3 border border-[#2D3139]">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${(voltage / 15) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-2 block">Stator Alternator Active</span>
        </div>

        {/* Throttle Position */}
        <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>TPS VALVE</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-2">
            {throttlePercent}% <span className="text-xs text-slate-400">OPEN</span>
          </div>
          <div className="w-full bg-[#111318] h-1.5 rounded-full overflow-hidden mt-3 border border-[#2D3139]">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${throttlePercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-2 block">Linear Response Calibrated</span>
        </div>

      </div>

      {/* Diagnostics Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CVT Health & Transmission */}
        <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Transmisi CVT Telemetry</span>
            </h3>
            <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              GRADE A-
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>V-Belt Stretch & Wear</span>
                <span className="text-white font-mono">{vbeltWear}% wear (Safe)</span>
              </div>
              <div className="w-full bg-[#111318] h-2 rounded-full overflow-hidden border border-[#2D3139]">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${vbeltWear}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Sliding Roller Weight Balance</span>
                <span className="text-white font-mono">11.9g / 12.0g standard</span>
              </div>
              <div className="w-full bg-[#111318] h-2 rounded-full overflow-hidden border border-[#2D3139]">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `92%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Mangkok Kampas Ganda Friction</span>
                <span className="text-white font-mono">0.02mm runout (Optimal)</span>
              </div>
              <div className="w-full bg-[#111318] h-2 rounded-full overflow-hidden border border-[#2D3139]">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `96%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Fuel & Emission Health */}
        <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Fuel Injection & Pressure</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              PERFECT
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-[#111318] border border-[#2D3139] p-3 rounded-lg flex justify-between items-center">
              <span className="text-slate-400">Fuel Pump Pressure</span>
              <span className="text-white font-bold font-mono">294 kPa (2.99 bar)</span>
            </div>
            <div className="bg-[#111318] border border-[#2D3139] p-3 rounded-lg flex justify-between items-center">
              <span className="text-slate-400">O2 Oxygen Sensor Lambda</span>
              <span className="text-emerald-400 font-bold font-mono">λ = 1.01 (Stoichiometric)</span>
            </div>
            <div className="bg-[#111318] border border-[#2D3139] p-3 rounded-lg flex justify-between items-center">
              <span className="text-slate-400">Jarak Servis Berikutnya</span>
              <span className="text-indigo-400 font-bold font-mono">2.450 KM lagi</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
