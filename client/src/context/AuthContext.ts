import { createContext } from 'react'
import type { LoginRequest, LoginResponse } from '../types/auth'

export interface AuthContextValue {
  session: LoginResponse | null
  signIn: (request: LoginRequest) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)