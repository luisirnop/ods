import { ImageResponse } from 'next/og'
import { MOCK_GAMES } from '@/lib/mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const game = MOCK_GAMES.find((g) => g.id === id)

  if (!game) {
    return new Response('Not found', { status: 404 })
  }

  // Best h2h odds across all bookmakers
  const best: Record<string, number> = {}
  for (const bm of game.bookmakers) {
    const h2h = bm.markets.find((m) => m.key === 'h2h')
    if (!h2h) continue
    for (const outcome of h2h.outcomes) {
      if (!best[outcome.name] || outcome.price > best[outcome.name]) {
        best[outcome.name] = outcome.price
      }
    }
  }

  const homeOdd = best[game.home_team]
  const awayOdd = best[game.away_team]
  const drawOdd = best['Draw']

  const gameDate = new Date(game.commence_time).toLocaleString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })

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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 32, fontWeight: 800 }}>
            <span style={{ color: '#22c55e' }}>Odds</span>BR
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#9ca3af',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '6px 16px',
              borderRadius: 24,
            }}
          >
            {game.sport_title}
          </div>
        </div>

        {/* Teams */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 40,
            gap: 16,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 800, flex: 1, textAlign: 'left', lineHeight: 1.1 }}>
            {game.home_team}
          </div>
          <div style={{ fontSize: 36, color: '#6b7280', flexShrink: 0 }}>×</div>
          <div style={{ fontSize: 48, fontWeight: 800, flex: 1, textAlign: 'right', lineHeight: 1.1 }}>
            {game.away_team}
          </div>
        </div>

        {/* Odds */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
          {homeOdd !== undefined && (
            <div
              style={{
                flex: 1,
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10 }}>Casa</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#22c55e' }}>
                {homeOdd.toFixed(2)}
              </div>
            </div>
          )}
          {drawOdd !== undefined && (
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10 }}>Empate</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#d1d5db' }}>
                {drawOdd.toFixed(2)}
              </div>
            </div>
          )}
          {awayOdd !== undefined && (
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10 }}>Fora</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#d1d5db' }}>
                {awayOdd.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, color: '#6b7280' }}>{gameDate}</div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>oddsbr.com.br</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
