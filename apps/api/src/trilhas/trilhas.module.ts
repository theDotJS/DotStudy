import { Module } from '@nestjs/common';
import { TrilhasController } from './trilhas.controller.js';
import { TrilhasService } from './trilhas.service.js';

@Module({
  controllers: [TrilhasController],
  providers: [TrilhasService],
})
export class TrilhasModule {}
