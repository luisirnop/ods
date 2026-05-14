import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/actions/auth'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { display_name: string | null; username: string | null; is_premium: boolean } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, username, is_premium')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 font-bold text-lg">
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
          <Link href="/guias" className="text-muted-foreground hover:text-foreground transition-colors">
            Guias
          </Link>
          <Link href="/calculadora" className="text-muted-foreground hover:text-foreground transition-colors">
            Calculadora
          </Link>
          <Link href="/quiz" className="text-muted-foreground hover:text-foreground transition-colors">
            Quiz
          </Link>
          {user && (
            <Link href="/telegram" className="text-muted-foreground hover:text-foreground transition-colors">
              Telegram
            </Link>
          )}
          {!profile?.is_premium && (
            <Link
              href="/premium"
              className="text-amber-600 hover:text-amber-500 font-semibold transition-colors"
            >
              ⚡ Premium
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/perfil"
                className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {profile?.display_name ?? user.email?.split('@')[0]}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex h-8 items-center rounded-lg border px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="inline-flex h-8 items-center rounded-lg bg-green-500 hover:bg-green-600 text-white px-3 text-sm font-semibold transition-colors"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
