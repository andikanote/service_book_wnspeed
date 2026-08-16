import { Injectable } from '@nestjs/common';
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
    return this.prisma.servicePackage.create({
      data: {
        name: data.name,
        category: data.category,
        durationMinutes: data.durationMinutes,
        price: data.price,
        isPopular: data.isPopular || false,
        description: data.description,
        includesItems: data.includesItems || [],
      },
    });
  }
}
