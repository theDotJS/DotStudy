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

## 7. Riscos, em ordem de probabilidade

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
