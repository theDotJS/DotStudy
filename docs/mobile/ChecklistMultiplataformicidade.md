# DotStudy — Plano de Desenvolvimento de Multiplataformicidade

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Fábio

---

- [ ] **S0 · Montar a matriz de compatibilidade** — Planilha: navegadores (Chrome, Firefox, Safari, Edge), sistemas (Windows, Android, iOS), tamanhos (375, 768, 1440). É o mapa do que precisa ser testado.
- [ ] **S3 · Levantar os aparelhos reais disponíveis no time** — Quem tem iPhone, quem tem Android, quais versões. Emulador não pega bug de Safari real.
- [ ] **S5 · Configurar o deploy contínuo** — Push na `main` publica automaticamente. **CRITÉRIO:** existe uma URL pública que qualquer pessoa abre no celular.
- [ ] **S6 · Criar o ambiente de homologação** — Uma segunda URL, separada da principal, para o time testar sem quebrar a versão que o orientador acessa.
- [ ] **S7 · Transformar o site em PWA** — `manifest.json` com nome, ícones e cor de tema; service worker básico. **CRITÉRIO:** abrir no celular e conseguir "adicionar à tela inicial", com ícone do gato aparecendo.
- [ ] **S8 · Rodar a matriz de compatibilidade inteira** — Cada combinação, com print da tela. Anotar cada diferença encontrada.
- [ ] **S8 · Rodar auditoria de performance (Lighthouse)** — Meta realista: acima de 80 em Performance e Acessibilidade. O relatório entra como evidência no TCC.
- [ ] **S9 · Testar em conexão lenta** — Simular 3G nas ferramentas do navegador. Se o mapa demora 15 segundos, os assets estão pesados demais (voltar para a Lana).

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
