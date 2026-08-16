import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';

@UseGuards(AuthGuard('jwt'))
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getAll() {
    return this.inventoryService.getAllItems();
  }

  @Patch(':id/restock')
  async restock(@Param('id') id: string, @Body('amount') amount: number) {
    return this.inventoryService.restockItem(id, Number(amount));
  }

  @Post()
  async add(@Body() body: any) {
    return this.inventoryService.addItem(body);
  }
}
