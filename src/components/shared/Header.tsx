import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-green-500">Odds</span>
          <span>BR</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/odds" className="text-muted-foreground hover:text-foreground transition-colors">
            Comparador
          </Link>
          <Link href="/palpites" className="text-muted-foreground hover:text-foreground transition-colors">
            Palpites
          </Link>
          <Link href="/ranking" className="text-muted-foreground hover:text-foreground transition-colors">
            Ranking
          </Link>
          <Link href="/noticias" className="text-muted-foreground hover:text-foreground transition-colors">
            Notícias
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex h-7 items-center rounded-lg px-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="inline-flex h-7 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </header>
  )
}
