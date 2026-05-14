import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const ArticleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  meta_description: z.string().optional(),
  content: z.string().min(1),
  game_id: z.string().optional(),
  home_team: z.string().optional(),
  away_team: z.string().optional(),
  league: z.string().optional(),
  game_date: z.string().optional(),
  article_type: z.enum(['prediction', 'news', 'guide', 'recap']).default('prediction'),
  generated_by: z.string().default('gemini-1.5-flash'),
  source_url: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-internal-token')
  if (token !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = ArticleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const admin = getAdminClient()
  const { data, error } = await admin
    .from('articles')
    .upsert(parsed.data, { onConflict: 'slug' })
    .select('id, slug')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidateTag('articles', 'max')

  return NextResponse.json({ success: true, id: data.id, slug: data.slug })
}
