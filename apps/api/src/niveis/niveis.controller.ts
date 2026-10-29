import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  UsuarioAtual,
  type UsuarioDoToken,
} from '../auth/auth.guard.js';
import { SubmeterDto } from './dto/submeter.dto.js';
import { NiveisService } from './niveis.service.js';

// Contrato: GET /levels/:id e POST /levels/:id/submit. As duas protegidas.
//
// Nao existe rota de "concluir nivel". A conclusao e consequencia da aprovacao
// na submissao. Uma rota separada seria um jeito de pular nivel sem responder nada.
@Controller('levels')
@UseGuards(AuthGuard)
export class NiveisController {
  constructor(private readonly niveis: NiveisService) {}

  @Get(':id')
  detalhar(@UsuarioAtual() usuario: UsuarioDoToken, @Param('id') id: string) {
    return this.niveis.detalhar(usuario.id, id);
  }

  // 200 e nao 201: a resposta e o resultado da correcao, nao um recurso criado.
  @Post(':id/submit')
  @HttpCode(200)
  submeter(
    @UsuarioAtual() usuario: UsuarioDoToken,
    @Param('id') id: string,
    @Body() dados: SubmeterDto,
  ) {
    return this.niveis.submeter(usuario.id, id, dados);
  }
}
