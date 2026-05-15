import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Bem-vindo ao Premium! — OddsBR',
  robots: { index: false },
}

export default function PremiumSucessoPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">🎉</div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold">Você é Premium!</h1>
          <p className="text-muted-foreground">
            Sua assinatura foi ativada. Agora você tem acesso completo aos value
            bets, alertas ilimitados e muito mais.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-2 text-sm text-left">
          <p className="font-semibold text-green-600">O que você ganhou:</p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>⚡ Value bets com casa, mercado e % de edge revelados</li>
            <li>🔔 Alertas de odds ilimitados no Telegram</li>
            <li>🏆 Badge Premium no seu perfil</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/odds"
            className="inline-flex items-center justify-center rounded-xl bg-green-500 hover:bg-green-600 text-black px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Ver value bets agora →
          </Link>
          <Link
            href="/perfil"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Ir para meu perfil
          </Link>
        </div>
      </div>
    </div>
  )
}
