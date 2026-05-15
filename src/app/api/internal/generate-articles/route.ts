import { NextRequest, NextResponse } from 'next/server'
import { generateArticlesForSport, isSportKey, SPORTS } from '@/lib/generate-articles'

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-internal-token')
  if (token !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { sport?: string; league?: string }
  const sport = body.sport && isSportKey(body.sport) ? body.sport : SPORTS.BRASILEIRAO_A

  try {
    const result = await generateArticlesForSport(sport, body.league)
    return NextResponse.json({ success: true, sport, ...result })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 503 })
  }
}
