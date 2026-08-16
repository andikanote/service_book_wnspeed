import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  RefreshCw, 
  Bike, 
  AlertTriangle, 
  ChevronRight, 
  Tag, 
  Ban,
  Sunrise,
  Sun,
  Trash2,
  X
} from 'lucide-react';
import { SERVICE_CATALOG } from '../../data/mockData';
import { apiClient } from '../../services/api';
import { MemberBike } from '../../types';
import confetti from 'canvas-confetti';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  isPopular?: boolean;
  description?: string;
}

interface BookingRecord {
  id: string;
  bookingCode: string;
  branch: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  totalCost: number;
  notes?: string;
  service?: {
    id: string;
    name: string;
    category?: string;
  };
  bike?: {
    id: string;
    model: string;
    plateNumber: string;
    brand?: string;
  };
}

// Time Slots Grouped by Sections
const MORNING_SLOTS = [
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
];

const AFTERNOON_SLOTS = [
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
];

const ALL_TIME_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];

export const RacerBookings: React.FC = () => {
  // Services State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // User Bikes State
  const [bikes, setBikes] = useState<MemberBike[]>([]);
  const [selectedBikeId, setSelectedBikeId] = useState<string>('');

  // Form State
  const [selectedBranch, setSelectedBranch] = useState('Branch Bekasi');
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  // Occupied Slots State
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Booking Execution State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<BookingRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active Tab: New Reservation vs History
  const [viewMode, setViewMode] = useState<'NEW_BOOKING' | 'HISTORY'>('NEW_BOOKING');
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // 1. Fetch Services from GET /api/v1/services
  const fetchServices = async () => {
    setIsLoadingServices(true);
    try {
      const data = await apiClient.get('/services');
      if (Array.isArray(data) && data.length > 0) {
        const mapped: ServiceItem[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category || 'Maintenance',
          durationMinutes: Number(item.durationMinutes || 60),
          price: Number(item.price || 0),
          isPopular: Boolean(item.isPopular),
          description: item.description || '',
        }));
        setServices(mapped);
        setSelectedServiceId((prev) => (prev ? prev : mapped[0].id));
      } else {
        const fallback = SERVICE_CATALOG.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          durationMinutes: s.durationMinutes,
          price: s.price,
          isPopular: s.popular,
          description: s.description,
        }));
        setServices(fallback);
        setSelectedServiceId((prev) => (prev ? prev : fallback[0].id));
      }
    } catch (err: any) {
      console.warn('Could not fetch services API, using catalog fallback:', err.message);
      const fallback = SERVICE_CATALOG.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        durationMinutes: s.durationMinutes,
        price: s.price,
        isPopular: s.popular,
        description: s.description,
      }));
      setServices(fallback);
      setSelectedServiceId((prev) => (prev ? prev : fallback[0].id));
    } finally {
      setIsLoadingServices(false);
    }
  };

  // 2. Fetch User Bikes from GET /api/v1/racer/bikes
  const fetchBikes = async () => {
    try {
      const data = await apiClient.get('/racer/bikes');
      if (Array.isArray(data) && data.length > 0) {
        setBikes(data);
        const primary = data.find((b: any) => b.isPrimary) || data[0];
        setSelectedBikeId(primary.id);
      }
    } catch (err: any) {
      console.warn('Could not fetch user bikes:', err.message);
    }
  };

  // 3. Fetch Occupied Slots from GET /api/v1/bookings/occupied-slots
  const fetchOccupiedSlots = useCallback(async () => {
    if (!selectedDate) return;
    setIsLoadingSlots(true);
    try {
      const data = await apiClient.get(
        `/bookings/occupied-slots?date=${selectedDate}&branch=${encodeURIComponent(selectedBranch)}`
      );
      if (Array.isArray(data)) {
        setOccupiedSlots(data);
        if (data.includes(selectedTime)) {
          const available = ALL_TIME_SLOTS.find((s) => !data.includes(s));
          if (available) {
            setSelectedTime(available);
          }
        }
      }
    } catch (err: any) {
      console.warn('Could not fetch occupied slots:', err.message);
      setOccupiedSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [selectedDate, selectedBranch, selectedTime]);

  // 4. Fetch Booking History from GET /api/v1/bookings
  const fetchBookingHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await apiClient.get('/bookings');
      if (Array.isArray(data)) {
        setBookingHistory(data);
      }
    } catch (err: any) {
      console.warn('Could not fetch bookings history:', err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 5. Delete Booking via DELETE /api/v1/bookings/:id
  const handleConfirmDelete = async () => {
    if (!deletingBooking) return;
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await apiClient.delete(`/bookings/${deletingBooking.id}`);
      setBookingHistory((prev) => prev.filter((b) => b.id !== deletingBooking.id));
      setDeletingBooking(null);
      fetchOccupiedSlots();
    } catch (err: any) {
      if (err.message && (err.message.includes('tidak ditemukan') || err.message.includes('404'))) {
        setBookingHistory((prev) => prev.filter((b) => b.id !== deletingBooking.id));
        setDeletingBooking(null);
      } else if (err.message && !err.message.includes('Failed to fetch')) {
        setErrorMessage(err.message);
      } else {
        setBookingHistory((prev) => prev.filter((b) => b.id !== deletingBooking.id));
        setDeletingBooking(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchBikes();
  }, []);

  useEffect(() => {
    fetchOccupiedSlots();
  }, [fetchOccupiedSlots]);

  const activeService =
    services.find((s) => s.id === selectedServiceId) ||
    services[0] || {
      id: 'default',
      name: 'Standard Precision Tune-Up',
      category: 'Engine Tuning',
      durationMinutes: 60,
      price: 250000,
      description: 'Tune up berkala & kalibrasi presisi',
      isPopular: true,
    };

  const activeBike = bikes.find((b) => b.id === selectedBikeId);

  // Submit Booking to POST /api/v1/bookings
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (occupiedSlots.includes(selectedTime)) {
      setErrorMessage(`Slot waktu ${selectedTime} sudah terisi. Silakan pilih slot waktu lain.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      serviceId: activeService.id,
      bikeId: selectedBikeId || undefined,
      branch: selectedBranch,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      totalCost: activeService.price,
      notes: notes.trim() || undefined,
    };

    try {
      const result = await apiClient.post('/bookings', payload);
      setConfirmedBooking(result);
      fetchOccupiedSlots();
      confetti({ particleCount: 50, spread: 70 });
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        setErrorMessage(err.message);
        setIsSubmitting(false);
        return;
      }

      // Offline fallback confirmation
      const fallbackBooking: BookingRecord = {
        id: `book-${Date.now()}`,
        bookingCode: `ANS-${Math.floor(1000 + Math.random() * 9000)}`,
        branch: payload.branch,
        bookingDate: payload.bookingDate,
        bookingTime: payload.bookingTime,
        status: 'PENDING',
        totalCost: payload.totalCost,
        notes: payload.notes,
        service: {
          id: activeService.id,
          name: activeService.name,
          category: activeService.category,
        },
        bike: activeBike ? {
          id: activeBike.id,
          model: activeBike.model,
          plateNumber: activeBike.plateNumber,
          brand: activeBike.brand,
        } : undefined,
      };

      setConfirmedBooking(fallbackBooking);
      setOccupiedSlots((prev) => [...prev, selectedTime]);
      confetti({ particleCount: 50, spread: 70 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#FFE01B] font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>GARAGE_OS SERVICE SCHEDULER</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display uppercase">
            Reserve Maintenance Bay
          </h2>
          <p className="text-xs text-[#cec6ab] mt-0.5">
            Jam Operasional 09:00 - 18:30 WIB • Book dedicated dyno tuning, overhaul, atau service berkala di ART N SPEED
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setViewMode('NEW_BOOKING');
              setConfirmedBooking(null);
            }}
            className={`px-3.5 py-2 rounded text-xs font-bold uppercase transition cursor-pointer ${
              viewMode === 'NEW_BOOKING'
                ? 'bg-[#FFE01B] text-black shadow-md shadow-[#FFE01B]/20'
                : 'bg-[#1c1b1b] text-[#cec6ab] hover:text-white border border-[#1E293B]'
            }`}
          >
            Form Reservasi Baru
          </button>
          <button
            onClick={() => {
              setViewMode('HISTORY');
              fetchBookingHistory();
            }}
            className={`px-3.5 py-2 rounded text-xs font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'HISTORY'
                ? 'bg-[#FFE01B] text-black shadow-md shadow-[#FFE01B]/20'
                : 'bg-[#1c1b1b] text-[#cec6ab] hover:text-white border border-[#1E293B]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Riwayat Reservasi</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded flex items-center justify-between text-rose-400 text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Confirmation View */}
      {confirmedBooking ? (
        <div className="p-8 bg-[#1c1b1b] border border-emerald-500/40 rounded text-center space-y-5 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
              STATUS: RESERVED
            </span>
            <h3 className="text-2xl font-bold text-white font-display uppercase mt-2">
              RESERVASI BERHASIL DIKONFIRMASI!
            </h3>
            <p className="text-xs text-[#cec6ab] mt-1">
              Kode Booking Resmi: <strong className="text-[#FFE01B] font-bold text-sm tracking-wider">{confirmedBooking.bookingCode}</strong>
            </p>
          </div>

          <div className="p-4 bg-[#131313] border border-[#1E293B] rounded text-left text-xs space-y-2.5 text-[#e5e2e1]">
            <div className="flex justify-between border-b border-[#1E293B] pb-2">
              <span className="text-[#cec6ab]">Paket Layanan:</span>
              <span className="font-bold text-white text-right">{confirmedBooking.service?.name || activeService.name}</span>
            </div>
            {confirmedBooking.bike && (
              <div className="flex justify-between border-b border-[#1E293B] pb-2">
                <span className="text-[#cec6ab]">Unit Motor:</span>
                <span className="font-bold text-[#FFE01B]">{confirmedBooking.bike.model} ({confirmedBooking.bike.plateNumber})</span>
              </div>
            )}
            <div className="flex justify-between border-b border-[#1E293B] pb-2">
              <span className="text-[#cec6ab]">Lokasi Cabang:</span>
              <span className="text-[#e5e2e1] font-semibold">{confirmedBooking.branch}</span>
            </div>
            <div className="flex justify-between border-b border-[#1E293B] pb-2">
              <span className="text-[#cec6ab]">Tanggal & Slot Jam:</span>
              <span className="text-[#FFE01B] font-bold">
                {confirmedBooking.bookingDate.split('T')[0]}, {confirmedBooking.bookingTime} WIB
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[#cec6ab]">Estimasi Biaya:</span>
              <span className="font-bold text-[#CCFF00] text-sm">
                Rp {Number(confirmedBooking.totalCost).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setViewMode('NEW_BOOKING');
              }}
              className="flex-1 py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold text-xs rounded uppercase tracking-wider shadow-md shadow-[#FFE01B]/20 cursor-pointer transition"
            >
              Buat Reservasi Baru
            </button>
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setViewMode('HISTORY');
                fetchBookingHistory();
              }}
              className="flex-1 py-2.5 bg-[#131313] hover:bg-[#201f1f] border border-[#1E293B] hover:border-[#FFE01B]/40 text-white font-bold text-xs rounded uppercase tracking-wider transition cursor-pointer"
            >
              Lihat Semua Reservasi
            </button>
          </div>
        </div>
      ) : viewMode === 'HISTORY' ? (
        /* History View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFE01B]" />
              Daftar Reservasi & Riwayat Servis
            </h3>
            <button
              onClick={fetchBookingHistory}
              disabled={isLoadingHistory}
              className="p-1.5 bg-[#1c1b1b] hover:bg-[#252525] border border-[#1E293B] text-[#cec6ab] hover:text-[#FFE01B] rounded cursor-pointer transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin text-[#FFE01B]' : ''}`} />
            </button>
          </div>

          {isLoadingHistory ? (
            <div className="p-12 bg-[#1c1b1b] border border-[#1E293B] rounded text-center space-y-3">
              <Loader2 className="w-6 h-6 text-[#FFE01B] animate-spin mx-auto" />
              <p className="text-xs text-[#cec6ab]">Memuat daftar reservasi dari server...</p>
            </div>
          ) : bookingHistory.length === 0 ? (
            <div className="p-12 bg-[#1c1b1b] border border-[#1E293B] rounded text-center space-y-3">
              <Calendar className="w-8 h-8 text-[#cec6ab] mx-auto opacity-40" />
              <p className="text-xs text-[#cec6ab]">Belum ada riwayat reservasi yang ditemukan.</p>
              <button
                onClick={() => setViewMode('NEW_BOOKING')}
                className="px-4 py-2 bg-[#FFE01B] text-black font-bold text-xs rounded uppercase transition cursor-pointer"
              >
                Buat Reservasi Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookingHistory.map((book) => (
                <div
                  key={book.id}
                  className="bg-[#1c1b1b] border border-[#1E293B] hover:border-[#FFE01B]/40 rounded p-4 space-y-3 transition relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#131313] border border-[#1E293B] text-[10px] font-mono text-[#FFE01B] font-bold">
                        {book.bookingCode}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">{book.service?.name || 'Service Package'}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          book.status === 'CONFIRMED' || book.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : book.status === 'IN_PROGRESS'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {book.status}
                      </span>
                      <button
                        onClick={() => {
                          setErrorMessage(null);
                          setDeletingBooking(book);
                        }}
                        title="Batalkan / Hapus Booking"
                        className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#131313] rounded border border-[#1E293B] space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#cec6ab]">Cabang:</span>
                      <span className="text-white truncate max-w-[200px]">{book.branch}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#cec6ab]">Jadwal:</span>
                      <span className="text-[#FFE01B] font-bold">
                        {book.bookingDate ? book.bookingDate.split('T')[0] : '-'}, {book.bookingTime} WIB
                      </span>
                    </div>
                    {book.bike && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#cec6ab]">Motor:</span>
                        <span className="text-white">{book.bike.model} ({book.bike.plateNumber})</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px] pt-1 border-t border-[#1E293B]">
                      <span className="text-[#cec6ab]">Total Biaya:</span>
                      <span className="text-[#CCFF00] font-bold">Rp {Number(book.totalCost).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* New Reservation Wizard */
        <form onSubmit={handleBookSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Choose Service Package (Dynamic API) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase font-bold text-[#e5e2e1] font-display flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#FFE01B]" />
                1. Choose Service Package
              </label>
              <button
                type="button"
                onClick={fetchServices}
                disabled={isLoadingServices}
                title="Refresh Paket Layanan"
                className="text-[#cec6ab] hover:text-[#FFE01B] text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingServices ? 'animate-spin' : ''}`} />
                <span>Sync API</span>
              </button>
            </div>

            {isLoadingServices ? (
              <div className="p-8 bg-[#1c1b1b] border border-[#1E293B] rounded text-center space-y-2">
                <Loader2 className="w-6 h-6 text-[#FFE01B] animate-spin mx-auto" />
                <p className="text-xs text-[#cec6ab]">Memuat paket layanan dari server...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-4 rounded border cursor-pointer transition flex items-center justify-between ${
                      selectedServiceId === srv.id
                        ? 'border-[#FFE01B] bg-[#FFE01B]/10 shadow-xs'
                        : 'border-[#1E293B] bg-[#1c1b1b] hover:border-[#FFE01B]/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#e5e2e1]">{srv.name}</span>
                        {srv.isPopular && (
                          <span className="text-[10px] bg-[#FFE01B] text-black font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                        <span className="text-[10px] text-[#cec6ab] border border-[#1E293B] px-1.5 py-0.5 rounded uppercase">
                          {srv.category}
                        </span>
                      </div>
                      {srv.description && (
                        <p className="text-xs text-[#cec6ab] font-sans leading-relaxed">{srv.description}</p>
                      )}
                      <span className="text-[11px] text-[#cec6ab] block">
                        Est. Durasi: {srv.durationMinutes} Menit
                      </span>
                    </div>

                    <span className="text-sm font-bold text-[#FFE01B] shrink-0 ml-4 font-mono">
                      Rp {srv.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Bookings Slot & Branch Setup */}
          <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#1E293B] rounded p-5 space-y-4 h-fit shadow-xs font-sans">
            <h3 className="text-xs font-bold text-[#e5e2e1] uppercase border-b border-[#1E293B] pb-3 flex items-center gap-2 font-display">
              <Clock className="w-4 h-4 text-[#FFE01B]" />
              2. Bookings Slot & Branch Setup
            </h3>

            {/* Select Bike */}
            {bikes.length > 0 && (
              <div className="font-mono text-xs">
                <label className="block text-[#cec6ab] mb-1.5 text-xs uppercase font-semibold flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-[#FFE01B]" />
                  <span>Pilih Unit Motor di Garasi</span>
                </label>
                <select
                  value={selectedBikeId}
                  onChange={(e) => setSelectedBikeId(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                >
                  {bikes.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.brand} {b.model} - {b.plateNumber} {b.isPrimary ? '(Utama)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Select Workshop Branch (Only Bekasi Branch) */}
            <div className="font-mono text-xs">
              <label className="block text-[#cec6ab] mb-1.5 text-xs uppercase font-semibold">Select Workshop Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
              >
                <option value="Branch Bekasi">
                  Branch Bekasi (Precision Tuning Center)
                </option>
              </select>
            </div>

            {/* Date Selection */}
            <div className="font-mono text-xs">
              <label className="block text-[#cec6ab] mb-1.5 text-xs uppercase font-semibold">Date (Tanggal Servis)</label>
              <input
                type="date"
                required
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
              />
            </div>

            {/* Time Slot Sections (Pagi 09:00-11:30 & Siang 12:00-18:30) */}
            <div className="font-mono text-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[#cec6ab] text-xs uppercase font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFE01B]" />
                  <span>Pilih Time Slot</span>
                </label>
                {isLoadingSlots && (
                  <span className="text-[10px] text-[#FFE01B] flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Cek Slot...</span>
                  </span>
                )}
              </div>

              {/* Section 1: Pagi (09.00 - 11.30) */}
              <div className="space-y-1.5 bg-[#131313] p-2.5 rounded border border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFE01B] uppercase pb-1 border-b border-[#1E293B]">
                  <Sunrise className="w-3.5 h-3.5" />
                  <span>Section Pagi (09:00 - 11:30 WIB)</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {MORNING_SLOTS.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    const isSelected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-1.5 px-1 rounded text-center text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                          isOccupied
                            ? 'bg-rose-950/20 text-rose-500/40 border border-rose-900/30 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#FFE01B] text-black shadow-xs'
                            : 'bg-[#1c1b1b] text-[#e5e2e1] hover:text-[#FFE01B] hover:border-[#FFE01B]/50 border border-[#1E293B] cursor-pointer'
                        }`}
                        title={isOccupied ? `Slot ${slot} sudah terisi oleh pelanggan lain` : `Pilih Slot ${slot}`}
                      >
                        {isOccupied ? <Ban className="w-2.5 h-2.5 shrink-0" /> : null}
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Siang (12.00 - 18.30) */}
              <div className="space-y-1.5 bg-[#131313] p-2.5 rounded border border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#CCFF00] uppercase pb-1 border-b border-[#1E293B]">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Section Siang (12:00 - 18:30 WIB)</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 pt-1">
                  {AFTERNOON_SLOTS.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    const isSelected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-1.5 px-1 rounded text-center text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                          isOccupied
                            ? 'bg-rose-950/20 text-rose-500/40 border border-rose-900/30 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#FFE01B] text-black shadow-xs'
                            : 'bg-[#1c1b1b] text-[#e5e2e1] hover:text-[#FFE01B] hover:border-[#FFE01B]/50 border border-[#1E293B] cursor-pointer'
                        }`}
                        title={isOccupied ? `Slot ${slot} sudah terisi oleh pelanggan lain` : `Pilih Slot ${slot}`}
                      >
                        {isOccupied ? <Ban className="w-2.5 h-2.5 shrink-0" /> : null}
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-[#cec6ab] pt-1">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FFE01B]"></span>
                  <span>Terpilih</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#1c1b1b] border border-[#1E293B]"></span>
                  <span>Tersedia</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500/40"></span>
                  <span>Terisi (Booked)</span>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="font-mono text-xs">
              <label className="block text-[#cec6ab] mb-1.5 text-xs uppercase font-semibold">
                Special Instructions
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Mohon cek roller CVT, ganti oli mesin Motul 300V, dan kalibrasi mapping."
                className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-xs text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans placeholder-slate-500"
              />
            </div>

            {/* Summary & Submit */}
            <div className="pt-3 border-t border-[#1E293B] space-y-3 font-mono">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#cec6ab] uppercase">Total Estimate:</span>
                <span className="text-lg font-bold text-[#FFE01B]">
                  Rp {activeService.price.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || occupiedSlots.includes(selectedTime)}
                className={`w-full py-2.5 font-bold text-xs rounded uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                  occupiedSlots.includes(selectedTime)
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                    : 'bg-[#FFE01B] hover:bg-[#ffe241] text-black shadow-md shadow-[#FFE01B]/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>MEMPROSES RESERVASI...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Bay Reservation</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Modal: Konfirmasi Hapus/Batalkan Reservasi */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-rose-500/40 rounded w-full max-w-md p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-rose-400 font-display text-base flex items-center gap-2 uppercase">
                <Trash2 className="w-5 h-5" />
                Batalkan / Hapus Reservasi
              </h3>
              <button onClick={() => setDeletingBooking(null)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 font-mono leading-relaxed">
              Apakah Anda yakin ingin membatalkan dan menghapus jadwal booking{' '}
              <strong className="text-[#FFE01B] font-bold">{deletingBooking.bookingCode}</strong> ({deletingBooking.service?.name || 'Service Package'}) pada tanggal{' '}
              <strong className="text-white">{deletingBooking.bookingDate.split('T')[0]} ({deletingBooking.bookingTime} WIB)</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => setDeletingBooking(null)}
                className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase font-mono"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold rounded uppercase tracking-wider cursor-pointer shadow-md shadow-rose-500/20 flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Reservasi'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
