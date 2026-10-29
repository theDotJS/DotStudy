import type { Metadata } from "next";
import { MapaDeNiveis } from "./mapa-de-niveis";

// Mapa de níveis. Visual: public/prototipos/mapa (mockup aprovado). Dados: GET /me/progress.
export const metadata: Metadata = {
  title: "Mapa de Níveis · DotStudy",
};

export default function Page() {
  return <MapaDeNiveis />;
}
