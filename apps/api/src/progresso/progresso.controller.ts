import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import {
  AuthGuard,
  UsuarioAtual,
  type UsuarioDoToken,
} from '../auth/auth.guard.js';
import { ProgressoService } from './progresso.service.js';

class FiltroDeProgresso {
  @IsOptional()
  @IsString()
  trilhaId?: string;
}

// Contrato: GET /me/progress. Protegida.
@Controller('me')
@UseGuards(AuthGuard)
export class ProgressoController {
  constructor(private readonly progresso: ProgressoService) {}

  @Get('progress')
  meuProgresso(
    @UsuarioAtual() usuario: UsuarioDoToken,
    @Query() filtro: FiltroDeProgresso,
  ) {
    return this.progresso.progresso(usuario.id, filtro.trilhaId);
  }
}
