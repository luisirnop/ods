import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BolaoForm from './BolaoForm'

export const metadata: Metadata = {
  title: 'Bolão Copa 2026 — OddsBR',
  description: 'Faça seu bolão da Copa do Mundo 2026. Escolha campeão, vice e semifinalistas.',
}

export default async function BolaoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-5">
        <div className="text-4xl">🏆</div>
        <h1 className="text-xl font-bold">Entre para fazer seu bolão</h1>
        <p className="text-sm text-muted-foreground">
          Crie uma conta gratuita para salvar seu bolão, compartilhar com amigos e disputar o ranking.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/cadastro?next=/copa-2026/bolao"
            className="inline-flex items-center rounded-xl bg-green-500 hover:bg-green-600 text-black px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Criar conta →
          </Link>
          <Link
            href="/login?next=/copa-2026/bolao"
            className="inline-flex items-center rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  const { data: existing } = await supabase
    .from('world_cup_brackets')
    .select('id, bracket_name, champion, runner_up, predictions, share_token')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <nav className="text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/copa-2026" className="hover:text-foreground transition-colors">
            Copa 2026
          </Link>
          <span>/</span>
          <span>Meu Bolão</span>
        </nav>
        <h1 className="text-2xl font-extrabold">
          {existing ? 'Editar meu bolão' : 'Criar meu bolão'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Acerte o campeão e ganhe até 26 pontos. Após salvar, você recebe um link para
          compartilhar com amigos.
        </p>
      </div>

      {/* Link para bolão existente */}
      {existing && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm flex items-center justify-between gap-3">
          <span className="text-green-600 font-medium">✓ Você já tem um bolão salvo</span>
          <Link
            href={`/copa-2026/bolao/${existing.share_token}`}
            className="text-xs font-semibold text-green-600 hover:underline shrink-0"
          >
            Ver bolão →
          </Link>
        </div>
      )}

      <BolaoForm
        existing={
          existing
            ? {
                bracket_name: existing.bracket_name,
                champion: existing.champion,
                runner_up: existing.runner_up,
                predictions: existing.predictions as { semifinalists?: string[] } | null,
                share_token: existing.share_token,
              }
            : null
        }
      />
    </div>
  )
}
