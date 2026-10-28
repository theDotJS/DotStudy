import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService, RespostaDeAutenticacao } from './auth.service.js';
import { EntrarDto } from './dto/entrar.dto.js';
import { RegistrarDto } from './dto/registrar.dto.js';

// Contrato: docs/contrato-api.md, POST /auth/register e POST /auth/login.
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  registrar(@Body() dados: RegistrarDto): Promise<RespostaDeAutenticacao> {
    return this.auth.registrar(dados);
  }

  // Login nao cria nada, entao devolve 200 e nao o 201 padrao do @Post.
  @Post('login')
  @HttpCode(200)
  entrar(@Body() dados: EntrarDto): Promise<RespostaDeAutenticacao> {
    return this.auth.entrar(dados);
  }
}
