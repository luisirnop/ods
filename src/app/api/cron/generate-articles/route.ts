import { NextRequest, NextResponse } from 'next/server'
import { generateArticlesForSport, SPORTS } from '@/lib/generate-articles'

// Vercel Cron: runs daily at 10:00 UTC (07:00 BRT)
// Schedule configured in vercel.json
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sports = [
    { sport: SPORTS.BRASILEIRAO_A, league: 'Brasileirão Série A' },
    { sport: SPORTS.PREMIER_LEAGUE, league: 'Premier League' },
    { sport: SPORTS.CHAMPIONS_LEAGUE, league: 'Champions League' },
  ] as const

  const allResults = []
  for (const { sport, league } of sports) {
    try {
      const result = await generateArticlesForSport(sport, league)
      allResults.push({ sport, ...result })
    } catch {
      allResults.push({ sport, generated: 0, total: 0, error: true })
    }
  }

  const totalGenerated = allResults.reduce((sum, r) => sum + r.generated, 0)
  return NextResponse.json({ success: true, totalGenerated, sports: allResults })
}
