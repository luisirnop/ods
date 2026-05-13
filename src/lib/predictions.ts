import type { Market } from '@/types'

export function formatPrediction(
  market: Market,
  prediction: string,
  homeTeam: string,
  awayTeam: string
): string {
  switch (market) {
    case '1x2':
      if (prediction === '1') return homeTeam
      if (prediction === 'X') return 'Empate'
      if (prediction === '2') return awayTeam
      return prediction
    case 'over_under':
      return prediction === 'over' ? 'Over 2.5' : 'Under 2.5'
    case 'btts':
      return prediction === 'sim' ? 'Ambos Marcam: Sim' : 'Ambos Marcam: Não'
    case 'double_chance': {
      const map: Record<string, string> = {
        '1X': `${homeTeam} ou Empate`,
        'X2': `Empate ou ${awayTeam}`,
        '12': `${homeTeam} ou ${awayTeam}`,
      }
      return map[prediction] ?? prediction
    }
    case 'exact_score':
      return `Placar: ${prediction}`
    default:
      return prediction
  }
}

export function getMarketLabel(market: Market): string {
  const labels: Record<Market, string> = {
    '1x2': '1X2',
    over_under: 'Over/Under',
    btts: 'Ambos Marcam',
    exact_score: 'Placar Exato',
    double_chance: 'Dupla Chance',
  }
  return labels[market] ?? market
}

export function getResultColor(result: string | null): string {
  if (result === 'correct') return 'text-green-600'
  if (result === 'incorrect') return 'text-red-500'
  if (result === 'void') return 'text-yellow-500'
  return 'text-muted-foreground'
}

export function getResultLabel(result: string | null): string {
  if (result === 'correct') return 'Acertou'
  if (result === 'incorrect') return 'Errou'
  if (result === 'void') return 'Anulado'
  return 'Pendente'
}

export function getConfidenceLabel(confidence: number): string {
  return '★'.repeat(confidence) + '☆'.repeat(5 - confidence)
}
