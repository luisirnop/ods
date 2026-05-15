import { FOTMOB_TEAM_LOGO, LEAGUE_IDS } from '@/lib/football-api'

export interface TeamConfig {
  slug: string
  name: string
  fotmobId: number
  leagueSlug: string
  leagueId: number
  logo: string
}

const team = (
  slug: string,
  name: string,
  fotmobId: number,
  leagueSlug: string,
  leagueId: number,
): TeamConfig => ({ slug, name, fotmobId, leagueSlug, leagueId, logo: FOTMOB_TEAM_LOGO(fotmobId) })

export const TEAMS_CONFIG: TeamConfig[] = [
  // ── Brasileirão Série A ─────────────────────────────────────────────────────
  team('flamengo',      'Flamengo',              9770,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('palmeiras',     'Palmeiras',             10283,  'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('corinthians',   'Corinthians',           9808,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('sao-paulo',     'São Paulo',             10277,  'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('atletico-mg',   'Atlético-MG',           10272,  'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('fluminense',    'Fluminense',            9863,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('internacional', 'Internacional',         8702,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('gremio',        'Grêmio',                9769,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('botafogo',      'Botafogo',              8517,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('vasco',         'Vasco da Gama',         10276,  'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('santos',        'Santos',                8514,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('cruzeiro',      'Cruzeiro',              9781,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('bahia',         'Bahia',                 7877,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('athletico-pr',  'Athletico Paranaense',  10273,  'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('bragantino',    'Red Bull Bragantino',   109705, 'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('fortaleza',     'Fortaleza',             8287,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('vitoria',       'Vitória',               7733,   'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  team('mirassol',      'Mirassol',              163782, 'brasileirao-a', LEAGUE_IDS.BRASILEIRAO_A),
  // ── Premier League ──────────────────────────────────────────────────────────
  team('arsenal',           'Arsenal',           9825,  'premier-league', LEAGUE_IDS.PREMIER_LEAGUE),
  team('chelsea',           'Chelsea',           8455,  'premier-league', LEAGUE_IDS.PREMIER_LEAGUE),
  team('liverpool',         'Liverpool',         8650,  'premier-league', LEAGUE_IDS.PREMIER_LEAGUE),
  team('manchester-city',   'Manchester City',   8456,  'premier-league', LEAGUE_IDS.PREMIER_LEAGUE),
  team('manchester-united', 'Manchester United', 10260, 'premier-league', LEAGUE_IDS.PREMIER_LEAGUE),
  team('tottenham',         'Tottenham Hotspur', 8586,  'premier-league', LEAGUE_IDS.PREMIER_LEAGUE),
  // ── La Liga ─────────────────────────────────────────────────────────────────
  team('real-madrid',    'Real Madrid',     8633, 'la-liga', LEAGUE_IDS.LA_LIGA),
  team('barcelona',      'Barcelona',       8634, 'la-liga', LEAGUE_IDS.LA_LIGA),
  team('atletico-madrid','Atlético Madrid', 9906, 'la-liga', LEAGUE_IDS.LA_LIGA),
  // ── Bundesliga ──────────────────────────────────────────────────────────────
  team('bayern', 'Bayern München', 9823, 'bundesliga', LEAGUE_IDS.BUNDESLIGA),
  // ── Ligue 1 ─────────────────────────────────────────────────────────────────
  team('psg', 'Paris Saint-Germain', 8871, 'ligue-1', LEAGUE_IDS.LIGUE_1),
]

export const TEAMS_BY_SLUG = Object.fromEntries(
  TEAMS_CONFIG.map((t) => [t.slug, t])
) as Record<string, TeamConfig>
