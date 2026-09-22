import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '../content/content'
import ProductImage from './ProductImage'

// Static hero banner — single full-width image (no carousel: no autoplay,
// no dots, no arrows). Overlay content (tagline / wordmark / CTA) preserved.
// To swap the artwork later, change HERO_SLIDES[0].src in content/content.js.
export default function HeroSlideshow() {
  const slide = HERO_SLIDES[0]
  if (!slide) return null

  return (
    <section className="relative">
      <div className="relative flex h-[calc(100svh-6rem)] min-h-[540px] items-center justify-center overflow-hidden bg-bg-secondary">
        {/* --- static media layer (absolute so it never competes with the
            overlay content for flex space — in-flow images squeeze the
            layout and shove the text sideways) --- */}
        <div className="absolute inset-0">
          <ProductImage src={slide.src} alt="AKUMA" className="h-full w-full object-cover" />
        </div>

        {/* tonal overlay keeps text legible on any artwork */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-transparent to-bg-primary/60" />

        {/* --- minimal overlay content --- */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
          <p className="bg-ink px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.42em] text-bg-primary">{slide.tagline}</p>
          <h1 className="font-wordmark text-5xl leading-none tracking-[-0.01em] text-ink sm:text-7xl">
            AKUMA
          </h1>
          <Link to={slide.to} className="ak-btn-dark mt-2">{slide.cta}</Link>
        </div>
      </div>
    </section>
  )
}
