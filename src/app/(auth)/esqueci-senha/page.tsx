'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { requestPasswordReset } from '@/actions/auth'

type State = { error?: Record<string, string[]>; success?: boolean } | undefined

export default function EsqueciSenhaPage() {
  const [state, action, pending] = useActionState<State, FormData>(
    requestPasswordReset,
    undefined
  )

  const fieldError = (f: string) => state?.error?.[f]?.[0]
  const formError = state?.error?.['_form']?.[0]

  if (state?.success) {
    return (
      <div className="rounded-xl border bg-card p-6 space-y-4 text-center">
        <div className="text-4xl">📧</div>
        <h1 className="text-xl font-bold">Verifique seu email</h1>
        <p className="text-sm text-muted-foreground">
          Enviamos um link de redefinição de senha. Verifique sua caixa de entrada (e o spam).
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-green-500 hover:text-green-400 transition-colors"
        >
          ← Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Esqueci a senha</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      {formError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="seu@email.com"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
          />
          {fieldError('email') && (
            <p className="text-xs text-destructive">{fieldError('email')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-60 text-black font-semibold py-2.5 text-sm transition-colors"
        >
          {pending ? 'Enviando...' : 'Enviar link de redefinição'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Lembrou a senha?{' '}
        <Link href="/login" className="text-green-500 hover:text-green-400 font-medium transition-colors">
          Entrar
        </Link>
      </p>
    </div>
  )
}
