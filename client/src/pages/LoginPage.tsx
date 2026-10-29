import { LanguageSwitcher } from '../i18n/LanguageSwitcher'
import { t, useLanguage } from '../i18n/language'
import type { SubmitEvent } from 'react'
import { isAxiosError } from 'axios'
import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { WarehouseIllustration } from '../components/brand/WarehouseIllustration'

export function LoginPage() {
  useLanguage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { session,signIn } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await signIn({ username, password })
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage('Invalid username or password. Please try again.')
      } else {
        setErrorMessage('Unable to sign in right now. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (session !== null) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-[1700px] flex-col gap-0 p-3 min-[721px]:grid min-[721px]:grid-cols-2 min-[721px]:gap-2.5 min-[721px]:p-3.5 min-[1001px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[1001px]:gap-[22px] min-[1001px]:p-[22px]">
      <aside className="relative flex flex-col overflow-hidden rounded-[13px] bg-[#203b2c] bg-[radial-gradient(ellipse_at_80%_65%,#39583a_0,transparent_68%)] p-6 text-[#edf0e3] min-[721px]:min-h-[calc(100svh-28px)] min-[721px]:rounded-[18px] min-[721px]:p-[30px] min-[1001px]:min-h-[calc(100svh-44px)] min-[1001px]:p-[clamp(30px,3.5vw,58px)]" aria-labelledby="login-story-title">
        <div className="inline-flex items-center gap-3" aria-label={t("WMS Warehouse Management")}>
          <span className="grid h-[34px] w-[30px] place-items-center text-[#efbd7d] min-[721px]:h-[43px] min-[721px]:w-[39px]" aria-hidden="true">
            <svg className="size-[31px] min-[721px]:size-[38px]" viewBox="0 0 40 40" fill="none">
              <path d="m20 3 15 8.5v17L20 37 5 28.5v-17L20 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="m5 11.5 15 9 15-9M20 20.5V37M12.5 7.3l15 8.5v8.7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <span className="text-[21px] leading-none font-bold tracking-[-0.8px] min-[721px]:text-[23px]">WMS<span aria-hidden="true">.</span></span>
            <span className="mt-1.5 block text-[8px] tracking-[1.2px] text-[#b0bfa8] uppercase min-[721px]:text-[10px]">{t("Warehouse Management")}</span>
          </div>
        </div>

        <div className="relative z-10 mt-[30px] min-[721px]:mt-[clamp(42px,7vh,80px)]">
          <p className="mb-3 flex items-center gap-[9px] font-mono text-[8px] font-medium tracking-[1.65px] text-[#becbb1] uppercase min-[721px]:mb-[19px] min-[721px]:text-[10px]">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
             {t("Operations, organized")} </p>
          <h1 className="text-[clamp(32px,8vw,46px)] leading-[1.09] font-medium tracking-[-1.5px] min-[721px]:text-[43px] min-[721px]:tracking-[-1.8px] min-[1001px]:text-[clamp(38px,4.1vw,66px)] min-[1001px]:tracking-[-2.8px]" id="login-story-title">{t("Every move.")}<br className="hidden min-[721px]:block" /> <span className="text-[#edc18a]">{t("Under control.")}</span></h1>
          <p className="mt-[13px] text-xs leading-[1.7] text-[#bdc9b6] min-[721px]:mt-[21px] min-[721px]:max-w-[345px] min-[721px]:text-sm min-[721px]:leading-[1.8]">
             {t("One workspace for your stock, your transfers, and the people keeping it all moving.")} </p>
        </div>

        <div className="-mx-6 mt-auto hidden pt-5 min-[721px]:block">
          <WarehouseIllustration />
        </div>

        <div className="mt-[22px] hidden flex-wrap justify-between gap-3 border-t border-[#aac09e30] pt-[22px] text-[10px] text-[#c9d2c0] min-[721px]:flex min-[1001px]:flex-nowrap min-[1001px]:gap-3.5 min-[1001px]:text-[11px]" aria-label={t("Workspace features")}>
          <span className="inline-flex items-center gap-2"><b className="font-mono text-[9px] font-normal text-[#8fa184]">01</b>  {t("Track inventory")}</span>
          <span className="inline-flex items-center gap-2"><b className="font-mono text-[9px] font-normal text-[#8fa184]">02</b>  {t("Move stock")}</span>
          <span className="inline-flex items-center gap-2"><b className="font-mono text-[9px] font-normal text-[#8fa184]">03</b>  {t("Stay informed")}</span>
        </div>
      </aside>

      <section className="flex min-w-0 flex-col px-5 pt-[30px] pb-2 min-[721px]:px-6 min-[721px]:pt-[17px] min-[721px]:pb-3.5 min-[1001px]:px-[clamp(20px,4vw,70px)]" aria-labelledby="login-form-heading">
        <div className="mb-4 flex justify-end"><LanguageSwitcher /></div>
        <header className="hidden items-center justify-between gap-3.5 font-mono text-[10px] tracking-[1.1px] text-muted uppercase min-[721px]:flex">
          <span>{t("Your operations workspace")}</span>
          <span className="hidden items-center gap-1.5 font-sans text-[11px] tracking-normal normal-case min-[1001px]:flex">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m12 3 7 3v6c0 4-7 9-7 9s-7-5-7-9V6l7-3Z" />
              <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
             {t("Role-based access")} </span>
        </header>

        <div className="m-auto w-full max-w-[420px] pb-[42px] motion-safe:animate-appear min-[721px]:max-w-[380px] min-[721px]:py-[70px]">
          <div className="mb-5 grid size-[37px] place-items-center rounded-[10px] border border-[#d8ded0] bg-[#ebeee2] text-[#446443] shadow-[inset_0_1px_0_#ffffffc7] min-[721px]:mb-[27px] min-[721px]:size-[47px] min-[721px]:rounded-[13px]" aria-hidden="true">
            <svg className="size-[19px] min-[721px]:size-[23px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21V8l9-5 9 5v13M7 21V11h10v10M3 21h18M7 15h10M7 18h10" />
            </svg>
          </div>
          <h2 className="mb-2.5 text-[29px] leading-[1.2] font-semibold tracking-[-1px] text-ink min-[721px]:text-[clamp(30px,3vw,38px)] min-[721px]:tracking-[-1.5px]" id="login-form-heading">{t("Welcome back.")}</h2>
          <p className="mb-[27px] text-[13px] leading-[1.7] text-muted min-[721px]:mb-[34px] min-[721px]:text-sm">{t("Sign in to keep your warehouse moving.")}</p>

          <aside aria-labelledby="demo-account-heading" className="mb-6 rounded-xl border border-[#bfd3b6] bg-[#edf5e7] p-4 text-[#294b34]">
            <h3 id="demo-account-heading" className="flex items-center gap-2 text-sm font-semibold">
              <span className="size-2 rounded-full bg-[#527c40]" aria-hidden="true" />
              {t("Demo account")}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#52684b]">{t("Explore the demo using these credentials.")}</p>
            <dl className="mt-3 grid gap-2 text-xs">
              <div className="flex items-center justify-between gap-4"><dt>{t("Username")}</dt><dd><code dir="ltr" className="select-all rounded-md border border-[#d2e1ca] bg-white/80 px-2 py-1 font-mono text-sm">admin</code></dd></div>
              <div className="flex items-center justify-between gap-4"><dt>{t("Password")}</dt><dd><code dir="ltr" className="select-all rounded-md border border-[#d2e1ca] bg-white/80 px-2 py-1 font-mono text-sm">admin123</code></dd></div>
            </dl>
          </aside>

          <form onSubmit={handleSubmit}>
            <div>
              <label className="mb-[9px] block text-xs font-semibold text-[#344335]" htmlFor="username">{t("Username")}</label>
              <div className="relative">
                <svg className="pointer-events-none absolute top-1/2 start-[15px] size-[18px] -translate-y-1/2 text-[#92998a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20v-2a7 7 0 0 1 14 0v2" />
                </svg>
                <input
                  className="block h-[51px] w-full rounded-lg border border-[#d8ddd0] bg-[#fffefa] pe-[15px] ps-11 text-sm text-ink outline-none placeholder:text-[#93998d] hover:border-[#b1bca8] focus-visible:border-[#597651] focus-visible:ring-[3px] focus-visible:ring-[#59765118] motion-safe:transition-[border-color,box-shadow] motion-safe:duration-150"
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder={t("Enter your username")}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-[22px]">
              <label className="mb-[9px] block text-xs font-semibold text-[#344335]" htmlFor="password">{t("Password")}</label>
              <div className="relative">
                <svg className="pointer-events-none absolute top-1/2 start-[15px] size-[18px] -translate-y-1/2 text-[#92998a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
                </svg>
                <input
                  id="password"
                  className="block h-[51px] w-full rounded-lg border border-[#d8ddd0] bg-[#fffefa] pe-[15px] ps-11 text-sm text-ink outline-none placeholder:text-[#93998d] hover:border-[#b1bca8] focus-visible:border-[#597651] focus-visible:ring-[3px] focus-visible:ring-[#59765118] motion-safe:transition-[border-color,box-shadow] motion-safe:duration-150"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder={t("Enter your password")}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            {errorMessage && <p className="mt-5 rounded-[7px] border border-[#ead0c5] bg-[#fff1e9] px-3.5 py-3 text-xs leading-[1.6] text-[#9c422d]" role="alert">{t(errorMessage)}</p>}
            <button className="mt-7 flex min-h-[50px] w-full items-center justify-center gap-[11px] rounded-lg border border-[#294b34] bg-[#294b34] px-[18px] py-3 text-[13px] font-semibold text-[#f9faf1] shadow-[0_2px_2px_#203b2c0d] enabled:hover:bg-[#355c40] enabled:hover:shadow-[0_4px_12px_#203b2c20] focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-[#a6b79a] disabled:opacity-75 motion-safe:transition-[background,transform,box-shadow] motion-safe:duration-150 motion-safe:enabled:hover:-translate-y-px" type="submit" disabled={isSubmitting}>
              {isSubmitting && <span className="size-[15px] rounded-full border-2 border-[#ffffff45] border-t-current motion-safe:animate-spin" aria-hidden="true" />}
              {isSubmitting ? t("Signing in...") : t("Sign in to workspace")}
              {!isSubmitting && (
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              )}
            </button>
          </form>

          <p className="mt-6 border-t border-border pt-5 text-xs leading-[1.8] text-[#7d8475] min-[721px]:mt-[29px] min-[721px]:pt-6">
             {t("New to the team?")}<br />
            <strong className="font-medium text-[#4d5d47]">{t("Your administrator can create an account for you.")}</strong>
          </p>
        </div>

        <footer className="mx-auto flex w-full max-w-[420px] items-center justify-between gap-3.5 text-[10px] text-muted min-[721px]:max-w-none">
          <span>{t("Built for the way warehouses work.")}</span>
          <span className="font-mono text-[9px] tracking-[0.7px] uppercase">{t("WMS / Workspace")}</span>
        </footer>
      </section>
    </main>
  )
}
