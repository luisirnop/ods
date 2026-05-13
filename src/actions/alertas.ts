'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const AlertSchema = z.object({
  team_name: z.string().optional(),
  league: z.string().optional(),
  bookmaker: z.string().optional(),
  market: z.string().optional(),
  threshold: z.coerce.number().min(0.01).max(10).default(0.1),
})

export async function createAlert(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const parsed = AlertSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const admin = getAdminClient()

  // Verificar limite para usuários gratuitos
  const { data: profile } = await admin
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  if (!profile?.is_premium) {
    const { count } = await admin
      .from('odds_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true)

    if ((count ?? 0) >= 3) {
      return { error: 'Limite de 3 alertas atingido. Faça upgrade para Premium para alertas ilimitados.' }
    }
  }

  const { error } = await admin.from('odds_alerts').insert({
    ...parsed.data,
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/alertas')
  return { success: true }
}

export async function deleteAlert(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const admin = getAdminClient()
  const { error } = await admin
    .from('odds_alerts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/alertas')
  return { success: true }
}
