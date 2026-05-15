import Image from 'next/image'
import Link from 'next/link'
import { createClient, hasSupabase } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { MOCK_GAMES } from '@/lib/mock-data'
import { getLiveMatches } from '@/lib/football-api'
import { LEAGUES_CONFIG } from '@/lib/leagues'
import TeamBadge from '@/components/ui/TeamBadge'
import { SidebarPanel } from './SidebarPanel'
import FavoritosGuestSection from './FavoritosGuestSection'
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

// Logos via Fotmob (IDs da football-api.ts)
const FOTMOB_LEAGUE = (id: number) =>
  `https://images.fotmob.com/image_resources/logo/leaguelogo/dark/${id}.png`

// ─── Campeonatos ────────────────────────────────────────────────────────────
const LEAGUES = [
  { label: 'Brasileirão Série A', logo: FOTMOB_LEAGUE(268),  href: '/campeonatos/brasileirao-a' },
  { label: 'Brasileirão Série B', logo: FOTMOB_LEAGUE(8814), href: '/campeonatos/brasileirao-b' },
  { label: 'Libertadores',        logo: FOTMOB_LEAGUE(45),   href: '/campeonatos/libertadores'  },
  { label: 'Sul-Americana',       logo: FOTMOB_LEAGUE(299),  href: '/campeonatos/sul-americana' },
  { label: 'Premier League',      logo: FOTMOB_LEAGUE(47),   href: '/campeonatos/premier-league'},
  { label: 'Champions League',    logo: FOTMOB_LEAGUE(42),   href: '/campeonatos/champions'     },
  { label: 'Europa League',       logo: FOTMOB_LEAGUE(73),   href: '/campeonatos/europa-league' },
  { label: 'La Liga',             logo: FOTMOB_LEAGUE(87),   href: '/campeonatos/la-liga'       },
  { label: 'Serie A',             logo: FOTMOB_LEAGUE(55),   href: '/campeonatos/serie-a'       },
  { label: 'Bundesliga',          logo: FOTMOB_LEAGUE(54),   href: '/campeonatos/bundesliga'    },
  { label: 'Copa 2026',           logo: FOTMOB_LEAGUE(77),   href: '/copa-2026'                 },
]

// ─── Times populares ─────────────────────────────────────────────────────────
const POPULAR_TEAMS = [
  { name: 'Flamengo',    slug: 'flamengo'    },
  { name: 'Palmeiras',   slug: 'palmeiras'   },
  { name: 'Corinthians', slug: 'corinthians' },
  { name: 'São Paulo',   slug: 'sao-paulo'   },
  { name: 'Atlético-MG', slug: 'atletico-mg' },
  { name: 'Fluminense',  slug: 'fluminense'  },
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
    <section className="border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 px-4 py-2 bg-[oklch(0.10_0.010_253)]">
        <Icon className="w-3.5 h-3.5 text-green-500" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {title}
        </span>
      </div>
      <div className="py-1">{children}</div>
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
      className={`flex items-center gap-2.5 px-4 py-1 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-none transition-colors ${className ?? ''}`}
    >
      {children}
    </Link>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────
export default async function Sidebar() {
  let user: { id: string } | null = null
  let favoriteTeam: string | null = null
  let isFavoriteInLive = false
  let bolaoToken: string | null = null

  if (hasSupabase()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user

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
    } catch {}
  }

  // Jogos ao vivo reais via API (filtrados pelas ligas que cobrimos)
  const knownLeagueIds = new Set(LEAGUES_CONFIG.map((l) => l.leagueId))
  const allLive = await getLiveMatches().catch(() => [])
  const liveGames = allLive.filter((m) => knownLeagueIds.has(m.leagueId)).slice(0, 5)

  return (
    <SidebarPanel>
      {/* ─── Ao vivo ─────────────────────────────── */}
      {liveGames.length > 0 && (
        <SidebarSection icon={Star} title="Ao vivo">
          {liveGames.map((m) => {
            const league = LEAGUES_CONFIG.find((l) => l.leagueId === m.leagueId)
            return (
              <SidebarLink
                key={m.id}
                href={league ? `/campeonatos/${league.slug}` : '/odds'}
              >
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="truncate text-xs flex-1">
                  {m.home.name} × {m.away.name}
                </span>
                <span className="shrink-0 text-[10px] font-bold text-red-400 tabular-nums">
                  {m.home.score}–{m.away.score}
                </span>
              </SidebarLink>
            )
          })}
        </SidebarSection>
      )}

      {/* ─── Campeonatos ─────────────────────────── */}
      <SidebarSection icon={Globe} title="Campeonatos">
        {LEAGUES.map((l) => (
          <SidebarLink key={l.href} href={l.href}>
            <span className="w-6 h-6 shrink-0 flex items-center justify-center rounded bg-white/90 p-0.5">
              <Image
                src={l.logo}
                alt={l.label}
                width={20}
                height={20}
                className="object-contain w-full h-full"
                unoptimized
              />
            </span>
            <span className="truncate">{l.label}</span>
          </SidebarLink>
        ))}
      </SidebarSection>

      {/* ─── Favoritos ───────────────────────────── */}
      {user ? (
        <SidebarSection icon={Heart} title="Favoritos">
          {favoriteTeam ? (
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
          )}
        </SidebarSection>
      ) : (
        <FavoritosGuestSection />
      )}

      {/* ─── Times ───────────────────────────────── */}
      <SidebarSection icon={Users} title="Times">
        <div className="px-3 py-1 grid grid-cols-2 gap-1">
          {POPULAR_TEAMS.map((team) => (
            <Link
              key={team.slug}
              href={`/times/${team.slug}`}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-white hover:bg-white/5 transition-colors truncate"
            >
              <TeamBadge team={team.name} size="xs" />
              <span className="truncate">{team.name}</span>
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
      <div className="h-4" />
    </SidebarPanel>
  )
}
