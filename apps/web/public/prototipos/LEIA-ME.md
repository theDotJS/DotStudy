# Protótipos em HTML

**O que é esta pasta:** as telas em HTML, CSS e JS puro do rascunho de design. **Continuam em uso**
até o HTML final ser produzido. Não é código descartado.

**Origem:** repositório <https://github.com/aleeh1x/DotStudy-html-css-js>, commit `256ab09`
(09/10/2026). Os arquivos foram copiados **como estão**: mesma marcação, mesmo CSS, mesmo JS.

**Como abrir:**

- Com o Next rodando (`npm run dev` em `apps/web`): <http://localhost:3000/prototipos/login/login.html>
- Ou abrindo o arquivo direto no navegador. Fontes e ícones vêm de CDN, então precisa de internet.

---

## 1. As telas

| Tela       | Arquivo                       | Origem no repo do rascunho              |
| ---------- | ----------------------------- | --------------------------------------- |
| Login      | `login/login.html`            | `login.html` + `style.css`              |
| Home       | `menu/menu.html`              | `menu.html` + `main.css` + `menu.js`    |
| Perfil     | `perfil/perfil.html`          | `perfil.html` + `perfil.css` + `perfil.js` |
| DotChat    | `chat/chat.html`              | `chat.html` + `chat.css` + `chat.js`    |
| Biblioteca | `library/library.html`        | `library.html` + `library.css` + `library.js` |
| Mapa de Níveis | `mapa/mapa.html`          | Não vem do rascunho. Mockup proposto em 28/10/2026 para o caminho de níveis (estilo Duolingo), já com variáveis de cor e responsivo. |

Uma pasta por tela porque os links entre as páginas do rascunho já apontam para
`../menu/menu.html`, `../perfil/perfil.html` etc. Com essa estrutura, nenhum link precisou ser editado.

Estas telas substituem o `main.html` e o `perfil.html` anteriores (e o `prototipo.js` e o
Font Awesome baixado que só eles usavam). A versão anterior continua no histórico do Git.

## 2. O que mudou em relação ao original, e por quê

| #   | Era                                                     | Virou                                    | Motivo                                                                 |
| --- | ------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| 1   | `style.css`, mas o `login.html` linka `styles.css`      | Arquivo salvo como `login/styles.css`    | Do jeito original o login abria sem estilo nenhum. O HTML ficou intacto. |
| 2   | Primeira mensagem do bot no `chat.html` com palavrão    | "Meow! Como posso ajudar?"               | Texto impróprio para trabalho acadêmico.                               |

Nada além disso foi alterado.

## 3. Pendências conhecidas

| #   | Pendência                                                                                                                                                                                                 | Quem      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| P1  | **Imagens não existem no repo do rascunho**, nem no histórico: `img.jpg` (fundo do login), `imagem-topo.png`, `userwhite.png`, `catbackground.png`, `gatoboné.jpg`, `DotSTUDY.png`. Hoje aparecem quebradas. | Designer  |
| P2  | Layout com largura fixa em px (ex.: `.conteudo` com 1375px, `.perfil` com `margin-left: 450px`). Quebra em tela menor que ~1600px e no celular.                                                            | Frontend  |
| P3  | HTML com tags fora do lugar: `<header>` e `<div class="chat">` antes do `<body>`, `<body>` duplicado no `library.html`, `</button>` solto no login, `<nav>` sem fechar no chat. O navegador corrige sozinho, mas o HTML final não pode sair assim. | Frontend  |
| P4  | Campos sem `<label>`, botão do menu sem `aria-label`, imagens de conteúdo sem `alt` útil. Ver a checklist de acessibilidade.                                                                              | Frontend  |
| P5  | Cores escritas soltas em cada CSS (`#B49883`, `lab(...)`, `oklab(...)`), repetidas entre arquivos. Quando o sistema de design existir, viram variáveis no `:root`.                                         | Design    |
| P6  | Menu lateral, topo e transições copiados em todos os CSS. **Regra enquanto isso: mexeu no menu ou no topo, mexe nos cinco arquivos.**                                                                    | Frontend  |
| P7  | Os formulários e o chat não falam com a API. O chat responde uma mensagem fixa depois de 700 ms.                                                                                                         | Frontend, com Pedro |

## 4. Escopo

A lista do MVP é **Login, Cadastro, Mapa de Níveis, Tela de Nível, Exercício e Resultado**. Destas
telas, só o Login está no MVP. Home, Perfil, DotChat e Biblioteca são fora do MVP.
