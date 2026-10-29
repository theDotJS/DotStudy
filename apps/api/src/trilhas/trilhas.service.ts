import { Injectable } from '@nestjs/common';
import { ErroApi } from '../comum/erro-api.js';
import { PrismaService } from '../prisma/prisma.service.js';

// Rotas de leitura de conteudo (S4). So leitura, sem regra de negocio.
@Injectable()
export class TrilhasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    const trilhas = await this.prisma.trilha.findMany({
      orderBy: { criadoEm: 'asc' },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        _count: { select: { niveis: true } },
      },
    });
    return {
      trilhas: trilhas.map(({ _count, ...trilha }) => ({
        ...trilha,
        totalNiveis: _count.niveis,
      })),
    };
  }

  async listarNiveis(trilhaId: string) {
    const trilha = await this.prisma.trilha.findUnique({
      where: { id: trilhaId },
      select: {
        id: true,
        // Sem `conteudo`: o mapa so precisa de titulo e objetivo. Conteudo vem em GET /levels/:id.
        niveis: {
          orderBy: { ordem: 'asc' },
          select: { id: true, ordem: true, titulo: true, objetivo: true },
        },
      },
    });
    if (!trilha)
      throw new ErroApi(404, 'TRILHA_NAO_ENCONTRADA', 'Trilha não encontrada.');
    return { trilhaId: trilha.id, niveis: trilha.niveis };
  }
}
