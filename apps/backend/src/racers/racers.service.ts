import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!racer) throw new NotFoundException('Racer profile not found');
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
}
