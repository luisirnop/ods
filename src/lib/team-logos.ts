export interface TeamBrand {
  bg: string
  text: string
  short: string
  logo?: string
}

// Logos via Fotmob (alta qualidade, mesmos IDs da football-api.ts)
const FOTMOB = (id: number) =>
  `https://images.fotmob.com/image_resources/logo/teamlogo/${id}_large.png`

// Bandeiras nacionais via flagcdn.com
const FLAG = (code: string) =>
  `https://flagcdn.com/w80/${code}.png`

export const TEAM_BRANDS: Record<string, TeamBrand> = {
  // ── Brasileirão (IDs reais do Fotmob) ────────────────────────────────────
  Flamengo:              { bg: '#E8000D', text: '#fff', short: 'FLA', logo: FOTMOB(9770)   },
  Palmeiras:             { bg: '#006437', text: '#fff', short: 'PAL', logo: FOTMOB(10283)  },
  Corinthians:           { bg: '#1a1a1a', text: '#fff', short: 'COR', logo: FOTMOB(9808)   },
  'São Paulo':           { bg: '#CC0000', text: '#fff', short: 'SPF', logo: FOTMOB(10277)  },
  'Atlético-MG':         { bg: '#000000', text: '#fff', short: 'CAM', logo: FOTMOB(10272)  },
  'Atletico MG':         { bg: '#000000', text: '#fff', short: 'CAM', logo: FOTMOB(10272)  },
  Fluminense:            { bg: '#6B1E3C', text: '#fff', short: 'FLU', logo: FOTMOB(9863)   },
  Internacional:         { bg: '#CC0000', text: '#fff', short: 'INT', logo: FOTMOB(8702)   },
  Grêmio:                { bg: '#0533A0', text: '#fff', short: 'GRE', logo: FOTMOB(9769)   },
  Gremio:                { bg: '#0533A0', text: '#fff', short: 'GRE', logo: FOTMOB(9769)   },
  'Botafogo RJ':         { bg: '#1a1a1a', text: '#fff', short: 'BOT', logo: FOTMOB(8517)   },
  Botafogo:              { bg: '#1a1a1a', text: '#fff', short: 'BOT', logo: FOTMOB(8517)   },
  'Vasco da Gama':       { bg: '#1a1a1a', text: '#fff', short: 'VAS', logo: FOTMOB(10276)  },
  Vasco:                 { bg: '#1a1a1a', text: '#fff', short: 'VAS', logo: FOTMOB(10276)  },
  'Santos FC':           { bg: '#1a1a1a', text: '#fff', short: 'SAN', logo: FOTMOB(8514)   },
  Santos:                { bg: '#1a1a1a', text: '#fff', short: 'SAN', logo: FOTMOB(8514)   },
  Cruzeiro:              { bg: '#0032A0', text: '#fff', short: 'CRU', logo: FOTMOB(9781)   },
  Bahia:                 { bg: '#003087', text: '#fff', short: 'BAH', logo: FOTMOB(7877)   },
  'Athletico Paranaense':{ bg: '#CC0000', text: '#fff', short: 'CAP', logo: FOTMOB(10273)  },
  'Atletico Paranaense': { bg: '#CC0000', text: '#fff', short: 'CAP', logo: FOTMOB(10273)  },
  'Athletico PR':        { bg: '#CC0000', text: '#fff', short: 'CAP', logo: FOTMOB(10273)  },
  'Red Bull Bragantino': { bg: '#CC0000', text: '#fff', short: 'RBB', logo: FOTMOB(109705) },
  'Bragantino-SP':       { bg: '#CC0000', text: '#fff', short: 'RBB', logo: FOTMOB(109705) },
  Bragantino:            { bg: '#CC0000', text: '#fff', short: 'RBB', logo: FOTMOB(109705) },
  Coritiba:              { bg: '#005522', text: '#fff', short: 'CFC', logo: FOTMOB(9767)   },
  Vitoria:               { bg: '#CC0000', text: '#fff', short: 'VIT', logo: FOTMOB(7733)   },
  Vitória:               { bg: '#CC0000', text: '#fff', short: 'VIT', logo: FOTMOB(7733)   },
  Mirassol:              { bg: '#FFD700', text: '#000', short: 'MIR', logo: FOTMOB(163782) },
  Remo:                  { bg: '#003087', text: '#fff', short: 'REM', logo: FOTMOB(1626)   },
  Chapecoense:           { bg: '#006437', text: '#fff', short: 'CHA', logo: FOTMOB(197693) },
  'Chapecoense AF':      { bg: '#006437', text: '#fff', short: 'CHA', logo: FOTMOB(197693) },
  Fortaleza:             { bg: '#0033A0', text: '#fff', short: 'FOR', logo: FOTMOB(8287)   },

  // ── Premier League ───────────────────────────────────────────────────────
  Arsenal:               { bg: '#EF0107', text: '#fff', short: 'ARS', logo: FOTMOB(9825)  },
  Chelsea:               { bg: '#034694', text: '#fff', short: 'CHE', logo: FOTMOB(8455)  },
  Liverpool:             { bg: '#C8102E', text: '#fff', short: 'LIV', logo: FOTMOB(8650)  },
  'Manchester City':     { bg: '#6CABDD', text: '#fff', short: 'MCI', logo: FOTMOB(8456)  },
  'Manchester United':   { bg: '#DA291C', text: '#fff', short: 'MUN', logo: FOTMOB(10260) },
  Tottenham:             { bg: '#132257', text: '#fff', short: 'TOT', logo: FOTMOB(8586)  },
  'Tottenham Hotspur':   { bg: '#132257', text: '#fff', short: 'TOT', logo: FOTMOB(8586)  },

  // ── La Liga / Champions ──────────────────────────────────────────────────
  'Real Madrid':         { bg: '#FEBE10', text: '#00529F', short: 'RMA', logo: FOTMOB(8633) },
  Barcelona:             { bg: '#A50044', text: '#fff',    short: 'BAR', logo: FOTMOB(8634) },
  'Atlético Madrid':     { bg: '#CB3524', text: '#fff',    short: 'ATM', logo: FOTMOB(9906) },
  'Bayern München':      { bg: '#DC052D', text: '#fff',    short: 'BAY', logo: FOTMOB(9823) },
  'Bayern Munchen':      { bg: '#DC052D', text: '#fff',    short: 'BAY', logo: FOTMOB(9823) },

  // ── Ligue 1 ──────────────────────────────────────────────────────────────
  'Paris Saint-Germain': { bg: '#003087', text: '#fff', short: 'PSG', logo: FOTMOB(8871) },
  PSG:                   { bg: '#003087', text: '#fff', short: 'PSG', logo: FOTMOB(8871) },

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
