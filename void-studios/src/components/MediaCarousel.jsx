import { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from './Icons'

// Generic media carousel — accepts [{ type: 'image'|'video', src, caption }].
// Manual arrows + touch swipe; autoplay optional via prop. Used for
// lookbook/editorial strips now, video tiles later.
export default function MediaCarousel({ items, autoplay = false, aspect = 'aspect-[16/10]' }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  const scrollTo = (i) => {
    const track = trackRef.current
    if (!track) return
    const clamped = (i + items.length) % items.length
    track.scrollTo({ left: (track.scrollWidth / items.length) * clamped, behavior: 'smooth' })
    setIndex(clamped)
  }

  useEffect(() => {
    if (!autoplay || items.length < 2) return
    const t = setInterval(() => setIndex((v) => (v + 1) % items.length), 4500)
    return () => clearInterval(t)
  }, [autoplay, items.length])

  // simple touch swipe
  const touchX = useRef(null)
  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) scrollTo(index + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  if (!items.length) return null

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapStop: 'always' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {items.map((item, i) => (
          <div key={i} className="w-full flex-shrink-0 snap-start px-1">
            <div className={`${aspect} overflow-hidden bg-bg-secondary`}>
              {item.type === 'video' ? (
                <video src={item.src} className="h-full w-full object-cover" muted loop playsInline controls={false} />
              ) : (
                <img src={item.src} alt={item.caption ?? `Slide ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
            {item.caption && (
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.28em] text-ink-soft">
                {item.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollTo(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 border border-line-soft bg-white/90 p-2.5 hover:bg-white"
          >
            <ArrowLeftIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 border border-line-soft bg-white/90 p-2.5 hover:bg-white"
          >
            <ArrowRightIcon size={16} />
          </button>
          <div className="mt-4 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 w-6 transition-colors ${i === index ? 'bg-ink' : 'bg-line-soft'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
