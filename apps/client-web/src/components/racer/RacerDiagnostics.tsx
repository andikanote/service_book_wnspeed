import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Zap, Thermometer, Battery, Disc, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/api';
import confetti from 'canvas-confetti';

const DEFAULT_DIAGNOSTICS = {
  oilHealth: 65,
  vbeltCond: 88,
  brakePads: 15,
  batteryVoltage: 12.8,
  tirePressureFront: 29.5,
  tirePressureRear: 33.0,
  afrRatio: 12.9,
  engineTemp: 86,
  lastUpdated: 'Just Now',
};

export const RacerDiagnostics: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [, setScanComplete] = useState(false);
  const [diagnostics, setDiagnostics] = useState(DEFAULT_DIAGNOSTICS);
  const [rpm] = useState(1650); // Idle RPM

  const fetchLiveDiagnostics = async () => {
    try {
      const bike = await apiClient.get('/racer/bikes/primary');
      if (bike && bike.diagnostics) {
        setDiagnostics({
          oilHealth: Number(bike.diagnostics.oilHealth || 100),
          vbeltCond: Number(bike.diagnostics.vbeltCond || 100),
          brakePads: Number(bike.diagnostics.brakePads || 100),
          batteryVoltage: Number(bike.diagnostics.batteryVoltage || 12.8),
          tirePressureFront: Number(bike.diagnostics.tirePressureFront || 29.5),
          tirePressureRear: Number(bike.diagnostics.tirePressureRear || 33.0),
          afrRatio: Number(bike.diagnostics.afrRatio || 12.9),
          engineTemp: Number(bike.diagnostics.engineTemp || 85),
          lastUpdated: bike.diagnostics.lastUpdated || 'Just Now',
        });
      }
    } catch (e) {
      console.warn('Could not load primary bike diagnostics:', e);
    }
  };

  useEffect(() => {
    fetchLiveDiagnostics();
  }, []);

  const handleRunScan = async () => {
    setScanning(true);
    setScanComplete(false);
    await fetchLiveDiagnostics();
    setScanning(false);
    setScanComplete(true);
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#FFE01B] font-bold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>ECU TELEMETRY & LIVE OBD-II SCANNER</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display uppercase">
            System Diagnostics & Sensors
          </h2>
          <p className="text-xs text-[#cec6ab] mt-0.5">
            Real-time sensor feed from aRacer Super X Standalone ECU • ID: AX-9924
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs rounded transition shadow-md shadow-[#FFE01B]/20 disabled:opacity-50 uppercase tracking-wider cursor-pointer font-mono"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'SCANNING CAN-BUS...' : 'RUN FULL DIAGNOSTIC SCAN'}</span>
        </button>
      </div>

      {/* Main Diagnostic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* RPM Gauge */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-[#cec6ab] text-xs uppercase">
            <span>ENGINE IDLE RPM</span>
            <Activity className="w-4 h-4 text-[#FFE01B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white">{rpm}</span>
            <span className="text-xs text-[#cec6ab]">RPM</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
            <div className="bg-[#FFE01B] h-full rounded-full w-[25%]"></div>
          </div>
          <span className="text-[10px] text-[#22C55E] font-semibold block">Idle Stable (Target: 1,650 ± 50)</span>
        </div>

        {/* AFR Ratio */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-[#cec6ab] text-xs uppercase">
            <span>AIR/FUEL RATIO (AFR)</span>
            <Zap className="w-4 h-4 text-[#CCFF00]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#CCFF00]">{diagnostics.afrRatio}</span>
            <span className="text-xs text-[#cec6ab]">:1</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
            <div className="bg-[#CCFF00] h-full rounded-full w-[65%]"></div>
          </div>
          <span className="text-[10px] text-[#CCFF00] font-semibold block">Optimal Racing Stoichiometric</span>
        </div>

        {/* Engine Coolant Temp */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-[#cec6ab] text-xs uppercase">
            <span>ENGINE HEAD TEMP</span>
            <Thermometer className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white">{diagnostics.engineTemp}°</span>
            <span className="text-xs text-[#cec6ab]">CELSIUS</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
            <div className="bg-sky-500 h-full rounded-full w-[55%]"></div>
          </div>
          <span className="text-[10px] text-[#cec6ab] block">Normal Operating Temp (80°-95°)</span>
        </div>

        {/* Battery Voltage */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-[#cec6ab] text-xs uppercase">
            <span>BATTERY VOLTAGE</span>
            <Battery className="w-4 h-4 text-[#FFE01B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white">{diagnostics.batteryVoltage}</span>
            <span className="text-xs text-[#cec6ab]">VOLTS</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
            <div className="bg-[#FFE01B] h-full rounded-full w-[85%]"></div>
          </div>
          <span className="text-[10px] text-[#22C55E] font-semibold block">Lithium Battery Healthy</span>
        </div>

      </div>

      {/* Component Wear Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Oil Health */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#cec6ab] font-semibold uppercase">SYNTHETIC OIL HEALTH</span>
            <span className="text-base font-bold text-[#FFE01B]">{diagnostics.oilHealth}%</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-2 rounded-full overflow-hidden border border-[#1E293B]">
            <div className="bg-[#FFE01B] h-full rounded-full" style={{ width: `${diagnostics.oilHealth}%` }}></div>
          </div>
          <p className="text-xs text-[#cec6ab] leading-relaxed font-sans">
            Motul 300V Ester 10W-40. Viscosity breakdown is low. Recommended change in <strong className="text-white">~1,200 km</strong>.
          </p>
        </div>

        {/* V-Belt Cond */}
        <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#cec6ab] font-semibold uppercase">CVT V-BELT INTEGRITY</span>
            <span className="text-base font-bold text-[#22C55E]">{diagnostics.vbeltCond}%</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-2 rounded-full overflow-hidden border border-[#1E293B]">
            <div className="bg-[#22C55E] h-full rounded-full" style={{ width: `${diagnostics.vbeltCond}%` }}></div>
          </div>
          <p className="text-xs text-[#cec6ab] leading-relaxed font-sans">
            Gates Powerlink Kevlar Belt. Excellent condition. Minimal wear across drive face pulleys.
          </p>
        </div>

        {/* Brake Pads */}
        <div className="bg-[#1c1b1b] border border-rose-500/30 rounded p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-semibold uppercase">BRAKE PADS THICKNESS</span>
            <span className="text-base font-bold text-rose-400">{diagnostics.brakePads}%</span>
          </div>
          <div className="w-full bg-[#0e0e0e] h-2 rounded-full overflow-hidden border border-[#1E293B]">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${diagnostics.brakePads}%` }}></div>
          </div>
          <div className="p-3 bg-[#131313] border border-rose-500/30 rounded space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>CRITICAL WEAR DETECTED</span>
            </div>
            <p className="text-[11px] text-rose-300 leading-relaxed font-sans">
              Pads below 1.5mm safe racing threshold. Immediate replacement scheduled for Oct 25.
            </p>
          </div>
        </div>

      </div>

      {/* OBD Error Code Scanner Result */}
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <span className="text-xs text-[#e5e2e1] font-bold uppercase tracking-wider flex items-center gap-2 font-display">
            <Disc className="w-4 h-4 text-[#FFE01B]" />
            ECU Active Trouble Codes (DTC)
          </span>
          <span className="text-xs text-[#22C55E] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0 Active Fault Codes</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#cec6ab]">
          <div className="p-3 bg-[#131313] rounded border border-[#1E293B] flex items-center justify-between">
            <span>TPS (Throttle Position):</span>
            <span className="text-[#22C55E] font-bold">OK (0.0% Closed)</span>
          </div>
          <div className="p-3 bg-[#131313] rounded border border-[#1E293B] flex items-center justify-between">
            <span>MAP (Manifold Pressure):</span>
            <span className="text-[#22C55E] font-bold">OK (101.3 kPa)</span>
          </div>
          <div className="p-3 bg-[#131313] rounded border border-[#1E293B] flex items-center justify-between">
            <span>O2 Sensor Lambda:</span>
            <span className="text-[#22C55E] font-bold">OK (0.88λ Rich)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

