import { Module } from '@nestjs/common';
import { RacersService } from './racers.service';
import { RacersController } from './racers.controller';

@Module({
  controllers: [RacersController],
  providers: [RacersService],
  exports: [RacersService],
})
export class RacersModule {}
