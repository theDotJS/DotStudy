import type { ReactNode } from "react";

// O conteúdo do nível é markdown simples (docs/formato-do-conteudo.md): parágrafos, listas com "-"
// e **negrito**. Montado como elementos React, sem HTML cru, para conteúdo nenhum virar script na página.

function comNegrito(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((trecho, i) =>
    trecho.startsWith("**") && trecho.endsWith("**") ? <strong key={i}>{trecho.slice(2, -2)}</strong> : trecho,
  );
}

export function TextoDoNivel({ conteudo }: { conteudo: string }) {
  const blocos = conteudo.trim().split(/\n\s*\n/);

  return (
    <>
      {blocos.map((bloco, i) => {
        const linhas = bloco.split("\n").map((linha) => linha.trim()).filter(Boolean);
        if (linhas.length && linhas.every((linha) => /^[-*]\s+/.test(linha))) {
          return (
            <ul key={i}>
              {linhas.map((linha, j) => (
                <li key={j}>{comNegrito(linha.replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (linhas.length === 1 && /^#{1,6}\s+/.test(linhas[0])) {
          return <h3 key={i}>{comNegrito(linhas[0].replace(/^#{1,6}\s+/, ""))}</h3>;
        }
        return <p key={i}>{comNegrito(linhas.join(" "))}</p>;
      })}
    </>
  );
}
