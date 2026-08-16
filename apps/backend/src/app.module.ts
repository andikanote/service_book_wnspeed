import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { InventoryModule } from './inventory/inventory.module';
import { ServicesModule } from './services/services.module';
import { RacersModule } from './racers/racers.module';
import { WorkshopModule } from './workshop/workshop.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BookingsModule,
    InventoryModule,
    ServicesModule,
    RacersModule,
    WorkshopModule,
  ],
})
export class AppModule {}
