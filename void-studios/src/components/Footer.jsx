import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, FOOTER_LINKS } from '../content/content'
import { InstagramIcon, PinterestIcon, WhatsAppIcon } from './Icons'
import { useStore } from '../context/StoreContext'

// Dark charcoal footer — anchors the pastel page and matches the
// "luxury but warm" palette (--text-primary bg, --bg-primary text).
export default function Footer() {
  const { toast } = useStore()
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    toast('Subscribed — welcome to the list')
    setEmail('')
  }

  const socialIcons = { Instagram: InstagramIcon, Pinterest: PinterestIcon, WhatsApp: WhatsAppIcon }

  return (
    <footer className="bg-ink text-bg-primary">
      <div className="ak-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* brand */}
        <div>
          <p className="font-wordmark text-2xl tracking-[-0.01em]">AKUMA</p>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-bg-primary/70">
            {BRAND.footerBlurb}
          </p>
          <div className="mt-5 flex gap-3">
            {FOOTER_LINKS.social.map((s) => {
              const Icon = socialIcons[s.label]
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center border border-bg-primary/25 transition-colors hover:border-bg-primary"
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>

        {/* shop */}
        <nav aria-label="Shop">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bg-primary/60">Shop</p>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_LINKS.shop.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-[13px] text-bg-primary/80 transition-colors hover:text-bg-primary hover:underline hover:underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* support */}
        <nav aria-label="Support">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bg-primary/60">Support</p>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_LINKS.support.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-[13px] text-bg-primary/80 transition-colors hover:text-bg-primary hover:underline hover:underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* newsletter */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bg-primary/60">Newsletter</p>
          <p className="mt-4 text-[13px] text-bg-primary/70">
            First access to drops. No spam.
          </p>
          <form onSubmit={subscribe} className="mt-4 flex">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border border-bg-primary/25 bg-transparent px-4 py-3 text-sm placeholder:text-bg-primary/40 focus:border-bg-primary focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 border border-l-0 border-bg-primary/25 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-bg-primary hover:text-ink"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-bg-primary/15">
        <div className="ak-shell flex flex-col items-center justify-between gap-3 py-5 text-[10px] uppercase tracking-[0.22em] text-bg-primary/50 sm:flex-row">
          <p>{BRAND.copyright} · {BRAND.madeIn}</p>
          <div className="flex items-center gap-2" aria-label="Payment methods">
            {['UPI', 'VISA', 'MC', 'COD'].map((m) => (
              <span key={m} className="border border-bg-primary/25 px-2 py-1 text-[9px] tracking-[0.18em]">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
