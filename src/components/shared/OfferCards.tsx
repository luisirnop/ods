'use client'

import { useState } from 'react'
import { Gift, Copy, Check } from 'lucide-react'
import { BONUS_OFFERS } from '@/lib/bonuses'

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-md border border-dashed border-white/20 bg-white/4 hover:bg-white/8 px-2 py-1 transition-colors group"
      title="Copiar código"
    >
      <span className="text-[10px] font-mono font-bold text-green-400 tracking-wider">{code}</span>
      {copied
        ? <Check className="w-2.5 h-2.5 text-green-400 shrink-0" />
        : <Copy className="w-2.5 h-2.5 text-muted-foreground/50 group-hover:text-muted-foreground shrink-0 transition-colors" />
      }
    </button>
  )
}

export default function OfferCards() {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 -mx-4 px-4 py-2 bg-[oklch(0.10_0.010_253)]">
        <Gift className="w-3.5 h-3.5 text-green-500 shrink-0" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Melhores ofertas
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {BONUS_OFFERS.map((offer) => (
          <div
            key={offer.bookmakerKey}
            className="rounded-xl border border-white/8 bg-card overflow-hidden hover:border-white/15 transition-colors"
          >
            {/* Barra colorida top */}
            <div className="h-0.5" style={{ backgroundColor: offer.accentColor }} />

            <div className="p-3 space-y-2">
              {/* Nome + badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">{offer.name}</span>
                {offer.badge && (
                  <span className="rounded-full text-[8px] font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 leading-none whitespace-nowrap shrink-0">
                    {offer.badge}
                  </span>
                )}
              </div>

              {/* Bonus */}
              <div>
                <p className="text-base font-extrabold text-green-400 leading-none">{offer.bonus}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{offer.bonusDetail}</p>
              </div>

              {/* Código + CTA */}
              <div className="flex items-center gap-2">
                {offer.promoCode && <CopyCode code={offer.promoCode} />}
                <a
                  href={`/api/click/${offer.bookmakerKey}?source=right-sidebar&variant=a`}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="ml-auto flex items-center rounded-lg bg-green-500 hover:bg-green-400 text-black px-2.5 py-1.5 text-[10px] font-bold transition-colors neon-glow-sm whitespace-nowrap shrink-0"
                >
                  Resgatar →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] text-muted-foreground/40 leading-relaxed text-center">
        Publicidade · +18 · T&Cs aplicáveis · Jogue com responsabilidade
      </p>
    </div>
  )
}
