import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // CORS for frontend apps/cms-admin
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 [ART N SPEED API] Backend running on: http://localhost:${port}/api/v1`);
}
bootstrap();
