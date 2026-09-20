import type { Metadata } from "next";
import "./globals.css";

// Sem next/font/google de proposito: aquilo baixa a fonte da internet no build.
// O projeto precisa compilar offline, na maquina de qualquer pessoa do time.
// A fonte definitiva entra quando a Lana fechar a tipografia (tarefa S2).

export const metadata: Metadata = {
  title: "DotStudy",
  description: "Plataforma de estudos com progressao por niveis. TCC.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-br" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
