# DotStudy: formato do arquivo de conteúdo

**Responsável:** Pedro. **Quem usa:** Gabrielly e Adriana escrevem, Fabiano lê no script de seed.

Este arquivo é o acordo entre quem produz o conteúdo e quem coloca o conteúdo no banco. Ele existe
pelo mesmo motivo do `contrato-api.md`: as duas pontas trabalham ao mesmo tempo sem uma esperar a
outra. A Gabrielly não precisa saber o que é Prisma; o Fabiano não precisa saber o assunto da trilha.

---

## 1. Onde o arquivo mora

```
apps/api/prisma/conteudo/trilha.json
```

Um arquivo, uma trilha. Só entra nesse arquivo conteúdo **já aprovado** na validação humana. O que
foi gerado e ainda não foi revisado fica fora do repositório (na planilha de validação).

## 2. A forma

```json
{
  "trilha": {
    "titulo": "Nome da trilha",
    "descricao": "Uma frase dizendo o que a pessoa aprende."
  },
  "niveis": [
    {
      "ordem": 1,
      "titulo": "Título curto do nível",
      "objetivo": "Ao final, a pessoa consegue ...",
      "conteudo": "Texto didático em markdown. Parágrafos, listas e **negrito** funcionam.",
      "fontes": [
        { "titulo": "Nome do artigo ou página", "url": "https://pt.wikipedia.org/wiki/..." }
      ],
      "questoes": [
        {
          "ordem": 1,
          "enunciado": "Pergunta?",
          "alternativas": [
            { "rotulo": "a", "texto": "...", "correta": false },
            { "rotulo": "b", "texto": "...", "correta": true },
            { "rotulo": "c", "texto": "...", "correta": false },
            { "rotulo": "d", "texto": "...", "correta": false }
          ]
        }
      ]
    }
  ]
}
```

## 3. Regras que o seed confere antes de gravar

Se qualquer uma falhar, o seed para e diz qual nível e qual questão estão errados. Nada é gravado
pela metade.

| #   | Regra                                                                           | Por quê                                                     |
| --- | ------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| F1  | Entre 8 e 12 níveis, com `ordem` 1, 2, 3... sem repetir e sem pular             | RN-02 depende da ordem para saber qual nível abre o próximo |
| F2  | Todo nível tem `titulo`, `objetivo` e `conteudo` preenchidos                    | Nível vazio aparece como tela vazia                         |
| F3  | Todo nível tem pelo menos 1 fonte, e toda fonte é da lista de fontes permitidas | A citação da origem é o que o TCC defende                   |
| F4  | Todo nível tem exatamente 5 questões                                            | Com 5 questões e nota de corte 70, passar exige acertar 4   |
| F5  | Toda questão tem as alternativas `a`, `b`, `c` e `d`                            | O front desenha quatro botões                               |
| F6  | Toda questão tem **exatamente uma** alternativa com `"correta": true`           | Zero corretas reprova todo mundo; duas confundem a correção |
| F7  | `url` começa com `https://`                                                     | Link quebrado ou inseguro na tela de fonte                  |

## 4. O que não vai neste arquivo

- Conteúdo reprovado na validação, e o motivo da reprovação. Isso vai para a planilha de validação
  da Adriana, porque vira o número da taxa de rejeição na monografia.
- Imagens. No MVP o conteúdo é texto.
- Qualquer dado de usuário.
