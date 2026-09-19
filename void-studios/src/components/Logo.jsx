import { Link } from 'react-router-dom'

/**
 * AKUMA brand logo (image wordmark).
 * - Default state renders logo-black.png. That source PNG has a baked-in
 *   white background, so it's blended with `multiply` — the white melts
 *   into the cream header and only the dark artwork shows.
 * - `inverted` (header hover → black bar) renders logo-white.png, whose
 *   baked-in black background is blended away with `screen` — black
 *   disappears against the dark bar and the white mark stays pure white.
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
        className={`h-9 w-auto sm:h-11 nav:h-9 transition-opacity duration-200 ${
          inverted ? 'mix-blend-screen' : 'mix-blend-multiply'
        }`}
        draggable="false"
      />
    </Link>
  )
}
