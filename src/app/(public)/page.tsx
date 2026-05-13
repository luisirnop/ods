import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OddsBR — Comparador de Odds em Tempo Real',
  description:
    'Compare odds das melhores casas de apostas do Brasil em tempo real. Palpites, rankings e análises de futebol.',
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Compare as melhores{' '}
          <span className="text-green-500">odds do Brasil</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre a melhor odd em tempo real entre as principais casas de apostas.
          Palpites da comunidade, rankings e análises de futebol.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Jogos de Hoje</h2>
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          Configure as variáveis de ambiente do Supabase e The Odds API para ver os jogos.
        </div>
      </section>
    </div>
  )
}
