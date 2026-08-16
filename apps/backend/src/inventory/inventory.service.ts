import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryStatus } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getAllItems() {
    return this.prisma.inventoryItem.findMany({
      orderBy: { stock: 'asc' },
    });
  }

  async restockItem(id: string, amount: number) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Jumlah restock harus berupa angka positif lebih dari 0');
    }

    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item sparepart dengan ID '${id}' tidak ditemukan`);
    }

    const newStock = item.stock + amount;
    let newStatus: InventoryStatus = 'In_Stock';
    if (newStock === 0) {
      newStatus = 'Critical_Out';
    } else if (newStock <= item.minThreshold) {
      newStatus = 'Low_Stock';
    }

    return this.prisma.inventoryItem.update({
      where: { id },
      data: {
        stock: newStock,
        status: newStatus,
      },
    });
  }

  async addItem(data: {
    sku: string;
    name: string;
    category: string;
    stock: number;
    minThreshold: number;
    price: number;
    supplier?: string;
    location?: string;
  }) {
    if (!data.sku || !data.name || !data.category) {
      throw new BadRequestException('Field SKU, Nama Item, dan Kategori wajib diisi');
    }

    const existing = await this.prisma.inventoryItem.findUnique({
      where: { sku: data.sku },
    });
    if (existing) {
      throw new ConflictException(`Item dengan SKU '${data.sku}' sudah terdaftar (${existing.name})`);
    }

    let status: InventoryStatus = 'In_Stock';
    const stock = Number(data.stock) || 0;
    const minThreshold = Number(data.minThreshold) || 10;

    if (stock === 0) {
      status = 'Critical_Out';
    } else if (stock <= minThreshold) {
      status = 'Low_Stock';
    }

    return this.prisma.inventoryItem.create({
      data: {
        sku: data.sku.trim().toUpperCase(),
        name: data.name.trim(),
        category: data.category.trim(),
        stock: stock,
        minThreshold: minThreshold,
        price: Number(data.price) || 0,
        supplier: data.supplier,
        location: data.location,
        status: status,
      },
    });
  }
}
