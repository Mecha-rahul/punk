import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '../content/content'
import ProductImage from './ProductImage'
import { ArrowLeftIcon, ArrowRightIcon } from './Icons'

// Hero slideshow — multi-slide with dots + arrows, optional autoplay.
// Media uses ProductImage so missing files render a clean placeholder.
// NOTE: slide transition is intentionally simple (owner will spec the
// final animation treatment later — swap the CSS classes below when it lands).
export default function HeroSlideshow({ autoplay = 5000 }) {
  const [index, setIndex] = useState(0)
  const touchX = useRef(null)
  const pausedRef = useRef(false)

  const count = HERO_SLIDES.length

  useEffect(() => {
    if (!autoplay || count < 2) return
    const t = setInterval(() => {
      if (!pausedRef.current) setIndex((v) => (v + 1) % count)
    }, autoplay)
    return () => clearInterval(t)
  }, [autoplay, count])

  if (!count) return null

  const slide = HERO_SLIDES[index]

  return (
    <section
      className="relative"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="relative flex h-[calc(100svh-6rem)] min-h-[540px] items-center justify-center overflow-hidden bg-bg-secondary">
        {/* --- media layer (crossfade kept minimal until final animation spec) --- */}
        <div className="absolute inset-0 animate-[fadein_.6s_ease]" key={index}>
          {slide.type === 'video' ? (
            <video src={slide.src} className="h-full w-full object-cover" autoPlay muted loop playsInline />
          ) : (
            <ProductImage src={slide.src} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        {/* --- minimal overlay content --- */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
          <p className="bg-ink px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.42em] text-bg-primary">{slide.tagline}</p>
          <h1 className="font-wordmark text-5xl leading-none tracking-[-0.01em] text-ink sm:text-7xl">
            AKUMA
          </h1>
          <Link to={slide.to} className="ak-btn-dark mt-2">{slide.cta}</Link>
        </div>

        {/* arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex((index - 1 + count) % count)}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 border border-line-soft bg-bg-primary/80 p-3 transition-colors hover:bg-bg-primary"
            >
              <ArrowLeftIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((index + 1) % count)}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 border border-line-soft bg-bg-primary/80 p-3 transition-colors hover:bg-bg-primary"
            >
              <ArrowRightIcon size={16} />
            </button>
          </>
        )}
      </div>

      {/* dots */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-8 transition-colors ${i === index ? 'bg-ink' : 'bg-ink/25'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
