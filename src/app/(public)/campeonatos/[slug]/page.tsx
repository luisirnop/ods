import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import GameCard from '@/components/games/GameCard'
import LeagueStandings from '@/components/shared/LeagueStandings'
import BonusTicker from '@/components/shared/BonusTicker'
import { getStandings, getLiveMatches } from '@/lib/football-api'
import { getOdds, isSportKey } from '@/lib/odds-api'
import { LEAGUES_BY_SLUG, LEAGUES_CONFIG } from '@/lib/leagues'
import { MOCK_GAMES } from '@/lib/mock-data'
import { BarChart3, Trophy, Radio } from 'lucide-react'

export async function generateStaticParams() {
  return LEAGUES_CONFIG.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const league = LEAGUES_BY_SLUG[slug]
  if (!league) return {}
  return {
    title: `${league.name} 2026 — Tabela e Odds | OddsBR`,
    description: `Tabela de classificação da ${league.name} com odds em tempo real das melhores casas de apostas.`,
  }
}

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const league = LEAGUES_BY_SLUG[slug]
  if (!league) notFound()

  const sportKey = isSportKey(league.sportKey) ? league.sportKey : null

  const [standings, apiGames, liveMatches] = await Promise.all([
    getStandings(league.leagueId),
    sportKey ? getOdds(sportKey).catch(() => null) : Promise.resolve(null),
    getLiveMatches(),
  ])

  const leagueLive = liveMatches.filter((m) => m.leagueId === league.leagueId)

  const games = apiGames?.length
    ? apiGames
    : MOCK_GAMES.filter((g) => g.sport_key === league.sportKey)

  const hasStandings = standings.length > 0

  return (
    <div className="min-h-screen">
      {/* Header da liga */}
      <section className="hero-gradient px-4 py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-xl bg-white/10 p-2">
            <Image
              src={league.logo}
              alt={league.name}
              width={56}
              height={56}
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{league.country}</p>
            <h1 className="text-2xl font-extrabold text-white truncate">{league.name}</h1>
            <p className="text-sm text-muted-foreground">Temporada 2025/2026</p>
          </div>

          {/* Outras ligas */}
          <div className="ml-auto hidden lg:flex items-center gap-2 flex-wrap justify-end">
            {LEAGUES_CONFIG.filter((l) => l.slug !== slug).slice(0, 5).map((l) => (
              <Link
                key={l.slug}
                href={`/campeonatos/${l.slug}`}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              >
                <Image src={l.logo} alt={l.name} width={16} height={16} className="object-contain" unoptimized />
                <span className="hidden xl:block">{l.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <BonusTicker />

        {/* Jogos ao vivo desta liga */}
        {leagueLive.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400" />
              <h2 className="text-base font-bold text-white">Ao vivo agora</h2>
              <span className="live-dot w-2 h-2 rounded-full bg-red-400 inline-block" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {leagueLive.map((match) => (
                <div
                  key={match.id}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex items-center justify-between gap-3"
                >
                  <span className="text-sm font-medium text-white/90 truncate">{match.home.name}</span>
                  <span className="shrink-0 text-base font-extrabold text-white px-2">
                    {match.home.score} – {match.away.score}
                  </span>
                  <span className="text-sm font-medium text-white/90 truncate text-right">{match.away.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabela + Jogos */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Tabela de classificação */}
          <section className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-500" />
              <h2 className="text-lg font-bold text-white">Classificação</h2>
              {hasStandings && (
                <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                  Tempo real
                </span>
              )}
            </div>

            {hasStandings ? (
              <>
                <LeagueStandings teams={standings} />
                <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Classificação / Fase de grupos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Play-off
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Rebaixamento / Eliminação
                  </span>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-white/8 bg-card p-8 text-center space-y-2">
                <p className="text-muted-foreground text-sm">Tabela não disponível para esta fase da competição.</p>
                <p className="text-muted-foreground/60 text-xs">Pode ser um torneio por mata-mata ou fora de temporada.</p>
              </div>
            )}
          </section>

          {/* Próximos jogos e odds */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                <h2 className="text-lg font-bold text-white">Próximos Jogos</h2>
              </div>
              {sportKey && (
                <Link
                  href={`/odds?sport=${league.sportKey}`}
                  className="text-xs text-green-500 hover:text-green-400 transition-colors"
                >
                  Comparar odds →
                </Link>
              )}
            </div>

            {games.length > 0 ? (
              <div className="space-y-3">
                {games.slice(0, 8).map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/8 bg-card p-6 text-center text-muted-foreground text-sm">
                Nenhum jogo disponível no momento.
              </div>
            )}
          </section>
        </div>

        {/* Navegar para outras ligas */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Outras competições</h2>
          <div className="flex flex-wrap gap-2">
            {LEAGUES_CONFIG.filter((l) => l.slug !== slug).map((l) => (
              <Link
                key={l.slug}
                href={`/campeonatos/${l.slug}`}
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-card hover:border-white/20 hover:bg-white/5 px-3 py-2 transition-colors"
              >
                <Image src={l.logo} alt={l.name} width={20} height={20} className="object-contain" unoptimized />
                <span className="text-xs font-medium text-muted-foreground hover:text-white">{l.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
