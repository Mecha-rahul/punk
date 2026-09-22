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
 *
 * Sizes deliberately exceed the bar height on desktop for the default
 * (black) mark: the PNG carries baked-in whitespace that `multiply`
 * renders invisible, so an 80px image still paints as a tasteful,
 * readable mark instead of a giant block.
 */
export default function Logo({ className = '', inverted = false }) {
  return (
    <Link
      to="/"
      aria-label="AKUMA — home"
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={inverted
          ? '/assets/brand/logo-white.png?v=2'
          : '/assets/brand/logo-black.png?v=2'
        }
        alt="AKUMA"
        className={`w-auto -my-1 transition-all duration-300 ${
          inverted
            ? 'h-10 sm:h-12 nav:h-14'
            : 'h-12 sm:h-16 nav:h-20'
        }`}
        draggable="false"
      />
    </Link>
  )
}
