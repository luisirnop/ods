import type { OddsGame } from '@/types'

export interface ValueBet {
  bookmakerKey: string
  bookmakerTitle: string
  market: string
  outcomeName: string
  odds: number
  fairOdds: number
  valuePercent: number
}

export interface ValueBetResult {
  hasValueBets: boolean
  valueBets: ValueBet[]
}

function marginAdjustedProbs(
  outcomes: { name: string; price: number }[]
): Record<string, number> {
  const overround = outcomes.reduce((sum, o) => sum + 1 / o.price, 0)
  const result: Record<string, number> = {}
  for (const o of outcomes) {
    result[o.name] = 1 / o.price / overround
  }
  return result
}

export function detectValueBets(
  game: OddsGame,
  marketKey: 'h2h' | 'totals' = 'h2h'
): ValueBetResult {
  type BmEntry = {
    key: string
    title: string
    outcomes: { name: string; price: number }[]
  }

  const probsByOutcome: Record<string, number[]> = {}
  const bookmakerEntries: BmEntry[] = []

  for (const bm of game.bookmakers) {
    const mkt = bm.markets.find((m) => m.key === marketKey)
    if (!mkt || mkt.outcomes.length < 2) continue

    const probs = marginAdjustedProbs(mkt.outcomes)
    for (const [name, prob] of Object.entries(probs)) {
      if (!probsByOutcome[name]) probsByOutcome[name] = []
      probsByOutcome[name].push(prob)
    }

    bookmakerEntries.push({
      key: bm.key,
      title: bm.title,
      outcomes: mkt.outcomes.map((o) => ({ name: o.name, price: o.price })),
    })
  }

  // Precisamos de ao menos 2 casas para ter um consenso confiável
  if (bookmakerEntries.length < 2) {
    return { hasValueBets: false, valueBets: [] }
  }

  // Probabilidade de consenso = média ajustada entre todas as casas
  const consensusProb: Record<string, number> = {}
  for (const [name, probs] of Object.entries(probsByOutcome)) {
    consensusProb[name] = probs.reduce((a, b) => a + b, 0) / probs.length
  }

  // Odd justa = 1 / probabilidade de consenso
  const fairOdds: Record<string, number> = {}
  for (const [name, prob] of Object.entries(consensusProb)) {
    fairOdds[name] = 1 / prob
  }

  const VALUE_THRESHOLD = 2 // mínimo 2% de edge
  const valueBets: ValueBet[] = []

  for (const bm of bookmakerEntries) {
    for (const outcome of bm.outcomes) {
      const fair = fairOdds[outcome.name]
      if (!fair) continue
      const valuePercent = (outcome.price / fair - 1) * 100
      if (valuePercent >= VALUE_THRESHOLD) {
        valueBets.push({
          bookmakerKey: bm.key,
          bookmakerTitle: bm.title,
          market: marketKey,
          outcomeName: outcome.name,
          odds: outcome.price,
          fairOdds: fair,
          valuePercent,
        })
      }
    }
  }

  valueBets.sort((a, b) => b.valuePercent - a.valuePercent)

  return { hasValueBets: valueBets.length > 0, valueBets }
}
