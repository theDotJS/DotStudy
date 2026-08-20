# DotStudy — Plano de Desenvolvimento de Prototipagem de Layout

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Lana

---

- [ ] **S0 · Escolher a ferramenta e abrir o arquivo compartilhado** — Figma no plano gratuito. Todo o time com link de leitura.
- [ ] **S0 · Fechar a DECISÃO D1 (pixel art ou ilustração)** — Com o Alexandre. Trava o resto do trabalho visual.
- [ ] **S1 · Mapear o fluxo de telas em caixinhas** — Login → Cadastro → Mapa de Níveis → Tela de Nível → Exercício → Resultado. Só retângulos e setas, sem cor. Define o que precisa existir.
- [ ] **S1 · Wireframe em baixa fidelidade das 6 telas** — Cinza, sem arte, só posição de elemento. Barato de jogar fora e refazer, que é o objetivo nesta fase.
- [ ] **S2 · Definir o sistema de design** — Paleta (o amarelo/areia e o marrom das imagens funcionam), fonte para título e para texto, escala de espaçamento (4, 8, 16, 24, 32px). **CRITÉRIO:** Alexandre consegue montar tela nova sem inventar cor.
- [ ] **S2 · Desenhar os quatro estados do nó de nível** — Bloqueado, disponível, em progresso, concluído. Precisam ser distinguíveis **sem depender só de cor** (forma, cadeado, brilho), por acessibilidade.
- [ ] **S3 · Alta fidelidade: Login e Cadastro** — Incluindo estado de erro ("senha incorreta") e de carregamento.
- [ ] **S4 · Alta fidelidade: Mapa de Níveis** — A tela principal. Caminho, nós, indicador de posição do usuário.
- [ ] **S5 · Alta fidelidade: Tela de Nível e Exercício** — Leitura do conteúdo, citação da fonte, alternativas, botão de responder.
- [ ] **S5 · Alta fidelidade: Tela de Resultado** — Aprovado e reprovado. **RISCO:** o estado de reprovação define se a pessoa volta ou desiste. Reprovar precisa parecer "tenta de novo", não "você falhou".
- [ ] **S6 · Versão mobile de todas as telas** — Largura de 375px. Mostrar o que empilha, o que some, o que vira menu.
- [ ] **S7 · Entregar os assets exportados** — PNG/SVG nas resoluções necessárias, nomeados de forma consistente, em pasta organizada para o Alexandre.

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
