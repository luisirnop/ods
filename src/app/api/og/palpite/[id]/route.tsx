import { ImageResponse } from 'next/og'
import { getAdminClient } from '@/lib/supabase/admin'
import { formatPrediction, getMarketLabel } from '@/lib/predictions'
import type { Market } from '@/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const admin = getAdminClient()
  const { data } = await admin
    .from('predictions')
    .select('*, profiles(display_name, username)')
    .eq('id', id)
    .eq('result', 'correct')
    .single()

  if (!data) {
    return new Response('Not found', { status: 404 })
  }

  const profile = (data as any).profiles
  const displayName = profile?.display_name ?? profile?.username ?? 'Anônimo'
  const predictionLabel = formatPrediction(
    data.market as Market,
    data.prediction,
    data.home_team,
    data.away_team
  )
  const marketLabel = getMarketLabel(data.market as Market)

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '48px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 32, fontWeight: 800 }}>
            <span style={{ color: '#22c55e' }}>Odds</span>BR
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#22c55e',
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              padding: '6px 16px',
              borderRadius: 24,
            }}
          >
            ✅ Palpite Correto
          </div>
        </div>

        <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 12 }}>
          {data.league}
        </div>
        <div style={{ fontSize: 38, fontWeight: 800, marginBottom: 8 }}>
          {data.home_team} × {data.away_team}
        </div>

        <div
          style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 16,
            padding: '28px 32px',
            marginTop: 24,
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>{marketLabel}</div>
            <div style={{ fontSize: 44, fontWeight: 800, color: '#22c55e' }}>{predictionLabel}</div>
            {data.odds_at_time && (
              <div style={{ fontSize: 20, color: '#d1d5db', marginTop: 8 }}>
                @ {data.odds_at_time}
              </div>
            )}
          </div>
          {data.points_earned > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 4 }}>Pontos</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: '#fbbf24' }}>
                +{data.points_earned}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, color: '#9ca3af' }}>por {displayName}</div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>oddsbr.com.br</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
