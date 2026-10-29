"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import styles from "./mapa.module.css";
import { ACERTOS_PARA_PASSAR, QUESTOES_POR_NIVEL, acertos } from "./regras";
import type { EstadoNivel, NivelDoMapa } from "./tipos";

// Deslocamento horizontal de cada nível, em px. Repete a cada 8 para formar a curva.
const CURVA = [0, 70, 110, 70, 0, -70, -110, -70];

const ICONES: Record<EstadoNivel, string> = {
  concluido: "fa-solid fa-check",
  disponivel: "fa-solid fa-star",
  bloqueado: "fa-solid fa-lock",
};

const CLASSE_DO_NO: Record<EstadoNivel, string> = {
  concluido: styles.noConcluido,
  disponivel: styles.noDisponivel,
  bloqueado: styles.noBloqueado,
};

const CLASSE_DO_NIVEL: Record<EstadoNivel, string> = {
  concluido: "",
  disponivel: styles.nivelDisponivel,
  bloqueado: styles.nivelBloqueado,
};

interface Centro {
  x: number;
  y: number;
  raio: number;
}

// Orelhas de gato por cima de cada bolinha. A base de cada orelha entra no círculo,
// então não aparece emenda; a cor vem do estado do nó (.orelha no CSS).
function Orelhas() {
  return (
    <svg className={styles.orelhas} viewBox="0 0 100 50" aria-hidden="true">
      <path className={styles.orelha} d="M12 50 L17 6 Q18 1 22 4 L46 46 Z" />
      <path className={styles.orelha} d="M88 50 L83 6 Q82 1 78 4 L54 46 Z" />
      <path className={styles.orelhaDentro} d="M20 40 L21.5 14 L36 38 Z" />
      <path className={styles.orelhaDentro} d="M80 40 L78.5 14 L64 38 Z" />
    </svg>
  );
}

function ladoDoRotulo(indice: number) {
  return CURVA[indice % CURVA.length] > 0 ? styles.rotuloEsquerda : styles.rotuloDireita;
}

function curvaPor(pontos: Centro[]): string {
  if (pontos.length < 2) return "";
  let d = `M ${pontos[0].x} ${pontos[0].y}`;
  for (let i = 1; i < pontos.length; i++) {
    const de = pontos[i - 1];
    const para = pontos[i];
    const meio = (para.y - de.y) / 2;
    d += ` C ${de.x} ${de.y + meio}, ${para.x} ${para.y - meio}, ${para.x} ${para.y}`;
  }
  return d;
}

// Espalha patinhas ao longo da curva, alternando esquerda e direita como pegadas,
// e pula os trechos que ficam por baixo das bolinhas: acima, as orelhas; abaixo, a nota.
// O SVG é montado como texto porque são dezenas de elementos recalculados a cada resize.
function htmlDasPatas(trilho: SVGPathElement, centros: Centro[], feito: number): string {
  const total = trilho.getTotalLength();
  const passo = 22;
  const tamanho = 15;
  let lado = 1;
  let html = "";

  const coberto = (ponto: DOMPoint) =>
    centros.some((c) => {
      const folga = ponto.y < c.y ? c.raio * 0.65 + 6 : 16;
      return Math.hypot(c.x - ponto.x, c.y - ponto.y) < c.raio + folga;
    });

  for (let s = passo / 2; s < total; s += passo) {
    const ponto = trilho.getPointAtLength(s);
    if (coberto(ponto)) continue;

    const adiante = trilho.getPointAtLength(Math.min(s + 1, total));
    const angulo = Math.atan2(adiante.y - ponto.y, adiante.x - ponto.x);
    const x = ponto.x + Math.cos(angulo + Math.PI / 2) * 5 * lado;
    const y = ponto.y + Math.sin(angulo + Math.PI / 2) * 5 * lado;
    lado = -lado;

    const classe = s <= feito ? `${styles.pata} ${styles.feita}` : styles.pata;
    // A patinha do símbolo aponta para cima (-90°); somar 90° alinha os dedos com o sentido do caminho.
    const giro = (angulo * 180) / Math.PI + 90;
    html +=
      `<g class="${classe}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${giro.toFixed(1)})">` +
      `<use href="#pata" x="${-tamanho / 2}" y="${-tamanho / 2}" width="${tamanho}" height="${tamanho}"/></g>`;
  }

  return html;
}

interface Props {
  niveis: NivelDoMapa[];
  ordemDoBalao: number | null;
  aoMudarBalao: (ordem: number | null) => void;
}

export function Caminho({ niveis, ordemDoBalao, aoMudarBalao }: Props) {
  const caminhoRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLOListElement>(null);
  const trilhoBaseRef = useRef<SVGPathElement>(null);
  const trilhoFeitoRef = useRef<SVGPathElement>(null);
  const patasRef = useRef<SVGGElement>(null);
  const balaoRef = useRef<HTMLDivElement>(null);

  const atual = niveis.find((nivel) => nivel.estado === "disponivel");
  const completa = niveis.length > 0 && niveis.every((nivel) => nivel.estado === "concluido");
  const nivelDoBalao = niveis.find((nivel) => nivel.ordem === ordemDoBalao && nivel.estado !== "bloqueado");
  const indiceDoFim = niveis.length;
  const xDoFim = CURVA[indiceDoFim % CURVA.length];

  // Mede o centro de cada nó já posicionado e desenha o trilho de patinhas por eles.
  const posicionar = useCallback(() => {
    const caminho = caminhoRef.current;
    const lista = listaRef.current;
    const trilhoBase = trilhoBaseRef.current;
    const trilhoFeito = trilhoFeitoRef.current;
    const patas = patasRef.current;
    if (!caminho || !lista || !trilhoBase || !trilhoFeito || !patas) return;

    const base = caminho.getBoundingClientRect();
    const nos = [...lista.querySelectorAll<HTMLElement>("[data-no]")];
    const centros = nos.map((no) => {
      const caixa = no.getBoundingClientRect();
      return {
        x: caixa.left - base.left + caixa.width / 2,
        y: caixa.top - base.top + caixa.height / 2,
        // offsetWidth ignora o scale de animações e do clique.
        raio: no.offsetWidth / 2,
      };
    });
    if (centros.length === 0) return;

    const indiceAtual = atual ? atual.ordem - 1 : indiceDoFim;
    trilhoBase.setAttribute("d", curvaPor(centros));
    trilhoFeito.setAttribute("d", curvaPor(centros.slice(0, indiceAtual + 1)));

    // O trilho feito é o começo exato do trilho base, então o comprimento dele diz até onde pintar.
    const feito = trilhoFeito.getAttribute("d") ? trilhoFeito.getTotalLength() : 0;
    patas.innerHTML = htmlDasPatas(trilhoBase, centros, feito);

    const balao = balaoRef.current;
    const noDoBalao = ordemDoBalao === null ? null : lista.querySelector<HTMLElement>(`[data-ordem="${ordemDoBalao}"]`);
    if (balao && noDoBalao) {
      const caixa = noDoBalao.getBoundingClientRect();
      const centroX = caixa.left - base.left + caixa.width / 2;
      const meiaLargura = balao.offsetWidth / 2;
      const esquerda = Math.min(Math.max(centroX, meiaLargura + 4), base.width - meiaLargura - 4);
      balao.style.left = `${esquerda}px`;
      balao.style.top = `${caixa.bottom - base.top + 22}px`;
      balao.style.setProperty("--seta", `${centroX - esquerda + meiaLargura}px`);
    }
  }, [atual, indiceDoFim, ordemDoBalao]);

  useLayoutEffect(() => {
    posicionar();
    const caminho = caminhoRef.current;
    if (!caminho) return;
    const observador = new ResizeObserver(posicionar);
    observador.observe(caminho);
    // As fontes mudam a largura dos rótulos; quando terminam de carregar, mede de novo.
    document.fonts.ready.then(posicionar);
    return () => observador.disconnect();
  }, [posicionar, niveis]);

  const fecharBalao = useCallback(
    (devolverFoco: boolean) => {
      if (devolverFoco && ordemDoBalao !== null) {
        listaRef.current?.querySelector<HTMLElement>(`[data-ordem="${ordemDoBalao}"]`)?.focus();
      }
      aoMudarBalao(null);
    },
    [aoMudarBalao, ordemDoBalao],
  );

  // Balão aberto: foco no botão de ação; clique fora ou Esc fecham.
  useEffect(() => {
    if (ordemDoBalao === null) return;
    balaoRef.current?.querySelector<HTMLElement>("[data-acao]")?.focus({ preventScroll: true });

    const aoClicar = (evento: globalThis.MouseEvent) => {
      if (!balaoRef.current?.contains(evento.target as Node)) fecharBalao(false);
    };
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") fecharBalao(true);
    };
    document.addEventListener("click", aoClicar);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("click", aoClicar);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [ordemDoBalao, fecharBalao]);

  function aoClicarNoNo(evento: MouseEvent, ordem: number) {
    // Sem isso o clique chega no document e o balão fecha no mesmo instante em que abre.
    evento.stopPropagation();
    aoMudarBalao(ordemDoBalao === ordem ? null : ordem);
  }

  return (
    <div className={styles.caminho} ref={caminhoRef}>
      <svg className={styles.caminhoTrilho} aria-hidden="true">
        <defs>
          {/* Patinha com os dedos para cima; htmlDasPatas gira cada uma no sentido do caminho. */}
          <symbol id="pata" viewBox="-12 -12 24 24">
            <ellipse cx="0" cy="4.5" rx="6" ry="5.2" />
            <ellipse cx="-7.2" cy="-2.5" rx="2.5" ry="3.1" transform="rotate(-25 -7.2 -2.5)" />
            <ellipse cx="-2.6" cy="-7.2" rx="2.5" ry="3.2" transform="rotate(-8 -2.6 -7.2)" />
            <ellipse cx="2.6" cy="-7.2" rx="2.5" ry="3.2" transform="rotate(8 2.6 -7.2)" />
            <ellipse cx="7.2" cy="-2.5" rx="2.5" ry="3.1" transform="rotate(25 7.2 -2.5)" />
          </symbol>
        </defs>
        <path ref={trilhoBaseRef} />
        <path ref={trilhoFeitoRef} />
        <g ref={patasRef} />
      </svg>

      <ol className={styles.niveis} ref={listaRef}>
        {niveis.map((nivel, indice) => {
          const estilo = { "--x": CURVA[indice % CURVA.length] } as CSSProperties;
          const rotulo = (
            <span className={`${styles.rotulo} ${ladoDoRotulo(indice)}`} aria-hidden="true">
              <span className={styles.rotuloOrdem}>Nível {nivel.ordem}</span>
              <span className={styles.rotuloTitulo}>{nivel.titulo}</span>
            </span>
          );

          return (
            <li key={nivel.nivelId} className={`${styles.nivel} ${CLASSE_DO_NIVEL[nivel.estado]}`}>
              <div className={styles.nivelAncora} style={estilo}>
                {nivel.estado === "bloqueado" ? (
                  // RN-07: nível bloqueado não é clicável, então nem vira botão.
                  <span
                    className={`${styles.no} ${CLASSE_DO_NO.bloqueado}`}
                    data-no
                    data-ordem={nivel.ordem}
                    role="img"
                    aria-label={`Nível ${nivel.ordem}, ${nivel.titulo}: bloqueado`}
                    title={`Conclua o nível ${nivel.ordem - 1} para liberar`}
                  >
                    <Orelhas />
                    <i className={ICONES.bloqueado} aria-hidden="true" />
                  </span>
                ) : (
                  <button
                    type="button"
                    id={`nivel-${nivel.ordem}`}
                    className={`${styles.no} ${CLASSE_DO_NO[nivel.estado]}`}
                    data-no
                    data-ordem={nivel.ordem}
                    aria-haspopup="dialog"
                    aria-expanded={ordemDoBalao === nivel.ordem}
                    aria-label={`Nível ${nivel.ordem}, ${nivel.titulo}: ${
                      nivel.estado === "concluido" ? `concluído com ${nivel.melhorPercentual}%` : "disponível"
                    }`}
                    onClick={(evento) => aoClicarNoNo(evento, nivel.ordem)}
                  >
                    <Orelhas />
                    <i className={ICONES[nivel.estado]} aria-hidden="true" />
                    {nivel.estado === "concluido" && nivel.melhorPercentual !== null && (
                      <span className={styles.nota} aria-hidden="true">
                        {nivel.melhorPercentual}%
                      </span>
                    )}
                    {nivel.estado === "disponivel" && (
                      <span className={styles.convite} aria-hidden="true">
                        Começar
                      </span>
                    )}
                  </button>
                )}
                {rotulo}
              </div>
            </li>
          );
        })}

        <li className={styles.nivel}>
          <div className={styles.nivelAncora} style={{ "--x": xDoFim } as CSSProperties}>
            <span
              className={`${styles.no} ${styles.noFim} ${completa ? styles.aberto : ""}`}
              data-no
              role="img"
              aria-label={completa ? "Trilha concluída" : "Fim da trilha"}
            >
              <Orelhas />
              <i className="fa-solid fa-trophy" aria-hidden="true" />
            </span>
            <span className={`${styles.rotulo} ${ladoDoRotulo(indiceDoFim)}`} aria-hidden="true">
              <span className={styles.rotuloOrdem}>Fim da trilha</span>
              <span className={styles.rotuloTitulo}>
                {completa ? "Trilha concluída!" : `Conclua os ${niveis.length} níveis`}
              </span>
            </span>
          </div>
        </li>
      </ol>

      {nivelDoBalao && (
        <div className={styles.balao} ref={balaoRef} role="dialog" aria-labelledby="balao-titulo">
          <button
            type="button"
            className={styles.balaoFechar}
            aria-label="Fechar"
            onClick={() => fecharBalao(true)}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
          <p className={styles.balaoOrdem}>
            Nível {nivelDoBalao.ordem} · {nivelDoBalao.estado === "concluido" ? "concluído" : "disponível"}
          </p>
          <h3 className={styles.balaoTitulo} id="balao-titulo">
            {nivelDoBalao.titulo}
          </h3>
          <p className={styles.balaoTexto}>
            {nivelDoBalao.estado === "concluido" && nivelDoBalao.melhorPercentual !== null ? (
              <>
                Sua melhor nota: <strong>{nivelDoBalao.melhorPercentual}%</strong> (
                {acertos(nivelDoBalao.melhorPercentual)} de {QUESTOES_POR_NIVEL}). Refazer não diminui essa nota.
              </>
            ) : (
              <>
                Leia o conteúdo e responda {QUESTOES_POR_NIVEL} questões. Acerte {ACERTOS_PARA_PASSAR} para{" "}
                {nivelDoBalao.ordem === niveis.length
                  ? "concluir a trilha"
                  : `liberar o nível ${nivelDoBalao.ordem + 1}`}
                .
              </>
            )}
          </p>
          <Link
            href={`/nivel/${nivelDoBalao.nivelId}`}
            className={`${styles.botao} ${nivelDoBalao.estado === "concluido" ? styles.botaoSecundario : ""}`}
            data-acao
          >
            {nivelDoBalao.estado === "concluido" ? "Refazer" : "Começar"}
          </Link>
        </div>
      )}
    </div>
  );
}
