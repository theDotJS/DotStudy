// Fontes e ícones vêm do node_modules, não de CDN: o projeto precisa compilar e abrir offline.
import "@fontsource/amatic-sc/400.css";
import "@fontsource/amatic-sc/700.css";
import "@fontsource/saira/400.css";
import "@fontsource/saira/600.css";
import "@fontsource/ultra/400.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { Casca } from "./casca";

// Telas do rascunho de design (Canva, pasta DotSTUDY), implementadas como estão.
// O visual é provisório: a repaginada vem depois. O /mapa fica fora deste grupo porque já tem
// o visual próprio aprovado.
export default function LayoutDoRascunho({ children }: LayoutProps<"/">) {
  return <Casca>{children}</Casca>;
}
