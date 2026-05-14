import type { MetadataRoute } from 'next'
import { getAdminClient } from '@/lib/supabase/admin'
import { GUIDES } from '@/lib/guides'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const admin = getAdminClient()
  const { data: articles } = await admin
    .from('articles')
    .select('slug, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(1000)

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/odds`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/palpites`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ranking`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/noticias`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/calculadora`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/premium`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guias/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
    url: `${SITE_URL}/noticias/${article.slug}`,
    lastModified: new Date(article.published_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...guideRoutes, ...articleRoutes]
}
