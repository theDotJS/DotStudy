import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { ErroApi } from '../comum/erro-api.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EntrarDto } from './dto/entrar.dto.js';
import { RegistrarDto } from './dto/registrar.dto.js';

export interface RespostaDeAutenticacao {
  token: string;
  usuario: { id: string; nome: string; email: string };
}

// Hash calculado uma vez, usado quando o e-mail do login nao existe.
// Sem ele, "e-mail inexistente" responde mais rapido que "senha errada",
// e o tempo de resposta entregaria quem tem conta (mesmo motivo da mensagem unica de 401).
const hashFalso = argon2.hash('senha-que-nunca-confere');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async registrar(dados: RegistrarDto): Promise<RespostaDeAutenticacao> {
    // RN-14: senha nunca em texto puro. argon2id e o algoritmo que a OWASP recomenda primeiro.
    const senhaHash = await argon2.hash(dados.senha);

    try {
      const usuario = await this.prisma.usuario.create({
        data: { nome: dados.nome, email: dados.email, senhaHash },
      });
      return this.responder(usuario);
    } catch (erro) {
      // RN-13: o banco tem e-mail @unique. P2002 e o codigo do Prisma para violacao de unicidade.
      // Conferir pelo banco (e nao com um findUnique antes) evita a corrida de dois cadastros simultaneos.
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
      ) {
        throw new ErroApi(
          409,
          'EMAIL_JA_CADASTRADO',
          'Já existe uma conta com este e-mail.',
        );
      }
      throw erro;
    }
  }

  async entrar(dados: EntrarDto): Promise<RespostaDeAutenticacao> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dados.email },
    });
    const senhaConfere = await argon2.verify(
      usuario?.senhaHash ?? (await hashFalso),
      dados.senha,
    );

    if (!usuario || !senhaConfere) {
      // Contrato: a mensagem e sempre a mesma, exista o e-mail ou nao.
      throw new ErroApi(
        401,
        'CREDENCIAIS_INVALIDAS',
        'E-mail ou senha incorretos.',
      );
    }
    return this.responder(usuario);
  }

  private async responder(usuario: {
    id: string;
    nome: string;
    email: string;
  }): Promise<RespostaDeAutenticacao> {
    // `sub` (subject) e o nome padrao do JWT para "de quem e este token".
    const token = await this.jwt.signAsync({ sub: usuario.id });
    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    };
  }
}
