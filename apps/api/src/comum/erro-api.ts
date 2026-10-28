import { HttpException } from '@nestjs/common';

// Erro com o formato unico do contrato (docs/contrato-api.md, secao 2):
// { "erro": { "codigo": "...", "mensagem": "...", "campos": { ... } } }
//
// Toda rota lanca ErroApi quando a falha e prevista. O FiltroDeErros
// transforma qualquer outra excecao nesse mesmo formato.
export class ErroApi extends HttpException {
  constructor(
    status: number,
    readonly codigo: string,
    mensagem: string,
    readonly campos?: Record<string, string>,
  ) {
    super(mensagem, status);
  }
}
