import type { SubmitEvent } from 'react'
import { isAxiosError } from 'axios'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { WarehouseIllustration } from '../components/brand/WarehouseIllustration'
import './LoginPage.css'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useAuth()

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

  return (
    <main className="login-page">
      <aside className="login-story" aria-labelledby="login-story-title">
        <div className="login-brand" aria-label="WMS Warehouse Management">
          <span className="login-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="m20 3 15 8.5v17L20 37 5 28.5v-17L20 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="m5 11.5 15 9 15-9M20 20.5V37M12.5 7.3l15 8.5v8.7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <span className="login-brand-name">WMS<span aria-hidden="true">.</span></span>
            <span className="login-brand-description">Warehouse Management</span>
          </div>
        </div>

        <div className="login-story-copy">
          <p className="login-eyebrow">
            <span className="login-eyebrow-dot" aria-hidden="true" />
            Operations, organized
          </p>
          <h1 id="login-story-title">Every move.<br /> <span>Under control.</span></h1>
          <p className="login-story-intro">
            One workspace for your stock, your transfers, and the people keeping it all moving.
          </p>
        </div>

        <div className="login-warehouse">
          <WarehouseIllustration />
        </div>

        <div className="login-story-footer" aria-label="Workspace features">
          <span><b>01</b> Track inventory</span>
          <span><b>02</b> Move stock</span>
          <span><b>03</b> Stay informed</span>
        </div>
      </aside>

      <section className="login-access" aria-labelledby="login-form-heading">
        <header className="login-access-header">
          <span>Your operations workspace</span>
          <span className="login-access-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m12 3 7 3v6c0 4-7 9-7 9s-7-5-7-9V6l7-3Z" />
              <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Role-based access
          </span>
        </header>

        <div className="login-form-container">
          <div className="login-form-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21V8l9-5 9 5v13M7 21V11h10v10M3 21h18M7 15h10M7 18h10" />
            </svg>
          </div>
          <h2 className="login-form-heading" id="login-form-heading">Welcome back.</h2>
          <p className="login-form-description">Sign in to keep your warehouse moving.</p>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <div className="login-input-wrapper">
                <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20v-2a7 7 0 0 1 14 0v2" />
                </svg>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            {errorMessage && <p className="login-error" role="alert">{errorMessage}</p>}
            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting && <span className="login-spinner" aria-hidden="true" />}
              {isSubmitting ? 'Signing in...' : 'Sign in to workspace'}
              {!isSubmitting && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              )}
            </button>
          </form>

          <p className="login-account-note">
            New to the team?<br />
            <strong>Your administrator can create an account for you.</strong>
          </p>
        </div>

        <footer className="login-access-footer">
          <span>Built for the way warehouses work.</span>
          <span>WMS / Workspace</span>
        </footer>
      </section>
    </main>
  )
}
