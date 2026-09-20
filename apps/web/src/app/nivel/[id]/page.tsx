// Rota vazia. Tarefa S1 de Telas Web: provar que a navegação funciona.
// Conteúdo real vem depois. Contrato das rotas: docs/contrato-api.md
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <h1>Nível {id}</h1>;
}
