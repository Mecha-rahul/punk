import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { api } from '../lib/api'

// Reset password — lands here from the emailed link (/reset-password?token=…).
// Requires a signed-in-free token match on the backend; on success the user is
// redirected to login (all existing sessions were revoked server-side).
export default function ResetPasswordPage() {
  const { toast } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!token) return setError('Reset link is invalid — request a new one.')
    if (form.password.length < 8) return setError('New password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setBusy(true)
    setError('')
    try {
      await api.resetPassword({ token, newPassword: form.password })
      setDone(true)
      toast('Password updated — please log in')
    } catch (err) {
      setError(err.message || 'Reset failed — the link may have expired.')
    } finally {
      setBusy(false)
    }
  }

  if (!token || done) {
    return (
      <div className="bg-bg-primary">
        <div className="ak-shell flex justify-center py-16 sm:py-20">
          <div className="w-full max-w-md border border-line-soft bg-white p-8 text-center sm:p-10">
            <p className="text-sm text-ink-soft">
              {done
                ? 'Your password has been reset. Log in with your new password.'
                : 'This reset link is invalid or missing.'}
            </p>
            <Link to="/login" className="ak-btn-dark mt-6 inline-block">Go to Log In</Link>
            {!done && !token && (
              <p className="mt-4 text-[12px] text-ink-soft">
                Need a new link?{' '}
                <Link to="/forgot-password" className="font-semibold text-ink underline underline-offset-4">
                  Request reset
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-primary">
      <div className="ak-shell flex justify-center py-16 sm:py-20">
        <div className="w-full max-w-md border border-line-soft bg-white p-8 sm:p-10">
          <h1 className="ak-section-title text-center">Set New Password</h1>
          <p className="mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            Choose something strong
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="reset-password" className="ak-label">New Password</label>
              <input
                id="reset-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="ak-input"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label htmlFor="reset-confirm" className="ak-label">Confirm Password</label>
              <input
                id="reset-confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="ak-input"
                placeholder="Repeat it"
              />
            </div>

            {error && <p className="text-[12px] font-medium text-accent">{error}</p>}

            <button type="submit" disabled={busy} className="ak-btn-dark w-full disabled:opacity-50">
              {busy ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
