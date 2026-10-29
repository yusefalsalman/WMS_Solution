import { t, useLanguage } from '../../i18n/language'
import { Link, Outlet } from 'react-router'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function ManagerRoute() {
  useLanguage()
  const { session } = useAuth()
  if (session?.role === 'Admin' || session?.role === 'Manager') return <Outlet />
  return <div className="rounded-2xl border border-border bg-white px-6 py-20 text-center"><ShieldCheck className="mx-auto mb-5 text-muted" size={36} /><h1 className="text-2xl font-semibold">{t("This area is for managers")}</h1><p className="mt-3 text-sm text-muted">{t("Your account can still manage daily inventory and stock transfers.")}</p><Link className="mt-6 inline-block rounded-lg bg-ink px-5 py-3 text-sm text-white" to="/inventory">{t("Go to inventory")}</Link></div>
}
