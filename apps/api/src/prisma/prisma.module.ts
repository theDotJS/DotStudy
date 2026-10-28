import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// Global: os outros modulos usam o PrismaService sem precisar importar este modulo.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
