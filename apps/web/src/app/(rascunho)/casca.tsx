"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import estilos from "./rascunho.module.css";

// Itens do menu "|||". Mesma lista do menu do mapa.
const ITENS_DO_MENU = [
  { href: "/mapa", icone: "fa-solid fa-house", rotulo: "Home" },
  { href: "/perfil", icone: "fa-regular fa-user", rotulo: "Perfil" },
  { href: "/dotchat", icone: "fa-solid fa-robot", rotulo: "DotChat" },
  { href: "/biblioteca", icone: "fa-solid fa-book-open", rotulo: "Biblioteca" },
  { href: "/provas", icone: "fa-regular fa-newspaper", rotulo: "Provas" },
  { href: "/em-construcao", icone: "fa-solid fa-clock-rotate-left", rotulo: "Histórico" },
  { href: "/configuracoes", icone: "fa-solid fa-gear", rotulo: "Configurações" },
];

// Topo do rascunho (|||, logo e o gato espiando), menu lateral sobreposto e a moldura de linhas brancas.
export function Casca({ children }: { children: ReactNode }) {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!menuAberto) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setMenuAberto(false);
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [menuAberto]);

  return (
    <div className={estilos.pagina}>
      <header className={estilos.topo}>
        <button
          type="button"
          className={estilos.botaoMenu}
          aria-label="Abrir ou fechar o menu"
          aria-controls="menu-do-rascunho"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          <span />
          <span />
          <span />
        </button>
        <Link href="/mapa" className={estilos.logo} aria-label="DotStudy, ir para o mapa">
          <Image src="/rascunho/logo.svg" alt="" width={742} height={172} unoptimized priority />
        </Link>
        <Image className={estilos.gatoTopo} src="/rascunho/gato-topo.svg" alt="" width={295} height={128} unoptimized />
      </header>

      <nav
        id="menu-do-rascunho"
        className={`${estilos.menu} ${menuAberto ? estilos.menuAberto : ""}`}
        aria-label="Menu principal"
        aria-hidden={!menuAberto}
        inert={!menuAberto}
      >
        <ul>
          {ITENS_DO_MENU.map((item) => (
            <li key={item.rotulo}>
              <Link
                href={item.href}
                aria-current={caminho === item.href ? "page" : undefined}
                onClick={() => setMenuAberto(false)}
              >
                <i className={item.icone} aria-hidden="true" />
                {item.rotulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {menuAberto && <div className={estilos.menuFundo} onClick={() => setMenuAberto(false)} />}

      <main className={estilos.moldura}>{children}</main>
    </div>
  );
}
