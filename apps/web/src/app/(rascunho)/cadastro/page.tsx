import type { Metadata } from "next";
import { FormularioDeConta } from "../formulario-de-conta";

export const metadata: Metadata = {
  title: "Cadastro · DotStudy",
};

export default function Page() {
  return <FormularioDeConta modo="cadastro" />;
}
