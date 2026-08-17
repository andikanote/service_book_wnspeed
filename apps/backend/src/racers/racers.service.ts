import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function generateRacerUuid(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return `WNS-${code}`;
}

@Injectable()
export class RacersService {
  constructor(private prisma: PrismaService) {}

  async getAllRacers() {
    return this.prisma.racerProfile.findMany({
      include: {
        user: { select: { id: true, name: true, phone: true, email: true, avatarUrl: true, racerUuid: true, joinedAt: true, createdAt: true } },
        bikes: {
          include: { diagnostics: true },
        },
      },
      orderBy: { points: 'desc' },
    });
  }

  async getMyProfile(userId?: string) {
    let racer: any = null;

    if (userId) {
      racer = await this.prisma.racerProfile.findUnique({
        where: { userId },
        include: {
          user: { select: { id: true, name: true, phone: true, email: true, avatarUrl: true, racerUuid: true, joinedAt: true, createdAt: true } },
          bikes: {
            include: { diagnostics: true },
            orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
          },
        },
      });
    }

    if (!racer) {
      // Find first racer or default fallback
      racer = await this.prisma.racerProfile.findFirst({
        include: {
          user: { select: { id: true, name: true, phone: true, email: true, avatarUrl: true, racerUuid: true, joinedAt: true, createdAt: true } },
          bikes: {
            include: { diagnostics: true },
            orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
          },
        },
      });
    }

    if (!racer && userId) {
      // Auto-provision default racer profile
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        racer = await this.prisma.racerProfile.create({
          data: {
            userId,
            racerIdCode: 'AX-9924',
            tier: 'ELITE_MEMBER',
            points: 12450,
          },
          include: {
            user: { select: { id: true, name: true, phone: true, email: true, avatarUrl: true, racerUuid: true, joinedAt: true, createdAt: true } },
            bikes: {
              include: { diagnostics: true },
              orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
            },
          },
        });
      }
    }

    if (!racer) {
      throw new NotFoundException('Profil racer tidak ditemukan.');
    }

    // Ensure user has racerUuid and joinedAt set
    if (racer.user && (!racer.user.racerUuid || !racer.user.joinedAt)) {
      const generatedUuid = racer.user.racerUuid || generateRacerUuid();
      const defaultJoined = racer.user.joinedAt || racer.user.createdAt || new Date('2026-08-01');
      await this.prisma.user.update({
        where: { id: racer.user.id },
        data: {
          racerUuid: generatedUuid,
          joinedAt: defaultJoined,
        },
      });
      racer.user.racerUuid = generatedUuid;
      racer.user.joinedAt = defaultJoined;
    }

    const primaryBike = racer.bikes?.find((b: any) => b.isPrimary) || racer.bikes?.[0] || null;
    const racerUuid = racer.user?.racerUuid || generateRacerUuid();
    const joinedAtDate = racer.user?.joinedAt || racer.user?.createdAt || new Date('2026-08-01');
    const joinedDate = new Date(joinedAtDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    return {
      id: racer.id,
      userId: racer.userId,
      name: racer.user?.name || 'Aldi Taher Prasetyo',
      phone: racer.user?.phone || '+62 812-8901-7721',
      email: racer.user?.email || 'aldi.racer99@wenspeed.my.id',
      avatarUrl: racer.user?.avatarUrl || null,
      racerUuid: racerUuid,
      racerId: racerUuid,
      racerIdCode: racer.racerIdCode || racerUuid,
      tier: racer.tier ? racer.tier.replace('_', ' ') : 'ELITE MEMBER',
      points: Number(racer.points) || 12450,
      totalSpent: Number(racer.totalSpent) || 0,
      visits: Number(racer.visits) || 0,
      joinedAt: joinedAtDate,
      joinedDate: joinedDate,
      bikes: racer.bikes || [],
      primaryBike: primaryBike ? {
        id: primaryBike.id,
        brand: primaryBike.brand,
        model: primaryBike.model,
        plate: primaryBike.plateNumber,
        plateNumber: primaryBike.plateNumber,
        year: primaryBike.year || 2023,
        engineCc: primaryBike.engineCc || 155,
        engineSpec: primaryBike.engineSpec || 'Standar Factory Tuned',
        ecuMapping: primaryBike.ecuMapping || 'Standar OEM Mapping',
        isPrimary: primaryBike.isPrimary,
      } : null,
    };
  }

  async createOrUpdateProfile(
    userId: string | undefined,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      tier?: string;
      avatarUrl?: string;
    }
  ) {
    let targetUserId = userId;

    if (!targetUserId) {
      const firstUser = await this.prisma.user.findFirst({
        where: { role: 'racer' },
      });
      if (firstUser) {
        targetUserId = firstUser.id;
      } else {
        throw new BadRequestException('User racer tidak ditemukan.');
      }
    }

    // 1. Update User info if fields provided (Note: racerUuid & joinedAt are permanent and not editable)
    const userUpdateData: any = {};
    if (data.name !== undefined) userUpdateData.name = data.name.trim();
    if (data.phone !== undefined) userUpdateData.phone = data.phone.trim();
    if (data.email !== undefined) userUpdateData.email = data.email.trim();
    if (data.avatarUrl !== undefined) userUpdateData.avatarUrl = data.avatarUrl;

    if (Object.keys(userUpdateData).length > 0) {
      await this.prisma.user.update({
        where: { id: targetUserId },
        data: userUpdateData,
      });
    }

    // 2. Format tier if provided
    let tierValue: any = undefined;
    if (data.tier) {
      const cleanTier = data.tier.trim().toUpperCase().replace(/\s+/g, '_');
      if (cleanTier === 'ROOKIE') tierValue = 'ROOKIE';
      else if (cleanTier === 'PRO_RACER' || cleanTier === 'PRO RACER') tierValue = 'PRO_RACER';
      else tierValue = 'ELITE_MEMBER';
    }

    // 3. Upsert RacerProfile (Points are NOT modified here; points are calculated from package service purchases)
    const profileUpdateData: any = {};
    if (tierValue !== undefined) profileUpdateData.tier = tierValue;

    await this.prisma.racerProfile.upsert({
      where: { userId: targetUserId },
      update: profileUpdateData,
      create: {
        userId: targetUserId,
        racerIdCode: `AX-${Math.floor(1000 + Math.random() * 9000)}`,
        tier: tierValue || 'ELITE_MEMBER',
        points: 12450,
      },
    });

    return this.getMyProfile(targetUserId);
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

  async getPrimaryBike(userId?: string) {
    let whereClause: any = { isPrimary: true };

    if (userId) {
      const racer = await this.prisma.racerProfile.findUnique({
        where: { userId },
      });
      if (racer) {
        whereClause = { racerId: racer.id, isPrimary: true };
      }
    }

    let bike = await this.prisma.bike.findFirst({
      where: whereClause,
      include: {
        diagnostics: true,
        racer: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!bike && userId) {
      const racer = await this.prisma.racerProfile.findUnique({
        where: { userId },
      });
      if (racer) {
        bike = await this.prisma.bike.findFirst({
          where: { racerId: racer.id },
          include: {
            diagnostics: true,
            racer: {
              include: {
                user: { select: { name: true, email: true, phone: true } },
              },
            },
          },
        });
      }
    }

    if (!bike) {
      bike = await this.prisma.bike.findFirst({
        include: {
          diagnostics: true,
          racer: {
            include: {
              user: { select: { name: true, email: true, phone: true } },
            },
          },
        },
      });
    }

    if (!bike) {
      throw new NotFoundException('Primary race machine tidak ditemukan');
    }

    return bike;
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
    engineSpec?: string;
    ecuMapping?: string;
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
        isPrimary,
        engineSpec: data.engineSpec?.trim() || 'Standar Factory Tuned',
        ecuMapping: data.ecuMapping?.trim() || 'Standar OEM Mapping',
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
      engineSpec?: string;
      ecuMapping?: string;
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
        isPrimary: data.isPrimary !== undefined ? Boolean(data.isPrimary) : existing.isPrimary,
        engineSpec: data.engineSpec !== undefined ? data.engineSpec.trim() : existing.engineSpec,
        ecuMapping: data.ecuMapping !== undefined ? data.ecuMapping.trim() : existing.ecuMapping,
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
