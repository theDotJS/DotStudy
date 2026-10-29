# Guia do Fábio: multiplataforma e integração contínua

**Sua checklist:** `docs/mobile/ChecklistMultiplataformicidade.md`.

## O que mudou no seu papel

O projeto decidiu **não ter deploy público** (está no README: tudo roda local). Então "configurar o
deploy contínuo" e "ambiente de homologação" mudam de forma, sem perder o objetivo:

| Era                     | Vira                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| Deploy contínuo         | **Integração contínua**: todo PR roda lint, build e testes sozinho  |
| Ambiente de homologação | **Acesso pela rede local**: abrir o site no celular, no mesmo Wi-Fi |
| Transformar em PWA      | Fora do MVP, a não ser que o Pedro decida o contrário               |

No Miro os cards ainda estão com os nomes antigos. Eles mudam lá quando o Pedro confirmar esta troca.

## O que fazer, em ordem

### 1. Matriz de compatibilidade e aparelhos do time (até 15/10)

Uma tabela: em uma direção, os navegadores (Chrome, Firefox, Edge, Safari no iPhone, Chrome no
Android); na outra, as telas (login, cadastro, mapa, nível, exercício, resultado). Pergunte no grupo
quais celulares e computadores cada pessoa tem, com sistema e versão. A matriz só tem o que vocês
conseguem testar de verdade.

### 2. Integração contínua no GitHub Actions (até 19/10)

**Por quê:** com várias pessoas mesclando código, alguém vai quebrar o build sem perceber. A integração
contínua roda as verificações em todo PR e mostra o erro antes de ele chegar na `main`.

**Como fazer:**

1. Crie `.github/workflows/verificar.yml`.
2. Ele roda em todo `pull_request` para a `main`.
3. Passos: baixar o código, instalar o Node 20 ou maior, `npm run setup`, `npm run lint`,
   `npm run build`, `npm --prefix apps/api test`.
4. Bônus: o teste e2e (`npm --prefix apps/api run test:e2e`) precisa de um Postgres. O GitHub Actions
   consegue subir um junto, com `services: postgres`. O `.env` não existe lá: as variáveis entram no
   próprio arquivo do workflow, com valores de teste.
5. Abra um PR de propósito com um erro de lint e confira que o GitHub marca em vermelho.

Exigir que a verificação passe antes de mesclar é uma configuração do repositório. Isso é com o Pedro.

**Pesquisar:** documentação do GitHub Actions ("workflow syntax", "actions/setup-node", "service
containers" com PostgreSQL).

### 3. Abrir o site no celular pela rede local (até 24/10)

O betateste e a sua matriz precisam do site aberto em celular de verdade. Descubra e documente no
README, passo a passo:

1. Como descobrir o IP do computador na rede (`ipconfig` no Windows).
2. Como subir o Next aceitando conexão de outro aparelho (procure a opção de "hostname" do `next dev`).
3. Como trocar `NEXT_PUBLIC_API_URL` e `CORS_ORIGIN` no `.env` para usar o IP em vez de `localhost`.
   A API só aceita chamada de **uma** origem, a que está em `CORS_ORIGIN`.
4. Como liberar as portas 3000 e 3333 no Firewall do Windows.

Teste no seu celular até funcionar o login.

**Pesquisar:** "next dev hostname", "CORS origin", "Windows Firewall liberar porta".

### 4. Rodar a matriz inteira (27 a 31/10)

Com as telas prontas, preencha a matriz: funciona, funciona com defeito (registrar bug) ou não
funciona. Dê atenção ao Safari do iPhone, que costuma ser o mais diferente.

### 5. Desempenho: Lighthouse e conexão lenta (27 a 31/10)

- Rode o Lighthouse (no Chrome, F12, aba Lighthouse) em cada tela, no modo celular. Guarde os
  relatórios. Os números vão para a monografia.
- No F12, aba Rede, simule uma conexão lenta e navegue pelo fluxo inteiro. Anote onde a tela fica
  sem resposta.

**Pesquisar:** "Lighthouse performance score", "Core Web Vitals", "network throttling Chrome DevTools".

## Quem depende de você

- **O time inteiro**, da integração contínua: é o que protege a `main` até a entrega.
- **Caio**, do acesso pelo celular para o betateste.
