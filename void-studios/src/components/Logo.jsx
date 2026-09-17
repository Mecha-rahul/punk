import { Link } from 'react-router-dom'

/**
 * AKUMA wordmark.
 * - The <LogoIcon /> slot below is intentionally empty: drop the real
 *   brand mark (SVG/img) there when it's supplied.
 * - Wordmark font is controlled by tailwind's `font-wordmark`
 *   (Anton → Archivo Black fallback). Swap fonts in tailwind.config.js.
 */
export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="AKUMA — home"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {/* ---- LogoIcon slot (future brand mark) ---- */}
      <span className="hidden h-8 w-8 place-items-center" data-logo-icon-slot />

      <span className="font-wordmark text-[26px] leading-none tracking-[-0.01em] text-ink sm:text-[30px]">
        AKUMA
      </span>

      {/* subtle kanji nod — hidden on tiny screens */}
      <span className="hidden self-start pl-1 pt-1 text-[10px] font-light tracking-[0.3em] text-ink-soft md:inline">
        悪魔
      </span>
    </Link>
  )
}
