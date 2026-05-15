import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPredictions, getLikedPredictions, getFollowing } from '@/actions/palpites'
import PredictionCard from '@/components/predictions/PredictionCard'
import type { Market, PredictionResult } from '@/types'

type PredictionRow = {
  id: string
  user_id: string
  home_team: string
  away_team: string
  league: string
  game_date: string
  market: Market
  prediction: string
  confidence: number
  justification: string | null
  odds_at_time: number | null
  result: PredictionResult | null
  points_earned: number
  likes_count: number
  created_at: string
  profiles: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
  } | null
}

export const metadata: Metadata = {
  title: 'Palpites da Comunidade — OddsBR',
  description: 'Veja os palpites da comunidade OddsBR para os jogos de hoje. Rankings, acertos e análises.',
}

export default async function PalpitesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [predictions, likedIds, followingIds] = await Promise.all([
    getPredictions(30),
    getLikedPredictions(user?.id ?? null),
    getFollowing(user?.id ?? null),
  ])

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feed de Palpites</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Palpites recentes da comunidade
          </p>
        </div>
        {!user && (
          <a
            href="/login"
            className="text-sm font-medium text-green-600 hover:underline"
          >
            Entrar para palpitar →
          </a>
        )}
      </div>

      {predictions.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center space-y-3">
          <p className="text-muted-foreground">Nenhum palpite ainda.</p>
          {user ? (
            <p className="text-sm text-muted-foreground">
              Acesse a página de um jogo e faça o primeiro palpite!
            </p>
          ) : (
            <a href="/login" className="text-sm text-green-600 hover:underline">
              Entre para fazer palpites →
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {(predictions as PredictionRow[]).map((pred) => (
            <PredictionCard
              key={pred.id}
              prediction={pred}
              isLiked={likedIds.includes(pred.id)}
              isFollowing={pred.profiles ? followingIds.includes(pred.profiles.id) : false}
              currentUserId={user?.id ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
