// ==================================================================
// AKUMA → Express API client.
// Base URL comes from VITE_API_URL (set in .env / Vercel env vars),
// falling back to the local dev server. All requests send cookies
// (credentials: 'include') because auth is httpOnly JWT cookies.
// ==================================================================

// Dev: leave VITE_API_URL unset → requests go to /api/v1 and the Vite dev
// server proxies them to the Express backend (same-origin cookies, no CORS).
// Prod (Vercel): set VITE_API_URL to the hosted backend, e.g.
//   https://your-backend.onrender.com/api/v1
const BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '')

/** Thrown when the backend can't be reached at all (down / wrong URL). */
export class ApiUnavailable extends Error {
  constructor() {
    super('API is unreachable')
    this.name = 'ApiUnavailable'
  }
}

/**
 * request() — single fetch wrapper.
 * The backend answers `{ success, message, data }`; on success we return
 * `data` directly, on failure we throw an Error carrying `.status` and
 * `.errors` (zod field errors) so callers can show the server's message.
 */
async function request(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiUnavailable()
  }

  let json = null
  try {
    json = await res.json()
  } catch {
    /* non-JSON body */
  }

  if (!res.ok || json?.success === false) {
    const err = new Error(json?.message || `Request failed (${res.status})`)
    err.status = res.status
    err.errors = json?.errors || []
    throw err
  }
  return json?.data
}

/** Backend cart payloads are `{ cart: [...items], totals }` — normalize to `items`. */
const normCart = (data) =>
  data && Array.isArray(data.cart) ? { items: data.cart, totals: data.totals ?? null } : data

export const api = {
  // catalog
  products: (params = {}) => request(`/products?${new URLSearchParams(params)}`),

  // auth
  me: () => request('/users/me'),
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // cart
  cart: () => request('/cart').then(normCart),
  addToCart: (body) => request('/cart/items', { method: 'POST', body }).then(normCart),
  updateCartItem: (sku, quantity) =>
    request(`/cart/items/${encodeURIComponent(sku)}`, { method: 'PATCH', body: { quantity } }).then(normCart),
  removeCartItem: (sku) =>
    request(`/cart/items/${encodeURIComponent(sku)}`, { method: 'DELETE' }).then(normCart),
  clearCart: () => request('/cart', { method: 'DELETE' }).then(normCart),

  // wishlist
  wishlist: () => request('/wishlist'),
  addWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'POST' }),
  removeWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),
}

export { BASE as API_BASE }
