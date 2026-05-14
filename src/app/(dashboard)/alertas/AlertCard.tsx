'use client'

import { useState, useTransition } from 'react'
import { deleteAlert, toggleAlert } from '@/actions/alertas'

const MARKET_LABELS: Record<string, string> = {
  h2h: '1X2',
  totals: 'Over/Under',
  btts: 'Ambos Marcam',
}

const BOOKMAKER_LABELS: Record<string, string> = {
  betano: 'Betano',
  superbet: 'Superbet',
  bet365: 'Bet365',
  kto: 'KTO',
  estrelabet: 'Estrela Bet',
}

interface Alert {
  id: string
  team_name: string | null
  league: string | null
  bookmaker: string | null
  market: string | null
  threshold: number
  is_active: boolean
  alerts_sent_today: number
  last_alert_at: string | null
}

interface Props {
  alert: Alert
  freeLimit: number
  totalCount: number
  isPremium: boolean
}

export default function AlertCard({ alert, freeLimit, totalCount, isPremium }: Props) {
  const [active, setActive] = useState(alert.is_active)
  const [isPendingToggle, startToggle] = useTransition()
  const [isPendingDelete, startDelete] = useTransition()

  function handleToggle() {
    const newActive = !active
    setActive(newActive)
    startToggle(async () => {
      const result = await toggleAlert(alert.id)
      if ('error' in result) setActive(!newActive)
    })
  }

  function handleDelete() {
    startDelete(async () => {
      await deleteAlert(alert.id)
    })
  }

  const title = [alert.team_name, alert.league].filter(Boolean).join(' · ') || 'Alerta geral'
  const details = [
    alert.market ? MARKET_LABELS[alert.market] ?? alert.market : null,
    alert.bookmaker ? BOOKMAKER_LABELS[alert.bookmaker] ?? alert.bookmaker : null,
    `Δ ≥ ${alert.threshold}`,
  ]
    .filter(Boolean)
    .join(' · ')

  const atLimit = !isPremium && totalCount >= freeLimit

  return (
    <div
      className={`rounded-xl border bg-card p-4 flex items-center justify-between gap-4 transition-opacity ${
        !active ? 'opacity-60' : ''
      }`}
    >
      <div className="min-w-0">
        <div className="font-medium text-sm truncate">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{details}</div>
        {alert.last_alert_at && (
          <div className="text-xs text-muted-foreground mt-1">
            Último alerta: {new Date(alert.last_alert_at).toLocaleString('pt-BR')}
          </div>
        )}
        {!isPremium && (
          <div className="text-xs text-muted-foreground mt-0.5">
            Enviados hoje: {alert.alerts_sent_today}/{freeLimit}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleToggle}
          disabled={isPendingToggle || (atLimit && !active)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${
            active ? 'bg-green-500' : 'bg-muted-foreground/30'
          }`}
          aria-label={active ? 'Desativar alerta' : 'Ativar alerta'}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
              active ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>

        <button
          onClick={handleDelete}
          disabled={isPendingDelete}
          className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40 text-sm px-1"
          aria-label="Excluir alerta"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
