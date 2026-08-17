import { Module } from '@nestjs/common';
import { RacersService } from './racers.service';
import { RacersController } from './racers.controller';
import { RacerBikesController } from './racer-bikes.controller';
import { RacerProfileController } from './racer-profile.controller';

@Module({
  controllers: [RacersController, RacerBikesController, RacerProfileController],
  providers: [RacersService],
  exports: [RacersService],
})
export class RacersModule {}

