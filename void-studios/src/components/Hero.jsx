import { Link } from 'react-router-dom'
import { TRUST_BADGES } from '../content/content'

// Full-height hero. Set HERO_SOURCE to a video (mp4) or image when the
// campaign asset is ready — component handles both. Until then it shows
// a clean tonal gradient placeholder so the section reads as designed.
const HERO_SOURCE = '/assets/hero-placeholder.mp4' // swap for .jpg/.mp4 later

export default function Hero() {
  const isVideo = /\.(mp4|webm)$/i.test(HERO_SOURCE)

  return (
    <section className="relative">
      <div className="relative flex h-[calc(100svh-6rem)] min-h-[540px] items-center justify-center overflow-hidden bg-bg-secondary">
        {/* --- media source slot --- */}
        {isVideo ? (
          <video
            src={HERO_SOURCE}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay muted loop playsInline
          />
        ) : (
          <img src={HERO_SOURCE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}

        {/* tonal overlay keeps text legible once real footage lands */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-transparent to-bg-primary/60" />

        {/* --- minimal overlay content --- */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-ink/80">
            悪魔 — Bold Luxury Streetwear
          </p>
          <h1 className="font-wordmark text-5xl leading-none tracking-[-0.01em] text-ink sm:text-7xl">
            AKUMA
          </h1>
          <Link to="/new-arrivals" className="ak-btn-dark mt-2">
            Shop Now
          </Link>
        </div>
      </div>

      {/* trust badges */}
      <div className="border-y border-line-soft bg-bg-primary">
        <div className="ak-shell flex flex-wrap items-center justify-center gap-x-10 gap-y-2 py-4">
          {TRUST_BADGES.map((b) => (
            <span key={b} className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-soft">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
