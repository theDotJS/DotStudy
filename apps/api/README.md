# apps/api

Backend do DotStudy. NestJS + TypeScript + Prisma. Roda na porta 3333.

Setup, comandos e pré-requisitos: **[README da raiz](../../README.md)**.

| Comando                   | O que faz                                            |
| ------------------------- | ---------------------------------------------------- |
| `npm run start:dev`       | Sobe a API com recarga automática                    |
| `npm run prisma:migrate`  | Aplica mudanças do schema no banco local             |
| `npm run prisma:generate` | Regera o cliente do Prisma depois de mexer no schema |
| `npm run prisma:studio`   | Abre um navegador de tabelas em cima do banco local  |

Os comandos de Prisma leem o `.env` da raiz do repositório, não daqui.

| Arquivo                | O que é                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `prisma/schema.prisma` | Modelo de dados. **Rascunho**, aguardando validação do Fabiano. |
| `src/health/`          | `GET /health`. Prova que o servidor sobe.                       |

Antes de criar rota, leia [`docs/contrato-api.md`](../../docs/contrato-api.md) e
[`docs/regras-de-negocio.md`](../../docs/regras-de-negocio.md).
