import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { HealthController } from './health/health.controller.js';
import { NiveisModule } from './niveis/niveis.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProgressoModule } from './progresso/progresso.module.js';
import { TrilhasModule } from './trilhas/trilhas.module.js';

@Module({
  imports: [
    // Le o .env da raiz do repositorio. Um arquivo so para api e web.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env'] }),
    PrismaModule,
    AuthModule,
    TrilhasModule,
    ProgressoModule,
    NiveisModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
