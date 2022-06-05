import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['fdsffsdfjklfsdn'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation pipe za DTO prilikom post/put/patch etc request-a
      // security prilikom kreiranja usera npr, nebitno koliko drugih property-ja posaljemo, u bazi ce biti upisan samo email i password, ujedno su i obavezni !!
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Cars value')
    .setDescription('API description')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/api', app, document);

  await app.listen(3000);
}
bootstrap();
