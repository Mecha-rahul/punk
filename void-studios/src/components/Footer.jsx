import { Link } from 'react-router-dom'
import { BRAND, FOOTER_LINKS } from '../content/content'
import { InstagramIcon, WhatsAppIcon } from './Icons'

// Dark charcoal footer — anchors the pastel page and matches the
// "luxury but warm" palette (--text-primary bg, --bg-primary text).
export default function Footer() {
  const socialIcons = { Instagram: InstagramIcon, WhatsApp: WhatsAppIcon }

  return (
    <footer className="bg-ink text-bg-primary">
      <div className="ak-shell grid gap-10 py-14 sm:grid-cols-3 lg:gap-8">
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

      </div>

      <div className="border-t border-bg-primary/15">
        <div className="ak-shell flex flex-col items-center justify-center gap-3 py-5 text-[10px] uppercase tracking-[0.22em] text-bg-primary/50 sm:flex-row">
          <p>{BRAND.copyright} · {BRAND.madeIn}</p>
        </div>
      </div>
    </footer>
  )
}
