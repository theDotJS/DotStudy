import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [
    // Le o .env da raiz do repositorio. Um arquivo so para api e web.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env'] }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
