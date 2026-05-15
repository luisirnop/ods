const BASE = 'https://free-api-live-football-data.p.rapidapi.com'

const headers = () => ({
  'x-rapidapi-key': process.env.API_FOOTBALL_KEY ?? '',
  'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
})

export const FOTMOB_TEAM_LOGO = (id: number) =>
  `https://images.fotmob.com/image_resources/logo/teamlogo/${id}_large.png`

export const FOTMOB_LEAGUE_LOGO = (id: number) =>
  `https://images.fotmob.com/image_resources/logo/leaguelogo/dark/${id}.png`

// IDs das ligas no Fotmob/API
export const LEAGUE_IDS = {
  BRASILEIRAO_A:    268,
  BRASILEIRAO_B:    8814,
  LIBERTADORES:     45,
  SUL_AMERICANA:    299,
  CHAMPIONS_LEAGUE: 42,
  EUROPA_LEAGUE:    73,
  PREMIER_LEAGUE:   47,
  LA_LIGA:          87,
  SERIE_A:          55,
  BUNDESLIGA:       54,
  LIGUE_1:          53,
  WORLD_CUP:        77,
} as const

export interface StandingTeam {
  rank: number
  id: number
  name: string
  played: number
  wins: number
  draws: number
  losses: number
  goals: string      // "25-12"
  goalDiff: number
  points: number
  qualColor: string | null
}

export interface LiveMatch {
  id: number
  leagueId: number
  home: { id: number; name: string; score: number }
  away: { id: number; name: string; score: number }
  status: { scoreStr: string; ongoing: boolean; finished: boolean; liveTime?: { long: string } }
  time: string
}

async function fetchApi<T>(path: string): Promise<T | null> {
  const key = process.env.API_FOOTBALL_KEY
  if (!key) return null
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: headers(),
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json = await res.json()
    if (json.status === 'failed') return null
    return json.response as T
  } catch {
    return null
  }
}

export async function getStandings(leagueId: number): Promise<StandingTeam[]> {
  const data = await fetchApi<{ standing: Record<string, unknown>[] }>(
    `/football-get-standing-all?leagueid=${leagueId}`
  )
  if (!data?.standing) return []

  return data.standing.map((t) => ({
    rank:     (t.idx as number),
    id:       (t.id as number),
    name:     (t.name as string),
    played:   (t.played as number),
    wins:     (t.wins as number),
    draws:    (t.draws as number),
    losses:   (t.losses as number),
    goals:    (t.scoresStr as string),
    goalDiff: (t.goalConDiff as number),
    points:   (t.pts as number),
    qualColor:(t.qualColor as string | null),
  }))
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
  const data = await fetchApi<{ live: Record<string, unknown>[] }>('/football-current-live')
  if (!data?.live) return []

  return data.live.map((m) => {
    const home = m.home as Record<string, unknown>
    const away = m.away as Record<string, unknown>
    const status = m.status as Record<string, unknown>
    return {
      id:       (m.id as number),
      leagueId: (m.leagueId as number),
      home: { id: home.id as number, name: home.name as string, score: home.score as number },
      away: { id: away.id as number, name: away.name as string, score: away.score as number },
      status: {
        scoreStr: (status.scoreStr as string) ?? '0 - 0',
        ongoing:  Boolean(status.ongoing),
        finished: Boolean(status.finished),
        liveTime: status.liveTime as { long: string } | undefined,
      },
      time: (m.time as string),
    }
  })
}

export async function getTeamLogoUrl(teamId: number): Promise<string | null> {
  const data = await fetchApi<{ url: string }>(`/football-team-logo?teamid=${teamId}`)
  return data?.url ?? null
}
