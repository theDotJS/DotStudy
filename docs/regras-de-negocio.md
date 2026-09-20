# DotStudy — Regras de Negócio

**Status:** rascunho para revisão. **Responsáveis:** Pedro e Gabriel.
**Tarefa:** `S1 · Escrever as regras em português antes de virar código` (vencida em 06/09).
**Regra do documento:** enquanto uma linha aqui estiver em aberto, ela não vira código.

---

## 1. Por que este documento existe antes do código

Regra escrita em português é testável por qualquer pessoa do time, inclusive quem não programa.
Regra que nasce direto em código só é verificável por quem a escreveu. Como o time tem 11 pessoas
iniciantes e uma banca no fim, a ordem é: escrever, combinar, depois implementar.

Cada regra abaixo vira um teste automatizado na tarefa `S7 · Escrever testes das regras`.

---

## 2. Regras de progressão

| #     | Regra                                                                                        |
| ----- | -------------------------------------------------------------------------------------------- |
| RN-01 | O nível 1 de uma trilha começa sempre disponível.                                            |
| RN-02 | Um nível fica disponível quando o nível de ordem imediatamente anterior está concluído.      |
| RN-03 | Um nível é concluído quando o usuário atinge a **nota de corte** ou mais no exercício.       |
| RN-04 | Reprovar não bloqueia nada. O usuário pode tentar de novo, sem limite de tentativas.         |
| RN-05 | Refazer um nível já concluído não diminui a pontuação nem remove a conclusão.                |
| RN-06 | Um nível tem três estados possíveis para um usuário: `bloqueado`, `disponivel`, `concluido`. |
| RN-07 | Nível `bloqueado` não é clicável no mapa e a API recusa submissão para ele.                  |

**Consequência de RN-02 + RN-07:** a validação de "pode submeter?" acontece no servidor.
O frontend esconder o botão não é proteção, é conveniência.

---

## 3. A nota de corte

**Valor atual: 70%.**

Isto é um chute razoável, não uma verdade. Foi escolhido porque:

- Abaixo de 60% a pessoa avança sem ter entendido, e o nível seguinte fica incompreensível.
- Acima de 80% em exercício de 5 questões, errar 1 já reprova, o que frustra sem ensinar.
- Com 5 questões, 70% significa acertar 4. É o único ponto de corte que separa "errou uma" de
  "errou duas" de forma legível para o usuário.

**Onde o número mora:** variável de ambiente `NOTA_DE_CORTE`, lida na inicialização da API.
Nunca escrita dentro de uma função. O betateste da S9 vai sugerir mudar esse número, e mudar
precisa custar uma linha de `.env`, não um deploy de código novo.

**Aberto:** confirmar com o orientador se 70% precisa de fundamentação bibliográfica na monografia
ou se a justificativa acima basta. — _Pedro, até 27/09._

---

## 4. Correção do exercício

| #     | Regra                                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| RN-08 | A correção acontece **exclusivamente no servidor**.                                                                             |
| RN-09 | O gabarito nunca é enviado ao navegador antes da submissão.                                                                     |
| RN-10 | O percentual é `acertos / total de questões`, arredondado para baixo.                                                           |
| RN-11 | A resposta da submissão devolve: acertos, total, percentual, aprovado (sim/não) e, por questão, se acertou.                     |
| RN-12 | A liberação do próximo nível e a gravação da conclusão acontecem na mesma transação de banco: ou grava tudo, ou não grava nada. |

**RN-09 é a regra que a banca vai testar.** Se o gabarito trafega junto com a questão, qualquer
pessoa abre o inspetor do navegador e vê a resposta. Isso invalida o mecanismo inteiro do produto.

---

## 5. Regras de conta

| #     | Regra                                                                                                                     |
| ----- | ------------------------------------------------------------------------------------------------------------------------- |
| RN-13 | O e-mail é único por conta.                                                                                               |
| RN-14 | Senha nunca é armazenada em texto puro. Hash com argon2 ou bcrypt, via biblioteca.                                        |
| RN-15 | Recuperação de senha por e-mail está fora do MVP. Redefinição é manual, por um administrador.                             |
| RN-16 | O usuário A não pode ler nem alterar o progresso do usuário B. Estar logado não basta: a API confere de quem é o recurso. |

**Aberto:** tamanho mínimo de senha e tempo de expiração do token.
— _Gabriel, tarefa `S3 · Definir política de senha e expiração de sessão`, vence hoje (20/09)._

---

## 6. Fora do MVP

Ranking, ligas, amigos, múltiplas trilhas, notificações, painel administrativo e o DotChat não têm
regra de negócio definida porque não existem no MVP. Se alguém precisar de uma regra para algo
desta lista, o pedido está fora de escopo. Freeze em 01/11.
