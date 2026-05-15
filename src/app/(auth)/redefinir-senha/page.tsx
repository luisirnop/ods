'use client'

import { useActionState } from 'react'
import { updatePassword } from '@/actions/auth'

type State = { error?: Record<string, string[]> } | undefined

export default function RedefinirSenhaPage() {
  const [state, action, pending] = useActionState<State, FormData>(updatePassword, undefined)

  const fieldError = (f: string) => state?.error?.[f]?.[0]
  const formError = state?.error?.['_form']?.[0]

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha uma nova senha para a sua conta.
        </p>
      </div>

      {formError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Nova senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
          />
          {fieldError('password') && (
            <p className="text-xs text-destructive">{fieldError('password')}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm" className="text-sm font-medium">
            Confirmar senha
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
          />
          {fieldError('confirm') && (
            <p className="text-xs text-destructive">{fieldError('confirm')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-60 text-black font-semibold py-2.5 text-sm transition-colors"
        >
          {pending ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </div>
  )
}
