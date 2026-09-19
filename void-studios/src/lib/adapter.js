// ==================================================================
// Backend → UI adapters. The storefront components consume the mock
// catalog shape; these mappers let real API documents flow through
// the exact same component contracts.
// ==================================================================

/**
 * Backend product → UI product.
 *   _id → id, basePrice/variants → price/salePrice/sizes/colors/inStock,
 *   variants kept raw (sku/stock) so cart lines can reference SKUs.
 * salePrice = cheapest variant override below basePrice (drives SALE badges).
 */
export function toUiProduct(p) {
  const variants = (p.variants || []).filter((v) => v.isActive !== false)
  const prices = variants.map((v) => v.priceOverride ?? p.basePrice)
  const minPrice = prices.length ? Math.min(...prices) : p.basePrice

  return {
    id: p._id,
    slug: p.slug,
    name: p.name,
    // Parent-category routing contract: category = parent slug (tops/bottoms/…),
    // subcategory = leaf slug (hoodies/jeans/…). Accessories has no parent.
    category: p.category?.parentCategory?.slug ?? p.category?.slug ?? p.category ?? '',
    subcategory: p.category?.parentCategory ? p.category.slug : '',
    price: p.basePrice,
    salePrice: minPrice < p.basePrice ? minPrice : null,
    images: Array.isArray(p.images) ? p.images : [],
    sizes: [...new Set(variants.map((v) => String(v.size)))],
    colors: [...new Set(variants.map((v) => v.color).filter(Boolean))],
    description: p.description || '',
    care: p.care || '—',
    inStock: variants.some((v) => (v.stock ?? 0) > 0),
    collections: p.collections ?? [],
    variants,
  }
}

/** Backend sanitized user → UI user (Header/AccountPage contract). */
export const toUiUser = (u) =>
  u
    ? {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        addresses: u.addresses || [],
      }
    : null

/**
 * Backend cart items → UI cart lines.
 * size/color aren't stored on the backend cart (only sku) — resolve them
 * from the known catalog so the UI keeps showing "Navy / Size M".
 */
export function toUiCartLines(items = [], products = []) {
  return items.map((it) => {
    const product = products.find((p) => p.id === (it.product?._id || it.product))
    const variant = product?.variants?.find((v) => v.sku === it.sku)
    return {
      productId: it.product?._id || it.product,
      sku: it.sku,
      size: variant?.size ?? '',
      color: variant?.color ?? '',
      qty: it.quantity,
    }
  })
}

/** Wishlist payloads are id arrays or populated docs — normalize to ids. */
export const toUiWishlistIds = (arr = []) =>
  arr.map((x) => (typeof x === 'object' && x !== null ? x._id : x))
