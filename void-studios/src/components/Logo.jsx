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
 * Both marks are hosted on Cloudinary and delivered through the
 * `f_auto,q_auto,w_320` transformation: automatic WebP/AVIF negotiation
 * plus quality compression shrinks the ~90KB source PNGs to a fraction,
 * and Cloudinary's CDN edge serves them closer to the visitor than the
 * site bundle. `w_320` covers the largest rendered size (80px tall)
 * at 2× retina without upscaling the 629×449 source.
 *
 * Sizes deliberately exceed the bar height on desktop for the default
 * (black) mark: the PNG carries baked-in whitespace that `multiply`
 * renders invisible, so an 80px image still paints as a tasteful,
 * readable mark instead of a giant block.
 */

const BRAND_CDN = 'https://res.cloudinary.com/mak8wmjn/image/upload/f_auto,q_auto,w_320'

export default function Logo({ className = '', inverted = false }) {
  return (
    <Link
      to="/"
      aria-label="AKUMA — home"
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={
          inverted
            ? `${BRAND_CDN}/akuma/brand/logo-white.png`
            : `${BRAND_CDN}/akuma/brand/logo-black.png`
        }
        alt="AKUMA"
        width={629}
        height={449}
        decoding="async"
        className={`w-auto -my-1 transition-all duration-300 ${
          inverted
            ? 'h-10 sm:h-12 nav:h-14 mix-blend-screen scale-110 origin-left translate-y-1'
            : 'h-12 sm:h-16 nav:h-20 mix-blend-multiply'
        }`}
        draggable="false"
      />
    </Link>
  )
}
