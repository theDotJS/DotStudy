# DotStudy — Plano de Desenvolvimento de API

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Pedro

- [x] **S0 · Criar o repositório e a estrutura de pastas** — Um repositório com `apps/web` e `apps/api`. Configurar ESLint e Prettier para o código sair padronizado de todo mundo. _Feito em 13/10: apps/web e apps/api, ESLint no web, oxlint na api, Prettier na raiz._
- [ ] **S0 · Escrever o README de setup** — Passo a passo para qualquer pessoa do time rodar o projeto na própria máquina. **CRITÉRIO:** o Caio consegue rodar sozinho seguindo só o texto. _Escrito. Fica aberto até o Caio rodar do zero sem ajuda._
- [x] **S1 · Definir o contrato da API antes de codar** — Documento listando cada rota: método, caminho, o que recebe, o que devolve, códigos de erro. Frontend e mobile trabalham em cima desse papel enquanto a API não existe. _Feito em 13/10: docs/contrato-api.md, atualizado com o que foi implementado._
- [x] **S2 · Subir o esqueleto do NestJS com rota de health check** — Uma rota `GET /health` que responde `{ status: "ok" }`. Serve para provar que o servidor sobe e responde.
- [x] **S2 · Conectar a API ao banco via Prisma** — Cliente configurado, variáveis de ambiente em `.env`, `.env` no `.gitignore`.
- [x] **S3 · Rotas de autenticação** — `POST /auth/register` e `POST /auth/login`. Devolve token de sessão. Feito com biblioteca, em par com o Gabriel. _Feito em 13/10: argon2 + @nestjs/jwt. Política de senha e expiração provisórias até o Gabriel decidir (C2)._
- [x] **S3 · Middleware de rota protegida** — Bloqueio que rejeita requisição sem token válido, devolvendo 401. _Feito em 13/10: src/auth/auth.guard.ts._
- [x] **S4 · Rotas de leitura de conteúdo** — `GET /tracks`, `GET /tracks/:id/levels`, `GET /levels/:id`. Só leitura, sem lógica.
- [x] **S5 · Rota de progresso do usuário** — `GET /me/progress`: devolve, para cada nível, se está bloqueado, disponível ou concluído.
- [x] **S6 · Rota de submissão de resposta** — `POST /levels/:id/submit`: recebe as respostas, devolve acertos e se passou. **A correção acontece no servidor.** Nunca mande o gabarito para o navegador.
- [x] **S7 · Rota de conclusão de nível** — Grava a conclusão e libera o próximo nível. _Feito em 13/10: não é rota separada: a conclusão acontece dentro da submissão aprovada (ver contrato)._
- [x] **S7 · Tratamento de erro padronizado** — Toda falha devolve o mesmo formato de JSON. Sem `stack trace` vazando para o cliente. _Feito em 13/10: src/comum/filtro-de-erros.ts._
- [ ] **S8 · Documentação automática (Swagger)** — Página que lista todas as rotas. Vira anexo da monografia.
- [ ] **S8 · Deploy da API em ambiente público** — URL acessível de qualquer lugar, com variáveis de ambiente de produção.

---

## Calendário de Responsabilidades

| Semana | Datas       | Marco                                             |
| ------ | ----------- | ------------------------------------------------- |
| S0     | 24–30/08    | Setup: repositório, ambientes, decisões D1–D4     |
| S1     | 31/08–06/09 | Modelagem e protótipo                             |
| S2     | 07–13/09    | Fundação: banco no ar, primeira tela              |
| S3     | 14–20/09    | Autenticação funcionando ponta a ponta            |
| S4     | 21–27/09    | Conteúdo gerado e aprovado                        |
| S5     | 28/09–04/10 | Mapa de níveis navegável                          |
| S6     | 05–11/10    | Exercícios e correção                             |
| S7     | 12–18/10    | Progressão e desbloqueio (**MVP fecha aqui**)     |
| S8     | 19–25/10    | Responsivo, PWA, deploy público                   |
| S9     | 26/10–01/11 | Betateste com usuários reais. **Freeze em 01/11** |
| S10    | 02–08/11    | Correção de bugs e escrita da monografia          |
| —      | 09–15/11    | Entrega e ensaio de apresentação                  |
