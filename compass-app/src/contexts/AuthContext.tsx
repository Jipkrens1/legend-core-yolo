import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'

// Demo user credentials
export const DEMO_USER = {
  email: 'demo@compass.app',
  password: 'demo123',
  name: 'Demo Admin',
}

// Create a mock user object for demo mode
const createDemoUser = (): User => ({
  id: 'demo-user-id-12345',
  aud: 'authenticated',
  role: 'authenticated',
  email: DEMO_USER.email,
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    full_name: DEMO_USER.name,
    role: 'admin',
  },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_anonymous: false,
})

// Create a mock session for demo mode
const createDemoSession = (user: User): Session => ({
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user,
})

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  signInAsDemo: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auto-login with demo user (login removed)
  const demoUser = createDemoUser()
  const [user] = useState<User | null>(demoUser)
  const [session] = useState<Session | null>(createDemoSession(demoUser))
  const [loading] = useState(false)
  const [isDemo] = useState(true)

  // No-op functions since login is removed
  const signInAsDemo = () => {}
  const signIn = async () => {}
  const signUp = async () => {}
  const signOut = async () => {}
  const resetPassword = async () => {}
  const updatePassword = async () => {}

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isDemo,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        signInAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
