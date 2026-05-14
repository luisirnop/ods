import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getAlerts } from '@/actions/alertas'
import AlertCard from './AlertCard'
import AlertForm from './AlertForm'

export const metadata: Metadata = {
  title: 'Alertas de Odds — OddsBR',
}

const FREE_LIMIT = 3

export default async function AlertasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('is_premium, telegram_chat_id')
    .eq('id', user.id)
    .single()

  const alerts = await getAlerts()
  const isPremium = profile?.is_premium ?? false
  const hasTelegram = !!profile?.telegram_chat_id
  const atLimit = !isPremium && alerts.length >= FREE_LIMIT

  return (
    <div className="max-w-lg space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Alertas de Odds</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Receba notificações quando uma odd mudar.
          </p>
        </div>
        <AlertForm atLimit={atLimit} />
      </div>

      {!hasTelegram && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm space-y-2">
          <p className="font-medium text-yellow-700 dark:text-yellow-400">
            Telegram não conectado
          </p>
          <p className="text-muted-foreground">
            Os alertas são enviados via Telegram. Conecte sua conta para recebê-los.
          </p>
          <Link href="/telegram" className="text-green-600 hover:underline font-medium text-sm">
            Conectar Telegram →
          </Link>
        </div>
      )}

      {!isPremium && (
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            Alertas gratuitos: <span className="font-semibold text-foreground">{alerts.length}/{FREE_LIMIT}</span>
          </span>
          <span className="text-muted-foreground text-xs">Premium = ilimitados</span>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center space-y-2">
          <p className="text-muted-foreground text-sm">Nenhum alerta configurado.</p>
          <p className="text-muted-foreground text-xs">
            Crie alertas para receber notificações quando as odds mudarem.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert as any}
              freeLimit={FREE_LIMIT}
              totalCount={alerts.length}
              isPremium={isPremium}
            />
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-card p-4 space-y-3 text-sm">
        <h2 className="font-semibold">Como funcionam os alertas</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-green-500 shrink-0">→</span>
            Um script monitora as odds a cada 10 minutos
          </li>
          <li className="flex gap-2">
            <span className="text-green-500 shrink-0">→</span>
            Se uma odd mudar mais que o limite configurado em 1h, você é notificado
          </li>
          <li className="flex gap-2">
            <span className="text-green-500 shrink-0">→</span>
            Gratuito: 3 alertas/dia · Premium: ilimitados
          </li>
          <li className="flex gap-2">
            <span className="text-green-500 shrink-0">→</span>
            Requer{' '}
            <Link href="/telegram" className="text-green-600 hover:underline">
              Telegram conectado
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
