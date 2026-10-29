# Guia da Gabrielly: pesquisa e conteúdo da trilha

**Sua checklist:** `docs/testes_pesquisa/ChecklistPesquisa.md`.

## Por que o seu trabalho é o mais urgente do projeto

O site está quase pronto para receber conteúdo, e ainda não existe conteúdo. Sem a matéria escolhida
não há níveis, sem níveis não há o que estudar, e o critério de MVP ("completar os níveis do começo ao
fim") não tem como ser cumprido. Você é a única pessoa do time que não depende de ninguém para
começar, e quase todo mundo depende de você.

## O que fazer, em ordem

### 1. Público-alvo e matéria da trilha (até 15/10)

**Público-alvo em uma frase.** No Miro essa tarefa está como Completo, mas a frase não aparece em lugar
nenhum: o quadro "Pesquisa de Negócios" ainda diz que você precisa escrever, e a checklist do
repositório está desmarcada. Escreva a frase no quadro do Miro e na checklist, para o time inteiro
usar a mesma. Se ainda não estiver fechada, o formato é: "estudantes do ensino médio que vão prestar
vestibular e querem revisar X sozinhos". Quanto mais específico, mais fácil escrever o conteúdo.

**A matéria.** Use estes critérios para escolher, e escreva a escolha e o motivo na sua checklist:

- Existe fonte confiável e gratuita em português sobre ela.
- Cabe em 10 níveis com uma progressão clara: o nível 3 precisa do 2.
- Alguém do time domina o assunto o bastante para pegar erro da IA. Sem isso, a validação vira
  formalidade.
- O público-alvo consegue ser recrutado para o betateste (8 a 12 pessoas, a partir de 02/11).

### 2. Lista de fontes permitidas (até 16/10)

Crie `docs/fontes-permitidas.md` com a lista fechada de onde o conteúdo pode vir: Wikipédia em
português, sites `.edu.br`, portais educacionais que você aprovar. Para cada fonte, uma linha dizendo
por que ela é confiável. Só entra no site conteúdo que veio dessa lista.

**Pesquisar:** "critérios de confiabilidade de fontes", "avaliação de fontes de informação".

### 3. Objetivos de aprendizagem dos 10 níveis (até 17/10)

Uma frase por nível, começando com "Ao final, a pessoa consegue..." seguida de um verbo que dá para
verificar com uma questão: identificar, explicar, comparar, calcular. "Entender" e "conhecer" não
servem, porque não dá para testar.

**Pesquisar:** Taxonomia de Bloom revisada (Anderson e Krathwohl) e a lista de verbos por nível.

### 4. Gerar o conteúdo com IA (níveis 1 a 3 até 19/10, todos até 26/10)

**Proposta do Pedro para caber no prazo:** em vez de um script automático, usar o chat da IA (Claude ou
ChatGPT) com o mesmo pedido para todo nível. O que o TCC defende continua igual: fonte fechada,
validação humana e taxa de rejeição medida.

Para cada nível:

1. Copie o texto da fonte (da lista do passo 2).
2. Cole no chat junto com o pedido abaixo.
3. Copie o resultado para a planilha de validação e passe para a Adriana.

Pedido de partida, para você ajustar:

> Você vai escrever o nível {N} de uma trilha de estudo sobre {MATÉRIA} para {PÚBLICO}.
> Objetivo do nível: {OBJETIVO}.
> Use SOMENTE o texto-fonte abaixo. Não acrescente nada que não esteja nele.
> Entregue: (1) um resumo didático de 300 a 500 palavras; (2) 5 questões de múltipla escolha com
> alternativas a, b, c e d, exatamente uma correta; (3) para cada questão, o trecho do texto-fonte
> que justifica a resposta correta.
> Responda no formato JSON abaixo: {cole o exemplo de docs/formato-do-conteudo.md}
> Texto-fonte: {TEXTO}

**Guarde todas as versões**, inclusive as reprovadas: elas viram o número da taxa de rejeição.

**Pesquisar:** "prompt engineering" na documentação da IA que vocês usarem; "alucinação em modelos
de linguagem".

### 5. Registrar a taxa de rejeição (junto com a Adriana)

Planilha com uma linha por item gerado (resumo ou questão): nível, aprovado ou reprovado, motivo da
reprovação (erro factual, mais de uma resposta certa, fora do objetivo, linguagem). No fim, a conta:
quantos itens foram reprovados e por qual motivo. É um dos resultados mais fortes da monografia.

### 6. Fundamentação teórica (até 31/10)

Duas linhas de pesquisa que sustentam o produto:

- **Gamificação:** Deterding e outros (2011), "From game design elements to gamefulness".
  Teoria da Autodeterminação (Ryan e Deci): por que progresso visível motiva.
- **Aprendizagem para o domínio** ("mastery learning", Bloom): a ideia de só avançar depois de
  dominar o anterior. É o que justifica o desbloqueio por nível e pode fundamentar a nota de corte de
  70%. O Pedro precisa dessa resposta para o orientador.

### 7. Métricas de sucesso do MVP (até 31/10, antes do betateste)

Decida o que vai ser medido no betateste e qual número conta como sucesso. A API já guarda cada
tentativa com acertos e data, então dá para medir sem nada novo:

- quantas pessoas completaram todos os níveis;
- quantas tentativas, em média, cada nível precisou (nível que todo mundo reprova está difícil demais);
- a nota do questionário SUS que o Caio vai aplicar.

## Quem depende de você

- **Adriana**, para validar.
- **Fabiano**, para colocar no banco.
- **Caio**, para recrutar o público certo para o betateste.
- **Todo o resto do time**, porque sem conteúdo o MVP não existe.
