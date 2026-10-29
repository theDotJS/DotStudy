# Guia do Alexandre: telas web e mobile

**Sua checklist:** `docs/frontend/ChecklistTelasWeb.md` e `docs/mobile/ChecklistLayoutMobile.md`.

## O que já existe

- O Next.js está de pé em `apps/web`, com as rotas vazias `/login`, `/cadastro`, `/mapa` e `/nivel/[id]`.
- **A API está pronta.** Toda rota que você vai chamar existe e responde o que está em
  `docs/contrato-api.md`. Você não precisa esperar ninguém do backend.
- Os protótipos em HTML estão em `apps/web/public/prototipos/` e continuam valendo como referência
  visual até a Lana entregar a alta fidelidade.

**Seu trabalho que ainda não está no repositório:** no Miro, "Construir os componentes de base" está
como Completo e "Telas de Login e Cadastro" como Em andamento, mas o repositório não tem nenhum
componente nem tela além das rotas vazias. Suba isso numa branch e abra o PR antes de começar o
passo 1. Aproveite o que você já fez em vez de refazer a partir deste guia.

**Atenção:** o projeto usa **Next.js 16**, que mudou bastante. Tutorial antigo da internet pode estar
errado. A documentação da versão instalada está em `apps/web/node_modules/next/dist/docs/01-app/`.
Em caso de dúvida, ela vale mais que qualquer vídeo.

## Antes de tudo: rodar API e site juntos

Siga o README da raiz até o passo 6. Com os dois rodando, crie uma conta para ver a API respondendo.
O jeito mais fácil é a extensão Thunder Client no VS Code. Pelo terminal, use o **Git Bash** (no
PowerShell, `curl` é outro comando e esta linha não funciona):

```bash
curl -X POST http://localhost:3333/auth/register -H "Content-Type: application/json" -d "{\"nome\":\"Teste\",\"email\":\"teste@exemplo.com\",\"senha\":\"senhaboa123\"}"
```

## O que fazer, em ordem

### 1. Um arquivo só para falar com a API (até 14/10)

Crie `apps/web/src/lib/api.ts` com uma função que toda tela usa. Ela:

- monta a URL com `process.env.NEXT_PUBLIC_API_URL`;
- coloca `Authorization: Bearer <token>` quando existir token salvo;
- devolve o JSON quando der certo;
- quando der erro, lança um erro com o `codigo` que veio de `{ erro: { codigo } }`.

**Regra:** a tela decide o que mostrar pelo `codigo` (`CREDENCIAIS_INVALIDAS`, `NIVEL_BLOQUEADO`...),
nunca pelo texto da mensagem.

**Pesquisar:** `fetch` com `headers` e `JSON.stringify`, `async/await`, `try/catch`.

### 2. Login e cadastro funcionando (até 16/10)

- Formulário com `nome`, `email`, `senha` (cadastro) ou `email`, `senha` (login).
- Ao dar certo: guarde o `token` no `localStorage` e vá para `/mapa`.
- Ao dar erro: mostre a mensagem embaixo do campo certo. Erro de validação traz `campos`, por exemplo
  `{ "senha": "A senha precisa ter pelo menos 8 caracteres." }`.
- Botão desabilitado enquanto espera a resposta, para ninguém clicar duas vezes.

Onde o token fica pode mudar (decisão C1, do Gabriel e do Pedro). Deixe a leitura e a escrita do token
em **um** lugar só dentro do `api.ts`, para a troca custar uma linha.

**Pesquisar:** no Next 16, "Client Components" e a diretiva `"use client"`; `useState`; `useRouter`
de `next/navigation`; `localStorage`.

### 3. Proteção de rota (até 17/10)

- Sem token salvo, `/mapa` e `/nivel/[id]` mandam para `/login`.
- Qualquer chamada que volte `401` apaga o token e manda para `/login` (o login expirou).

Isso é conveniência, não segurança: quem protege de verdade é a API.

### 4. Tela do mapa (até 21/10)

**Uma chamada só:** `GET /me/progress`. Ela já traz ordem, título e estado de cada nível.

- `bloqueado`: aparece, mas não é clicável.
- `disponivel`: clicável, leva para `/nivel/<nivelId>`.
- `concluido`: clicável, mostra o `melhorPercentual`.

Para ter dados antes do conteúdo real, o Fabiano vai colocar uma trilha de exemplo no banco até 17/10.
Até lá, faça a tela com um JSON copiado do contrato.

### 5. Tela do nível e do exercício (até 24/10)

- `GET /levels/:id` traz `conteudo` em markdown, `fontes` e `questoes`.
- **As fontes aparecem na tela.** É o diferencial que o TCC defende, não é rodapé escondido.
- Uma questão por vez ou todas na mesma página: combine com a Lana.
- Só habilite o botão de enviar quando todas as questões tiverem resposta.
- Envio: `POST /levels/:id/submit` com `{ "respostas": [{ "questaoId": "...", "alternativaId": "a" }] }`.

**Pesquisar:** `react-markdown` para mostrar o conteúdo; "controlled inputs" e `input type="radio"`.

### 6. Tela de resultado (até 26/10)

Mostre `acertos` de `total`, o `percentual` comparado com a `notaDeCorte`, e qual questão acertou ou
errou (`porQuestao`). Se `proximoNivelLiberado` vier preenchido, botão para ir direto a ele. Se
reprovou, botão para tentar de novo: tentativa é ilimitada (RN-04).

### 7. Carregando, erro e celular, em toda tela (junto com cada tela)

- Toda tela tem três estados: carregando, erro e pronto. Tela branca enquanto carrega parece quebrada.
- **Mobile primeiro:** escreva o CSS para tela estreita e acrescente `md:` e `lg:` do Tailwind para
  telas maiores. Não deixe o celular para o fim, porque não vai sobrar tempo.
- Botão e área clicável com pelo menos 44 x 44 px.
- Teste com o teclado virtual aberto nas telas de login e cadastro.

**Pesquisar:** Tailwind "responsive design" e "mobile-first"; WCAG critério 2.5.5 (tamanho do alvo).

## Quem depende de você

- **Caio e Adriana**, para o teste do fluxo completo a partir de 27/10.
- **Fábio**, para rodar a matriz de compatibilidade nos aparelhos.
- **O betateste**: sem as cinco telas ligadas na API, não há o que testar.

## De quem você depende

- **Lana**, para o visual de cada tela. Se o desenho atrasar, siga com o protótipo e troque o visual
  depois: tela funcionando com visual provisório vale mais que tela bonita parada.
- **Fabiano**, para os dados de exemplo no banco.
