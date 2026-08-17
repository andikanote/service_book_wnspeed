export interface ServicePackage {
  id: string;
  name: string;
  isPopular?: boolean;
  tag?: string;
  priceFormatted: string;
  priceNumeric: number;
  durationMin: number;
  description: string;
  features: string[];
  recommendedFor: string[];
}

export interface VehicleOption {
  brand: string;
  models: { name: string; cc: string; year: string; category: 'Matic 110-125cc' | 'Maxi Matic 150-160cc' | 'Big Scooter 250cc+' }[];
}

export const VEHICLE_DATA: VehicleOption[] = [
  {
    brand: 'HONDA',
    models: [
      { name: 'Vario 160 / 150 / 125', cc: '160cc', year: '2018-2025', category: 'Maxi Matic 150-160cc' },
      { name: 'PCX 160 / 150', cc: '160cc', year: '2019-2025', category: 'Maxi Matic 150-160cc' },
      { name: 'ADV 160 / 150', cc: '160cc', year: '2020-2025', category: 'Maxi Matic 150-160cc' },
      { name: 'BeAT eSP / Deluxe', cc: '110cc', year: '2016-2025', category: 'Matic 110-125cc' },
      { name: 'Scoopy Prestige / Stylish', cc: '110cc', year: '2017-2025', category: 'Matic 110-125cc' },
      { name: 'Genio eSP', cc: '110cc', year: '2019-2024', category: 'Matic 110-125cc' },
      { name: 'Forza 250', cc: '250cc', year: '2019-2024', category: 'Big Scooter 250cc+' },
    ],
  },
  {
    brand: 'YAMAHA',
    models: [
      { name: 'NMAX 155 Connected / Turbo', cc: '155cc', year: '2016-2025', category: 'Maxi Matic 150-160cc' },
      { name: 'Aerox 155 Connected / CyberCity', cc: '155cc', year: '2017-2025', category: 'Maxi Matic 150-160cc' },
      { name: 'XMAX 250 Connected', cc: '250cc', year: '2018-2025', category: 'Big Scooter 250cc+' },
      { name: 'Grand Filano Hybrid Connected', cc: '125cc', year: '2023-2025', category: 'Matic 110-125cc' },
      { name: 'Fazzio Hybrid Connected', cc: '125cc', year: '2022-2025', category: 'Matic 110-125cc' },
      { name: 'Mio M3 / Soul GT', cc: '125cc', year: '2015-2023', category: 'Matic 110-125cc' },
      { name: 'Lexi LX 155 / 125', cc: '155cc', year: '2018-2025', category: 'Maxi Matic 150-160cc' },
    ],
  },
  {
    brand: 'VESPA',
    models: [
      { name: 'Sprint 150 i-Get ABS', cc: '150cc', year: '2017-2025', category: 'Maxi Matic 150-160cc' },
      { name: 'Primavera 150 i-Get ABS', cc: '150cc', year: '2017-2025', category: 'Maxi Matic 150-160cc' },
      { name: 'GTS Super Tech 300 HPE', cc: '300cc', year: '2019-2025', category: 'Big Scooter 250cc+' },
      { name: 'LX 125 i-Get', cc: '125cc', year: '2018-2025', category: 'Matic 110-125cc' },
      { name: 'S 125 i-Get', cc: '125cc', year: '2018-2025', category: 'Matic 110-125cc' },
    ],
  },
  {
    brand: 'OTHER',
    models: [
      { name: 'Suzuki Burgman Street 125 EX', cc: '125cc', year: '2023-2025', category: 'Matic 110-125cc' },
      { name: 'Kymco Downtown 250i', cc: '250cc', year: '2018-2024', category: 'Big Scooter 250cc+' },
      { name: 'Polytron Fox-R (Electric)', cc: 'EV 3000W', year: '2023-2025', category: 'Matic 110-125cc' },
      { name: 'Alva Cervo (Electric)', cc: 'EV 9.8kW', year: '2023-2025', category: 'Maxi Matic 150-160cc' },
    ],
  },
];

export const MECHANICAL_SYMPTOMS = [
  {
    id: 'brebet',
    code: 'SYM-01',
    label: 'Brebet (Loss of Power)',
    description: 'Mesin tersendat saat tarikan gas awal atau putaran tinggi.',
    impact: 'Injection/Fuel/Spark'
  },
  {
    id: 'ngempos',
    code: 'SYM-02',
    label: 'Ngempos (Engine Lag)',
    description: 'Ditarik gas lambat merespons, ada delay akselerasi.',
    impact: 'Throttle Body / Air Filter'
  },
  {
    id: 'tarikan_berat',
    code: 'SYM-03',
    label: 'Tarikan Berat (Slow Accel)',
    description: 'Motor terasa seperti tertahan beban, RPM naik tapi kecepatan lambat.',
    impact: 'CVT Roller / Kampas Ganda'
  },
  {
    id: 'gredeg',
    code: 'SYM-04',
    label: 'Gredeg (CVT Shudder)',
    description: 'Getaran kuat di stang & dek saat mulai jalan dari berhenti.',
    impact: 'Mangkok Ganda / Slider'
  },
  {
    id: 'bunyi_kasar',
    code: 'SYM-05',
    label: 'Bunyi Kasar (CVT Whine/Clank)',
    description: 'Suara klotok-klotok atau dengung desing dari area transmisi CVT.',
    impact: 'Bearing CVT / V-Belt'
  },
  {
    id: 'boros_bensin',
    code: 'SYM-06',
    label: 'Boros Bensin & Panas',
    description: 'Konsumsi BBM meningkat drastis dan suhu mesin cepat overheat.',
    impact: 'Radiator / O2 Sensor / Oli'
  },
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'paket-regular',
    name: 'Paket Regular',
    priceFormatted: 'Rp 195.000',
    priceNumeric: 195000,
    durationMin: 45,
    description: 'Perawatan rutin harian agar performa motor tetap halus, bersih dan nyaman dikendarai.',
    features: [
      'Service CVT Comprehensive (Pembersihan + Pelumasan Gemuk High-Temp)',
      'Multi-Point CVT Check (Roller, Slider, V-Belt, Kampas)',
      'Injection Infusion Cleanup (Pembersihan nosel injector)',
      'Gratis Oli Mesin (Premium Synthetic Grade Lab)'
    ],
    recommendedFor: ['Perawatan berkala 2.000 - 4.000 KM', 'Motor harian komuter']
  },
  {
    id: 'regular-plus',
    name: 'Regular Plus',
    isPopular: true,
    tag: 'PALING POPULER',
    priceFormatted: 'Rp 375.000',
    priceNumeric: 375000,
    durationMin: 75,
    description: 'Perawatan lebih lengkap dengan pengecekan & kalibrasi komponen vital mesin motor matic.',
    features: [
      'Semua Layanan Paket Regular',
      'Free Gear Oil (Gardan) Heavy-Duty Synthetic',
      'Battery / Accu Health Scan & Load Test (CCA Analysis)',
      'Throttle Body (TB) Diagnosis & Ultrasonic Clean',
      'Fuel Pump Pressure Test (SOP Presisi Barometer)'
    ],
    recommendedFor: ['Gejala CVT Gredeg & Tarikan Berat', 'Jarak tempuh > 8.000 KM', 'Persiapan Touring']
  },
  {
    id: 'full-service',
    name: 'Full Service',
    tag: 'TOTAL CARE',
    priceFormatted: 'Rp 490.000',
    priceNumeric: 490000,
    durationMin: 120,
    description: 'Perawatan menyeluruh grade laboratorium mekanik untuk mengembalikan performa motor seperti baru.',
    features: [
      'Semua Layanan Regular Plus',
      'Deep Throttle Body Cleaning & Reset TPS Sensor',
      'Brake Fluid Flush & Bleed (Dot 4 Racing Spec)',
      'Caliper & Drum Deep Clean (Pembersihan Piston Rem)',
      'Digital Radiator Coolant Flush & Dyno Test Telemetry'
    ],
    recommendedFor: ['Motor loyo & getaran parah', 'Restorasi performa', 'Jarak tempuh > 15.000 KM']
  }
];

export const BRANCH_LOCATIONS = [
  {
    id: 'depok',
    name: 'Depok',
    address: 'Jl. Margonda Raya No. 12, Kota Depok',
    badge: 'AVAILABLE',
    status: 'High Capacity',
    tags: ['SOP VERIFIED', 'EV READY', 'DYNO AVAILABLE'],
    activeBays: '4/4 Ready',
    technicianLead: 'Head Tech: Mas Arya (Certified Master Tech)'
  },
  {
    id: 'bekasi',
    name: 'Bekasi',
    address: 'Kawasan Harapan Indah Block B, Bekasi',
    badge: 'LIMITED SLOTS',
    status: '3 Slots Left',
    tags: ['SOP VERIFIED', 'AC LOUNGE'],
    activeBays: '3/4 Active',
    technicianLead: 'Head Tech: Mas Bagas (Maxi Specialist)'
  },
  {
    id: 'pamulang',
    name: 'Pamulang',
    address: 'Ruko Pamulang Square No. 8, Tangerang Selatan',
    badge: 'AVAILABLE',
    status: 'Fast Track',
    tags: ['SOP VERIFIED', 'VESPA EXPERT'],
    activeBays: '3/3 Ready',
    technicianLead: 'Head Tech: Om Dito (Vespa i-Get Lead)'
  },
  {
    id: 'cimahi',
    name: 'Cimahi',
    address: 'Jl. Sangkuriang No. 45, Cimahi Central',
    badge: 'AVAILABLE',
    status: 'Ready',
    tags: ['SOP VERIFIED', 'DYNO AVAILABLE'],
    activeBays: '2/2 Ready',
    technicianLead: 'Head Tech: Kang Indra (Engine Builder)'
  }
];

export const TIME_SLOTS = [
  { time: '09:00 - 10:15', category: 'Pagi', available: true, peak: false },
  { time: '10:30 - 11:45', category: 'Pagi', available: true, peak: true },
  { time: '13:00 - 14:15', category: 'Siang', available: true, peak: true },
  { time: '14:30 - 15:45', category: 'Siang', available: true, peak: false },
  { time: '16:00 - 17:15', category: 'Sore', available: true, peak: false },
  { time: '17:30 - 18:45', category: 'Sore', available: false, peak: true },
];

export const ARTICLES_DATA = [
  {
    id: 'tips-1',
    category: 'TIPS',
    date: '25 Jul 2026',
    title: 'Cuaca Kemarau Mulai Terasa, Kita Harus Bagaimana??',
    summary: 'Musim kemarau bukan cuma bikin badan cepat lelah, tapi juga membuat motor bekerja lebih berat. Pastikan radiator dan oli dalam kondisi prima.',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min baca'
  },
  {
    id: 'news-1',
    category: 'NEWS',
    date: '18 Jul 2026',
    title: 'We n Speed Membuka Cabang Ke-5 di Ciledug',
    summary: 'Pembukaan cabang di Ciledug bukan tanpa alasan. Berdasarkan data, permintaan masyarakat Kota Tangerang sangat tinggi untuk standar lab.',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min baca'
  },
  {
    id: 'tips-2',
    category: 'TIPS',
    date: '12 Jul 2026',
    title: 'Siapkan Kendaraan Antar Jemput Sekolah Anak',
    summary: 'Menjelang kembali masuk sekolah, pastikan motor matic yang digunakan untuk antar-jemput dalam kondisi prima demi keamanan buah hati.',
    imageUrl: 'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min baca'
  }
];

export const WORKSHOP_STATS = [
  { value: '15.000+', label: 'MOTOR DITANGANI' },
  { value: '4.9 ★', label: 'RATING GOOGLE' },
  { value: '98%', label: 'CUSTOMER PUAS' },
  { value: '4', label: 'CABANG AKTIF' },
];

export const PARTNERS = [
  { name: 'Castrol Lubricants', type: 'Official Oil Partner' },
  { name: 'Dr. Pulley', type: 'Sliding Roller Tech' },
  { name: 'Gates Powerlink', type: 'EPDM CVT Belts' },
  { name: 'Zutto Tech', type: 'Precision Calipers' },
  { name: 'BRT Bintang Racing', type: 'ECU & Throttle Body' },
  { name: 'TDR Racing', type: 'High Performance Part' }
];
