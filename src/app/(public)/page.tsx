import type { Metadata } from 'next'
import GameCard from '@/components/games/GameCard'
import { MOCK_GAMES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'OddsBR — Comparador de Odds em Tempo Real',
  description:
    'Compare odds das melhores casas de apostas do Brasil em tempo real. Palpites, rankings e análises de futebol.',
}

export default function HomePage() {
  const today = MOCK_GAMES.filter((g) => {
    const gameDate = new Date(g.commence_time)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59)
    return gameDate <= tomorrow
  })

  const upcoming = MOCK_GAMES.filter((g) => {
    const gameDate = new Date(g.commence_time)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59)
    return gameDate > tomorrow
  })

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Compare as melhores{' '}
          <span className="text-green-500">odds do Brasil</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre a melhor odd em tempo real entre as principais casas de apostas.
          Aposte com estratégia — compare antes de decidir.
        </p>
      </section>

      {/* Jogos de hoje */}
      {today.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Jogos de Hoje e Amanhã</h2>
            <a href="/odds" className="text-sm text-green-600 hover:underline">
              Ver todos →
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {today.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Próximos */}
      {upcoming.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Próximos Jogos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Aviso dados mock */}
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
        Exibindo dados de demonstração. Configure a chave da The Odds API para ver odds reais.
      </div>
    </div>
  )
}
