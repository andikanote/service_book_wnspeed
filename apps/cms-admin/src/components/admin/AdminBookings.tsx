import React, { useState } from 'react';
import { Booking } from '../../types';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  User, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminBookingsProps {
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, newStatus: Booking['status']) => void;
  onAddBooking: (newBooking: Booking) => void;
}

export const AdminBookings: React.FC<AdminBookingsProps> = ({
  bookings,
  onUpdateBookingStatus,
  onAddBooking,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // New Booking Form State
  const [formCustomer, setFormCustomer] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBike, setFormBike] = useState('');
  const [formPlate, setFormPlate] = useState('');
  const [formService, setFormService] = useState('Regular Plus Service');
  const [formBranch, setFormBranch] = useState('Depok Branch');
  const [formDate, setFormDate] = useState('2026-10-26');
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formCost, setFormCost] = useState(385000);
  const [formNotes, setFormNotes] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.bikeModel.toLowerCase().includes(search.toLowerCase()) ||
      b.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newB: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode: `ANS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: formCustomer || 'Guest Racer',
      customerPhone: formPhone || '+62 812-0000-0000',
      bikeModel: formBike || 'Yamaha Aerox 155',
      plateNumber: formPlate || 'B 1234 ABC',
      serviceName: formService,
      serviceType: 'tuneup',
      branch: formBranch,
      date: formDate,
      time: formTime,
      status: 'CONFIRMED',
      bayNumber: 2,
      assignedMechanic: 'Bambang Wijaya',
      totalCost: Number(formCost),
      notes: formNotes,
    };
    onAddBooking(newB);
    setIsModalOpen(false);
    confetti({ particleCount: 35, spread: 50 });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#e5e2e1] tracking-tight flex items-center gap-2 font-display uppercase">
            <Calendar className="w-5 h-5 text-[#FFE01B]" />
            Workshop Service Bookings
          </h2>
          <p className="text-xs text-[#cec6ab] mt-0.5">
            Manage customer reservation slots, technician assignments, and bay workflow
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs rounded transition shadow-md shadow-[#FFE01B]/20 cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE BOOKING</span>
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1c1b1b] border border-[#1E293B] p-3.5 rounded shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 relative font-mono">
          <Search className="w-4 h-4 text-[#cec6ab] absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, bike, plate, code..."
            className="w-full bg-[#131313] border border-[#1E293B] text-xs font-mono rounded pl-9 pr-3 py-1.5 text-[#e5e2e1] placeholder-slate-500 focus:outline-none focus:border-[#FFE01B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto font-mono">
          {['ALL', 'CONFIRMED', 'IN_SERVICE', 'PENDING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition cursor-pointer uppercase ${
                filterStatus === status
                  ? 'bg-[#FFE01B] text-black font-bold shadow-xs'
                  : 'bg-[#131313] text-[#cec6ab] hover:text-white border border-[#1E293B]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-[#1c1b1b] border border-[#1E293B] rounded">
            <p className="text-sm font-mono text-[#cec6ab]">No bookings match the selected filters.</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#1c1b1b] border border-[#1E293B] hover:border-[#FFE01B]/40 rounded p-4.5 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
            >
              {/* Left Info */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded bg-[#131313] border border-[#1E293B] flex flex-col items-center justify-center text-[#e5e2e1] shrink-0 font-mono">
                  <span className="text-[9px] text-[#cec6ab] uppercase font-bold">BAY</span>
                  <span className="text-sm font-black text-[#FFE01B]">#{b.bayNumber || '01'}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{b.customerName}</span>
                    <span className="text-[11px] font-mono text-[#FFE01B] bg-[#FFE01B]/10 px-2 py-0.5 rounded border border-[#FFE01B]/30 font-bold">
                      {b.bookingCode}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        b.status === 'CONFIRMED'
                          ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                          : b.status === 'IN_SERVICE'
                          ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 animate-pulse'
                          : b.status === 'COMPLETED'
                          ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-[#cec6ab] flex flex-wrap items-center gap-x-3.5 gap-y-1">
                    <span className="text-white font-semibold">{b.bikeModel}</span>
                    <span className="text-[#cec6ab]">Plate: {b.plateNumber}</span>
                    <span className="text-[#cec6ab] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FFE01B]" />
                      {b.time}, {b.date}
                    </span>
                    <span className="text-[#cec6ab] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FFE01B]" />
                      {b.branch}
                    </span>
                  </div>

                  <p className="text-xs text-[#cec6ab] font-mono mt-0.5">
                    <span className="text-white font-semibold">Service:</span> {b.serviceName} •{' '}
                    <span className="text-white font-semibold">Tech:</span> {b.assignedMechanic || 'Chief Bambang'}
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 border-[#1E293B] pt-3 lg:pt-0 font-mono">
                <div className="text-right mr-3 hidden sm:block">
                  <span className="text-[10px] font-mono text-[#cec6ab] block uppercase">EST. REVENUE</span>
                  <span className="text-sm font-bold font-mono text-[#FFE01B]">
                    Rp {b.totalCost.toLocaleString('id-ID')}
                  </span>
                </div>

                {b.status === 'PENDING' && (
                  <button
                    onClick={() => onUpdateBookingStatus(b.id, 'CONFIRMED')}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold rounded transition cursor-pointer uppercase"
                  >
                    Confirm Bay
                  </button>
                )}

                {b.status === 'CONFIRMED' && (
                  <button
                    onClick={() => onUpdateBookingStatus(b.id, 'IN_SERVICE')}
                    className="px-3 py-1.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black text-xs font-mono font-bold rounded transition shadow-sm shadow-[#FFE01B]/20 cursor-pointer uppercase"
                  >
                    Start Service
                  </button>
                )}

                {b.status === 'IN_SERVICE' && (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(b.id, 'COMPLETED');
                      confetti({ particleCount: 30, spread: 60 });
                    }}
                    className="px-3 py-1.5 bg-[#22C55E] hover:bg-emerald-600 text-black text-xs font-mono font-bold rounded transition flex items-center gap-1 cursor-pointer uppercase"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Job</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBooking(b)}
                  className="px-3 py-1.5 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] text-[#e5e2e1] text-xs font-mono rounded transition cursor-pointer uppercase"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-lg p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] font-display text-base uppercase">Booking Details ({selectedBooking.bookingCode})</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs text-[#cec6ab]">
              <div className="flex justify-between py-1 border-b border-[#1E293B]">
                <span className="text-[#cec6ab]">Racer Name:</span>
                <span className="font-bold text-white">{selectedBooking.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]">
                <span className="text-[#cec6ab]">Phone:</span>
                <span className="text-white">{selectedBooking.customerPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]">
                <span className="text-[#cec6ab]">Vehicle / Motorcycle:</span>
                <span className="text-[#FFE01B] font-bold">{selectedBooking.bikeModel} ({selectedBooking.plateNumber})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]">
                <span className="text-[#cec6ab]">Service Required:</span>
                <span className="font-bold text-white">{selectedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]">
                <span className="text-[#cec6ab]">Assigned Mechanic:</span>
                <span className="text-white">{selectedBooking.assignedMechanic || 'Chief Tuner Bambang'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]">
                <span className="text-[#cec6ab]">Branch & Bay:</span>
                <span className="text-white">{selectedBooking.branch} (Bay #{selectedBooking.bayNumber || 2})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]">
                <span className="text-[#cec6ab]">Total Price:</span>
                <span className="font-bold text-[#CCFF00] text-sm">Rp {selectedBooking.totalCost.toLocaleString('id-ID')}</span>
              </div>
              {selectedBooking.notes && (
                <div className="p-3 bg-[#131313] rounded border border-[#1E293B] text-[#cec6ab]">
                  <span className="text-[#FFE01B] block mb-1 font-semibold">Diagnostic Notes:</span>
                  {selectedBooking.notes}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="w-full py-2.5 bg-[#FFE01B] text-black font-mono font-bold text-xs rounded uppercase tracking-wider cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Create New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-xl p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] font-display text-base flex items-center gap-2 uppercase">
                <Plus className="w-5 h-5 text-[#FFE01B]" />
                New Workshop Service Booking
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3.5 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    placeholder="e.g. Kevin Sanjaya"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">WhatsApp Phone</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Bike Model</label>
                  <input
                    type="text"
                    required
                    value={formBike}
                    onChange={(e) => setFormBike(e.target.value)}
                    placeholder="e.g. Yamaha Aerox 155"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Plate Number</label>
                  <input
                    type="text"
                    required
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                    placeholder="e.g. B 4992 ELA"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Service Package</label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  >
                    <option value="Regular Plus Service">Regular Plus Service (Rp 385.000)</option>
                    <option value="Full CVT Overhaul & Tuning">Full CVT Overhaul & Tuning (Rp 280.000)</option>
                    <option value="Dyno ECU Remap & Optimization">Dyno ECU Remap (Rp 850.000)</option>
                    <option value="Suspension Revalve & Fluid Flush">Suspension Revalve (Rp 550.000)</option>
                    <option value="Big Bore & Porting Polish Kit">Big Bore 183cc Kit (Rp 2.450.000)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Branch Location</label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  >
                    <option value="Depok Branch">Depok Branch (Main Workshop)</option>
                    <option value="Jakarta Selatan">Jakarta Selatan Express Bay</option>
                    <option value="Bandung Branch">Bandung Dyno & Racing Center</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Notes / Diagnostic Requests</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Check brake pad squeak, high RPM hiccup"
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FFE01B] text-black font-bold rounded uppercase tracking-wider cursor-pointer"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

