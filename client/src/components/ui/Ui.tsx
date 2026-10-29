import { t, useLanguage } from '../../i18n/language'
import { AlertCircle, ArrowUpRight, CheckCircle2, Inbox, LoaderCircle, RefreshCw } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  useLanguage()
  const colors = variant === 'primary' ? 'border-[#294b34] bg-[#294b34] text-white hover:bg-[#355c40]' : variant === 'danger' ? 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100' : 'border-border bg-white text-ink hover:bg-surface'
  return <button type="button" className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50 ${colors} ${className}`} {...props}>{typeof children === "string" ? t(children) : children}</button>
}

export function PageHeading({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  useLanguage()
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{t(eyebrow)}</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t(title)}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description && t(description)}</p></div>{children}</div>
}

export function Notice({ children, success = false }: { children: ReactNode; success?: boolean }) {
  useLanguage()
  const Icon = success ? CheckCircle2 : AlertCircle
  return <div role={success ? 'status' : 'alert'} className={`flex items-start gap-3 rounded-lg border p-4 text-sm leading-relaxed ${success ? 'border-[#c8d9bc] bg-[#edf4e6] text-[#38572b]' : 'border-red-200 bg-red-50 text-red-800'}`}><Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{typeof children === "string" ? t(children) : children}</span></div>
}

export function Loading({ label = 'Loading your workspace…' }: { label?: string }) {
  useLanguage()
  return <div role="status" className="flex min-h-48 items-center justify-center gap-3 rounded-xl border border-border bg-white/60 p-8 text-sm text-muted"><LoaderCircle className="motion-safe:animate-spin" size={20} aria-hidden="true" />{t(label)}</div>
}

export function LoadError({ message, retry }: { message: string; retry: () => void }) {
  useLanguage()
  return <div className="space-y-4"><Notice>{t(message)}</Notice><Button variant="secondary" onClick={retry}><RefreshCw size={15} />{t("Try again")}</Button></div>
}

export function Empty({ title = 'Nothing here yet', description = 'Records will appear here when they are available.' }: { title?: string; description?: string }) {
  useLanguage()
  return <div className="flex flex-col items-center px-6 py-16 text-center"><span className="mb-4 rounded-2xl bg-surface p-4 text-muted"><Inbox size={26} aria-hidden="true" /></span><h3 className="font-semibold">{t(title)}</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description && t(description)}</p></div>
}

export function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'amber' | 'neutral' }) {
  useLanguage()
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${tone === 'green' ? 'bg-[#eaf1e3] text-[#486038]' : tone === 'amber' ? 'bg-[#fff0d8] text-[#926325]' : 'bg-[#f0f1ed] text-muted'}`}>{children}</span>
}

export function Metric({ label, value, note, icon, to }: { label: string; value: ReactNode; note: string; icon: ReactNode; to: string }) {
  useLanguage()
  return <Link to={to} className="group rounded-xl border border-border bg-white p-5 shadow-[0_2px_8px_#23382d03] transition-colors hover:border-[#a3b295] focus-visible:outline-2 focus-visible:outline-ink"><div className="flex items-center justify-between text-muted"><span className="text-xs font-medium">{t(label)}</span><span className="rounded-lg bg-surface p-2 text-[#547047]">{icon}</span></div><p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{value}</p><div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted"><span>{t(note)}</span><ArrowUpRight size={15} className="group-hover:text-ink" /></div></Link>
}
