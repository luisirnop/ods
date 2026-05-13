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

export async function createPrediction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const parsed = PredictionSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  // Validar: palpite só aceito até 5 min antes do jogo
  const gameDate = new Date(parsed.data.game_date)
  const now = new Date()
  const diffMinutes = (gameDate.getTime() - now.getTime()) / 60000
  if (diffMinutes < 5) return { error: 'Palpites encerrados para este jogo (menos de 5 minutos para o início)' }

  const admin = getAdminClient()
  const { error } = await admin.from('predictions').insert({
    ...parsed.data,
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/palpites')
  revalidatePath('/meus-palpites')
  return { success: true }
}

export async function getPredictions(limit = 20, offset = 0) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('predictions')
    .select('*, profiles(username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(`Erro ao buscar palpites: ${error.message}`)
  return data
}
