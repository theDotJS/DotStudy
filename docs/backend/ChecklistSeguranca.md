# DotStudy — Plano de Desenvolvimento de Segurança do App

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Gabriel

---

- [ ] **S0 · Varrer o repositório atrás de segredo exposto** — Senha, chave de API ou string de conexão dentro do código. Se houver, tirar e **trocar a chave** (histórico do Git guarda tudo).
- [ ] **S0 · Padronizar `.env` e `.env.example`** — O real fica fora do Git; o exemplo, com os nomes das variáveis e valores vazios, fica versionado.
- [ ] **S3 · Configurar a biblioteca de autenticação** — Em par com o Pedro. Hash de senha com algoritmo moderno (argon2 ou bcrypt), nunca senha em texto puro.
- [ ] **S3 · Definir política de senha e expiração de sessão** — Mínimo de caracteres, tempo de validade do token. Escolher os números e escrever por quê.
- [ ] **S4 · Configurar CORS** — Só o domínio do frontend pode chamar a API. `origin: "*"` fica de fora.
- [ ] **S4 · Validar toda entrada nas rotas** — Usar `class-validator` ou Zod. Requisição fora do formato é rejeitada antes de encostar no banco. É a defesa principal contra injeção.
- [ ] **S6 · Verificar autorização, não só autenticação** — Estar logado não basta: o usuário A não pode ler nem alterar o progresso do usuário B. **Teste isso na mão**, trocando o ID na URL.
- [ ] **S6 · Limitar tentativas de login** — Rate limiting na rota de login para travar força bruta.
- [ ] **S8 · Rodar a checklist OWASP Top 10** — Item por item, escrever se o projeto está exposto, protegido ou se não se aplica. Esse documento é um capítulo pronto do TCC.
- [ ] **S8 · Confirmar HTTPS em produção** — Vercel e Railway já entregam. Só verificar que não há chamada em `http://`.
- [ ] **S9 · LGPD: escrever a política de privacidade** — Quais dados são coletados, para quê, por quanto tempo, como apagar. Mesmo sem fim comercial, a banca cobra.

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
