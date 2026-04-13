import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('🚀 Starting app...');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(cookieParser.default());

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('LsGesso API')
    .setDescription(
      'API de gestão de pedidos, produtos e funcionários da LsGesso.\n\n' +
      '**Autenticação:** Use o endpoint `POST /auth/login` com email e código admin. ' +
      'O cookie `access_token` será setado automaticamente e enviado nas próximas requisições.',
    )
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      withCredentials: true,
    },
  });

  const port = Number(process.env.PORT);
  if (!port) {
    throw new Error('PORT not defined');
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🔥 Listening on port ${port}`);
  console.log(`📄 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
