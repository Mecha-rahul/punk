import { REVIEWS } from '../content/content'

const Stars = ({ n }) => (
  <span aria-label={`${n} out of 5 stars`} className="text-accent">
    {'★'.repeat(n)}{'☆'.repeat(5 - n)}
  </span>
)

// Customer reviews carousel (mock data — wire to real reviews API later).
export default function ReviewsCarousel() {
  return (
    <section className="bg-bg-secondary py-16 sm:py-20">
      <div className="ak-shell">
        <h2 className="ak-section-title text-center">Let customers speak for us</h2>
        <p className="mt-2 text-center text-[11px] uppercase tracking-[0.24em] text-ink-soft">
          {REVIEWS.length} reviews · 4.8 average
        </p>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="w-[80vw] flex-shrink-0 snap-start border border-line-soft bg-white p-6 sm:w-[46vw] lg:w-[31%]"
            >
              <Stars n={r.rating} />
              <blockquote className="mt-3 text-sm leading-relaxed text-ink">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {r.name} — {r.location} · {r.product}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
