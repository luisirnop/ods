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

export function slugifyTeam(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export function getTeamBySlug(slug: string): CopaTeam | undefined {
  return COPA_TEAMS.find((t) => slugifyTeam(t.name) === slug)
}

export interface TeamStats {
  titulos: number
  vicesCampeonatos: number
  melhorCampanha: string
  participacoes: number
  jogadoresChave: string[]
  estilo: string
  tecnico: string
}

export const TEAM_STATS: Record<string, TeamStats> = {
  Brasil: {
    titulos: 5,
    vicesCampeonatos: 2,
    melhorCampanha: 'Campeão (1958, 1962, 1970, 1994, 2002)',
    participacoes: 22,
    jogadoresChave: ['Vinicius Jr.', 'Rodrygo', 'Endrick', 'Casemiro', 'Marquinhos'],
    estilo: 'Futebol ofensivo com alta pressão e transições rápidas',
    tecnico: 'Carlo Ancelotti',
  },
  Argentina: {
    titulos: 3,
    vicesCampeonatos: 3,
    melhorCampanha: 'Campeão (1978, 1986, 2022)',
    participacoes: 18,
    jogadoresChave: ['Lionel Messi', 'Lautaro Martínez', 'Julián Álvarez', 'Rodrigo De Paul'],
    estilo: 'Organização defensiva com qualidade individual no ataque',
    tecnico: 'Lionel Scaloni',
  },
  França: {
    titulos: 2,
    vicesCampeonatos: 2,
    melhorCampanha: 'Campeão (1998, 2018)',
    participacoes: 16,
    jogadoresChave: ['Kylian Mbappé', 'Antoine Griezmann', 'Aurélien Tchouaméni', 'William Saliba'],
    estilo: 'Jogo direto e eficiente com transições letais',
    tecnico: 'Didier Deschamps',
  },
  Inglaterra: {
    titulos: 1,
    vicesCampeonatos: 0,
    melhorCampanha: 'Campeão (1966)',
    participacoes: 16,
    jogadoresChave: ['Jude Bellingham', 'Harry Kane', 'Phil Foden', 'Bukayo Saka'],
    estilo: 'Intensidade física e qualidade técnica individual',
    tecnico: 'Gareth Southgate',
  },
  Alemanha: {
    titulos: 4,
    vicesCampeonatos: 4,
    melhorCampanha: 'Campeão (1954, 1974, 1990, 2014)',
    participacoes: 20,
    jogadoresChave: ['Florian Wirtz', 'Jamal Musiala', 'Leroy Sané', 'Manuel Neuer'],
    estilo: 'Eficiência germânica com jogo coletivo organizado',
    tecnico: 'Julian Nagelsmann',
  },
  Espanha: {
    titulos: 1,
    vicesCampeonatos: 0,
    melhorCampanha: 'Campeão (2010)',
    participacoes: 16,
    jogadoresChave: ['Pedri', 'Lamine Yamal', 'Rodri', 'Álvaro Morata'],
    estilo: 'Posse de bola e pressão alta — estilo tiki-taka renovado',
    tecnico: 'Luis de la Fuente',
  },
  Portugal: {
    titulos: 0,
    vicesCampeonatos: 0,
    melhorCampanha: '3º lugar (1966)',
    participacoes: 9,
    jogadoresChave: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rafael Leão'],
    estilo: 'Qualidade individual aliada a organização defensiva sólida',
    tecnico: 'Roberto Martínez',
  },
  Uruguai: {
    titulos: 2,
    vicesCampeonatos: 0,
    melhorCampanha: 'Campeão (1930, 1950)',
    participacoes: 14,
    jogadoresChave: ['Darwin Núñez', 'Federico Valverde', 'Rodrigo Bentancur', 'Luis Suárez'],
    estilo: 'Garra charrúa — intensidade, duelos e pragmatismo',
    tecnico: 'Marcelo Bielsa',
  },
  Marrocos: {
    titulos: 0,
    vicesCampeonatos: 0,
    melhorCampanha: '4º lugar (2022)',
    participacoes: 7,
    jogadoresChave: ['Achraf Hakimi', 'Hakim Ziyech', 'Youssef En-Nesyri', 'Sofyan Amrabat'],
    estilo: 'Defesa compacta e transições velozes',
    tecnico: 'Walid Regragui',
  },
  Japão: {
    titulos: 0,
    vicesCampeonatos: 0,
    melhorCampanha: 'Oitavas de final (2002, 2010, 2018, 2022)',
    participacoes: 8,
    jogadoresChave: ['Takefusa Kubo', 'Wataru Endo', 'Kaoru Mitoma', 'Daichi Kamada'],
    estilo: 'Alta pressão e compactação, com técnica refinada',
    tecnico: 'Hajime Moriyasu',
  },
}

export function getTeamStats(teamName: string): TeamStats | null {
  return TEAM_STATS[teamName] ?? null
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
