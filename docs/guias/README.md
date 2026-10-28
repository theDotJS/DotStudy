# Guias por pessoa

**Escrito em 13/10 pelo Pedro.** Cada pessoa tem um guia com o que fazer, como fazer, o que
pesquisar e quem depende do seu trabalho. Leia o seu inteiro antes de começar.

| Pessoa    | Papel                                | Guia                         |
| --------- | ------------------------------------ | ---------------------------- |
| Gabriel   | Segurança, regras de negócio         | [gabriel.md](gabriel.md)     |
| Fabiano   | Banco de dados, design               | [fabiano.md](fabiano.md)     |
| Alexandre | Telas web, layout mobile, design     | [alexandre.md](alexandre.md) |
| Lana      | Prototipagem de layout, design       | [lana.md](lana.md)           |
| Gabrielly | Pesquisa, conteúdo da trilha         | [gabrielly.md](gabrielly.md) |
| Adriana   | Validação de conteúdo, testes        | [adriana.md](adriana.md)     |
| Caio      | Testes, betateste                    | [caio.md](caio.md)           |
| Fábio     | Multiplataforma, integração contínua | [fabio.md](fabio.md)         |

O plano fala em 11 pessoas e esta lista tem 9, mais o Pedro. Se você é do time e não está aqui, fale
com o Pedro hoje: tem trabalho esperando por você, principalmente no conteúdo.

---

## Onde o projeto está

**Pronto e testado:** a API inteira do MVP. Cadastro, login, lista de níveis, conteúdo do nível,
progresso, correção do exercício e desbloqueio. São 25 testes de regra e 29 testes do fluxo completo,
todos passando. Para ver: `npm run test:api` na raiz.

**O que falta para o MVP existir:**

1. **Conteúdo.** Sem a matéria escolhida não existe nível para estudar. É o maior risco do projeto hoje.
2. **Telas ligadas na API.** Login, mapa, nível, exercício e resultado.
3. **O seed**, o script que coloca o conteúdo aprovado no banco.

O critério de MVP entregue continua o do plano: uma pessoa de fora cria conta, completa os níveis do
começo ao fim, fecha o site, volta no dia seguinte e encontra o progresso onde parou.

## Calendário até a entrega

Proposta do Pedro, refeita a partir do calendário original, que previa o MVP fechado em 18/10.

| Período       | O que precisa estar pronto no fim                                                       |
| ------------- | --------------------------------------------------------------------------------------- |
| 13 a 19/10    | Matéria escolhida. Níveis 1 a 3 aprovados. Login e cadastro funcionando na tela.        |
| 20 a 26/10    | Mapa, nível, exercício e resultado funcionando com dados reais.                         |
| 27/10 a 01/11 | Os 10 níveis aprovados e no banco. Teste interno do fluxo inteiro. **Freeze em 01/11.** |
| 02 a 08/11    | Betateste com 8 a 12 pessoas de fora. Correção de bugs. Escrita da monografia.          |
| 09 a 15/11    | Entrega e ensaio da apresentação.                                                       |

**Freeze em 01/11** quer dizer: depois disso só entra correção. Tela nova, ideia nova e "só mais uma
coisa" ficam para os trabalhos futuros da monografia.

## Quem depende de quem

Se você está numa ponta desta lista, a outra ponta está esperando você.

- **Alexandre** espera a **Lana** (tela desenhada) e o **Fabiano** (dados de exemplo no banco).
- **Fabiano** espera a **Gabrielly** e a **Adriana** (conteúdo aprovado) para o seed final.
- **Adriana** espera a **Gabrielly** (conteúdo gerado) para validar.
- **Gabrielly** não espera ninguém. Por isso ela é o caminho crítico: se a matéria atrasa, tudo atrasa.
- **Caio** e **Adriana** já podem testar a API hoje, sem esperar tela.
- **Fábio** precisa do Alexandre com telas prontas para rodar a matriz de compatibilidade.

## Como trabalhar

1. **Uma branch por tarefa**, com nome curto: `git checkout -b s5-tela-do-mapa`.
2. **Commit pequeno, com mensagem que diz o que mudou.** "FIZ X TAREFA" não ajuda ninguém a revisar.
3. **Pull request para a `main`**, com outra pessoa revisando. Ninguém mescla o próprio PR sem revisão.
4. **Pronto quer dizer mesclado na `main`.** Trabalho parado na sua máquina não conta como entregue.
5. **Marque a tarefa na sua checklist** em `docs/` no mesmo PR que entrega a tarefa.
6. **Antes do PR:** `npm run format` e `npm run lint` na raiz.

## Quando travar

Travou por mais de meio dia? Avise no grupo dizendo o que tentou e onde parou. Pedir ajuda cedo é
parte do trabalho. Ficar três dias em silêncio com a tarefa parada atrasa quem depende de você.

Todo dia, no grupo, três linhas: **o que fiz, o que vou fazer, o que está me travando.**
