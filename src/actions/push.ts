'use server'

import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

interface PushSubscriptionJSON {
  endpoint: string
  expirationTime: number | null
  keys: { p256dh: string; auth: string }
}

export async function subscribeUser(sub: PushSubscriptionJSON) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const admin = getAdminClient()
  const { error } = await admin.from('push_subscriptions').upsert(
    { user_id: user.id, endpoint: sub.endpoint, subscription: sub },
    { onConflict: 'user_id,endpoint' }
  )
  if (error) return { error: error.message }
  return { success: true }
}

export async function unsubscribeUser(endpoint: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const admin = getAdminClient()
  await admin
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('endpoint', endpoint)
  return { success: true }
}
