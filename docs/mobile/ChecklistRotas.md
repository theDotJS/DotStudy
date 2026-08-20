# DotStudy — Plano de Desenvolvimento de Rotas de Backend

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Pedro

---

- [ ] **S1 · Publicar o contrato de rotas como documento vivo** — Uma fonte única de verdade para web e mobile. Toda mudança é anunciada no grupo.
- [ ] **S4 · Padronizar o formato de resposta** — Toda rota devolve o mesmo envelope (`{ data, error }`). Consistência reduz bug de integração pela metade.
- [ ] **S5 · Reduzir o número de chamadas por tela** — O mapa deve carregar com **uma** requisição, não com uma por nível. Em rede móvel, cada chamada extra custa segundos.
- [ ] **S6 · Verificar tempo de resposta** — Nenhuma rota acima de 1 segundo em condição normal. Se passar, provavelmente falta índice no banco (falar com o Fabiano).
- [ ] **S8 · Configurar cabeçalhos de cache** — Conteúdo de nível quase não muda; pode ser cacheado. Progresso de usuário, nunca.

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
