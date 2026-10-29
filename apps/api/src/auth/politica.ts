// Politica de senha e de sessao.
//
// PROVISORIO: os valores abaixo sao a hipotese do Pedro para destravar o login.
// Quem decide e o Gabriel, tarefa `S3 · Definir politica de senha e expiracao de sessao`
// (decisao C2 do contrato). Mudou aqui, muda tambem no docs/contrato-api.md.

// 8 caracteres e o minimo que a recomendacao NIST SP 800-63B aceita para senha escolhida pelo usuario.
export const SENHA_TAMANHO_MINIMO = 8;

// Teto existe para ninguem mandar 1 MB de senha e travar o servidor calculando hash.
export const SENHA_TAMANHO_MAXIMO = 128;

// Expiracao do token. Lido do .env (JWT_EXPIRACAO) para o Gabriel ajustar sem mexer em codigo.
export const EXPIRACAO_PADRAO = '7d';
