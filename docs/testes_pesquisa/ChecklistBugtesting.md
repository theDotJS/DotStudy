# DotStudy — Plano de Desenvolvimento de Betatesting e Pesquisa de Bugs

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Caio, Adriana

---

- [ ] **S0 · Escolher onde os bugs vivem** — GitHub Issues, Trello ou Jira. Um lugar só. Bug relatado em conversa de WhatsApp se perde.
- [ ] **S0 · Criar o modelo de relato de bug** — Campos obrigatórios: o que eu fiz, o que eu esperava, o que aconteceu, navegador/aparelho, print. **RISCO:** "não funciona" gasta mais tempo do dev do que o bug em si.
- [ ] **S1 · Definir a escala de severidade** — Crítico (trava o uso), Alto (feature quebrada com desvio possível), Médio (comportamento errado sem travar), Baixo (visual). Só Crítico e Alto param a sprint.
- [ ] **S3 · Escrever os roteiros de teste** — Passo a passo do que testar em cada tela, com resultado esperado. Escrever **antes** da tela existir, a partir dos desenhos da Lana.
- [ ] **S4 · Começar o teste exploratório da autenticação** — Cadastrar com e-mail repetido, senha vazia, e-mail sem `@`, senha de 1 caractere, campos com espaço. Quebrar de propósito é o trabalho.
- [ ] **S6 · Testar o fluxo completo do nível** — Responder tudo certo, tudo errado, metade, sair no meio, voltar, recarregar a página no meio do exercício.
- [ ] **S7 · Testar as regras de progressão** — Tentar acessar nível bloqueado direto pela URL. Tentar concluir o nível 5 sem ter feito o 4. **Precisa falhar.** Se conseguir, é bug crítico.
- [ ] **S9 · Rodar o teste com 8 a 12 usuários reais** — Pessoas de fora do time. Roteiro: "estude até o nível 5". **Observar calado.** Não explicar, não ajudar, anotar onde travam.
- [ ] **S9 · Aplicar o questionário SUS após cada sessão** — System Usability Scale: 10 perguntas padronizadas, resulta numa nota de 0 a 100. É instrumento validado academicamente e dá à monografia um número defensável em vez de impressão.
- [ ] **S10 · Consolidar o relatório de testes** — Bugs por severidade, taxa de conclusão da tarefa, nota SUS, principais pontos de travamento. Vira capítulo de resultados.

---

## Calendário de Responsabilidades

| Semana | Datas | Marco |
|---|---|---|
| S0 | 24–30/08 | Setup: repositório, ambientes, decisões D1–D4 |
| S1 | 31/08–06/09 | Modelagem e protótipo |
| S2 | 07–13/09 | Fundação: banco no ar, primeira tela |
| S3 | 14–20/09 | Autenticação funcionando ponta a ponta |
| S4 | 21–27/09 | Conteúdo gerado e aprovado |
| S5 | 28/09–04/10 | Mapa de níveis navegável |
| S6 | 05–11/10 | Exercícios e correção |
| S7 | 12–18/10 | Progressão e desbloqueio (**MVP fecha aqui**) |
| S8 | 19–25/10 | Responsivo, PWA, deploy público |
| S9 | 26/10–01/11 | Betateste com usuários reais. **Freeze em 01/11** |
| S10 | 02–08/11 | Correção de bugs e escrita da monografia |
| — | 09–15/11 | Entrega e ensaio de apresentação |
