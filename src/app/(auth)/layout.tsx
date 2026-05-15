import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 hero-gradient">
      <Link href="/" className="flex items-center gap-1.5 font-extrabold text-2xl mb-8">
        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center neon-glow-sm">
          <Zap className="w-4.5 h-4.5 text-black fill-black" />
        </div>
        <span className="text-white">Odds</span>
        <span className="text-green-500">BR</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <p className="mt-8 text-xs text-muted-foreground text-center">
        Ao criar uma conta você concorda com nossos{' '}
        <Link href="/termos" className="underline underline-offset-2 hover:text-white transition-colors">
          Termos de Uso
        </Link>{' '}
        e{' '}
        <Link href="/privacidade" className="underline underline-offset-2 hover:text-white transition-colors">
          Política de Privacidade
        </Link>.
        Jogue com responsabilidade. +18.
      </p>
    </div>
  )
}
