'use client'

import { useState, useTransition } from 'react'
import { COPA_TEAMS, CONFEDERATION_LABELS } from '@/lib/copa-2026'
import { saveBolao } from '@/actions/bolao'

interface ExistingBracket {
  bracket_name: string | null
  champion: string | null
  runner_up: string | null
  predictions: { semifinalists?: string[] } | null
  share_token: string
}

interface Props {
  existing: ExistingBracket | null
}

function TeamSelect({
  label,
  value,
  onChange,
  excluded,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  excluded?: string[]
}) {
  const available = COPA_TEAMS.filter((t) => !excluded?.includes(t.name))
  const byConf = Object.groupBy(available, (t) => t.confederation)

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
        required
      >
        <option value="">Escolha uma seleção…</option>
        {Object.entries(byConf).map(([conf, teams]) => (
          <optgroup key={conf} label={CONFEDERATION_LABELS[conf] ?? conf}>
            {(teams ?? []).map((t) => (
              <option key={t.name} value={t.name}>
                {t.flag} {t.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

export default function BolaoForm({ existing }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(existing?.bracket_name ?? 'Meu Bolão da Copa 2026')
  const [champion, setChampion] = useState(existing?.champion ?? '')
  const [runnerUp, setRunnerUp] = useState(existing?.runner_up ?? '')
  const [semis, setSemis] = useState<string[]>(
    existing?.predictions?.semifinalists ?? ['', '', '', '']
  )

  function setSemi(idx: number, value: string) {
    setSemis((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  // Todas as seleções já feitas (para exclusão nos selects seguintes)
  const allPicked = [champion, runnerUp, ...semis].filter(Boolean)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!champion || !runnerUp) {
      setError('Escolha campeão e vice-campeão.')
      return
    }
    if (semis.some((s) => !s)) {
      setError('Escolha os 4 semifinalistas.')
      return
    }
    const unique = new Set(allPicked)
    if (unique.size !== allPicked.length) {
      setError('Não é possível escolher a mesma seleção em duas posições.')
      return
    }

    startTransition(async () => {
      const result = await saveBolao({
        name,
        champion,
        runnerUp,
        semifinalists: semis as [string, string, string, string],
      })

      if ('error' in result) {
        setError(result.error)
        return
      }

      window.location.href = `/copa-2026/bolao/${result.token}`
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome do bolão */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Nome do seu bolão
        </label>
        <input
          type="text"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
          required
        />
      </div>

      {/* Campeão */}
      <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <p className="font-bold text-sm">Campeão (+10 pts)</p>
        </div>
        <TeamSelect
          label="Quem vai levantar a taça?"
          value={champion}
          onChange={setChampion}
        />
      </div>

      {/* Vice-campeão */}
      <div className="rounded-xl border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🥈</span>
          <p className="font-bold text-sm">Vice-campeão (+5 pts)</p>
        </div>
        <TeamSelect
          label="Finalista que perde"
          value={runnerUp}
          onChange={setRunnerUp}
          excluded={champion ? [champion] : []}
        />
      </div>

      {/* Semifinalistas */}
      <div className="rounded-xl border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏅</span>
          <p className="font-bold text-sm">Semifinalistas (+4 pts cada)</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Escolha as 4 seleções que chegam às semifinais (incluindo campeão e vice).
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => {
            const otherSemis = semis.filter((_, j) => j !== i).filter(Boolean)
            const excluded = [champion, runnerUp, ...otherSemis].filter(Boolean)
            return (
              <TeamSelect
                key={i}
                label={`Semifinalista ${i + 1}`}
                value={semis[i]}
                onChange={(v) => setSemi(i, v)}
                excluded={excluded}
              />
            )
          })}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 text-black py-3 text-sm font-bold transition-colors"
      >
        {isPending
          ? 'Salvando…'
          : existing
          ? 'Atualizar bolão →'
          : 'Criar bolão e compartilhar →'}
      </button>

      {existing && (
        <p className="text-center text-xs text-muted-foreground">
          Você já tem um bolão — atualizar vai substituir suas escolhas anteriores.
        </p>
      )}
    </form>
  )
}
