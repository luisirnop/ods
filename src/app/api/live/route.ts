import { NextResponse } from 'next/server'
import { getLiveMatches } from '@/lib/football-api'

export async function GET() {
  const matches = await getLiveMatches()
  return NextResponse.json(matches, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
