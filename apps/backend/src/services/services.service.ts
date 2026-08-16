import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.servicePackage.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async create(data: {
    name: string;
    category: string;
    durationMinutes: number;
    price: number;
    isPopular?: boolean;
    description?: string;
    includesItems?: string[];
  }) {
    if (!data.name || !data.category) {
      throw new BadRequestException('Nama paket service dan Kategori wajib diisi');
    }

    if (data.price === undefined || Number(data.price) < 0) {
      throw new BadRequestException('Harga paket service wajib diisi dengan nilai yang valid');
    }

    return this.prisma.servicePackage.create({
      data: {
        name: data.name.trim(),
        category: data.category.trim(),
        durationMinutes: Number(data.durationMinutes) || 60,
        price: Number(data.price),
        isPopular: Boolean(data.isPopular),
        description: data.description,
        includesItems: data.includesItems || [],
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.servicePackage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Paket service dengan ID ${id} tidak ditemukan`);
    }

    // Check if there are active bookings associated with this service
    const bookingCount = await this.prisma.booking.count({
      where: { serviceId: id },
    });

    if (bookingCount > 0) {
      throw new BadRequestException(
        `Paket service tidak dapat dihapus karena masih terhubung dengan ${bookingCount} data reservasi/booking.`
      );
    }

    return this.prisma.servicePackage.delete({
      where: { id },
    });
  }
}
