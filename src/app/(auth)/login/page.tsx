'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/actions/auth'
import type { Metadata } from 'next'

type State = { error?: Record<string, string[]> } | undefined

export default function LoginPage() {
  const [state, action, pending] = useActionState<State, FormData>(login, undefined)

  const fieldError = (field: string) => state?.error?.[field]?.[0]
  const formError = state?.error?.['_form']?.[0]

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Entrar na sua conta</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Não tem conta?{' '}
          <Link href="/cadastro" className="text-green-600 hover:underline font-medium">
            Cadastre-se grátis
          </Link>
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

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
          />
          {fieldError('password') && (
            <p className="text-xs text-destructive">{fieldError('password')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-2.5 text-sm transition-colors"
        >
          {pending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
