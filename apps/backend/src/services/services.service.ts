import { BadRequestException, Injectable } from '@nestjs/common';
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
}
