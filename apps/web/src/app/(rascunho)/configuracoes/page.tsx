import type { Metadata } from "next";
import Link from "next/link";
import pilulas from "../pilulas.module.css";
import base from "../rascunho.module.css";
import estilos from "./configuracoes.module.css";

export const metadata: Metadata = {
  title: "Configuração · DotStudy",
};

// Fora do MVP: navegação do rascunho. Só Notificação tem tela desenhada.
export default function Page() {
  return (
    <>
      <h1 className={base.tituloPequeno}>Configuração</h1>
      <div className={estilos.colunas}>
        <div className={estilos.coluna}>
          <Link href="/configuracoes/notificacoes" className={base.pilula}>
            Notificação <i className={`fa-regular fa-bell ${pilulas.icone}`} aria-hidden="true" />
          </Link>
          <Link href="/em-construcao" className={base.pilula}>
            Armazenamento
          </Link>
          <Link href="/em-construcao" className={base.pilula}>
            Segurança
          </Link>
        </div>
        <div className={estilos.coluna}>
          <Link href="/em-construcao" className={base.pilula}>
            Privacidade
          </Link>
          <Link href="/em-construcao" className={base.pilula}>
            Ajuda <i className={`fa-solid fa-question ${pilulas.icone}`} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
