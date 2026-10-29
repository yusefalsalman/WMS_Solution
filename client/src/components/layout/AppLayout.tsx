import { LanguageSwitcher } from '../../i18n/LanguageSwitcher'
import { t, useLanguage } from '../../i18n/language'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { ArrowLeftRight, Bell, Box, Boxes, ChartNoAxesCombined, ChevronRight, LayoutDashboard, LogOut, Menu, Warehouse } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Modal } from '../ui/Modal'

const operations = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Box },
  { to: '/warehouses', label: 'Warehouses', icon: Warehouse },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
]
const insights = [
  { to: '/reports', label: 'Reports & activity', icon: ChartNoAxesCombined },
  { to: '/alerts', label: 'Stock alerts', icon: Bell },
]

function Navigation({ dark = false, onNavigate }: { dark?: boolean; onNavigate?: () => void }) {
  useLanguage()
  const { session } = useAuth()
  const manager = session?.role === 'Admin' || session?.role === 'Manager'
  return <nav aria-label={t("Main navigation")} className="space-y-8">{[{ name: 'Operations', items: operations }, ...(manager ? [{ name: 'Insights', items: insights }] : [])].map(group => <div key={t(group.name)}><p className={`mb-3 px-3 font-mono text-[9px] tracking-[0.18em] uppercase ${dark ? 'text-[#8fa58e]' : 'text-muted'}`}>{t(group.name)}</p><div className="space-y-1">{group.items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${isActive ? dark ? 'bg-[#3c5740] text-[#f6e3c3]' : 'bg-[#eaf1e3] text-ink' : dark ? 'text-[#bac9b6] hover:bg-white/5 hover:text-white' : 'text-muted hover:bg-surface'}`}><Icon size={18} strokeWidth={1.6} />{t(label)}</NavLink>)}</div></div>)}</nav>
}

export function AppLayout() {
  useLanguage()
  const { session, signOut } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const title = [...operations, ...insights].find(item => item.to === location.pathname)?.label ?? 'Workspace'
  return <div className="min-h-svh bg-surface">
    <a href="#workspace-content" className="sr-only z-50 rounded-lg bg-white p-3 focus:not-sr-only focus:fixed focus:top-3 focus:start-3">{t("Skip to content")}</a>
    <aside className="fixed inset-y-0 start-0 z-20 hidden w-[232px] flex-col border-e border-[#304a35] bg-[#203b2c] p-5 text-white lg:flex">
      <NavLink to="/" className="mb-12 mt-3 flex items-center gap-3 px-3" aria-label={t("WMS overview")}><Box className="text-[#edbd7e]" size={31} strokeWidth={1.4} /><div><span className="text-xl font-bold tracking-tight">WMS<span className="text-accent">.</span></span><p className="mt-0.5 font-mono text-[8px] tracking-[0.13em] text-[#a4b69e] uppercase">{t("Warehouse management")}</p></div></NavLink>
      <Navigation dark />
      <div className="mt-auto pt-12"><div className="rounded-xl border border-[#5b7652]/40 bg-[#2a4431] p-4"><p className="text-xs font-medium text-[#e8dbbf]">{t("Every move. Under control.")}</p><p className="mt-2 text-[11px] leading-relaxed text-[#aebfa4]">{t("A shared view of your stock, spaces, and daily operations.")}</p></div><div className="mt-5 border-t border-[#47623f]/50 pt-5"><div className="flex items-center gap-3 px-1"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#ecbf83] text-sm font-semibold text-[#304830]">{session?.username.slice(0, 2).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{session?.username}</p><p className="mt-1 text-[10px] text-[#aebfa4]">{t(session?.role ?? "")}</p></div><button aria-label={t("Sign out")} onClick={signOut} className="rounded-lg p-2 text-[#aebfa4] hover:bg-white/10 hover:text-white focus-visible:outline-2"><LogOut size={17} /></button></div></div></div>
    </aside>
    <div className="lg:ps-[232px]"><header className="sticky top-0 z-10 flex h-[72px] items-center justify-between gap-4 border-b border-border bg-[#f5f5ef]/95 px-5 backdrop-blur-md sm:px-8"><div className="flex items-center gap-3"><button aria-label={t("Open navigation")} aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} className="rounded-md p-2 hover:bg-white lg:hidden"><Menu size={21} /></button><div className="flex items-center gap-2 text-xs"><span className="hidden text-muted sm:inline">{t("Workspace")}</span><ChevronRight size={13} className="hidden text-muted sm:block rtl:rotate-180" /><span className="font-medium">{t(title)}</span></div></div><div className="flex items-center gap-3"><LanguageSwitcher /><span className="hidden font-mono text-[10px] text-muted sm:inline">{new Intl.DateTimeFormat(document.documentElement.lang, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())}</span><span className="rounded-full border border-border bg-white px-3 py-1 text-[10px] text-muted">{t(session?.role ?? "")}</span></div></header>
      <main id="workspace-content" className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:py-10"><Outlet /></main>
      <footer className="mx-auto flex max-w-[1500px] flex-wrap justify-between gap-2 px-5 py-6 text-[10px] text-muted sm:px-8"><span>{t("WMS · Made for the way warehouses work.")}</span><span className="font-mono tracking-wider uppercase">{t("Operations workspace")}</span></footer>
    </div>
    {menuOpen && <Modal title={t("Your workspace")} onClose={() => setMenuOpen(false)}><Navigation onNavigate={() => setMenuOpen(false)} /><button onClick={signOut} className="mt-8 flex items-center gap-3 border-t border-border pt-5 text-sm"><LogOut size={17} />{t("Sign out ·")} {session?.username}</button></Modal>}
  </div>
}
