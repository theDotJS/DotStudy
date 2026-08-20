# DotStudy — Plano de Desenvolvimento e Checklist por Cargo

**Prazo do MVP:** 15/11/2026
**Feature freeze:** 01/11/2026 (nada novo entra depois disso, só correção)
**Equipe:** 11 pessoas, todas iniciantes
**Natureza:** TCC, sem fim comercial

---

## 1. Como ler este documento

Cada cargo tem uma checklist com tarefas marcadas por semana (S0 a S10). A tarefa vem com uma linha de descrição: o objetivo é que ninguém precise perguntar "o que exatamente eu faço aqui".

Três marcadores aparecem ao longo do texto:

- **DECISÃO** — algo que precisa de resposta humana antes de virar código. Não avance sem fechar.
- **RISCO** — ponto onde o projeto costuma travar.
- **CRITÉRIO** — a régua que define se a tarefa está pronta.

---

## 2. Escopo do MVP: o que é e o que não é

### A feature única

> Um usuário se cadastra, escolhe **uma trilha de estudo**, e avança por **níveis sequenciais**. Cada nível tem conteúdo curado de fonte confiável e um exercício de verificação. Acertar o mínimo desbloqueia o próximo nível. O progresso fica salvo.

Uma trilha. Um assunto. Entre 8 e 12 níveis. É isso.

**CRITÉRIO de MVP entregue:** uma pessoa de fora do time consegue criar conta, completar os 10 níveis do começo ao fim, sair do site, voltar no dia seguinte e encontrar o progresso onde parou. Se isso funciona, o MVP existe. Se não funciona, nenhuma outra tela importa.

### O que fica de fora (e volta como "trabalhos futuros" no TCC)

| Fora do MVP | Por quê |
|---|---|
| DotChat (chat com IA) | É uma segunda feature inteira. Vira demo estática, se der tempo. |
| Múltiplas trilhas/matérias | Uma trilha prova o mecanismo. Dez trilhas só multiplicam o trabalho de curadoria. |
| App mobile nativo | Ver decisão D3. |
| Ranking, ligas, amigos | Social é a parte mais cara de fazer e a menos essencial para defender a tese. |
| Notificações push / e-mail | Depende de infra externa e domínio verificado. |
| Painel administrativo | O conteúdo entra por script de seed no banco. |
| Recuperação de senha por e-mail | Exige serviço de e-mail configurado. Redefinição manual no MVP. |

**RISCO principal do projeto:** não é técnico, é de escopo. 11 pessoas iniciantes tendem a produzir 11 features começadas e zero terminadas. A regra que protege vocês: nada entra na lista acima antes de 01/11.

---

## 3. Decisões abertas (fechar até 26/08)

### D1 — Direção visual: ilustração pintada ou pixel art?

As duas imagens conceituais são estilos diferentes e incompatíveis. Precisa escolher um.

| | Ilustração pintada (imagem 1) | Pixel art (imagem 2) |
|---|---|---|
| Custo de produção | Alto: cada novo asset é uma ilustração nova | Baixo: assets pequenos, reutilizáveis, editáveis em qualquer editor |
| Consistência com iniciantes | Difícil: qualquer asset novo destoa | Fácil: a grade de pixels perdoa erro de traço |
| Peso do arquivo | Imagens grandes, prejudica carregamento | Leve |
| Adaptação a tela pequena | Perde detalhe, precisa de arte separada | Escala bem em múltiplos inteiros |

**Recomendação:** pixel art. O motivo não é gosto, é ritmo de produção — vocês vão precisar de dezenas de ícones, estados de nível (bloqueado, disponível, concluído) e variações, e pixel art é o único dos dois que uma equipe iniciante consegue manter consistente em 12 semanas.
**Quem decide:** Lana e Alexandre, com aval do orientador.

### D2 — App nativo ou web responsiva?

Três cargos hoje apontam para app nativo (Layout Mobile, Rotas do Backend, Multiplataformicidade).

| | App nativo (React Native) | Web responsiva + PWA |
|---|---|---|
| Codebase | Dois projetos para manter | Um |
| Curva de aprendizado | Ambiente de build, emulador, assinatura de app | Nenhuma além do que já vão aprender |
| Instalável no celular | Sim | Sim (PWA: "adicionar à tela inicial") |
| Custo em semanas | 4 a 5 semanas de equipe | ~1 semana |
| Publicação em loja | Conta de desenvolvedor paga, revisão de dias | Não se aplica |

**Recomendação:** web responsiva com PWA. Vocês entregam algo que abre no celular, instala na tela inicial e funciona, sem manter dois códigos. Os três cargos continuam existindo, com conteúdo redefinido (ver seções 6.3):

- **Layout Mobile (Alexandre):** desenhar e implementar os breakpoints mobile das mesmas telas.
- **Rotas do Backend (Pedro):** contrato da API que serve tanto web quanto mobile, documentado.
- **Multiplataformicidade (Fabio):** PWA, testes em navegadores e aparelhos reais, deploy.

**Quem decide:** você, com o orientador. Se o TCC exige app nativo por escrito, avise imediatamente — o escopo da feature única precisa encolher ainda mais.

### D3 — Pedro está em 4 cargos

Pedro aparece em API, Regra de Negócios, Rotas do Backend e Auxiliador Geral. É o gargalo estrutural do projeto: se ele atrasa, tudo atrasa.

**Recomendação:** Pedro sai de "Auxiliador Geral" (fica só Fabiano) e Gabriel assume a maior parte das regras de negócio. Pedro concentra em API + contrato de rotas.

---

## 4. Stack recomendada

Escolhida por um critério só: menor quantidade de coisas novas para aprender.

| Camada | Escolha | Motivo |
|---|---|---|
| Frontend | **Next.js (React) + TypeScript** | Rotas prontas, deploy em um clique na Vercel, mesma linguagem do backend |
| Estilo | **Tailwind CSS** | Não exige arquitetura de CSS, que é onde time iniciante se perde |
| Backend | **NestJS + TypeScript** | Estrutura opinativa: o iniciante tem menos decisões livres para errar |
| ORM | **Prisma** | Schema declarativo, migrations automáticas, tipagem gerada |
| Banco | **PostgreSQL** (Supabase ou Neon, plano gratuito) | Relacional, gratuito, sem precisar administrar servidor |
| Autenticação | **Biblioteca pronta** (Auth.js ou Supabase Auth) | Ver aviso abaixo |
| Deploy | Vercel (front) + Railway/Render (API) | Planos gratuitos suficientes para TCC |

**Alternativa mais enxuta:** se o time achar Next.js + NestJS pesado demais, dá para fazer tudo em Next.js (front e API na mesma aplicação). Menos código, menos deploy, menos conceito novo. A troca é que fica menos parecido com arquitetura de mercado, o que pode pesar na banca.

**RISCO — autenticação:** não escrevam login do zero. Hash de senha, sessão, token, expiração e proteção contra ataque de força bruta são um conjunto de detalhes onde erro de iniciante vira falha real. Use biblioteca. Gabriel documenta *como* a biblioteca resolve cada um desses pontos — isso rende um capítulo bom do TCC e vale mais que uma implementação caseira frágil.

---

## 5. O papel da IA: pipeline de conteúdo, não chat ao vivo

Esta é a decisão de arquitetura mais importante do projeto.

### A armadilha

O caminho intuitivo é: usuário abre o nível → o site chama a API da IA → a IA gera o conteúdo na hora. Isso te dá quatro problemas de uma vez:

1. **Latência.** Cada nível demora segundos para abrir.
2. **Custo por acesso.** Toda visita gasta dinheiro, inclusive quando 30 pessoas leem o mesmo nível.
3. **Não reprodutível.** Duas pessoas veem conteúdos diferentes no mesmo nível. Impossível de testar e frágil de defender na banca.
4. **Conteúdo não verificado.** A IA erra, e o erro chega no usuário sem ninguém ter olhado.

### O caminho recomendado: geração offline com validação humana

A IA roda **antes**, num script separado, e o resultado é salvo no banco. O site em produção lê do banco e nunca chama a IA.

```
1. Whitelist de fontes    → lista fechada de fontes confiáveis (Wikipedia PT, .edu.br,
                            portais educacionais definidos pela Gabrielly)
2. Ingestão               → script busca o texto bruto (a API do MediaWiki, da Wikipedia,
                            é gratuita e devolve conteúdo estruturado)
3. Estruturação (IA)      → a IA divide o assunto em N níveis com objetivo de
                            aprendizagem por nível
4. Geração (IA)           → por nível: resumo didático + 5 questões + gabarito,
                            cada afirmação com o trecho-fonte de onde saiu
5. Validação HUMANA       → Gabrielly e Adriana leem, corrigem e aprovam.
                            Nada entra no banco sem esse carimbo.
6. Seed                   → o conteúdo aprovado vira registro no PostgreSQL
```

O passo 5 não é burocracia: é o que separa "usei IA" de "usei IA com controle de qualidade" na hora da defesa. Documente a taxa de rejeição — quantos itens gerados foram reprovados e por quê. Esse número é um dos resultados mais fortes que um TCC sobre IA aplicada pode apresentar.

### Custo

Baixo a ponto de não ser critério de decisão. Contas com um modelo da faixa mais barata (Claude Haiku 4.5 está listado em US$ 1 por milhão de tokens de entrada e US$ 5 de saída; <cite index="9-1">o Batch API aplica 50% de desconto</cite>; confira os valores vigentes em claude.com/pricing e platform.openai.com/pricing, porque mudam):

- 10 níveis × ~5.000 tokens de entrada = 50.000 tokens de entrada
- 10 níveis × ~2.000 tokens de saída = 20.000 tokens de saída
- Custo aproximado por rodada completa: **menos de US$ 0,20**

Mesmo refazendo tudo vinte vezes durante o desenvolvimento, o gasto total fica na casa de poucos dólares. Como a geração é offline e não tem pressa, <cite index="2-1">o Batch API processa em lote de forma assíncrona por metade do preço padrão</cite> — vale usar.

**Qual API escolher:** tanto faz para o resultado. Escolha pela facilidade de conseguir crédito e pela documentação que o time achar mais legível. Ambas atendem.

### E fazer um agente do zero?

Não, e a recomendação é firme. Treinar um modelo de linguagem próprio exige dados, hardware e meses — nada disso cabe em 12 semanas com equipe iniciante. Mais importante: **não é onde está a contribuição do seu TCC.** A contribuição é o pipeline — a whitelist de fontes, a estruturação em níveis, a validação humana, a medição de qualidade. O modelo é insumo, como o PostgreSQL é insumo. Ninguém escreve um banco de dados do zero para fazer um TCC sobre sistemas de informação.

Se quiser um componente autoral de IA sem sair do prazo, há uma opção barata: **classificador de dificuldade** feito com técnica clássica (métricas de legibilidade tipo Flesch adaptado ao português, contagem de termos técnicos) para ordenar os níveis do mais fácil ao mais difícil. É código seu, roda em segundos, e rende discussão metodológica.

---

## 6. Checklists por cargo

Notação: `S0` a `S10` marcam a semana-alvo de conclusão.

Calendário de referência:

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

---

### 6.1 Backend

#### API — Pedro

- [ ] **S0 · Criar o repositório e a estrutura de pastas** — Um repositório com `apps/web` e `apps/api`. Configurar ESLint e Prettier para o código sair padronizado de todo mundo.
- [ ] **S0 · Escrever o README de setup** — Passo a passo para qualquer pessoa do time rodar o projeto na própria máquina. **CRITÉRIO:** o Caio consegue rodar sozinho seguindo só o texto.
- [ ] **S1 · Definir o contrato da API antes de codar** — Documento listando cada rota: método, caminho, o que recebe, o que devolve, códigos de erro. Frontend e mobile trabalham em cima desse papel enquanto a API não existe.
- [ ] **S2 · Subir o esqueleto do NestJS com rota de health check** — Uma rota `GET /health` que responde `{ status: "ok" }`. Serve para provar que o servidor sobe e responde.
- [ ] **S2 · Conectar a API ao banco via Prisma** — Cliente configurado, variáveis de ambiente em `.env`, `.env` no `.gitignore`.
- [ ] **S3 · Rotas de autenticação** — `POST /auth/register` e `POST /auth/login`. Devolve token de sessão. Feito com biblioteca, em par com o Gabriel.
- [ ] **S3 · Middleware de rota protegida** — Bloqueio que rejeita requisição sem token válido, devolvendo 401.
- [ ] **S4 · Rotas de leitura de conteúdo** — `GET /tracks`, `GET /tracks/:id/levels`, `GET /levels/:id`. Só leitura, sem lógica.
- [ ] **S5 · Rota de progresso do usuário** — `GET /me/progress`: devolve, para cada nível, se está bloqueado, disponível ou concluído.
- [ ] **S6 · Rota de submissão de resposta** — `POST /levels/:id/submit`: recebe as respostas, devolve acertos e se passou. **A correção acontece no servidor.** Nunca mande o gabarito para o navegador.
- [ ] **S7 · Rota de conclusão de nível** — Grava a conclusão e libera o próximo nível.
- [ ] **S7 · Tratamento de erro padronizado** — Toda falha devolve o mesmo formato de JSON. Sem `stack trace` vazando para o cliente.
- [ ] **S8 · Documentação automática (Swagger)** — Página que lista todas as rotas. Vira anexo da monografia.
- [ ] **S8 · Deploy da API em ambiente público** — URL acessível de qualquer lugar, com variáveis de ambiente de produção.

#### Banco de Dados — Fabiano

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

#### Regra de Negócios — Gabriel, Pedro

- [ ] **S1 · Escrever as regras em português antes de virar código** — Um documento curto, frases afirmativas. Exemplo de partida:
  - O nível 1 de uma trilha começa sempre disponível.
  - Um nível fica disponível quando o nível de ordem imediatamente anterior está concluído.
  - Um nível é concluído com 70% ou mais de acerto.
  - Reprovar não bloqueia nada: o usuário pode tentar de novo, sem limite.
  - Refazer um nível já concluído não diminui a pontuação.
- [ ] **S1 · DECISÃO: definir a nota de corte** — 70% é chute razoável, não verdade. Deixe o número em configuração, não fixo no código, porque o betateste vai sugerir mudar.
- [ ] **S5 · Implementar o cálculo de estado do nível** — Função que recebe usuário e trilha e devolve, por nível: `bloqueado | disponivel | concluido`.
- [ ] **S6 · Implementar a correção de exercício** — Compara respostas com gabarito, calcula percentual, decide aprovação. **Só no servidor.**
- [ ] **S6 · Implementar o registro de tentativa** — Toda submissão vira linha em `attempts`, mesmo reprovada. Esses dados são a matéria-prima da análise do TCC.
- [ ] **S7 · Implementar o desbloqueio** — Aprovação em um nível libera o próximo, dentro de uma transação de banco (ou grava tudo, ou não grava nada).
- [ ] **S7 · Escrever testes das regras** — No mínimo: nível 1 começa aberto; 69% reprova e 70% aprova; nível 3 não abre com nível 2 pendente. **CRITÉRIO:** os testes rodam com um comando e passam.
- [ ] **S9 · Documentar cada regra e sua justificativa** — Por que 70% e não 60%. A banca pergunta.

#### Segurança do App — Gabriel

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

### 6.2 Frontend

#### Prototipagem de Layout — Lana

- [ ] **S0 · Escolher a ferramenta e abrir o arquivo compartilhado** — Figma no plano gratuito. Todo o time com link de leitura.
- [ ] **S0 · Fechar a DECISÃO D1 (pixel art ou ilustração)** — Com o Alexandre. Trava o resto do trabalho visual.
- [ ] **S1 · Mapear o fluxo de telas em caixinhas** — Login → Cadastro → Mapa de Níveis → Tela de Nível → Exercício → Resultado. Só retângulos e setas, sem cor. Define o que precisa existir.
- [ ] **S1 · Wireframe em baixa fidelidade das 6 telas** — Cinza, sem arte, só posição de elemento. Barato de jogar fora e refazer, que é o objetivo nesta fase.
- [ ] **S2 · Definir o sistema de design** — Paleta (o amarelo/areia e o marrom das imagens funcionam), fonte para título e para texto, escala de espaçamento (4, 8, 16, 24, 32px). **CRITÉRIO:** Alexandre consegue montar tela nova sem inventar cor.
- [ ] **S2 · Desenhar os quatro estados do nó de nível** — Bloqueado, disponível, em progresso, concluído. Precisam ser distinguíveis **sem depender só de cor** (forma, cadeado, brilho), por acessibilidade.
- [ ] **S3 · Alta fidelidade: Login e Cadastro** — Incluindo estado de erro ("senha incorreta") e de carregamento.
- [ ] **S4 · Alta fidelidade: Mapa de Níveis** — A tela principal. Caminho, nós, indicador de posição do usuário.
- [ ] **S5 · Alta fidelidade: Tela de Nível e Exercício** — Leitura do conteúdo, citação da fonte, alternativas, botão de responder.
- [ ] **S5 · Alta fidelidade: Tela de Resultado** — Aprovado e reprovado. **RISCO:** o estado de reprovação define se a pessoa volta ou desiste. Reprovar precisa parecer "tenta de novo", não "você falhou".
- [ ] **S6 · Versão mobile de todas as telas** — Largura de 375px. Mostrar o que empilha, o que some, o que vira menu.
- [ ] **S7 · Entregar os assets exportados** — PNG/SVG nas resoluções necessárias, nomeados de forma consistente, em pasta organizada para o Alexandre.

#### Telas Web — Alexandre

- [ ] **S0 · Montar o ambiente** — Node, editor, Git funcionando. Conseguir clonar o repositório e rodar o projeto.
- [ ] **S1 · Subir o Next.js e criar as rotas vazias** — `/login`, `/cadastro`, `/mapa`, `/nivel/[id]`. Páginas em branco com o nome escrito. Prova que a navegação funciona.
- [ ] **S2 · Traduzir o sistema de design para o Tailwind** — Cores e fontes da Lana configuradas no `tailwind.config`. A partir daqui, ninguém escreve código de cor solta.
- [ ] **S2 · Construir os componentes de base** — Botão, campo de texto, card, mensagem de erro. Um lugar só para cada, reutilizados em todas as telas.
- [ ] **S3 · Telas de Login e Cadastro** — Com validação visual: campo vazio, e-mail inválido, senha curta, erro do servidor.
- [ ] **S3 · Ligar o login à API** — Enviar credenciais, guardar o token, redirecionar. Em par com o Pedro.
- [ ] **S4 · Proteção de rota no frontend** — Quem não está logado e tenta abrir `/mapa` volta para `/login`.
- [ ] **S5 · Tela do Mapa de Níveis** — Renderiza os nós na trilha lendo o estado da API. Nó bloqueado não é clicável.
- [ ] **S6 · Tela de Nível** — Exibe conteúdo e **a fonte com link visível**. Citar a origem não é detalhe: é o diferencial que o TCC defende.
- [ ] **S6 · Tela de Exercício** — Seleciona alternativa, envia, mostra o retorno do servidor.
- [ ] **S7 · Tela de Resultado e retorno ao mapa** — Fecha o ciclo. **CRITÉRIO:** completar um nível e ver o próximo desbloquear na mesma sessão, sem recarregar na mão.
- [ ] **S7 · Estados de carregamento e de erro em toda tela** — Nada de tela branca enquanto a API responde. Nada de travar quando ela falha.
- [ ] **S8 · Responsividade** — Mesmo código funcionando em 375px e em 1440px, usando os desenhos da Lana.

#### Design — Lana, Alexandre

- [ ] **S1 · Fechar identidade da marca** — O gato preto de olhos amarelos já é forte e consistente nas duas imagens. Mantenham. Definir versões: logo completo, ícone isolado, versão mono.
- [ ] **S2 · Produzir o set de ícones** — Home, Perfil, Biblioteca, Provas, Histórico, Configurações. Mesmo estilo, mesma grade, mesma espessura.
- [ ] **S3 · Desenhar os assets do mapa** — Caminho, nó, marcadores de cenário. Se for pixel art, definir a grade base (16×16 ou 32×32) e não sair dela.
- [ ] **S4 · Checar contraste de texto** — Texto sobre fundo precisa passar em contraste 4.5:1. O amarelo da imagem 2 com texto claro provavelmente reprova. Ferramenta: WebAIM Contrast Checker.
- [ ] **S5 · Definir o feedback visual de acerto e erro** — Cor, ícone, movimento. **RISCO:** verde e vermelho sozinhos excluem daltônicos. Sempre acompanhar de ícone ou texto.
- [ ] **S6 · Tela de perfil e barra de progresso** — Elemento que mostra "você está no nível 4 de 10". É o gancho de retorno do usuário.
- [ ] **S7 · Revisão de consistência** — Percorrer o site inteiro procurando cor fora do sistema, espaçamento irregular, botão diferente. Lista de correções para a S8.

---

### 6.3 Mobile

> Escopo redefinido conforme a **DECISÃO D3**: web responsiva com PWA em vez de app nativo. Se a decisão for outra, esta seção precisa ser reescrita e a feature única encolhida.

#### Layout Mobile — Alexandre

- [ ] **S2 · Adotar mobile-first como padrão de escrita** — Escrever o CSS para tela pequena primeiro e ir ampliando. Inverter isso depois é retrabalho garantido.
- [ ] **S6 · Adaptar o menu lateral** — O menu fixo da imagem 2 não cabe em 375px. Vira menu retrátil acionado pelo ícone de três linhas.
- [ ] **S6 · Adaptar o mapa de níveis para tela vertical** — O mapa horizontal precisa virar rolagem vertical ou ter zoom controlado. É a adaptação mais difícil do projeto.
- [ ] **S7 · Garantir área de toque mínima** — Todo elemento clicável com pelo menos 44×44px. Nó de nível pequeno demais é o problema de usabilidade mais comum em mapa de trilha.
- [ ] **S7 · Testar com teclado virtual aberto** — Nos campos de login, o teclado do celular cobre metade da tela. Verificar que o botão de enviar continua alcançável.

#### Rotas do Backend — Pedro

- [ ] **S1 · Publicar o contrato de rotas como documento vivo** — Uma fonte única de verdade para web e mobile. Toda mudança é anunciada no grupo.
- [ ] **S4 · Padronizar o formato de resposta** — Toda rota devolve o mesmo envelope (`{ data, error }`). Consistência reduz bug de integração pela metade.
- [ ] **S5 · Reduzir o número de chamadas por tela** — O mapa deve carregar com **uma** requisição, não com uma por nível. Em rede móvel, cada chamada extra custa segundos.
- [ ] **S6 · Verificar tempo de resposta** — Nenhuma rota acima de 1 segundo em condição normal. Se passar, provavelmente falta índice no banco (falar com o Fabiano).
- [ ] **S8 · Configurar cabeçalhos de cache** — Conteúdo de nível quase não muda; pode ser cacheado. Progresso de usuário, nunca.

#### Multiplataformicidade — Fabio

- [ ] **S0 · Montar a matriz de compatibilidade** — Planilha: navegadores (Chrome, Firefox, Safari, Edge), sistemas (Windows, Android, iOS), tamanhos (375, 768, 1440). É o mapa do que precisa ser testado.
- [ ] **S3 · Levantar os aparelhos reais disponíveis no time** — Quem tem iPhone, quem tem Android, quais versões. Emulador não pega bug de Safari real.
- [ ] **S5 · Configurar o deploy contínuo** — Push na `main` publica automaticamente. **CRITÉRIO:** existe uma URL pública que qualquer pessoa abre no celular.
- [ ] **S6 · Criar o ambiente de homologação** — Uma segunda URL, separada da principal, para o time testar sem quebrar a versão que o orientador acessa.
- [ ] **S7 · Transformar o site em PWA** — `manifest.json` com nome, ícones e cor de tema; service worker básico. **CRITÉRIO:** abrir no celular e conseguir "adicionar à tela inicial", com ícone do gato aparecendo.
- [ ] **S8 · Rodar a matriz de compatibilidade inteira** — Cada combinação, com print da tela. Anotar cada diferença encontrada.
- [ ] **S8 · Rodar auditoria de performance (Lighthouse)** — Meta realista: acima de 80 em Performance e Acessibilidade. O relatório entra como evidência no TCC.
- [ ] **S9 · Testar em conexão lenta** — Simular 3G nas ferramentas do navegador. Se o mapa demora 15 segundos, os assets estão pesados demais (voltar para a Lana).

---

### 6.4 Testes e Pesquisa

#### Betatesting e Pesquisa de Bugs — Caio, Adriana

- [X] **S0 · Escolher onde os bugs vivem** — GitHub Issues, Trello ou Jira. Um lugar só. Bug relatado em conversa de WhatsApp se perde.
- [ ] **S0 · Criar o modelo de relato de bug** — Campos obrigatórios: o que eu fiz, o que eu esperava, o que aconteceu, navegador/aparelho, print. **RISCO:** "não funciona" gasta mais tempo do dev do que o bug em si.
- [ ] **S1 · Definir a escala de severidade** — Crítico (trava o uso), Alto (feature quebrada com desvio possível), Médio (comportamento errado sem travar), Baixo (visual). Só Crítico e Alto param a sprint.
- [ ] **S3 · Escrever os roteiros de teste** — Passo a passo do que testar em cada tela, com resultado esperado. Escrever **antes** da tela existir, a partir dos desenhos da Lana.
- [ ] **S4 · Começar o teste exploratório da autenticação** — Cadastrar com e-mail repetido, senha vazia, e-mail sem `@`, senha de 1 caractere, campos com espaço. Quebrar de propósito é o trabalho.
- [ ] **S6 · Testar o fluxo completo do nível** — Responder tudo certo, tudo errado, metade, sair no meio, voltar, recarregar a página no meio do exercício.
- [ ] **S7 · Testar as regras de progressão** — Tentar acessar nível bloqueado direto pela URL. Tentar concluir o nível 5 sem ter feito o 4. **Precisa falhar.** Se conseguir, é bug crítico.
- [ ] **S9 · Rodar o teste com 8 a 12 usuários reais** — Pessoas de fora do time. Roteiro: "estude até o nível 5". **Observar calado.** Não explicar, não ajudar, anotar onde travam.
- [ ] **S9 · Aplicar o questionário SUS após cada sessão** — System Usability Scale: 10 perguntas padronizadas, resulta numa nota de 0 a 100. É instrumento validado academicamente e dá à monografia um número defensável em vez de impressão.
- [ ] **S10 · Consolidar o relatório de testes** — Bugs por severidade, taxa de conclusão da tarefa, nota SUS, principais pontos de travamento. Vira capítulo de resultados.

#### Pesquisa de Negócios — Gabrielly

- [ ] **S1 · Analisar os concorrentes com método** — Duolingo, Mimo, Khan Academy, Brilliant. Para cada um, responder as mesmas cinco perguntas: como estrutura a progressão, como trata o erro, o que faz o usuário voltar, o que cobra, o que não faz.
- [ ] **S1 · Definir o público-alvo em uma frase** — Vestibulando? Universitário? Autodidata adulto? Muda tudo: linguagem, tamanho do nível, assunto da trilha. **DECISÃO** que trava com o orientador.
- [ ] **S2 · DECISÃO: escolher a matéria da trilha única** — Precisa ter fonte confiável farta e ordem natural de dificuldade. **Recomendação:** algo com progressão inequívoca (lógica de programação, fundamentos de estatística, gramática). Evitar assunto polêmico ou de fonte escassa.
- [ ] **S2 · Montar a whitelist de fontes** — Lista fechada e escrita de domínios permitidos. Cada um com uma linha justificando por que é confiável. Sem essa lista, "fontes confiáveis" é só uma promessa no resumo do TCC.
- [ ] **S3 · Definir os objetivos de aprendizagem dos 10 níveis** — Frases no formato "ao final deste nível, o usuário sabe X". É o esqueleto que a IA vai preencher.
- [ ] **S4 · Validar o conteúdo gerado pela IA** — Com a Adriana. Ler item por item: a informação está correta, a fonte confere, a questão tem gabarito único e defensável. **CRITÉRIO:** nada entra no banco sem aprovação assinada.
- [ ] **S4 · Registrar a taxa de rejeição** — Quantos itens gerados foram reprovados e por qual motivo. É um dos resultados mais fortes do TCC.
- [ ] **S5 · Levantar a fundamentação teórica de gamificação** — Referências reais sobre progressão, recompensa e retenção. Sustenta a escolha de design na banca.
- [ ] **S8 · Definir as métricas de sucesso do MVP** — Percentual de usuários que completam o nível 1, que chegam ao 5, tempo médio por nível. Alinhar com a Adriana e o Caio o que será medido no betateste.

#### Auxiliador Geral — Fabiano

> Recomenda-se tirar Pedro deste cargo (ver DECISÃO D4).

- [ ] **S0 · Definir o ritual de reunião** — 30 minutos, dia fixo, semanal. Três perguntas por pessoa: o que fiz, o que farei, o que me trava. **RISCO:** sem cadência fixa, equipe de 11 iniciantes se descoordena em duas semanas.
- [ ] **S0 · Montar o quadro de tarefas** — A Fazer, Fazendo, Em Revisão, Pronto. Toda tarefa deste documento vira cartão com dono e prazo.
- [ ] **S1 · Escrever o guia de Git do time** — Como criar branch, como nomear commit, como abrir pull request. **RISCO:** conflito de merge é a principal fonte de trabalho perdido em time iniciante.
- [ ] **S1 · Estabelecer a regra de revisão de código** — Nada entra na `main` sem outra pessoa ler. Não é desconfiança: é a forma mais rápida de iniciante aprender com iniciante.
- [ ] **Semanal · Manter o registro de decisões** — Um arquivo `DECISOES.md`: data, o que foi decidido, por quê, quem decidiu. Alimenta a metodologia da monografia e encerra discussão repetida.
- [ ] **Semanal · Verificar bloqueios** — Perguntar ativamente quem está travado. Iniciante trava calado por dias com vergonha de perguntar.
- [ ] **S5 · Checkpoint de meio de projeto** — Comparar o realizado com este plano. Se estiver atrasado, **cortar escopo**, não estender prazo.
- [ ] **S9 · Fazer valer o feature freeze** — A partir de 01/11, nenhuma ideia nova entra, por melhor que seja. Anota na lista de trabalhos futuros e segue.

---

## 7. Regras de trabalho

**Definition of Done.** Uma tarefa só é "pronta" quando: o código está na `main`, outra pessoa revisou, funciona no ambiente publicado (não só na máquina de quem fez), e o Caio ou a Adriana conseguiram executar o fluxo sem erro. "Funciona aqui" não conta.

**Ninguém trabalha sozinho por mais de dois dias.** Travou por dois dias, leva para a reunião. Não é fraqueza: é o custo de oportunidade de 10 pessoas esperando.

**Quando atrasar, corte escopo.** O prazo é fixo. O único ajuste possível é reduzir a entrega. Ordem de corte, do primeiro ao último: quantidade de níveis (10 → 6), animações, tela de perfil, PWA. **Nunca** corte: autenticação, progressão, salvar progresso.

---

## 8. Riscos, em ordem de probabilidade

| Risco | Como se manifesta | Contramedida |
|---|---|---|
| Escopo inflado | Aparecem DotChat, ranking e biblioteca; nada fecha | Feature única declarada, freeze em 01/11 |
| Pedro vira gargalo | 4 cargos numa pessoa; ela atrasa e tudo para | Decisão D4: redistribuir |
| Ninguém integra | Front e back prontos, sem conversar | Contrato de API na S1; integração parcial toda semana |
| Conteúdo atrasa | Site pronto, sem nada para estudar | Conteúdo aprovado até a S4, antes do site precisar dele |
| Conflito de Git | Trabalho perdido, moral abalada | Guia de Git na S1; branches curtas; revisão obrigatória |
| Chave vazada no repositório | Segredo exposto publicamente | Varredura na S0; `.env` no `.gitignore` desde o primeiro commit |
| IA gera erro que ninguém pega | Conteúdo incorreto no ar, banca detecta | Validação humana obrigatória; taxa de rejeição documentada |
| Só testam no fim | Bugs críticos descobertos na última semana | Teste exploratório começa na S4 |

---

## 9. Os cinco primeiros passos, em ordem

1. Reunir o time e fechar as decisões **D1 a D4**.
2. Criar o repositório no GitHub com todos dentro.
3. Todo mundo instalar Node, Git e VS Code e conseguir rodar o projeto vazio.
4. Gabrielly define a matéria da trilha e a whitelist de fontes.
5. Fabiano desenha o modelo de dados e valida com Pedro e Gabriel.

Nada além disso importa nesta semana.
