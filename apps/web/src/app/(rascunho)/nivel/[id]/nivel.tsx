"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErroDaApi, api, apagarToken, lerToken } from "@/lib/api";
import base from "../../rascunho.module.css";
import estilos from "./nivel.module.css";
import { TextoDoNivel } from "./texto-do-nivel";
import type { NivelCompleto, ResultadoDaSubmissao } from "./tipos";

// Fluxo: conteúdo → uma questão por vez → envio → resultado.
// A correção é só no servidor (RN-08 e RN-09): o navegador nunca sabe a resposta certa antes de enviar,
// por isso o "acertou/errou" aparece no fim, e não a cada questão.
type Etapa =
  | { tipo: "carregando" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "conteudo" }
  | { tipo: "questao"; indice: number }
  | { tipo: "corrigindo" }
  | { tipo: "resultado"; resultado: ResultadoDaSubmissao };

function mensagemDoErro(erro: unknown): string {
  if (erro instanceof ErroDaApi) {
    switch (erro.codigo) {
      case "NIVEL_BLOQUEADO":
        return "Este nível ainda está bloqueado. Conclua o anterior no mapa.";
      case "NIVEL_NAO_ENCONTRADO":
        return "Este nível não existe.";
      case "RESPOSTAS_INCOMPLETAS":
      case "RESPOSTAS_INVALIDAS":
        return "As respostas não chegaram completas. Responda de novo.";
      case "SEM_CONEXAO":
        return "Não foi possível falar com o servidor. Confira sua conexão e tente de novo.";
    }
  }
  return "Algo deu errado ao carregar o nível.";
}

export function Nivel({ id }: { id: string }) {
  const router = useRouter();
  const [nivel, setNivel] = useState<NivelCompleto | null>(null);
  const [etapa, setEtapa] = useState<Etapa>({ tipo: "carregando" });
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  // Cada etapa começa do topo: o conteúdo pode ser longo e a questão seguinte não pode abrir rolada.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [etapa]);

  useEffect(() => {
    // Sem token não há o que mostrar. Conveniência, não segurança: quem protege é a API.
    if (!lerToken()) {
      router.replace("/login");
      return;
    }
    let cancelado = false;
    api<NivelCompleto>(`/levels/${encodeURIComponent(id)}`)
      .then((dados) => {
        if (cancelado) return;
        setNivel(dados);
        setEtapa({ tipo: "conteudo" });
      })
      .catch((erro: unknown) => {
        if (cancelado) return;
        if (erro instanceof ErroDaApi && erro.status === 401) {
          apagarToken();
          router.replace("/login");
          return;
        }
        setEtapa({ tipo: "erro", mensagem: mensagemDoErro(erro) });
      });
    return () => {
      cancelado = true;
    };
  }, [id, router]);

  async function enviar(todas: Record<string, string>) {
    setEtapa({ tipo: "corrigindo" });
    try {
      const resultado = await api<ResultadoDaSubmissao>(`/levels/${encodeURIComponent(id)}/submit`, {
        method: "POST",
        body: JSON.stringify({
          respostas: Object.entries(todas).map(([questaoId, alternativaId]) => ({ questaoId, alternativaId })),
        }),
      });
      setEtapa({ tipo: "resultado", resultado });
    } catch (erro) {
      if (erro instanceof ErroDaApi && erro.status === 401) {
        apagarToken();
        router.replace("/login");
        return;
      }
      setEtapa({ tipo: "erro", mensagem: mensagemDoErro(erro) });
    }
  }

  function responder(questaoId: string, alternativaId: string, indice: number) {
    const todas = { ...respostas, [questaoId]: alternativaId };
    setRespostas(todas);
    if (nivel && indice + 1 < nivel.questoes.length) {
      setEtapa({ tipo: "questao", indice: indice + 1 });
    } else {
      enviar(todas);
    }
  }

  // RN-04: reprovar não bloqueia. Tentar de novo começa do zero, sem limite.
  function tentarDeNovo() {
    setRespostas({});
    setEtapa({ tipo: "questao", indice: 0 });
  }

  if (etapa.tipo === "carregando" || etapa.tipo === "corrigindo") {
    return (
      <p className={estilos.situacao} role="status">
        {etapa.tipo === "carregando" ? "Carregando o nível..." : "Corrigindo suas respostas..."}
      </p>
    );
  }

  if (etapa.tipo === "erro" || !nivel) {
    return (
      <div className={estilos.situacao} role="alert">
        <p>{etapa.tipo === "erro" ? etapa.mensagem : "Algo deu errado ao carregar o nível."}</p>
        <Link href="/mapa" className={`${base.pilula} ${estilos.voltarAoMapa}`}>
          Voltar ao mapa
        </Link>
      </div>
    );
  }

  if (etapa.tipo === "conteudo") {
    return (
      <article className={estilos.conteudo}>
        <p className={estilos.ordem}>Nível {nivel.ordem}</p>
        <h1 className={`${base.tituloGrande} ${estilos.tituloDoNivel}`}>{nivel.titulo}</h1>
        <div className={estilos.texto}>
          <TextoDoNivel conteudo={nivel.conteudo} />
        </div>
        {nivel.fontes.length > 0 && (
          <section className={estilos.fontes} aria-labelledby="titulo-fontes">
            <h2 id="titulo-fontes">Fontes</h2>
            <ul>
              {nivel.fontes.map((fonte) => (
                <li key={fonte.url}>
                  {fonte.url.startsWith("https://") ? (
                    <a href={fonte.url} target="_blank" rel="noopener noreferrer">
                      {fonte.titulo}
                    </a>
                  ) : (
                    fonte.titulo
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
        <button
          type="button"
          className={`${base.pilula} ${estilos.comecar}`}
          onClick={() => setEtapa({ tipo: "questao", indice: 0 })}
        >
          Começar exercício
        </button>
      </article>
    );
  }

  if (etapa.tipo === "questao") {
    const questao = nivel.questoes[etapa.indice];
    return (
      <div className={estilos.questao}>
        <Image className={estilos.gatoEspiando} src="/rascunho/gato-espiando.svg" alt="" width={552} height={268} unoptimized />
        <p className={estilos.contador}>
          Questão: {etapa.indice + 1}/{nivel.questoes.length}
        </p>
        <h1 className={estilos.enunciado} id="enunciado">
          {questao.enunciado}
        </h1>
        <div className={estilos.alternativas} role="group" aria-labelledby="enunciado">
          {questao.alternativas.map((alternativa) => (
            <button
              key={alternativa.id}
              type="button"
              className={estilos.alternativa}
              onClick={() => responder(questao.id, alternativa.id, etapa.indice)}
            >
              {alternativa.texto}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const { resultado } = etapa;
  const placar = `Você acertou ${resultado.acertos} de ${resultado.total} (${resultado.percentual}%).`;

  if (resultado.aprovado) {
    return (
      <div className={estilos.acertou}>
        <Link href="/mapa" className={`${base.pilula} ${estilos.voltar}`}>
          Voltar
        </Link>
        <h1 className={estilos.placar}>{placar}</h1>
        <Image
          className={estilos.gatoComemorando}
          src="/rascunho/gato-comemorando.svg"
          loading="eager"
          alt="Gato preto comemorando de braços para cima"
          width={438}
          height={520}
          unoptimized
        />
        <Link
          href={resultado.proximoNivelLiberado ? `/nivel/${resultado.proximoNivelLiberado.id}` : "/mapa"}
          className={estilos.proxima}
          aria-label={resultado.proximoNivelLiberado ? "Próximo nível" : "Voltar ao mapa"}
        >
          <Image src="/rascunho/seta-proxima.svg" alt="" width={240} height={104} unoptimized />
        </Link>
      </div>
    );
  }

  return (
    <div className={estilos.errou}>
      <Image className={estilos.gatoChorando} src="/rascunho/gato-chorando.svg" alt="" width={424} height={492} unoptimized loading="eager" />
      <div className={estilos.errouCentro}>
        <h1 className="sr-only">Buuuu! Errou!</h1>
        <Image className={estilos.errouTitulo} src="/rascunho/errou.svg" alt="" width={668} height={444} unoptimized loading="eager" />
        <p className={estilos.placarErrou}>
          {placar} Precisa de {resultado.notaDeCorte}% para passar. Tente de novo quando quiser.
        </p>
        <div className={estilos.botoesErrou}>
          <Link href="/mapa" className={base.pilula}>
            Voltar
          </Link>
          <button type="button" className={base.pilula} onClick={tentarDeNovo}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
