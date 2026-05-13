const API_BASE = 'https://api-football-v1.p.rapidapi.com/v3'

const headers = {
  'X-RapidAPI-Key': process.env.API_FOOTBALL_KEY ?? '',
  'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
}

export interface Fixture {
  fixture: {
    id: number
    date: string
    status: { long: string; short: string; elapsed: number | null }
  }
  league: { id: number; name: string; country: string; logo: string; round: string }
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null }
    away: { id: number; name: string; logo: string; winner: boolean | null }
  }
  goals: { home: number | null; away: number | null }
}

export async function getFixturesByDate(date: string): Promise<Fixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) throw new Error('API_FOOTBALL_KEY não configurada')

  const url = new URL(`${API_BASE}/fixtures`)
  url.searchParams.set('date', date)

  const response = await fetch(url.toString(), {
    headers,
    next: { revalidate: 300 },
  })

  if (!response.ok) throw new Error(`API-Football error: ${response.statusText}`)

  const json = await response.json()
  return json.response ?? []
}

export async function getFixtureById(id: number): Promise<Fixture | null> {
  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) throw new Error('API_FOOTBALL_KEY não configurada')

  const url = new URL(`${API_BASE}/fixtures`)
  url.searchParams.set('id', String(id))

  const response = await fetch(url.toString(), { headers })
  if (!response.ok) throw new Error(`API-Football error: ${response.statusText}`)

  const json = await response.json()
  return json.response?.[0] ?? null
}

export async function getHeadToHead(h2h: string): Promise<Fixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) throw new Error('API_FOOTBALL_KEY não configurada')

  const url = new URL(`${API_BASE}/fixtures/headtohead`)
  url.searchParams.set('h2h', h2h)
  url.searchParams.set('last', '5')

  const response = await fetch(url.toString(), { headers, next: { revalidate: 3600 } })
  if (!response.ok) throw new Error(`API-Football error: ${response.statusText}`)

  const json = await response.json()
  return json.response ?? []
}
