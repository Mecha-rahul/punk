import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../constants.js";

/**
 * Totals are ALWAYS computed server-side from re-validated prices —
 * the client never gets to influence them.
 */
const computeTotals = (items) => {
  const subtotal = items.reduce((sum, it) => sum + it.priceSnapshot * it.quantity, 0);
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, shippingFee, total: subtotal + shippingFee };
};

/** Finds the user's cart or lazily creates an empty one. */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    try {
      cart = await Cart.create({ user: userId, items: [] });
    } catch (err) {
      if (err?.code === 11000) {
        cart = await Cart.findOne({ user: userId }); // concurrent first-add
      } else {
        throw err;
      }
    }
  }
  return cart;
};

/**
 * Resolves a product+sku into the live variant, enforcing:
 * product not deleted, variant active, and (optionally) enough stock.
 */
const resolveLiveVariant = async ({ productId, sku, requiredQty = null }) => {
  const product = await Product.findById(productId);
  if (!product || product.isDeleted) throw new ApiError(404, "Product not found");

  const variant = product.findVariant(sku);
  if (!variant || !variant.isActive) throw new ApiError(404, `Variant ${sku} is unavailable`);

  if (requiredQty !== null && variant.stock < requiredQty) {
    throw new ApiError(409, `Only ${variant.stock} left in stock for ${sku}`);
  }

  return { product, variant, unitPrice: product.priceFor(variant) };
};

/** GET /cart — returns cart with re-validated prices and server-computed totals. */
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);

  let items = cart.items.map((it) => ({ ...it.toObject() }));

  // Re-validate each line against live data; drop lines that died.
  const refreshed = [];
  for (const item of items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findById(item.product);
    const variant = product && !product.isDeleted ? product.findVariant(item.sku) : null;
    if (!variant || !variant.isActive) continue; // product/variant removed → drop silently

    const livePrice = product.priceFor(variant);
    if (livePrice !== item.priceSnapshot) item.priceSnapshot = livePrice; // keep in sync
    if (item.quantity > variant.stock) item.quantity = variant.stock; // clamp

    refreshed.push({
      ...item,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      availableStock: variant.stock,
    });
  }

  if (
    refreshed.length !== cart.items.length ||
    refreshed.some((r, i) => {
      const original = cart.items.find((it) => it._id.toString() === r._id.toString());
      return original && (original.priceSnapshot !== r.priceSnapshot || original.quantity !== r.quantity);
    })
  ) {
    cart.items = refreshed.map(({ _id, product, sku, quantity, priceSnapshot }) => ({
      _id,
      product,
      sku,
      quantity,
      priceSnapshot,
    }));
    await cart.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { cart: refreshed, totals: computeTotals(refreshed) }, "Cart fetched"));
});

/** POST /cart/items — { productId, sku, quantity } */
const addItem = asyncHandler(async (req, res) => {
  const { productId, sku, quantity } = req.body;

  const { unitPrice } = await resolveLiveVariant({ productId, sku, requiredQty: quantity });

  const cart = await getOrCreateCart(req.user._id);

  const existing = cart.items.find((it) => it.sku === sku);
  if (existing) {
    const { variant } = await resolveLiveVariant({ productId, sku });
    existing.quantity += quantity;
    if (existing.quantity > variant.stock) {
      throw new ApiError(409, `Only ${variant.stock} left in stock for ${sku}`);
    }
    existing.priceSnapshot = unitPrice; // refresh to current price
  } else {
    cart.items.push({ product: productId, sku, quantity, priceSnapshot: unitPrice });
  }

  await cart.save();
  return res.status(201).json(new ApiResponse(201, { cart: cart.items }, "Item added to cart"));
});

/** PATCH /cart/items/:sku — { quantity } (absolute set, clamped to stock) */
const updateItem = asyncHandler(async (req, res) => {
  const { sku } = req.validatedParams;
  const { quantity } = req.body;

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((it) => it.sku === sku);
  if (!item) throw new ApiError(404, "Item not in cart");

  const product = await Product.findById(item.product);
  const variant = product && !product.isDeleted ? product.findVariant(sku) : null;
  if (!variant || !variant.isActive) throw new ApiError(409, "This variant is no longer available");

  if (quantity > variant.stock) {
    throw new ApiError(409, `Only ${variant.stock} left in stock for ${sku}`);
  }

  item.quantity = quantity;
  item.priceSnapshot = product.priceFor(variant); // re-validate price on edit
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { cart: cart.items }, "Cart updated"));
});

/** DELETE /cart/items/:sku */
const removeItem = asyncHandler(async (req, res) => {
  const { sku } = req.validatedParams;

  const cart = await getOrCreateCart(req.user._id);
  const before = cart.items.length;
  cart.items = cart.items.filter((it) => it.sku !== sku);

  if (cart.items.length === before) throw new ApiError(404, "Item not in cart");

  await cart.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { cart: cart.items }, "Item removed"));
});

/** DELETE /cart */
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  return res.status(200).json(new ApiResponse(200, { cart: [] }, "Cart cleared"));
});

export { getCart, addItem, updateItem, removeItem, clearCart, computeTotals, getOrCreateCart };
