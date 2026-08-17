import { PrismaClient, Role, BookingStatus, BayStatus, InventoryStatus, MemberTier } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for We n Speed...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Upsert Admin User
  await prisma.user.upsert({
    where: { email: 'admin@wenspeed.my.id' },
    update: {
      name: 'Workshop Chief Admin',
      phone: '+62 811-2233-4455',
      role: Role.admin,
      password: passwordHash,
    },
    create: {
      email: 'admin@wenspeed.my.id',
      name: 'Workshop Chief Admin',
      phone: '+62 811-2233-4455',
      role: Role.admin,
      password: passwordHash,
    },
  });

  // 2. Upsert Racer User (Aldi Taher Prasetyo)
  const racerUser = await prisma.user.upsert({
    where: { email: 'aldi.racer99@wenspeed.my.id' },
    update: {
      name: 'Aldi Taher Prasetyo',
      phone: '+62 812-8901-7721',
      role: Role.racer,
      racerUuid: 'WNS-849201',
      password: passwordHash,
      joinedAt: new Date('2026-08-01T00:00:00.000Z'),
    },
    create: {
      email: 'aldi.racer99@wenspeed.my.id',
      name: 'Aldi Taher Prasetyo',
      phone: '+62 812-8901-7721',
      role: Role.racer,
      racerUuid: 'WNS-849201',
      password: passwordHash,
      joinedAt: new Date('2026-08-01T00:00:00.000Z'),
    },
  });

  // 3. Upsert Racer Profile
  const racerProfile = await prisma.racerProfile.upsert({
    where: { userId: racerUser.id },
    update: {
      racerIdCode: 'WNS-849201',
      tier: MemberTier.ELITE_MEMBER,
      points: 12450,
      totalSpent: 14850000,
      visits: 12,
    },
    create: {
      userId: racerUser.id,
      racerIdCode: 'WNS-849201',
      tier: MemberTier.ELITE_MEMBER,
      points: 12450,
      totalSpent: 14850000,
      visits: 12,
    },
  });

  // 4. Upsert Primary Bike for Aldi
  let primaryBike = await prisma.bike.findFirst({
    where: { racerId: racerProfile.id, plateNumber: 'B 4992 ELA' },
  });

  if (!primaryBike) {
    primaryBike = await prisma.bike.create({
      data: {
        racerId: racerProfile.id,
        brand: 'Yamaha',
        model: 'Yamaha All New Aerox 155 Connected Cyber City',
        plateNumber: 'B 4992 ELA',
        year: 2023,
        engineCc: 155,
        isPrimary: true,
        engineSpec: '155cc VVA + TDR 62mm Ceramic Cylinder (183cc Kit)',
        ecuMapping: 'aRacer SpeedTek Super X - WN Racing Map v4',
      },
    });
  } else {
    primaryBike = await prisma.bike.update({
      where: { id: primaryBike.id },
      data: {
        isPrimary: true,
        engineSpec: '155cc VVA + TDR 62mm Ceramic Cylinder (183cc Kit)',
        ecuMapping: 'aRacer SpeedTek Super X - WN Racing Map v4',
      },
    });
  }

  // Upsert Bike Diagnostics
  await prisma.bikeDiagnostics.upsert({
    where: { bikeId: primaryBike.id },
    update: {
      oilHealth: 65,
      vbeltCond: 88,
      brakePads: 15,
      batteryVoltage: 12.8,
      tirePressureFront: 29.5,
      tirePressureRear: 33.0,
      afrRatio: 12.9,
      engineTemp: 86,
    },
    create: {
      bikeId: primaryBike.id,
      oilHealth: 65,
      vbeltCond: 88,
      brakePads: 15,
      batteryVoltage: 12.8,
      tirePressureFront: 29.5,
      tirePressureRear: 33.0,
      afrRatio: 12.9,
      engineTemp: 86,
    },
  });

  // 5. Upsert Workshop Bays
  const baysData = [
    { bayNumber: 1, name: 'Bay 1: Fast Service & Oil Check', status: BayStatus.IN_USE, currentBikePlate: 'B 4992 ELA', assignedMechanic: 'Bambang Wijaya', progress: 75 },
    { bayNumber: 2, name: 'Bay 2: CVT Overhaul & Cleaning', status: BayStatus.IN_USE, currentBikePlate: 'B 3881 KLF', assignedMechanic: 'Rian Pratama', progress: 40 },
    { bayNumber: 3, name: 'Bay 3: Dyno Jet & ECU Tuning', status: BayStatus.OCCUPIED, currentBikePlate: 'B 6112 TXR', assignedMechanic: 'Hendra Tan', progress: 90 },
    { bayNumber: 4, name: 'Bay 4: Engine Blueprinting / Overhaul', status: BayStatus.AVAILABLE, currentBikePlate: 'Ready for Next Slot', assignedMechanic: 'Standby Tech 01', progress: 0 },
  ];

  for (const bay of baysData) {
    await prisma.workshopBay.upsert({
      where: { bayNumber: bay.bayNumber },
      update: bay,
      create: bay,
    });
  }

  // 6. Upsert Inventory Items
  const inventoryData = [
    { sku: 'OIL-MOT-300V', name: 'Motul 300V Factory Line 10W-40 (1L)', category: 'Fluids & Oils', stock: 24, minThreshold: 8, price: 345000, supplier: 'PT Motul Indonesia', location: 'Rack A-01', status: InventoryStatus.In_Stock },
    { sku: 'CVT-VBLT-TDR', name: 'TDR Racing High Grip Kevlar V-Belt Aerox/NMAX', category: 'Drivetrain', stock: 2, minThreshold: 5, price: 215000, supplier: 'Mitra 2000 TDR', location: 'Rack B-03', status: InventoryStatus.Critical_Out },
    { sku: 'BRK-PAD-BRM', name: 'Brembo Sintered Front Brake Pads', category: 'Braking', stock: 3, minThreshold: 6, price: 420000, supplier: 'Brembo Racing Indo', location: 'Rack C-02', status: InventoryStatus.Critical_Out },
    { sku: 'ECU-ARACER-X', name: 'aRacer SpeedTek Super X Standalone ECU', category: 'Electronics & ECU', stock: 7, minThreshold: 3, price: 6850000, supplier: 'aRacer Taiwan', location: 'Safe Vault E-01', status: InventoryStatus.In_Stock },
    { sku: 'EXH-WRX-GP', name: 'WRX Racing Exhaust Full System GP K2 Series', category: 'Exhaust & Intake', stock: 4, minThreshold: 2, price: 1850000, supplier: 'WRX Exhaust HQ', location: 'Rack D-01', status: InventoryStatus.In_Stock },
    { sku: 'ROL-TDR-11G', name: 'TDR Teflon Roller Set 11 Gram (6 pcs)', category: 'Drivetrain', stock: 18, minThreshold: 10, price: 110000, supplier: 'Mitra 2000 TDR', location: 'Rack B-04', status: InventoryStatus.In_Stock },
  ];

  for (const item of inventoryData) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: item,
      create: item,
    });
  }

  // 7. Upsert Service Packages
  const serviceData = [
    { name: 'Diagnostic & Carbon Clean Express', category: 'Fast Service', durationMinutes: 45, price: 185000, description: 'Pembersihan ruang bakar ultrasonic dan kalibrasi sensor' },
    { name: '21-Point Precision Lab Service', category: 'General Service', durationMinutes: 90, price: 385000, description: 'Servis berkala menyeluruh dengan standar mechanical laboratory' },
    { name: 'Dyno ECU Remap & Power Tune', category: 'Performance Tune', durationMinutes: 120, price: 750000, description: 'Kalibrasi kurva bahan bakar dan pengapian di atas mesin Dyno Jet' },
    { name: 'Ultimate Racing Overhaul & Porting', category: 'Major Overhaul', durationMinutes: 360, price: 2450000, description: 'Bongkar mesin total, blueprinting kruk as, dan porting polish 3D' },
  ];

  for (const s of serviceData) {
    const existing = await prisma.servicePackage.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.servicePackage.create({ data: s });
    }
  }

  // 8. Upsert Bookings
  const existingService = await prisma.servicePackage.findFirst();
  const serviceId = existingService?.id;

  if (serviceId) {
    const bookingsData = [
      {
        bookingCode: 'BKG-20260817-001',
        userId: racerUser.id,
        bikeId: primaryBike.id,
        serviceId: serviceId,
        branch: 'Bekasi Branch',
        bookingDate: new Date('2026-08-17'),
        bookingTime: '10:00 AM',
        status: BookingStatus.IN_SERVICE,
        bayNumber: 1,
        assignedMechanic: 'Bambang Wijaya',
        totalCost: 385000,
        notes: 'Dyno calibration and oil replacement',
      },
      {
        bookingCode: 'BKG-20260817-002',
        userId: racerUser.id,
        bikeId: primaryBike.id,
        serviceId: serviceId,
        branch: 'Jakarta Selatan Branch',
        bookingDate: new Date('2026-08-18'),
        bookingTime: '02:00 PM',
        status: BookingStatus.CONFIRMED,
        bayNumber: 2,
        assignedMechanic: 'Rian Pratama',
        totalCost: 750000,
        notes: 'ECU Remap session',
      },
      {
        bookingCode: 'BKG-20260810-003',
        userId: racerUser.id,
        bikeId: primaryBike.id,
        serviceId: serviceId,
        branch: 'Bekasi Branch',
        bookingDate: new Date('2026-08-10'),
        bookingTime: '11:00 AM',
        status: BookingStatus.COMPLETED,
        bayNumber: 1,
        assignedMechanic: 'Bambang Wijaya',
        totalCost: 420000,
        notes: 'Brake pads replacement and Motul 300V oil',
      },
    ];

    for (const b of bookingsData) {
      const existing = await prisma.booking.findUnique({ where: { bookingCode: b.bookingCode } });
      if (!existing) {
        await prisma.booking.create({ data: b });
      }
    }
  }

  console.log('✅ Database seeded successfully with live We n Speed data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
