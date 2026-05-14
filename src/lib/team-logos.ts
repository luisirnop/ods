export interface TeamBrand {
  bg: string
  text: string
  short: string
  logo?: string
}

// Cores oficiais + abreviações dos principais clubes brasileiros e europeus
// Logos do Wikimedia Commons (domínio público / CC-BY-SA)
export const TEAM_BRANDS: Record<string, TeamBrand> = {
  // Brasileirão
  Flamengo:      { bg: '#E8000D', text: '#fff', short: 'FLA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/160px-Flamengo_braz_logo.svg.png' },
  Palmeiras:     { bg: '#006437', text: '#fff', short: 'PAL', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/160px-Palmeiras_logo.svg.png' },
  Corinthians:   { bg: '#1a1a1a', text: '#fff', short: 'COR', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Corinthians_logo.svg/160px-Corinthians_logo.svg.png' },
  'São Paulo':   { bg: '#CC0000', text: '#fff', short: 'SPF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Coat_of_arms_of_S%C3%A3o_Paulo_FC.svg/160px-Coat_of_arms_of_S%C3%A3o_Paulo_FC.svg.png' },
  'Atlético-MG': { bg: '#000000', text: '#fff', short: 'CAM' },
  Cruzeiro:      { bg: '#0032A0', text: '#fff', short: 'CRU' },
  Vasco:         { bg: '#1a1a1a', text: '#fff', short: 'VAS' },
  Internacional: { bg: '#CC0000', text: '#fff', short: 'INT' },
  Grêmio:        { bg: '#0533A0', text: '#fff', short: 'GRE' },
  Santos:        { bg: '#1a1a1a', text: '#fff', short: 'SAN' },
  Botafogo:      { bg: '#1a1a1a', text: '#fff', short: 'BOT' },
  Fluminense:    { bg: '#6B1E3C', text: '#fff', short: 'FLU' },
  Bahia:         { bg: '#003087', text: '#fff', short: 'BAH' },
  Athletico:     { bg: '#CC0000', text: '#fff', short: 'CAP' },
  Bragantino:    { bg: '#CC0000', text: '#fff', short: 'RBB' },
  Fortaleza:     { bg: '#0033A0', text: '#fff', short: 'FOR' },
  Goiás:         { bg: '#005522', text: '#fff', short: 'GOI' },

  // Premier League
  Arsenal:          { bg: '#EF0107', text: '#fff', short: 'ARS' },
  Chelsea:          { bg: '#034694', text: '#fff', short: 'CHE' },
  Liverpool:        { bg: '#C8102E', text: '#fff', short: 'LIV' },
  'Manchester City':{ bg: '#6CABDD', text: '#fff', short: 'MCI' },
  'Manchester United':{ bg: '#DA291C', text: '#fff', short: 'MUN' },
  Tottenham:        { bg: '#132257', text: '#fff', short: 'TOT' },

  // La Liga / Champions
  'Real Madrid':    { bg: '#FEBE10', text: '#00529F', short: 'RMA' },
  Barcelona:        { bg: '#A50044', text: '#fff', short: 'BAR' },
  Atlético:         { bg: '#CB3524', text: '#fff', short: 'ATM' },

  // Ligue 1
  'Paris Saint-Germain': { bg: '#003087', text: '#fff', short: 'PSG' },

  // Bundesliga
  'Bayern Munich':  { bg: '#DC052D', text: '#fff', short: 'BAY' },
  Borussia:         { bg: '#FDE100', text: '#000', short: 'BVB' },

  // Copa
  Brasil:           { bg: '#009C3B', text: '#FFDF00', short: 'BRA' },
  Argentina:        { bg: '#74ACDF', text: '#fff', short: 'ARG' },
  França:           { bg: '#003189', text: '#fff', short: 'FRA' },
  Inglaterra:       { bg: '#CF091E', text: '#fff', short: 'ENG' },
  Alemanha:         { bg: '#1a1a1a', text: '#fff', short: 'GER' },
  Espanha:          { bg: '#C60B1E', text: '#F1BF00', short: 'ESP' },
  Portugal:         { bg: '#006600', text: '#fff', short: 'POR' },
  Uruguai:          { bg: '#5EB6E4', text: '#fff', short: 'URU' },
  Marrocos:         { bg: '#C1272D', text: '#006233', short: 'MAR' },
  Japão:            { bg: '#BC002D', text: '#fff', short: 'JPN' },
  'Estados Unidos': { bg: '#002868', text: '#fff', short: 'USA' },
  México:           { bg: '#006847', text: '#fff', short: 'MEX' },
  Colômbia:         { bg: '#FCD116', text: '#003087', short: 'COL' },
}

export function getTeamBrand(teamName: string): TeamBrand {
  if (TEAM_BRANDS[teamName]) return TEAM_BRANDS[teamName]

  // Busca parcial (ex: "Atlético-MG" encontra "Atlético")
  const partial = Object.entries(TEAM_BRANDS).find(([key]) =>
    teamName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(teamName.toLowerCase())
  )
  if (partial) return partial[1]

  // Fallback genérico
  const initials = teamName
    .split(/[\s-]/)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 3)

  // Gera cor a partir do nome (determinística)
  const hash = teamName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue = hash % 360
  return { bg: `hsl(${hue}, 60%, 35%)`, text: '#fff', short: initials }
}
