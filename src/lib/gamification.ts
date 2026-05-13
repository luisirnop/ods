import type { Prediction, Profile } from '@/types'

export const BADGES = {
  FIRST_PREDICTION: 'first_prediction',
  FIVE_STREAK: 'five_streak',
  FIFTY_PREDICTIONS: 'fifty_predictions',
  TIPSTER_WEEK: 'tipster_week',
  VALUE_HUNTER: 'value_hunter',
} as const

export type BadgeKey = (typeof BADGES)[keyof typeof BADGES]

export const BADGE_META: Record<BadgeKey, { label: string; description: string; icon: string }> = {
  first_prediction: { label: 'Primeiro Palpite', description: 'Publicou o primeiro palpite', icon: '🎯' },
  five_streak: { label: 'Bola de Cristal', description: '5 acertos consecutivos', icon: '🔮' },
  fifty_predictions: { label: 'Analistão', description: '50 palpites publicados', icon: '📊' },
  tipster_week: { label: 'Tipster da Semana', description: 'Top 3 no ranking semanal', icon: '🏆' },
  value_hunter: { label: 'Value Hunter', description: '3 value bets corretas', icon: '💎' },
}

export function calcPoints(prediction: Prediction): number {
  if (!prediction.result || prediction.result === 'void') return 0
  if (prediction.result === 'incorrect') return 0

  let points = 0

  switch (prediction.market) {
    case '1x2':
      points = 10
      break
    case 'over_under':
    case 'btts':
    case 'double_chance':
      points = 15
      break
    case 'exact_score':
      points = 30
      break
  }

  return points
}

export function calcStreakBonus(streak: number): number {
  return streak >= 3 ? 5 : 0
}

export function checkBadges(profile: Profile, existingBadges: string[]): BadgeKey[] {
  const newBadges: BadgeKey[] = []

  if (profile.predictions_total === 1 && !existingBadges.includes(BADGES.FIRST_PREDICTION)) {
    newBadges.push(BADGES.FIRST_PREDICTION)
  }

  if (profile.current_streak >= 5 && !existingBadges.includes(BADGES.FIVE_STREAK)) {
    newBadges.push(BADGES.FIVE_STREAK)
  }

  if (profile.predictions_total >= 50 && !existingBadges.includes(BADGES.FIFTY_PREDICTIONS)) {
    newBadges.push(BADGES.FIFTY_PREDICTIONS)
  }

  return newBadges
}
