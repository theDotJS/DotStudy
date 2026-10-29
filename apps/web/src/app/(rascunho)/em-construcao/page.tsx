import type { Metadata } from "next";
import Image from "next/image";
import estilos from "./em-construcao.module.css";

// Tela "15" do rascunho. Destino de todo botão cuja tela ainda não existe.
export const metadata: Metadata = {
  title: "Em construção · DotStudy",
};

export default function Page() {
  return (
    <div className={estilos.tela}>
      <h1 className="sr-only">Esta parte do DotStudy ainda está em construção</h1>
      <Image
        className={estilos.obras}
        src="/rascunho/obras.svg"
        alt="Gatos de capacete pintando e serrando ao lado de uma placa de obra"
        width={1202}
        height={584}
        unoptimized
        priority
      />
    </div>
  );
}
