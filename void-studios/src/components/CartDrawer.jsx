import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductImage from './ProductImage'
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon, BagIcon } from './Icons'

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`

// Slide-out mini cart — condensed line items, links to the full /cart page.
export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartLines, cartSubtotal, updateQty, removeLine } = useStore()

  // lock scroll while open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-[75]">
      <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-line-soft px-6 py-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em]">Your Bag ({cartLines.length})</p>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Close bag" className="p-1 hover:opacity-60">
            <CloseIcon />
          </button>
        </div>

        {cartLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <BagIcon size={44} className="text-ink-soft/50" />
            <p className="text-sm text-ink-soft">Your bag is empty.</p>
            <Link to="/new-arrivals" onClick={() => setCartOpen(false)} className="ak-btn-dark">
              Shop New Arrivals
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line-soft overflow-y-auto px-6">
              {cartLines.map((l) => (
                <li key={`${l.productId}-${l.size}-${l.color}`} className="flex gap-4 py-4">
                  <Link to={`/product/${l.productId}`} onClick={() => setCartOpen(false)} className="w-20 shrink-0">
                    <div className="aspect-[4/5] bg-white">
                      <ProductImage src={l.product.images[0]} alt={l.product.name} className="h-full w-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-medium">{l.product.name}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                          {l.color} / Size {l.size}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(l.productId, l.size, l.color)}
                        aria-label={`Remove ${l.product.name}`}
                        className="p-1 text-ink-soft hover:text-accent"
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line-soft">
                        <button type="button" onClick={() => updateQty(l.productId, l.size, l.color, l.qty - 1)} aria-label="Decrease quantity" className="p-1.5 hover:bg-bg-secondary">
                          <MinusIcon size={13} />
                        </button>
                        <span className="w-8 text-center text-xs">{l.qty}</span>
                        <button type="button" onClick={() => updateQty(l.productId, l.size, l.color, l.qty + 1)} aria-label="Increase quantity" className="p-1.5 hover:bg-bg-secondary">
                          <PlusIcon size={13} />
                        </button>
                      </div>
                      <p className="text-[13px] font-medium">{fmt((l.product.salePrice ?? l.product.price) * l.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line-soft px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.18em] text-ink-soft text-[11px]">Subtotal</span>
                <span className="font-semibold">{fmt(cartSubtotal)}</span>
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-soft/70">
                Shipping & taxes calculated at checkout
              </p>
              <Link to="/cart" onClick={() => setCartOpen(false)} className="ak-btn-dark mt-4 w-full">
                View Bag
              </Link>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="ak-btn-outline mt-2 w-full">
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
