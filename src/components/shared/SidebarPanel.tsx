'use client'

import { type ReactNode } from 'react'
import { useSidebar } from './SidebarProvider'
import { cn } from '@/lib/utils'

export function SidebarPanel({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar()

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={close}
      />

      {/*
        - Mobile:  position:fixed, overlay drawer, z-40
        - Desktop: position:sticky, parte do flex layout, z-auto
        O breakpoint lg: sobrescreve `fixed` → `sticky`
      */}
      <aside
        className={cn(
          // Dimensões e visual
          'w-[260px] shrink-0 border-r border-white/5 bg-[oklch(0.075_0.012_253)] overflow-y-auto',
          // Altura total abaixo do header (header = h-14 = 3.5rem)
          'h-[calc(100vh-3.5rem)]',
          // Mobile: fixed drawer
          'fixed top-14 left-0 z-40',
          // Animação de slide (mobile)
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: sticky no flow, sem translate
          'lg:sticky lg:z-auto lg:translate-x-0',
          // Desktop: ocultar removendo do flow quando fechado
          !isOpen && 'lg:hidden',
        )}
      >
        {children}
      </aside>
    </>
  )
}

/** Botão de toggle — usado no Header */
export function SidebarToggleBtn({ className }: { className?: string }) {
  const { toggle, isOpen } = useSidebar()
  return (
    <button
      onClick={toggle}
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white transition-colors',
        className,
      )}
    >
      {/* Ícone hamburguer / X */}
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        className="w-5 h-5"
      >
        {isOpen ? (
          <>
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </>
        ) : (
          <>
            <line x1="3" y1="6" x2="17" y2="6" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="14" x2="17" y2="14" />
          </>
        )}
      </svg>
    </button>
  )
}
