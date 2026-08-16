import React, { useState } from 'react';
import { Bike, Activity, FileText, Phone, Mail, Download } from 'lucide-react';
import { INITIAL_RACER, INITIAL_SERVICE_LOGS } from '../../data/mockData';

export const RacerProfile: React.FC = () => {
  const [racer] = useState(INITIAL_RACER);

  const handleDownloadInvoice = (logName: string) => {
    const invoiceText = `ART N SPEED PRECISION WORKSHOP\nOfficial Digital Service Receipt\nCustomer: ${racer.name} (${racer.racerId})\nVehicle: ${racer.primaryBike.model} (${racer.primaryBike.plate})\nService: ${logName}\nStatus: PAID & COMPLETED\nWorkshop HQ: Depok Central Lab`;
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_ANS_${logName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-mono">
      {/* Profile Header */}
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded bg-[#131313] border border-[#FFE01B]/40 flex items-center justify-center text-[#FFE01B] font-extrabold text-2xl font-display shadow-md shadow-[#FFE01B]/20">
            {racer.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-display uppercase">{racer.name}</h2>
              <span className="bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {racer.tier}
              </span>
            </div>
            <p className="text-xs text-[#cec6ab]">Racer UUID: <span className="text-[#FFE01B] font-bold">{racer.racerId}</span> • Joined March 2023</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#cec6ab] pt-0.5">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#FFE01B]" /> {racer.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#FFE01B]" /> {racer.email}</span>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right border-t md:border-t-0 border-[#1E293B] pt-3 md:pt-0">
          <span className="text-[10px] text-[#cec6ab] uppercase tracking-wider block font-semibold">LOYALTY VAULT</span>
          <span className="text-2xl font-bold text-white">{racer.points.toLocaleString('id-ID')}</span>
          <span className="text-xs text-[#FFE01B] ml-1 font-bold">POIN</span>
        </div>
      </div>

      {/* Garage Motorcycle Specs & Dyno Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Bike Specs */}
        <div className="lg:col-span-7 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <span className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2 font-display">
              <Bike className="w-4 h-4 text-[#FFE01B]" />
              Primary Registered Race Machine
            </span>
            <span className="text-[11px] text-[#FFE01B] bg-[#FFE01B]/10 px-2 py-0.5 rounded border border-[#FFE01B]/30 font-bold">
              {racer.primaryBike.plate}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white font-display uppercase">{racer.primaryBike.model}</h3>
            <p className="text-xs text-[#cec6ab] mt-0.5">Year: {racer.primaryBike.year} • Odometer: {racer.primaryBike.mileage.toLocaleString('id-ID')} KM</p>
          </div>

          <div className="p-3.5 bg-[#131313] border border-[#1E293B] rounded space-y-2 text-xs text-[#cec6ab]">
            <div className="flex justify-between py-1 border-b border-[#1E293B]">
              <span className="text-[#cec6ab]">Engine Build Spec:</span>
              <span className="text-white font-bold">{racer.primaryBike.engineSpec}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1E293B]">
              <span className="text-[#cec6ab]">ECU Calibration:</span>
              <span className="text-[#FFE01B] font-bold">{racer.primaryBike.ecuMapping}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#cec6ab]">Exhaust System:</span>
              <span className="text-white">KTC Racing Full Titanium with Carbon Tip</span>
            </div>
          </div>
        </div>

        {/* Dyno Stats Card */}
        <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <span className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2 font-display">
                <Activity className="w-4 h-4 text-[#CCFF00]" />
                Dynojet 250i Verified Output
              </span>
              <span className="text-[10px] text-[#cec6ab]">Depok Lab</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 text-center">
              <div className="p-3 bg-[#131313] rounded border border-[#1E293B]">
                <span className="text-[10px] text-[#cec6ab] uppercase font-semibold">PEAK HORSEPOWER</span>
                <p className="text-2xl font-bold text-[#FFE01B] mt-1 font-display">
                  {racer.primaryBike.dynoHp} <span className="text-xs text-[#cec6ab] font-mono">HP</span>
                </p>
                <span className="text-[10px] text-[#22C55E] font-semibold font-mono">@ 9,800 RPM</span>
              </div>
              <div className="p-3 bg-[#131313] rounded border border-[#1E293B]">
                <span className="text-[10px] text-[#cec6ab] uppercase font-semibold">MAX TORQUE</span>
                <p className="text-2xl font-bold text-white mt-1 font-display">
                  {racer.primaryBike.dynoTorque} <span className="text-xs text-[#cec6ab] font-mono">Nm</span>
                </p>
                <span className="text-[10px] text-[#22C55E] font-semibold font-mono">@ 7,600 RPM</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#cec6ab] leading-snug font-sans">
            Tuned with cold air density correction factor STD 1.02. Dyno verified by Chief Tuner Bambang.
          </p>
        </div>

      </div>

      {/* Maintenance History Logbook */}
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <span className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2 font-display">
            <FileText className="w-4 h-4 text-[#FFE01B]" />
            Digital Workshop Maintenance Logbook
          </span>
          <span className="text-xs text-[#cec6ab]">{INITIAL_SERVICE_LOGS.length} Certified Records</span>
        </div>

        <div className="divide-y divide-[#1E293B]">
          {INITIAL_SERVICE_LOGS.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{log.serviceName}</span>
                  <span className="text-[10px] bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] px-2 py-0.5 rounded font-bold uppercase">
                    {log.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#cec6ab]">
                  {log.date}, 2026 • {log.branch} • Tuner: {log.mechanic}
                </p>
                <p className="text-[11px] text-[#cec6ab] italic">{log.notes}</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-bold text-[#FFE01B]">
                  Rp {log.cost.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => handleDownloadInvoice(log.serviceName)}
                  className="p-1.5 rounded bg-[#131313] hover:bg-[#FFE01B] hover:text-black text-[#FFE01B] border border-[#1E293B] transition cursor-pointer"
                  title="Download Digital Invoice"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

