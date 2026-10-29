import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ErroApi } from './erro-api.js';

// Toda entrada e validada antes de encostar no banco.
// whitelist remove campo que nao esta no DTO; forbidNonWhitelisted recusa a requisicao.
// Tarefa S4 de Seguranca: e a defesa principal contra injecao.
//
// Erro de validacao vira 422 com `campos`, como pede o contrato.
// O codigo vem do `context` do decorador quando existe, por exemplo:
//   @MinLength(8, { context: { codigo: 'SENHA_FRACA' } })
// Sem context, o codigo e DADOS_INVALIDOS.
export function criarPipeDeValidacao(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (erros) => {
      const achatados = achatar(erros);
      const campos: Record<string, string> = {};
      let codigo = 'DADOS_INVALIDOS';

      for (const { caminho, erro } of achatados) {
        const regras = Object.keys(erro.constraints ?? {});
        if (regras.length === 0) continue;
        campos[caminho] ??= erro.constraints![regras[0]];

        const codigoDaRegra = regras
          .map((regra) => erro.contexts?.[regra]?.codigo as string | undefined)
          .find(Boolean);
        if (codigoDaRegra && codigo === 'DADOS_INVALIDOS')
          codigo = codigoDaRegra;
      }

      return new ErroApi(422, codigo, 'Alguns campos estão inválidos.', campos);
    },
  });
}

// ValidationError e uma arvore (objetos e listas aninhados). O front precisa
// de uma lista plana: { "respostas.0.questaoId": "..." }.
function achatar(
  erros: ValidationError[],
  prefixo = '',
): { caminho: string; erro: ValidationError }[] {
  return erros.flatMap((erro) => {
    const caminho = prefixo ? `${prefixo}.${erro.property}` : erro.property;
    return [{ caminho, erro }, ...achatar(erro.children ?? [], caminho)];
  });
}
