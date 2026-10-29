# Guia da Lana: prototipagem e design

**Sua checklist:** `docs/frontend/ChecklistPrototipagemDeLayout.md` e `docs/frontend/ChecklistDesign.md`.

## O ponto principal

O Alexandre já pode programar as telas: a API está pronta. A partir de agora, o desenho precisa
chegar **um passo à frente** do código, uma tela por vez. Desenhar as seis telas em alta fidelidade
antes de entregar qualquer uma faz o Alexandre esperar. Entregue a tela que ele vai fazer na
semana, depois a próxima.

## O que fazer, em ordem

### 1. Fechar a decisão D1 com o Alexandre (até 15/10)

Pixel art ou ilustração pintada. O plano recomenda pixel art pelo ritmo de produção: dá para fazer
dezenas de ícones e estados consistentes em pouco tempo. A decisão é de vocês dois. Escrevam o
resultado e o motivo em uma linha no `dotstudy-plano-desenvolvimento.md`, seção D1.

**Pesquisar:** "pixel art UI", "pixel art icon set"; a propriedade CSS `image-rendering: pixelated`
(é o que faz pixel art ficar nítida quando aumenta de tamanho).

### 2. Sistema de design mínimo (até 16/10)

Só o que o Alexandre precisa para começar, entregue como lista:

- **Cores:** de 5 a 7, com nome e código (`#1E1E2E`, "fundo"). Confira o contraste entre texto e fundo.
- **Tipografia:** uma fonte para título e uma para texto. A fonte precisa ir como arquivo dentro do
  projeto, e não por link do Google Fonts, porque o projeto compila sem internet.
- **Espaçamento e cantos:** uma escala pequena (4, 8, 16, 24, 32 px) e um ou dois raios de canto.

O Alexandre transforma isso em configuração do Tailwind.

**Pesquisar:** "design tokens"; WCAG critério 1.4.3, contraste mínimo de 4,5:1 para texto normal;
WebAIM Contrast Checker.

### 3. Os estados do nó do mapa (até 17/10)

O nível tem três estados na API: **bloqueado**, **disponível** e **concluído** (regra RN-06). Sua
checklist fala em quatro, com "em progresso". Esse quarto estado não existe nas regras nem na API:
desenhe os três. Se vocês acharem que "em progresso" é essencial, leve ao Pedro antes de desenhar,
porque vira regra nova e mudança na API. Desenhe cada um de forma
que dê para distinguir **sem depender só da cor**: quem não enxerga bem a diferença entre vermelho e
verde também precisa entender o mapa. Use ícone, forma ou texto junto com a cor.

Combine com o Fabiano quem desenha os ícones.

### 4. Alta fidelidade, na ordem em que o Alexandre vai precisar

| Até   | Tela                                                |
| ----- | --------------------------------------------------- |
| 16/10 | Login e Cadastro                                    |
| 19/10 | Mapa de níveis                                      |
| 22/10 | Nível (conteúdo com as fontes visíveis) e Exercício |
| 24/10 | Resultado                                           |

**Cada tela vem com a versão de celular junto**, não depois. Desenhe primeiro a do celular: é a mais
difícil e a que mais gente vai usar.

Toda tela precisa ter também o estado de erro e o de carregando. Exemplo: o que aparece quando a
senha está errada? O que aparece enquanto o nível carrega?

**Pesquisar:** no Figma (ou na ferramenta escolhida na S0), "components" e "variants", para desenhar
o botão uma vez e reaproveitar.

### 5. Assets exportados (até 26/10)

Ícones e imagens em SVG (ou PNG, se for pixel art), com nomes sem espaço e sem acento:
`nivel-bloqueado.svg`, `mascote-feliz.png`. Coloque em `apps/web/public/` numa pasta combinada com o
Alexandre.

### 6. Revisão de consistência (até 30/10)

Com as telas prontas no navegador, compare com o desenho: cor, espaçamento, fonte. Anote as diferenças
como bug para o Alexandre corrigir antes do freeze de 01/11.

## O que pode ficar de fora

Perfil, mascote animado e telas que não estão na lista acima. O MVP é: login, cadastro, mapa, nível,
exercício e resultado. O resto vira trabalho futuro na monografia.

## Quem depende de você

- **Alexandre**, de cada tela, na data da tabela. Se uma tela atrasar, avise: ele segue com o
  protótipo e troca o visual quando o seu chegar.
