import { LEAGUE_IDS, FOTMOB_LEAGUE_LOGO } from '@/lib/football-api'
import { SPORTS } from '@/lib/odds-api'

export interface LeagueConfig {
  slug: string
  name: string
  country: string
  leagueId: number
  sportKey: string
  logo: string
}

export const LEAGUES_CONFIG: LeagueConfig[] = [
  {
    slug:      'brasileirao-a',
    name:      'Brasileirão Série A',
    country:   'Brasil',
    leagueId:  LEAGUE_IDS.BRASILEIRAO_A,
    sportKey:  SPORTS.BRASILEIRAO_A,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.BRASILEIRAO_A),
  },
  {
    slug:      'brasileirao-b',
    name:      'Brasileirão Série B',
    country:   'Brasil',
    leagueId:  LEAGUE_IDS.BRASILEIRAO_B,
    sportKey:  SPORTS.BRASILEIRAO_B,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.BRASILEIRAO_B),
  },
  {
    slug:      'libertadores',
    name:      'Copa Libertadores',
    country:   'América do Sul',
    leagueId:  LEAGUE_IDS.LIBERTADORES,
    sportKey:  SPORTS.LIBERTADORES,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.LIBERTADORES),
  },
  {
    slug:      'sul-americana',
    name:      'Copa Sul-Americana',
    country:   'América do Sul',
    leagueId:  LEAGUE_IDS.SUL_AMERICANA,
    sportKey:  SPORTS.SUL_AMERICANA,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.SUL_AMERICANA),
  },
  {
    slug:      'champions',
    name:      'Champions League',
    country:   'Europa',
    leagueId:  LEAGUE_IDS.CHAMPIONS_LEAGUE,
    sportKey:  SPORTS.CHAMPIONS_LEAGUE,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.CHAMPIONS_LEAGUE),
  },
  {
    slug:      'europa-league',
    name:      'Europa League',
    country:   'Europa',
    leagueId:  LEAGUE_IDS.EUROPA_LEAGUE,
    sportKey:  SPORTS.EUROPA_LEAGUE,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.EUROPA_LEAGUE),
  },
  {
    slug:      'premier-league',
    name:      'Premier League',
    country:   'Inglaterra',
    leagueId:  LEAGUE_IDS.PREMIER_LEAGUE,
    sportKey:  SPORTS.PREMIER_LEAGUE,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.PREMIER_LEAGUE),
  },
  {
    slug:      'la-liga',
    name:      'La Liga',
    country:   'Espanha',
    leagueId:  LEAGUE_IDS.LA_LIGA,
    sportKey:  SPORTS.LA_LIGA,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.LA_LIGA),
  },
  {
    slug:      'serie-a',
    name:      'Serie A',
    country:   'Itália',
    leagueId:  LEAGUE_IDS.SERIE_A,
    sportKey:  SPORTS.SERIE_A,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.SERIE_A),
  },
  {
    slug:      'bundesliga',
    name:      'Bundesliga',
    country:   'Alemanha',
    leagueId:  LEAGUE_IDS.BUNDESLIGA,
    sportKey:  SPORTS.BUNDESLIGA,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.BUNDESLIGA),
  },
  {
    slug:      'ligue-1',
    name:      'Ligue 1',
    country:   'França',
    leagueId:  LEAGUE_IDS.LIGUE_1,
    sportKey:  SPORTS.LIGUE_1,
    logo:      FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.LIGUE_1),
  },
]

export const LEAGUES_BY_SLUG = Object.fromEntries(
  LEAGUES_CONFIG.map((l) => [l.slug, l])
) as Record<string, LeagueConfig>
