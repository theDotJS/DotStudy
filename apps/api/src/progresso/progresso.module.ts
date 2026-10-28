import { Module } from '@nestjs/common';
import { ProgressoController } from './progresso.controller.js';
import { ProgressoService } from './progresso.service.js';

@Module({
  controllers: [ProgressoController],
  providers: [ProgressoService],
  exports: [ProgressoService],
})
export class ProgressoModule {}
