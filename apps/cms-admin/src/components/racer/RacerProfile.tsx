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
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800 font-mono">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-xs">
            {racer.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{racer.name}</h2>
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {racer.tier}
              </span>
            </div>
            <p className="text-xs text-slate-500">Racer UUID: <span className="text-indigo-600 font-bold">{racer.racerId}</span> • Joined March 2023</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {racer.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {racer.email}</span>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">LOYALTY VAULT</span>
          <span className="text-2xl font-bold text-slate-900">{racer.points.toLocaleString('id-ID')}</span>
          <span className="text-xs text-amber-600 ml-1 font-bold">POIN</span>
        </div>
      </div>

      {/* Garage Motorcycle Specs & Dyno Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Bike Specs */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Bike className="w-4 h-4 text-indigo-600" />
              Primary Registered Race Machine
            </span>
            <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-bold">
              {racer.primaryBike.plate}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{racer.primaryBike.model}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Year: {racer.primaryBike.year} • Odometer: {racer.primaryBike.mileage.toLocaleString('id-ID')} KM</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Engine Build Spec:</span>
              <span className="text-slate-900 font-bold">{racer.primaryBike.engineSpec}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">ECU Calibration:</span>
              <span className="text-indigo-600 font-bold">{racer.primaryBike.ecuMapping}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Exhaust System:</span>
              <span className="text-slate-900">KTC Racing Full Titanium with Carbon Tip</span>
            </div>
          </div>
        </div>

        {/* Dyno Stats Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Dynojet 250i Verified Output
              </span>
              <span className="text-[10px] text-slate-500">Depok Lab</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">PEAK HORSEPOWER</span>
                <p className="text-2xl font-bold text-indigo-700 mt-1">
                  {racer.primaryBike.dynoHp} <span className="text-xs text-slate-500">HP</span>
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">@ 9,800 RPM</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">MAX TORQUE</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {racer.primaryBike.dynoTorque} <span className="text-xs text-slate-500">Nm</span>
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">@ 7,600 RPM</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Tuned with cold air density correction factor STD 1.02. Dyno verified by Chief Tuner Bambang.
          </p>
        </div>

      </div>

      {/* Maintenance History Logbook */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Digital Workshop Maintenance Logbook
          </span>
          <span className="text-xs text-slate-500">{INITIAL_SERVICE_LOGS.length} Certified Records</span>
        </div>

        <div className="divide-y divide-slate-100">
          {INITIAL_SERVICE_LOGS.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{log.serviceName}</span>
                  <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">
                    {log.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {log.date}, 2026 • {log.branch} • Tuner: {log.mechanic}
                </p>
                <p className="text-[11px] text-slate-500 italic">{log.notes}</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-bold text-indigo-700">
                  Rp {log.cost.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => handleDownloadInvoice(log.serviceName)}
                  className="p-1.5 rounded-md bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition"
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

