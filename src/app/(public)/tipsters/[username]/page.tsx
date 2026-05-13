import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getUserPredictions, getFollowing } from '@/actions/palpites'
import FollowButton from '@/components/predictions/FollowButton'
import { BADGE_META } from '@/lib/gamification'
import { formatPrediction, getMarketLabel, getResultColor, getResultLabel } from '@/lib/predictions'
import type { Market } from '@/types'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('display_name, username')
    .eq('username', username)
    .single()

  if (!profile) return {}
  return {
    title: `${profile.display_name ?? profile.username} — Tipster OddsBR`,
    description: `Veja os palpites e estatísticas de ${profile.display_name ?? profile.username} no OddsBR.`,
  }
}

export default async function TipsterPage({ params }: Props) {
  const { username } = await params

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const supabase = await createClient()
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  const [predictions, followingIds, { data: achievements }] = await Promise.all([
    getUserPredictions(profile.id, 20),
    getFollowing(currentUser?.id ?? null),
    admin.from('achievements').select('badge_key').eq('user_id', profile.id),
  ])

  const isFollowing = followingIds.includes(profile.id)
  const isSelf = currentUser?.id === profile.id

  const accuracy =
    profile.predictions_total > 0
      ? Math.round((profile.predictions_correct / profile.predictions_total) * 100)
      : 0

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-2xl">
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
              {(profile.display_name ?? profile.username ?? 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile.display_name ?? profile.username}</h1>
              {profile.username && (
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              )}
              {profile.favorite_team && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  ❤️ {profile.favorite_team}
                </p>
              )}
            </div>
          </div>

          {!isSelf && currentUser && (
            <FollowButton targetUserId={profile.id} initialFollowing={isFollowing} />
          )}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Palpites', value: profile.predictions_total },
            { label: 'Acertos', value: profile.predictions_correct },
            { label: '% Acerto', value: `${accuracy}%` },
            { label: 'Pontos', value: profile.points_total },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted/50 p-3 text-center">
              <div className="text-lg font-bold">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {profile.current_streak > 1 && (
          <div className="flex items-center gap-2 text-sm text-orange-500 font-medium">
            <span>🔥</span>
            <span>{profile.current_streak} acertos seguidos</span>
          </div>
        )}
      </section>

      {achievements && achievements.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Conquistas</h2>
          <div className="flex flex-wrap gap-2">
            {achievements.map(({ badge_key }) => {
              const meta = BADGE_META[badge_key as keyof typeof BADGE_META]
              if (!meta) return null
              return (
                <div
                  key={badge_key}
                  className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm"
                  title={meta.description}
                >
                  <span>{meta.icon}</span>
                  <span className="font-medium">{meta.label}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Palpites Recentes</h2>

        {predictions.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground text-sm">
            Nenhum palpite ainda.
          </div>
        ) : (
          <div className="space-y-2">
            {predictions.map((pred) => {
              const label = formatPrediction(
                pred.market as Market,
                pred.prediction,
                pred.home_team,
                pred.away_team
              )
              return (
                <div
                  key={pred.id}
                  className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">
                      {pred.league} · {new Date(pred.game_date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {pred.home_team} × {pred.away_team}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getMarketLabel(pred.market as Market)} → {label}
                      {pred.odds_at_time ? ` @ ${pred.odds_at_time}` : ''}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-semibold ${getResultColor(pred.result)}`}>
                      {getResultLabel(pred.result)}
                    </div>
                    {pred.result === 'correct' && pred.points_earned > 0 && (
                      <div className="text-xs text-green-600">+{pred.points_earned} pts</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
