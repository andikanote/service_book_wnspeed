import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { RacersService } from './racers.service';

@Controller('racers')
export class RacersController {
  constructor(private readonly racersService: RacersService) {}

  @Get()
  async getAll() {
    return this.racersService.getAllRacers();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.racersService.getRacerById(id);
  }

  @Patch('diagnostics/:bikeId')
  async updateDiagnostics(@Param('bikeId') bikeId: string, @Body() data: any) {
    return this.racersService.updateDiagnostics(bikeId, data);
  }
}
