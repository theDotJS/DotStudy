import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErroApi } from '../comum/erro-api.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { calcularEstados, EstadoNivel } from '../regras/progressao.js';

// Aceita o cliente normal ou o de dentro de uma transacao ($transaction).
// A submissao (NiveisService) consulta o estado DENTRO da transacao que grava a conclusao.
type Banco = PrismaService | Prisma.TransactionClient;

export interface NivelComEstado {
  nivelId: string;
  ordem: number;
  titulo: string;
  estado: EstadoNivel;
  melhorPercentual: number | null;
}

@Injectable()
export class ProgressoService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /me/progress. Sem trilhaId, usa a trilha mais antiga: no MVP so existe uma.
  async progresso(usuarioId: string, trilhaId?: string) {
    const trilha = trilhaId
      ? await this.prisma.trilha.findUnique({
          where: { id: trilhaId },
          select: { id: true },
        })
      : await this.prisma.trilha.findFirst({
          orderBy: { criadoEm: 'asc' },
          select: { id: true },
        });
    if (!trilha)
      throw new ErroApi(404, 'TRILHA_NAO_ENCONTRADA', 'Trilha não encontrada.');

    return {
      trilhaId: trilha.id,
      niveis: await this.estadosDaTrilha(usuarioId, trilha.id),
    };
  }

  async estadosDaTrilha(
    usuarioId: string,
    trilhaId: string,
    banco: Banco = this.prisma,
  ): Promise<NivelComEstado[]> {
    const niveis = await banco.nivel.findMany({
      where: { trilhaId },
      orderBy: { ordem: 'asc' },
      select: {
        id: true,
        ordem: true,
        titulo: true,
        // RN-16: so as conclusoes DESTE usuario. O filtro e o que impede A de ver o progresso de B.
        conclusoes: {
          where: { usuarioId },
          select: { melhorPercentual: true },
        },
      },
    });

    const concluidos = new Set(
      niveis.filter((n) => n.conclusoes.length > 0).map((n) => n.id),
    );
    const estados = calcularEstados(niveis, concluidos);

    return niveis.map((nivel) => ({
      nivelId: nivel.id,
      ordem: nivel.ordem,
      titulo: nivel.titulo,
      estado: estados.get(nivel.id)!,
      melhorPercentual: nivel.conclusoes[0]?.melhorPercentual ?? null,
    }));
  }

  // RN-07: nivel bloqueado nao abre e nao aceita submissao. A conferencia e no servidor:
  // o front esconder o botao e conveniencia, nao protecao.
  async garantirAcesso(
    usuarioId: string,
    nivel: { id: string; trilhaId: string },
    banco: Banco = this.prisma,
  ) {
    const niveis = await this.estadosDaTrilha(usuarioId, nivel.trilhaId, banco);
    const estado = niveis.find((n) => n.nivelId === nivel.id)?.estado;
    if (estado === 'bloqueado') {
      throw new ErroApi(
        403,
        'NIVEL_BLOQUEADO',
        'Conclua o nível anterior para abrir este.',
      );
    }
    return { estado: estado!, niveis };
  }
}
