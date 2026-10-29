// Regras de progressao (docs/regras-de-negocio.md, secao 2).
//
// Funcoes puras: recebem dados, devolvem resultado, nao tocam no banco.
// Por isso podem ser testadas sem Postgres (progressao.spec.ts) e qualquer
// pessoa do time consegue conferir a regra lendo so este arquivo.

// RN-06: tres estados possiveis, nenhum outro.
export type EstadoNivel = 'bloqueado' | 'disponivel' | 'concluido';

export interface NivelOrdenavel {
  id: string;
  ordem: number;
}

// Calcula o estado de cada nivel de UMA trilha para UM usuario.
//
// O estado nao e gravado no banco: ele e deduzido das conclusoes. Assim nao
// existe como o banco dizer "disponivel" e as conclusoes dizerem outra coisa.
export function calcularEstados(
  niveis: NivelOrdenavel[],
  idsConcluidos: ReadonlySet<string>,
): Map<string, EstadoNivel> {
  const emOrdem = [...niveis].sort((a, b) => a.ordem - b.ordem);
  const estados = new Map<string, EstadoNivel>();

  emOrdem.forEach((nivel, indice) => {
    if (idsConcluidos.has(nivel.id)) {
      estados.set(nivel.id, 'concluido');
      return;
    }
    // RN-01: o primeiro nivel comeca sempre disponivel.
    // RN-02: os outros abrem quando o de ordem imediatamente anterior esta concluido.
    const anterior = emOrdem[indice - 1];
    const liberado = indice === 0 || idsConcluidos.has(anterior.id);
    estados.set(nivel.id, liberado ? 'disponivel' : 'bloqueado');
  });

  return estados;
}

// RN-05: refazer um nivel concluido nao diminui a pontuacao.
export function melhorPercentual(
  anterior: number | null,
  novo: number,
): number {
  return anterior === null ? novo : Math.max(anterior, novo);
}

// O nivel seguinte na ordem, ou null quando `atual` e o ultimo da trilha.
export function proximoNivel<T extends NivelOrdenavel>(
  niveis: T[],
  atual: NivelOrdenavel,
): T | null {
  const seguintes = niveis
    .filter((n) => n.ordem > atual.ordem)
    .sort((a, b) => a.ordem - b.ordem);
  return seguintes[0] ?? null;
}
