import {
  corrigir,
  QuestaoComGabarito,
  Resposta,
  verificarRespostas,
} from './correcao.js';

// Cinco questoes, a alternativa correta e sempre a "a".
const questoes: QuestaoComGabarito[] = ['q1', 'q2', 'q3', 'q4', 'q5'].map(
  (id) => ({
    id,
    alternativas: [
      { rotulo: 'a', correta: true },
      { rotulo: 'b', correta: false },
      { rotulo: 'c', correta: false },
    ],
  }),
);

// Monta respostas acertando as `acertos` primeiras e errando o resto.
function responder(acertos: number): Resposta[] {
  return questoes.map((q, i) => ({
    questaoId: q.id,
    alternativaId: i < acertos ? 'a' : 'b',
  }));
}

const NOTA_DE_CORTE = 70;

describe('corrigir', () => {
  it('RN-03: 4 de 5 (80%) aprova com nota de corte 70', () => {
    const r = corrigir(questoes, responder(4), NOTA_DE_CORTE);
    expect(r).toMatchObject({
      acertos: 4,
      total: 5,
      percentual: 80,
      aprovado: true,
    });
  });

  it('RN-03: 3 de 5 (60%) reprova com nota de corte 70', () => {
    const r = corrigir(questoes, responder(3), NOTA_DE_CORTE);
    expect(r).toMatchObject({ acertos: 3, percentual: 60, aprovado: false });
  });

  it('RN-03: atingir exatamente a nota de corte aprova', () => {
    expect(corrigir(questoes, responder(4), 80).aprovado).toBe(true);
  });

  it('criterio da checklist: 69% reprova e 70% aprova', () => {
    // 100 questoes para o percentual andar de 1 em 1.
    const cem: QuestaoComGabarito[] = Array.from({ length: 100 }, (_, i) => ({
      id: `q${i}`,
      alternativas: [
        { rotulo: 'a', correta: true },
        { rotulo: 'b', correta: false },
      ],
    }));
    const acertando = (n: number) =>
      cem.map((q, i) => ({
        questaoId: q.id,
        alternativaId: i < n ? 'a' : 'b',
      }));

    expect(corrigir(cem, acertando(69), NOTA_DE_CORTE)).toMatchObject({
      percentual: 69,
      aprovado: false,
    });
    expect(corrigir(cem, acertando(70), NOTA_DE_CORTE)).toMatchObject({
      percentual: 70,
      aprovado: true,
    });
  });

  it('RN-10: percentual arredonda para baixo (2 de 3 = 66, nao 67)', () => {
    const tres = questoes.slice(0, 3);
    const r = corrigir(
      tres,
      tres.map((q, i) => ({
        questaoId: q.id,
        alternativaId: i < 2 ? 'a' : 'b',
      })),
      NOTA_DE_CORTE,
    );
    expect(r.percentual).toBe(66);
  });

  it('RN-11: devolve, por questao, se acertou', () => {
    const r = corrigir(questoes, responder(2), NOTA_DE_CORTE);
    expect(r.porQuestao.map((q) => q.correta)).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
  });

  it('a nota de corte vem de fora: mudar o numero muda o resultado sem mudar codigo', () => {
    expect(corrigir(questoes, responder(3), 60).aprovado).toBe(true);
    expect(corrigir(questoes, responder(3), 70).aprovado).toBe(false);
  });

  it('nivel sem questao nao e aprovado por padrao', () => {
    expect(() => corrigir([], [], NOTA_DE_CORTE)).toThrow();
  });
});

describe('verificarRespostas', () => {
  it('aceita uma resposta valida para cada questao', () => {
    expect(verificarRespostas(questoes, responder(5))).toBeNull();
  });

  it('acusa questao sem resposta', () => {
    const problema = verificarRespostas(questoes, responder(5).slice(0, 4));
    expect(problema).toEqual({
      tipo: 'incompletas',
      questoesSemResposta: ['q5'],
    });
  });

  it('recusa questao de outro nivel', () => {
    const respostas = [
      ...responder(5),
      { questaoId: 'outra', alternativaId: 'a' },
    ];
    expect(verificarRespostas(questoes, respostas)?.tipo).toBe('invalidas');
  });

  it('recusa a mesma questao respondida duas vezes', () => {
    const respostas = [
      ...responder(5),
      { questaoId: 'q1', alternativaId: 'b' },
    ];
    expect(verificarRespostas(questoes, respostas)?.tipo).toBe('invalidas');
  });

  it('recusa alternativa que nao existe na questao', () => {
    const respostas = responder(5);
    respostas[0] = { questaoId: 'q1', alternativaId: 'z' };
    expect(verificarRespostas(questoes, respostas)?.tipo).toBe('invalidas');
  });
});
