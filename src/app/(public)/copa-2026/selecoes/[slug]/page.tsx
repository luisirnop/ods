import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { COPA_TEAMS, CONFEDERATION_LABELS, getTeamBySlug, getTeamStats, slugifyTeam } from '@/lib/copa-2026'
import { getAdminClient } from '@/lib/supabase/admin'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return COPA_TEAMS.map((t) => ({ slug: slugifyTeam(t.name) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const team = getTeamBySlug(slug)
  if (!team) return { title: 'Seleção não encontrada — OddsBR' }

  const stats = getTeamStats(team.name)
  const titulos = stats ? `${stats.titulos}× campeão mundial.` : ''

  return {
    title: `${team.flag} ${team.name} na Copa 2026 — Elenco, Odds e Análise | OddsBR`,
    description: `Tudo sobre ${team.name} na Copa do Mundo 2026. ${titulos} Jogadores chave, estilo de jogo e as melhores odds para apostar.`,
    openGraph: {
      title: `${team.flag} ${team.name} — Copa do Mundo 2026`,
      description: `Elenco, análise e odds de ${team.name} na Copa 2026.`,
      type: 'website',
    },
  }
}

export default async function SelecaoPage({ params }: Props) {
  const { slug } = await params
  const team = getTeamBySlug(slug)
  if (!team) notFound()

  const stats = getTeamStats(team.name)

  // Artigos Copa sobre esta seleção
  const admin = getAdminClient()
  const { data: articles } = await admin
    .from('articles')
    .select('slug, title, published_at')
    .eq('published', true)
    .or(`home_team.ilike.%${team.name}%,away_team.ilike.%${team.name}%,league.ilike.%Copa%`)
    .order('published_at', { ascending: false })
    .limit(5)

  // Bolões que escolheram esta seleção como campeão
  const { count: totalBoloes } = await admin
    .from('world_cup_brackets')
    .select('id', { count: 'exact', head: true })
    .eq('champion', team.name)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team.name,
    sport: 'Soccer',
    memberOf: {
      '@type': 'SportsOrganization',
      name: CONFEDERATION_LABELS[team.confederation] ?? team.confederation,
    },
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
        <Link href="/copa-2026" className="hover:text-foreground transition-colors">Copa 2026</Link>
        <span>/</span>
        <Link href="/copa-2026/selecoes" className="hover:text-foreground transition-colors">Seleções</Link>
        <span>/</span>
        <span>{team.name}</span>
      </nav>

      {/* Hero */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-6xl">{team.flag}</span>
          <div>
            <h1 className="text-3xl font-extrabold">{team.name}</h1>
            <p className="text-sm text-muted-foreground">
              {CONFEDERATION_LABELS[team.confederation] ?? team.confederation}
              {stats && ` · ${stats.titulos} título${stats.titulos !== 1 ? 's' : ''} mundiais`}
            </p>
          </div>
        </div>

        {totalBoloes != null && totalBoloes > 0 && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-sm text-amber-600 font-medium">
            🏆 {totalBoloes} bolão{totalBoloes !== 1 ? 'ões' : ''} no OddsBR escolheu{totalBoloes !== 1 ? 'ram' : ''} {team.name} como campeão
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {stats && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Histórico na Copa do Mundo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Títulos', value: stats.titulos, color: 'text-amber-500' },
              { label: 'Vices', value: stats.vicesCampeonatos, color: 'text-slate-400' },
              { label: 'Participações', value: stats.participacoes, color: 'text-blue-500' },
              { label: 'Técnico', value: stats.tecnico.split(' ').slice(-1)[0], color: 'text-green-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border bg-card p-4 text-center">
                <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-3 text-sm">
            <div className="flex gap-2">
              <span className="text-muted-foreground w-32 shrink-0">Melhor campanha</span>
              <span className="font-medium">{stats.melhorCampanha}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-32 shrink-0">Técnico</span>
              <span className="font-medium">{stats.tecnico}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-32 shrink-0">Estilo de jogo</span>
              <span className="font-medium leading-relaxed">{stats.estilo}</span>
            </div>
          </div>
        </section>
      )}

      {/* Jogadores chave */}
      {stats && stats.jogadoresChave.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Jogadores de destaque</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.jogadoresChave.map((player, i) => (
              <div
                key={player}
                className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-xs font-bold text-green-600 shrink-0">
                  {i + 1}
                </div>
                <span className="font-medium text-sm">{player}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Odds */}
      <section className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 space-y-3">
        <h2 className="font-bold">Apostar em {team.name}</h2>
        <p className="text-sm text-muted-foreground">
          Compare as odds de {team.name} ser campeão do mundo nas principais casas de apostas do Brasil.
          Encontre o melhor valor antes de apostar.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/odds"
            className="inline-flex items-center rounded-xl bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 text-sm font-bold transition-colors"
          >
            Comparar odds →
          </Link>
          <Link
            href="/copa-2026/bolao"
            className="inline-flex items-center rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Fazer bolão
          </Link>
        </div>
      </section>

      {/* Artigos relacionados */}
      {articles && articles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Análises e notícias</h2>
          <div className="space-y-2">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/noticias/${a.slug}`}
                className="flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3 hover:border-muted-foreground/20 transition-colors group"
              >
                <span className="text-sm font-medium group-hover:text-green-600 transition-colors line-clamp-1">
                  {a.title}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(a.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Outras seleções */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Outras seleções</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {COPA_TEAMS.filter((t) => t.name !== team.name)
            .slice(0, 8)
            .map((t) => (
              <Link
                key={t.name}
                href={`/copa-2026/selecoes/${slugifyTeam(t.name)}`}
                className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs font-medium hover:border-green-500/30 transition-colors"
              >
                <span>{t.flag}</span>
                <span className="truncate">{t.name}</span>
              </Link>
            ))}
        </div>
        <Link
          href="/copa-2026/selecoes"
          className="text-sm text-green-600 hover:underline"
        >
          Ver todas as seleções →
        </Link>
      </section>
    </div>
  )
}
