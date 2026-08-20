# DotStudy — Plano de Desenvolvimento de Regras de Negócio

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Responsável:** Gabriel, Pedro

---

- [ ] **S0 · Criar o projeto de banco gratuito** — Supabase ou Neon. Guardar a string de conexão em local combinado, **nunca no repositório**.
- [ ] **S1 · Desenhar o modelo de dados** — Diagrama com as entidades e relações. Ponto de partida:

```
users            id, email, senha_hash, nome, criado_em
tracks           id, titulo, descricao, slug
levels           id, track_id, ordem, titulo, objetivo_aprendizagem
content_blocks   id, level_id, ordem, tipo, corpo, fonte_url, fonte_titulo
questions        id, level_id, enunciado, tipo
alternatives     id, question_id, texto, correta (bool)
user_progress    id, user_id, level_id, status, pontuacao, concluido_em
attempts         id, user_id, question_id, alternative_id, correta, criado_em
```

- [ ] **S1 · Validar o modelo com Pedro e Gabriel** — Uma hora de conversa. Mudar tabela na semana 1 custa minutos; na semana 6 custa dias.
- [ ] **S2 · Escrever o `schema.prisma`** — Traduzir o diagrama para o schema do Prisma, com tipos e relações.
- [ ] **S2 · Rodar a primeira migration** — `prisma migrate dev`. **CRITÉRIO:** as tabelas aparecem no painel do banco.
- [ ] **S2 · Definir a política de migrations** — Só uma pessoa gera migration por vez, e sempre avisa no grupo. Migration conflitante é um dos bugs mais chatos de desfazer.
- [ ] **S3 · Criar índices nas chaves de busca** — `user_progress(user_id, level_id)` e `levels(track_id, ordem)`. Explicar no TCC por que índice acelera consulta.
- [ ] **S4 · Escrever o script de seed** — Lê o JSON de conteúdo aprovado e insere no banco. Precisa ser rodável quantas vezes for preciso sem duplicar registro (`upsert`).
- [ ] **S5 · Popular ambiente de desenvolvimento com dados falsos** — Usuários e progressos de mentira para o frontend testar sem depender de cadastro manual.
- [ ] **S8 · Rotina de backup** — Exportar o banco antes de qualquer mudança grande. Uma pasta com o dump datado já resolve.
- [ ] **S9 · Documentar o dicionário de dados** — Tabela por tabela, campo por campo, o que cada coisa significa. Vai direto para o anexo da monografia.

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
