import type { Metadata } from "next";
import Link from "next/link";
import pilulas from "../pilulas.module.css";
import base from "../rascunho.module.css";

export const metadata: Metadata = {
  title: "Biblioteca · DotStudy",
};

// Fora do MVP: navegação do rascunho. Só Matemática tem tela (a apostila).
const MATERIAS = [
  { nome: "Português", href: "/em-construcao" },
  { nome: "Matemática", href: "/biblioteca/matematica" },
  { nome: "História", href: "/em-construcao" },
  { nome: "Geografia", href: "/em-construcao" },
  { nome: "Biologia", href: "/em-construcao" },
  { nome: "Química", href: "/em-construcao" },
  { nome: "Física", href: "/em-construcao" },
  { nome: "Filosofia", href: "/em-construcao" },
];

export default function Page() {
  return (
    <>
      <h1 className={base.tituloPequeno}>Biblioteca</h1>
      <div className={pilulas.grade}>
        {MATERIAS.map((materia) => (
          <Link key={materia.nome} href={materia.href} className={`${base.pilula} ${pilulas.alta}`}>
            {materia.nome}
          </Link>
        ))}
      </div>
    </>
  );
}
