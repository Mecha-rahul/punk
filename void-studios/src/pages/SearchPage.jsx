import { useSearchParams, Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import ProductGrid from '../components/ProductGrid'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim()
  const term = q.toLowerCase()

  const results = term
    ? PRODUCTS.filter((p) =>
        `${p.name} ${p.category} ${p.subcategory} ${p.description}`.toLowerCase().includes(term),
      )
    : []

  return (
    <div className="bg-bg-primary">
      <div className="ak-shell py-10 sm:py-14">
        <h1 className="ak-section-title">
          {q ? `Search: “${q}”` : 'Search'}
        </h1>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          {q ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'Type in the search bar above to look for pieces.'}
        </p>

        <div className="mt-10">
          {results.length ? (
            <ProductGrid products={results} />
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm text-ink-soft">
                {q ? 'Nothing matched. Try "hoodie", "tee", "jeans"…' : ''}
              </p>
              <Link to="/new-arrivals" className="ak-btn-dark mt-6">Browse New Arrivals</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
