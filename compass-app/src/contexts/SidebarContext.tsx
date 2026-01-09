import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  isHovered: boolean
  setIsCollapsed: (collapsed: boolean) => void
  setIsHovered: (hovered: boolean) => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed'
const MOBILE_BREAKPOINT = 768

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsedState] = useState(() => {
    if (typeof window === 'undefined') return false
    
    // Check if mobile
    if (window.innerWidth < MOBILE_BREAKPOINT) return true
    
    // Check localStorage
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    return stored === 'true'
  })
  
  const [isHovered, setIsHovered] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setIsCollapsedState(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle keyboard shortcut (Cmd/Ctrl + B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const setIsCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsedState(collapsed)
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  }, [])

  const toggle = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed, setIsCollapsed])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isHovered,
        setIsCollapsed,
        setIsHovered,
        toggle,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
