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
    if (!booking) throw new NotFoundException('Booking not found');

    if (currentUser.role === 'racer' && booking.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied: You can only view your own bookings');
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
    if (!booking) throw new NotFoundException('Booking not found');

    if (currentUser && currentUser.role === 'racer') {
      if (booking.userId !== currentUser.id) {
        throw new ForbiddenException('Access denied: You cannot modify this booking');
      }
      if (status !== BookingStatus.CANCELLED) {
        throw new ForbiddenException('Racers can only cancel their own bookings');
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
    const bookingCode = `ANS-${Math.floor(1000 + Math.random() * 9000)}`;
    const targetUserId =
      currentUser.role === 'admin' && data.userId ? data.userId : currentUser.id;

    return this.prisma.booking.create({
      data: {
        bookingCode,
        userId: targetUserId,
        bikeId: data.bikeId,
        serviceId: data.serviceId,
        branch: data.branch,
        bookingDate: new Date(data.bookingDate),
        bookingTime: data.bookingTime,
        totalCost: data.totalCost,
        notes: data.notes,
        status: 'PENDING',
      },
    });
  }
}

