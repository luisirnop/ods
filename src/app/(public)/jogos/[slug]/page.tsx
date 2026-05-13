import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OddsTable from '@/components/odds/OddsTable'
import PredictionForm from '@/components/predictions/PredictionForm'
import { MOCK_GAMES } from '@/lib/mock-data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const game = MOCK_GAMES.find((g) => g.id === slug)
  if (!game) return {}

  return {
    title: `${game.home_team} x ${game.away_team} — Odds e Palpite`,
    description: `Compare odds para ${game.home_team} x ${game.away_team} pela ${game.sport_title}. Melhor odd garantida.`,
    openGraph: {
      title: `${game.home_team} x ${game.away_team}`,
      description: `Compare odds e faça seu palpite — ${game.sport_title}`,
    },
  }
}

function formatDateTime(isoDate: string) {
  return new Date(isoDate).toLocaleString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function JogoPage({ params }: Props) {
  const { slug } = await params
  const game = MOCK_GAMES.find((g) => g.id === slug)
  if (!game) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section className="rounded-xl border bg-card p-6 space-y-4">
        <div className="text-sm text-muted-foreground font-medium">{game.sport_title}</div>
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-2xl font-bold flex-1 text-left">{game.home_team}</h1>
          <div className="text-center">
            <div className="text-3xl font-bold text-muted-foreground">×</div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatDateTime(game.commence_time)}
            </div>
          </div>
          <h1 className="text-2xl font-bold flex-1 text-right">{game.away_team}</h1>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-muted-foreground">Faça seu palpite antes do jogo começar</span>
          <PredictionForm game={game} userId={user?.id ?? null} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Resultado Final (1X2)</h2>
        <OddsTable game={game} market="h2h" />
      </section>

      {game.bookmakers.some((b) => b.markets.some((m) => m.key === 'totals')) && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Over/Under 2.5 gols</h2>
          <OddsTable game={game} market="totals" />
        </section>
      )}

      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
        Dados de demonstração. Configure a The Odds API para odds reais.
      </div>
    </div>
  )
}
