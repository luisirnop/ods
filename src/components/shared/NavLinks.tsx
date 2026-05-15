'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Trophy, Newspaper, BookOpen, Gift, Calculator, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/odds',           label: 'Comparador', icon: BarChart3  },
  { href: '/palpites',       label: 'Palpites',   icon: Trophy     },
  { href: '/ranking',        label: 'Ranking',    icon: Trophy     },
  { href: '/noticias',       label: 'Notícias',   icon: Newspaper  },
  { href: '/guias',          label: 'Guias',      icon: BookOpen   },
  { href: '/melhores-bonus', label: 'Bônus',      icon: Gift       },
  { href: '/calculadora',    label: 'Calculadora',icon: Calculator },
  { href: '/quiz',           label: 'Quiz',       icon: Brain      },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:flex items-center gap-0.5 flex-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors',
              active
                ? 'bg-white/8 text-white font-semibold'
                : 'text-muted-foreground hover:text-white hover:bg-white/5',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
