"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import estilos from "./chat.module.css";

// Fora do MVP: o DotChat não tem backend. Como no protótipo HTML, o gato responde uma
// mensagem fixa depois de um instante, para mostrar o fluxo da conversa.
const RESPOSTA_FIXA = "Meow! O DotChat ainda está em construção.";

interface Mensagem {
  id: number;
  autor: "gato" | "pessoa";
  texto: string;
}

export function Chat() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([{ id: 0, autor: "gato", texto: "meow!" }]);
  const [rascunho, setRascunho] = useState("");
  const fimRef = useRef<HTMLDivElement>(null);
  const proximoId = useRef(1);
  const respostaPendente = useRef<number | null>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [mensagens]);

  useEffect(() => () => {
    if (respostaPendente.current !== null) window.clearTimeout(respostaPendente.current);
  }, []);

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const texto = rascunho.trim();
    if (!texto) return;
    setMensagens((atual) => [...atual, { id: proximoId.current++, autor: "pessoa", texto }]);
    setRascunho("");
    respostaPendente.current = window.setTimeout(() => {
      setMensagens((atual) => [...atual, { id: proximoId.current++, autor: "gato", texto: RESPOSTA_FIXA }]);
    }, 700);
  }

  return (
    <div className={estilos.tela}>
      <Image
        className={estilos.gato}
        src="/rascunho/gato-sentado.svg"
        alt=""
        width={336}
        height={390}
        unoptimized
      />

      <div className={estilos.conversa} role="log" aria-live="polite" aria-label="Conversa com o DotChat">
        {mensagens.map((mensagem) => (
          <p
            key={mensagem.id}
            className={`${estilos.balao} ${mensagem.autor === "gato" ? estilos.doGato : estilos.daPessoa}`}
          >
            {mensagem.texto}
          </p>
        ))}
        <div ref={fimRef} />
      </div>

      <form className={estilos.entrada} onSubmit={enviar}>
        <label htmlFor="duvida" className="sr-only">
          Sua dúvida
        </label>
        <input
          id="duvida"
          type="text"
          placeholder="Escreva AQUI sua dúvida"
          autoComplete="off"
          value={rascunho}
          onChange={(evento) => setRascunho(evento.target.value)}
        />
        <Link href="/em-construcao" className={estilos.acao} aria-label="Anexar link">
          <i className="fa-solid fa-link" aria-hidden="true" />
        </Link>
        <button type="submit" className={estilos.acao} aria-label="Enviar">
          <i className="fa-regular fa-paper-plane" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
