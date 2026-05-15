import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Users, PlayCircle, ExternalLink, Trophy, ArrowLeft } from 'lucide-react'
import { TEAMS_BY_SLUG, TEAMS_CONFIG } from '@/lib/teams'
import { LEAGUES_BY_SLUG } from '@/lib/leagues'
import {
  getTeamSquad,
  getTeamNews,
  getStandings,
  FOTMOB_TEAM_LOGO,
} from '@/lib/football-api'

export async function generateStaticParams() {
  return Object.keys(TEAMS_BY_SLUG).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const team = TEAMS_BY_SLUG[slug]
  if (!team) return {}
  return {
    title: `${team.name} — Times | OddsBR`,
    description: `Elenco, estatísticas e notícias do ${team.name}.`,
  }
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const team = TEAMS_BY_SLUG[slug]
  if (!team) notFound()

  const league = LEAGUES_BY_SLUG[team.leagueSlug]

  const [squad, news, standings] = await Promise.all([
    getTeamSquad(team.fotmobId),
    getTeamNews(team.fotmobId),
    getStandings(team.leagueId),
  ])

  const standing = standings.find((s) => s.id === team.fotmobId)

  const sameLeagueTeams = TEAMS_CONFIG.filter(
    (t) => t.slug !== slug && t.leagueSlug === team.leagueSlug
  ).slice(0, 9)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back link */}
      {league && (
        <Link
          href={`/campeonatos/${league.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {league.name}
        </Link>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <Image
            src={team.logo}
            alt={team.name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white leading-tight">{team.name}</h1>
          {league && (
            <div className="flex items-center gap-2">
              <Image
                src={league.logo}
                alt={league.name}
                width={16}
                height={16}
                unoptimized
                className="object-contain"
              />
              <span className="text-sm text-muted-foreground">{league.name}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-sm text-muted-foreground">{league.country}</span>
            </div>
          )}
          {standing && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-2xl font-extrabold text-white">{standing.rank}º</span>
              <span className="text-sm text-muted-foreground">na tabela</span>
              <span className="font-bold text-white">{standing.points} pts</span>
              <span className="text-sm text-muted-foreground">{standing.played} jogos</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      {standing && (
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {(
            [
              { label: 'Posição',  value: `${standing.rank}º`  },
              { label: 'Pontos',   value: standing.points       },
              { label: 'Vitórias', value: standing.wins         },
              { label: 'Empates',  value: standing.draws        },
              { label: 'Derrotas', value: standing.losses       },
              { label: 'Gols',     value: standing.goals        },
              {
                label: 'SG',
                value: standing.goalDiff >= 0 ? `+${standing.goalDiff}` : standing.goalDiff,
              },
            ] as { label: string; value: string | number }[]
          ).map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-white/8 bg-card p-3 text-center"
            >
              <div className="text-xl font-extrabold text-white">{value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Squad */}
        {squad && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              Elenco
            </h2>
            <div className="space-y-4">
              {(
                [
                  { label: 'Goleiros',      players: squad.keepers     },
                  { label: 'Defensores',    players: squad.defenders   },
                  { label: 'Meio-campistas',players: squad.midfielders },
                  { label: 'Atacantes',     players: squad.attackers   },
                ] as const
              ).map(({ label, players }) =>
                players.length > 0 ? (
                  <div key={label}>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-1.5">
                      {label}
                    </div>
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      {players.map((p, i) => (
                        <div
                          key={p.id}
                          className={`flex items-center gap-3 px-3 py-2 text-sm ${
                            i > 0 ? 'border-t border-white/5' : ''
                          }`}
                        >
                          <span className="w-6 text-center text-xs font-bold text-muted-foreground/60 tabular-nums">
                            {p.shirtNumber || '–'}
                          </span>
                          <span className="flex-1 text-white/90 truncate">{p.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{p.age}a</span>
                          {p.goals > 0 && (
                            <span className="text-xs text-green-400 font-bold shrink-0">
                              {p.goals}G
                            </span>
                          )}
                          {p.assists > 0 && (
                            <span className="text-xs text-blue-400 shrink-0">{p.assists}A</span>
                          )}
                          {p.yellowCards > 0 && (
                            <span className="text-xs text-yellow-400 shrink-0">
                              {p.yellowCards}
                              <span className="text-[9px]">🟨</span>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}

              {squad.coach.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-1.5">
                    Comissão
                  </div>
                  <div className="rounded-xl border border-white/8 overflow-hidden">
                    {squad.coach.map((p, i) => (
                      <div
                        key={p.id}
                        className={`flex items-center gap-3 px-3 py-2 text-sm ${
                          i > 0 ? 'border-t border-white/5' : ''
                        }`}
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="flex-1 text-white/90 truncate">{p.name}</span>
                        {p.age > 0 && (
                          <span className="text-xs text-muted-foreground">{p.age}a</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* News */}
        {news.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-red-500" />
              Últimas notícias
            </h2>
            <div className="space-y-3">
              {news.map((n, i) => (
                <a
                  key={i}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-card p-3 hover:bg-white/5 transition-colors"
                >
                  {n.imageUrl && (
                    <div className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-white/5">
                      <Image
                        src={n.imageUrl}
                        alt={n.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/90 line-clamp-2 leading-snug">
                      {n.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <PlayCircle className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="text-[10px] text-muted-foreground">YouTube</span>
                      <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/50" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!squad && news.length === 0 && (
          <div className="lg:col-span-2 rounded-xl border border-white/8 bg-card p-8 text-center text-muted-foreground">
            Dados do time não disponíveis no momento. Tente novamente mais tarde.
          </div>
        )}
      </div>

      {/* ── Other teams in same league ─────────────────────────────────────── */}
      {sameLeagueTeams.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Outros times — {league?.name}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {sameLeagueTeams.map((t) => (
              <Link
                key={t.slug}
                href={`/times/${t.slug}`}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/8 hover:border-white/15 bg-card hover:bg-white/5 transition-colors"
              >
                <div className="relative w-10 h-10">
                  <Image
                    src={FOTMOB_TEAM_LOGO(t.fotmobId)}
                    alt={t.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="text-[10px] text-muted-foreground text-center truncate w-full leading-tight">
                  {t.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
