import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { PRODUCTS } from '../data/products'

// Single reusable listing page — every category, subcategory and
// collection route renders this with a different filter. No duplication.
const SUBCATEGORY_LABELS = {
  tshirts: 'T-Shirts',
  hoodies: 'Hoodies',
  jackets: 'Jackets',
  'full-sleeve': 'Full Sleeve T-Shirts',
  'tank-tops': 'Tank Tops',
  pants: 'Pants',
  jeans: 'Jeans',
  shorts: 'Shorts',
}

const CATEGORY_TITLES = { tops: 'Tops', bottoms: 'Bottoms', accessories: 'Accessories' }

export default function CategoryPage({ mode, id }) {
  const { subcategory } = useParams()

  const { title, crumbs, products } = useMemo(() => {
    if (mode === 'collection') {
      const titles = { 'new-arrivals': 'New Arrivals', sale: 'Sale' }
      return {
        title: titles[id],
        crumbs: [{ label: 'Home', to: '/' }, { label: titles[id] }],
        products:
          id === 'sale'
            ? PRODUCTS.filter((p) => p.salePrice != null)
            : PRODUCTS.filter((p) => p.collections?.includes(id)),
      }
    }
    if (mode === 'subcategory') {
      const label = SUBCATEGORY_LABELS[subcategory] ?? subcategory
      return {
        title: label,
        crumbs: [
          { label: 'Home', to: '/' },
          { label: CATEGORY_TITLES[id], to: `/${id}` },
          { label },
        ],
        products: PRODUCTS.filter((p) => p.category === id && p.subcategory === subcategory),
      }
    }
    // category parent page
    return {
      title: CATEGORY_TITLES[id],
      crumbs: [{ label: 'Home', to: '/' }, { label: CATEGORY_TITLES[id] }],
      products: PRODUCTS.filter((p) => p.category === id),
    }
  }, [mode, id, subcategory])

  return (
    <div className="bg-bg-primary">
      {/* page head */}
      <div className="border-b border-line-soft bg-bg-secondary py-10 sm:py-14">
        <div className="ak-shell">
          <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            {crumbs.map((c, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-2">/</span>}
                {c.to ? (
                  <Link to={c.to} className="hover:underline hover:underline-offset-4">{c.label}</Link>
                ) : (
                  <span className="text-ink">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="ak-section-title mt-3">{title}</h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>
      </div>

      <div className="ak-shell py-12">
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="py-20 text-center">
            <p className="font-wordmark text-2xl uppercase text-ink/25">Nothing here yet</p>
            <p className="mt-2 text-sm text-ink-soft">This drop hasn't landed. Check back soon.</p>
            <Link to="/new-arrivals" className="ak-btn-dark mt-6">Shop New Arrivals</Link>
          </div>
        )}
      </div>
    </div>
  )
}
