import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { disconnectTelegram } from '@/actions/telegram'

export const metadata: Metadata = {
  title: 'Telegram — OddsBR',
}

export default async function TelegramPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('telegram_chat_id, display_name, favorite_team')
    .eq('id', user.id)
    .single()

  const isConnected = !!profile?.telegram_chat_id
  const botUsername = process.env.TELEGRAM_BOT_USERNAME ?? 'OddsBRBot'
  const botLink = `https://t.me/${botUsername.replace('@', '')}`

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Telegram</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Receba alertas de odds diretamente no Telegram.
        </p>
      </div>

      {isConnected ? (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-xl">
                ✅
              </div>
              <div>
                <div className="font-semibold text-green-600">Conta conectada</div>
                <div className="text-sm text-muted-foreground">
                  {profile?.display_name ?? user.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-muted-foreground text-xs mb-1">Chat ID</div>
                <div className="font-mono font-medium">{profile?.telegram_chat_id}</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-muted-foreground text-xs mb-1">Time favorito</div>
                <div className="font-medium">{profile?.favorite_team ?? '—'}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-3">
            <h2 className="font-semibold text-sm">Comandos do bot</h2>
            <div className="space-y-2 text-sm">
              {[
                { cmd: '/status', desc: 'Ver status da conta' },
                { cmd: '/times', desc: 'Alterar time favorito' },
                { cmd: '/desconectar', desc: 'Desconectar conta' },
              ].map(({ cmd, desc }) => (
                <div key={cmd} className="flex items-center gap-3">
                  <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{cmd}</code>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
            <a
              href={botLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
            >
              Abrir @{botUsername} →
            </a>
          </div>

          <form
            action={async () => {
              'use server'
              await disconnectTelegram()
            }}
          >
            <button
              type="submit"
              className="text-sm text-red-500 hover:text-red-600 hover:underline transition-colors"
            >
              Desconectar conta do Telegram
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                💬
              </div>
              <div>
                <div className="font-semibold">Não conectado</div>
                <div className="text-sm text-muted-foreground">
                  Vincule sua conta para receber alertas.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold">Como conectar</h2>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>
                  Abra o{' '}
                  <a
                    href={botLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline font-medium"
                  >
                    @{botUsername}
                  </a>{' '}
                  no Telegram
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>
                  Envie o comando:{' '}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    /conectar {user.email}
                  </code>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Pronto! Você receberá alertas de odds aqui.</span>
              </li>
            </ol>

            <a
              href={botLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 text-sm transition-colors"
            >
              Abrir @{botUsername} no Telegram
            </a>
          </div>

          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-700 dark:text-yellow-400">
            <strong>Gratuito:</strong> 3 alertas de odds por dia.{' '}
            <span className="text-muted-foreground">Upgrade para Premium = alertas ilimitados.</span>
          </div>
        </div>
      )}
    </div>
  )
}
