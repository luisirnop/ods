import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { getTeamByName } from '@/lib/copa-2026'
import { createClient } from '@/lib/supabase/server'
import CountryFlag from '@/components/ui/CountryFlag'

interface Props {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const admin = getAdminClient()
  const { data } = await admin
    .from('world_cup_brackets')
    .select('bracket_name, champion, profiles(display_name)')
    .eq('share_token', token)
    .single()

  if (!data) return { title: 'Bolão não encontrado — OddsBR' }

  const profile = data.profiles as unknown as { display_name: string | null } | null
  const owner = profile?.display_name ?? 'Anônimo'
  const title = `${data.bracket_name ?? 'Bolão da Copa'} — ${owner} | OddsBR`

  return {
    title,
    description: `Veja o bolão da Copa do Mundo 2026 de ${owner}. Campeão escolhido: ${data.champion ?? '?'}. Faça o seu no OddsBR.`,
  }
}

export default async function BolaoSharedPage({ params }: Props) {
  const { token } = await params
  const admin = getAdminClient()

  const { data } = await admin
    .from('world_cup_brackets')
    .select('id, bracket_name, champion, runner_up, predictions, points, share_token, user_id, profiles(display_name, username)')
    .eq('share_token', token)
    .single()

  if (!data) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isOwner = user?.id === data.user_id
  const profile = data.profiles as unknown as { display_name: string | null; username: string | null } | null
  const ownerName = profile?.display_name ?? profile?.username ?? 'Anônimo'

  const champion = data.champion ? getTeamByName(data.champion) : null
  const runnerUp = data.runner_up ? getTeamByName(data.runner_up) : null
  const preds = data.predictions as { semifinalists?: string[] } | null
  const semis = (preds?.semifinalists ?? []).map((s) => getTeamByName(s) ?? { name: s, flag: '🏳️', flagCode: '', confederation: 'UEFA' as const })

  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://oddsbr.com.br/copa-2026/bolao/${token}`

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-2">
        <Link href="/copa-2026" className="hover:text-foreground transition-colors">Copa 2026</Link>
        <span>/</span>
        <Link href="/copa-2026/bolao" className="hover:text-foreground transition-colors">Bolão</Link>
        <span>/</span>
        <span>Compartilhado</span>
      </nav>

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Bolão de {ownerName}
        </p>
        <h1 className="text-2xl font-extrabold">
          {data.bracket_name ?? 'Bolão da Copa 2026'}
        </h1>
        {(data.points ?? 0) > 0 && (
          <p className="text-sm font-semibold text-green-600">
            {data.points} pontos acumulados
          </p>
        )}
      </div>

      {/* Escolhas */}
      <div className="space-y-3">
        {/* Campeão */}
        <div className="rounded-xl border-2 border-amber-500/40 bg-amber-500/5 p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                🏆 Campeão (+10 pts)
              </p>
              <div className="flex items-center gap-2.5">
                {champion && <CountryFlag code={champion.flagCode} name={champion.name} size="md" />}
                <p className="text-xl font-extrabold">{champion ? champion.name : '—'}</p>
              </div>
            </div>
            <div className="text-4xl opacity-20">🏆</div>
          </div>
        </div>

        {/* Vice */}
        <div className="rounded-xl border p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                🥈 Vice-campeão (+5 pts)
              </p>
              <div className="flex items-center gap-2.5">
                {runnerUp && <CountryFlag code={runnerUp.flagCode} name={runnerUp.name} size="sm" />}
                <p className="text-lg font-bold">{runnerUp ? runnerUp.name : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Semifinalistas */}
        {semis.length > 0 && (
          <div className="rounded-xl border p-5 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              🏅 Semifinalistas (+4 pts cada)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {semis.map((team) => (
                <div
                  key={team.name}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium"
                >
                  <CountryFlag code={team.flagCode} name={team.name} size="xs" />
                  {team.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3">
        {isOwner ? (
          <Link
            href="/copa-2026/bolao"
            className="w-full text-center rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
          >
            Editar meu bolão
          </Link>
        ) : (
          <Link
            href="/copa-2026/bolao"
            className="w-full text-center rounded-xl bg-green-500 hover:bg-green-600 text-black px-5 py-2.5 text-sm font-bold transition-colors"
          >
            Fazer meu bolão →
          </Link>
        )}

        {/* Compartilhar */}
        <ShareSection token={token} ownerName={ownerName} />

        <Link
          href="/copa-2026/ranking"
          className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver ranking geral →
        </Link>
      </div>
    </div>
  )
}

function ShareSection({ token, ownerName }: { token: string; ownerName: string }) {
  const url = `https://oddsbr.com.br/copa-2026/bolao/${token}`
  const text = `Vi o bolão da Copa 2026 de ${ownerName} no OddsBR. Faça o seu também!`
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Compartilhar bolão
      </p>
      <div className="flex gap-2">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2 text-xs font-semibold transition-colors"
        >
          WhatsApp
        </a>
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center rounded-lg bg-[#1DA1F2] hover:bg-[#0d8de0] text-white px-3 py-2 text-xs font-semibold transition-colors"
        >
          X / Twitter
        </a>
      </div>
      <div className="rounded-lg bg-muted px-3 py-2 text-xs font-mono text-muted-foreground break-all select-all">
        {url}
      </div>
    </div>
  )
}
