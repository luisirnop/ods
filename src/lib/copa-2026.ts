export interface CopaTeam {
  name: string
  flag: string
  confederation: 'CONMEBOL' | 'UEFA' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC'
}

export const COPA_TEAMS: CopaTeam[] = [
  // CONMEBOL
  { name: 'Brasil', flag: '🇧🇷', confederation: 'CONMEBOL' },
  { name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL' },
  { name: 'Uruguai', flag: '🇺🇾', confederation: 'CONMEBOL' },
  { name: 'Colômbia', flag: '🇨🇴', confederation: 'CONMEBOL' },
  { name: 'Equador', flag: '🇪🇨', confederation: 'CONMEBOL' },
  { name: 'Venezuela', flag: '🇻🇪', confederation: 'CONMEBOL' },
  // CONCACAF (incluindo anfitriões)
  { name: 'Estados Unidos', flag: '🇺🇸', confederation: 'CONCACAF' },
  { name: 'México', flag: '🇲🇽', confederation: 'CONCACAF' },
  { name: 'Canadá', flag: '🇨🇦', confederation: 'CONCACAF' },
  { name: 'Panamá', flag: '🇵🇦', confederation: 'CONCACAF' },
  { name: 'Costa Rica', flag: '🇨🇷', confederation: 'CONCACAF' },
  { name: 'Jamaica', flag: '🇯🇲', confederation: 'CONCACAF' },
  // UEFA
  { name: 'França', flag: '🇫🇷', confederation: 'UEFA' },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
  { name: 'Alemanha', flag: '🇩🇪', confederation: 'UEFA' },
  { name: 'Espanha', flag: '🇪🇸', confederation: 'UEFA' },
  { name: 'Portugal', flag: '🇵🇹', confederation: 'UEFA' },
  { name: 'Holanda', flag: '🇳🇱', confederation: 'UEFA' },
  { name: 'Bélgica', flag: '🇧🇪', confederation: 'UEFA' },
  { name: 'Itália', flag: '🇮🇹', confederation: 'UEFA' },
  { name: 'Croácia', flag: '🇭🇷', confederation: 'UEFA' },
  { name: 'Suíça', flag: '🇨🇭', confederation: 'UEFA' },
  { name: 'Dinamarca', flag: '🇩🇰', confederation: 'UEFA' },
  { name: 'Áustria', flag: '🇦🇹', confederation: 'UEFA' },
  { name: 'Sérvia', flag: '🇷🇸', confederation: 'UEFA' },
  { name: 'Turquia', flag: '🇹🇷', confederation: 'UEFA' },
  // CAF
  { name: 'Marrocos', flag: '🇲🇦', confederation: 'CAF' },
  { name: 'Senegal', flag: '🇸🇳', confederation: 'CAF' },
  { name: 'Nigéria', flag: '🇳🇬', confederation: 'CAF' },
  { name: 'Egito', flag: '🇪🇬', confederation: 'CAF' },
  // AFC
  { name: 'Japão', flag: '🇯🇵', confederation: 'AFC' },
  { name: 'Coreia do Sul', flag: '🇰🇷', confederation: 'AFC' },
  { name: 'Arábia Saudita', flag: '🇸🇦', confederation: 'AFC' },
  { name: 'Austrália', flag: '🇦🇺', confederation: 'AFC' },
]

export const CONFEDERATION_LABELS: Record<string, string> = {
  CONMEBOL: 'América do Sul',
  CONCACAF: 'América do Norte e Central',
  UEFA: 'Europa',
  CAF: 'África',
  AFC: 'Ásia',
  OFC: 'Oceania',
}

export function getTeamByName(name: string): CopaTeam | undefined {
  return COPA_TEAMS.find((t) => t.name === name)
}

export interface BracketPredictions {
  semifinalists: [string, string, string, string]
}

export interface TournamentResults {
  champion: string
  runner_up: string
  semifinalists: string[]
}

// Cálculo de pontos — chamado quando resultados forem disponíveis
export function calculateBracketPoints(
  bracket: { champion: string; runner_up: string; predictions: BracketPredictions },
  results: TournamentResults
): number {
  let points = 0
  if (bracket.champion === results.champion) points += 10
  if (bracket.runner_up === results.runner_up) points += 5
  const semiHits = bracket.predictions.semifinalists.filter((t) =>
    results.semifinalists.includes(t)
  ).length
  points += semiHits * 4
  return points
}
