import { Outlet } from 'react-router-dom'
import { useSidebar } from '@/contexts/SidebarContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh-3.5rem)] transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}
