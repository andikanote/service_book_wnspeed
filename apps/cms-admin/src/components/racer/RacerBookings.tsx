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
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-mono">
      <div className="border-b border-[#1E293B] pb-5">
        <div className="flex items-center gap-1.5 text-xs text-[#FFE01B] font-bold uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          <span>GARAGE_OS SERVICE SCHEDULER</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight font-display uppercase">
          Reserve Maintenance Bay
        </h2>
        <p className="text-xs text-[#cec6ab] mt-0.5">
          Book dedicated dyno tuning, CVT overhaul, or regular service at ART N SPEED workshop
        </p>
      </div>

      {booked ? (
        <div className="p-8 bg-[#1c1b1b] border border-[#1E293B] rounded text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-14 h-14 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white font-display uppercase">BOOKING CONFIRMED!</h3>
          <p className="text-xs text-[#cec6ab]">
            Booking Code: <strong className="text-[#FFE01B] font-bold">ANS-9932</strong>
          </p>

          <div className="p-4 bg-[#131313] border border-[#1E293B] rounded text-left text-xs space-y-2 text-[#e5e2e1]">
            <div className="flex justify-between">
              <span className="text-[#cec6ab]">Selected Service:</span>
              <span className="font-bold text-white">{activeService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#cec6ab]">Branch Location:</span>
              <span className="text-[#e5e2e1]">{selectedBranch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#cec6ab]">Date & Slot:</span>
              <span className="text-[#FFE01B] font-bold">{selectedDate}, {selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#cec6ab]">Estimated Cost:</span>
              <span className="font-bold text-[#CCFF00]">Rp {activeService.price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            onClick={() => setBooked(false)}
            className="w-full py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs rounded uppercase transition shadow-md shadow-[#FFE01B]/20 cursor-pointer tracking-wider"
          >
            Create Another Reservation
          </button>
        </div>
      ) : (
        <form onSubmit={handleBook} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Service Selection */}
          <div className="lg:col-span-7 space-y-3">
            <label className="block text-xs uppercase font-bold text-[#e5e2e1] font-display">
              1. Choose Service Package
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {SERVICE_CATALOG.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv.id)}
                  className={`p-4 rounded border cursor-pointer transition flex items-center justify-between ${
                    selectedService === srv.id
                      ? 'border-[#FFE01B] bg-[#FFE01B]/10 shadow-xs'
                      : 'border-[#1E293B] bg-[#1c1b1b] hover:border-[#FFE01B]/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#e5e2e1]">{srv.name}</span>
                      {srv.popular && (
                        <span className="text-[10px] bg-[#FFE01B] text-black font-bold px-2 py-0.5 rounded uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#cec6ab] font-sans">{srv.description}</p>
                    <span className="text-[11px] text-[#cec6ab] block">Est. Duration: {srv.durationMinutes} mins</span>
                  </div>

                  <span className="text-sm font-bold text-[#FFE01B] shrink-0 ml-4">
                    Rp {srv.price.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Branch, Date, Notes & Confirmation */}
          <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 h-fit shadow-xs font-sans">
            <h3 className="text-xs font-bold text-[#e5e2e1] uppercase border-b border-[#1E293B] pb-3 flex items-center gap-2 font-display">
              <Clock className="w-4 h-4 text-[#FFE01B]" />
              2. Slot & Branch Setup
            </h3>

            <div className="font-mono text-xs">
              <label className="block text-[#cec6ab] mb-1 text-xs uppercase font-semibold">Select Workshop Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
              >
                <option value="Depok Branch">Depok Branch (Main Tuning Lab)</option>
                <option value="Jakarta Selatan">Jakarta Selatan Express Bay</option>
                <option value="Bandung Branch">Bandung Dyno & Racing Center</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="block text-[#cec6ab] mb-1 text-xs uppercase font-semibold">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#cec6ab] mb-1 text-xs uppercase font-semibold">Time Slot</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                </select>
              </div>
            </div>

            <div className="font-mono text-xs">
              <label className="block text-[#cec6ab] mb-1 text-xs uppercase font-semibold">Special Instructions / Symptoms</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please check roller weight, front brake pad replacement"
                className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
              />
            </div>

            <div className="pt-2 border-t border-[#1E293B] space-y-3 font-mono">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#cec6ab] uppercase">Total Estimate:</span>
                <span className="text-lg font-bold text-[#FFE01B]">
                  Rp {activeService.price.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs rounded uppercase tracking-wider shadow-md shadow-[#FFE01B]/20 transition cursor-pointer"
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

