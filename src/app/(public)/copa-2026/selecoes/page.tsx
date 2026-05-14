import type { Metadata } from 'next'
import Link from 'next/link'
import { COPA_TEAMS, CONFEDERATION_LABELS, type CopaTeam } from '@/lib/copa-2026'

export const metadata: Metadata = {
  title: 'Seleções da Copa do Mundo 2026 — OddsBR',
  description:
    'Conheça as 32 seleções classificadas para a Copa do Mundo 2026. Estatísticas, elenco, odds de título e análises.',
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function ConfederationGroup({
  conf,
  teams,
}: {
  conf: string
  teams: CopaTeam[]
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
        {CONFEDERATION_LABELS[conf] ?? conf}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {teams.map((team) => (
          <Link
            key={team.name}
            href={`/copa-2026/selecoes/${slugify(team.name)}`}
            className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 hover:border-green-500/30 hover:bg-green-500/5 transition-colors"
          >
            <span className="text-2xl">{team.flag}</span>
            <span className="text-sm font-medium group-hover:text-green-600 transition-colors leading-tight">
              {team.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function SelecoesPage() {
  const byConf = Object.groupBy(COPA_TEAMS, (t) => t.confederation)
  const confOrder = ['CONMEBOL', 'UEFA', 'CONCACAF', 'CAF', 'AFC', 'OFC']

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <nav className="text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/copa-2026" className="hover:text-foreground transition-colors">
            Copa 2026
          </Link>
          <span>/</span>
          <span>Seleções</span>
        </nav>
        <h1 className="text-3xl font-extrabold">
          Seleções da Copa 2026
        </h1>
        <p className="text-muted-foreground">
          {COPA_TEAMS.length} seleções classificadas. Clique em uma seleção para ver estatísticas,
          elenco e odds de título.
        </p>
      </div>

      {/* Por confederação */}
      <div className="space-y-8">
        {confOrder.map((conf) => {
          const teams = byConf[conf as keyof typeof byConf]
          if (!teams || teams.length === 0) return null
          return (
            <ConfederationGroup
              key={conf}
              conf={conf}
              teams={teams}
            />
          )
        })}
      </div>

      {/* CTA Bolão */}
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-green-600">Qual vai ser o campeão?</p>
          <p className="text-sm text-muted-foreground">
            Faça seu bolão e dispute com amigos quem cravar o campeão.
          </p>
        </div>
        <Link
          href="/copa-2026/bolao"
          className="inline-flex items-center rounded-xl bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 text-sm font-bold transition-colors whitespace-nowrap"
        >
          Fazer bolão →
        </Link>
      </div>
    </div>
  )
}
