import type { Metadata } from 'next'
import Link from 'next/link'
import GameCard from '@/components/games/GameCard'
import { MOCK_GAMES } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getLatestNews } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'OddsBR — Comparador de Odds em Tempo Real',
  description:
    'Compare odds das melhores casas de apostas do Brasil em tempo real. Palpites, rankings e análises de futebol.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Compare as melhores{' '}
          <span className="text-green-500">odds do Brasil</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre a melhor odd em tempo real entre as principais casas de apostas.
          Aposte com estratégia — compare antes de decidir.
        </p>
        {!user && (
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="inline-flex h-10 items-center rounded-lg bg-green-500 hover:bg-green-600 text-white px-5 text-sm font-semibold transition-colors"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/quiz"
              className="inline-flex h-10 items-center rounded-lg border px-5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Quiz do dia →
            </Link>
          </div>
        )}
      </section>

      {/* Jogos do time favorito */}
      {favoriteTeam && favoriteGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Jogos do {favoriteTeam}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Seu time favorito</p>
            </div>
            <Link href="/odds" className="text-sm text-green-600 hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Jogos de hoje e amanhã */}
      {otherGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {favoriteTeam ? 'Outros jogos de hoje' : 'Jogos de Hoje e Amanhã'}
            </h2>
            {!favoriteTeam && (
              <Link href="/odds" className="text-sm text-green-600 hover:underline">
                Ver todos →
              </Link>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Próximos jogos */}
      {upcomingGames.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Próximos Jogos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Últimas notícias */}
      {latestNews.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Últimas Notícias</h2>
            <Link href="/noticias" className="text-sm text-green-600 hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-2">
            {latestNews.map((article) => {
              const timeAgo = (() => {
                const diff = Date.now() - new Date(article.published_at).getTime()
                const h = Math.floor(diff / 3600000)
                const m = Math.floor(diff / 60000)
                if (h >= 1) return `${h}h atrás`
                if (m >= 1) return `${m}min atrás`
                return 'agora'
              })()
              return (
                <Link
                  key={article.id}
                  href={`/noticias/${article.slug}`}
                  className="flex items-start gap-3 rounded-xl border bg-card p-3 hover:border-green-500/30 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xs text-muted-foreground shrink-0 mt-0.5 w-14 text-right">
                    {timeAgo}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-2">{article.title}</p>
                    {article.league && (
                      <p className="text-xs text-muted-foreground mt-0.5">{article.league}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* CTA para usuários sem time favorito */}
      {user && !favoriteTeam && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">Personalize sua home</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Configure seu time favorito para ver os jogos dele em destaque.
            </p>
          </div>
          <Link
            href="/perfil"
            className="shrink-0 rounded-lg bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            Configurar →
          </Link>
        </div>
      )}

      {/* Aviso dados mock */}
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
        Exibindo dados de demonstração. Configure a chave da The Odds API para ver odds reais.
      </div>
    </div>
  )
}
