"use client";

import Link from "next/link";
import { useState } from "react";
import base from "../../rascunho.module.css";
import estilos from "./exatas.module.css";

// Fora do MVP: assuntos e porcentagens são os de exemplo do rascunho. A busca filtra na própria tela.
const ASSUNTOS = [
  { nome: "Equações", progresso: 17 },
  { nome: "Trigonometria", progresso: 100 },
  { nome: "Ângulos", progresso: 0 },
  { nome: "Circunferência", progresso: 0 },
  { nome: "Sistemas", progresso: 0 },
  { nome: "MMC", progresso: 0 },
];

// "Ângulo" encontra "Ângulos" e "angulo" também.
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function Assuntos() {
  const [busca, setBusca] = useState("");
  const visiveis = ASSUNTOS.filter((assunto) => normalizar(assunto.nome).includes(normalizar(busca.trim())));

  return (
    <>
      <form className={estilos.busca} role="search" onSubmit={(evento) => evento.preventDefault()}>
        <label htmlFor="busca-assunto" className="sr-only">
          Buscar assunto
        </label>
        <input
          id="busca-assunto"
          type="search"
          placeholder="Search"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
      </form>

      {visiveis.length === 0 && <p className={estilos.vazio}>Nenhum assunto com esse nome.</p>}

      <ul className={estilos.grade}>
        {visiveis.map((assunto) => (
          <li key={assunto.nome} className={estilos.cartao}>
            <h2 className={`${base.tituloGrande} ${estilos.nome}`}>{assunto.nome}</h2>
            <div className={estilos.linhaDaBarra}>
              <div
                className={`${base.barra} ${estilos.barra}`}
                role="progressbar"
                aria-label={`Progresso em ${assunto.nome}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={assunto.progresso}
              >
                {assunto.progresso > 0 && (
                  <div className={base.barraCheia} style={{ width: `${assunto.progresso}%` }} />
                )}
              </div>
              <span className={estilos.percentual}>{assunto.progresso}%</span>
            </div>
            {assunto.progresso === 100 ? (
              <span className={estilos.feito} role="img" aria-label="Concluído">
                <i className="fa-solid fa-check" aria-hidden="true" />
              </span>
            ) : (
              <Link href="/em-construcao" className={estilos.comecar}>
                Começar
              </Link>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
