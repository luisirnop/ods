'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ProfileSchema = z.object({
  display_name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(50),
  username: z
    .string()
    .min(3, 'Username deve ter no mínimo 3 caracteres')
    .max(20)
    .regex(/^[a-z0-9_]+$/, 'Apenas letras minúsculas, números e _')
    .optional()
    .or(z.literal('')),
  favorite_team: z.string().optional(),
})

export async function updateProfile(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const parsed = ProfileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { error: firstError ?? 'Dados inválidos' }
  }

  const admin = getAdminClient()

  // Verificar username único
  if (parsed.data.username) {
    const { data: existing } = await admin
      .from('profiles')
      .select('id')
      .eq('username', parsed.data.username)
      .neq('id', user.id)
      .single()

    if (existing) return { error: 'Este username já está em uso' }
  }

  const { error } = await admin
    .from('profiles')
    .update({
      display_name: parsed.data.display_name,
      username: parsed.data.username || null,
      favorite_team: parsed.data.favorite_team || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/perfil')
  return { success: true }
}
