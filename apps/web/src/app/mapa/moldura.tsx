import Link from "next/link";
import styles from "./mapa.module.css";

// Topo e menu lateral do rascunho. Hoje só o mapa usa; quando outra tela do MVP precisar,
// sobem para um layout comum.

interface PropsDoTopo {
  menuAberto: boolean;
  aoAlternarMenu: () => void;
}

export function Topo({ menuAberto, aoAlternarMenu }: PropsDoTopo) {
  return (
    <header className={styles.topo}>
      <button
        type="button"
        className={styles.botaoMenu}
        aria-label="Abrir ou fechar o menu"
        aria-controls="menu-lateral"
        aria-expanded={menuAberto}
        onClick={aoAlternarMenu}
      >
        <i className="fa-solid fa-bars" aria-hidden="true" />
      </button>

      <div className={styles.logo} aria-label="DotStudy">
        <span>DOTSTUDY</span>
        <svg className={styles.gatoEspiando} viewBox="0 0 120 56" aria-hidden="true">
          <path d="M22 44 L18 8 L44 24 Z" fill="#1d1a19" />
          <path d="M98 44 L102 8 L76 24 Z" fill="#1d1a19" />
          <path d="M24 38 L22 16 L38 27 Z" fill="#5c5654" />
          <path d="M96 38 L98 16 L82 27 Z" fill="#5c5654" />
          <ellipse cx="60" cy="40" rx="42" ry="24" fill="#1d1a19" />
          <ellipse cx="42" cy="38" rx="11" ry="10" fill="#fcc62d" />
          <ellipse cx="78" cy="38" rx="11" ry="10" fill="#fcc62d" />
          <ellipse cx="44" cy="38" rx="4.5" ry="7" fill="#1d1a19" />
          <ellipse cx="80" cy="38" rx="4.5" ry="7" fill="#1d1a19" />
          <path d="M57 48 L63 48 L60 51 Z" fill="#5c5654" />
        </svg>
      </div>

      <div className={styles.usuario}>
        <button type="button" className={styles.notificacao} aria-label="Notificações">
          <i className="fa-regular fa-bell" aria-hidden="true" />
          <span className={styles.notificacaoPonto} />
        </button>
        <span className={styles.avatar} aria-hidden="true">
          U
        </span>
        <span className={styles.nomeUsuario}>Usuário</span>
        <i className={`fa-solid fa-chevron-down ${styles.seta}`} aria-hidden="true" />
      </div>
    </header>
  );
}

// Perfil, DotChat e Biblioteca estão fora do MVP: apontam para os protótipos em HTML,
// como no rascunho. Provas, Histórico e Configurações ainda não têm tela.
const ITENS_DO_MENU = [
  { href: "/mapa", icone: "fa-solid fa-house", rotulo: "Home", atual: true },
  { href: "/prototipos/perfil/perfil.html", icone: "fa-regular fa-user", rotulo: "Perfil" },
  { href: "/prototipos/chat/chat.html", icone: "fa-solid fa-robot", rotulo: "DotChat" },
  { href: "/prototipos/library/library.html", icone: "fa-solid fa-book-open", rotulo: "Biblioteca" },
  { href: "#", icone: "fa-regular fa-newspaper", rotulo: "Provas" },
  { href: "#", icone: "fa-solid fa-clock-rotate-left", rotulo: "Histórico" },
  { href: "#", icone: "fa-solid fa-gear", rotulo: "Configurações" },
];

export function MenuLateral() {
  return (
    <nav className={styles.menuLateral} id="menu-lateral" aria-label="Menu principal">
      <ul>
        {ITENS_DO_MENU.map((item) => (
          <li key={item.rotulo} className={item.atual ? styles.atual : undefined}>
            {item.atual ? (
              <Link href={item.href} aria-current="page">
                <i className={item.icone} aria-hidden="true" />
                {item.rotulo}
              </Link>
            ) : (
              <a href={item.href}>
                <i className={item.icone} aria-hidden="true" />
                {item.rotulo}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
