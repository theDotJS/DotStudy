import {
  CanActivate,
  ExecutionContext,
  Injectable,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { ErroApi } from '../comum/erro-api.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface UsuarioDoToken {
  id: string;
}

interface RequisicaoAutenticada extends Request {
  usuario?: UsuarioDoToken;
}

// Rota protegida: coloque @UseGuards(AuthGuard) no controller ou no metodo.
// Sem token valido, a requisicao para aqui com 401 e nunca chega na rota.
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const requisicao = contexto
      .switchToHttp()
      .getRequest<RequisicaoAutenticada>();
    const [tipo, token] = requisicao.headers.authorization?.split(' ') ?? [];
    if (tipo !== 'Bearer' || !token) {
      throw new ErroApi(401, 'NAO_AUTENTICADO', 'Faça login para continuar.');
    }

    let usuarioId: string;
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token);
      usuarioId = payload.sub;
    } catch {
      // Assinatura errada, token adulterado ou expirado: tudo vira o mesmo 401.
      throw new ErroApi(
        401,
        'NAO_AUTENTICADO',
        'Sessão expirada ou inválida. Faça login de novo.',
      );
    }

    // Token valido de uma conta que nao existe mais nao pode passar.
    const existe = await this.prisma.usuario.count({
      where: { id: usuarioId },
    });
    if (!existe) {
      throw new ErroApi(
        401,
        'NAO_AUTENTICADO',
        'Sessão expirada ou inválida. Faça login de novo.',
      );
    }

    requisicao.usuario = { id: usuarioId };
    return true;
  }
}

// RN-16: o id do usuario vem SEMPRE do token, nunca da URL nem do corpo.
// Assim nao existe requisicao em que A pede o progresso de B.
//   meuProgresso(@UsuarioAtual() usuario: UsuarioDoToken)
export const UsuarioAtual = createParamDecorator(
  (_: unknown, contexto: ExecutionContext): UsuarioDoToken => {
    const requisicao = contexto
      .switchToHttp()
      .getRequest<RequisicaoAutenticada>();
    if (!requisicao.usuario) {
      // So acontece se alguem usar @UsuarioAtual numa rota sem @UseGuards(AuthGuard).
      throw new Error('@UsuarioAtual usado em rota sem AuthGuard.');
    }
    return requisicao.usuario;
  },
);
