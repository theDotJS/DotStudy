// Único ponto do front que fala com a API. Contrato: docs/contrato-api.md
//
// Onde o token fica (decisão C1 do contrato) mora só neste arquivo: trocar localStorage por cookie
// custa mexer aqui, e em nenhuma tela.

const URL_DA_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
const CHAVE_DO_TOKEN = "dotstudy.token";

// localStorage pode lançar erro (aba anônima, armazenamento bloqueado). Sem token, a tela manda para o login.
export function lerToken(): string | null {
  try {
    return localStorage.getItem(CHAVE_DO_TOKEN);
  } catch {
    return null;
  }
}

export function salvarToken(token: string): void {
  try {
    localStorage.setItem(CHAVE_DO_TOKEN, token);
  } catch {
    // Sem armazenamento, o login dura só até recarregar a página.
  }
}

export function apagarToken(): void {
  try {
    localStorage.removeItem(CHAVE_DO_TOKEN);
    localStorage.removeItem(CHAVE_DO_USUARIO);
  } catch {
    // Nada a apagar.
  }
}

// O contrato não tem rota de "quem sou eu": nome e e-mail vêm na resposta do login e do cadastro
// e ficam guardados junto do token, para o perfil e o topo mostrarem.
const CHAVE_DO_USUARIO = "dotstudy.usuario";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface RespostaDeSessao {
  token: string;
  usuario: Usuario;
}

export function salvarSessao(sessao: RespostaDeSessao): void {
  salvarToken(sessao.token);
  try {
    localStorage.setItem(CHAVE_DO_USUARIO, JSON.stringify(sessao.usuario));
  } catch {
    // Sem armazenamento, o perfil mostra o texto padrão.
  }
}

// Devolve o texto cru (estável entre chamadas) para servir de snapshot do useSyncExternalStore.
export function lerUsuarioSalvo(): string | null {
  try {
    return localStorage.getItem(CHAVE_DO_USUARIO);
  } catch {
    return null;
  }
}

// A tela decide o que mostrar pelo `codigo`, nunca pelo texto da mensagem (contrato, seção 2).
export class ErroDaApi extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensagem: string,
    readonly campos?: Record<string, string>,
  ) {
    super(mensagem);
    this.name = "ErroDaApi";
  }
}

interface CorpoDeErro {
  erro?: { codigo?: string; mensagem?: string; campos?: Record<string, string> };
}

export async function api<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const cabecalhos = new Headers(opcoes.headers);
  if (opcoes.body) cabecalhos.set("Content-Type", "application/json");

  const token = lerToken();
  if (token) cabecalhos.set("Authorization", `Bearer ${token}`);

  let resposta: Response;
  try {
    resposta = await fetch(`${URL_DA_API}${caminho}`, { ...opcoes, headers: cabecalhos });
  } catch {
    // Código só do front: a requisição nem chegou na API (API fora do ar, sem internet, CORS).
    throw new ErroDaApi(0, "SEM_CONEXAO", "Não foi possível falar com o servidor.");
  }

  const corpo: unknown = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const erro = (corpo as CorpoDeErro | null)?.erro;
    throw new ErroDaApi(
      resposta.status,
      erro?.codigo ?? "ERRO_INTERNO",
      erro?.mensagem ?? "Erro inesperado.",
      erro?.campos,
    );
  }

  return corpo as T;
}
