"use client";

// Fontes e ícones vêm do node_modules, não de CDN: o projeto precisa compilar e abrir offline.
import "@fontsource/amatic-sc/400.css";
import "@fontsource/amatic-sc/700.css";
import "@fontsource/saira/400.css";
import "@fontsource/saira/500.css";
import "@fontsource/saira/600.css";
import "@fontsource/saira/700.css";
import "@fontsource/ultra/400.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";
import { ErroDaApi, api, apagarToken, lerToken } from "@/lib/api";
import { Caminho } from "./caminho";
import styles from "./mapa.module.css";
import { MenuLateral, Topo } from "./moldura";
import { ACERTOS_PARA_PASSAR, NOTA_DE_CORTE, QUESTOES_POR_NIVEL } from "./regras";
import type { NivelDoMapa, RespostaProgresso, RespostaTrilhas, Trilha } from "./tipos";

type Carga =
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "pronto"; trilha: Trilha | null; niveis: NivelDoMapa[] };

// Em tela larga o menu começa aberto e empurra o conteúdo; em tela estreita ele cobre o conteúdo.
const TELA_LARGA = "(min-width: 1181px)";

function assinarTelaLarga(aoMudar: () => void) {
  const consulta = window.matchMedia(TELA_LARGA);
  consulta.addEventListener("change", aoMudar);
  return () => consulta.removeEventListener("change", aoMudar);
}

function mensagemDoErro(erro: unknown): string {
  if (erro instanceof ErroDaApi) {
    if (erro.codigo === "SEM_CONEXAO") return "Não foi possível falar com o servidor. Confira sua conexão e tente de novo.";
    if (erro.codigo === "TRILHA_NAO_ENCONTRADA") return "Ainda não há trilha cadastrada.";
  }
  return "Não foi possível carregar seu mapa.";
}

export function MapaDeNiveis() {
  const router = useRouter();
  const [carga, setCarga] = useState<Carga>({ status: "carregando" });
  const [tentativa, setTentativa] = useState(0);
  const [ordemDoBalao, setOrdemDoBalao] = useState<number | null>(null);

  const telaLarga = useSyncExternalStore(
    assinarTelaLarga,
    () => window.matchMedia(TELA_LARGA).matches,
    () => true,
  );
  const [fechadoNaTelaLarga, setFechadoNaTelaLarga] = useState(false);
  const [abertoNaTelaEstreita, setAbertoNaTelaEstreita] = useState(false);
  const menuAberto = telaLarga ? !fechadoNaTelaLarga : abertoNaTelaEstreita;

  // Uma chamada para o estado dos níveis (S5 de Rotas). /tracks só dá título e descrição:
  // se falhar, o mapa abre mesmo assim.
  useEffect(() => {
    // Sem token não há o que mostrar. Conveniência, não segurança: quem protege é a API.
    if (!lerToken()) {
      router.replace("/login");
      return;
    }

    let cancelado = false;
    Promise.all([
      api<RespostaProgresso>("/me/progress"),
      api<RespostaTrilhas>("/tracks").catch(() => null),
    ])
      .then(([progresso, listaDeTrilhas]) => {
        if (cancelado) return;
        const trilha = listaDeTrilhas?.trilhas.find((t) => t.id === progresso.trilhaId) ?? null;
        setCarga({ status: "pronto", trilha, niveis: progresso.niveis });
      })
      .catch((erro: unknown) => {
        if (cancelado) return;
        // Token expirado ou adulterado: o login acabou.
        if (erro instanceof ErroDaApi && erro.status === 401) {
          apagarToken();
          router.replace("/login");
          return;
        }
        setCarga({ status: "erro", mensagem: mensagemDoErro(erro) });
      });

    return () => {
      cancelado = true;
    };
  }, [router, tentativa]);

  useEffect(() => {
    if (telaLarga || !abertoNaTelaEstreita) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbertoNaTelaEstreita(false);
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [telaLarga, abertoNaTelaEstreita]);

  function alternarMenu() {
    if (telaLarga) setFechadoNaTelaLarga((fechado) => !fechado);
    else setAbertoNaTelaEstreita((aberto) => !aberto);
  }

  function tentarDeNovo() {
    setCarga({ status: "carregando" });
    setTentativa((n) => n + 1);
  }

  const classesDaPagina = [
    styles.pagina,
    telaLarga && fechadoNaTelaLarga ? styles.menuFechado : "",
    !telaLarga && abertoNaTelaEstreita ? styles.menuAberto : "",
  ].join(" ");

  return (
    <div className={classesDaPagina}>
      <Topo menuAberto={menuAberto} aoAlternarMenu={alternarMenu} />
      <MenuLateral />
      {!telaLarga && abertoNaTelaEstreita && (
        <div className={styles.menuFundo} onClick={() => setAbertoNaTelaEstreita(false)} />
      )}

      <main className={styles.conteudo}>
        {carga.status === "carregando" && (
          <div className={styles.situacao} role="status">
            <i className="fa-solid fa-paw" aria-hidden="true" />
            <p>Carregando seu mapa...</p>
          </div>
        )}

        {carga.status === "erro" && (
          <div className={styles.situacao} role="alert">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
            <p>{carga.mensagem}</p>
            <button type="button" className={styles.botao} onClick={tentarDeNovo}>
              Tentar de novo
            </button>
          </div>
        )}

        {carga.status === "pronto" && (
          <Mapa
            trilha={carga.trilha}
            niveis={carga.niveis}
            ordemDoBalao={ordemDoBalao}
            aoMudarBalao={setOrdemDoBalao}
          />
        )}
      </main>
    </div>
  );
}

interface PropsDoMapa {
  trilha: Trilha | null;
  niveis: NivelDoMapa[];
  ordemDoBalao: number | null;
  aoMudarBalao: (ordem: number | null) => void;
}

function Mapa({ trilha, niveis, ordemDoBalao, aoMudarBalao }: PropsDoMapa) {
  const feitos = niveis.filter((nivel) => nivel.estado === "concluido").length;
  const percentual = niveis.length ? Math.round((feitos / niveis.length) * 100) : 0;
  const atual = niveis.find((nivel) => nivel.estado === "disponivel");

  function continuar(evento: MouseEvent) {
    // Sem isso o clique chega no document e fecha o balão que acabou de abrir.
    evento.stopPropagation();
    if (!atual) return;
    document.getElementById(`nivel-${atual.ordem}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    aoMudarBalao(atual.ordem);
  }

  return (
    <div className={styles.mapa}>
      <section className={styles.caminhoArea} aria-labelledby="titulo-caminho">
        <h1 id="titulo-caminho" className="sr-only">
          Mapa de níveis
        </h1>
        <Caminho niveis={niveis} ordemDoBalao={ordemDoBalao} aoMudarBalao={aoMudarBalao} />
      </section>

      <aside className={styles.lateral}>
        <section className={`${styles.cartao} ${styles.cartaoTrilha}`} aria-labelledby="trilha-titulo">
          <p className={styles.sobretitulo}>Sua trilha</p>
          <h2 id="trilha-titulo" className={styles.trilhaTitulo}>
            {trilha?.titulo ?? "Trilha"}
          </h2>
          {trilha?.descricao && <p className={styles.trilhaDescricao}>{trilha.descricao}</p>}
          <div
            className={styles.progresso}
            role="progressbar"
            aria-label="Progresso na trilha"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentual}
          >
            <div className={styles.progressoBarra} style={{ width: `${percentual}%` }} />
          </div>
          <p className={styles.progressoTexto}>
            {feitos} de {niveis.length} níveis concluídos
          </p>
          <button type="button" className={styles.botao} disabled={!atual} onClick={continuar}>
            {atual ? `Continuar: nível ${atual.ordem}` : "Trilha concluída"}
          </button>
        </section>

        <section className={`${styles.cartao} ${styles.cartaoRegra}`} aria-labelledby="regra-titulo">
          <h2 id="regra-titulo" className={styles.cartaoTitulo}>
            <i className="fa-solid fa-paw" aria-hidden="true" /> Como avançar
          </h2>
          <ul className={styles.regraLista}>
            <li>
              <strong>{QUESTOES_POR_NIVEL} questões</strong> por nível.
            </li>
            <li>
              Acerte{" "}
              <strong>
                {ACERTOS_PARA_PASSAR} ({NOTA_DE_CORTE}%)
              </strong>{" "}
              e o próximo nível abre.
            </li>
            <li>
              Errou? Tente de novo, <strong>sem limite</strong>.
            </li>
            <li>
              Sua <strong>melhor nota</strong> fica guardada, mesmo se refizer.
            </li>
          </ul>
        </section>
      </aside>
    </div>
  );
}
