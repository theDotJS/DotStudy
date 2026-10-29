import type { Metadata } from "next";
import Link from "next/link";
import pilulas from "../pilulas.module.css";
import base from "../rascunho.module.css";

export const metadata: Metadata = {
  title: "Provas · DotStudy",
};

// Fora do MVP: navegação do rascunho. Só Exatas tem tela desenhada.
export default function Page() {
  return (
    <>
      <h1 className={base.tituloPequeno}>provas</h1>
      <div className={pilulas.grade}>
        <Link href="/em-construcao" className={`${base.pilula} ${pilulas.alta}`}>
          Humanas
        </Link>
        <Link href="/provas/exatas" className={`${base.pilula} ${pilulas.alta}`}>
          Exatas
        </Link>
      </div>
    </>
  );
}
