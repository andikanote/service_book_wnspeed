import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Car, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Activity, 
  FileText, 
  AlertCircle,
  Receipt,
  User,
  Phone,
  Sparkles,
  QrCode
} from 'lucide-react';
import { BRANCH_LOCATIONS, TIME_SLOTS, ServicePackage, SERVICE_PACKAGES, VEHICLE_DATA } from '../data/workshopData';

interface BookingFlowProps {
  initialPackage?: ServicePackage | null;
  onBookingSuccess: (bookingData: any) => void;
  onBackToDashboard: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  initialPackage,
  onBookingSuccess,
  onBackToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('depok');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:00 - 10:15');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage>(
    initialPackage || SERVICE_PACKAGES[1] // Default to Regular Plus
  );

  // Customer & Vehicle State
  const [vehicleBrand, setVehicleBrand] = useState<string>('YAMAHA');
  const [vehicleModel, setVehicleModel] = useState<string>('NMAX 155 Connected / Turbo');
  const [plateNumber, setPlateNumber] = useState<string>('B 4592 KNL');
  const [ownerName, setOwnerName] = useState<string>('Rian Pratama');
  const [phone, setPhone] = useState<string>('081298457891');
  const [customSymptom, setCustomSymptom] = useState<string>('Tarikan awal agak bergetar (gredeg) saat mesin panas.');

  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingCode, setBookingCode] = useState<string>('');

  const selectedBranch = BRANCH_LOCATIONS.find((b) => b.id === selectedBranchId) || BRANCH_LOCATIONS[0];

  // Pricing calculations
  const baseServicePrice = selectedPackage.priceNumeric;
  const sopFee = 50000;
  const labFee = 15000;
  const estimatedTotal = baseServicePrice + sopFee + labFee;

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalize Booking
      const generatedCode = 'ANS-' + Math.floor(100000 + Math.random() * 900000);
      setBookingCode(generatedCode);
      setBookingConfirmed(true);
      onBookingSuccess({
        bookingCode: generatedCode,
        branch: selectedBranch,
        package: selectedPackage,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        vehicleBrand,
        vehicleModel,
        plateNumber,
        ownerName,
        phone,
        total: estimatedTotal,
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBackToDashboard();
    }
  };

  return (
    <div className="space-y-10 py-4 max-w-7xl mx-auto">
      
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
          Schedule Your Lab Session
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
          Precise mechanical care for your performance machine. Select your preferred branch and slot to get started.
        </p>
      </div>

      {/* Step Indicators matching Image 3 */}
      <div className="border-b border-[#2D3139] pb-3">
        <div className="flex items-center gap-6 sm:gap-12 overflow-x-auto text-xs font-mono uppercase font-bold tracking-wider">
          
          <button
            onClick={() => setCurrentStep(1)}
            className={`pb-2 transition-all relative ${
              currentStep === 1
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : currentStep > 1
                ? 'text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            01 BRANCH
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`pb-2 transition-all relative ${
              currentStep === 2
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : currentStep > 2
                ? 'text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            02 TIME SLOT
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className={`pb-2 transition-all relative ${
              currentStep === 3
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : currentStep > 3
                ? 'text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            03 VEHICLE
          </button>

          <button
            onClick={() => setCurrentStep(4)}
            className={`pb-2 transition-all relative ${
              currentStep === 4
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-500'
            }`}
          >
            04 CONFIRM
          </button>

        </div>
      </div>

      {/* Booking Form Layout: Left Column (Steps) & Right Column (Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Step (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: SELECT BRANCH */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-indigo-400 font-display">
                Step 1: Select Branch
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BRANCH_LOCATIONS.map((branch) => {
                  const isSelected = selectedBranchId === branch.id;
                  return (
                    <div
                      key={branch.id}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between min-h-[160px] ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/10'
                          : 'bg-[#181A20] border-[#2D3139] hover:border-slate-500'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                            <h3 className="text-base font-bold text-white">
                              {branch.name}
                            </h3>
                          </div>

                          {branch.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              branch.badge === 'AVAILABLE'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {branch.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 mt-2 font-sans">
                          {branch.address}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#2D3139] mt-3">
                        {branch.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono text-slate-400 bg-[#111318] border border-[#2D3139] px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: TIME SLOT */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-base sm:text-lg font-bold text-indigo-400 font-display">
                Step 2: Select Date & Time Slot
              </h2>

              {/* Date Picker */}
              <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-4">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Service Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#111318] text-white border border-[#2D3139] rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : slot.available
                          ? 'bg-[#181A20] border-[#2D3139] text-slate-300 hover:border-slate-500'
                          : 'bg-[#111318] border-[#2D3139] text-slate-600 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <div>
                          <span className="text-xs sm:text-sm font-bold block">
                            {slot.time}
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans">
                            Sesi {slot.category} • Standar SOP
                          </span>
                        </div>
                      </div>

                      {slot.peak && slot.available && (
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono">
                          POPULER
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: VEHICLE & CUSTOMER DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-indigo-400 font-display">
                Step 3: Vehicle & Owner Details
              </h2>

              <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-5 space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Brand Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Merk Kendaraan
                    </label>
                    <select
                      value={vehicleBrand}
                      onChange={(e) => {
                        setVehicleBrand(e.target.value);
                        const models = VEHICLE_DATA.find((v) => v.brand === e.target.value)?.models;
                        if (models && models.length > 0) setVehicleModel(models[0].name);
                      }}
                      className="w-full bg-[#111318] text-white border border-[#2D3139] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                    >
                      {VEHICLE_DATA.map((v) => (
                        <option key={v.brand} value={v.brand}>{v.brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Model / Tipe Motor
                    </label>
                    <select
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full bg-[#111318] text-white border border-[#2D3139] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                    >
                      {VEHICLE_DATA.find((v) => v.brand === vehicleBrand)?.models.map((m) => (
                        <option key={m.name} value={m.name}>{m.name} ({m.cc})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Plat Nomor
                    </label>
                    <input
                      type="text"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                      placeholder="B 1234 XYZ"
                      className="w-full bg-[#111318] text-white font-mono border border-[#2D3139] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Nama Pemilik
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full bg-[#111318] text-white border border-[#2D3139] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      No. WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08123456789"
                      className="w-full bg-[#111318] text-white font-mono border border-[#2D3139] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Catatan Keluhan / Gejala Tambahan
                  </label>
                  <textarea
                    rows={3}
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="Tuliskan keluhan seperti getar, bunyi kasar, atau riwayat servis..."
                    className="w-full bg-[#111318] text-white border border-[#2D3139] rounded-lg p-3 text-xs font-sans focus:outline-none focus:border-indigo-500"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: FINAL CONFIRMATION */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-base sm:text-lg font-bold text-indigo-400 font-display">
                Step 4: Final Booking Review
              </h2>

              <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-6 space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#2D3139] pb-4">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Cabang Lab</span>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{selectedBranch.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">{selectedBranch.address}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Jadwal Sesi</span>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{selectedDate} • {selectedTimeSlot}</span>
                    </div>
                    <p className="text-xs text-emerald-400">Garansi Tepat Waktu 100%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#2D3139] pb-4">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Kendaraan</span>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Car className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{vehicleBrand} {vehicleModel}</span>
                    </div>
                    <span className="inline-block mt-1 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                      {plateNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Pemilik / Kontak</span>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{ownerName} ({phone})</span>
                    </div>
                    <p className="text-xs text-slate-400">Notifikasi WA terkirim otomatis</p>
                  </div>
                </div>

                <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white">SOP Presisi Lab Terjamin</span>
                      <p className="text-[11px] text-slate-400">Semua pengerjaan tercatat di database digital dan bergaransi.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 font-bold">14 Hari Garansi</span>
                </div>

              </div>
            </div>
          )}

          {/* Action Buttons: Back & Proceed */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white uppercase font-bold tracking-wider px-4 py-2.5 rounded-lg border border-transparent hover:border-[#2D3139] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentStep === 1 ? 'Cancel / Back' : 'Back'}</span>
            </button>

            <button
              onClick={handleNextStep}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>
                {currentStep === 1
                  ? 'PROCEED TO TIME SLOTS'
                  : currentStep === 2
                  ? 'PROCEED TO VEHICLE DETAILS'
                  : currentStep === 3
                  ? 'REVIEW & CONFIRM'
                  : 'CONFIRM LAB BOOKING'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Selected Service & Pricing Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Top Elite Photo Card */}
          <div className="relative rounded-2xl overflow-hidden border border-[#2D3139] bg-[#181A20] h-44 shadow-lg group">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80"
              alt="Elite Service Experience"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/40 to-transparent"></div>
            <div className="absolute bottom-3 left-4">
              <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">
                ELITE SERVICE EXPERIENCE
              </span>
            </div>
          </div>

          {/* Selected Service Card */}
          <div className="bg-[#181A20] border border-[#2D3139] rounded-2xl p-5 space-y-5">
            
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                SELECTED SERVICE
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {selectedPackage.name === 'Paket Regular' ? 'PRO Regular Tune-up' : selectedPackage.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Full diagnostic, engine calibration, and SOP verification.
              </p>
            </div>

            {/* Itemized Fee Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-[#2D3139] text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Service</span>
                <span className="text-indigo-400 font-semibold">
                  Rp {baseServicePrice.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SOP Certification</span>
                <span className="text-indigo-400 font-semibold">
                  Rp {sopFee.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lab Fee</span>
                <span className="text-indigo-400 font-semibold">
                  Rp {labFee.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Estimated Total Box */}
            <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 tracking-wider block font-bold">
                  ESTIMATED TOTAL
                </span>
                <div className="text-xl font-bold text-white font-mono">
                  Rp {estimatedTotal.toLocaleString('id-ID')}
                </div>
              </div>
              <Receipt className="w-6 h-6 text-indigo-400" />
            </div>

            {/* Information Notice */}
            <div className="bg-[#111318] border border-[#2D3139] rounded-lg p-3 flex items-start gap-2 text-[11px] text-slate-400">
              <AlertCircle className="w-4 h-4 shrink-0 text-indigo-400/80 mt-0.5" />
              <p className="leading-relaxed">
                Prices are estimates. Final billing depends on actual parts used during the service session at the lab.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Section: WHY BOOK WITH ART N SPEED? */}
      <section className="pt-10 border-t border-[#2D3139] space-y-6">
        
        <div>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block">
            DIGITAL DIAGNOSIS
          </span>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight uppercase">
              WHY BOOK WITH ART N SPEED?
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              Our lab uses the latest telemetry data to ensure your vehicle performs at peak efficiency.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-5 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">
              Precision Labs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Climate-controlled environments with surgical-grade cleanliness for engine work.
            </p>
          </div>

          <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-5 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">
              Real-time Telemetry
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Track your service progress and performance gains via the mobile app in real-time.
            </p>
          </div>

          <div className="bg-[#181A20] border border-[#2D3139] rounded-xl p-5 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">
              SOP Verified
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Every technician follows a strict 45-point checklist for guaranteed quality assurance.
            </p>
          </div>

        </div>

      </section>

      {/* Confirmation Modal */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181A20] border border-[#2D3139] rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
            
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500 flex items-center justify-center mx-auto text-indigo-400">
              <CheckCircle2 className="w-8 h-8 text-indigo-400" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                BOOKING CONFIRMED • PASS ACTIVE
              </span>
              <h3 className="text-2xl font-bold text-white font-display mt-1">
                Lab Session Scheduled!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Booking ID: <strong className="text-indigo-400 font-mono">{bookingCode}</strong>
              </p>
            </div>

            <div className="bg-[#111318] border border-[#2D3139] rounded-xl p-4 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Cabang:</span>
                <span className="text-white font-bold">{selectedBranch.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Waktu:</span>
                <span className="text-white font-bold">{selectedDate} • {selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kendaraan:</span>
                <span className="text-indigo-400 font-bold">{vehicleBrand} {vehicleModel} ({plateNumber})</span>
              </div>
            </div>

            <button
              onClick={() => {
                setBookingConfirmed(false);
                onBackToDashboard();
              }}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider shadow-lg shadow-indigo-500/20"
            >
              Back to Garage Hub
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
