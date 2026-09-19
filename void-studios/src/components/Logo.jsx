import { Link } from 'react-router-dom'

/**
 * AKUMA brand logo (image wordmark).
 * - Default state renders logo-black.png. That source PNG has a baked-in
 *   white background, so it's blended with `multiply` — the white melts
 *   into the cream header and only the dark artwork shows.
 * - `inverted` (header hover → black bar) renders logo-white.png, whose
 *   baked-in black background is blended away with `screen` — black
 *   disappears against the dark bar AND the gradient bleed below it, so
 *   the mark's background reads as the bar melting downward. The mark
 *   also swells slightly and sinks toward the gradient on hover.
 */
export default function Logo({ className = '', inverted = false }) {
  return (
    <Link
      to="/"
      aria-label="AKUMA — home"
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={inverted ? '/assets/brand/logo-white.png' : '/assets/brand/logo-black.png'}
        alt="AKUMA"
        className={`h-10 w-auto sm:h-12 nav:h-14 -my-1 transition-all duration-300 ${
          inverted
            ? 'mix-blend-screen scale-110 origin-left translate-y-1'
            : 'mix-blend-multiply'
        }`}
        draggable="false"
      />
    </Link>
  )
}
