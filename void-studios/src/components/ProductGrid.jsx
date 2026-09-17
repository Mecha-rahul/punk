import ProductCard from './ProductCard'

// Single responsive grid — every listing page and home section reuses this.
export default function ProductGrid({ products, columns = 4 }) {
  const cols =
    columns === 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:gap-x-6 ${cols}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
