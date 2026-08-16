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
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Workshop Service Bookings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer reservation slots, technician assignments, and bay workflow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs rounded-lg transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE BOOKING</span>
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, bike, plate, code..."
            className="w-full bg-slate-50 border border-slate-200 text-xs font-mono rounded-lg pl-9 pr-3 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'CONFIRMED', 'IN_SERVICE', 'PENDING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
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
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
            <p className="text-sm font-mono text-slate-500">No bookings match the selected filters.</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-4.5 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
            >
              {/* Left Info */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-700 shrink-0">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">BAY</span>
                  <span className="text-sm font-black text-indigo-600 font-mono">#{b.bayNumber || '01'}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 font-mono">{b.customerName}</span>
                    <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                      {b.bookingCode}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        b.status === 'CONFIRMED'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : b.status === 'IN_SERVICE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse'
                          : b.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-600 flex flex-wrap items-center gap-x-3.5 gap-y-1">
                    <span className="text-slate-800 font-semibold">{b.bikeModel}</span>
                    <span className="text-slate-500">Plate: {b.plateNumber}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-500" />
                      {b.time}, {b.date}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {b.branch}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    <span className="text-slate-700 font-semibold">Service:</span> {b.serviceName} •{' '}
                    <span className="text-slate-700 font-semibold">Tech:</span> {b.assignedMechanic || 'Chief Bambang'}
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                <div className="text-right mr-3 hidden sm:block">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">EST. REVENUE</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    Rp {b.totalCost.toLocaleString('id-ID')}
                  </span>
                </div>

                {b.status === 'PENDING' && (
                  <button
                    onClick={() => onUpdateBookingStatus(b.id, 'CONFIRMED')}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-mono font-bold rounded-lg transition"
                  >
                    Confirm Bay
                  </button>
                )}

                {b.status === 'CONFIRMED' && (
                  <button
                    onClick={() => onUpdateBookingStatus(b.id, 'IN_SERVICE')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold rounded-lg transition"
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
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-lg transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Job</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBooking(b)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-mono rounded-lg transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-mono text-base">Booking Details ({selectedBooking.bookingCode})</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Racer Name:</span>
                <span className="font-bold text-slate-900">{selectedBooking.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone:</span>
                <span>{selectedBooking.customerPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Vehicle / Motorcycle:</span>
                <span className="text-indigo-600 font-bold">{selectedBooking.bikeModel} ({selectedBooking.plateNumber})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Service Required:</span>
                <span className="font-bold text-slate-900">{selectedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Assigned Mechanic:</span>
                <span>{selectedBooking.assignedMechanic || 'Chief Tuner Bambang'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Branch & Bay:</span>
                <span>{selectedBooking.branch} (Bay #{selectedBooking.bayNumber || 2})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Price:</span>
                <span className="font-bold text-emerald-600 text-sm">Rp {selectedBooking.totalCost.toLocaleString('id-ID')}</span>
              </div>
              {selectedBooking.notes && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  <span className="text-slate-500 block mb-1 font-semibold">Diagnostic Notes:</span>
                  {selectedBooking.notes}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="w-full py-2 bg-indigo-600 text-white font-mono font-bold text-xs rounded-lg uppercase"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Create New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-mono text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                New Workshop Service Booking
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3.5 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    placeholder="e.g. Kevin Sanjaya"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">WhatsApp Phone</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Bike Model</label>
                  <input
                    type="text"
                    required
                    value={formBike}
                    onChange={(e) => setFormBike(e.target.value)}
                    placeholder="e.g. Yamaha Aerox 155"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Plate Number</label>
                  <input
                    type="text"
                    required
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                    placeholder="e.g. B 4992 ELA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Service Package</label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Regular Plus Service">Regular Plus Service (Rp 385.000)</option>
                    <option value="Full CVT Overhaul & Tuning">Full CVT Overhaul & Tuning (Rp 280.000)</option>
                    <option value="Dyno ECU Remap & Optimization">Dyno ECU Remap (Rp 850.000)</option>
                    <option value="Suspension Revalve & Fluid Flush">Suspension Revalve (Rp 550.000)</option>
                    <option value="Big Bore & Porting Polish Kit">Big Bore 183cc Kit (Rp 2.450.000)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Branch Location</label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Depok Branch">Depok Branch (Main Workshop)</option>
                    <option value="Jakarta Selatan">Jakarta Selatan Express Bay</option>
                    <option value="Bandung Branch">Bandung Dyno & Racing Center</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 uppercase font-semibold">Notes / Diagnostic Requests</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Check brake pad squeak, high RPM hiccup"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg uppercase"
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

