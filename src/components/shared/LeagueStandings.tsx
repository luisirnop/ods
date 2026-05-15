import Image from 'next/image'
import { FOTMOB_TEAM_LOGO, type StandingTeam } from '@/lib/football-api'

export default function LeagueStandings({ teams }: { teams: StandingTeam[] }) {
  if (teams.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-white/8">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[oklch(0.13_0.012_253)] border-b border-white/8">
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-8">#</th>
            <th className="px-2 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Time</th>
            <th className="px-2 py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">J</th>
            <th className="px-2 py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">V</th>
            <th className="px-2 py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">E</th>
            <th className="px-2 py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">D</th>
            <th className="px-2 py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">SG</th>
            <th className="px-3 py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Pts</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => {
            const isEven = i % 2 === 0
            const qualBorder = team.qualColor
              ? `border-l-2`
              : ''
            return (
              <tr
                key={team.id}
                className={[
                  'border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors',
                  isEven ? 'bg-[oklch(0.115_0.012_253)]' : 'bg-transparent',
                ].join(' ')}
              >
                {/* Rank + barra colorida de qualificação */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    {team.qualColor && (
                      <span
                        className="w-0.5 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: team.qualColor }}
                      />
                    )}
                    <span className={`text-xs font-bold ${team.rank <= 4 ? 'text-green-400' : team.rank >= 17 ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {team.rank}
                    </span>
                  </div>
                </td>

                {/* Logo + nome */}
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 shrink-0 flex items-center justify-center">
                      <Image
                        src={FOTMOB_TEAM_LOGO(team.id)}
                        alt={team.name}
                        width={24}
                        height={24}
                        className="object-contain"
                        unoptimized
                      />
                    </span>
                    <span className="text-xs font-medium text-white truncate">{team.name}</span>
                  </div>
                </td>

                <td className="px-2 py-2 text-center text-xs text-muted-foreground">{team.played}</td>
                <td className="px-2 py-2 text-center text-xs text-muted-foreground">{team.wins}</td>
                <td className="px-2 py-2 text-center text-xs text-muted-foreground">{team.draws}</td>
                <td className="px-2 py-2 text-center text-xs text-muted-foreground">{team.losses}</td>
                <td className="px-2 py-2 text-center text-xs text-muted-foreground hidden sm:table-cell">
                  {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="text-sm font-bold text-white">{team.points}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
