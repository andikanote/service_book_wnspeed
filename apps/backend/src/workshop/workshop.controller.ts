import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkshopService } from './workshop.service';

@UseGuards(AuthGuard('jwt'))
@Controller('workshop')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get('stats')
  async getStats() {
    return this.workshopService.getDashboardStats();
  }

  @Get('bays')
  async getBays() {
    return this.workshopService.getBays();
  }

  @Patch('bays/:bayNumber')
  async updateBay(@Param('bayNumber') bayNumber: string, @Body() body: any) {
    return this.workshopService.updateBay(Number(bayNumber), body);
  }

  @Post('emergency')
  async createEmergency(@Body() body: any) {
    return this.workshopService.createEmergencyRequest(body);
  }
}
