import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Somente o endereco do frontend pode chamar a API.
  // origin: '*' fica de fora. Tarefa S4 de Seguranca.
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  // Toda entrada e validada antes de encostar no banco.
  // whitelist remove campo que nao esta no DTO; forbidNonWhitelisted recusa a requisicao.
  // Tarefa S4 de Seguranca: e a defesa principal contra injecao.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const porta = Number(process.env.API_PORT ?? 3333);
  await app.listen(porta);
  console.log(`API do DotStudy em http://localhost:${porta}/health`);
}
await bootstrap();
