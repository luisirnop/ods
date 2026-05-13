import type { Metadata } from 'next'
import Link from 'next/link'
import { getRanking } from '@/actions/palpites'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Ranking de Palpiteiros — OddsBR',
  description: 'Os melhores tipsters da semana, mês e geral. Veja quem mais acerta no OddsBR.',
}

type Period = 'week' | 'month' | 'all'

interface Props {
  searchParams: Promise<{ period?: string }>
}

export default async function RankingPage({ searchParams }: Props) {
  const { period: rawPeriod = 'week' } = await searchParams
  const period: Period =
    rawPeriod === 'month' || rawPeriod === 'all' ? rawPeriod : 'week'

  const ranking = await getRanking(period, 50)

  const tabs: { label: string; value: Period }[] = [
    { label: 'Semanal', value: 'week' },
    { label: 'Mensal', value: 'month' },
    { label: 'Geral', value: 'all' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Ranking de Palpiteiros</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Os melhores tipsters do OddsBR
        </p>
      </div>

      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/ranking?period=${tab.value}`}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
              period === tab.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {ranking.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center">
          <p className="text-muted-foreground">
            {period === 'week'
              ? 'Nenhum acerto registrado esta semana ainda.'
              : period === 'month'
                ? 'Nenhum acerto registrado este mês ainda.'
                : 'Nenhum usuário no ranking ainda.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {ranking.map((entry, i) => {
            const position = i + 1
            const username = entry.username
            const displayName = entry.display_name ?? username ?? 'Anônimo'
            const accuracy =
              entry.predictions_total > 0
                ? Math.round((entry.predictions_correct / entry.predictions_total) * 100)
                : 0

            const medalColors: Record<number, string> = {
              1: 'text-yellow-500',
              2: 'text-slate-400',
              3: 'text-amber-600',
            }

            return (
              <div
                key={entry.id}
                className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3 hover:border-muted-foreground/20 transition-colors"
              >
                <div
                  className={cn(
                    'w-8 text-center font-bold text-sm shrink-0',
                    medalColors[position] ?? 'text-muted-foreground'
                  )}
                >
                  {position <= 3 ? ['🥇', '🥈', '🥉'][position - 1] : position}
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    {username ? (
                      <Link
                        href={`/tipsters/${username}`}
                        className="font-medium text-sm hover:underline truncate block"
                      >
                        {displayName}
                      </Link>
                    ) : (
                      <span className="font-medium text-sm truncate block">{displayName}</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {entry.predictions_total} palpites · {accuracy}% acerto
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-sm text-green-600">
                    {period === 'all' ? entry.points_total : entry.period_points} pts
                  </div>
                  {entry.current_streak > 1 && (
                    <div className="text-xs text-orange-500">🔥 {entry.current_streak}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
