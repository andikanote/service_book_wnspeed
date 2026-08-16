import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RacersService {
  constructor(private prisma: PrismaService) {}

  async getAllRacers() {
    return this.prisma.racerProfile.findMany({
      include: {
        user: { select: { name: true, phone: true, email: true, avatarUrl: true } },
        bikes: {
          include: { diagnostics: true },
        },
      },
      orderBy: { points: 'desc' },
    });
  }

  async getRacerById(id: string) {
    const racer = await this.prisma.racerProfile.findUnique({
      where: { id },
      include: {
        user: true,
        bikes: { include: { diagnostics: true } },
      },
    });
    if (!racer) {
      throw new NotFoundException(`Profil racer dengan ID '${id}' tidak ditemukan`);
    }
    return racer;
  }

  async updateDiagnostics(bikeId: string, data: any) {
    const bike = await this.prisma.bike.findUnique({
      where: { id: bikeId },
    });

    if (!bike) {
      throw new NotFoundException(`Data motor dengan ID '${bikeId}' tidak ditemukan di database`);
    }

    return this.prisma.bikeDiagnostics.upsert({
      where: { bikeId },
      update: {
        ...data,
        lastUpdated: 'Just Now',
      },
      create: {
        bikeId,
        oilHealth: data.oilHealth ?? 100,
        vbeltCond: data.vbeltCond ?? 100,
        brakePads: data.brakePads ?? 100,
        batteryVoltage: data.batteryVoltage ?? 12.8,
        tirePressureFront: data.tirePressureFront ?? 29.5,
        tirePressureRear: data.tirePressureRear ?? 33.0,
        afrRatio: data.afrRatio ?? 12.9,
        engineTemp: data.engineTemp ?? 85,
        lastUpdated: 'Just Now',
      },
    });
  }

  // ==========================================
  // BIKES CRUD API METHODS
  // ==========================================

  async getAllBikes(userId?: string) {
    let whereClause: any = {};

    if (userId) {
      const racer = await this.prisma.racerProfile.findUnique({
        where: { userId },
      });
      if (racer) {
        whereClause = { racerId: racer.id };
      }
    }

    return this.prisma.bike.findMany({
      where: whereClause,
      include: {
        diagnostics: true,
        racer: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getBikeById(id: string) {
    const bike = await this.prisma.bike.findUnique({
      where: { id },
      include: {
        diagnostics: true,
        racer: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!bike) {
      throw new NotFoundException(`Motor dengan ID '${id}' tidak ditemukan`);
    }

    return bike;
  }

  async createBike(data: {
    brand?: string;
    model: string;
    plateNumber: string;
    year?: number;
    engineCc?: number;
    mileage?: number;
    engineSpec?: string;
    ecuMapping?: string;
    dynoHp?: number;
    dynoTorque?: number;
    isPrimary?: boolean;
    userId?: string;
  }) {
    if (!data.model || !data.model.trim()) {
      throw new BadRequestException('Jenis motor / model wajib diisi');
    }

    if (!data.plateNumber || !data.plateNumber.trim()) {
      throw new BadRequestException('Plat motor wajib diisi');
    }

    const cleanPlate = data.plateNumber.trim().toUpperCase();

    // Check existing plate number
    const existing = await this.prisma.bike.findUnique({
      where: { plateNumber: cleanPlate },
    });

    if (existing) {
      throw new BadRequestException(`Plat nomor '${cleanPlate}' sudah terdaftar di sistem`);
    }

    // Resolve or create RacerProfile
    let targetRacerId: string;
    if (data.userId) {
      let racer = await this.prisma.racerProfile.findUnique({
        where: { userId: data.userId },
      });

      if (!racer) {
        // Auto-provision a racer profile for this user if missing
        racer = await this.prisma.racerProfile.create({
          data: {
            userId: data.userId,
            racerIdCode: `ANS-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        });
      }
      targetRacerId = racer.id;
    } else {
      const firstRacer = await this.prisma.racerProfile.findFirst();
      if (!firstRacer) {
        throw new BadRequestException('Tidak ada profil racer yang tersedia di database.');
      }
      targetRacerId = firstRacer.id;
    }

    // Count existing bikes to decide if this should be default primary
    const bikeCount = await this.prisma.bike.count({
      where: { racerId: targetRacerId },
    });

    const isPrimary = data.isPrimary ?? (bikeCount === 0);

    if (isPrimary) {
      await this.prisma.bike.updateMany({
        where: { racerId: targetRacerId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.bike.create({
      data: {
        racerId: targetRacerId,
        brand: data.brand?.trim() || 'Yamaha',
        model: data.model.trim(),
        plateNumber: cleanPlate,
        year: Number(data.year) || new Date().getFullYear(),
        engineCc: Number(data.engineCc) || 150,
        mileage: Number(data.mileage) || 0,
        isPrimary,
        engineSpec: data.engineSpec?.trim() || 'Standar Factory Tuned',
        ecuMapping: data.ecuMapping?.trim() || 'Standar OEM Mapping',
        dynoHp: Number(data.dynoHp) || 18.5,
        dynoTorque: Number(data.dynoTorque) || 14.2,
        diagnostics: {
          create: {
            oilHealth: 100,
            vbeltCond: 100,
            brakePads: 100,
            batteryVoltage: 12.8,
            tirePressureFront: 29.5,
            tirePressureRear: 33.0,
            afrRatio: 12.9,
            engineTemp: 82,
            lastUpdated: 'Just Now',
          },
        },
      },
      include: {
        diagnostics: true,
      },
    });
  }

  async updateBike(
    id: string,
    data: {
      brand?: string;
      model?: string;
      plateNumber?: string;
      year?: number;
      engineCc?: number;
      mileage?: number;
      engineSpec?: string;
      ecuMapping?: string;
      dynoHp?: number;
      dynoTorque?: number;
      isPrimary?: boolean;
    }
  ) {
    const existing = await this.prisma.bike.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Motor dengan ID '${id}' tidak ditemukan`);
    }

    if (data.plateNumber && data.plateNumber.trim()) {
      const cleanPlate = data.plateNumber.trim().toUpperCase();
      if (cleanPlate !== existing.plateNumber) {
        const plateCheck = await this.prisma.bike.findUnique({
          where: { plateNumber: cleanPlate },
        });
        if (plateCheck) {
          throw new BadRequestException(`Plat nomor '${cleanPlate}' sudah digunakan oleh motor lain`);
        }
      }
    }

    if (data.isPrimary) {
      await this.prisma.bike.updateMany({
        where: { racerId: existing.racerId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.bike.update({
      where: { id },
      data: {
        brand: data.brand !== undefined ? data.brand.trim() : existing.brand,
        model: data.model !== undefined ? data.model.trim() : existing.model,
        plateNumber: data.plateNumber !== undefined ? data.plateNumber.trim().toUpperCase() : existing.plateNumber,
        year: data.year !== undefined ? Number(data.year) : existing.year,
        engineCc: data.engineCc !== undefined ? Number(data.engineCc) : existing.engineCc,
        mileage: data.mileage !== undefined ? Number(data.mileage) : existing.mileage,
        isPrimary: data.isPrimary !== undefined ? Boolean(data.isPrimary) : existing.isPrimary,
        engineSpec: data.engineSpec !== undefined ? data.engineSpec.trim() : existing.engineSpec,
        ecuMapping: data.ecuMapping !== undefined ? data.ecuMapping.trim() : existing.ecuMapping,
        dynoHp: data.dynoHp !== undefined ? Number(data.dynoHp) : existing.dynoHp,
        dynoTorque: data.dynoTorque !== undefined ? Number(data.dynoTorque) : existing.dynoTorque,
      },
      include: {
        diagnostics: true,
      },
    });
  }

  async deleteBike(id: string) {
    const existing = await this.prisma.bike.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Motor dengan ID '${id}' tidak ditemukan`);
    }

    const bookingCount = await this.prisma.booking.count({
      where: { bikeId: id },
    });

    if (bookingCount > 0) {
      throw new BadRequestException(
        `Motor dengan plat '${existing.plateNumber}' tidak dapat dihapus karena masih terhubung dengan ${bookingCount} data reservasi/booking.`
      );
    }

    return this.prisma.bike.delete({
      where: { id },
    });
  }

  async setPrimaryBike(id: string) {
    const existing = await this.prisma.bike.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Motor dengan ID '${id}' tidak ditemukan`);
    }

    await this.prisma.bike.updateMany({
      where: { racerId: existing.racerId },
      data: { isPrimary: false },
    });

    return this.prisma.bike.update({
      where: { id },
      data: { isPrimary: true },
      include: { diagnostics: true },
    });
  }
}
