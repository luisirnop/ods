import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GUIDES, getGuideBySlug } from '@/lib/guides'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) return { title: 'Guia não encontrado — OddsBR' }

  return {
    title: `${guide.title} — OddsBR`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      modifiedTime: guide.updatedAt,
    },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  fundamentos: 'Fundamentos',
  estrategia: 'Estratégia',
  mercados: 'Mercados',
  gestao: 'Gestão',
}

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) notFound()

  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3)

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-2">
        <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
        <span>/</span>
        <Link href="/guias" className="hover:text-foreground transition-colors">Guias</Link>
        <span>/</span>
        <span className="truncate max-w-[200px]">{guide.title}</span>
      </nav>

      <article className="space-y-8">
        {/* Header */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
              {CATEGORY_LABELS[guide.category]}
            </span>
            <span className="text-muted-foreground">{guide.readTime} min de leitura</span>
          </div>
          <h1 className="text-2xl font-bold leading-snug">{guide.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{guide.description}</p>
        </header>

        {/* Índice */}
        <nav className="rounded-xl border bg-muted/30 p-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Neste guia
          </p>
          {guide.sections.map((section, i) => (
            <a
              key={i}
              href={`#secao-${i}`}
              className="block text-sm text-muted-foreground hover:text-green-600 transition-colors py-0.5"
            >
              {i + 1}. {section.heading}
            </a>
          ))}
        </nav>

        {/* Conteúdo */}
        <div className="space-y-8">
          {guide.sections.map((section, i) => (
            <section key={i} id={`secao-${i}`}>
              <h2 className="text-lg font-bold mb-3">{section.heading}</h2>
              <p className="text-muted-foreground leading-7">{section.body}</p>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <p className="font-semibold text-sm">Pronto para aplicar?</p>
          <p className="text-sm text-muted-foreground">
            Compare odds em tempo real e encontre o melhor valor para suas apostas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/odds"
              className="inline-flex items-center rounded-lg bg-green-500 hover:bg-green-600 text-black px-4 py-2 text-sm font-semibold transition-colors"
            >
              Comparar odds →
            </Link>
            <Link
              href="/palpites"
              className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Ver palpites da comunidade
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground border-t pt-4">
          Este guia tem finalidade educacional. Apostas esportivas envolvem risco financeiro. +18.
          Jogue com responsabilidade.
        </p>
      </article>

      {/* Outros guias */}
      {otherGuides.length > 0 && (
        <section className="space-y-3 pt-4 border-t">
          <h2 className="font-semibold text-sm">Outros guias</h2>
          <div className="space-y-2">
            {otherGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guias/${g.slug}`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                → {g.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
