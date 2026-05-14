'use client'

import { useState, useEffect, useCallback } from 'react'
import { BONUS_OFFERS } from '@/lib/bonuses'

const VARIANT_KEY = 'oddsbr_cta_variant'
const ROTATE_MS = 6000

// A/B test: variante A = "Apostar agora" | variante B = "Resgatar bônus"
const CTA_LABELS: Record<string, string> = {
  a: 'Apostar agora →',
  b: 'Resgatar bônus →',
}

interface Props {
  source: string
}

export default function BonusBanner({ source }: Props) {
  const [index, setIndex] = useState(0)
  const [variant, setVariant] = useState<'a' | 'b'>('a')
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(VARIANT_KEY) as 'a' | 'b' | null
    if (stored === 'a' || stored === 'b') {
      setVariant(stored)
    } else {
      const v: 'a' | 'b' = Math.random() < 0.5 ? 'a' : 'b'
      localStorage.setItem(VARIANT_KEY, v)
      setVariant(v)
    }
  }, [])

  const next = useCallback(() => setIndex((i) => (i + 1) % BONUS_OFFERS.length), [])
  const prev = useCallback(() => setIndex((i) => (i - 1 + BONUS_OFFERS.length) % BONUS_OFFERS.length), [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, ROTATE_MS)
    return () => clearInterval(timer)
  }, [paused, next])

  const offer = BONUS_OFFERS[index]
  const href = `/api/click/${offer.bookmakerKey}?source=${source}&variant=${variant}`

  return (
    <div
      className="rounded-xl border bg-card overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Cor da casa */}
        <div
          className="hidden sm:block w-1 self-stretch rounded-full shrink-0"
          style={{ backgroundColor: offer.accentColor }}
        />

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-sm font-bold">{offer.name}</span>
            {offer.badge && (
              <span className="rounded-full text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-600">
                {offer.badge}
              </span>
            )}
          </div>
          <p className="text-xl font-extrabold text-green-600 leading-tight">{offer.bonus}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{offer.highlight}</p>
        </div>

        {/* CTA */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="shrink-0 inline-flex items-center rounded-lg bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold transition-colors"
        >
          {CTA_LABELS[variant]}
        </a>

        {/* Navigation */}
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={prev}
            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs"
            aria-label="Oferta anterior"
          >
            ▲
          </button>
          <button
            onClick={next}
            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs"
            aria-label="Próxima oferta"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 pb-2.5">
        {BONUS_OFFERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all ${
              i === index ? 'w-4 h-1.5 bg-green-500' : 'w-1.5 h-1.5 bg-muted-foreground/30'
            }`}
            aria-label={`Oferta ${i + 1}`}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="border-t px-5 py-1.5 text-[10px] text-muted-foreground/60">
        Publicidade. Sujeito a Termos e Condições. +18. Jogue com responsabilidade.
        Depósito mínimo: R${offer.minDeposit}. Rollover: {offer.rolloverTimes}x nas odds {offer.rolloverOdds.toFixed(2)}+.
      </div>
    </div>
  )
}
