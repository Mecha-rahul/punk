import { Link } from 'react-router-dom'

/**
 * AKUMA wordmark.
 * - The <LogoIcon /> slot below is intentionally empty: drop the real
 *   brand mark (SVG/img) there when it's supplied.
 * - Wordmark font is controlled by tailwind's `font-wordmark`
 *   (Anton → Archivo Black fallback). Swap fonts in tailwind.config.js.
 * - `inverted` flips the wordmark to light — used when the header bar
 *   goes black on hover (genrage-style).
 */
export default function Logo({ className = '', inverted = false }) {
  return (
    <Link
      to="/"
      aria-label="AKUMA — home"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {/* ---- LogoIcon slot (future brand mark) ---- */}
      <span className="hidden h-8 w-8 place-items-center" data-logo-icon-slot />

      <span
        className={`font-wordmark text-[26px] leading-none tracking-[-0.01em] sm:text-[30px] nav:text-[24px] ${
          inverted ? 'text-bg-primary' : 'text-ink'
        }`}
      >
        AKUMA
      </span>
    </Link>
  )
}
