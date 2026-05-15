import type { Metadata } from 'next'
import GameCard from '@/components/games/GameCard'
import OddsTable from '@/components/odds/OddsTable'
import BonusTicker from '@/components/shared/BonusTicker'
import { getOdds, isSportKey, SPORTS } from '@/lib/odds-api'
import { MOCK_GAMES } from '@/lib/mock-data'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Comparador de Odds',
  description:
    'Compare odds de futebol em tempo real entre as principais casas de apostas do Brasil.',
}

const LEAGUE_TABS = [
  { label: 'Brasileirão A',  key: SPORTS.BRASILEIRAO_A    },
  { label: 'Brasileirão B',  key: SPORTS.BRASILEIRAO_B    },
  { label: 'Libertadores',   key: SPORTS.LIBERTADORES     },
  { label: 'Sul-Americana',  key: SPORTS.SUL_AMERICANA    },
  { label: 'Champions',      key: SPORTS.CHAMPIONS_LEAGUE },
  { label: 'Premier League', key: SPORTS.PREMIER_LEAGUE   },
  { label: 'La Liga',        key: SPORTS.LA_LIGA          },
  { label: 'Serie A',        key: SPORTS.SERIE_A          },
  { label: 'Bundesliga',     key: SPORTS.BUNDESLIGA       },
]

export default async function OddsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>
}) {
  const { sport: sportParam } = await searchParams
  const sport = sportParam && isSportKey(sportParam) ? sportParam : SPORTS.BRASILEIRAO_A

  const currentTab = LEAGUE_TABS.find((t) => t.key === sport) ?? LEAGUE_TABS[0]

  const apiGames = await getOdds(sport).catch(() => null)
  const usingMock = !apiGames || apiGames.length === 0
  const games = usingMock
    ? (MOCK_GAMES.filter((g) => g.sport_key === sport).length
        ? MOCK_GAMES.filter((g) => g.sport_key === sport)
        : MOCK_GAMES)
    : apiGames

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Comparador de Odds</h1>
        <p className="text-muted-foreground mt-1">
          Compare odds de futebol em tempo real entre as principais casas de apostas do Brasil.
        </p>
      </div>

      <BonusTicker />

      {/* Abas de campeonato */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {LEAGUE_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/odds?sport=${tab.key}`}
            className={[
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap',
              tab.key === sport
                ? 'bg-green-500 text-black'
                : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10',
            ].join(' ')}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Cards de jogos */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{currentTab.label} — Próximos Jogos</h2>
        {games.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm py-8 text-center">
            Nenhum jogo disponível no momento para {currentTab.label}.
          </p>
        )}
      </section>

      {/* Tabela detalhada do primeiro jogo */}
      {games.length > 0 && (
        <>
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">
                {games[0].home_team} × {games[0].away_team} — Resultado Final (1X2)
              </h2>
              <p className="text-sm text-muted-foreground">Comparação completa por casa de apostas</p>
            </div>
            <OddsTable game={games[0]} market="h2h" />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {games[0].home_team} × {games[0].away_team} — Over/Under 2.5
            </h2>
            <OddsTable game={games[0]} market="totals" />
          </section>
        </>
      )}

      {usingMock && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400 flex items-center gap-2">
          ⚠ Sem jogos disponíveis na API para esta liga agora. Exibindo dados de demonstração.
        </div>
      )}
    </div>
  )
}
