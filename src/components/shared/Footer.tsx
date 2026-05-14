import Link from 'next/link'
import { Zap } from 'lucide-react'

const LINKS = {
  Ferramentas: [
    { href: '/odds',         label: 'Comparador de Odds' },
    { href: '/palpites',     label: 'Palpites' },
    { href: '/ranking',      label: 'Ranking' },
    { href: '/calculadora',  label: 'Calculadora de Banca' },
    { href: '/quiz',         label: 'Quiz Diário' },
  ],
  Conteúdo: [
    { href: '/noticias',          label: 'Notícias' },
    { href: '/guias',             label: 'Guias' },
    { href: '/melhores-bonus',    label: 'Melhores Bônus' },
    { href: '/copa-2026',         label: '🏆 Copa 2026' },
    { href: '/copa-2026/selecoes',label: 'Seleções da Copa' },
  ],
  Conta: [
    { href: '/login',    label: 'Entrar' },
    { href: '/cadastro', label: 'Criar conta' },
    { href: '/premium',  label: '⚡ Premium' },
    { href: '/perfil',   label: 'Meu Perfil' },
    { href: '/alertas',  label: 'Alertas de Odds' },
  ],
}

const CASAS = [
  { name: 'Betano',     href: '/odds' },
  { name: 'Superbet',   href: '/odds' },
  { name: 'Bet365',     href: '/odds' },
  { name: 'KTO',        href: '/odds' },
  { name: 'Estrela Bet',href: '/odds' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[oklch(0.07_0.012_253)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-extrabold text-lg">
                <span className="text-white">Odds</span>
                <span className="text-green-500">BR</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
              Comparador de odds em tempo real. Encontre a melhor odd antes de apostar.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {CASAS.map((c) => (
                <Link
                  key={c.name}
                  href={c.href}
                  className="text-[10px] text-muted-foreground border border-white/10 px-2 py-0.5 rounded hover:border-green-500/40 hover:text-green-500 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-6 space-y-3">
          {/* Aviso +18 */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center justify-center rounded bg-destructive text-white text-[10px] font-bold px-1.5 py-0.5 shrink-0">
              +18
            </span>
            <span>
              Jogue com responsabilidade. Apostas são exclusivas para maiores de 18 anos e envolvem risco de perda financeira.
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground/70">
            O OddsBR contém links de afiliados rastreados. Não operamos apostas e não recebemos dinheiro dos usuários para apostas.
            As odds exibidas podem variar. Aposte com estratégia — compare antes de decidir.
          </p>
          <p className="text-[11px] text-muted-foreground/50">
            © {new Date().getFullYear()} OddsBR. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
