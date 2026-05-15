import type { OddsGame } from '@/types'

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

export const SPORTS = {
  BRASILEIRAO_A:    'soccer_brazil_campeonato',
  BRASILEIRAO_B:    'soccer_brazil_serie_b',
  LIBERTADORES:     'soccer_conmebol_copa_libertadores',
  SUL_AMERICANA:    'soccer_conmebol_copa_sudamericana',
  PREMIER_LEAGUE:   'soccer_epl',
  CHAMPIONS_LEAGUE: 'soccer_uefa_champs_league',
  EUROPA_LEAGUE:    'soccer_uefa_europa_league',
  LA_LIGA:          'soccer_spain_la_liga',
  SERIE_A:          'soccer_italy_serie_a',
  BUNDESLIGA:       'soccer_germany_bundesliga',
  LIGUE_1:          'soccer_france_ligue_one',
  WORLD_CUP:        'soccer_fifa_world_cup',
  LIGA_MX:          'soccer_mexico_ligamx',
  ARGENTINA:        'soccer_argentina_primera_division',
} as const

export type SportKey = (typeof SPORTS)[keyof typeof SPORTS]

const VALID_SPORT_KEYS = new Set<string>(Object.values(SPORTS))

export function isSportKey(s: string): s is SportKey {
  return VALID_SPORT_KEYS.has(s)
}

export async function getOdds(sport: SportKey = SPORTS.BRASILEIRAO_A): Promise<OddsGame[]> {
  const apiKey = process.env.THE_ODDS_API_KEY
  if (!apiKey) throw new Error('THE_ODDS_API_KEY não configurada')

  const url = new URL(`${ODDS_API_BASE}/sports/${sport}/odds`)
  url.searchParams.set('apiKey', apiKey)
  url.searchParams.set('regions', 'eu,uk')
  url.searchParams.set('markets', 'h2h,totals')
  url.searchParams.set('oddsFormat', 'decimal')

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error(`Odds API error: ${response.statusText}`)
  }

  return response.json()
}

export function getBestOdds(game: OddsGame, market: 'h2h' | 'totals' = 'h2h') {
  const allOutcomes: Record<string, { price: number; bookmaker: string }[]> = {}

  for (const bookmaker of game.bookmakers) {
    const mkt = bookmaker.markets.find((m) => m.key === market)
    if (!mkt) continue

    for (const outcome of mkt.outcomes) {
      if (!allOutcomes[outcome.name]) allOutcomes[outcome.name] = []
      allOutcomes[outcome.name].push({ price: outcome.price, bookmaker: bookmaker.key })
    }
  }

  const best: Record<string, { price: number; bookmaker: string }> = {}
  for (const [name, prices] of Object.entries(allOutcomes)) {
    best[name] = prices.reduce((a, b) => (a.price >= b.price ? a : b))
  }

  return best
}
