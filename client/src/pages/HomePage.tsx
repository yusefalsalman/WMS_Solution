import { useAuth } from '../hooks/useAuth'

export function HomePage() {
  const { session, signOut } = useAuth()

  return (
    <main className="min-h-svh px-6 py-8 sm:px-12">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <span className="text-lg font-semibold tracking-tight">WMS / Workspace</span>
        <button
          type="button"
          onClick={signOut}
          className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white motion-safe:transition-colors hover:bg-[#355440] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          Sign out
        </button>
      </header>

      <section className="mx-auto max-w-5xl py-16 sm:py-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Warehouse management
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome, {session?.username}
        </h1>
        <p className="mt-5 max-w-lg leading-relaxed text-muted">
          Your workspace is ready. The warehouse dashboard will be added here next.
        </p>
      </section>
    </main>
  )
}
