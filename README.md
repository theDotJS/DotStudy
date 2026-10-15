# DotStudy

Plataforma de estudos com progressão por níveis sequenciais. Projeto de TCC, sem fim comercial.

**Prazo do MVP:** 15/11/2026 · **Feature freeze:** 01/11/2026

> **Tudo roda localmente.** Não há serviço pago, conta em nuvem ou deploy público neste momento.
> Banco no seu computador, API no seu computador, site no seu computador.

---

## Setup: do zero até rodar

**CRITÉRIO desta seção:** qualquer pessoa do time consegue rodar sozinha seguindo só este texto.
Se travar em algum passo, o passo está errado. Avise no grupo em vez de resolver no particular.

### 1. Instalar o que é obrigatório

| Programa                                                          | Versão           | Como conferir   |
| ----------------------------------------------------------------- | ---------------- | --------------- |
| [Node.js](https://nodejs.org)                                     | 20 ou maior      | `node -v`       |
| [Git](https://git-scm.com)                                        | qualquer recente | `git --version` |
| [VS Code](https://code.visualstudio.com)                          | qualquer         | —               |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | qualquer         | `docker -v`     |

Docker é só para o banco de dados. Se não conseguir instalar no seu Windows, veja o
**Plano B** no fim deste arquivo.

### 2. Clonar e instalar

```bash
git clone https://github.com/theDotJS/DotStudy.git
cd DotStudy
npm run setup
```

`npm run setup` instala as dependências de `apps/web` e `apps/api`. Demora alguns minutos na
primeira vez.

### 3. Criar o seu `.env`

```bash
cp .env.example .env
```

Abra o `.env` e troque `POSTGRES_PASSWORD` por qualquer senha sua. Troque também dentro da
`DATABASE_URL`, que repete a mesma senha.

> **O `.env` nunca vai para o Git.** Ele está no `.gitignore`. O que vai é o `.env.example`,
> que tem os nomes das variáveis e nenhum valor real. Se você algum dia vir um `.env` aparecendo
> em `git status`, pare e avise.

### 4. Subir o banco

```bash
npm run db:up
```

Confira que subiu: `docker ps` deve listar `dotstudy-postgres`.

Para derrubar: `npm run db:down`. Os dados ficam salvos.

### 5. Rodar

Precisa de **dois terminais abertos ao mesmo tempo**.

Terminal 1, a API:

```bash
npm run dev:api
```

Terminal 2, o site:

```bash
npm run dev:web
```

### 6. Conferir que funcionou

| Endereço                                          | O que você deve ver                            |
| ------------------------------------------------- | ---------------------------------------------- |
| <http://localhost:3333/health>                    | `{"status":"ok"}`                              |
| <http://localhost:3000>                           | Índice de desenvolvimento com a lista de rotas |
| <http://localhost:3000/login>                     | A palavra "Login"                              |
| <http://localhost:3000/prototipos/menu/menu.html> | O protótipo com o menu lateral abrindo         |

Se os quatro funcionam, seu ambiente está pronto. Essa é a tarefa `S0 · Montar o ambiente`.

---

## Como o repositório é organizado

```
DotStudy/
├─ apps/
│  ├─ web/              Next.js + TypeScript + Tailwind (porta 3000)
│  │  └─ public/prototipos/   HTML e CSS em uso ate o HTML final existir
│  └─ api/              NestJS + TypeScript + Prisma (porta 3333)
├─ docs/
│  ├─ contrato-api.md         O que cada rota recebe e devolve
│  ├─ regras-de-negocio.md    As regras em portugues, antes de virarem codigo
│  ├─ backend/ frontend/ mobile/ testes_pesquisa/   Checklists por cargo
├─ docker-compose.yml   Postgres local
├─ .env.example         Modelo do .env. O .env real fica fora do Git.
└─ dotstudy-plano-desenvolvimento.md
```

### Onde começar a ler

1. `dotstudy-plano-desenvolvimento.md` — o escopo do MVP e o que ficou de fora.
2. `docs/contrato-api.md` — se você mexe em tela ou em rota, começa aqui.
3. A checklist do seu cargo em `docs/`.

---

## Regras de trabalho

- **Branch curta, por tarefa.** `git checkout -b s3-tela-de-login`. Nada direto na `main`.
- **Revisão obrigatória** antes de mesclar. Uma pessoa lê o que a outra escreveu.
- **Contrato primeiro.** Mudou rota, atualiza `docs/contrato-api.md` no mesmo commit e avisa no grupo.
- **Sem segredo no código.** Senha, chave e string de conexão moram no `.env`. O histórico do Git
  guarda tudo para sempre: se vazar, não basta apagar, tem que trocar a chave.
- **Antes de commitar:** `npm run format` e `npm run lint`.

---

## Plano B: Postgres sem Docker

Se o Docker Desktop não rodar na sua máquina:

1. Instale o [PostgreSQL 16 para Windows](https://www.postgresql.org/download/windows/).
2. Na instalação, anote a senha do usuário `postgres`.
3. Crie o banco:

   ```bash
   psql -U postgres -c "CREATE DATABASE dotstudy;"
   ```

4. No seu `.env`, ajuste a `DATABASE_URL` para o usuário e a senha que você definiu.

O resto dos passos é igual.

---

## O que este projeto ainda não tem

Deploy público, PWA, domínio e serviço de e-mail estão fora por decisão, não por esquecimento.
O betateste da S9 acontece presencialmente ou pela rede local. Ver a seção de escopo do plano
de desenvolvimento.
