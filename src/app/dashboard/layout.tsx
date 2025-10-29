import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { Footer } from '@/components/Footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <aside className="hidden lg:block w-64 border-r bg-muted/40">
          <Sidebar />
        </aside>
        <main className="flex-1 space-y-4 p-4 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}