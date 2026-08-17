import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RacersService } from './racers.service';

@UseGuards(AuthGuard('jwt'))
@Controller('racer/profile')
export class RacerProfileController {
  constructor(private readonly racersService: RacersService) {}

  @Get()
  async getProfile(@Req() req: any) {
    const userId = req.user?.id;
    return this.racersService.getMyProfile(userId);
  }

  @Post()
  async createProfile(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id;
    return this.racersService.createOrUpdateProfile(userId, body);
  }

  @Put()
  async updateProfile(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id;
    return this.racersService.createOrUpdateProfile(userId, body);
  }

  @Patch()
  async patchProfile(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id;
    return this.racersService.createOrUpdateProfile(userId, body);
  }
}
