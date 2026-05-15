import Image from 'next/image'
import Link from 'next/link'
import { Newspaper, Clock } from 'lucide-react'
import { getLatestNews, type ArticleCard } from '@/lib/articles'

// ─── Fotos reais do Unsplash mapeadas por tópico ──────────────────────────────
// IDs de fotos públicas do Unsplash (esporte/futebol)
const TOPIC_IMAGES: Record<string, string> = {
  brasileirao:  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=700&q=80',
  copa:         'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=80',
  champions:    'https://images.unsplash.com/photo-1540747913346-19212a4cf528?auto=format&fit=crop&w=700&q=80',
  libertadores: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=700&q=80',
  premier:      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=700&q=80',
  default:      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=700&q=80',
}

function getImageForArticle(article: ArticleCard | MockNews): string {
  if ('image' in article && article.image) return article.image
  const league = ('league' in article ? article.league : '') ?? ''
  const l = league.toLowerCase()
  if (l.includes('brasileir')) return TOPIC_IMAGES.brasileirao
  if (l.includes('copa') || l.includes('world')) return TOPIC_IMAGES.copa
  if (l.includes('champions')) return TOPIC_IMAGES.champions
  if (l.includes('libertad')) return TOPIC_IMAGES.libertadores
  if (l.includes('premier')) return TOPIC_IMAGES.premier
  return TOPIC_IMAGES.default
}

function getBadgeColor(category: string): string {
  const c = category.toLowerCase()
  if (c.includes('brasil') || c.includes('série')) return 'bg-green-500/20 text-green-400 border-green-500/30'
  if (c.includes('copa') || c.includes('world')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  if (c.includes('champions')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  if (c.includes('premier')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  if (c.includes('libert')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  return 'bg-white/10 text-white/70 border-white/15'
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor(diff / 60_000)
  if (h >= 24) return `${Math.floor(h / 24)}d atrás`
  if (h >= 1) return `${h}h atrás`
  if (m >= 1) return `${m}min atrás`
  return 'agora'
}

// ─── Dados mock — substituídos pelos artigos do Supabase quando disponíveis ──
interface MockNews {
  slug: string
  title: string
  meta_description: string
  category: string
  published_at: string
  image: string
  isExternal?: boolean
}

const MOCK_NEWS: MockNews[] = [
  {
    slug: 'flamengo-palmeiras-odds-brasileirao',
    title: 'Flamengo x Palmeiras: análise das odds e palpites para o clássico',
    meta_description: 'Confira as melhores odds para o duelo entre os gigantes do Brasileirão e qual casa oferece o maior valor.',
    category: 'Brasileirão Série A',
    published_at: new Date(Date.now() - 1.5 * 3_600_000).toISOString(),
    image: TOPIC_IMAGES.brasileirao,
  },
  {
    slug: 'copa-2026-grupos-analise',
    title: 'Copa 2026: análise completa dos grupos e favoritos ao título',
    meta_description: 'Brasil, Argentina e França disputam o favoritismo. Veja as odds de campeão e os grupos mais equilibrados.',
    category: 'Copa 2026',
    published_at: new Date(Date.now() - 3 * 3_600_000).toISOString(),
    image: TOPIC_IMAGES.copa,
  },
  {
    slug: 'champions-league-quartas-value-bets',
    title: 'Champions League: value bets nas quartas de final desta semana',
    meta_description: 'Detector de value bets encontrou odds acima do justo em 3 partidas. Veja quais casas estão pagando mais.',
    category: 'Champions League',
    published_at: new Date(Date.now() - 5 * 3_600_000).toISOString(),
    image: TOPIC_IMAGES.champions,
  },
  {
    slug: 'libertadores-brasileiros-favoritismo',
    title: 'Brasileiros dominam Libertadores 2026: odds e análise por clube',
    meta_description: 'Flamengo, Palmeiras e Atlético-MG têm as menores odds para o título. Onde apostar com mais valor?',
    category: 'Libertadores',
    published_at: new Date(Date.now() - 8 * 3_600_000).toISOString(),
    image: TOPIC_IMAGES.libertadores,
  },
  {
    slug: 'premier-league-top4-odds',
    title: 'Premier League: a corrida pelo top 4 e como as odds se movem',
    meta_description: 'Arsenal e Liverpool em linha reta. O que as casas de apostas estão dizendo sobre o final de temporada.',
    category: 'Premier League',
    published_at: new Date(Date.now() - 12 * 3_600_000).toISOString(),
    image: TOPIC_IMAGES.premier,
  },
  {
    slug: 'gestao-banca-apostas-esportivas',
    title: 'Como proteger sua banca: guia rápido para apostar com estratégia',
    meta_description: 'Critério de Kelly, limites por aposta e como o OddsBR calculadora ajuda você a crescer de forma consistente.',
    category: 'Guias',
    published_at: new Date(Date.now() - 18 * 3_600_000).toISOString(),
    image: TOPIC_IMAGES.default,
  },
]

// ─── Card individual ──────────────────────────────────────────────────────────
function NewsCard({
  slug,
  title,
  description,
  category,
  publishedAt,
  imageUrl,
  isExternal = false,
}: {
  slug: string
  title: string
  description: string
  category: string
  publishedAt: string
  imageUrl: string
  isExternal?: boolean
}) {
  const href = isExternal ? slug : `/noticias/${slug}`

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group flex flex-col rounded-xl border border-white/8 bg-card overflow-hidden hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 shrink-0 w-[280px] sm:w-auto"
    >
      {/* Imagem */}
      <div className="relative aspect-video overflow-hidden bg-[oklch(0.13_0.012_253)]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Badge sobre a imagem */}
        <span className={`absolute top-2.5 left-2.5 rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm ${getBadgeColor(category)}`}>
          {category}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-green-400 transition-colors">
          {title}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 mt-auto pt-1 border-t border-white/5">
          <Clock className="w-3 h-3 shrink-0" />
          <span>{timeAgo(publishedAt)}</span>
          <span className="ml-auto text-green-500 font-semibold group-hover:underline">
            Ler mais →
          </span>
        </div>
      </div>
    </Link>
  )
}

// ─── Componente principal (Server) ────────────────────────────────────────────
export default async function NewsCardsSection() {
  const dbNews = await getLatestNews(6).catch(() => [] as ArticleCard[])

  // Usa artigos reais do Supabase quando disponíveis, senão usa mock
  const hasRealNews = dbNews.length >= 3
  const items = hasRealNews ? dbNews : MOCK_NEWS

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-green-500" />
          <h2 className="text-lg font-bold text-white">Principais notícias da semana</h2>
          <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
            IA
          </span>
        </div>
        <Link href="/noticias" className="text-xs text-green-500 hover:text-green-400 transition-colors">
          Ver todas →
        </Link>
      </div>

      {/* Grid: scroll horizontal no mobile, grid no desktop */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
        {items.map((item) => {
          const isMock = 'image' in item
          return (
            <NewsCard
              key={item.slug}
              slug={item.slug}
              title={item.title}
              description={item.meta_description ?? ''}
              category={
                isMock
                  ? (item as MockNews).category
                  : (item as ArticleCard).league ?? 'Esporte'
              }
              publishedAt={item.published_at}
              imageUrl={getImageForArticle(item)}
              isExternal={!isMock && !!(item as ArticleCard).source_url}
            />
          )
        })}
      </div>

      {/* Label IA */}
      {!hasRealNews && (
        <p className="text-[10px] text-muted-foreground/40 text-center">
          Conteúdo gerado por IA · Atualizado automaticamente pelo OddsBR
        </p>
      )}
    </section>
  )
}
