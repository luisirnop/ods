import Link from 'next/link'
import type { OddsGame } from '@/types'
import { getBestOdds } from '@/lib/odds-api'
import { getAffiliateLink, type Bookmaker } from '@/lib/affiliates'
import { cn } from '@/lib/utils'
import TeamBadge from '@/components/ui/TeamBadge'

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

function isLive(isoDate: string) {
  const start = new Date(isoDate).getTime()
  const now = Date.now()
  return now >= start && now <= start + 110 * 60 * 1000
}

interface Props {
  game: OddsGame
}

export default function GameCard({ game }: Props) {
  const best = getBestOdds(game, 'h2h')
  const live = isLive(game.commence_time)

  const outcomes = [
    { label: '1', fullLabel: game.home_team, key: game.home_team },
    { label: 'X', fullLabel: 'Empate', key: 'Draw' },
    { label: '2', fullLabel: game.away_team, key: game.away_team },
  ]

  const prices = Object.values(best).map((b) => b.price)
  const bestPrice = prices.length > 0 ? Math.max(...prices) : 0

  const bestBookmaker = best[game.home_team]?.bookmaker as Bookmaker | undefined

  return (
    <div className="card-hover rounded-xl border border-white/8 bg-card p-4 flex flex-col gap-3">
      {/* Header: liga + horário */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[55%]">
          {game.sport_title}
        </span>
        {live ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-red-400">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            AO VIVO
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            {formatDate(game.commence_time)} · {formatTime(game.commence_time)}
          </span>
        )}
      </div>

      {/* Times */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TeamBadge team={game.home_team} size="sm" />
          <span className="text-sm font-semibold text-white leading-tight truncate">
            {game.home_team}
          </span>
        </div>

        <span className="text-xs font-bold text-muted-foreground/50 shrink-0">VS</span>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-semibold text-white leading-tight truncate text-right">
            {game.away_team}
          </span>
          <TeamBadge team={game.away_team} size="sm" />
        </div>
      </div>

      {/* Odds */}
      <div className="grid grid-cols-3 gap-2">
        {outcomes.map(({ label, fullLabel, key }) => {
          const data = best[key]
          const isBest = data?.price === bestPrice && bestPrice > 0
          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
              <div
                className={cn(
                  'w-full rounded-lg px-2 py-2 text-center text-sm font-bold tabular-nums transition-all',
                  data
                    ? isBest
                      ? 'bg-green-500/15 text-green-400 border border-green-500/40 neon-glow-sm'
                      : 'bg-white/5 text-white/80 border border-white/8 hover:border-white/15'
                    : 'bg-white/3 text-muted-foreground/40 border border-transparent'
                )}
                title={fullLabel}
              >
                {data ? data.price.toFixed(2) : '—'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Rodapé: casa da melhor odd + CTA */}
      <div className="flex items-center justify-between pt-0.5">
        <Link
          href={`/jogos/${game.id}`}
          className="text-[11px] text-muted-foreground hover:text-green-500 transition-colors"
        >
          Ver todas as odds →
        </Link>
        {bestBookmaker && (
          <a
            href={getAffiliateLink(bestBookmaker, 'game-card')}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center rounded-lg bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-1.5 transition-colors neon-glow-sm"
          >
            Apostar
          </a>
        )}
      </div>
    </div>
  )
}
