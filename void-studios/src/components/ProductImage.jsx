import { useState } from 'react'

// Renders the product image; when the file is missing (placeholder era),
// shows a designed skeleton slot so grids look intentional, not broken.
export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-bg-secondary text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-wordmark text-3xl uppercase tracking-wide text-ink/15">
          AKUMA
        </span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-ink-soft/60">
          Image coming soon
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
