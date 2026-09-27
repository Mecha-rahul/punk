import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'

// Editorial "media + text" split (GENRAGE architecture). `flip` swaps sides.
// Media always owns 60% of the row (3fr/2fr); flip only swaps which side it sits on.
export default function EditorialSplit({ heading, copy, cta, to = '/new-arrivals', img, flip = false }) {
  return (
    <section className="bg-bg-secondary py-16 sm:py-20">
      <div
        className={`ak-shell grid items-center gap-10 lg:gap-16 ${
          flip ? 'lg:grid-cols-[2fr_3fr]' : 'lg:grid-cols-[3fr_2fr]'
        }`}
      >
        <div className={flip ? 'lg:order-2' : ''}>
          <div className="aspect-video overflow-hidden border border-line-soft bg-bg-primary">
            <ProductImage src={img} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className={flip ? 'lg:order-1' : ''}>
          <h2 className="ak-section-title">{heading}</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">{copy}</p>
          {cta && (
            <Link to={to} className="ak-btn-outline mt-8">{cta}</Link>
          )}
        </div>
      </div>
    </section>
  )
}
