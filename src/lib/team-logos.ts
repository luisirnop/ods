export interface TeamBrand {
  bg: string
  text: string
  short: string
  logo?: string
}

// Logos de clubes via media.api-sports.io (CDN público, sem API key)
// IDs: https://www.api-football.com/documentation-v3#tag/Teams
const API_SPORTS = (id: number) =>
  `https://media.api-sports.io/football/teams/${id}.png`

// Bandeiras nacionais via flagcdn.com
const FLAG = (code: string) =>
  `https://flagcdn.com/w80/${code}.png`

export const TEAM_BRANDS: Record<string, TeamBrand> = {
  // ── Brasileirão ──────────────────────────────────────────────────────────
  Flamengo:        { bg: '#E8000D', text: '#fff', short: 'FLA', logo: API_SPORTS(127)  },
  Palmeiras:       { bg: '#006437', text: '#fff', short: 'PAL', logo: API_SPORTS(121)  },
  Corinthians:     { bg: '#1a1a1a', text: '#fff', short: 'COR', logo: API_SPORTS(131)  },
  'São Paulo':     { bg: '#CC0000', text: '#fff', short: 'SPF', logo: API_SPORTS(126)  },
  'Atlético-MG':   { bg: '#000000', text: '#fff', short: 'CAM', logo: API_SPORTS(128)  },
  Fluminense:      { bg: '#6B1E3C', text: '#fff', short: 'FLU', logo: API_SPORTS(130)  },
  Internacional:   { bg: '#CC0000', text: '#fff', short: 'INT', logo: API_SPORTS(119)  },
  Grêmio:          { bg: '#0533A0', text: '#fff', short: 'GRE', logo: API_SPORTS(120)  },
  Botafogo:        { bg: '#1a1a1a', text: '#fff', short: 'BOT', logo: API_SPORTS(129)  },
  Vasco:           { bg: '#1a1a1a', text: '#fff', short: 'VAS', logo: API_SPORTS(1062) },
  Santos:          { bg: '#1a1a1a', text: '#fff', short: 'SAN', logo: API_SPORTS(137)  },
  Cruzeiro:        { bg: '#0032A0', text: '#fff', short: 'CRU', logo: API_SPORTS(141)  },
  Bahia:           { bg: '#003087', text: '#fff', short: 'BAH', logo: API_SPORTS(118)  },
  Athletico:       { bg: '#CC0000', text: '#fff', short: 'CAP', logo: API_SPORTS(136)  },
  Bragantino:      { bg: '#CC0000', text: '#fff', short: 'RBB', logo: API_SPORTS(10253)},
  Fortaleza:       { bg: '#0033A0', text: '#fff', short: 'FOR', logo: API_SPORTS(134)  },
  Goiás:           { bg: '#005522', text: '#fff', short: 'GOI', logo: API_SPORTS(133)  },

  // ── Premier League ───────────────────────────────────────────────────────
  Arsenal:              { bg: '#EF0107', text: '#fff', short: 'ARS', logo: API_SPORTS(42)  },
  Chelsea:              { bg: '#034694', text: '#fff', short: 'CHE', logo: API_SPORTS(49)  },
  Liverpool:            { bg: '#C8102E', text: '#fff', short: 'LIV', logo: API_SPORTS(40)  },
  'Manchester City':    { bg: '#6CABDD', text: '#fff', short: 'MCI', logo: API_SPORTS(50)  },
  'Manchester United':  { bg: '#DA291C', text: '#fff', short: 'MUN', logo: API_SPORTS(33)  },
  Tottenham:            { bg: '#132257', text: '#fff', short: 'TOT', logo: API_SPORTS(47)  },

  // ── La Liga / Champions ──────────────────────────────────────────────────
  'Real Madrid':        { bg: '#FEBE10', text: '#00529F', short: 'RMA', logo: API_SPORTS(541) },
  Barcelona:            { bg: '#A50044', text: '#fff',    short: 'BAR', logo: API_SPORTS(529) },
  'Atlético Madrid':    { bg: '#CB3524', text: '#fff',    short: 'ATM', logo: API_SPORTS(530) },

  // ── Ligue 1 ──────────────────────────────────────────────────────────────
  'Paris Saint-Germain': { bg: '#003087', text: '#fff', short: 'PSG', logo: API_SPORTS(85)  },

  // ── Bundesliga ───────────────────────────────────────────────────────────
  'Bayern Munich':  { bg: '#DC052D', text: '#fff', short: 'BAY', logo: API_SPORTS(157) },
  Borussia:         { bg: '#FDE100', text: '#000', short: 'BVB', logo: API_SPORTS(165) },

  // ── Seleções nacionais (Copa 2026) ───────────────────────────────────────
  Brasil:           { bg: '#009C3B', text: '#FFDF00', short: 'BRA', logo: FLAG('br') },
  Argentina:        { bg: '#74ACDF', text: '#fff',    short: 'ARG', logo: FLAG('ar') },
  França:           { bg: '#003189', text: '#fff',    short: 'FRA', logo: FLAG('fr') },
  Inglaterra:       { bg: '#CF091E', text: '#fff',    short: 'ENG', logo: FLAG('gb-eng') },
  Alemanha:         { bg: '#1a1a1a', text: '#fff',    short: 'GER', logo: FLAG('de') },
  Espanha:          { bg: '#C60B1E', text: '#F1BF00', short: 'ESP', logo: FLAG('es') },
  Portugal:         { bg: '#006600', text: '#fff',    short: 'POR', logo: FLAG('pt') },
  Uruguai:          { bg: '#5EB6E4', text: '#fff',    short: 'URU', logo: FLAG('uy') },
  Marrocos:         { bg: '#C1272D', text: '#006233', short: 'MAR', logo: FLAG('ma') },
  Japão:            { bg: '#BC002D', text: '#fff',    short: 'JPN', logo: FLAG('jp') },
  'Estados Unidos': { bg: '#002868', text: '#fff',    short: 'USA', logo: FLAG('us') },
  México:           { bg: '#006847', text: '#fff',    short: 'MEX', logo: FLAG('mx') },
  Colômbia:         { bg: '#FCD116', text: '#003087', short: 'COL', logo: FLAG('co') },
  Holanda:          { bg: '#FF6600', text: '#fff',    short: 'HOL', logo: FLAG('nl') },
  Bélgica:          { bg: '#ED2939', text: '#000',    short: 'BEL', logo: FLAG('be') },
  Croácia:          { bg: '#FF0000', text: '#fff',    short: 'CRO', logo: FLAG('hr') },
  Senegal:          { bg: '#00853F', text: '#fff',    short: 'SEN', logo: FLAG('sn') },
  Austrália:        { bg: '#00008B', text: '#fff',    short: 'AUS', logo: FLAG('au') },
  Itália:           { bg: '#009246', text: '#fff',    short: 'ITA', logo: FLAG('it') },
}

export function getTeamBrand(teamName: string): TeamBrand {
  if (TEAM_BRANDS[teamName]) return TEAM_BRANDS[teamName]

  const partial = Object.entries(TEAM_BRANDS).find(
    ([key]) =>
      teamName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(teamName.toLowerCase()),
  )
  if (partial) return partial[1]

  const initials = teamName
    .split(/[\s-]/)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 3)

  const hash = teamName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue = hash % 360
  return { bg: `hsl(${hue}, 60%, 35%)`, text: '#fff', short: initials }
}
