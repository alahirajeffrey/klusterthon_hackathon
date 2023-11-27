import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setup validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('Klusterthon hackathon')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/api-doc', app, document);

  await app.listen(Number(process.env.NODE_PORT) || 3001);
}
bootstrap();
