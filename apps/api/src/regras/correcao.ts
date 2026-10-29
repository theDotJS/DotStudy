// Regras de correcao do exercicio (docs/regras-de-negocio.md, secoes 3 e 4).
//
// RN-08: este arquivo so roda no servidor. O gabarito entra aqui e nunca sai
// para o navegador antes da submissao (RN-09).

export interface QuestaoComGabarito {
  id: string;
  alternativas: { rotulo: string; correta: boolean }[];
}

export interface Resposta {
  questaoId: string;
  alternativaId: string; // o rotulo: "a", "b", "c", "d"
}

export interface ResultadoDaCorrecao {
  acertos: number;
  total: number;
  percentual: number;
  aprovado: boolean;
  porQuestao: { questaoId: string; correta: boolean }[];
}

// Problema nas respostas enviadas. Quem chama decide o codigo HTTP.
export type ProblemaNasRespostas =
  | { tipo: 'incompletas'; questoesSemResposta: string[] }
  | { tipo: 'invalidas'; motivo: string };

export function verificarRespostas(
  questoes: QuestaoComGabarito[],
  respostas: Resposta[],
): ProblemaNasRespostas | null {
  const porId = new Map(questoes.map((q) => [q.id, q]));
  const respondidas = new Set<string>();

  for (const resposta of respostas) {
    const questao = porId.get(resposta.questaoId);
    if (!questao) {
      return {
        tipo: 'invalidas',
        motivo: `A questão ${resposta.questaoId} não é deste nível.`,
      };
    }
    if (respondidas.has(resposta.questaoId)) {
      return {
        tipo: 'invalidas',
        motivo: `A questão ${resposta.questaoId} foi respondida duas vezes.`,
      };
    }
    if (
      !questao.alternativas.some((a) => a.rotulo === resposta.alternativaId)
    ) {
      return {
        tipo: 'invalidas',
        motivo: `A alternativa "${resposta.alternativaId}" não existe na questão ${resposta.questaoId}.`,
      };
    }
    respondidas.add(resposta.questaoId);
  }

  const questoesSemResposta = questoes
    .filter((q) => !respondidas.has(q.id))
    .map((q) => q.id);
  if (questoesSemResposta.length > 0)
    return { tipo: 'incompletas', questoesSemResposta };

  return null;
}

// Pressupoe respostas ja conferidas por verificarRespostas.
export function corrigir(
  questoes: QuestaoComGabarito[],
  respostas: Resposta[],
  notaDeCorte: number,
): ResultadoDaCorrecao {
  if (questoes.length === 0) {
    // Nivel sem questao e erro de conteudo, nao do usuario. Aprovar por padrao
    // seria um jeito de pular nivel sem responder nada.
    throw new Error('Nível sem questões não pode ser corrigido.');
  }

  const escolhida = new Map(
    respostas.map((r) => [r.questaoId, r.alternativaId]),
  );

  const porQuestao = questoes.map((questao) => {
    const rotulo = escolhida.get(questao.id);
    const correta = questao.alternativas.some(
      (a) => a.rotulo === rotulo && a.correta,
    );
    return { questaoId: questao.id, correta };
  });

  const acertos = porQuestao.filter((q) => q.correta).length;
  const total = questoes.length;
  // RN-10: acertos / total, arredondado para baixo. Conta em inteiros para
  // nao depender de arredondamento de ponto flutuante (4/5 tem que dar 80, nao 79).
  const percentual = Math.floor((acertos * 100) / total);
  // RN-03: concluido com a nota de corte OU MAIS.
  const aprovado = percentual >= notaDeCorte;

  return { acertos, total, percentual, aprovado, porQuestao };
}
