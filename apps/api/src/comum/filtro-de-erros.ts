import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ErroApi } from './erro-api.js';

// Codigo generico por status, usado quando a excecao nao veio de um ErroApi
// (rota inexistente, JSON malformado, erro do proprio Nest).
const CODIGO_POR_STATUS: Record<number, string> = {
  400: 'REQUISICAO_MALFORMADA',
  401: 'NAO_AUTENTICADO',
  403: 'ACESSO_NEGADO',
  404: 'NAO_ENCONTRADO',
  409: 'CONFLITO',
  413: 'REQUISICAO_GRANDE_DEMAIS',
  422: 'DADOS_INVALIDOS',
  429: 'TENTATIVAS_EXCEDIDAS',
};

// Contrato, secao 2: "Toda falha, de qualquer rota, devolve exatamente esta forma.
// Sem excecao, sem stack trace." Este filtro e o unico lugar que monta a resposta de erro.
@Catch()
export class FiltroDeErros implements ExceptionFilter {
  private readonly logger = new Logger('Erro');

  catch(excecao: unknown, host: ArgumentsHost) {
    const resposta = host.switchToHttp().getResponse<Response>();

    if (excecao instanceof ErroApi) {
      const campos = excecao.campos ? { campos: excecao.campos } : {};
      resposta.status(excecao.getStatus()).json({
        erro: { codigo: excecao.codigo, mensagem: excecao.message, ...campos },
      });
      return;
    }

    if (excecao instanceof HttpException) {
      const status = excecao.getStatus();
      resposta.status(status).json({
        erro: {
          codigo: CODIGO_POR_STATUS[status] ?? 'ERRO_HTTP',
          mensagem: mensagemPadrao(status),
        },
      });
      return;
    }

    // Erro nao previsto: o detalhe vai para o terminal da API, nunca para o navegador.
    this.logger.error(
      excecao instanceof Error ? (excecao.stack ?? excecao.message) : excecao,
    );
    resposta.status(500).json({
      erro: {
        codigo: 'ERRO_INTERNO',
        mensagem: 'Erro inesperado. Tente de novo.',
      },
    });
  }
}

function mensagemPadrao(status: number): string {
  if (status === 400) return 'Requisição malformada.';
  if (status === 401) return 'Faça login para continuar.';
  if (status === 403) return 'Você não tem acesso a este recurso.';
  if (status === 404) return 'Recurso não encontrado.';
  if (status === 429) return 'Muitas tentativas. Aguarde e tente de novo.';
  return 'Não foi possível concluir a requisição.';
}
