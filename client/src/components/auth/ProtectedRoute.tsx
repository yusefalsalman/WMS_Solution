import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute() {
  const { session } = useAuth()

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}