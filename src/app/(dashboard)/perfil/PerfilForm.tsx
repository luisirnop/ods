'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/actions/perfil'
import type { Profile } from '@/types'

const TIMES_BRASILEIROS = [
  'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Grêmio',
  'Internacional', 'Atlético-MG', 'Cruzeiro', 'Fluminense', 'Botafogo',
  'Santos', 'Vasco', 'Bahia', 'Athletico-PR', 'Fortaleza',
]

type State = { error?: string; success?: boolean } | undefined

interface Props {
  profile: Profile | null
  userId: string
}

export default function PerfilForm({ profile, userId }: Props) {
  const [state, action, pending] = useActionState<State, FormData>(
    updateProfile,
    undefined
  )

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="userId" value={userId} />

      <div className="space-y-1.5">
        <label htmlFor="display_name" className="text-sm font-medium">Nome de exibição</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={profile?.display_name ?? ''}
          placeholder="Como você aparece no ranking"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="username" className="text-sm font-medium">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={profile?.username ?? ''}
          placeholder="@seu_username"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="favorite_team" className="text-sm font-medium">Time do coração</label>
        <select
          id="favorite_team"
          name="favorite_team"
          defaultValue={profile?.favorite_team ?? ''}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
        >
          <option value="">Selecione seu time</option>
          {TIMES_BRASILEIROS.map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600 font-medium">Perfil atualizado com sucesso!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
      >
        {pending ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  )
}
