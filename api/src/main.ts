import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('🚀 Starting app...');

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser.default());

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  const port = Number(process.env.PORT);
  if (!port) {
    throw new Error('PORT not defined');
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🔥 Listening on port ${port}`);
}

bootstrap();
