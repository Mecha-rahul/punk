import { Link } from 'react-router-dom'

/**
 * AKUMA brand logo (image wordmark).
 * Both PNGs have genuinely transparent backgrounds (see
 * backend/scripts/make-brand-bg-transparent.ps1), so no blend tricks are
 * needed - the mark reads cleanly over the cream bar, the hero below it,
 * and the inverted black bar on header hover.
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
        src={inverted ? '/assets/brand/logo-white.png' : '/assets/brand/logo-black.png'}
        alt="AKUMA"
        className={`w-auto -my-1 transition-all duration-300 ${
          inverted
            ? 'h-10 sm:h-12 nav:h-14 scale-110 origin-left translate-y-1'
            : 'h-12 sm:h-16 nav:h-20'
        }`}
        draggable="false"
      />
    </Link>
  )
}
