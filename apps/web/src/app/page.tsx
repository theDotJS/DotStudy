import Link from "next/link";

// Indice temporario de desenvolvimento. Nao e tela do produto.
// Some quando o mapa de niveis virar a home.
export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">DotStudy</h1>
      <p className="mt-2 text-sm opacity-70">Indice de desenvolvimento. Nao e tela do produto.</p>

      <h2 className="mt-8 text-xl font-semibold">Rotas do app</h2>
      <ul className="mt-2 list-disc pl-6">
        <li>
          <Link href="/login">/login</Link>
        </li>
        <li>
          <Link href="/cadastro">/cadastro</Link>
        </li>
        <li>
          <Link href="/mapa">/mapa</Link>
        </li>
        <li>
          <Link href="/nivel/1">/nivel/[id]</Link>
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Prototipos em HTML</h2>
      <p className="text-sm opacity-70">
        Em uso ate o HTML final existir. Ver public/prototipos/LEIA-ME.md
      </p>
      <ul className="mt-2 list-disc pl-6">
        <li>
          <a href="/prototipos/main.html">Menu Principal</a>
        </li>
        <li>
          <a href="/prototipos/perfil.html">Perfil</a>
        </li>
      </ul>
    </main>
  );
}
