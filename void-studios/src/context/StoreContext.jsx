import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { findProduct } from '../data/products'

// ==================================================================
// AKUMA store — mock auth + cart + wishlist + toasts.
// Persistence: localStorage (swap these reads/writes for API calls
// when the real backend lands).
// ==================================================================

const StoreContext = createContext(null)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — state still works in-memory */
  }
}

export function StoreProvider({ children }) {
  // --- mock auth -------------------------------------------------
  const [user, setUser] = useState(() => load('akuma_user', null))

  const login = useCallback((email, name) => {
    const mockUser = { email, name: name || email.split('@')[0] }
    setUser(mockUser)
    save('akuma_user', mockUser)
    return mockUser
  }, [])

  const register = useCallback((name, email) => {
    const mockUser = { email, name }
    setUser(mockUser)
    save('akuma_user', mockUser)
    return mockUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('akuma_user')
  }, [])

  // --- cart ------------------------------------------------------
  // line = { productId, size, color, qty }
  const [cart, setCart] = useState(() => load('akuma_cart', []))
  useEffect(() => save('akuma_cart', cart), [cart])

  const addToCart = useCallback((productId, size, color, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex(
        (l) => l.productId === productId && l.size === size && l.color === color,
      )
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [...prev, { productId, size, color, qty }]
    })
  }, [])

  const updateQty = useCallback((productId, size, color, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.productId === productId && l.size === size && l.color === color))
        : prev.map((l) =>
            l.productId === productId && l.size === size && l.color === color
              ? { ...l, qty }
              : l,
          ),
    )
  }, [])

  const removeLine = useCallback((productId, size, color) => {
    setCart((prev) =>
      prev.filter((l) => !(l.productId === productId && l.size === size && l.color === color)),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // --- wishlist --------------------------------------------------
  const [wishlist, setWishlist] = useState(() => load('akuma_wishlist', []))
  useEffect(() => save('akuma_wishlist', wishlist), [wishlist])

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }, [])

  // --- cart drawer ------------------------------------------------
  const [cartOpen, setCartOpen] = useState(false)

  // --- toasts -----------------------------------------------------
  const [toasts, setToasts] = useState([])
  const toast = useCallback((message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800)
  }, [])

  // --- derived helpers --------------------------------------------
  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart])
  const cartLines = useMemo(
    () =>
      cart
        .map((l) => ({ ...l, product: findProduct(l.productId) }))
        .filter((l) => l.product),
    [cart],
  )
  const cartSubtotal = useMemo(
    () =>
      cartLines.reduce(
        (sum, l) => sum + (l.product.salePrice ?? l.product.price) * l.qty,
        0,
      ),
    [cartLines],
  )

  const value = {
    user, login, register, logout,
    cart, addToCart, updateQty, removeLine, clearCart, cartCount, cartLines, cartSubtotal,
    wishlist, toggleWishlist,
    cartOpen, setCartOpen,
    toasts, toast,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
