import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RacersService } from './racers.service';

@UseGuards(AuthGuard('jwt'))
@Controller('racer/bikes')
export class RacerBikesController {
  constructor(private readonly racersService: RacersService) {}

  @Get()
  async getAll(@Req() req: any) {
    const userId = req.user?.role === 'admin' ? undefined : req.user?.id;
    return this.racersService.getAllBikes(userId);
  }

  @Get('primary')
  async getPrimary(@Req() req: any) {
    const userId = req.user?.id;
    return this.racersService.getPrimaryBike(userId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.racersService.getBikeById(id);
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id;
    return this.racersService.createBike({
      ...body,
      userId,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.racersService.updateBike(id, body);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() body: any) {
    return this.racersService.updateBike(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.racersService.deleteBike(id);
  }

  @Patch(':id/primary')
  async setPrimary(@Param('id') id: string) {
    return this.racersService.setPrimaryBike(id);
  }
}
