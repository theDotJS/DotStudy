import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configurarApp } from './configurar-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configurarApp(app);

  const porta = Number(process.env.API_PORT ?? 3333);
  await app.listen(porta);
  console.log(`API do DotStudy em http://localhost:${porta}/health`);
}
await bootstrap();
