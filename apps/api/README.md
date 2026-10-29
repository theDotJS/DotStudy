# apps/api

Backend do DotStudy. NestJS + TypeScript + Prisma. Roda na porta 3333.

Setup, comandos e pré-requisitos: **[README da raiz](../../README.md)**.

| Comando                  | O que faz                                                  |
| ------------------------ | ---------------------------------------------------------- |
| `npm run start:dev`      | Sobe a API com recarga automática                          |
| `npm test`               | Testes das regras de negócio (não precisa de banco)        |
| `npm run test:e2e`       | Fluxo completo contra o Postgres local. Limpa o que cria.  |
| `npm run prisma:deploy`  | Aplica as migrations existentes e gera o cliente do Prisma |
| `npm run prisma:migrate` | Cria uma migration nova depois de mexer no schema          |
| `npm run prisma:studio`  | Abre um navegador de tabelas em cima do banco local        |

Os comandos de Prisma leem o `.env` da raiz do repositório, não daqui.

## Onde fica cada coisa

| Pasta / arquivo        | O que é                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| `prisma/schema.prisma` | Modelo de dados. Cada tabela cita a regra de negócio que a justifica.       |
| `src/regras/`          | As regras RN-01 a RN-12 como funções puras, com testes ao lado (`.spec.ts`) |
| `src/auth/`            | Cadastro, login e o `AuthGuard` que protege rota                            |
| `src/trilhas/`         | `GET /tracks` e `GET /tracks/:id/levels`                                    |
| `src/progresso/`       | `GET /me/progress` e a checagem de nível bloqueado (RN-07)                  |
| `src/niveis/`          | `GET /levels/:id` e `POST /levels/:id/submit`                               |
| `src/comum/`           | Formato único de erro e validação de entrada                                |
| `test/`                | Teste ponta a ponta do fluxo do MVP                                         |

## Três regras para quem for mexer aqui

1. **Regra de negócio mora em `src/regras/`**, não espalhada em service. Se mudar uma regra, muda o
   teste dela no mesmo commit.
2. **O id do usuário vem do token** (`@UsuarioAtual()`), nunca da URL nem do corpo. É o que garante a
   RN-16.
3. **Nunca use `include` em consulta que devolve questão para o navegador.** Use `select` e deixe
   `correta` de fora (RN-09). O teste e2e falha se o gabarito vazar.

Antes de criar rota, leia [`docs/contrato-api.md`](../../docs/contrato-api.md) e
[`docs/regras-de-negocio.md`](../../docs/regras-de-negocio.md).
