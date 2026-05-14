import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Copa do Mundo 2026 — OddsBR',
  description:
    'Faça seu bolão da Copa do Mundo 2026, compare odds dos jogos e acompanhe análises exclusivas.',
}

export default async function Copa2026Page() {
  const admin = getAdminClient()
  const { count } = await admin
    .from('world_cup_brackets')
    .select('id', { count: 'exact', head: true })

  const totalBoloes = count ?? 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4 py-6">
        <div className="text-5xl">🏆</div>
        <h1 className="text-4xl font-extrabold leading-tight">
          Copa do Mundo{' '}
          <span className="text-green-500">2026</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          EUA, Canadá e México como anfitriões. 48 seleções. O maior torneio do mundo.
          Faça seu bolão e dispute com amigos quem cravar o campeão.
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/copa-2026/bolao"
          className="group rounded-2xl border-2 border-green-500 bg-green-500/5 hover:bg-green-500/10 p-6 space-y-3 transition-colors"
        >
          <div className="text-3xl">📋</div>
          <h2 className="text-lg font-bold group-hover:text-green-600 transition-colors">
            Fazer meu bolão
          </h2>
          <p className="text-sm text-muted-foreground">
            Escolha o campeão, vice e semifinalistas. Compartilhe com amigos e veja quem acerta mais.
          </p>
          <div className="text-sm font-semibold text-green-600">
            Criar bolão →
          </div>
        </Link>

        <Link
          href="/copa-2026/ranking"
          className="group rounded-2xl border bg-card hover:border-green-500/30 p-6 space-y-3 transition-colors"
        >
          <div className="text-3xl">🏅</div>
          <h2 className="text-lg font-bold">Ranking geral</h2>
          <p className="text-sm text-muted-foreground">
            Veja quem está na frente. Ranking atualizado após cada fase da Copa.
          </p>
          {totalBoloes > 0 && (
            <div className="text-sm font-semibold text-muted-foreground">
              {totalBoloes} bolão{totalBoloes !== 1 ? 'ões' : ''} criado{totalBoloes !== 1 ? 's' : ''}
            </div>
          )}
        </Link>

        <Link
          href="/odds"
          className="group rounded-2xl border bg-card hover:border-green-500/30 p-6 space-y-3 transition-colors"
        >
          <div className="text-3xl">📊</div>
          <h2 className="text-lg font-bold">Odds da Copa</h2>
          <p className="text-sm text-muted-foreground">
            Compare odds de cada jogo nas principais casas de apostas do Brasil em tempo real.
          </p>
          <div className="text-sm font-semibold text-muted-foreground">
            Ver odds →
          </div>
        </Link>
      </div>

      {/* Cards secundários */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/copa-2026/selecoes"
          className="group rounded-2xl border bg-card hover:border-green-500/30 p-6 space-y-3 transition-colors"
        >
          <div className="text-3xl">🌍</div>
          <h2 className="text-lg font-bold">Seleções</h2>
          <p className="text-sm text-muted-foreground">
            Conheça as 32 seleções classificadas. Elenco, histórico de títulos e odds de campeão para cada país.
          </p>
          <div className="text-sm font-semibold text-muted-foreground">
            Ver seleções →
          </div>
        </Link>

        <Link
          href="/copa-2026/analises"
          className="group rounded-2xl border bg-card hover:border-green-500/30 p-6 space-y-3 transition-colors"
        >
          <div className="text-3xl">🤖</div>
          <h2 className="text-lg font-bold">Análises com IA</h2>
          <p className="text-sm text-muted-foreground">
            Palpites e análises gerados por inteligência artificial para cada jogo da Copa. Atualizados diariamente.
          </p>
          <div className="text-sm font-semibold text-muted-foreground">
            Ver análises →
          </div>
        </Link>
      </div>

      {/* Pontuação */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-bold text-base">Sistema de pontuação</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          {[
            { label: 'Campeão', pts: '+10 pts', color: 'text-amber-500' },
            { label: 'Vice-campeão', pts: '+5 pts', color: 'text-green-600' },
            { label: 'Semifinalista', pts: '+4 pts cada', color: 'text-blue-500' },
            { label: 'Total máximo', pts: '26 pts', color: 'text-muted-foreground' },
          ].map(({ label, pts, color }) => (
            <div key={label} className="space-y-1">
              <div className={`text-xl font-extrabold ${color}`}>{pts}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Countdown */}
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-green-600">Copa do Mundo 2026</p>
          <p className="text-sm text-muted-foreground">11 de junho a 19 de julho de 2026</p>
        </div>
        <Link
          href="/copa-2026/bolao"
          className="inline-flex items-center rounded-xl bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap"
        >
          Fazer meu bolão →
        </Link>
      </div>
    </div>
  )
}
