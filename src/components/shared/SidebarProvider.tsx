'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface SidebarCtx {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const Ctx = createContext<SidebarCtx>({ isOpen: false, toggle: () => {}, close: () => {} })

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Começa fechado em SSR (seguro); abre no desktop no primeiro mount
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Desktop: abre por padrão. Mobile: fica fechado.
    if (window.innerWidth >= 1024) setIsOpen(true)
  }, [])

  return (
    <Ctx.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen((v) => !v),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useSidebar() {
  return useContext(Ctx)
}
