"use client";

import { useState } from "react";
import base from "../../rascunho.module.css";
import estilos from "./notificacoes.module.css";

// Fora do MVP: a API não tem notificação. As chaves mudam só na tela e não são salvas.
const OPCOES = [
  { id: "email", rotulo: "por email" },
  { id: "lembretes", rotulo: "lembretes" },
];

export function Chaves() {
  const [ligadas, setLigadas] = useState<Record<string, boolean>>({});

  return (
    <div className={estilos.lista}>
      {OPCOES.map((opcao) => {
        const ligada = ligadas[opcao.id] ?? false;
        return (
          <div key={opcao.id} className={`${base.pilula} ${estilos.linha}`}>
            <span id={`rotulo-${opcao.id}`}>{opcao.rotulo}</span>
            <button
              type="button"
              role="switch"
              aria-checked={ligada}
              aria-labelledby={`rotulo-${opcao.id}`}
              className={`${estilos.chave} ${ligada ? estilos.ligada : ""}`}
              onClick={() => setLigadas((atual) => ({ ...atual, [opcao.id]: !ligada }))}
            >
              <span className={estilos.bolinha} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
