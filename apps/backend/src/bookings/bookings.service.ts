import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async getAllBookings(currentUser: { id: string; role: string }) {
    const where = currentUser.role === 'racer' ? { userId: currentUser.id } : {};

    return this.prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, phone: true, email: true } },
        bike: {
          include: { diagnostics: true },
        },
        service: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id: string, currentUser: { id: string; role: string }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        bike: { include: { diagnostics: true } },
        service: true,
      },
    });
    if (!booking) {
      throw new NotFoundException(`Data booking dengan ID '${id}' tidak ditemukan`);
    }

    if (currentUser.role === 'racer' && booking.userId !== currentUser.id) {
      throw new ForbiddenException('Akses ditolak: Anda hanya dapat melihat data booking milik Anda sendiri');
    }

    return booking;
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    bayNumber?: number,
    mechanic?: string,
    currentUser?: { id: string; role: string },
  ) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Data booking dengan ID '${id}' tidak ditemukan`);
    }

    if (currentUser && currentUser.role === 'racer') {
      if (booking.userId !== currentUser.id) {
        throw new ForbiddenException('Akses ditolak: Anda tidak memiliki izin untuk mengubah booking ini');
      }
      if (status !== BookingStatus.CANCELLED) {
        throw new ForbiddenException('Akses ditolak: Racer hanya diperbolehkan membatalkan (CANCELLED) jadwal booking');
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status,
        bayNumber: bayNumber !== undefined ? bayNumber : undefined,
        assignedMechanic: mechanic !== undefined ? mechanic : undefined,
      },
    });
  }

  async createBooking(data: CreateBookingDto, currentUser: { id: string; role: string }) {
    const targetUserId =
      currentUser.role === 'admin' && data.userId ? data.userId : currentUser.id;

    // Validate target user
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(`User dengan ID '${targetUserId}' tidak ditemukan di sistem`);
    }

    // Resolve or Validate Bike
    let resolvedBikeId = data.bikeId;
    if (resolvedBikeId) {
      const bike = await this.prisma.bike.findUnique({ where: { id: resolvedBikeId } });
      if (!bike) {
        throw new NotFoundException(`Data motor dengan ID '${resolvedBikeId}' tidak ditemukan di sistem`);
      }
    } else {
      // Find racer profile bikes
      let racerProfile = await this.prisma.racerProfile.findUnique({
        where: { userId: targetUserId },
        include: { bikes: true },
      });

      if (!racerProfile) {
        racerProfile = await this.prisma.racerProfile.create({
          data: {
            userId: targetUserId,
            racerIdCode: `ANS-${Math.floor(1000 + Math.random() * 9000)}`,
          },
          include: { bikes: true },
        });
      }

      const primaryBike = racerProfile.bikes.find((b) => b.isPrimary) || racerProfile.bikes[0];
      if (primaryBike) {
        resolvedBikeId = primaryBike.id;
      } else {
        // Auto-create a default registered unit
        const newBike = await this.prisma.bike.create({
          data: {
            racerId: racerProfile.id,
            brand: 'Yamaha',
            model: 'Aerox 155 Connected',
            plateNumber: `B ${Math.floor(1000 + Math.random() * 8999)} ANS`,
            year: new Date().getFullYear(),
            engineCc: 155,
            isPrimary: true,
          },
        });
        resolvedBikeId = newBike.id;
      }
    }

    // Validate service package
    let service = await this.prisma.servicePackage.findUnique({ where: { id: data.serviceId } });
    if (!service) {
      // Fallback: search by category or name
      service = await this.prisma.servicePackage.findFirst();
      if (!service) {
        // Create initial default service package if empty
        service = await this.prisma.servicePackage.create({
          data: {
            name: 'Standard Precision Tune-Up',
            category: 'Engine Tuning',
            durationMinutes: 60,
            price: 250000,
            description: 'Tune up berkala & kalibrasi injeksi',
          },
        });
      }
    }

    const bookingCode = `ANS-${Math.floor(1000 + Math.random() * 9000)}`;
    const cost = data.totalCost !== undefined ? data.totalCost : Number(service.price);

    return this.prisma.booking.create({
      data: {
        bookingCode,
        userId: targetUserId,
        bikeId: resolvedBikeId,
        serviceId: service.id,
        branch: data.branch || 'Bekasi Branch (Precision Tuning Center)',
        bookingDate: new Date(data.bookingDate),
        bookingTime: data.bookingTime,
        totalCost: cost,
        notes: data.notes || '',
        status: 'PENDING',
      },
      include: {
        bike: true,
        service: true,
      },
    });
  }
}

