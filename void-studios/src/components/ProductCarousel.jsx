import { useRef } from 'react'
import ProductCard from './ProductCard'
import { ArrowLeftIcon, ArrowRightIcon } from './Icons'

// Horizontal scrolling product strip with arrow controls — used by the
// featured-collection sections on the home page.
export default function ProductCarousel({ products }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('div[data-card]')
    const step = card ? card.offsetWidth + 24 : 280
    track.scrollBy({ left: dir * step * 2, behavior: 'smooth' })
  }

  if (!products.length) return null

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.id} data-card className="w-[62vw] flex-shrink-0 snap-start sm:w-[38vw] lg:w-[23%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll products back"
          className="border border-line-soft p-2.5 transition-colors hover:bg-bg-secondary"
        >
          <ArrowLeftIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll products forward"
          className="border border-line-soft p-2.5 transition-colors hover:bg-bg-secondary"
        >
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>
  )
}
