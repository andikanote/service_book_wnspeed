import { Injectable, NotFoundException } from '@nestjs/common';
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
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');

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
    let status: InventoryStatus = 'In_Stock';
    if (data.stock === 0) {
      status = 'Critical_Out';
    } else if (data.stock <= data.minThreshold) {
      status = 'Low_Stock';
    }

    return this.prisma.inventoryItem.create({
      data: {
        sku: data.sku,
        name: data.name,
        category: data.category,
        stock: data.stock,
        minThreshold: data.minThreshold,
        price: data.price,
        supplier: data.supplier,
        location: data.location,
        status: status,
      },
    });
  }
}
