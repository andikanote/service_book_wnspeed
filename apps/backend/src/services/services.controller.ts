import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ServicesService } from './services.service';

@UseGuards(AuthGuard('jwt'))
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAll() {
    return this.servicesService.getAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.servicesService.create(body);
  }
}
