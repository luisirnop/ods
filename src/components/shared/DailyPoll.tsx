'use client'

import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'

export interface PollGame {
  id: string
  homeTeam: string
  awayTeam: string
  league: string
  commenceTime: string
}

interface Votes {
  home: number
  draw: number
  away: number
}

const STORAGE_KEY = 'oddsbr_poll_vote'

export default function DailyPoll({ game }: { game: PollGame }) {
  const [voted, setVoted] = useState<'home' | 'draw' | 'away' | null>(null)
  const [votes, setVotes] = useState<Votes>({ home: 48, draw: 23, away: 29 })
  const [copied, setCopied] = useState(false)

  // Rehydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { gameId, choice, counts } = JSON.parse(stored)
        if (gameId === game.id) {
          setVoted(choice)
          setVotes(counts)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {}
  }, [game.id])

  function vote(choice: 'home' | 'draw' | 'away') {
    if (voted) return
    const next: Votes = {
      ...votes,
      [choice]: votes[choice] + 1,
    }
    setVoted(choice)
    setVotes(next)
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ gameId: game.id, choice, counts: next }),
      )
    } catch {}
  }

  const total = votes.home + votes.draw + votes.away
  const pct = (n: number) => Math.round((n / total) * 100)

  const kickoff = new Date(game.commenceTime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const options: { key: 'home' | 'draw' | 'away'; label: string; count: number }[] = [
    { key: 'home', label: game.homeTeam, count: votes.home },
    { key: 'draw', label: 'Empate',      count: votes.draw  },
    { key: 'away', label: game.awayTeam, count: votes.away  },
  ]

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 -mx-4 px-4 py-2 bg-[oklch(0.10_0.010_253)] rounded-t-none">
        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Enquete do dia
        </span>
      </div>

      {/* Jogo */}
      <div className="rounded-xl border border-white/8 bg-card p-3 space-y-2.5">
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">{game.league} · {kickoff}</p>
          <p className="text-sm font-bold text-white leading-snug">
            {game.homeTeam} <span className="text-muted-foreground font-normal">×</span> {game.awayTeam}
          </p>
          <p className="text-[11px] font-semibold text-green-400">Quem vai vencer?</p>
        </div>

        {/* Opções */}
        <div className="space-y-1.5">
          {options.map(({ key, label, count }) => {
            const p = pct(count)
            const isVoted = voted === key
            const showResult = !!voted

            return (
              <button
                key={key}
                onClick={() => vote(key)}
                disabled={!!voted}
                className={`
                  relative w-full rounded-lg overflow-hidden text-left transition-all
                  ${!voted ? 'hover:border-green-500/40 hover:bg-white/5 border border-white/8 bg-white/3 cursor-pointer' : 'cursor-default border border-transparent'}
                  ${isVoted ? 'border-green-500/50 bg-green-500/8' : ''}
                `}
              >
                {/* Barra de progresso */}
                {showResult && (
                  <div
                    className={`absolute inset-0 rounded-lg transition-all duration-700 ${isVoted ? 'bg-green-500/15' : 'bg-white/4'}`}
                    style={{ width: `${p}%` }}
                  />
                )}

                <div className="relative flex items-center justify-between px-3 py-2">
                  <span className={`text-xs font-medium truncate ${isVoted ? 'text-green-300' : 'text-white/80'}`}>
                    {label}
                    {isVoted && <span className="ml-1.5 text-green-400">✓</span>}
                  </span>
                  {showResult && (
                    <span className={`text-xs font-bold shrink-0 ml-2 ${isVoted ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {p}%
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Total de votos */}
        {voted && (
          <p className="text-[10px] text-muted-foreground/60 text-center">
            {total.toLocaleString('pt-BR')} votos
          </p>
        )}
      </div>

    </div>
  )
}
