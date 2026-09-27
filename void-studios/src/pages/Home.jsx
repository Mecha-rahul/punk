import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import HeroSlideshow from '../components/HeroSlideshow'
import MarqueeStrip from '../components/MarqueeStrip'
import ProductCarousel from '../components/ProductCarousel'
import { ArrowLeftIcon, ArrowRightIcon } from '../components/Icons'
import ProductGrid from '../components/ProductGrid'
import VideoSection from '../components/VideoSection'
import EditorialSplit from '../components/EditorialSplit'
import FeaturedProduct from '../components/FeaturedProduct'
import InfoColumns from '../components/InfoColumns'
import { HOME_SECTIONS } from '../data/products'
import { FEATURED_PRODUCT_ID } from '../content/content'
import { useStore } from '../context/StoreContext'

import { useSeo } from '../lib/seo'

// Editorial split copy — placeholder; swap when brand copy is final.
const EDITORIAL = {
  heading: 'From the Archive',
  copy: 'Every AKUMA drop starts in the archive — heavyweight fabrics, references that outlive trends, and details that only show themselves after the tenth wear. Limited batches, hand-finished in the studio.',
  // Cloudinary delivery: f_auto picks WebP/AVIF per browser, q_auto tunes quality.
  img: 'https://res.cloudinary.com/mak8wmjn/image/upload/f_auto,q_auto,w_1200/v1790488324/archive.png',
}

// Small collections strip mirroring GENRAGE's collection-list section.
// Horizontally swipeable (touch snap + desktop arrows) — five tiles, ~3 visible.
function CollectionList() {
  const trackRef = useRef(null)
  const tiles = [
    { label: 'Hoodies', to: '/tops/hoodies' },
    { label: 'T-Shirts', to: '/tops/tshirts' },
    { label: 'Jackets', to: '/tops/jackets' },
    { label: 'Pants', to: '/bottoms/pants' },
    { label: 'Accessories', to: '/accessories' },
  ]

  const scrollBy = (dir) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('a[data-tile]')
    const step = card ? card.offsetWidth + 16 : 280
    track.scrollBy({ left: dir * step * 2, behavior: 'smooth' })
  }

  return (
    <section className="bg-bg-primary py-14 sm:py-16">
      <div className="ak-shell">
        <div
          ref={trackRef}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
        >
          {tiles.map((t) => (
            <Link
              key={t.to}
              data-tile
              to={t.to}
              className="group relative w-[62vw] flex-shrink-0 snap-start overflow-hidden bg-bg-secondary sm:w-[38vw] lg:w-[23%]"
            >
              <div className="aspect-square border border-line-soft" />
              <span className="absolute inset-0 flex items-center justify-center font-wordmark text-lg uppercase tracking-wide text-ink transition-transform duration-300 group-hover:scale-110 sm:text-2xl">
                {t.label}
              </span>
              <span className="absolute bottom-3 left-1/2 h-px w-0 -translate-x-1/2 bg-accent transition-all duration-300 group-hover:w-1/2" />
            </Link>
          ))}
        </div>

        {/* desktop arrows — touch devices swipe natively */}
        <div className="mt-6 hidden justify-end gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll collections back"
            className="border border-line-soft p-2.5 transition-colors hover:bg-bg-secondary"
          >
            <ArrowLeftIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll collections forward"
            className="border border-line-soft p-2.5 transition-colors hover:bg-bg-secondary"
          >
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useSeo({
    title: 'Bold Streetwear. Limited Drops. No Restocks.',
    description:
      'AKUMA is an Indian streetwear label — heavyweight tees, limited drops, no restocks. Shop the latest drop before it sells out.',
    path: '/',
  })
  const { catalog, apiLive } = useStore()

  const featured = catalog.filter((p) => p.collections?.includes('top-picks'))
  const justDropped =
    apiLive === false
      ? HOME_SECTIONS.newArrivals // curated mock section
      : catalog
          .filter((p) => p.collections?.includes('new-arrivals') || p.collections?.includes('top-picks'))
          .slice(0, 8)
  const featuredProduct = catalog.find((p) => p.id === FEATURED_PRODUCT_ID) || catalog[0]

  return (
    <>
      {/* 1 — hero slideshow (animation treatment TBD by owner) */}
      <HeroSlideshow />

      {/* 2 — scrolling marquee */}
      <MarqueeStrip preset="primary" />

      {/* 3 — collection list strip (category showcase removed by owner) */}
      <CollectionList />

      {/* 5 — campaign banner (still artwork until campaign film) */}
      <VideoSection
        heading="The Campaign"
        banner="https://res.cloudinary.com/mak8wmjn/image/upload/f_auto,q_auto,w_1600/v1790335057/Untitled79_20260925163950.webp"
      />

      {/* 6 — featured collection carousel: Just Dropped */}
      <section className="bg-bg-secondary py-16 sm:py-20">
        <div className="ak-shell">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="ak-section-title">Just Dropped</h2>
            <Link to="/new-arrivals" className="text-[12px] font-bold uppercase tracking-[0.2em] underline-offset-4 hover:underline hover:decoration-accent">
              View All
            </Link>
          </div>
          <ProductCarousel products={justDropped} />
        </div>
      </section>

      {/* 7 — editorial split */}
      <EditorialSplit {...EDITORIAL} flip />

      {/* 8 — featured collection carousel: Top Picks */}
      <section className="bg-bg-primary py-16 sm:py-20">
        <div className="ak-shell">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="ak-section-title">Top Picks</h2>
            <Link to="/tops" className="text-[12px] font-bold uppercase tracking-[0.2em] underline-offset-4 hover:underline hover:decoration-accent">
              View All
            </Link>
          </div>
          <ProductCarousel products={featured} />
        </div>
      </section>

      {/* 9 — second marquee, reversed, dark like the top strip */}
      <MarqueeStrip preset="secondary" />

      {/* 10 — featured product spotlight */}
      <FeaturedProduct product={featuredProduct} />

      {/* 11 — info columns */}
      <InfoColumns />
    </>
  )
}
