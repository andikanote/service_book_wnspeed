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
    <div className="space-y-8 py-4 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="text-[11px] text-[#CCFF00] font-bold tracking-widest uppercase mb-1 flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></span>
            <span>LIVE OBD & SENSOR TELEMETRY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#e5e2e1] font-display tracking-tight uppercase">
            Garage Telemetry & Health Scan
          </h1>
          <p className="text-xs sm:text-sm text-[#cec6ab] mt-1">
            Real-time ECU parameter monitoring for Yamaha NMAX / Honda Vario registered in your garage profile.
          </p>
        </div>

        <button
          onClick={onBookTuneUp}
          className="bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs px-5 py-3 rounded transition-all shadow-md shadow-[#FFE01B]/20 flex items-center gap-2 self-start md:self-auto uppercase tracking-wider cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>Book Dyno Calibration</span>
        </button>
      </div>

      {/* Primary Gauges Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* RPM */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#cec6ab] text-xs font-bold font-mono">
            <span>ENGINE SPEED</span>
            <Gauge className="w-4 h-4 text-[#FFE01B]" />
          </div>
          <div className="text-3xl font-bold text-[#e5e2e1] font-mono mt-2">
            {rpm} <span className="text-xs text-[#FFE01B]">RPM</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden mt-3 border border-[#1E293B]">
            <div className="bg-[#FFE01B] h-full rounded-full transition-all duration-500" style={{ width: `${(rpm / 9000) * 100}%` }} />
          </div>
          <span className="text-[10px] text-[#cec6ab] font-mono mt-2 block">Optimal Idle: 1,500 - 1,700</span>
        </div>

        {/* Engine Temp */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#cec6ab] text-xs font-bold font-mono">
            <span>COOLANT TEMP</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-[#e5e2e1] font-mono mt-2">
            {temp}° <span className="text-xs text-[#cec6ab]">C</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden mt-3 border border-[#1E293B]">
            <div className="bg-[#22C55E] h-full rounded-full transition-all duration-500" style={{ width: `${(temp / 120) * 100}%` }} />
          </div>
          <span className="text-[10px] text-[#22C55E] font-mono mt-2 block">Status: Normal Thermal Zone</span>
        </div>

        {/* Battery Voltage */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#cec6ab] text-xs font-bold font-mono">
            <span>ACCU CHARGING</span>
            <Zap className="w-4 h-4 text-[#CCFF00]" />
          </div>
          <div className="text-3xl font-bold text-[#e5e2e1] font-mono mt-2">
            {voltage} <span className="text-xs text-[#cec6ab]">V</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden mt-3 border border-[#1E293B]">
            <div className="bg-[#CCFF00] h-full rounded-full transition-all duration-500" style={{ width: `${(voltage / 15) * 100}%` }} />
          </div>
          <span className="text-[10px] text-[#cec6ab] font-mono mt-2 block">Stator Alternator Active</span>
        </div>

        {/* Throttle Position */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#cec6ab] text-xs font-bold font-mono">
            <span>TPS VALVE</span>
            <Activity className="w-4 h-4 text-[#00f9fd]" />
          </div>
          <div className="text-3xl font-bold text-[#e5e2e1] font-mono mt-2">
            {throttlePercent}% <span className="text-xs text-[#cec6ab]">OPEN</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden mt-3 border border-[#1E293B]">
            <div className="bg-[#00f9fd] h-full rounded-full transition-all duration-500" style={{ width: `${throttlePercent}%` }} />
          </div>
          <span className="text-[10px] text-[#cec6ab] font-mono mt-2 block">Linear Response Calibrated</span>
        </div>

      </div>

      {/* Diagnostics Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CVT Health & Transmission */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#e5e2e1] uppercase flex items-center gap-2 font-display">
              <Cpu className="w-4 h-4 text-[#FFE01B]" />
              <span>Transmisi CVT Telemetry</span>
            </h3>
            <span className="text-xs font-mono text-[#FFE01B] font-bold bg-[#FFE01B]/10 border border-[#FFE01B]/30 px-2 py-0.5 rounded">
              GRADE A-
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[#e5e2e1] mb-1">
                <span>V-Belt Stretch & Wear</span>
                <span className="text-[#e5e2e1] font-mono">{vbeltWear}% wear (Safe)</span>
              </div>
              <div className="w-full bg-[#0e0e0e] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                <div className="bg-[#22C55E] h-full rounded-full" style={{ width: `${vbeltWear}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#e5e2e1] mb-1">
                <span>Sliding Roller Weight Balance</span>
                <span className="text-[#e5e2e1] font-mono">11.9g / 12.0g standard</span>
              </div>
              <div className="w-full bg-[#0e0e0e] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                <div className="bg-[#FFE01B] h-full rounded-full" style={{ width: `92%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#e5e2e1] mb-1">
                <span>Mangkok Kampas Ganda Friction</span>
                <span className="text-[#e5e2e1] font-mono">0.02mm runout (Optimal)</span>
              </div>
              <div className="w-full bg-[#0e0e0e] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                <div className="bg-[#22C55E] h-full rounded-full" style={{ width: `96%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Fuel & Emission Health */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#e5e2e1] uppercase flex items-center gap-2 font-display">
              <BarChart3 className="w-4 h-4 text-[#CCFF00]" />
              <span>Fuel Injection & Pressure</span>
            </h3>
            <span className="text-xs font-mono text-[#CCFF00] font-bold bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-2 py-0.5 rounded">
              PERFECT
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="bg-[#131313] border border-[#1E293B] p-3 rounded flex justify-between items-center">
              <span className="text-[#cec6ab]">Fuel Pump Pressure</span>
              <span className="text-white font-bold font-mono">294 kPa (2.99 bar)</span>
            </div>
            <div className="bg-[#131313] border border-[#1E293B] p-3 rounded flex justify-between items-center">
              <span className="text-[#cec6ab]">O2 Oxygen Sensor Lambda</span>
              <span className="text-[#CCFF00] font-bold font-mono">λ = 1.01 (Stoichiometric)</span>
            </div>
            <div className="bg-[#131313] border border-[#1E293B] p-3 rounded flex justify-between items-center">
              <span className="text-[#cec6ab]">Jarak Servis Berikutnya</span>
              <span className="text-[#FFE01B] font-bold font-mono">2.450 KM lagi</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
