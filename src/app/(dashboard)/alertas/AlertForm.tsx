'use client'

import { useState, useActionState } from 'react'
import { createAlert } from '@/actions/alertas'

const TIMES = [
  'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Grêmio',
  'Internacional', 'Atlético-MG', 'Cruzeiro', 'Fluminense', 'Botafogo',
  'Santos', 'Vasco', 'Bahia', 'Athletico-PR', 'Fortaleza',
]

const BOOKMAKERS = [
  { value: 'betano', label: 'Betano' },
  { value: 'superbet', label: 'Superbet' },
  { value: 'bet365', label: 'Bet365' },
  { value: 'kto', label: 'KTO' },
  { value: 'estrelabet', label: 'Estrela Bet' },
]

const MARKETS = [
  { value: 'h2h', label: '1X2 (resultado)' },
  { value: 'totals', label: 'Over/Under' },
  { value: 'btts', label: 'Ambos Marcam' },
]

type State = { error?: string | object; success?: boolean } | undefined

interface Props {
  atLimit: boolean
}

export default function AlertForm({ atLimit }: Props) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<State, FormData>(createAlert, undefined)

  if (state?.success && open) setOpen(false)

  if (atLimit) {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-yellow-700 dark:text-yellow-400">
        Limite de 3 alertas gratuitos atingido.{' '}
        <span className="text-muted-foreground">
          Faça upgrade para Premium para alertas ilimitados.
        </span>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 text-sm transition-colors"
      >
        + Novo alerta
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
              <h2 className="font-semibold text-lg">Novo alerta de odd</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form action={action} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Time <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <select
                  name="team_name"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                >
                  <option value="">Qualquer time</option>
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Campeonato <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <input
                  name="league"
                  type="text"
                  placeholder="Ex: Brasileirão Série A"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Casa <span className="text-muted-foreground font-normal">(opcional)</span>
                  </label>
                  <select
                    name="bookmaker"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40"
                  >
                    <option value="">Todas</option>
                    {BOOKMAKERS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Mercado <span className="text-muted-foreground font-normal">(opcional)</span>
                  </label>
                  <select
                    name="market"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40"
                  >
                    <option value="">Todos</option>
                    {MARKETS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Variação mínima para alertar
                </label>
                <div className="flex items-center gap-2">
                  <input
                    name="threshold"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="5"
                    defaultValue="0.10"
                    className="w-24 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40"
                  />
                  <span className="text-sm text-muted-foreground">pontos de odd (ex: 2.45 → 2.55)</span>
                </div>
              </div>

              {state?.error && (
                <p className="text-sm text-red-500">
                  {typeof state.error === 'string' ? state.error : 'Verifique os campos.'}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-2.5 text-sm transition-colors"
              >
                {pending ? 'Criando...' : 'Criar alerta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
