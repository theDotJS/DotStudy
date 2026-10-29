import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import base from "../../rascunho.module.css";
import estilos from "./apostila.module.css";

export const metadata: Metadata = {
  title: "Apostila de Matemática · DotStudy",
};

// Fora do MVP: tela "Apostila" do rascunho, com o progresso de exemplo do desenho (57%).
const PROGRESSO = 57;

export default function Page() {
  return (
    <div className={estilos.tela}>
      <h1 className={`${base.tituloGrande} ${estilos.titulo}`}>Apostila de Matemática</h1>
      <Image
        className={estilos.capa}
        src="/rascunho/apostila-matematica.png"
        alt="Capa da Apostila de Matemática, 1º e 2º anos, alinhada à BNCC"
        width={387}
        height={516}
        priority
      />
      <div className={estilos.rodape}>
        <div className={estilos.progresso}>
          <p className={`${base.tituloGrande} ${estilos.rotulo}`}>Progresso:</p>
          <div className={estilos.linhaDaBarra}>
            <div
              className={`${base.barra} ${estilos.barra}`}
              role="progressbar"
              aria-label="Progresso na apostila"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={PROGRESSO}
            >
              <div className={base.barraCheia} style={{ width: `${PROGRESSO}%` }} />
            </div>
            <span className={estilos.percentual}>{PROGRESSO}%</span>
          </div>
        </div>
        <Link href="/em-construcao" className={`${base.pilula} ${estilos.continuar}`}>
          Continuar
        </Link>
      </div>
    </div>
  );
}
