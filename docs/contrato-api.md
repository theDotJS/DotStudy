# DotStudy — Contrato da API

**Status:** rascunho para revisão. **Responsável:** Pedro.
**Tarefa:** `S1 · Definir o contrato da API antes de codar` (vencida em 06/09, prioridade Alta).
**Base URL local:** `http://localhost:3333`

---

## 1. Para que serve este documento

Enquanto a API não existe, Alexandre (telas web), Fabio (multiplataforma) e o pessoal de mobile
programam contra este papel. É o que permite quatro pessoas trabalharem na mesma semana sem uma
esperar a outra.

**Regra:** mudou o contrato, muda aqui primeiro e avisa no grupo. Rota que existe no código e não
está neste arquivo é rota que ninguém vai consumir.

---

## 2. Convenções

- Todo corpo de requisição e resposta é JSON, codificado em UTF-8.
- Datas em ISO 8601 UTC: `2026-09-20T14:30:00.000Z`.
- Identificadores são `string` (UUID). O frontend nunca faz conta com id.
- Rota protegida exige o cabeçalho `Authorization: Bearer <token>`.
- Toda entrada é validada antes de encostar no banco (Zod ou class-validator).

### Formato único de erro

Toda falha, de qualquer rota, devolve exatamente esta forma. Sem exceção, sem stack trace.

```json
{
  "erro": {
    "codigo": "CREDENCIAIS_INVALIDAS",
    "mensagem": "E-mail ou senha incorretos.",
    "campos": { "email": "E-mail não encontrado." }
  }
}
```

`campos` é opcional e só aparece em erro de validação (422).

| HTTP | Quando                                                          |
| ---- | --------------------------------------------------------------- |
| 400  | Requisição malformada (JSON inválido, parâmetro ausente)        |
| 401  | Sem token, token expirado ou credenciais erradas                |
| 403  | Autenticado, mas o recurso não é seu, ou o nível está bloqueado |
| 404  | Recurso não existe                                              |
| 409  | Conflito (e-mail já cadastrado)                                 |
| 422  | Entrada com formato válido mas conteúdo recusado (senha curta)  |
| 429  | Tentativas de login em excesso                                  |
| 500  | Erro não previsto. Nunca vaza detalhe interno.                  |

---

## 3. Rotas

### `GET /health` — pública

Prova que o servidor sobe e responde. Não toca no banco.

**200** `{ "status": "ok" }`

---

### `POST /auth/register` — pública

**Entrada**

```json
{ "nome": "Maria Silva", "email": "maria@exemplo.com", "senha": "umaSenhaBoa123" }
```

**201**

```json
{
  "token": "<jwt>",
  "usuario": { "id": "uuid", "nome": "Maria Silva", "email": "maria@exemplo.com" }
}
```

**Erros:** `409 EMAIL_JA_CADASTRADO` · `422 SENHA_FRACA` · `422 EMAIL_INVALIDO`

---

### `POST /auth/login` — pública

**Entrada** `{ "email": "maria@exemplo.com", "senha": "umaSenhaBoa123" }`

**200** mesma forma do register.

**Erros:** `401 CREDENCIAIS_INVALIDAS` · `429 TENTATIVAS_EXCEDIDAS`

> A mensagem de 401 é sempre "E-mail ou senha incorretos", nunca "esse e-mail não existe".
> Diferenciar as duas entrega a lista de quem tem conta para quem estiver testando de fora.

---

### `GET /tracks` — pública

Lista as trilhas. No MVP há **uma**.

**200**

```json
{ "trilhas": [{ "id": "uuid", "titulo": "...", "descricao": "...", "totalNiveis": 10 }] }
```

---

### `GET /tracks/:id/levels` — pública

Lista os níveis da trilha, em ordem. **Não** inclui conteúdo nem estado do usuário.

**200**

```json
{
  "trilhaId": "uuid",
  "niveis": [{ "id": "uuid", "ordem": 1, "titulo": "...", "objetivo": "..." }]
}
```

**Erros:** `404 TRILHA_NAO_ENCONTRADA`

---

### `GET /levels/:id` — protegida

Conteúdo de um nível e as questões **sem gabarito** (RN-09).

**200**

```json
{
  "id": "uuid",
  "ordem": 3,
  "titulo": "...",
  "conteudo": "texto didático em markdown",
  "fontes": [{ "titulo": "...", "url": "https://..." }],
  "questoes": [
    { "id": "uuid", "enunciado": "...", "alternativas": [{ "id": "a", "texto": "..." }] }
  ]
}
```

**Erros:** `401` · `403 NIVEL_BLOQUEADO` · `404 NIVEL_NAO_ENCONTRADO`

> `fontes` não é enfeite. A citação visível da origem é o diferencial que o TCC defende.

---

### `GET /me/progress` — protegida

Estado de cada nível para o usuário do token.

**200**

```json
{
  "trilhaId": "uuid",
  "niveis": [
    { "nivelId": "uuid", "ordem": 1, "estado": "concluido", "melhorPercentual": 80 },
    { "nivelId": "uuid", "ordem": 2, "estado": "disponivel", "melhorPercentual": null },
    { "nivelId": "uuid", "ordem": 3, "estado": "bloqueado", "melhorPercentual": null }
  ]
}
```

`estado` é sempre um de: `bloqueado` | `disponivel` | `concluido`.

---

### `POST /levels/:id/submit` — protegida

Recebe as respostas, corrige **no servidor** e, se aprovado, grava a conclusão e libera o próximo
nível na mesma transação (RN-12).

**Entrada**

```json
{ "respostas": [{ "questaoId": "uuid", "alternativaId": "a" }] }
```

**200**

```json
{
  "acertos": 4,
  "total": 5,
  "percentual": 80,
  "notaDeCorte": 70,
  "aprovado": true,
  "porQuestao": [{ "questaoId": "uuid", "correta": true }],
  "proximoNivelLiberado": { "id": "uuid", "ordem": 4 }
}
```

`proximoNivelLiberado` é `null` quando reprovou, quando o nível já estava concluído ou quando era
o último da trilha.

**Erros:** `401` · `403 NIVEL_BLOQUEADO` · `404` · `422 RESPOSTAS_INCOMPLETAS`

> Não existe rota separada de "concluir nível". A conclusão é consequência da aprovação nesta rota.
> Uma rota que marca conclusão por fora seria um jeito de pular nível sem responder nada.

---

## 4. Decisões em aberto

| #   | Pergunta                                                                                                                                    | Quem decide       | Até   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----- |
| C1  | Token em corpo JSON (localStorage) ou cookie httpOnly? Cookie é mais seguro contra XSS e mais chato de configurar com dois domínios locais. | Pedro e Gabriel   | 27/09 |
| C2  | Tempo de expiração do token.                                                                                                                | Gabriel           | 20/09 |
| C3  | `GET /levels/:id` de nível já concluído devolve o gabarito junto, para revisão?                                                             | Pedro e Gabrielly | 04/10 |
| C4  | Paginação em `/tracks`: desnecessária com uma trilha. Fica de fora do MVP?                                                                  | Pedro             | 27/09 |

---

## 5. O que este contrato deixa de fora

Ranking, amigos, notificações, múltiplas trilhas, painel administrativo e DotChat. O conteúdo entra
no banco por script de seed, não por rota. Não há rota de escrita de conteúdo no MVP.
