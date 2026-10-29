import type { Metadata } from "next";
import { Assuntos } from "./assuntos";

export const metadata: Metadata = {
  title: "Exatas · DotStudy",
};

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Provas de Exatas</h1>
      <Assuntos />
    </>
  );
}
