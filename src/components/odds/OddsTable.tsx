import { getAffiliateLink, type Bookmaker } from '@/lib/affiliates'
import { cn } from '@/lib/utils'
import type { OddsGame } from '@/types'
import type { ValueBet } from '@/lib/value-bets'

interface Props {
  game: OddsGame
  market?: 'h2h' | 'totals'
  valueBets?: ValueBet[]
  isPremium?: boolean
}

export default function OddsTable({
  game,
  market = 'h2h',
  valueBets = [],
  isPremium = false,
}: Props) {
  // Coletar todas as odds por outcome
  const allOdds: Record<string, { price: number; bookmaker: string; bookmakerKey: string }[]> = {}

  for (const bookmaker of game.bookmakers) {
    const mkt = bookmaker.markets.find((m) => m.key === market)
    if (!mkt) continue

    for (const outcome of mkt.outcomes) {
      const name = market === 'totals' ? `${outcome.name} ${outcome.point ?? 2.5}` : outcome.name
      if (!allOdds[name]) allOdds[name] = []
      allOdds[name].push({ price: outcome.price, bookmaker: bookmaker.title, bookmakerKey: bookmaker.key })
    }
  }

  // Melhor odd por outcome
  const bestPerOutcome: Record<string, number> = {}
  for (const [name, odds] of Object.entries(allOdds)) {
    bestPerOutcome[name] = Math.max(...odds.map((o) => o.price))
  }

  const outcomes = Object.keys(allOdds)
  const bookmakers = game.bookmakers

  const hasValueBets = valueBets.length > 0

  return (
    <div className="space-y-2">
      {/* Banner de value bet para usuários free */}
      {!isPremium && hasValueBets && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-sm">
          <span className="text-amber-500">⚡</span>
          <span className="font-medium text-amber-700 dark:text-amber-400">
            Value bet detectado neste mercado
          </span>
          <a
            href="/premium"
            className="ml-auto text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors"
          >
            Ver com Premium →
          </a>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-[oklch(0.13_0.012_253)]">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-40 uppercase text-[11px] tracking-wide">Casa</th>
              {outcomes.map((name) => (
                <th key={name} className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase text-[11px] tracking-wide">
                  {name === 'Draw' ? 'Empate' : name}
                </th>
              ))}
              <th className="px-4 py-3 w-28" />
            </tr>
          </thead>
          <tbody>
            {bookmakers.map((bookmaker) => {
              const mkt = bookmaker.markets.find((m) => m.key === market)
              if (!mkt) return null

              return (
                <tr key={bookmaker.key} className="border-b border-white/5 last:border-0 odd:bg-[oklch(0.115_0.012_253)] even:bg-transparent hover:bg-[oklch(0.19_0.015_253)] transition-colors">
                  <td className="px-4 py-3 font-medium">{bookmaker.title}</td>

                  {outcomes.map((outcomeName) => {
                    const rawName = market === 'totals'
                      ? outcomeName.split(' ')[0]
                      : outcomeName

                    const outcome = mkt.outcomes.find((o) => {
                      if (market === 'totals') return o.name === rawName
                      return o.name === outcomeName
                    })

                    if (!outcome) {
                      return (
                        <td key={outcomeName} className="px-4 py-3 text-center text-muted-foreground">
                          —
                        </td>
                      )
                    }

                    const isBest = outcome.price === bestPerOutcome[outcomeName]

                    const matchingValue = isPremium
                      ? valueBets.find(
                          (vb) => vb.bookmakerKey === bookmaker.key && vb.outcomeName === rawName
                        )
                      : undefined

                    return (
                      <td key={outcomeName} className="px-4 py-3 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span
                            className={cn(
                              'inline-block rounded-lg px-2.5 py-1 font-bold tabular-nums',
                              matchingValue
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                                : isBest
                                ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                                : 'text-foreground'
                            )}
                          >
                            {outcome.price.toFixed(2)}
                          </span>
                          {matchingValue && (
                            <span className="text-[10px] font-semibold text-amber-500 leading-none">
                              ⚡ +{matchingValue.valuePercent.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}

                  <td className="px-4 py-3 text-right">
                    <a
                      href={getAffiliateLink(bookmaker.key as Bookmaker, 'odds-table')}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
                    >
                      Apostar
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
