"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { lerUsuarioSalvo, type Usuario } from "@/lib/api";
import base from "../rascunho.module.css";
import estilos from "./perfil.module.css";

// Nome e e-mail vêm do login. O resto (XP, posição, progressos) é o exemplo do rascunho:
// a API não tem ranking nem provas, que estão fora do MVP.
const EXEMPLO = { nome: "Granolaweb324", email: "granola67676767@gmail.com" };

const PROGRESSOS = [
  { titulo: "Provas - Humanas", progresso: 10 },
  { titulo: "Provas - Exatas", progresso: 67 },
];

function nenhumaMudanca() {
  return () => {};
}

function Barra({ rotulo, progresso, pequena = false }: { rotulo: string; progresso: number; pequena?: boolean }) {
  return (
    <div className={`${estilos.linhaDaBarra} ${pequena ? estilos.pequena : ""}`}>
      <div
        className={`${base.barra} ${estilos.barra}`}
        role="progressbar"
        aria-label={rotulo}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progresso}
      >
        <div className={base.barraCheia} style={{ width: `${progresso}%` }} />
      </div>
      <span className={estilos.percentual}>{progresso}%</span>
    </div>
  );
}

export function Perfil() {
  const salvo = useSyncExternalStore(nenhumaMudanca, lerUsuarioSalvo, () => null);
  let usuario: Pick<Usuario, "nome" | "email"> = EXEMPLO;
  try {
    if (salvo) usuario = JSON.parse(salvo) as Usuario;
  } catch {
    // Valor corrompido no armazenamento: fica o exemplo.
  }

  return (
    <div className={estilos.tela}>
      <section className={estilos.cabecalho}>
        <Image
          className={estilos.foto}
          src="/rascunho/foto-perfil.jpg"
          alt="Foto de perfil"
          width={182}
          height={182}
          priority
        />
        <div className={estilos.identidade}>
          <h1 className={estilos.nome}>{usuario.nome}</h1>
          <p className={estilos.email}>{usuario.email}</p>
          <p className={estilos.xp}>1M xp - 1 lugar</p>
        </div>
        <Link href="/configuracoes" className={estilos.configuracoes}>
          Configurações
        </Link>
      </section>

      <h2 className={estilos.secao}>Progressos</h2>

      <div className={estilos.cartoes}>
        {PROGRESSOS.map((item) => (
          <section key={item.titulo} className={estilos.cartao}>
            <h3 className={estilos.tituloDoCartao}>{item.titulo}</h3>
            <Barra rotulo={`Progresso em ${item.titulo}`} progresso={item.progresso} />
          </section>
        ))}

        <section className={`${estilos.cartao} ${estilos.cartaoApostilas}`}>
          <h3 className={estilos.tituloDoCartao}>Apostilas</h3>
          <Link href="/biblioteca/matematica" className={estilos.apostila}>
            <span className={`${base.tituloGrande} ${estilos.nomeDaApostila}`}>Apostila de Matemática</span>
            <Image
              className={estilos.capa}
              src="/rascunho/apostila-matematica.png"
              alt="Capa da Apostila de Matemática"
              width={162}
              height={216}
            />
          </Link>
          <Barra rotulo="Progresso na Apostila de Matemática" progresso={57} pequena />
        </section>
      </div>
    </div>
  );
}
