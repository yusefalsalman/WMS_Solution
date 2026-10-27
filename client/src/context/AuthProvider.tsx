import { useCallback, useEffect, useState } from 'react'
import { setAccessToken, registerUnauthorizedHandler } from '../lib/api'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { login } from '../services/authService'
import { readSession, saveSession, clearSession } from '../lib/authStorage'
import type { LoginRequest, LoginResponse } from '../types/auth'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<LoginResponse | null>(readSession)

  async function signIn(request: LoginRequest): Promise<void> {
    const result = await login(request)

    saveSession(result)
    setAccessToken(result.token)
    setSession(result)
  }

  const signOut = useCallback(() => {
    clearSession()
    setAccessToken(null)
    setSession(null)
  }, [])

  useEffect(() => {
    const unregister = registerUnauthorizedHandler(signOut)

    return unregister
  }, [signOut])

  useEffect(() => {
    if (session === null) return

    const expiresAt = Date.parse(session.expiresAt)
    const remainingTime = Math.max(0, expiresAt - Date.now())
    const timeoutId = window.setTimeout(signOut, remainingTime)

    function checkExpiry() {
      if (Date.now() >= expiresAt) signOut()
    }

    window.addEventListener('focus', checkExpiry)
    document.addEventListener('visibilitychange', checkExpiry)

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('focus', checkExpiry)
      document.removeEventListener('visibilitychange', checkExpiry)
    }
  }, [session, signOut])

  return (
    <AuthContext value={{ session, signIn, signOut }}>
      {children}
    </AuthContext>
  )
}
