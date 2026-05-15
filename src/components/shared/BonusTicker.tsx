'use client'

import { BONUS_OFFERS } from '@/lib/bonuses'

// Duplicado para loop contínuo sem salto
const ITEMS = [...BONUS_OFFERS, ...BONUS_OFFERS]

export default function BonusTicker() {
  return (
    <div className="space-y-2">
      {/* Faixa com fade nas bordas */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
        aria-label="Bônus das principais casas de apostas"
      >
        <div className="flex gap-3 w-max [animation:ticker_28s_linear_infinite] hover:[animation-play-state:paused]">
          {ITEMS.map((offer, i) => (
            <a
              key={`${offer.bookmakerKey}-${i}`}
              href={`/api/click/${offer.bookmakerKey}?source=ticker&variant=a`}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-card hover:border-white/20 hover:bg-white/5 transition-colors shrink-0 group"
            >
              {/* Barra colorida da casa */}
              <div
                className="w-1 h-10 rounded-full shrink-0"
                style={{ backgroundColor: offer.accentColor }}
              />

              {/* Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-white whitespace-nowrap">{offer.name}</span>
                  {offer.badge && (
                    <span className="rounded-full text-[8px] font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 leading-none whitespace-nowrap">
                      {offer.badge}
                    </span>
                  )}
                </div>
                <p className="text-lg font-extrabold text-green-400 leading-none whitespace-nowrap">
                  {offer.bonus}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
                  {offer.highlight}
                </p>
              </div>

              {/* CTA */}
              <span className="ml-2 text-xs font-bold text-green-500 group-hover:text-green-400 whitespace-nowrap shrink-0 transition-colors">
                Resgatar →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[9px] text-muted-foreground/40">
        Publicidade · +18 · Sujeito a Termos e Condições · Jogue com responsabilidade
      </p>
    </div>
  )
}
