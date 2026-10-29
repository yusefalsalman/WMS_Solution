import { t, useLanguage } from '../i18n/language'
import { Link } from 'react-router'
import { MapPinOff } from 'lucide-react'

export function NotFoundPage() {
  useLanguage()
  return <div className="rounded-2xl border border-border bg-white px-6 py-20 text-center"><MapPinOff className="mx-auto mb-5 text-muted" size={36} /><p className="font-mono text-xs text-muted">{t("404 / NOT FOUND")}</p><h1 className="mt-3 text-2xl font-semibold">{t("This aisle does not exist.")}</h1><p className="mt-3 text-sm text-muted">{t("The page may have moved, or the link may be incorrect.")}</p><Link to="/" className="mt-6 inline-block rounded-lg bg-ink px-5 py-3 text-sm text-white">{t("Back to overview")}</Link></div>
}
