import { after } from 'next/server'
import { redirect } from 'next/navigation'
import { getAffiliateLink } from '@/lib/affiliates'
import { getAdminClient } from '@/lib/supabase/admin'
import type { Bookmaker } from '@/lib/affiliates'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookmaker: string }> }
) {
  const { bookmaker } = await params
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') ?? 'unknown'
  const variant = searchParams.get('variant') ?? null

  const affiliateUrl = getAffiliateLink(bookmaker as Bookmaker, source)
  if (!affiliateUrl || affiliateUrl === '#') {
    redirect('/odds')
  }

  // Log do clique após o redirect (não bloqueia o usuário)
  after(async () => {
    try {
      const admin = getAdminClient()
      await admin.from('affiliate_clicks').insert({ bookmaker, source, variant })
    } catch {}
  })

  redirect(affiliateUrl)
}
