import type { Metadata } from "next";
import { FormularioDeConta } from "../formulario-de-conta";

export const metadata: Metadata = {
  title: "Entrar · DotStudy",
};

export default function Page() {
  return <FormularioDeConta modo="login" />;
}
