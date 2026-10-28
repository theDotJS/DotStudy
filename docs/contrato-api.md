# DotStudy — Contrato da API

**Status:** implementado em 13/10. Todas as rotas abaixo existem em `apps/api` e são verificadas pelo
teste `apps/api/test/fluxo.e2e-spec.ts`. **Responsável:** Pedro.
**Exceção:** `429 TENTATIVAS_EXCEDIDAS` ainda não existe (tarefa `S6 · Limitar tentativas de login`, do Gabriel).
**Base URL local:** `http://localhost:3333`

---

## 1. Para que serve este documento

É o acordo entre quem faz tela e quem faz API. Alexandre (telas web) e Fabio (multiplataforma)
programam contra este papel, e a API responde exatamente o que está escrito aqui.

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
    "codigo": "SENHA_FRACA",
    "mensagem": "Alguns campos estão inválidos.",
    "campos": { "senha": "A senha precisa ter pelo menos 8 caracteres." }
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

`campos` usa o caminho do campo como chave: `"senha"`, `"respostas.0.questaoId"`.

Códigos genéricos, usados quando a falha não tem código próprio na rota:

| Código                  | HTTP | Quando                                                        |
| ----------------------- | ---- | ------------------------------------------------------------- |
| `REQUISICAO_MALFORMADA` | 400  | JSON quebrado                                                 |
| `NAO_AUTENTICADO`       | 401  | Rota protegida sem token, com token adulterado ou expirado    |
| `NAO_ENCONTRADO`        | 404  | Rota que não existe                                           |
| `DADOS_INVALIDOS`       | 422  | Campo faltando, tipo errado ou campo que não está no contrato |
| `ERRO_INTERNO`          | 500  | Erro não previsto. O detalhe fica só no terminal da API.      |

**Para o front:** decida o que mostrar pelo `codigo`, nunca pelo texto de `mensagem`. A mensagem
pode mudar; o código só muda com aviso no grupo.

**Sucesso:** a rota devolve o recurso direto no corpo, sem envelope `{ data }`. O que identifica erro
é o status HTTP (4xx ou 5xx) e a chave `erro`.

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

**Erros:** `401 CREDENCIAIS_INVALIDAS` · `429 TENTATIVAS_EXCEDIDAS` (ainda não implementado)

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

Estado de cada nível para o usuário do token. É a única chamada que o mapa precisa: traz ordem,
título e estado de cada nível.

**Parâmetro opcional:** `?trilhaId=uuid`. Sem ele, usa a trilha mais antiga (no MVP existe uma).

**200**

```json
{
  "trilhaId": "uuid",
  "niveis": [
    {
      "nivelId": "uuid",
      "ordem": 1,
      "titulo": "...",
      "estado": "concluido",
      "melhorPercentual": 80
    },
    {
      "nivelId": "uuid",
      "ordem": 2,
      "titulo": "...",
      "estado": "disponivel",
      "melhorPercentual": null
    },
    {
      "nivelId": "uuid",
      "ordem": 3,
      "titulo": "...",
      "estado": "bloqueado",
      "melhorPercentual": null
    }
  ]
}
```

`estado` é sempre um de: `bloqueado` | `disponivel` | `concluido`.

**Erros:** `401` · `404 TRILHA_NAO_ENCONTRADA`

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

**Erros:** `401` · `403 NIVEL_BLOQUEADO` · `404 NIVEL_NAO_ENCONTRADO` ·
`422 RESPOSTAS_INCOMPLETAS` (faltou responder alguma questão) · `422 RESPOSTAS_INVALIDAS` (questão de
outro nível, questão respondida duas vezes ou alternativa que não existe)

Erro 422 não grava tentativa. Reprovar grava (RN-04).

> Não existe rota separada de "concluir nível". A conclusão é consequência da aprovação nesta rota.
> Uma rota que marca conclusão por fora seria um jeito de pular nível sem responder nada.

---

## 4. Decisões em aberto

A coluna "Implementado hoje" é a hipótese que destravou o código. Não é a decisão final: quem decide
confirma ou troca, e a troca custa pouco porque está isolada no ponto indicado.

| #   | Pergunta                                                                                                                                    | Quem decide       | Implementado hoje                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------- |
| C1  | Token em corpo JSON (localStorage) ou cookie httpOnly? Cookie é mais seguro contra XSS e mais chato de configurar com dois domínios locais. | Pedro e Gabriel   | Token no corpo, enviado em `Authorization: Bearer`                   |
| C2  | Tempo de expiração do token. Tamanho mínimo de senha.                                                                                       | Gabriel           | `JWT_EXPIRACAO=7d` no `.env`; senha de 8 a 128 em `auth/politica.ts` |
| C3  | `GET /levels/:id` de nível já concluído devolve o gabarito junto, para revisão?                                                             | Pedro e Gabrielly | Não devolve. Mais seguro enquanto não houver decisão.                |
| C4  | Paginação em `/tracks`: desnecessária com uma trilha. Fica de fora do MVP?                                                                  | Pedro             | Sem paginação                                                        |

---

## 5. O que este contrato deixa de fora

Ranking, amigos, notificações, múltiplas trilhas, painel administrativo e DotChat. O conteúdo entra
no banco por script de seed, não por rota. Não há rota de escrita de conteúdo no MVP.
