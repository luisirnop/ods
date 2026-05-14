import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Análises e Palpites da Copa 2026 — OddsBR',
  description:
    'Análises diárias e palpites gerados por IA para os jogos da Copa do Mundo 2026. Estatísticas, escalações e odds.',
}

export default async function CopaAnalisesPage() {
  const admin = getAdminClient()

  const { data: articles } = await admin
    .from('articles')
    .select('slug, title, meta_description, home_team, away_team, league, published_at, article_type, source_url')
    .eq('published', true)
    .or('league.ilike.%Copa do Mundo%,league.ilike.%World Cup%,league.ilike.%Copa 2026%')
    .order('published_at', { ascending: false })
    .limit(50)

  const hasArticles = (articles ?? []).length > 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <nav className="text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/copa-2026" className="hover:text-foreground transition-colors">
            Copa 2026
          </Link>
          <span>/</span>
          <span>Análises</span>
        </nav>
        <h1 className="text-3xl font-extrabold">Análises da Copa 2026</h1>
        <p className="text-muted-foreground">
          Palpites e análises gerados por IA para cada jogo da Copa do Mundo. Atualizados diariamente.
        </p>
      </div>

      {hasArticles ? (
        <div className="space-y-3">
          {(articles ?? []).map((article) => {
            const date = new Date(article.published_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            const isMatch = article.home_team && article.away_team

            return (
              <Link
                key={article.slug}
                href={`/noticias/${article.slug}`}
                className="group flex gap-4 rounded-xl border bg-card px-5 py-4 hover:border-green-500/30 transition-colors"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-green-500/10 text-green-600 px-2 py-0.5 font-medium">
                      🤖 IA
                    </span>
                    {article.league && <span>{article.league}</span>}
                    <time>{date}</time>
                  </div>
                  <h2 className="font-semibold text-sm leading-snug group-hover:text-green-600 transition-colors">
                    {article.title}
                  </h2>
                  {isMatch && (
                    <p className="text-xs text-muted-foreground">
                      {article.home_team} × {article.away_team}
                    </p>
                  )}
                  {article.meta_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.meta_description}
                    </p>
                  )}
                </div>
                <div className="text-muted-foreground group-hover:text-green-600 text-sm transition-colors shrink-0 pt-1">
                  →
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-10 text-center space-y-4">
          <div className="text-4xl">⏳</div>
          <h2 className="font-semibold">Análises em breve</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            As análises da Copa do Mundo 2026 serão publicadas automaticamente assim que os jogos forem
            confirmados. Volte em junho de 2026!
          </p>
          <Link
            href="/noticias"
            className="inline-flex items-center rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Ver todas as notícias
          </Link>
        </div>
      )}

      {/* CTA premium */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold text-amber-600">⚡ Quer ver value bets da Copa?</p>
          <p className="text-sm text-muted-foreground">
            Com o Premium, você vê quais casas oferecem odds acima do valor justo para cada jogo.
          </p>
        </div>
        <Link
          href="/premium"
          className="inline-flex items-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-sm font-bold transition-colors whitespace-nowrap"
        >
          Ver plano Premium →
        </Link>
      </div>
    </div>
  )
}
