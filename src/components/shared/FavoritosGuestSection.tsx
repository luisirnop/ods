'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ChevronDown } from 'lucide-react'

export default function FavoritosGuestSection() {
  const [open, setOpen] = useState(false)

  return (
    <section className="py-2 border-b border-white/5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 w-full bg-[oklch(0.10_0.010_253)] hover:bg-[oklch(0.13_0.012_253)] transition-colors"
      >
        <Heart className="w-3.5 h-3.5 text-green-500 shrink-0" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex-1 text-left">
          Favoritos
        </span>
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
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
    </section>
  )
}
