import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted/30">
      <Link href="/" className="flex items-center gap-1 font-bold text-2xl mb-8">
        <span className="text-green-500">Odds</span>
        <span>BR</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <p className="mt-8 text-xs text-muted-foreground text-center">
        Ao criar uma conta você concorda com nossos termos.
        Jogue com responsabilidade. +18.
      </p>
    </div>
  )
}
