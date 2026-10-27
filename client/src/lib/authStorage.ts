import type { LoginResponse } from '../types/auth'

const SESSION_KEY = 'wms-session'

export function saveSession(session: LoginResponse): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function readSession(): LoginResponse | null {
  const storedSession = sessionStorage.getItem(SESSION_KEY)

  if (storedSession === null) return null

  try {
    const session = JSON.parse(storedSession)

    if (
      !session ||
      typeof session.token !== 'string' ||
      typeof session.expiresAt !== 'string' ||
      typeof session.username !== 'string' ||
      !['Admin', 'Manager', 'Clerk'].includes(session.role)
    ) {
      clearSession()
      return null
    }

    const expiresAt = Date.parse(session.expiresAt)

    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      clearSession()
      return null
    }

    return session
  } catch {
    clearSession()
    return null
  }
}