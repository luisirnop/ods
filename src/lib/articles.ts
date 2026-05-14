import { unstable_cache } from 'next/cache'
import { getAdminClient } from './supabase/admin'

export interface Article {
  id: string
  slug: string
  title: string
  meta_description: string | null
  content: string
  game_id: string | null
  home_team: string | null
  away_team: string | null
  league: string | null
  game_date: string | null
  article_type: 'prediction' | 'news' | 'guide' | 'recap'
  generated_by: string | null
  source_url: string | null
  published: boolean
  views: number
  published_at: string
  created_at: string
}

export type ArticleCard = Pick<
  Article,
  | 'id'
  | 'slug'
  | 'title'
  | 'meta_description'
  | 'league'
  | 'home_team'
  | 'away_team'
  | 'game_date'
  | 'published_at'
  | 'article_type'
>

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<Article | null> => {
    const admin = getAdminClient()
    const { data } = await admin
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    return data ?? null
  },
  ['article-by-slug'],
  { revalidate: 3600, tags: ['articles'] }
)

export const getRecentArticles = unstable_cache(
  async (limit = 20): Promise<ArticleCard[]> => {
    const admin = getAdminClient()
    const { data } = await admin
      .from('articles')
      .select(
        'id, slug, title, meta_description, league, home_team, away_team, game_date, published_at, article_type'
      )
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(limit)
    return (data ?? []) as ArticleCard[]
  },
  ['recent-articles'],
  { revalidate: 3600, tags: ['articles'] }
)
