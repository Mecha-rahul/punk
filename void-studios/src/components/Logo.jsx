import { Link } from 'react-router-dom'

/**
 * AKUMA brand logo (image wordmark).
 * Both marks are local files with REAL transparency (backgrounds converted to
 * alpha — see scripts history: `make-brand-bg-transparent`), so no CSS blend
 * tricks are needed and the artwork can hang below the header bar without
 * exposing a white/black box. The earlier Cloudinary copies carried baked-in
 * backgrounds, which caused the white strip under the header — keep using the
 * transparent local files unless re-uploading transparent versions to the CDN.
 *
 * `inverted` (header hover → black bar) renders logo-white.png; the mark
 * swells slightly and sinks toward the bar edge on hover.
 *
 * `?v=3` busts browser caches whenever the underlying PNGs change.
 */

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
            ? '/assets/brand/logo-white.png?v=3'
            : '/assets/brand/logo-black.png?v=3'
        }
        alt="AKUMA"
        width={629}
        height={449}
        decoding="async"
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
