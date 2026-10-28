# Guia da Adriana: validação de conteúdo e testes

**Sua checklist:** `docs/testes_pesquisa/ChecklistBugtesting.md` (com o Caio). Você também valida o
conteúdo gerado pela IA junto com a Gabrielly.

## Por que a validação importa tanto

O plano diz: nada entra no banco sem o carimbo da validação humana. É isso que separa "usamos IA" de
"usamos IA com controle de qualidade" na banca. Na prática, você é o filtro entre um erro da IA e um
usuário do betateste aprendendo errado.

## O que fazer, em ordem

### 1. Montar a planilha e o roteiro de validação (até 16/10)

**Planilha**, uma linha por item gerado (cada resumo e cada questão é um item):

| Nível | Item | Versão | Resultado | Motivo da reprovação | Quem validou | Data |
| ----- | ---- | ------ | --------- | -------------------- | ------------ | ---- |

**Roteiro**, as perguntas que você faz a cada item:

1. Toda afirmação do texto aparece no texto-fonte? (A IA inventa com confiança.)
2. A questão tem **uma única** alternativa certa? As erradas são claramente erradas?
3. As alternativas erradas são plausíveis? Alternativa absurda deixa a questão fácil demais.
4. A questão testa o objetivo do nível, ou pergunta um detalhe sem importância?
5. A linguagem serve para o público-alvo definido pela Gabrielly?

Use motivos fixos de reprovação ("erro factual", "duas respostas certas", "fora do objetivo",
"linguagem"), para dar para contar depois.

### 2. Validar os níveis 1 a 3 (até 19/10) e os outros (até 30/10)

Item reprovado volta para a Gabrielly com o motivo. Item aprovado vai para o arquivo
`apps/api/prisma/conteudo/trilha.json`, no formato de `docs/formato-do-conteudo.md`.

### 3. Testar a autenticação, já (até 19/10)

A API está pronta, então dá para testar antes de existir tela. Use o Thunder Client (extensão do VS
Code) ou o Postman. Tente quebrar:

- cadastrar o mesmo e-mail duas vezes, com letra maiúscula e minúscula;
- senha curta, senha vazia, senha gigante;
- login com senha errada e com e-mail que não existe: a resposta tem que ser **igual** nos dois casos;
- acessar `GET /me/progress` sem token, com token inventado, com token de outra pessoa.

O que a API deveria responder está em `docs/contrato-api.md`. Diferente do contrato é bug: registre
no lugar que vocês escolheram na S0, com o modelo de relato e a escala de severidade que já fizeram.

**Pesquisar:** "teste exploratório", "como usar o Thunder Client" (ou Postman).

### 4. Testar as regras de progressão (até 26/10)

Cada regra de `docs/regras-de-negocio.md` é um caso de teste. Exemplos:

- nível 2 bloqueado antes de concluir o 1 (RN-02, RN-07);
- reprovar não bloqueia nada e dá para tentar de novo (RN-04);
- refazer um nível com nota pior não baixa a nota guardada (RN-05);
- o gabarito não aparece no inspetor do navegador (RN-09). Abra o F12, aba Rede, e procure a palavra
  "correta" na resposta de `GET /levels/:id`.

Divida as regras com o Caio para os dois não testarem a mesma coisa.

## Quem depende de você

- **Fabiano**, do conteúdo aprovado para o seed.
- **A monografia**, da taxa de rejeição.
