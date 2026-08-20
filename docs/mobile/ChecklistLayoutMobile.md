# DotStudy — Plano de Desenvolvimento de Layout Mobile

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Alexandre

---

- [ ] **S2 · Adotar mobile-first como padrão de escrita** — Escrever o CSS para tela pequena primeiro e ir ampliando. Inverter isso depois é retrabalho garantido.
- [ ] **S6 · Adaptar o menu lateral** — O menu fixo da imagem 2 não cabe em 375px. Vira menu retrátil acionado pelo ícone de três linhas.
- [ ] **S6 · Adaptar o mapa de níveis para tela vertical** — O mapa horizontal precisa virar rolagem vertical ou ter zoom controlado. É a adaptação mais difícil do projeto.
- [ ] **S7 · Garantir área de toque mínima** — Todo elemento clicável com pelo menos 44×44px. Nó de nível pequeno demais é o problema de usabilidade mais comum em mapa de trilha.
- [ ] **S7 · Testar com teclado virtual aberto** — Nos campos de login, o teclado do celular cobre metade da tela. Verificar que o botão de enviar continua alcançável.

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
