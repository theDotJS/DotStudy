// Formas das respostas que a tela de nível consome. Copiadas de docs/contrato-api.md:
// mudou lá, muda aqui.

// GET /levels/:id. As alternativas chegam sem gabarito (RN-09).
export interface NivelCompleto {
  id: string;
  ordem: number;
  titulo: string;
  conteudo: string;
  fontes: { titulo: string; url: string }[];
  questoes: {
    id: string;
    enunciado: string;
    alternativas: { id: string; texto: string }[];
  }[];
}

// POST /levels/:id/submit
export interface ResultadoDaSubmissao {
  acertos: number;
  total: number;
  percentual: number;
  notaDeCorte: number;
  aprovado: boolean;
  porQuestao: { questaoId: string; correta: boolean }[];
  proximoNivelLiberado: { id: string; ordem: number } | null;
}
