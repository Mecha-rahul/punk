import Hero from '../components/Hero'
import CategoryShowcase from '../components/CategoryShowcase'
import ProductGrid from '../components/ProductGrid'
import MediaCarousel from '../components/MediaCarousel'
import { HOME_SECTIONS } from '../data/products'
import { Link } from 'react-router-dom'

// Editorial strip — placeholder slides; swap srcs when lookbook media is ready.
const LOOKBOOK = [
  { type: 'image', src: '/assets/lookbook/look-1.jpg', caption: 'Drop 01 — Kinokuni' },
  { type: 'image', src: '/assets/lookbook/look-2.jpg', caption: 'Studio Fittings' },
  { type: 'image', src: '/assets/lookbook/look-3.jpg', caption: 'Archive Research' },
  { type: 'image', src: '/assets/lookbook/look-4.jpg', caption: 'Delhi, 2026' },
]

export default function Home() {
  return (
    <>
      {/* A) hero */}
      <Hero />

      {/* B) scroll-linked category showcase */}
      <CategoryShowcase />

      {/* C/D) product sections — alternating pastel backgrounds from here down */}
      <section className="bg-bg-secondary py-16 sm:py-20">
        <div className="ak-shell">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="ak-section-title">New Arrivals</h2>
            <Link to="/new-arrivals" className="text-[11px] font-semibold uppercase tracking-[0.2em] underline-offset-4 hover:underline hover:decoration-accent">
              View All
            </Link>
          </div>
          <ProductGrid products={HOME_SECTIONS.newArrivals} />
        </div>
      </section>

      <section className="bg-bg-alt py-16 sm:py-20">
        <div className="ak-shell">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="ak-section-title">Top Picks</h2>
            <Link to="/tops" className="text-[11px] font-semibold uppercase tracking-[0.2em] underline-offset-4 hover:underline hover:decoration-accent">
              View All
            </Link>
          </div>
          <ProductGrid products={HOME_SECTIONS.topPicks} columns={3} />
        </div>
      </section>

      {/* E) media carousel */}
      <section className="bg-bg-secondary py-16 sm:py-20">
        <div className="ak-shell">
          <h2 className="ak-section-title mb-8 text-center">The Lookbook</h2>
          <MediaCarousel items={LOOKBOOK} />
        </div>
      </section>
    </>
  )
}
