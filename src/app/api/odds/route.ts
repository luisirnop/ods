import { NextRequest, NextResponse } from 'next/server'

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'
const CACHE_SECONDS = 300 // 5 minutos

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport') ?? 'soccer_brazil_campeonato'
  const regions = searchParams.get('regions') ?? 'br,eu'
  const markets = searchParams.get('markets') ?? 'h2h,totals'

  const apiKey = process.env.THE_ODDS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'THE_ODDS_API_KEY não configurada' }, { status: 500 })
  }

  const url = new URL(`${ODDS_API_BASE}/sports/${sport}/odds`)
  url.searchParams.set('apiKey', apiKey)
  url.searchParams.set('regions', regions)
  url.searchParams.set('markets', markets)
  url.searchParams.set('oddsFormat', 'decimal')

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: CACHE_SECONDS },
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({ error: `Odds API error: ${text}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=60`,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar odds:', error)
    return NextResponse.json({ error: 'Erro ao buscar odds' }, { status: 500 })
  }
}
