import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErroApi } from '../comum/erro-api.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProgressoService } from '../progresso/progresso.service.js';
import { corrigir, verificarRespostas } from '../regras/correcao.js';
import { melhorPercentual, proximoNivel } from '../regras/progressao.js';
import { SubmeterDto } from './dto/submeter.dto.js';

@Injectable()
export class NiveisService {
  private readonly notaDeCorte: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly progresso: ProgressoService,
    config: ConfigService,
  ) {
    // Regra de negocios, secao 3: a nota de corte mora no .env, nunca dentro de uma funcao.
    const nota = Number(config.get<string>('NOTA_DE_CORTE') ?? 70);
    if (!Number.isInteger(nota) || nota < 0 || nota > 100) {
      throw new Error(
        `NOTA_DE_CORTE invalida no .env: precisa ser um inteiro de 0 a 100.`,
      );
    }
    this.notaDeCorte = nota;
  }

  // GET /levels/:id
  async detalhar(usuarioId: string, nivelId: string) {
    const nivel = await this.prisma.nivel.findUnique({
      where: { id: nivelId },
      select: {
        id: true,
        trilhaId: true,
        ordem: true,
        titulo: true,
        conteudo: true,
        fontes: { select: { titulo: true, url: true } },
        questoes: {
          orderBy: { ordem: 'asc' },
          select: {
            id: true,
            enunciado: true,
            // RN-09: `correta` fica de fora DE PROPOSITO. Este select e a unica coisa que
            // impede o gabarito de aparecer no inspetor do navegador. Nao troque por `include`.
            alternativas: {
              orderBy: { rotulo: 'asc' },
              select: { rotulo: true, texto: true },
            },
          },
        },
      },
    });
    if (!nivel)
      throw new ErroApi(404, 'NIVEL_NAO_ENCONTRADO', 'Nível não encontrado.');

    await this.progresso.garantirAcesso(usuarioId, nivel);

    return {
      id: nivel.id,
      ordem: nivel.ordem,
      titulo: nivel.titulo,
      conteudo: nivel.conteudo,
      fontes: nivel.fontes,
      questoes: nivel.questoes.map((q) => ({
        id: q.id,
        enunciado: q.enunciado,
        alternativas: q.alternativas.map((a) => ({
          id: a.rotulo,
          texto: a.texto,
        })),
      })),
    };
  }

  // POST /levels/:id/submit
  //
  // RN-12: tudo acontece numa transacao so. Se qualquer passo falhar, nada fica gravado:
  // nem tentativa pela metade, nem conclusao sem tentativa.
  // "Liberar o proximo nivel" nao e uma escrita separada: o estado e calculado a partir
  // das conclusoes (regras/progressao.ts). Gravar a conclusao JA libera o proximo.
  submeter(usuarioId: string, nivelId: string, { respostas }: SubmeterDto) {
    return this.prisma.$transaction(async (tx) => {
      const nivel = await tx.nivel.findUnique({
        where: { id: nivelId },
        select: {
          id: true,
          trilhaId: true,
          ordem: true,
          questoes: {
            orderBy: { ordem: 'asc' },
            select: {
              id: true,
              alternativas: { select: { rotulo: true, correta: true } },
            },
          },
        },
      });
      if (!nivel)
        throw new ErroApi(404, 'NIVEL_NAO_ENCONTRADO', 'Nível não encontrado.');

      // RN-07: nivel bloqueado recusa submissao.
      const { niveis } = await this.progresso.garantirAcesso(
        usuarioId,
        nivel,
        tx,
      );

      const problema = verificarRespostas(nivel.questoes, respostas);
      if (problema?.tipo === 'incompletas') {
        throw new ErroApi(
          422,
          'RESPOSTAS_INCOMPLETAS',
          'Responda todas as questões antes de enviar.',
          {
            respostas: `Faltam ${problema.questoesSemResposta.length} questão(ões).`,
          },
        );
      }
      if (problema?.tipo === 'invalidas') {
        throw new ErroApi(422, 'RESPOSTAS_INVALIDAS', problema.motivo);
      }

      // RN-08: a correcao e aqui, no servidor.
      const resultado = corrigir(nivel.questoes, respostas, this.notaDeCorte);

      // RN-04: tentativas ilimitadas, cada uma vira uma linha (material para a monografia).
      await tx.tentativa.create({
        data: {
          usuarioId,
          nivelId: nivel.id,
          acertos: resultado.acertos,
          total: resultado.total,
          percentual: resultado.percentual,
          aprovado: resultado.aprovado,
        },
      });

      let proximoNivelLiberado: { id: string; ordem: number } | null = null;

      if (resultado.aprovado) {
        const anterior = await tx.conclusaoNivel.findUnique({
          where: { usuarioId_nivelId: { usuarioId, nivelId: nivel.id } },
          select: { melhorPercentual: true },
        });
        const jaConcluido = anterior !== null;

        await tx.conclusaoNivel.upsert({
          where: { usuarioId_nivelId: { usuarioId, nivelId: nivel.id } },
          create: {
            usuarioId,
            nivelId: nivel.id,
            melhorPercentual: resultado.percentual,
          },
          // RN-05: refazer nunca diminui a pontuacao.
          update: {
            melhorPercentual: melhorPercentual(
              anterior?.melhorPercentual ?? null,
              resultado.percentual,
            ),
          },
        });

        // Contrato: null quando o nivel ja estava concluido ou era o ultimo da trilha.
        if (!jaConcluido) {
          const proximo = proximoNivel(
            niveis.map((n) => ({ id: n.nivelId, ordem: n.ordem })),
            nivel,
          );
          proximoNivelLiberado = proximo
            ? { id: proximo.id, ordem: proximo.ordem }
            : null;
        }
      }
      // RN-04: reprovar nao grava nada alem da tentativa. Nada fica bloqueado.

      return {
        ...resultado,
        notaDeCorte: this.notaDeCorte,
        proximoNivelLiberado,
      };
    });
  }
}
