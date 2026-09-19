import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { InventoryLog } from "../models/inventoryLog.model.js";
import { ensureFound } from "../utils/helpers.js";

/**
 * POST /admin/inventory/adjust — admin manual stock adjustment with audit log.
 * The product.controller copy was removed; this is the single implementation.
 * quantityChange is signed: +restock / −shrink.
 */
const adjustStock = asyncHandler(async (req, res) => {
  const { productId, sku, quantityChange, changeType } = req.body;

  const product = await Product.findById(productId);
  ensureFound(product, "Product not found");

  const variant = product.findVariant(sku);
  if (!variant) throw new ApiError(404, `Variant ${sku} not found`);

  const nextStock = variant.stock + quantityChange;
  if (nextStock < 0) {
    throw new ApiError(400, `Adjustment would take stock negative (current: ${variant.stock})`);
  }

  variant.stock = nextStock;
  await product.save();

  await InventoryLog.create({
    product: product._id,
    sku,
    changeType,
    quantityChange,
    adjustedBy: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(200, { sku, stock: variant.stock }, "Stock adjusted")
  );
});

/** GET /admin/inventory/:productId — audit trail for one product. */
const getLogsForProduct = asyncHandler(async (req, res) => {
  const { productId } = req.validatedParams;

  const logs = await InventoryLog.find({ product: productId })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("adjustedBy", "name email")
    .populate("order", "orderNumber");

  ensureFound(await Product.findById(productId).select("_id"), "Product not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { logs }, "Inventory logs fetched"));
});

export { adjustStock, getLogsForProduct };
