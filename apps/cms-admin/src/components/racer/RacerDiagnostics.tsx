import React, { useState } from 'react';
import { Cpu, Activity, Zap, Thermometer, Battery, Disc, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { INITIAL_RACER } from '../../data/mockData';
import confetti from 'canvas-confetti';

export const RacerDiagnostics: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [, setScanComplete] = useState(false);
  const [diagnostics] = useState(INITIAL_RACER.diagnostics);
  const [rpm] = useState(1650); // Idle RPM

  const handleRunScan = () => {
    setScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      confetti({ particleCount: 30, spread: 50 });
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>ECU TELEMETRY & LIVE OBD-II SCANNER</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Diagnostics & Sensors
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time sensor feed from aRacer Super X Standalone ECU • ID: AX-9924
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-xs disabled:opacity-50 uppercase tracking-wider"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'SCANNING CAN-BUS...' : 'RUN FULL DIAGNOSTIC SCAN'}</span>
        </button>
      </div>

      {/* Main Diagnostic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* RPM Gauge */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase">
            <span>ENGINE IDLE RPM</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{rpm}</span>
            <span className="text-xs text-slate-400">RPM</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full w-[25%]"></div>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">Idle Stable (Target: 1,650 ± 50)</span>
        </div>

        {/* AFR Ratio */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase">
            <span>AIR/FUEL RATIO (AFR)</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-700">{diagnostics.afrRatio}</span>
            <span className="text-xs text-slate-400">:1</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[65%]"></div>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">Optimal Racing Stoichiometric</span>
        </div>

        {/* Engine Coolant Temp */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase">
            <span>ENGINE HEAD TEMP</span>
            <Thermometer className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{diagnostics.engineTemp}°</span>
            <span className="text-xs text-slate-400">CELSIUS</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full w-[55%]"></div>
          </div>
          <span className="text-[10px] text-slate-500 block">Normal Operating Temp (80°-95°)</span>
        </div>

        {/* Battery Voltage */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase">
            <span>BATTERY VOLTAGE</span>
            <Battery className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{diagnostics.batteryVoltage}</span>
            <span className="text-xs text-slate-400">VOLTS</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-[85%]"></div>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">Lithium Battery Healthy</span>
        </div>

      </div>

      {/* Component Wear Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Oil Health */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold uppercase">SYNTHETIC OIL HEALTH</span>
            <span className="text-base font-bold text-amber-600">{diagnostics.oilHealth}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${diagnostics.oilHealth}%` }}></div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Motul 300V Ester 10W-40. Viscosity breakdown is low. Recommended change in <strong className="text-slate-900">~1,200 km</strong>.
          </p>
        </div>

        {/* V-Belt Cond */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold uppercase">CVT V-BELT INTEGRITY</span>
            <span className="text-base font-bold text-emerald-600">{diagnostics.vbeltCond}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${diagnostics.vbeltCond}%` }}></div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Gates Powerlink Kevlar Belt. Excellent condition. Minimal wear across drive face pulleys.
          </p>
        </div>

        {/* Brake Pads */}
        <div className="bg-white border border-rose-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-700 font-semibold uppercase">BRAKE PADS THICKNESS</span>
            <span className="text-base font-bold text-rose-600">{diagnostics.brakePads}%</span>
          </div>
          <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${diagnostics.brakePads}%` }}></div>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>CRITICAL WEAR DETECTED</span>
            </div>
            <p className="text-[11px] text-rose-600 leading-relaxed">
              Pads below 1.5mm safe racing threshold. Immediate replacement scheduled for Oct 25.
            </p>
          </div>
        </div>

      </div>

      {/* OBD Error Code Scanner Result */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs text-slate-700 font-bold uppercase tracking-wider flex items-center gap-2">
            <Disc className="w-4 h-4 text-indigo-600" />
            ECU Active Trouble Codes (DTC)
          </span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0 Active Fault Codes</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>TPS (Throttle Position):</span>
            <span className="text-emerald-700 font-bold">OK (0.0% Closed)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>MAP (Manifold Pressure):</span>
            <span className="text-emerald-700 font-bold">OK (101.3 kPa)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>O2 Sensor Lambda:</span>
            <span className="text-emerald-700 font-bold">OK (0.88λ Rich)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

