import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { login } from '../services/authService'
import { setAccessToken } from '../lib/api'
import type { LoginRequest, LoginResponse } from '../types/auth'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<LoginResponse | null>(null)

  async function signIn(request: LoginRequest): Promise<void> {
    const result = await login(request)

    setAccessToken(result.token)
    setSession(result)
  }

  function signOut() {
    setAccessToken(null)
    setSession(null)
  }

  return (
    <AuthContext value={{ session, signIn, signOut }}>
      {children}
    </AuthContext>
  )
}