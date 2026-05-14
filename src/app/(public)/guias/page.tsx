import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Guias de Apostas Esportivas — OddsBR',
  description:
    'Aprenda a apostar com estratégia: guias completos sobre odds, value bets, handicap asiático, Over/Under e gestão de banca.',
}

const CATEGORY_LABELS: Record<string, string> = {
  fundamentos: 'Fundamentos',
  estrategia: 'Estratégia',
  mercados: 'Mercados',
  gestao: 'Gestão',
}

const CATEGORY_COLORS: Record<string, string> = {
  fundamentos: 'bg-blue-500/10 text-blue-600',
  estrategia: 'bg-purple-500/10 text-purple-600',
  mercados: 'bg-green-500/10 text-green-600',
  gestao: 'bg-orange-500/10 text-orange-600',
}

export default function GuiasPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Guias de Apostas Esportivas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Do básico ao avançado — aprenda a apostar com estratégia e responsabilidade.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guias/${guide.slug}`}
            className="group rounded-xl border bg-card p-5 hover:border-green-500/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[guide.category]}`}
              >
                {CATEGORY_LABELS[guide.category]}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">{guide.readTime} min</span>
            </div>
            <h2 className="font-semibold text-sm leading-snug group-hover:text-green-600 transition-colors">
              {guide.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
              {guide.description}
            </p>
            <span className="mt-3 inline-block text-xs text-green-600 font-medium">
              Ler guia →
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5 text-sm space-y-2">
        <p className="font-semibold">Aposte com responsabilidade</p>
        <p className="text-muted-foreground leading-relaxed">
          Apostas esportivas envolvem risco de perda financeira. Jogue apenas com o que pode
          perder. +18. Se precisar de ajuda, acesse{' '}
          <a
            href="https://www.jogoresponsavel.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            jogoresponsavel.com.br
          </a>
          .
        </p>
      </div>
    </div>
  )
}
