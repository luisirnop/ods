import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import GameCard from '@/components/games/GameCard'
import LeagueStandings from '@/components/shared/LeagueStandings'
import BonusTicker from '@/components/shared/BonusTicker'
import { getStandings, FOTMOB_LEAGUE_LOGO, LEAGUE_IDS } from '@/lib/football-api'
import { getOdds, SPORTS } from '@/lib/odds-api'
import { MOCK_GAMES } from '@/lib/mock-data'
import { BarChart3, Trophy } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Brasileirão Série A 2026 — Tabela e Odds | OddsBR',
  description: 'Tabela de classificação do Brasileirão Série A 2026 com odds em tempo real das melhores casas de apostas.',
}

export default async function BrasileiraoPage() {
  const [standings, apiGames] = await Promise.all([
    getStandings(LEAGUE_IDS.BRASILEIRAO_A),
    getOdds(SPORTS.BRASILEIRAO_A).catch(() => null),
  ])

  const games = apiGames?.length ? apiGames : MOCK_GAMES.filter(g => g.sport_key === SPORTS.BRASILEIRAO_A)

  return (
    <div className="min-h-screen">
      {/* Header da liga */}
      <section className="relative hero-gradient px-4 py-6 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-xl bg-white/10 p-2">
            <Image
              src={FOTMOB_LEAGUE_LOGO(LEAGUE_IDS.BRASILEIRAO_A)}
              alt="Brasileirão Série A"
              width={56}
              height={56}
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Brasil</p>
            <h1 className="text-2xl font-extrabold text-white">Brasileirão Série A</h1>
            <p className="text-sm text-muted-foreground">Temporada 2026</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <BonusTicker />

        {/* Tabela + Jogos lado a lado no desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Tabela de classificação */}
          <section className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-500" />
              <h2 className="text-lg font-bold text-white">Classificação</h2>
              {standings.length > 0 && (
                <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                  Ao vivo
                </span>
              )}
            </div>

            {standings.length > 0 ? (
              <LeagueStandings teams={standings} />
            ) : (
              <div className="rounded-xl border border-white/8 bg-card p-6 text-center text-muted-foreground text-sm">
                Tabela indisponível no momento.
              </div>
            )}

            {/* Legenda */}
            <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Libertadores</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Pré-Libertadores</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Rebaixamento</span>
            </div>
          </section>

          {/* Próximos jogos */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                <h2 className="text-lg font-bold text-white">Próximos Jogos</h2>
              </div>
              <Link href={`/odds?sport=${SPORTS.BRASILEIRAO_A}`} className="text-xs text-green-500 hover:text-green-400">
                Ver odds →
              </Link>
            </div>

            {games.length > 0 ? (
              <div className="space-y-3">
                {games.slice(0, 6).map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum jogo disponível no momento.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
