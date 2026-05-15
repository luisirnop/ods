'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Radio } from 'lucide-react'
import type { LiveMatch } from '@/lib/football-api'
import { LEAGUES_CONFIG } from '@/lib/leagues'

// IDs de ligas que queremos exibir
const KNOWN_LEAGUE_IDS = new Set([
  ...LEAGUES_CONFIG.map((l) => l.leagueId),
  9067,   // Brasileirão Série C
  8971,   // Série C (variante)
])

// Mapa leagueId → nome curto para display
const LEAGUE_NAMES: Record<number, string> = {
  268:  'Brasileirão A',
  8814: 'Brasileirão B',
  9067: 'Série C',
  45:   'Libertadores',
  299:  'Sul-Americana',
  42:   'Champions',
  73:   'Europa League',
  47:   'Premier League',
  87:   'La Liga',
  55:   'Serie A',
  54:   'Bundesliga',
  53:   'Ligue 1',
  77:   'Copa do Mundo',
}

// Mapa leagueId → slug da página de campeonato
const LEAGUE_SLUG: Record<number, string> = {
  268:  'brasileirao-a',
  8814: 'brasileirao-b',
  45:   'libertadores',
  299:  'sul-americana',
  42:   'champions',
  73:   'europa-league',
  47:   'premier-league',
  87:   'la-liga',
  55:   'serie-a',
  54:   'bundesliga',
  53:   'ligue-1',
}

const REFRESH_MS = 60_000 // atualiza a cada 60s

export default function LiveScoreWidget({ initial }: { initial: LiveMatch[] }) {
  const [matches, setMatches] = useState<LiveMatch[]>(initial)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/live', { cache: 'no-store' })
      if (res.ok) {
        const data: LiveMatch[] = await res.json()
        setMatches(data)
        setLastUpdated(new Date())
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(refresh, REFRESH_MS)
    return () => clearInterval(id)
  }, [refresh])

  const filtered = matches
    .filter((m) => KNOWN_LEAGUE_IDS.has(m.leagueId))
    .slice(0, 12)

  if (filtered.length === 0) return null

  // Agrupa por liga
  const byLeague = filtered.reduce<Record<number, LiveMatch[]>>((acc, m) => {
    if (!acc[m.leagueId]) acc[m.leagueId] = []
    acc[m.leagueId].push(m)
    return acc
  }, {})

  const updatedStr = lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-400" />
          <h2 className="text-lg font-bold text-white">Ao vivo agora</h2>
          <span className={`live-dot w-2 h-2 rounded-full bg-red-400 inline-block ${loading ? 'opacity-50' : ''}`} />
        </div>
        <span className="text-[10px] text-muted-foreground/50">atualizado {updatedStr}</span>
      </div>

      {/* Cards por liga */}
      <div className="space-y-4">
        {Object.entries(byLeague).map(([leagueIdStr, leagueMatches]) => {
          const leagueId = Number(leagueIdStr)
          const leagueName = LEAGUE_NAMES[leagueId] ?? 'Futebol'
          const slug = LEAGUE_SLUG[leagueId]

          return (
            <div key={leagueId} className="space-y-2">
              {/* Nome da liga */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {leagueName}
                </span>
                {slug && (
                  <Link
                    href={`/campeonatos/${slug}`}
                    className="text-[10px] text-green-500 hover:text-green-400 transition-colors"
                  >
                    Ver liga →
                  </Link>
                )}
              </div>

              {/* Jogos */}
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {leagueMatches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 hover:border-red-500/35 transition-colors p-3"
                  >
                    {/* Minuto */}
                    {match.status.liveTime && (
                      <div className="flex items-center gap-1 mb-2">
                        <span className="live-dot w-1.5 h-1.5 rounded-full bg-red-400 inline-block shrink-0" />
                        <span className="text-[10px] font-bold text-red-400">{match.status.liveTime.long}&apos;</span>
                      </div>
                    )}

                    {/* Placar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white/90 truncate flex-1 text-right">
                        {match.home.name}
                      </span>
                      <span className="shrink-0 text-sm font-extrabold text-white bg-white/10 rounded-lg px-2.5 py-1 tabular-nums">
                        {match.home.score} – {match.away.score}
                      </span>
                      <span className="text-xs font-medium text-white/90 truncate flex-1">
                        {match.away.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
