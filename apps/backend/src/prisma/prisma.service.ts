import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connected to PostgreSQL Database successfully!');
    } catch (error) {
      this.logger.warn(
        '⚠️ PostgreSQL database belum terhubung / belum aktif di DATABASE_URL. Server tetap berjalan.',
      );
      this.logger.debug(error?.message || error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Disconnected from PostgreSQL Database');
  }
}
