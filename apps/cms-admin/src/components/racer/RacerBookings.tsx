import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { SERVICE_CATALOG } from '../../data/mockData';
import confetti from 'canvas-confetti';

export const RacerBookings: React.FC = () => {
  const [selectedService, setSelectedService] = useState(SERVICE_CATALOG[0].id);
  const [selectedBranch, setSelectedBranch] = useState('Depok Branch');
  const [selectedDate, setSelectedDate] = useState('2026-10-28');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [booked, setBooked] = useState(false);

  const activeService = SERVICE_CATALOG.find((s) => s.id === selectedService) || SERVICE_CATALOG[0];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    confetti({ particleCount: 40, spread: 60 });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800 font-mono">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          <span>GARAGE_OS SERVICE SCHEDULER</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Reserve Maintenance Bay
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Book dedicated dyno tuning, CVT overhaul, or regular service at ART N SPEED workshop
        </p>
      </div>

      {booked ? (
        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">BOOKING CONFIRMED!</h3>
          <p className="text-xs text-slate-600">
            Booking Code: <strong className="text-indigo-600 font-bold">ANS-9932</strong>
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Service:</span>
              <span className="font-bold text-slate-900">{activeService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Branch Location:</span>
              <span className="text-slate-900">{selectedBranch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Slot:</span>
              <span className="text-indigo-600 font-bold">{selectedDate}, {selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Cost:</span>
              <span className="font-bold text-slate-900">Rp {activeService.price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            onClick={() => setBooked(false)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg uppercase transition shadow-xs"
          >
            Create Another Reservation
          </button>
        </div>
      ) : (
        <form onSubmit={handleBook} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Service Selection */}
          <div className="lg:col-span-7 space-y-3">
            <label className="block text-xs uppercase font-bold text-slate-700">
              1. Choose Service Package
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {SERVICE_CATALOG.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    selectedService === srv.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{srv.name}</span>
                      {srv.popular && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{srv.description}</p>
                    <span className="text-[11px] text-slate-400 block">Est. Duration: {srv.durationMinutes} mins</span>
                  </div>

                  <span className="text-sm font-bold text-indigo-700 shrink-0 ml-4">
                    Rp {srv.price.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Branch, Date, Notes & Confirmation */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4 h-fit shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              2. Slot & Branch Setup
            </h3>

            <div>
              <label className="block text-slate-600 mb-1 text-xs uppercase font-semibold">Select Workshop Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white"
              >
                <option value="Depok Branch">Depok Branch (Main Tuning Lab)</option>
                <option value="Jakarta Selatan">Jakarta Selatan Express Bay</option>
                <option value="Bandung Branch">Bandung Dyno & Racing Center</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 text-xs uppercase font-semibold">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 text-xs uppercase font-semibold">Time Slot</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 text-xs uppercase font-semibold">Special Instructions / Symptoms</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please check roller weight, front brake pad replacement"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500 uppercase">Total Estimate:</span>
                <span className="text-lg font-bold text-indigo-700">
                  Rp {activeService.price.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg uppercase tracking-wider shadow-xs transition"
              >
                Confirm Bay Reservation
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

