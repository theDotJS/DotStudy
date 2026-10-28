import {
  calcularEstados,
  melhorPercentual,
  proximoNivel,
} from './progressao.js';

// Cada teste cita a regra de docs/regras-de-negocio.md que ele prova.
// Se uma regra mudar no documento, o teste correspondente muda junto.

const niveis = [
  { id: 'n1', ordem: 1 },
  { id: 'n2', ordem: 2 },
  { id: 'n3', ordem: 3 },
];

describe('calcularEstados', () => {
  it('RN-01: sem nada concluido, so o nivel 1 esta disponivel', () => {
    const estados = calcularEstados(niveis, new Set());
    expect([...estados.values()]).toEqual([
      'disponivel',
      'bloqueado',
      'bloqueado',
    ]);
  });

  it('RN-02: concluir o nivel 1 libera o 2 e mantem o 3 bloqueado', () => {
    const estados = calcularEstados(niveis, new Set(['n1']));
    expect(estados.get('n1')).toBe('concluido');
    expect(estados.get('n2')).toBe('disponivel');
    expect(estados.get('n3')).toBe('bloqueado');
  });

  it('RN-02: a ordem vale, nao a posicao na lista recebida', () => {
    const embaralhados = [niveis[2], niveis[0], niveis[1]];
    const estados = calcularEstados(embaralhados, new Set(['n1']));
    expect(estados.get('n2')).toBe('disponivel');
    expect(estados.get('n3')).toBe('bloqueado');
  });

  it('RN-02: ordens com buraco (1, 2, 5) seguem a ordem imediatamente anterior', () => {
    const comBuraco = [
      { id: 'a', ordem: 1 },
      { id: 'b', ordem: 2 },
      { id: 'c', ordem: 5 },
    ];
    expect(calcularEstados(comBuraco, new Set(['a', 'b'])).get('c')).toBe(
      'disponivel',
    );
  });

  it('RN-06: todo estado e um dos tres valores permitidos', () => {
    const estados = calcularEstados(niveis, new Set(['n1', 'n2']));
    for (const estado of estados.values()) {
      expect(['bloqueado', 'disponivel', 'concluido']).toContain(estado);
    }
  });

  it('trilha toda concluida: todos os niveis aparecem como concluido', () => {
    const estados = calcularEstados(niveis, new Set(['n1', 'n2', 'n3']));
    expect([...estados.values()]).toEqual([
      'concluido',
      'concluido',
      'concluido',
    ]);
  });

  it('trilha sem niveis devolve mapa vazio', () => {
    expect(calcularEstados([], new Set()).size).toBe(0);
  });
});

describe('melhorPercentual', () => {
  it('RN-05: refazer com nota menor nao diminui a pontuacao', () => {
    expect(melhorPercentual(100, 80)).toBe(100);
  });

  it('RN-05: refazer com nota maior sobe a pontuacao', () => {
    expect(melhorPercentual(80, 100)).toBe(100);
  });

  it('primeira conclusao usa a nota da tentativa', () => {
    expect(melhorPercentual(null, 80)).toBe(80);
  });
});

describe('proximoNivel', () => {
  it('devolve o nivel de ordem seguinte', () => {
    expect(proximoNivel(niveis, niveis[0])?.id).toBe('n2');
  });

  it('devolve null no ultimo nivel da trilha', () => {
    expect(proximoNivel(niveis, niveis[2])).toBeNull();
  });
});
