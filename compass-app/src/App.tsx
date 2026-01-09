import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { TooltipProvider } from '@/components/ui/tooltip'

import { AppLayout } from '@/components/layout/AppLayout'

import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectPage } from '@/pages/ProjectPage'
import { NewProjectPage } from '@/pages/NewProjectPage'
import { AdminPage } from '@/pages/AdminPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/projects/:id" element={<ProjectPage />} />
                    <Route path="/projects/new" element={<NewProjectPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/profile" element={<div className="p-6">Profiel - coming soon</div>} />
                  </Route>

                  {/* Catch all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
              <Toaster position="bottom-right" richColors />
            </TooltipProvider>
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
