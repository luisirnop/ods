'use client'

import { useState, useEffect, useActionState } from 'react'
import { createPrediction } from '@/actions/palpites'
import type { OddsGame } from '@/types'

type Market = '1x2' | 'over_under' | 'btts' | 'exact_score' | 'double_chance'

function getPredictionOptions(market: Market, game: OddsGame) {
  switch (market) {
    case '1x2':
      return [
        { value: '1', label: game.home_team },
        { value: 'X', label: 'Empate' },
        { value: '2', label: game.away_team },
      ]
    case 'over_under':
      return [
        { value: 'over', label: 'Over 2.5' },
        { value: 'under', label: 'Under 2.5' },
      ]
    case 'btts':
      return [
        { value: 'sim', label: 'Ambos marcam: Sim' },
        { value: 'nao', label: 'Ambos marcam: Não' },
      ]
    case 'double_chance':
      return [
        { value: '1X', label: `${game.home_team} ou Empate` },
        { value: 'X2', label: `Empate ou ${game.away_team}` },
        { value: '12', label: `${game.home_team} ou ${game.away_team}` },
      ]
    default:
      return []
  }
}

type State = { error?: string | object; success?: boolean } | undefined

interface Props {
  game: OddsGame
  userId: string | null
}

export default function PredictionForm({ game, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [market, setMarket] = useState<Market>('1x2')
  const [state, action, pending] = useActionState<State, FormData>(createPrediction, undefined)

  useEffect(() => {
    if (state?.success) setOpen(false)
  }, [state?.success])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!userId) {
    return (
      <a
        href="/login"
        className="inline-flex items-center gap-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-500/10 font-semibold px-4 py-2.5 text-sm transition-colors"
      >
        Entrar para palpitar
      </a>
    )
  }

  const options = getPredictionOptions(market, game)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 text-sm transition-colors"
      >
        Fazer Palpite
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-background rounded-xl border shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">Fazer Palpite</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-5">
              {game.home_team} × {game.away_team}
              <span className="ml-2 text-xs">({game.sport_title})</span>
            </p>

            <form action={action} className="space-y-4">
              <input type="hidden" name="game_id" value={game.id} />
              <input type="hidden" name="home_team" value={game.home_team} />
              <input type="hidden" name="away_team" value={game.away_team} />
              <input type="hidden" name="league" value={game.sport_title} />
              <input type="hidden" name="game_date" value={game.commence_time} />

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Mercado</label>
                <select
                  name="market"
                  value={market}
                  onChange={(e) => setMarket(e.target.value as Market)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                >
                  <option value="1x2">Resultado Final (1X2)</option>
                  <option value="over_under">Over/Under 2.5</option>
                  <option value="btts">Ambos Marcam</option>
                  <option value="double_chance">Dupla Chance</option>
                  <option value="exact_score">Placar Exato</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Palpite</label>
                {market === 'exact_score' ? (
                  <input
                    name="prediction"
                    type="text"
                    placeholder="Ex: 2-1"
                    required
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-1.5 cursor-pointer rounded-lg border px-3 py-2 text-sm has-[:checked]:border-green-500 has-[:checked]:bg-green-500/10 has-[:checked]:text-green-700 dark:has-[:checked]:text-green-400 transition-colors"
                      >
                        <input
                          type="radio"
                          name="prediction"
                          value={opt.value}
                          required
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confiança</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="cursor-pointer">
                      <input
                        type="radio"
                        name="confidence"
                        value={n}
                        defaultChecked={n === 3}
                        className="sr-only"
                      />
                      <span className="text-xl select-none has-[:checked]:text-yellow-400 hover:text-yellow-400 transition-colors text-muted-foreground">
                        ★
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Justificativa{' '}
                  <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <textarea
                  name="justification"
                  rows={2}
                  placeholder="Por que você acha isso?"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Odd <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <input
                  name="odds_at_time"
                  type="number"
                  step="0.01"
                  min="1.01"
                  placeholder="Ex: 2.45"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                />
              </div>

              {state?.error && (
                <p className="text-sm text-red-500">
                  {typeof state.error === 'string' ? state.error : 'Verifique os campos e tente novamente.'}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-2.5 text-sm transition-colors"
              >
                {pending ? 'Publicando...' : 'Publicar Palpite'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
