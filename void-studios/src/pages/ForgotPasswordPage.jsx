import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { api } from '../lib/api'

// Forgot password — asks the backend for a reset link. The backend emails the
// link (SMTP configured on the server) and always answers the same way, so we
// must NOT reveal whether the address exists — show the generic confirmation.
export default function ForgotPasswordPage() {
  const { toast } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.')
    setBusy(true)
    setError('')
    try {
      await api.forgotPassword({ email })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong — please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-bg-primary">
      <div className="ak-shell flex justify-center py-16 sm:py-20">
        <div className="w-full max-w-md border border-line-soft bg-white p-8 sm:p-10">
          <h1 className="ak-section-title text-center">Forgot Password</h1>
          <p className="mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            We'll send you a reset link
          </p>

          {sent ? (
            <div className="mt-8 space-y-6 text-center">
              <p className="text-sm text-ink-soft">
                If that email is registered, a password reset link is on its way.
                Check your inbox — the link expires in 15 minutes.
              </p>
              <button type="button" onClick={() => navigate('/login')} className="ak-btn-dark w-full">
                Back to Log In
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
              <div>
                <label htmlFor="forgot-email" className="ak-label">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ak-input"
                  placeholder="you@example.com"
                />
              </div>

              {error && <p className="text-[12px] font-medium text-accent">{error}</p>}

              <button type="submit" disabled={busy} className="ak-btn-dark w-full disabled:opacity-50">
                {busy ? 'Sending…' : 'Send Reset Link'}
              </button>

              <p className="text-center text-[12px] text-ink-soft">
                Remembered it?{' '}
                <Link to="/login" className="font-semibold text-ink underline underline-offset-4">
                  Back to log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
