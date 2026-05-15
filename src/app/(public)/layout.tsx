import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import Sidebar from '@/components/shared/Sidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import { SidebarProvider } from '@/components/shared/SidebarProvider'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Header />
      {/* items-start obrigatório para position:sticky funcionar no flex container */}
      <div className="flex flex-1 items-start">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
        <RightSidebar />
      </div>
      <Footer />
    </SidebarProvider>
  )
}
