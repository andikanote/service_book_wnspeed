export type AppRole = 'admin' | 'racer';

export type RacerTab = 'dashboard' | 'bikes' | 'bookings' | 'membership' | 'profile';

export interface MemberBike {
  id: string;
  model: string;
  brand: string;
  plateNumber: string;
  year: number;
  engineCc: number;
  mileageKm: number;
  isPrimary: boolean;
  status: 'READY' | 'IN_WORKSHOP' | 'NEED_SERVICE';
  engineSpec: string;
  ecuMapping: string;
  dynoHp: number;
  dynoTorque: number;
  lastServiceDate: string;
  diagnostics: {
    oilHealth: number;
    brakePads: number;
    vbeltCond: number;
    batteryVoltage: number;
    tirePressureFront: number;
    tirePressureRear: number;
    engineTemp: number;
  };
  notes?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  bikeModel: string;
  plateNumber: string;
  serviceName: string;
  serviceType: 'tuneup' | 'cvt' | 'ecu' | 'engine' | 'suspension';
  branch: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED';
  bayNumber?: number;
  assignedMechanic?: string;
  totalCost: number;
  notes?: string;
  diagnosticsSummary?: {
    oilHealth: number;
    vbeltCond: number;
    brakePads: number;
  };
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Fluids & Oils' | 'Drivetrain' | 'Braking' | 'Electronics & ECU' | 'Exhaust & Intake';
  stock: number;
  minThreshold: number;
  price: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Critical Out';
  location: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description: string;
  popular?: boolean;
  includes: string[];
}

export interface RacerProfile {
  id: string;
  name: string;
  racerId: string;
  racerUuid?: string;
  joinedDate?: string;
  tier: 'ROOKIE' | 'PRO RACER' | 'ELITE MEMBER';
  points: number;
  phone: string;
  email: string;
  primaryBike: {
    model: string;
    plate: string;
    year: number;
    mileage: number;
    engineSpec: string;
    ecuMapping: string;
    dynoHp: number;
    dynoTorque: number;
  };
  diagnostics: {
    oilHealth: number; // 65
    vbeltCond: number; // 88
    brakePads: number; // 15
    batteryVoltage: number;
    tirePressureFront: number;
    tirePressureRear: number;
    afrRatio: number;
    engineTemp: number;
    lastUpdated: string;
  };
}

export interface ServiceHistoryItem {
  id: string;
  serviceName: string;
  date: string;
  branch: string;
  mechanic: string;
  cost: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED';
  notes: string;
  invoiceUrl?: string;
}
