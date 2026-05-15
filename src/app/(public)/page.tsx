import type { Metadata } from 'next'
import Link from 'next/link'
import GameCard from '@/components/games/GameCard'
import { MOCK_GAMES } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getLatestNews } from '@/lib/articles'
import BonusTicker from '@/components/shared/BonusTicker'
import NewsCardsSection from '@/components/shared/NewsCardsSection'
import { BarChart3, Zap, Trophy, TrendingUp, Newspaper } from 'lucide-react'

export const metadata: Metadata = {
  title: 'OddsBR — Comparador de Odds em Tempo Real',
  description:
    'Compare odds das melhores casas de apostas do Brasil em tempo real. Palpites, rankings e análises de futebol.',
}

const STATS = [
  { label: 'Casas comparadas',  value: '5+',   icon: BarChart3  },
  { label: 'Jogos hoje',        value: '12+',   icon: Trophy     },
  { label: 'Tipsters ativos',   value: '200+',  icon: TrendingUp },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let favoriteTeam: string | null = null
  const [latestNews] = await Promise.all([
    getLatestNews(5),
    (async () => {
      if (!user) return
      const admin = getAdminClient()
      const { data: profile } = await admin
        .from('profiles')
        .select('favorite_team')
        .eq('id', user.id)
        .single()
      favoriteTeam = profile?.favorite_team ?? null
    })(),
  ])

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + 1)
  cutoff.setHours(23, 59, 59)

  const todayGames = MOCK_GAMES.filter((g) => new Date(g.commence_time) <= cutoff)
  const upcomingGames = MOCK_GAMES.filter((g) => new Date(g.commence_time) > cutoff)

  const favoriteGames = favoriteTeam
    ? todayGames.filter(
        (g) =>
          g.home_team.toLowerCase().includes(favoriteTeam!.toLowerCase()) ||
          g.away_team.toLowerCase().includes(favoriteTeam!.toLowerCase())
      )
    : []
  const otherGames = favoriteTeam
    ? todayGames.filter((g) => !favoriteGames.includes(g))
    : todayGames

  return (
    <div className="min-h-screen">
      {/* Hero — compacto */}
      <section className="relative hero-gradient px-4 py-6 overflow-hidden">
        {/* Glow orb */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="w-[500px] h-[160px] rounded-full bg-green-500/8 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Esquerda: título + descrição */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/8 px-3 py-1 text-[11px] font-semibold text-green-400">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Odds atualizadas em tempo real
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Compare as melhores <span className="text-neon">odds do Brasil</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Melhor odd entre as principais casas · Aposte com estratégia
            </p>
          </div>

          {/* Direita: stats + CTAs */}
          <div className="flex flex-col gap-3 sm:items-end">
            {/* Stats em linha */}
            <div className="flex items-center gap-5">
              {STATS.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-sm font-bold text-white">{value}</span>
                  <span className="text-[11px] text-muted-foreground hidden sm:block">{label}</span>
                </div>
              ))}
            </div>
            {/* CTAs */}
            <div className="flex items-center gap-2">
              <Link
                href="/odds"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-black px-4 text-sm font-bold transition-colors neon-glow-sm"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Comparar odds
              </Link>
              {!user && (
                <Link
                  href="/cadastro"
                  className="inline-flex h-9 items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 text-sm font-medium transition-colors"
                >
                  Criar conta →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Banner de bônus */}
        <BonusTicker />

        {/* Notícias da semana */}
        <NewsCardsSection />

        {/* Jogos do time favorito */}
        {favoriteTeam && favoriteGames.length > 0 && (
          <section className="space-y-4">
            <SectionHeader
              title={`Jogos do ${favoriteTeam}`}
              subtitle="Seu time favorito"
              href="/odds"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteGames.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>
        )}

        {/* Jogos de hoje */}
        {otherGames.length > 0 && (
          <section className="space-y-4">
            <SectionHeader
              title={favoriteTeam ? 'Outros jogos de hoje' : 'Jogos de Hoje e Amanhã'}
              href="/odds"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherGames.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>
        )}

        {/* Próximos */}
        {upcomingGames.length > 0 && (
          <section className="space-y-4">
            <SectionHeader title="Próximos Jogos" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingGames.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>
        )}

        {/* Últimas notícias */}
        {latestNews.length > 0 && (
          <section className="space-y-4">
            <SectionHeader
              title="Últimas Notícias"
              icon={<Newspaper className="w-4 h-4 text-green-500" />}
              href="/noticias"
            />
            <div className="space-y-2">
              {latestNews.map((article) => {
                const timeAgo = (() => {
                  const diff = Date.now() - new Date(article.published_at).getTime()
                  const h = Math.floor(diff / 3600000)
                  const m = Math.floor(diff / 60000)
                  if (h >= 1) return `${h}h`
                  if (m >= 1) return `${m}min`
                  return 'agora'
                })()
                return (
                  <Link
                    key={article.id}
                    href={`/noticias/${article.slug}`}
                    className="card-hover flex items-start gap-3 rounded-xl border border-white/8 bg-card p-3 hover:bg-card/80 transition-colors"
                  >
                    <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5 w-10 text-right">
                      {timeAgo}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug line-clamp-2 text-white/90">
                        {article.title}
                      </p>
                      {article.league && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{article.league}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* CTA time favorito */}
        {user && !favoriteTeam && (
          <div className="card-hover rounded-xl border border-green-500/15 bg-green-500/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-white">Personalize sua home</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Configure seu time favorito para ver os jogos dele em destaque.
              </p>
            </div>
            <Link
              href="/perfil"
              className="shrink-0 rounded-lg bg-green-500 hover:bg-green-400 text-black px-3 py-1.5 text-xs font-bold transition-colors"
            >
              Configurar →
            </Link>
          </div>
        )}

        {/* Copa 2026 CTA */}
        <section className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-transparent p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-2xl">🏆</div>
            <p className="font-extrabold text-lg text-white">Copa do Mundo 2026</p>
            <p className="text-sm text-muted-foreground">
              Faça seu bolão, veja análises de IA e compare odds de cada seleção.
            </p>
          </div>
          <Link
            href="/copa-2026"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 text-sm font-bold transition-colors whitespace-nowrap"
          >
            Acessar Copa 2026 →
          </Link>
        </section>

        {/* Demo notice */}
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-500/80 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          Exibindo dados de demonstração. Configure a chave da The Odds API para ver odds reais.
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  title,
  subtitle,
  href,
  icon,
}: {
  title: string
  subtitle?: string
  href?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {href && (
        <Link href={href} className="text-xs text-green-500 hover:text-green-400 transition-colors">
          Ver todos →
        </Link>
      )}
    </div>
  )
}
