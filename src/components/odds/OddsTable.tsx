import { getAffiliateLink, type Bookmaker } from '@/lib/affiliates'
import { cn } from '@/lib/utils'
import type { OddsGame } from '@/types'

interface Props {
  game: OddsGame
  market?: 'h2h' | 'totals'
}

export default function OddsTable({ game, market = 'h2h' }: Props) {
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

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground w-40">Casa</th>
            {outcomes.map((name) => (
              <th key={name} className="text-center px-4 py-3 font-medium text-muted-foreground">
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
              <tr key={bookmaker.key} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
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

                  return (
                    <td key={outcomeName} className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-lg px-2.5 py-1 font-bold tabular-nums',
                          isBest
                            ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                            : 'text-foreground'
                        )}
                      >
                        {outcome.price.toFixed(2)}
                      </span>
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
  )
}
