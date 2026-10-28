// Números das regras de negócio que a tela mostra ao usuário (docs/regras-de-negocio.md).
//
// Quem decide aprovação é a API, pela variável NOTA_DE_CORTE do .env. Estes valores só servem
// para o texto "acerte 4 de 5". Mudou a nota de corte na API, muda aqui também.
export const NOTA_DE_CORTE = 70;
export const QUESTOES_POR_NIVEL = 5;

export const ACERTOS_PARA_PASSAR = Math.ceil((NOTA_DE_CORTE / 100) * QUESTOES_POR_NIVEL);

export function acertos(percentual: number): number {
  return Math.round((percentual / 100) * QUESTOES_POR_NIVEL);
}
