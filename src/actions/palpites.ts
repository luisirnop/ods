'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const PredictionSchema = z.object({
  game_id: z.string().min(1),
  home_team: z.string().min(1),
  away_team: z.string().min(1),
  league: z.string().min(1),
  game_date: z.string().datetime(),
  market: z.enum(['1x2', 'over_under', 'btts', 'exact_score', 'double_chance']),
  prediction: z.string().min(1),
  confidence: z.coerce.number().min(1).max(5),
  justification: z.string().optional(),
  odds_at_time: z.coerce.number().positive().optional(),
})

type ActionState = { error?: string | object; success?: boolean } | undefined

export async function createPrediction(_prevState: ActionState, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const parsed = PredictionSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const gameDate = new Date(parsed.data.game_date)
  const diffMinutes = (gameDate.getTime() - Date.now()) / 60000
  if (diffMinutes < 5) {
    return { error: 'Palpites encerrados (menos de 5 minutos para o início)' }
  }

  const admin = getAdminClient()

  const { error } = await admin.from('predictions').insert({
    ...parsed.data,
    user_id: user.id,
  })
  if (error) return { error: error.message }

  const { data: profile } = await admin
    .from('profiles')
    .select('predictions_total')
    .eq('id', user.id)
    .single()

  if (profile) {
    await admin
      .from('profiles')
      .update({ predictions_total: (profile.predictions_total ?? 0) + 1 })
      .eq('id', user.id)
  }

  revalidatePath('/palpites')
  return { success: true }
}

export async function getPredictions(limit = 20, offset = 0) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('predictions')
    .select('*, profiles(id, username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return []
  return data ?? []
}

export async function getUserPredictions(userId: string, limit = 20) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

export async function getLikedPredictions(userId: string | null): Promise<string[]> {
  if (!userId) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('prediction_likes')
    .select('prediction_id')
    .eq('user_id', userId)

  return data?.map((d) => d.prediction_id) ?? []
}

export async function getFollowing(userId: string | null): Promise<string[]> {
  if (!userId) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId)

  return data?.map((d) => d.following_id) ?? []
}

export async function likePrediction(predictionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const { data: existing } = await supabase
    .from('prediction_likes')
    .select('prediction_id')
    .eq('user_id', user.id)
    .eq('prediction_id', predictionId)
    .single()

  if (existing) {
    await supabase
      .from('prediction_likes')
      .delete()
      .eq('user_id', user.id)
      .eq('prediction_id', predictionId)
    return { liked: false }
  }

  await supabase.from('prediction_likes').insert({ user_id: user.id, prediction_id: predictionId })
  return { liked: true }
}

export async function toggleFollow(targetUserId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }
  if (user.id === targetUserId) return { error: 'Você não pode seguir a si mesmo' }

  const { data: existing } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .single()

  if (existing) {
    await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
    return { following: false }
  }

  await supabase.from('follows').insert({ follower_id: user.id, following_id: targetUserId })
  return { following: true }
}

export async function getRanking(period: 'week' | 'month' | 'all' = 'week', limit = 20) {
  const supabase = await createClient()

  if (period === 'all') {
    const { data } = await supabase
      .from('profiles')
      .select(
        'id, username, display_name, avatar_url, points_total, predictions_total, predictions_correct, current_streak'
      )
      .order('points_total', { ascending: false })
      .limit(limit)

    return (data ?? []).map((p) => ({ ...p, period_points: p.points_total }))
  }

  const cutoff = new Date()
  if (period === 'week') cutoff.setDate(cutoff.getDate() - 7)
  if (period === 'month') cutoff.setMonth(cutoff.getMonth() - 1)

  const { data: preds } = await supabase
    .from('predictions')
    .select('user_id, points_earned')
    .eq('result', 'correct')
    .gte('created_at', cutoff.toISOString())

  if (!preds?.length) return []

  const pointsMap = new Map<string, number>()
  for (const p of preds) {
    pointsMap.set(p.user_id, (pointsMap.get(p.user_id) ?? 0) + (p.points_earned ?? 0))
  }

  const topIds = Array.from(pointsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select(
      'id, username, display_name, avatar_url, points_total, predictions_total, predictions_correct, current_streak'
    )
    .in('id', topIds)

  return (profiles ?? [])
    .map((p) => ({ ...p, period_points: pointsMap.get(p.id) ?? 0 }))
    .sort((a, b) => b.period_points - a.period_points)
}
