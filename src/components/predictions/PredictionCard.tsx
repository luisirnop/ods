'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { likePrediction, toggleFollow } from '@/actions/palpites'
import { formatPrediction, getMarketLabel, getResultColor, getResultLabel, getConfidenceLabel } from '@/lib/predictions'
import type { Market, PredictionResult } from '@/types'

type PredictionWithProfile = {
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

interface Props {
  prediction: PredictionWithProfile
  isLiked: boolean
  isFollowing: boolean
  currentUserId: string | null
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

export default function PredictionCard({ prediction, isLiked, isFollowing, currentUserId }: Props) {
  const [liked, setLiked] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(prediction.likes_count)
  const [following, setFollowing] = useState(isFollowing)
  const [isPendingLike, startLike] = useTransition()
  const [isPendingFollow, startFollow] = useTransition()

  const profile = prediction.profiles
  const displayName = profile?.display_name ?? 'Anônimo'
  const username = profile?.username
  const tipsterUrl = username ? `/tipsters/${username}` : null

  const predictionLabel = formatPrediction(
    prediction.market,
    prediction.prediction,
    prediction.home_team,
    prediction.away_team
  )

  function handleLike() {
    if (!currentUserId) return
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount((c) => c + (newLiked ? 1 : -1))
    startLike(async () => {
      const result = await likePrediction(prediction.id)
      if ('error' in result) {
        setLiked(!newLiked)
        setLikesCount((c) => c + (newLiked ? -1 : 1))
      }
    })
  }

  function handleFollow() {
    if (!currentUserId || !profile?.id) return
    const newFollowing = !following
    setFollowing(newFollowing)
    startFollow(async () => {
      const result = await toggleFollow(profile.id)
      if ('error' in result) {
        setFollowing(!newFollowing)
      }
    })
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 hover:border-muted-foreground/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            {tipsterUrl ? (
              <Link href={tipsterUrl} className="text-sm font-medium hover:underline truncate block">
                {displayName}
              </Link>
            ) : (
              <span className="text-sm font-medium truncate block">{displayName}</span>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo(prediction.created_at)}</span>
          </div>
        </div>

        {currentUserId && profile?.id && currentUserId !== profile.id && (
          <button
            onClick={handleFollow}
            disabled={isPendingFollow}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
              following
                ? 'border-muted text-muted-foreground hover:border-red-500/50 hover:text-red-500'
                : 'border-green-500 text-green-600 hover:bg-green-500/10'
            }`}
          >
            {following ? 'Seguindo' : '+ Seguir'}
          </button>
        )}
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1">
          {prediction.league} · {new Date(prediction.game_date).toLocaleDateString('pt-BR')}
        </div>
        <div className="font-medium text-sm">
          {prediction.home_team} × {prediction.away_team}
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 px-3 py-2.5 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground mb-0.5">{getMarketLabel(prediction.market)}</div>
          <div className="font-semibold text-sm">{predictionLabel}</div>
          {prediction.odds_at_time && (
            <div className="text-xs text-muted-foreground mt-0.5">@ {prediction.odds_at_time}</div>
          )}
        </div>

        <div className="text-right shrink-0">
          <div className={`text-sm font-semibold ${getResultColor(prediction.result)}`}>
            {getResultLabel(prediction.result)}
          </div>
          {prediction.result === 'correct' && prediction.points_earned > 0 && (
            <div className="text-xs text-green-600 font-medium">+{prediction.points_earned} pts</div>
          )}
          <div className="text-xs text-yellow-500 mt-0.5">
            {getConfidenceLabel(prediction.confidence)}
          </div>
        </div>
      </div>

      {prediction.justification && (
        <p className="text-sm text-muted-foreground italic line-clamp-2">
          "{prediction.justification}"
        </p>
      )}

      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={handleLike}
          disabled={isPendingLike || !currentUserId}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked
              ? 'text-red-500 hover:text-red-400'
              : 'text-muted-foreground hover:text-foreground'
          } disabled:opacity-50`}
        >
          <span>{liked ? '♥' : '♡'}</span>
          <span>{likesCount}</span>
        </button>

        {prediction.result === 'correct' && (
          <Link
            href={`/api/og/palpite/${prediction.id}`}
            target="_blank"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
          >
            Compartilhar ↗
          </Link>
        )}
      </div>
    </div>
  )
}
