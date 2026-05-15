import type { Metadata } from 'next'
import GameCard from '@/components/games/GameCard'
import OddsTable from '@/components/odds/OddsTable'
import { MOCK_GAMES } from '@/lib/mock-data'
import BonusTicker from '@/components/shared/BonusTicker'

export const metadata: Metadata = {
  title: 'Comparador de Odds',
  description:
    'Compare odds de futebol em tempo real entre as principais casas de apostas do Brasil.',
}

export default function OddsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Comparador de Odds</h1>
        <p className="text-muted-foreground mt-1">
          Compare odds de todas as casas lado a lado. Verde = melhor odd do mercado.
        </p>
      </div>

      <BonusTicker />

      {/* Cards resumidos */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Jogos em Destaque</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Tabela detalhada do primeiro jogo */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            {MOCK_GAMES[0].home_team} × {MOCK_GAMES[0].away_team} — Resultado Final (1X2)
          </h2>
          <p className="text-sm text-muted-foreground">Comparação completa por casa de apostas</p>
        </div>
        <OddsTable game={MOCK_GAMES[0]} market="h2h" />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            {MOCK_GAMES[0].home_team} × {MOCK_GAMES[0].away_team} — Over/Under 2.5
          </h2>
        </div>
        <OddsTable game={MOCK_GAMES[0]} market="totals" />
      </section>

      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
        Exibindo dados de demonstração. Configure a chave da The Odds API para ver odds reais.
      </div>
    </div>
  )
}
