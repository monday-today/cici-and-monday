import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import type { ReactNode } from 'react'

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}
