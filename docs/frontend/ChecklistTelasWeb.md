# DotStudy — Plano de Desenvolvimento de Telas Web

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Alexandre

---

- [ ] **S0 · Montar o ambiente** — Node, editor, Git funcionando. Conseguir clonar o repositório e rodar o projeto.
- [ ] **S1 · Subir o Next.js e criar as rotas vazias** — `/login`, `/cadastro`, `/mapa`, `/nivel/[id]`. Páginas em branco com o nome escrito. Prova que a navegação funciona.
- [ ] **S2 · Traduzir o sistema de design para o Tailwind** — Cores e fontes da Lana configuradas no `tailwind.config`. A partir daqui, ninguém escreve código de cor solta.
- [ ] **S2 · Construir os componentes de base** — Botão, campo de texto, card, mensagem de erro. Um lugar só para cada, reutilizados em todas as telas.
- [ ] **S3 · Telas de Login e Cadastro** — Com validação visual: campo vazio, e-mail inválido, senha curta, erro do servidor.
- [ ] **S3 · Ligar o login à API** — Enviar credenciais, guardar o token, redirecionar. Em par com o Pedro.
- [ ] **S4 · Proteção de rota no frontend** — Quem não está logado e tenta abrir `/mapa` volta para `/login`.
- [ ] **S5 · Tela do Mapa de Níveis** — Renderiza os nós na trilha lendo o estado da API. Nó bloqueado não é clicável.
- [ ] **S6 · Tela de Nível** — Exibe conteúdo e **a fonte com link visível**. Citar a origem não é detalhe: é o diferencial que o TCC defende.
- [ ] **S6 · Tela de Exercício** — Seleciona alternativa, envia, mostra o retorno do servidor.
- [ ] **S7 · Tela de Resultado e retorno ao mapa** — Fecha o ciclo. **CRITÉRIO:** completar um nível e ver o próximo desbloquear na mesma sessão, sem recarregar na mão.
- [ ] **S7 · Estados de carregamento e de erro em toda tela** — Nada de tela branca enquanto a API responde. Nada de travar quando ela falha.
- [ ] **S8 · Responsividade** — Mesmo código funcionando em 375px e em 1440px, usando os desenhos da Lana.

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
