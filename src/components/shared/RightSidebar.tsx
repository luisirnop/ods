import { MOCK_GAMES } from '@/lib/mock-data'
import DailyPoll, { type PollGame } from './DailyPoll'
import OfferCards from './OfferCards'

function pickPollGame(): PollGame | null {
  // Pega o jogo mais próximo (dentro das próximas 24h)
  const now = Date.now()
  const soon = now + 24 * 60 * 60 * 1000
  const candidate = MOCK_GAMES.find((g) => {
    const t = new Date(g.commence_time).getTime()
    return t >= now - 2 * 60 * 60 * 1000 && t <= soon
  }) ?? MOCK_GAMES[0]

  if (!candidate) return null

  return {
    id: candidate.id,
    homeTeam: candidate.home_team,
    awayTeam: candidate.away_team,
    league: candidate.sport_title,
    commenceTime: candidate.commence_time,
  }
}

export default function RightSidebar() {
  const pollGame = pickPollGame()

  return (
    <aside
      className={[
        'hidden xl:flex flex-col',
        'w-[320px] shrink-0',
        'sticky top-14 h-[calc(100vh-3.5rem)]',
        'overflow-y-auto no-scrollbar',
        'border-l border-white/5',
        'bg-[oklch(0.075_0.012_253)]',
      ].join(' ')}
    >
      <div className="p-4 space-y-6">
        {pollGame && <DailyPoll game={pollGame} />}
        <OfferCards />
      </div>
    </aside>
  )
}
