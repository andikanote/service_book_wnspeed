import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServicesService } from './services.service';

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
