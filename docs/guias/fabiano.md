# Guia do Fabiano: banco de dados

**Sua checklist:** `docs/backend/ChecklistBancoDeDados.md` (e a parte de ícones em `ChecklistDesign.md`).

## O que já existe

O modelo de dados está escrito em `apps/api/prisma/schema.prisma`, com 8 tabelas, e a primeira
migration já foi aplicada. O banco roda local no Docker (`npm run db:up` e `npm run db:migrate`).
A API inteira já usa esse modelo e está testada.

Falta a sua validação e, principalmente, **o seed**: o script que coloca o conteúdo no banco. Sem ele,
o site existe e não tem nada para estudar.

**Duas coisas do Miro para alinhar antes de começar:**

- "Criar o projeto de banco gratuito" está como Completo. O projeto decidiu rodar tudo local (está no
  README), então esse banco na nuvem não é usado. Se ele tiver alguma senha ou string de conexão,
  confira que ela não foi parar em nenhum arquivo do repositório nem em print no grupo.
- "Desenhar o modelo de dados" está como Em andamento. Se você tem um modelo seu, compare com o
  `schema.prisma` no passo 1 e traga as diferenças. O projeto não pode ter dois modelos de dados.

## O que fazer, em ordem

### 1. Validar o modelo de dados (até 15/10)

Leia o `schema.prisma` ao lado de `docs/regras-de-negocio.md`. Cada tabela tem um comentário dizendo
qual regra ela atende. Pergunte para cada uma: essa tabela é necessária? falta algum campo? Marque
"desenhar o modelo", "escrever o schema" e "rodar a primeira migration" depois de conferir.

Se quiser mudar algo, a mudança vira uma migration nova (passo 2), nunca edição da migration que já existe.

**Pesquisar:** documentação do Prisma sobre "data model", "relations" e "@@unique / @@index".

### 2. Escrever a política de migrations (até 15/10)

Cinco linhas no `apps/api/README.md`, por exemplo:

- Nunca editar uma migration que já está na `main`. Mudou o schema, cria outra.
- Uma migration por PR, com nome que diz o que muda: `npx prisma migrate dev --name adiciona-indice-fontes`.
- Quem puxar a `main` com migration nova roda `npm run db:migrate`.

**Pesquisar:** Prisma "migrate dev vs migrate deploy", "migration history".

### 3. Dados de exemplo para o Alexandre (até 17/10)

**Este é o mais urgente.** O Alexandre precisa de uma trilha no banco para fazer o mapa, e o conteúdo
real ainda não existe. Crie `apps/api/prisma/conteudo/exemplo.json` com 10 níveis de mentira
("Nível 1", "Pergunta 1"...) no formato de `docs/formato-do-conteudo.md`. O passo 4 lê esse arquivo.

### 4. Escrever o script de seed (até 19/10)

**O que o script faz:** lê um arquivo JSON de conteúdo, confere as regras F1 a F7 de
`docs/formato-do-conteudo.md` e grava trilha, níveis, fontes, questões e alternativas no banco.

**Como fazer:**

1. Crie `apps/api/prisma/seed.ts`.
2. Leia o arquivo com `fs.readFileSync` e `JSON.parse`. O caminho do arquivo vem como argumento, para
   o mesmo script servir para `exemplo.json` e para o `trilha.json` real.
3. Antes de gravar qualquer coisa, confira F1 a F7. Se algo falhar, mostre qual nível e qual questão e
   pare sem gravar nada.
4. Grave tudo dentro de `prisma.$transaction`. Se a trilha com o mesmo título já existir, apague e crie
   de novo: assim dá para rodar o seed quantas vezes quiser.
5. Para gravar tudo de uma vez, use "nested writes" (`create` dentro de `create`). Tem um exemplo
   pronto no `beforeAll` de `apps/api/test/fluxo.e2e-spec.ts`: é exatamente o que o seed precisa fazer.
6. Adicione o comando `"db:seed"` no `package.json` da raiz.

**Cuidado:** apagar a trilha apaga em cascata o progresso de quem já testou. Em desenvolvimento tudo
bem. Depois que o betateste começar (02/11), o seed não roda mais sem combinar com o Pedro.

**Pesquisar:** Prisma "seeding", "nested writes", "interactive transactions"; `tsx` ou `ts-node`
para rodar TypeScript direto.

### 5. Conferir os índices (até 22/10)

Toda consulta da API busca por chave estrangeira. Quase todas já estão cobertas por um `@@unique`
(porque um índice composto também serve para buscar pela primeira coluna dele). Descubra qual tabela
é buscada por `nivelId` e **não** tem índice nenhum, e crie o índice com uma migration.

**Pesquisar:** "índice composto" e "prefixo à esquerda" (leftmost prefix) no PostgreSQL.

### 6. Backup e dicionário de dados (até 31/10)

- **Backup:** documente o comando `pg_dump` que salva o banco do betateste num arquivo, e o comando
  que restaura. Teste os dois. Os dados do betateste são resultado da monografia: perder isso não tem
  volta.
- **Dicionário de dados:** uma tabela por tabela do banco: campo, tipo, o que significa, qual regra usa.
  Vai direto para a monografia.

**Pesquisar:** `pg_dump` e `pg_restore` com `docker exec`.

### 7. Design: ícones dos estados do nível (com a Lana)

Combine com a Lana o que é seu e o que é dela. A prioridade são os ícones do mapa: bloqueado,
disponível e concluído. O resto do set de ícones vem depois.

## Quem depende de você

- **Alexandre**, do `exemplo.json` no banco até 17/10. É o que desbloqueia o mapa.
- **O MVP inteiro**, do seed rodando o conteúdo real até 01/11.
