import type { Metadata } from "next";
import { Perfil } from "./perfil";

export const metadata: Metadata = {
  title: "Perfil · DotStudy",
};

export default function Page() {
  return <Perfil />;
}
