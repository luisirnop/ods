import type { Metadata } from 'next'
import Link from 'next/link'
import { getRecentArticles } from '@/lib/articles'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Notícias e Palpites — OddsBR',
  description:
    'Análises e palpites para os jogos de futebol brasileiro. Gerado por IA com base nos jogos do dia.',
}

const TYPE_LABELS: Record<string, string> = {
  prediction: 'Palpite',
  news: 'Notícia',
  guide: 'Guia',
  recap: 'Recapitulação',
}

export default async function NoticiasPage() {
  const articles = await getRecentArticles(30)

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Notícias e Palpites</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Análises geradas por IA para os principais jogos do futebol brasileiro.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center space-y-2">
          <p className="text-muted-foreground text-sm">Nenhum artigo publicado ainda.</p>
          <p className="text-muted-foreground text-xs">
            Artigos são gerados automaticamente todos os dias às 6h.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => {
            const date = new Date(article.published_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            })
            return (
              <Link
                key={article.id}
                href={`/noticias/${article.slug}`}
                className="block rounded-xl border bg-card p-4 hover:border-green-500/40 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      {article.article_type && (
                        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                          {TYPE_LABELS[article.article_type] ?? article.article_type}
                        </span>
                      )}
                      {article.league && <span>{article.league}</span>}
                      <span>·</span>
                      <span>[IA]</span>
                    </div>
                    <p className="font-semibold text-sm leading-snug">{article.title}</p>
                    {article.meta_description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.meta_description}
                      </p>
                    )}
                    {article.home_team && article.away_team && (
                      <p className="text-xs text-muted-foreground">
                        {article.home_team} × {article.away_team}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{date}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Artigos marcados com [IA] são gerados automaticamente pelo OddsBR.
        Consulte sempre fontes oficiais antes de apostar.
      </p>
    </div>
  )
}
