import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug } from '@/lib/articles'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Artigo não encontrado — OddsBR' }

  return {
    title: `${article.title} — OddsBR`,
    description: article.meta_description ?? undefined,
    openGraph: {
      title: article.title,
      description: article.meta_description ?? undefined,
      type: 'article',
      publishedTime: article.published_at,
      tags: [article.league ?? '', article.home_team ?? '', article.away_team ?? ''].filter(Boolean),
    },
  }
}

function ArticleContent({ content }: { content: string }) {
  const cleaned = content.replace(/^\[Gerado por IA\]\s*/i, '').trim()

  const blocks = cleaned.split('\n\n').map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="text-lg font-semibold mt-6 mb-2 text-foreground">
          {trimmed.slice(4)}
        </h3>
      )
    }
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const level = trimmed.startsWith('## ') ? 3 : 2
      const text = trimmed.replace(/^#+\s/, '')
      return (
        <h2 key={i} className={`font-bold mt-8 mb-3 text-foreground ${level === 2 ? 'text-2xl' : 'text-xl'}`}>
          {text}
        </h2>
      )
    }

    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g)
    return (
      <p key={i} className="mb-4 text-muted-foreground leading-7">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j} className="text-foreground font-semibold">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    )
  })

  return <div>{blocks}</div>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const publishedDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-2">
        <Link href="/" className="hover:text-foreground transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link href="/noticias" className="hover:text-foreground transition-colors">
          Notícias
        </Link>
        <span>/</span>
        <span className="truncate max-w-[200px]">{article.title}</span>
      </nav>

      <article className="space-y-6">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
              [Gerado por IA]
            </span>
            {article.article_type === 'prediction' && (
              <span className="rounded-full bg-green-500/10 px-2.5 py-1 font-medium text-green-600">
                Palpite
              </span>
            )}
            {article.league && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                {article.league}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold leading-snug">{article.title}</h1>

          {article.meta_description && (
            <p className="text-muted-foreground text-base leading-relaxed">
              {article.meta_description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
            <time dateTime={article.published_at}>{publishedDate}</time>
            {article.home_team && article.away_team && (
              <span>
                {article.home_team} × {article.away_team}
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <ArticleContent content={article.content} />

        {/* CTA */}
        <div className="rounded-xl border bg-card p-5 space-y-3 mt-8">
          <p className="font-semibold text-sm">Pronto para apostar?</p>
          <p className="text-sm text-muted-foreground">
            Compare as odds para este jogo nas principais casas de apostas do Brasil.
          </p>
          <div className="flex gap-3">
            <Link
              href="/odds"
              className="inline-flex items-center rounded-lg bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold transition-colors"
            >
              Comparar odds →
            </Link>
            <Link
              href="/palpites"
              className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Ver palpites
            </Link>
          </div>
        </div>
      </article>

      {/* Back */}
      <Link href="/noticias" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Voltar para notícias
      </Link>
    </div>
  )
}
