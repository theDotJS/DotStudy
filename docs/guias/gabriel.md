# Guia do Gabriel: segurança e regras de negócio

**Sua checklist:** `docs/backend/ChecklistSeguranca.md` e `docs/backend/ChecklistRegraDeNegocios.md`.

## O que já existe

O login está implementado com biblioteca, como o plano pedia: senha com hash **argon2id** (pacote
`argon2`) e token **JWT** (pacote `@nestjs/jwt`). Os arquivos estão em `apps/api/src/auth/`. Também já
estão prontos: varredura de segredo no histórico, `.env` fora do Git, CORS travado e validação de
toda entrada (`apps/api/src/comum/validacao.ts`).

O que ficou com valor **provisório**, esperando a sua decisão:

| O quê                   | Valor hoje        | Onde muda                                  |
| ----------------------- | ----------------- | ------------------------------------------ |
| Tamanho mínimo de senha | 8                 | `apps/api/src/auth/politica.ts`            |
| Tamanho máximo de senha | 128               | `apps/api/src/auth/politica.ts`            |
| Expiração do login      | 7 dias            | `JWT_EXPIRACAO` no `.env` e `.env.example` |
| Onde o token fica (C1)  | corpo da resposta | decisão sua com o Pedro                    |

## O que fazer, em ordem

### 1. Revisar o login e marcar o que já está feito (até 14/10)

- Leia `auth.service.ts` e `auth.guard.ts`. Cada trecho tem comentário explicando o porquê.
- Rode `npm run test:api` na raiz e confira que passa.
- Confira e marque na sua checklist: varredura de segredo, `.env` padronizado, CORS, configurar a
  biblioteca de autenticação. Se discordar de algo, abra uma issue ou comente no PR, não marque.

### 2. Decidir a política de senha e a expiração (até 15/10)

Decida os três números da tabela acima e escreva a justificativa em duas linhas na linha **C2** de
`docs/contrato-api.md`. Depois mude os valores nos arquivos indicados e rode os testes de novo.

**Pesquisar:**

- NIST SP 800-63B, a parte sobre senhas ("memorized secrets"): tamanho mínimo, por que não exigir
  símbolo obrigatório.
- OWASP Authentication Cheat Sheet e OWASP Password Storage Cheat Sheet (é de onde vem o argon2id).
- "JWT expiration" e "refresh token": entenda por que token longo é cômodo e token curto é mais seguro.
  No MVP não tem refresh token; a pergunta é só quanto tempo o login dura.

### 3. Decidir C1 com o Pedro: token no corpo ou em cookie (até 16/10)

Hoje o token volta no corpo e o front guarda no `localStorage`. Isso funciona e é simples, mas um XSS
consegue ler o token. Cookie `httpOnly` protege contra isso e dá mais trabalho de configurar.

**Pesquisar:** "localStorage vs httpOnly cookie JWT", "XSS", "SameSite cookie". Traga as duas opções
com o custo de cada uma. A decisão é sua e do Pedro.

### 4. Limitar tentativas de login (até 19/10)

O contrato promete `429 TENTATIVAS_EXCEDIDAS` em `POST /auth/login`, e isso ainda não existe no
repositório. No Miro esta tarefa, a política de senha e a da LGPD estão como Em andamento: se você já
tem algo escrito, traga para o repositório e use como ponto de partida dos passos abaixo.

**Como fazer:**

1. Instale o pacote `@nestjs/throttler` em `apps/api`.
2. Aplique o limite **só** na rota de login (não na API inteira). Sugestão de partida: 5 tentativas por
   minuto por IP. Você decide o número.
3. O formato do erro já está resolvido: o `FiltroDeErros` transforma qualquer 429 em
   `TENTATIVAS_EXCEDIDAS`. Confira se a mensagem que chega é a do contrato.
4. Escreva um teste em `apps/api/test/fluxo.e2e-spec.ts` que erra a senha várias vezes e espera 429.

**Pesquisar:** documentação do `@nestjs/throttler` (decorador `@Throttle` e `ThrottlerGuard`),
"brute force attack", "credential stuffing".

### 5. Tentar quebrar a autorização (até 22/10)

Estar logado não basta: a API precisa conferir de quem é o recurso (RN-16). Tente, com o token de um
usuário, ver ou alterar o progresso de outro. Tente submeter resposta para nível bloqueado. Tente
mandar campo extra no corpo (`"usuarioId": "..."`).

O que você achar vira teste no e2e. O que não conseguir quebrar, anote como evidência para o capítulo.

**Pesquisar:** OWASP "Broken Access Control" e "IDOR" (Insecure Direct Object Reference).

### 6. Política de privacidade, ANTES do betateste (até 31/10)

O betateste começa em 02/11 com pessoas de fora, que vão criar conta com e-mail. Isso é dado pessoal.
Escreva uma página curta: que dado coletamos (nome, e-mail, respostas e tentativas), para quê (TCC),
por quanto tempo, como a pessoa pede para apagar.

**Pesquisar:** LGPD (Lei 13.709/2018), princípios do artigo 6º e base legal do consentimento.
Pergunte ao orientador se a instituição exige termo de consentimento para pesquisa com usuários.

### 7. Checklist OWASP Top 10 (até 29/10)

Uma tabela com os 10 itens: se aplica ao projeto, como o projeto trata, e em qual arquivo está a prova.
Isso vira capítulo da monografia. HTTPS em produção não se aplica: o projeto não tem deploy público.
Registre isso na tabela em vez de deixar em branco.

### 8. Revisar as regras de negócio (até 17/10)

`docs/regras-de-negocio.md` está como rascunho com o seu nome. Leia, aponte o que discorda e, se
concordar, tire a palavra "rascunho". Cada regra tem teste em `apps/api/src/regras/`.

## Quem depende de você

- **Alexandre**, da decisão C1: muda como o front guarda o token.
- **Caio**, do 429: vai testar o bloqueio de login.
- **Todo o betateste**, da política de privacidade.
