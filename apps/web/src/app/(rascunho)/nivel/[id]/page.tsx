import type { Metadata } from "next";
import { Nivel } from "./nivel";

// Tela de Nível, Exercício e Resultado do MVP. Contrato: GET /levels/:id e POST /levels/:id/submit.
export const metadata: Metadata = {
  title: "Nível · DotStudy",
};

export default async function Page({ params }: PageProps<"/nivel/[id]">) {
  const { id } = await params;
  return <Nivel id={id} />;
}
