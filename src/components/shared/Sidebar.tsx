import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { MOCK_GAMES } from '@/lib/mock-data'
import TeamBadge from '@/components/ui/TeamBadge'
import { SidebarPanel } from './SidebarPanel'
import {
  BarChart3,
  Trophy,
  Heart,
  Users,
  ClipboardList,
  Calculator,
  Brain,
  Bell,
  MessageCircle,
  Zap,
  Star,
  Globe,
} from 'lucide-react'

// ─── Campeonatos ────────────────────────────────────────────────────────────
const LEAGUES = [
  { label: 'Brasileirão Série A', icon: '🇧🇷', href: '/odds?sport=brasileirao_a'  },
  { label: 'Brasileirão Série B', icon: '🇧🇷', href: '/odds?sport=brasileirao_b'  },
  { label: 'Copa do Brasil',       icon: '🏆', href: '/odds?sport=copa_brasil'    },
  { label: 'Libertadores',         icon: '🌎', href: '/odds?sport=libertadores'   },
  { label: 'Premier League',       icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', href: '/odds?sport=premier_league' },
  { label: 'Champions League',     icon: '⭐', href: '/odds?sport=champions'      },
  { label: 'Copa 2026',            icon: '🌐', href: '/copa-2026'                 },
]

// ─── Times populares ─────────────────────────────────────────────────────────
const POPULAR_TEAMS = [
  'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo',
  'Atlético-MG', 'Grêmio', 'Internacional', 'Fluminense',
]

// ─── Ferramentas ─────────────────────────────────────────────────────────────
const TOOLS = [
  { label: 'Calculadora',  icon: Calculator,      href: '/calculadora' },
  { label: 'Quiz do dia',  icon: Brain,           href: '/quiz'        },
  { label: 'Alertas',      icon: Bell,            href: '/alertas'     },
  { label: 'Bot Telegram', icon: MessageCircle,   href: '/telegram'    },
]

// ─── Helpers de UI ───────────────────────────────────────────────────────────
function SidebarSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 px-4 mb-2">
        <Icon className="w-3.5 h-3.5 text-green-500" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {title}
        </span>
      </div>
      {children}
    </section>
  )
}

function SidebarLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-4 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-none transition-colors ${className ?? ''}`}
    >
      {children}
    </Link>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────
export default async function Sidebar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Dados do perfil
  let favoriteTeam: string | null = null
  let isFavoriteInLive = false
  let bolaoToken: string | null = null

  if (user) {
    const admin = getAdminClient()
    const [profileRes, bolaoRes] = await Promise.all([
      admin
        .from('profiles')
        .select('favorite_team')
        .eq('id', user.id)
        .single(),
      admin
        .from('world_cup_brackets')
        .select('share_token')
        .eq('user_id', user.id)
        .single(),
    ])
    favoriteTeam = profileRes.data?.favorite_team ?? null
    bolaoToken = bolaoRes.data?.share_token ?? null

    if (favoriteTeam) {
      isFavoriteInLive = MOCK_GAMES.some(
        (g) =>
          g.home_team.toLowerCase().includes(favoriteTeam!.toLowerCase()) ||
          g.away_team.toLowerCase().includes(favoriteTeam!.toLowerCase())
      )
    }
  }

  // Jogos "ao vivo" (simulado: jogo nas próximas 2h)
  const liveGames = MOCK_GAMES.filter((g) => {
    const start = new Date(g.commence_time).getTime()
    const now = Date.now()
    return now >= start - 2 * 60 * 60 * 1000 && now <= start + 105 * 60 * 1000
  }).slice(0, 3)

  return (
    <SidebarPanel>
      {/* ─── Ao vivo ─────────────────────────────── */}
      {liveGames.length > 0 && (
        <SidebarSection icon={Star} title="Ao vivo">
          {liveGames.map((g) => (
            <SidebarLink key={g.id} href={`/jogos/${g.id}`}>
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span className="truncate text-xs">
                {g.home_team} × {g.away_team}
              </span>
            </SidebarLink>
          ))}
        </SidebarSection>
      )}

      {/* ─── Campeonatos ─────────────────────────── */}
      <SidebarSection icon={Globe} title="Campeonatos">
        {LEAGUES.map((l) => (
          <SidebarLink key={l.href} href={l.href}>
            <span className="text-base leading-none w-4 text-center shrink-0">{l.icon}</span>
            <span className="truncate">{l.label}</span>
          </SidebarLink>
        ))}
      </SidebarSection>

      {/* ─── Favoritos ───────────────────────────── */}
      <SidebarSection icon={Heart} title="Favoritos">
        {user ? (
          favoriteTeam ? (
            <>
              <SidebarLink href={`/odds?team=${encodeURIComponent(favoriteTeam)}`}>
                <TeamBadge team={favoriteTeam} size="xs" />
                <span className="truncate font-medium text-white/90">{favoriteTeam}</span>
                {isFavoriteInLive && (
                  <span className="live-dot ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                )}
              </SidebarLink>
              <SidebarLink
                href="/perfil"
                className="text-xs text-muted-foreground/70 hover:text-muted-foreground"
              >
                <span className="truncate">Alterar time favorito →</span>
              </SidebarLink>
            </>
          ) : (
            <SidebarLink href="/perfil">
              <Heart className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              <span className="text-xs text-muted-foreground">Adicionar time favorito</span>
            </SidebarLink>
          )
        ) : (
          <div className="px-4 py-2 space-y-1.5">
            <p className="text-xs text-muted-foreground/70">
              Entre para salvar favoritos e receber alertas.
            </p>
            <Link
              href="/login"
              className="block text-center text-xs font-bold text-green-400 border border-green-500/30 bg-green-500/8 hover:bg-green-500/15 rounded-lg py-1.5 transition-colors"
            >
              Entrar →
            </Link>
          </div>
        )}
      </SidebarSection>

      {/* ─── Times ───────────────────────────────── */}
      <SidebarSection icon={Users} title="Times">
        <div className="px-3 py-1 grid grid-cols-2 gap-1">
          {POPULAR_TEAMS.map((team) => (
            <Link
              key={team}
              href={`/odds?team=${encodeURIComponent(team)}`}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-white hover:bg-white/5 transition-colors truncate"
            >
              <TeamBadge team={team} size="xs" />
              <span className="truncate">{team}</span>
            </Link>
          ))}
        </div>
        <SidebarLink href="/copa-2026/selecoes">
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>Seleções da Copa →</span>
        </SidebarLink>
      </SidebarSection>

      {/* ─── Bolões ──────────────────────────────── */}
      <SidebarSection icon={ClipboardList} title="Bolões">
        {bolaoToken ? (
          <SidebarLink href={`/copa-2026/bolao/${bolaoToken}`}>
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium text-amber-300">Meu bolão Copa 2026</span>
          </SidebarLink>
        ) : (
          <SidebarLink href="/copa-2026/bolao">
            <ClipboardList className="w-3.5 h-3.5 shrink-0" />
            <span>Criar bolão Copa 2026</span>
          </SidebarLink>
        )}
        <SidebarLink href="/copa-2026/ranking">
          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
          <span>Ranking do bolão</span>
        </SidebarLink>
        <SidebarLink href="/palpites">
          <Trophy className="w-3.5 h-3.5 shrink-0" />
          <span>Feed de palpites</span>
        </SidebarLink>
        <SidebarLink href="/ranking">
          <Star className="w-3.5 h-3.5 shrink-0" />
          <span>Ranking de tipsters</span>
        </SidebarLink>
      </SidebarSection>

      {/* ─── Ferramentas ─────────────────────────── */}
      <SidebarSection icon={Zap} title="Ferramentas">
        {TOOLS.map(({ label, icon: Icon, href }) => (
          <SidebarLink key={href} href={href}>
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
          </SidebarLink>
        ))}
        {/* Premium CTA */}
        {user && (
          <div className="px-4 pt-1 pb-2">
            <Link
              href="/premium"
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-black bg-green-500 hover:bg-green-400 rounded-lg py-2 transition-colors neon-glow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              Assinar Premium
            </Link>
          </div>
        )}
      </SidebarSection>

      {/* ─── Padding bottom ──────────────────────── */}
      <div className="h-8" />
    </SidebarPanel>
  )
}
