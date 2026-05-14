'use server'

import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function disconnectTelegram() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const admin = getAdminClient()
  const { error } = await admin
    .from('profiles')
    .update({ telegram_chat_id: null })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/telegram')
  return { success: true }
}
