import { Module } from '@nestjs/common';
import { ProgressoModule } from '../progresso/progresso.module.js';
import { NiveisController } from './niveis.controller.js';
import { NiveisService } from './niveis.service.js';

@Module({
  imports: [ProgressoModule],
  controllers: [NiveisController],
  providers: [NiveisService],
})
export class NiveisModule {}
