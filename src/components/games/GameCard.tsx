import Link from 'next/link'
import type { OddsGame } from '@/types'
import { getBestOdds } from '@/lib/odds-api'
import { getAffiliateLink, type Bookmaker } from '@/lib/affiliates'
import { cn } from '@/lib/utils'

function formatTime(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoDate: string) {
  const d = new Date(isoDate)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Hoje'
  if (d.toDateString() === tomorrow.toDateString()) return 'Amanhã'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

interface Props {
  game: OddsGame
}

export default function GameCard({ game }: Props) {
  const best = getBestOdds(game, 'h2h')

  const outcomes = [
    { label: game.home_team, key: game.home_team },
    { label: 'Empate', key: 'Draw' },
    { label: game.away_team, key: game.away_team },
  ]

  const bestPrice = Math.max(...Object.values(best).map((b) => b.price))

  return (
    <div className="rounded-xl border bg-card p-4 hover:border-green-500/40 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium">{game.sport_title}</span>
        <span className="text-xs text-muted-foreground">
          {formatDate(game.commence_time)} · {formatTime(game.commence_time)}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="font-semibold text-sm flex-1 text-left">{game.home_team}</span>
        <span className="text-xs text-muted-foreground font-medium px-2">vs</span>
        <span className="font-semibold text-sm flex-1 text-right">{game.away_team}</span>
      </div>

      {/* Odds top 3 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {outcomes.map(({ label, key }) => {
          const data = best[key]
          const isBest = data?.price === bestPrice
          return (
            <div key={key} className="text-center">
              <div className="text-xs text-muted-foreground mb-1 truncate">{label}</div>
              {data ? (
                <div
                  className={cn(
                    'rounded-lg px-2 py-1.5 text-sm font-bold tabular-nums',
                    isBest
                      ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                      : 'bg-muted text-foreground'
                  )}
                >
                  {data.price.toFixed(2)}
                  <div className="text-xs font-normal text-muted-foreground mt-0.5">{data.bookmaker}</div>
                </div>
              ) : (
                <div className="rounded-lg px-2 py-1.5 text-sm bg-muted text-muted-foreground">—</div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between">
        <Link
          href={`/jogos/${game.id}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todas as odds →
        </Link>
        {best[game.home_team] && (
          <a
            href={getAffiliateLink(best[game.home_team].bookmaker as Bookmaker, 'game-card')}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            Apostar
          </a>
        )}
      </div>
    </div>
  )
}
