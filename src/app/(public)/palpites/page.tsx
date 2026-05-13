import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPredictions, getLikedPredictions, getFollowing } from '@/actions/palpites'
import PredictionCard from '@/components/predictions/PredictionCard'

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
          {predictions.map((pred) => (
            <PredictionCard
              key={pred.id}
              prediction={pred as any}
              isLiked={likedIds.includes(pred.id)}
              isFollowing={
                pred.profiles
                  ? followingIds.includes((pred.profiles as any).id)
                  : false
              }
              currentUserId={user?.id ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
