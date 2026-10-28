// Formas das respostas que o mapa consome. Copiadas de docs/contrato-api.md:
// mudou lá, muda aqui.

export type EstadoNivel = "bloqueado" | "disponivel" | "concluido";

// GET /me/progress
export interface NivelDoMapa {
  nivelId: string;
  ordem: number;
  titulo: string;
  estado: EstadoNivel;
  melhorPercentual: number | null;
}

export interface RespostaProgresso {
  trilhaId: string;
  niveis: NivelDoMapa[];
}

// GET /tracks
export interface Trilha {
  id: string;
  titulo: string;
  descricao: string;
  totalNiveis: number;
}

export interface RespostaTrilhas {
  trilhas: Trilha[];
}
