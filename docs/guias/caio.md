# Guia do Caio: testes e betateste

**Sua checklist:** `docs/testes_pesquisa/ChecklistBugtesting.md` (com a Adriana).

## O que já existe

Vocês já definiram onde os bugs ficam, o modelo de relato e a escala de severidade. A API está pronta,
então dá para testar antes de as telas existirem.

## O que fazer, em ordem

### 1. Rodar o projeto do zero seguindo só o README (até 14/10)

Isso é teste, e é o primeiro. A tarefa do Pedro de escrever o README só fecha quando **você** consegue
rodar tudo sozinho, sem ajuda, seguindo só o texto.

Clone o repositório numa pasta nova e siga o `README.md` da raiz do começo ao passo 7. Cada passo que
travar, que estiver confuso ou que precisar de algo que o texto não disse, é um bug do README. Anote o
passo e o que aconteceu, e mande para o Pedro.

### 2. Escrever os roteiros de teste (até 17/10)

Um roteiro por regra de `docs/regras-de-negocio.md` (RN-01 a RN-16) e por rota de
`docs/contrato-api.md`. Formato:

| Campo              | Exemplo                                                          |
| ------------------ | ---------------------------------------------------------------- |
| Regra              | RN-07                                                            |
| Pré-condição       | Usuário novo, logado, nenhum nível concluído                     |
| Passos             | Abrir o nível 2 pelo endereço `/nivel/<id do nível 2>`           |
| Resultado esperado | A tela não mostra o conteúdo. A API responde 403 NIVEL_BLOQUEADO |

Os roteiros servem duas vezes: agora na API, depois nas telas.

**Pesquisar:** "caso de teste", "teste de caixa-preta", "partição de equivalência" e "valor limite".
O valor limite explica, por exemplo, por que testar senha com 7 e com 8 caracteres.

### 3. Testar a API pelas regras de progressão (até 22/10)

Use o Thunder Client (extensão do VS Code) ou o Postman para seguir os roteiros direto na API. Divida as
regras com a Adriana. Diferente do contrato é bug: registre com o modelo de relato.

### 4. Testar o fluxo completo nas telas (a partir de 27/10)

Com as telas do Alexandre prontas: criar conta, fazer os níveis, fechar o navegador, voltar no dia
seguinte e conferir se o progresso está lá. Esse é o critério de MVP do plano. Teste no computador e
no celular.

### 5. Preparar o betateste (até 31/10)

O betateste roda de 02 a 08/11, com 8 a 12 pessoas de fora do time, do público-alvo que a Gabrielly
definiu. Prepare:

- **Roteiro da sessão:** o que você fala no começo, a tarefa que a pessoa faz ("crie uma conta e
  complete os três primeiros níveis"), o que você observa e anota.
- **Termo de consentimento:** combine com o Gabriel (LGPD) e pergunte ao orientador se a instituição
  exige modelo próprio.
- **Questionário SUS:** aplicado logo depois de cada sessão. São 10 afirmações com nota de 1 a 5.
- **Agenda:** quem vai participar, em que dia, onde. Presencial ou pela rede local (o Fábio está
  preparando o acesso pelo celular).

**Pesquisar:** SUS, System Usability Scale (Brooke, 1996), e uma versão traduzida e validada para o
português; como calcular a nota de 0 a 100; "protocolo de pensar em voz alta" (think-aloud).

### 6. Rodar o betateste e consolidar o relatório (02 a 08/11)

Relatório com: quantas pessoas, quantas completaram, nota SUS média, os bugs encontrados por
severidade e o que foi corrigido. Vai para a monografia.

## Quem depende de você

- **Pedro**, do teste do README.
- **A monografia**, do relatório do betateste e da nota SUS.
