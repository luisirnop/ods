'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { BracketPredictions } from '@/lib/copa-2026'

export interface BolaoInput {
  name: string
  champion: string
  runnerUp: string
  semifinalists: [string, string, string, string]
}

export async function saveBolao(
  data: BolaoInput
): Promise<{ token: string } | { error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/copa-2026/bolao')

  const predictions: BracketPredictions = {
    semifinalists: data.semifinalists,
  }

  // Verifica se já existe um bolão para este usuário
  const { data: existing } = await supabase
    .from('world_cup_brackets')
    .select('id, share_token')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('world_cup_brackets')
      .update({
        bracket_name: data.name,
        champion: data.champion,
        runner_up: data.runnerUp,
        predictions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) return { error: 'Erro ao atualizar bolão. Tente novamente.' }

    revalidatePath('/copa-2026/ranking')
    return { token: existing.share_token }
  }

  const { data: inserted, error } = await supabase
    .from('world_cup_brackets')
    .insert({
      user_id: user.id,
      bracket_name: data.name,
      champion: data.champion,
      runner_up: data.runnerUp,
      predictions,
    })
    .select('share_token')
    .single()

  if (error || !inserted) return { error: 'Erro ao salvar bolão. Tente novamente.' }

  revalidatePath('/copa-2026/ranking')
  return { token: inserted.share_token }
}
