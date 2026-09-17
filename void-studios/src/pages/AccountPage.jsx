import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

// Basic account placeholder — real profile/orders arrive with the backend.
export default function AccountPage() {
  const { user, logout } = useStore()

  if (!user) {
    return (
      <div className="bg-bg-primary">
        <div className="ak-shell flex flex-col items-center py-24 text-center">
          <h1 className="ak-section-title">Account</h1>
          <p className="mt-2 text-sm text-ink-soft">Sign in to view your account.</p>
          <div className="mt-8 flex gap-3">
            <Link to="/login" className="ak-btn-dark">Log In</Link>
            <Link to="/register" className="ak-btn-outline">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-primary">
      <div className="ak-shell py-12">
        <h1 className="ak-section-title">Hi, {user.name}</h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
          <div className="border border-line-soft bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft">Profile</p>
            <p className="mt-3 text-sm font-medium">{user.name}</p>
            <p className="text-sm text-ink-soft">{user.email}</p>
          </div>
          <div className="border border-line-soft bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft">Orders</p>
            <p className="mt-3 text-sm text-ink-soft">Order history will appear here once the store goes live.</p>
          </div>
        </div>

        <button type="button" onClick={logout} className="ak-btn-outline mt-8">Log Out</button>
      </div>
    </div>
  )
}
