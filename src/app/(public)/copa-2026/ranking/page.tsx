import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { getTeamByName } from '@/lib/copa-2026'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Ranking do Bolão Copa 2026 — OddsBR',
  description: 'Veja quem está na frente no bolão da Copa do Mundo 2026. Ranking atualizado após cada fase.',
}

interface BolaoRow {
  id: string
  bracket_name: string | null
  champion: string | null
  runner_up: string | null
  points: number
  share_token: string
  profiles: {
    display_name: string | null
    username: string | null
  } | null
}

export default async function CopaRankingPage() {
  const admin = getAdminClient()

  const { data } = await admin
    .from('world_cup_brackets')
    .select('id, bracket_name, champion, runner_up, points, share_token, profiles(display_name, username)')
    .order('points', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(100)

  const rows = (data ?? []) as unknown as BolaoRow[]

  const medalEmoji = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <nav className="text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/copa-2026" className="hover:text-foreground transition-colors">
            Copa 2026
          </Link>
          <span>/</span>
          <span>Ranking</span>
        </nav>
        <h1 className="text-2xl font-extrabold">Ranking do Bolão</h1>
        <p className="text-sm text-muted-foreground">
          Pontos atribuídos à medida que a Copa avança. Acertar o campeão vale 10 pts.
        </p>
      </div>

      {/* Tabela de pontuação */}
      <div className="rounded-xl border bg-card p-4 grid grid-cols-4 gap-3 text-center text-xs">
        {[
          { label: 'Campeão', pts: '+10 pts', color: 'text-amber-500' },
          { label: 'Vice', pts: '+5 pts', color: 'text-green-600' },
          { label: 'Semifinalista', pts: '+4 pts', color: 'text-blue-500' },
          { label: 'Máximo', pts: '26 pts', color: 'text-muted-foreground' },
        ].map(({ label, pts, color }) => (
          <div key={label} className="space-y-0.5">
            <div className={`font-bold text-base ${color}`}>{pts}</div>
            <div className="text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* CTA para criar bolão */}
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-green-600">Ainda não fez seu bolão?</p>
        <Link
          href="/copa-2026/bolao"
          className="text-xs font-semibold bg-green-500 hover:bg-green-600 text-black px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Criar bolão →
        </Link>
      </div>

      {/* Lista */}
      {rows.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
          Nenhum bolão criado ainda. Seja o primeiro!
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row, i) => {
            const position = i + 1
            const profile = row.profiles
            const displayName =
              profile?.display_name ?? profile?.username ?? 'Anônimo'
            const championTeam = row.champion ? getTeamByName(row.champion) : null

            return (
              <Link
                key={row.id}
                href={`/copa-2026/bolao/${row.share_token}`}
                className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3 hover:border-muted-foreground/20 transition-colors"
              >
                {/* Posição */}
                <div className="w-8 text-center font-bold text-sm shrink-0 text-muted-foreground">
                  {position <= 3 ? medalEmoji[position - 1] : position}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{displayName}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {row.bracket_name ?? 'Bolão sem nome'}
                    {championTeam && (
                      <span className="ml-1">
                        · {championTeam.flag} {row.champion}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pontos */}
                <div className="text-right shrink-0">
                  <div className="font-bold text-sm text-green-600">
                    {row.points ?? 0} pts
                  </div>
                  <div className="text-xs text-muted-foreground">Ver bolão →</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Ranking atualizado a cada 5 minutos. Pontos calculados automaticamente ao final de cada fase.
      </p>
    </div>
  )
}
