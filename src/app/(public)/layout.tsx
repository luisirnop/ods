import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import Sidebar from '@/components/shared/Sidebar'
import { SidebarProvider } from '@/components/shared/SidebarProvider'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Header />
      {/*
        items-start é obrigatório para que `position:sticky` funcione
        dentro de um flex container — sem isso o sidebar estica
        e o sticky fica preso ao topo sem rolar.
      */}
      <div className="flex flex-1 items-start">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </SidebarProvider>
  )
}
