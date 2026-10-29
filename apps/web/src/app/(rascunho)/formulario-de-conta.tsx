"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ErroDaApi, api, salvarSessao, type RespostaDeSessao } from "@/lib/api";
import estilos from "./conta.module.css";
import base from "./rascunho.module.css";

// Tela "Login" do rascunho. O cadastro não tem desenho próprio: usa o mesmo visual com um campo a mais.
// Contrato: POST /auth/login e POST /auth/register devolvem { token, usuario }.

interface Campo {
  nome: "nome" | "email" | "senha";
  rotulo: string;
  icone: string;
  tipo: string;
  autoComplete: string;
}

interface Props {
  modo: "login" | "cadastro";
}

const CAMPOS: Record<Props["modo"], Campo[]> = {
  login: [
    { nome: "email", rotulo: "e-mail", icone: "fa-regular fa-user", tipo: "email", autoComplete: "email" },
    { nome: "senha", rotulo: "senha", icone: "fa-solid fa-lock", tipo: "password", autoComplete: "current-password" },
  ],
  cadastro: [
    { nome: "nome", rotulo: "nome", icone: "fa-regular fa-user", tipo: "text", autoComplete: "name" },
    { nome: "email", rotulo: "e-mail", icone: "fa-regular fa-envelope", tipo: "email", autoComplete: "email" },
    { nome: "senha", rotulo: "senha", icone: "fa-solid fa-lock", tipo: "password", autoComplete: "new-password" },
  ],
};

// A tela decide o texto pelo código do erro, nunca pela mensagem da API (contrato, seção 2).
function mensagemGeral(erro: unknown): string {
  if (!(erro instanceof ErroDaApi)) return "Algo deu errado. Tente de novo.";
  switch (erro.codigo) {
    case "CREDENCIAIS_INVALIDAS":
      return "E-mail ou senha incorretos.";
    case "TENTATIVAS_EXCEDIDAS":
      return "Muitas tentativas. Espere um pouco e tente de novo.";
    case "SEM_CONEXAO":
      return "Não foi possível falar com o servidor. Confira sua conexão.";
    default:
      return erro.campos ? "Confira os campos marcados." : "Algo deu errado. Tente de novo.";
  }
}

export function FormularioDeConta({ modo }: Props) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosPorCampo, setErrosPorCampo] = useState<Record<string, string>>({});
  const campos = CAMPOS[modo];

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget));
    setEnviando(true);
    setErroGeral(null);
    setErrosPorCampo({});

    try {
      const sessao = await api<RespostaDeSessao>(modo === "login" ? "/auth/login" : "/auth/register", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      salvarSessao(sessao);
      router.replace("/mapa");
    } catch (erro) {
      if (erro instanceof ErroDaApi && erro.codigo === "EMAIL_JA_CADASTRADO") {
        setErrosPorCampo({ email: "Este e-mail já tem conta. Entre com ele." });
      } else {
        if (erro instanceof ErroDaApi && erro.campos) setErrosPorCampo(erro.campos);
        setErroGeral(mensagemGeral(erro));
      }
      setEnviando(false);
    }
  }

  return (
    <div className={estilos.tela}>
      <Image className={estilos.gato} src="/rascunho/gato-sentado.svg" alt="" width={336} height={390} unoptimized />

      <form className={estilos.formulario} onSubmit={enviar}>
        <h1 className={`${base.tituloGrande} ${estilos.titulo}`}>
          {modo === "login" ? "Bem vindo!" : "Crie sua conta"}
        </h1>

        {campos.map((campo) => {
          const erro = errosPorCampo[campo.nome];
          return (
            <div key={campo.nome} className={estilos.campo}>
              <label htmlFor={`campo-${campo.nome}`} className={estilos.icone}>
                <i className={campo.icone} aria-hidden="true" />
                <span className="sr-only">{campo.rotulo}</span>
              </label>
              <input
                id={`campo-${campo.nome}`}
                name={campo.nome}
                type={campo.tipo}
                autoComplete={campo.autoComplete}
                placeholder={campo.rotulo}
                required
                aria-invalid={erro ? true : undefined}
                aria-describedby={erro ? `erro-${campo.nome}` : undefined}
              />
              {erro && (
                <p id={`erro-${campo.nome}`} className={estilos.erroDoCampo}>
                  {erro}
                </p>
              )}
            </div>
          );
        })}

        <button type="submit" className={`${base.botaoAmarelo} ${estilos.enviar}`} disabled={enviando}>
          {enviando ? "Aguarde..." : modo === "login" ? "LOGIN" : "CADASTRAR"}
        </button>

        {erroGeral && (
          <p className={estilos.erroGeral} role="alert">
            {erroGeral}
          </p>
        )}

        {modo === "login" ? (
          <>
            <p className={estilos.ou}>OU LOGIN COM:</p>
            <div className={estilos.redes}>
              <Link href="/em-construcao" aria-label="Entrar com Facebook">
                <Image src="/rascunho/facebook.svg" alt="" width={64} height={64} unoptimized />
              </Link>
              <Link href="/em-construcao" aria-label="Entrar com Google">
                <Image className={estilos.google} src="/rascunho/google.jpg" alt="" width={64} height={64} />
              </Link>
            </div>
            <p className={estilos.troca}>
              Não tem conta? <Link href="/cadastro">Cadastre-se</Link>
            </p>
          </>
        ) : (
          <p className={estilos.troca}>
            Já tem conta? <Link href="/login">Entrar</Link>
          </p>
        )}
      </form>
    </div>
  );
}
