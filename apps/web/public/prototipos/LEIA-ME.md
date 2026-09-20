# Protótipos em HTML

**O que é esta pasta:** as telas em HTML e CSS puro que o frontend produziu antes da estrutura do
projeto existir. **Continuam em uso** até o HTML final ser produzido. Não é código descartado.

**Como abrir:**

- Com o Next rodando (`npm run dev` em `apps/web`): <http://localhost:3000/prototipos/main.html>
- Ou abrindo o arquivo direto no navegador. Todos os caminhos são relativos e não há dependência
  de internet, então funciona pelos dois jeitos.

---

## 1. O que veio de fora

| Arquivo                     | Autoria original           |
| --------------------------- | -------------------------- |
| `main.html`, `main.css`     | frontend, commit `ad9c55f` |
| `perfil.html`, `perfil.css` | frontend, commit `ad9c55f` |

`prototipo.js` é novo. O CSS já tinha as classes `.ativo` escritas, mas não existia nenhum arquivo
`.js` no repositório: o menu nunca abria. O comportamento que faltava mora nesse arquivo.

## 2. O que foi corrigido, e por quê

| #   | Era                                                                                     | Virou                                                                                                                                                                                      |
| --- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `<style>` no `main.html` com seletor `div { width:35px; height:5px; background:black }` | Regra escopada para `.trilho` e `.indicador` no `main.css`. O seletor solto atingia **toda** `div` da página: `.background` virava uma faixa preta de 35px, `.foto` e `.input-box` também. |
| 2   | `main.css` apontando para `./media/background1.png`, que não existe                     | Gradiente escuro provisório, com o caminho real comentado logo acima                                                                                                                       |
| 3   | Menu lateral sem nenhum JS                                                              | `prototipo.js`, com abrir, fechar, `Esc` e `aria-expanded`                                                                                                                                 |
| 4   | `perfil.html` linkando `./menu.html`                                                    | `./main.html`, que é o nome real do arquivo                                                                                                                                                |
| 5   | `perfil.html` carregando `perfil.css` **e** `main.css`, os dois redefinindo `body`      | `main.css` primeiro (base e menu), `perfil.css` depois e sem tocar em `body`                                                                                                               |
| 6   | `.conteudo` com texto `#ecf0f1` sobre `body` `#ecf0f1`, e `.background` no fluxo normal | `.background` virou `position: fixed` atrás de tudo, com fundo escuro. O texto claro era literalmente invisível.                                                                           |
| 7   | Fundo do perfil hotlinkado da Shutterstock, com marca d'água                            | Removido. Conteúdo licenciado de terceiro não entra em TCC.                                                                                                                                |
| 8   | Campos sem `<label>`, sem `name`, sem `id`                                              | Todos rotulados e nomeados. `placeholder` não é rótulo: some ao digitar.                                                                                                                   |
| 9   | Botão do menu só com ícone                                                              | `aria-label` e `aria-expanded`                                                                                                                                                             |
| 10  | "Redefinir" era `type="submit"` envolvendo um `<a>` sem `href`                          | `<button type="reset">`                                                                                                                                                                    |
| 11  | `oninput="..."` dentro do HTML                                                          | Atributo `data-somente-digitos` tratado no `prototipo.js`                                                                                                                                  |
| 12  | `padding` declarado duas vezes em `.input-box input`                                    | Uma vez                                                                                                                                                                                    |
| 13  | `@import` da fonte Bebas Neue, nunca usada                                              | Removido                                                                                                                                                                                   |
| 14  | `main.html` sem `<title>`                                                               | Com título                                                                                                                                                                                 |
| 15  | Font Awesome via CDN                                                                    | Baixado em `vendor/fontawesome/` (204 KB). Funciona offline e não quebra se o CDN sair do ar.                                                                                              |

## 3. O que **não** foi mexido, de propósito

- **A estrutura das telas.** Layout, hierarquia e posição de elemento continuam como o frontend fez.
- **As cores.** Estão como variáveis CSS no `:root` do `main.css`, mas os valores são provisórios.
  O sistema de design (paleta, tipografia, escala) é a tarefa S2 da Lana. Enquanto ele não existir,
  qualquer cor escolhida aqui é chute, e a checklist do Alexandre é explícita: ninguém escreve cor
  solta. Quando a paleta chegar, muda em um lugar só.
- **A `<nav>` duplicada** nos dois arquivos. Sem gerador de template, a alternativa seria injetar o
  menu por JS, o que deixaria o HTML menos parecido com o HTML final. **Regra enquanto isso:
  mexeu na nav, mexe nos dois arquivos.**

## 4. Pendências conhecidas

| #   | Pendência                                                                                                                      | Quem                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| P1  | `.trilho` / `.indicador`: a função desse controle nunca foi definida. Parece um interruptor. Decidir o que é ou remover.       | Alexandre            |
| P2  | `background1.png` e a foto de perfil real. Ver `media/LEIA-ME.md`.                                                             | Lana                 |
| P3  | O formulário de perfil não envia nada. Ligar quando a rota existir.                                                            | Alexandre, com Pedro |
| P4  | Contraste conferido a olho, não medido. Passar no WebAIM Contrast Checker quando a paleta final existir (tarefa S4 de Design). | Lana                 |

## 5. Escopo: leia antes de fazer mais tela aqui

Nenhuma destas duas telas está no MVP. A lista do MVP é **Login, Cadastro, Mapa de Níveis, Tela de
Nível, Exercício e Resultado**. "Perfil" é tarefa S6 da checklist de Design, e "Menu Principal" é
placeholder.

Isso não é culpa de quem fez: sem contrato de API e sem sistema de design, sobrou construir o que
dava para construir sozinho. Os dois documentos agora existem
(`docs/contrato-api.md` e `docs/regras-de-negocio.md`).

**Próxima tela a nascer é Login, não mais uma variação destas.**
