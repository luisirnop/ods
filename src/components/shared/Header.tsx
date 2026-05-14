import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/actions/auth'
import {
  BarChart3,
  Trophy,
  Newspaper,
  BookOpen,
  Gift,
  Calculator,
  Brain,
  Zap,
  User,
  LogOut,
} from 'lucide-react'

const NAV = [
  { href: '/odds',        label: 'Comparador',  icon: BarChart3 },
  { href: '/palpites',    label: 'Palpites',    icon: Trophy },
  { href: '/ranking',     label: 'Ranking',     icon: Trophy },
  { href: '/noticias',    label: 'Notícias',    icon: Newspaper },
  { href: '/guias',       label: 'Guias',       icon: BookOpen },
  { href: '/melhores-bonus', label: 'Bônus',   icon: Gift },
  { href: '/calculadora', label: 'Calculadora', icon: Calculator },
  { href: '/quiz',        label: 'Quiz',        icon: Brain },
]

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
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[oklch(0.07_0.012_253)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center neon-glow-sm">
            <Zap className="w-4 h-4 text-black fill-black" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-white">Odds</span>
            <span className="text-green-500">BR</span>
          </span>
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right area */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Copa badge */}
          <Link
            href="/copa-2026"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors"
          >
            🏆 <span>Copa 2026</span>
          </Link>

          {/* Premium */}
          {user && !profile?.is_premium && (
            <Link
              href="/premium"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              <Zap className="w-3 h-3 fill-green-400" />
              Premium
            </Link>
          )}

          {user ? (
            <>
              <Link
                href="/perfil"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block max-w-[100px] truncate">
                  {profile?.display_name ?? user.email?.split('@')[0]}
                </span>
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Sair</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="px-4 py-1.5 text-sm font-bold text-black bg-green-500 hover:bg-green-400 rounded-lg transition-colors neon-glow-sm"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden border-t border-white/5 overflow-x-auto">
        <div className="flex items-center gap-0.5 px-4 py-1.5 min-w-max">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap"
            >
              <Icon className="w-3 h-3" />
              {label}
            </Link>
          ))}
          <Link
            href="/copa-2026"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-400 whitespace-nowrap"
          >
            🏆 Copa
          </Link>
        </div>
      </div>
    </header>
  )
}
