# DotStudy — Plano de Desenvolvimento de Regras de Negócio

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Gabriel, Pedro

---

- [ ] **S1 · Escrever as regras em português antes de virar código** — Um documento curto, frases afirmativas. Exemplo de partida:
  - O nível 1 de uma trilha começa sempre disponível.
  - Um nível fica disponível quando o nível de ordem imediatamente anterior está concluído.
  - Um nível é concluído com 70% ou mais de acerto.
  - Reprovar não bloqueia nada: o usuário pode tentar de novo, sem limite.
  - Refazer um nível já concluído não diminui a pontuação.
- [ ] **S1 · DECISÃO: definir a nota de corte** — 70% é chute razoável, não verdade. Deixe o número em configuração, não fixo no código, porque o betateste vai sugerir mudar.
- [ ] **S5 · Implementar o cálculo de estado do nível** — Função que recebe usuário e trilha e devolve, por nível: `bloqueado | disponivel | concluido`.
- [ ] **S6 · Implementar a correção de exercício** — Compara respostas com gabarito, calcula percentual, decide aprovação. **Só no servidor.**
- [ ] **S6 · Implementar o registro de tentativa** — Toda submissão vira linha em `attempts`, mesmo reprovada. Esses dados são a matéria-prima da análise do TCC.
- [ ] **S7 · Implementar o desbloqueio** — Aprovação em um nível libera o próximo, dentro de uma transação de banco (ou grava tudo, ou não grava nada).
- [ ] **S7 · Escrever testes das regras** — No mínimo: nível 1 começa aberto; 69% reprova e 70% aprova; nível 3 não abre com nível 2 pendente. **CRITÉRIO:** os testes rodam com um comando e passam.
- [ ] **S9 · Documentar cada regra e sua justificativa** — Por que 70% e não 60%. A banca pergunta.
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
