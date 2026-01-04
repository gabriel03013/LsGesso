import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 Starting app...');

  const app = await NestFactory.create(AppModule);

  console.log('✅ Nest created');

  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🔥 Listening on port ${port}`);
}

bootstrap();
