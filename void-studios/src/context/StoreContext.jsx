import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PRODUCTS, findProduct as mockFindProduct } from '../data/products'
import { api, ApiUnavailable } from '../lib/api'
import {
  toUiProduct,
  toUiUser,
  toUiCartLines,
  toUiWishlistIds,
} from '../lib/adapter'

// ==================================================================
// AKUMA store — backed by the Express API when reachable, falling
// back to the mock catalog/localStorage otherwise so the deployed
// storefront still works before the backend is hosted.
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
  // --- connectivity ------------------------------------------------
  // `apiLive` reflects whether the Express backend answered at boot;
  // mock mode is a silent fallback, catalog fetch errors are surfaced.
  const [apiLive, setApiLive] = useState(null) // null = still probing
  const [catalog, setCatalog] = useState(PRODUCTS) // mock products are already in UI shape

  const boot = useCallback(async () => {
    try {
      const data = await api.products({ limit: 60 })
      const list = (data.products || []).map(toUiProduct)
      if (!list.length) throw new ApiUnavailable()
      setCatalog(list)
      setApiLive(true)
    } catch {
      setCatalog(PRODUCTS) // mock ids like 'ak-001'
      setApiLive(false)
      return false
    }
    return true
  }, [])

  useEffect(() => {
    boot()
  }, [boot])

  const findProduct = useCallback(
    (id) => catalog.find((p) => p.id === id),
    [catalog],
  )

  // --- auth --------------------------------------------------------
  const [user, setUser] = useState(null)

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password })
    const u = toUiUser(data.user)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await api.register({ name, email, password })
    const u = toUiUser(data.user)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      /* clearing local state matters more than the server call */
    } finally {
      setUser(null)
    }
  }, [])

  // Restore session on boot (cookie → /users/me). Only meaningful when
  // the API is live — mock mode has no server session to restore.
  useEffect(() => {
    if (apiLive !== true) return
    api
      .me()
      .then((data) => setUser(toUiUser(data.user)))
      .catch(() => {})
  }, [apiLive])

  // --- cart --------------------------------------------------------
  // UI line = { productId, sku?, size, color, qty } — `sku` present in
  // API mode (the backend cart keys lines by variant SKU); mock mode
  // keeps the legacy productId/size/color keying.
  const [cart, setCart] = useState([])
  const [backendCart, setBackendCart] = useState(null) // { items, totals } from API

  const cartCount = useMemo(
    () => cart.reduce((n, l) => n + l.qty, 0),
    [cart],
  )

  const cartLines = useMemo(() => {
    if (backendCart) {
      const lines = toUiCartLines(backendCart.items, catalog)
      return lines.map((l) => ({ ...l, product: findProduct(l.productId) })).filter((l) => l.product)
    }
    return cart
      .map((l) => ({ ...l, product: findProduct(l.productId) }))
      .filter((l) => l.product)
  }, [backendCart, cart, catalog, findProduct])

  const cartSubtotal = useMemo(
    () =>
      cartLines.reduce(
        (sum, l) => sum + (l.product.salePrice ?? l.product.price) * l.qty,
        0,
      ),
    [cartLines],
  )

  const addToCart = useCallback(
    async (productId, size, color, qty = 1) => {
      if (apiLive && user) {
        const product = findProduct(productId)
        const variant =
          product?.variants?.find(
            (v) => String(v.size) === String(size) && (!color || v.color === color),
          ) || product?.variants?.[0]
        if (!variant) throw new Error('That variant is unavailable')
        const data = await api.addToCart({ productId, sku: variant.sku, quantity: qty })
        setBackendCart(data)
        return
      }
      // local (guest or offline) fallback
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
    },
    [apiLive, user, findProduct],
  )

  const updateQty = useCallback(
    async (productId, size, color, qty) => {
      if (apiLive && user) {
        const line = cartLines.find((l) => l.productId === productId && l.size === size && l.color === color)
        if (!line?.sku) return
        if (qty <= 0) {
          const data = await api.removeCartItem(line.sku)
          setBackendCart(data)
        } else {
          const data = await api.updateCartItem(line.sku, qty)
          setBackendCart(data)
        }
        return
      }
      setCart((prev) =>
        qty <= 0
          ? prev.filter((l) => !(l.productId === productId && l.size === size && l.color === color))
          : prev.map((l) =>
              l.productId === productId && l.size === size && l.color === color ? { ...l, qty } : l,
            ),
      )
    },
    [apiLive, user, cartLines],
  )

  const removeLine = useCallback(
    async (productId, size, color) => {
      if (apiLive && user) {
        const target = cartLines.find((l) => l.productId === productId && l.size === size && l.color === color)
        if (!target?.sku) return
        const data = await api.removeCartItem(target.sku)
        setBackendCart(data)
        return
      }
      setCart((prev) =>
        prev.filter((l) => !(l.productId === productId && l.size === size && l.color === color)),
      )
    },
    [apiLive, user, cartLines],
  )

  const clearCart = useCallback(async () => {
    if (apiLive && user) {
      const data = await api.clearCart()
      setBackendCart(data)
      return
    }
    setCart([])
  }, [apiLive, user])

  // Hydrate cart from the backend once authed (cart is per-user server-side).
  const cartLoadedRef = useRef(null)
  useEffect(() => {
    if (apiLive !== true || !user) return
    const key = user?.id ?? 'guest'
    if (cartLoadedRef.current === key) return
    cartLoadedRef.current = key
    api
      .cart()
      .then((data) => {
        setBackendCart(data)
        setCart([])
      })
      .catch(() => {})
  }, [apiLive, user])

  // --- wishlist ----------------------------------------------------
  const [wishlist, setWishlist] = useState(() => load('akuma_wishlist', []))
  useEffect(() => {
    if (!(apiLive && user)) save('akuma_wishlist', wishlist)
  }, [wishlist, apiLive, user])

  const [backendWishlist, setBackendWishlist] = useState([])

  // Hydrate from API when signed in (server wishlist is per-user).
  useEffect(() => {
    if (apiLive !== true || !user) return
    api
      .wishlist()
      .then((data) => setBackendWishlist(toUiWishlistIds(data.wishlist)))
      .catch(() => setBackendWishlist([]))
  }, [apiLive, user])

  const wishlistIds = apiLive && user ? backendWishlist : wishlist

  const toggleWishlist = useCallback(
    async (productId) => {
      if (apiLive && user) {
        // Decide from the CURRENT wishlist state: already liked → DELETE,
        // otherwise → POST. (Previously this always POSTed, so unlike never
        // reached the backend and the heart could never un-toggle.)
        const alreadyLiked = backendWishlist.includes(productId)
        const data = alreadyLiked
          ? await api.removeWishlist(productId)
          : await api.addWishlist(productId)
        setBackendWishlist(toUiWishlistIds(data.wishlist))
        return
      }
      setWishlist((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
      )
    },
    [apiLive, user, backendWishlist],
  )

  // --- cart drawer ------------------------------------------------
  const [cartOpen, setCartOpen] = useState(false)

  // --- toasts -----------------------------------------------------
  const [toasts, setToasts] = useState([])
  const toast = useCallback((message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800)
  }, [])

  const value = {
    apiLive,
    boot,
    catalog,
    user, login, register, logout,
    cart, addToCart, updateQty, removeLine, clearCart, cartCount, cartLines, cartSubtotal,
    wishlist: wishlistIds, toggleWishlist,
    cartOpen, setCartOpen,
    toasts, toast,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
