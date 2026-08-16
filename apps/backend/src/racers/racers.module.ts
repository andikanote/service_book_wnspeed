import { Module } from '@nestjs/common';
import { RacersService } from './racers.service';
import { RacersController } from './racers.controller';
import { RacerBikesController } from './racer-bikes.controller';

@Module({
  controllers: [RacersController, RacerBikesController],
  providers: [RacersService],
  exports: [RacersService],
})
export class RacersModule {}

