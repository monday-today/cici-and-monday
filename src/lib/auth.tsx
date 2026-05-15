import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { supabase } from './supabase'

interface AuthState {
  token: string | null
  uid: string | null
  password: string | null
}

interface AuthContextType extends AuthState {
  login: (password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

let attemptCount = 0
let lockoutUntil = 0

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null, uid: null, password: null,
  })

  const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    if (Date.now() < lockoutUntil) {
      const minutes = Math.ceil((lockoutUntil - Date.now()) / 60000)
      return { success: false, error: `请等待 ${minutes} 分钟后再试` }
    }

    const email = import.meta.env.VITE_AUTH_EMAIL
    if (!email) {
      return { success: false, error: '系统配置错误' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      attemptCount++
      if (attemptCount >= MAX_ATTEMPTS) {
        lockoutUntil = Date.now() + LOCKOUT_MS
        attemptCount = 0
        return { success: false, error: '尝试次数过多，请 15 分钟后再试' }
      }
      const remaining = MAX_ATTEMPTS - attemptCount
      return { success: false, error: `密码不正确，还剩 ${remaining} 次机会` }
    }

    attemptCount = 0
    lockoutUntil = 0
    setState({
      token: data.session.access_token,
      uid: data.session.user.id,
      password,
    })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setState({ token: null, uid: null, password: null })
    supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      isAuthenticated: !!state.token,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
