# Punk — Clothing E-Commerce Backend Design

> Structure-first design for the Express + MongoDB backend. No implementation code — this defines **what exists, how it connects, and why**, so any file can be written later without re-deciding anything.

---

## 1. Stack & Existing Foundations

| Layer      | Choice                              | Already in repo                                |
|------------|-------------------------------------|------------------------------------------------|
| Runtime    | Node.js + Express (`/api/v1`)       | ✅ `app.js`, `index.js`                        |
| Database   | MongoDB Atlas via Mongoose          | ✅ `src/db/index.js`, DB `void-studios`        |
| Auth       | JWT access + refresh, httpOnly cookies | ✅ user model, auth controller              |
| Uploads    | Multer → Cloudinary                 | ✅ `multer.middleware.js`, `cloudinary.js`     |
| Responses  | `ApiResponse` / `ApiError` / `asyncHandler` | ✅ `src/utils/`                        |

Everything below **plugs into these conventions**: one `x.model.js` + `x.controller.js` + `x.routes.js` triple per resource, mounted in `app.js`.

---

## 2. Guiding Principles

1. **Snapshot prices everywhere money appears.** Cart lines and order lines store the price *at that moment*. Never compute an order total from the live product price.
2. **Catalog is soft-deleted, transactions are never edited.** Products/variants get `isActive`; orders get a status timeline (append-only).
3. **Stock is guarded by atomic conditional updates** (`stock >= qty` check inside the same update), so overselling is impossible without distributed locks.
4. **Admin vs public split is structural**, not ad-hoc: every route declares `public | customer | admin`.
5. **Enums live in `constants.js`** (order status, roles, coupon types…), so the frontend and DB never drift.
6. **One resource = one controller file.** Cross-resource logic (checkout) is orchestrated in the controller of the resource it *creates* (order), calling other models — not via controller-to-controller calls.

---

## 3. Target Directory Structure

```
backend/src/
├── app.js                      # mounts all routers under /api/v1
├── constants.js                # DB_NAME, enums (roles, order status, coupon type)
├── config/
│   └── cloudinary.js
├── db/index.js
├── models/
│   ├── user.model.js           # ✅ exists (extend: role, addresses)
│   ├── category.model.js
│   ├── brand.model.js
│   ├── product.model.js        # embeds variants[] (the SKU layer)
│   ├── cart.model.js
│   ├── wishlist.model.js
│   ├── coupon.model.js
│   ├── order.model.js
│   ├── payment.model.js
│   ├── review.model.js
│   └── inventoryLog.model.js   # phase 2 (stock audit trail)
├── controllers/
│   ├── auth.controller.js      # ✅ exists
│   ├── user.controller.js
│   ├── category.controller.js
│   ├── brand.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── wishlist.controller.js
│   ├── coupon.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   └── review.controller.js
├── routes/                     # same names as controllers, *.routes.js
├── middlewares/
│   ├── auth.middleware.js      # ✅ verifyJWT
│   ├── admin.middleware.js     # NEW — requireAdmin (after verifyJWT)
│   ├── multer.middleware.js    # ✅
│   └── errorHandler.js         # global ApiError → JSON (if not already)
└── utils/                      # ApiError, ApiResponse, asyncHandler, cloudinary
```

---

## 4. Data Model

### 4.1 Entity relationships (text diagram)

```
User 1──1 Cart          Cart *>── Product (variant)
User 1──1 Wishlist      Wishlist *>── Product
User 1──* Order         Order *>── Product (variant snapshot embedded)
User 1──* Review        Review *>── Product (unique per user+product)
User 1──* Address       (embedded in User)
Category 1──* Product   Category 1──* Category (self-ref tree)
Brand 1──* Product
Product 1──* Variant    (embedded array; each has own _id)
Order 1──1 Payment
Coupon *──* Cart/Order  (applied by code; usage counted)
```

### 4.2 Models

#### User *(extends existing model)*
| Field         | Type                | Notes                                        |
|---------------|---------------------|----------------------------------------------|
| username      | String, unique, idx | ✅ existing                                   |
| email         | String, unique      | ✅ existing                                   |
| fullname      | String              | ✅ existing                                   |
| avtaar        | String (url)        | ✅ existing                                   |
| password      | String (hashed)     | ✅ existing                                   |
| refreshToken  | String              | ✅ existing                                   |
| **role**      | Enum `customer\|admin`, default `customer` | NEW                   |
| **addresses** | [AddressSubdoc]     | NEW — see below                              |

`Address` subdoc: `label` (home/work), `fullName`, `phone`, `line1`, `line2`, `city`, `state`, `pincode` (validated 6-digit), `isDefault` (bool). Addresses are **embedded** — they never need standalone queries and always travel with the user.

#### Category — hierarchical taxonomy (Men ▸ Shirts)
| Field    | Type                  | Notes                                  |
|----------|-----------------------|----------------------------------------|
| name     | String, required      |                                        |
| slug     | String, unique, idx   | for URLs like `/men/shirts`            |
| parent   | ObjectId → Category   | self-reference, nullable for roots     |
| image    | String (url)          | optional tile image                    |
| isActive | Boolean, default true |                                        |

Tree depth kept to 2 levels; ancestors resolved in the controller, not stored (avoids sync bugs).

#### Brand
`name` (unique) · `slug` (unique, idx) · `logo` (url) · `description` · `isActive`

#### Product — the clothing concept ("Slim-Fit Oxford Shirt")
| Field            | Type                        | Notes                                  |
|------------------|-----------------------------|----------------------------------------|
| name             | String, required, idx       |                                        |
| slug             | String, unique              | generated from name + suffix           |
| description      | String                      | rich description                       |
| category         | ObjectId → Category, idx    |                                        |
| brand            | ObjectId → Brand, idx       |                                        |
| audience         | Enum `men\|women\|kids\|unisex` | filter facet                       |
| fabric           | String                      | "100% cotton oxford"                   |
| careInstructions | [String]                    |                                        |
| images           | [String]                    | cloudinary urls; shared gallery        |
| mrp              | Number                      | list price                             |
| sellingPrice     | Number                      | **base** price; variants may override  |
| variants         | [VariantSubdoc]             | ⬇ the SKU layer                        |
| tags             | [String]                    | search boost                           |
| avgRating        | Number, default 0           | denormalized from Review               |
| numReviews       | Number, default 0           | denormalized from Review               |
| isActive         | Boolean                     | soft delete / unpublish                |
| isFeatured       | Boolean                     | homepage rail                          |

`Variant` subdoc (each gets its own `_id` automatically — this is the handle carts/orders use):
`size` (Enum: `XS S M L XL XXL`, or `numeric` string) · `color` (name) · `colorHex` · `skuCode` (unique sparse, e.g. `SLIM-OXF-NVY-M`) · `stock` (Number, min 0) · `priceOverride` (nullable — falls back to product `sellingPrice`) · `isActive`.

**Why embedded variants?** Product pages fetch everything in one query; subdoc `_id`s give stable references; stock decrements stay atomic via positional updates. Tradeoff documented in §9. 

#### Cart — one per user
| Field   | Type                          | Notes                             |
|---------|-------------------------------|-----------------------------------|
| user    | ObjectId → User, unique       | one cart per user, created lazily |
| items   | [CartItemSubdoc]              |                                   |
| coupon  | ObjectId → Coupon, nullable   |                                   |

`CartItem` subdoc: `product` (→ Product) · `variantId` (the variant subdoc `_id`) · `qty` (min 1) · `priceAtAdd` (snapshot) · `size`/`color`/`title`/`image` snapshots for rendering without joins.

#### Wishlist
`user` (unique) · `products` [→ Product] — set semantics, toggle-friendly.

#### Coupon
| Field        | Type                              |
|--------------|-----------------------------------|
| code         | String, unique, uppercase         |
| type         | Enum `percent\|flat`              |
| value        | Number (percent → 0–100)          |
| minCartValue | Number                            |
| maxDiscount  | Number (cap for percent type)     |
| validFrom / validTill | Date window              |
| usageLimit   | Number (global)                   |
| usedCount    | Number                            |
| isActive     | Boolean                           |

Per-user limiting (phase 2) via a `usedBy: [→ User]` array.

#### Order — immutable once placed, only status mutates
| Field            | Type                       | Notes                                     |
|------------------|----------------------------|-------------------------------------------|
| orderNumber      | String, unique, idx        | human-readable, generated (`PK-2026-XXXX`) |
| user             | ObjectId → User, idx       |                                           |
| items            | [OrderItemSubdoc]          | full snapshot — ⬇                         |
| subtotal         | Number                     | Σ qty × priceAtPurchase                   |
| discount         | Number                     | from coupon                               |
| shippingFee      | Number                     | free above threshold (constant)           |
| total            | Number                     | derived once, stored                      |
| couponCode       | String, nullable           | snapshot, not a live ref                  |
| shippingAddress  | AddressSubdoc snapshot     | copied — user may edit addresses later    |
| status           | Enum (see §5)              | current status                            |
| statusTimeline   | [{status, at, note}]       | append-only                               |
| payment          | ObjectId → Payment         |                                           |
| placedAt / deliveredAt / cancelledAt | Date   |                                           |

`OrderItem` subdoc: `product` (ref, for lookup) · `variantId` · `title` · `brand` · `size` · `color` · `skuCode` · `image` · `qty` · `mrp` · `priceAtPurchase`. **Everything the fulfillment/packing slip needs is frozen here** — a product rename or price change never rewrites history.

#### Payment — gateway-facing state machine
`order` (→ Order, unique) · `provider` (Enum `razorpay\|stripe\|cod`) · `providerOrderId` · `providerPaymentId` · `signature` · `amount` · `status` (Enum `created\|authorized\|paid\|failed\|refunded`) · `rawWebhook` (Object, last payload for debugging). Webhook handler verifies signature before touching order status.

#### Review
`user` (→ User) · `product` (→ Product) · **compound unique index (user, product)** · `rating` (1–5) · `title` · `body` · `images` [urls] · `isVerifiedPurchase` (computed: user has a delivered order containing this product) · `helpfulCount`. On create/update/delete, the controller recomputes `avgRating`/`numReviews` on the product (single aggregation, `$set`).

#### InventoryLog *(phase 2)*
`product` · `variantId` · `delta` (±) · `reason` (Enum `ORDER\|CANCEL\|RETURN\|RESTOCK\|ADMIN_ADJUST`) · `refId` (order) · `by` (admin user). Every stock mutation writes one line → full audit trail.

---

## 5. Enumerations (→ `constants.js`)

```
ROLES:                customer | admin
ORDER_STATUS:         PLACED → CONFIRMED → PACKED → SHIPPED
                      → OUT_FOR_DELIVERY → DELIVERED
                      | CANCELLED | RETURN_REQUESTED → RETURNED → REFUNDED
PAYMENT_STATUS:       created | authorized | paid | failed | refunded
PAYMENT_PROVIDER:     razorpay | stripe | cod
COUPON_TYPE:          percent | flat
SIZE:                 XS | S | M | L | XL | XXL
AUDIENCE:             men | women | kids | unisex
FREE_SHIPPING_ABOVE:  999   (currency units)
```

Legal transitions of `ORDER_STATUS` are enforced in one helper (e.g. only `PLACED|CONFIRMED|PACKED` can be cancelled by the customer; `DELIVERED` can move to `RETURN_REQUESTED` within N days).

---

## 6. Controllers — responsibility contracts

Each entry: *function → what it does (in / out)*. All wrapped in `asyncHandler`, all return `ApiResponse`, all throw `ApiError`.

### auth.controller ✅ (exists, +3 to add)
| Function              | Contract                                                              |
|-----------------------|-----------------------------------------------------------------------|
| registerUser ✅       | multipart (avtaar, coverImage) → user; duplicate check on email/username |
| loginUser ✅          | email-or-username + password → tokens in cookies + sanitized user     |
| logoutUser ✅         | unset refreshToken, clear cookies                                     |
| refreshAccessToken ✅ | cookie/body refresh token → rotate tokens, reset cookies              |
| **changePassword**    | current + new password → re-hash, invalidate refreshToken             |
| **getCurrentUser**    | `req.user` → sanitized profile (no password/refreshToken)             |
| **updateAccount**     | fullname/email edits → sanitized user                                 |
| **updateAvatar**      | multer file → cloudinary → user                                       |

### user.controller
| Function           | Contract                                                        |
|--------------------|-----------------------------------------------------------------|
| addAddress         | append to `user.addresses`; first address becomes default       |
| updateAddress      | edit by `addresses._id` (owner check implicit — own profile)    |
| removeAddress      | pull by id; never remove the address used by an active order (not enforced — snapshot keeps orders safe) |
| setDefaultAddress  | flip `isDefault` flags atomically                               |
| getMyOrders        | order history, newest first, paginated                          |
| getMyReviews       | reviews authored by me                                          |

### category.controller
| Function                | Access | Contract                                    |
|-------------------------|--------|---------------------------------------------|
| listCategories          | public | full tree (roots + children populated)      |
| getCategoryBySlug       | public | category + child ids (for product filtering)|
| createCategory          | admin  | name + optional parent + image              |
| updateCategory / deleteCategory | admin | delete = soft (`isActive: false`)     |

### brand.controller
Same shape as category: `listBrands` (public), `createBrand`, `updateBrand`, `deleteBrand` (admin).

### product.controller — the biggest surface
**Public browsing:**
| Function          | Contract                                                                                     |
|-------------------|----------------------------------------------------------------------------------------------|
| listProducts      | query params: `category` (slug), `brand`, `audience`, `size`, `color`, `minPrice`, `maxPrice`, `search`, `sort` (new\|price-asc\|price-desc\|rating), `page`, `limit`. Builds a Mongo filter; size/color match inside `variants`; returns paginated card payload |
| getProductBySlug  | full product + variant list; 404 if `isActive: false`                                        |
| getRelatedProducts| same category, different product, top-rated, limit 8                                         |
| searchSuggestions | name/tags regex, returns `{name, slug, image}` — powers the navbar typeahead                 |

**Admin (all behind `requireAdmin`):**
| Function              | Contract                                                              |
|-----------------------|-----------------------------------------------------------------------|
| createProduct         | JSON body + `upload.array("images")` → cloudinary → product; slug auto-generated |
| updateProduct         | partial update; price edits never touch existing orders               |
| deleteProduct         | soft: `isActive: false` (keeps order history intact)                  |
| addVariant            | push variant subdoc (size+color+skuCode+stock)                        |
| updateVariant         | edit priceOverride/stock/isActive by variant `_id`                    |
| removeVariant         | soft-remove; rejected if referenced by an undelivered order item      |
| adjustStock           | admin delta adjustment (+restock/−shrink); writes InventoryLog (phase 2) |

### cart.controller — every mutation revalidates
| Function        | Contract                                                                                    |
|-----------------|---------------------------------------------------------------------------------------------|
| getMyCart       | find-or-create by user; computes totals server-side (never trust client totals)             |
| addItem         | body: `productId`, `variantId`, `qty`. Validates product active + variant stock ≥ qty + merges with existing line (qty++). Snapshot title/price/image into the line |
| updateItemQty   | clamp 1…stock; revalidate price snapshot (refresh if product price changed)                 |
| removeItem      | pull by variantId                                                                           |
| clearCart       | empty items, drop coupon                                                                    |
| applyCoupon     | validate coupon (active, window, minCartValue, usage) → set ref, recompute totals           |
| removeCoupon    | unset ref                                                                                   |

### wishlist.controller
`getMyWishlist` (populate cards) · `toggleWishlistItem` (add/remove by productId — single endpoint for the heart button).

### coupon.controller (admin)
`createCoupon` · `updateCoupon` · `deactivateCoupon` (soft) · `listCoupons` (with usage stats). Validation logic itself lives in a shared util used by both cart (preview) and order (final).

### order.controller — checkout is the critical path
| Function            | Access  | Contract                                                                                     |
|---------------------|---------|-----------------------------------------------------------------------------------------------|
| placeOrder          | customer| **The transaction:** inside one Mongo session → ① re-fetch cart, revalidate every variant stock with conditional update (`stock >= qty`, `$inc −qty`); ② create order with full snapshots; ③ record payment intent (`cod` → mark `paid`=false/`cod`; gateway → `created`); ④ clear cart. Any step fails → abort session, stock untouched |
| getMyOrders         | customer| own orders, paginated, status filter                                                          |
| getOrderById        | customer| own order by id or orderNumber; admin sees all                                                |
| cancelOrder         | customer| only in `PLACED|CONFIRMED|PACKED`; restock all items; status timeline entry                   |
| requestReturn       | customer| only within N days of `DELIVERED` → `RETURN_REQUESTED`                                        |
| **admin:** listAllOrders | admin | filter by status/user/date, paginated                                                     |
| **admin:** updateOrderStatus | admin | enforce legal transition (§5), append timeline; `SHIPPED` requires courier + tracking no. |
| **admin:** processReturn | admin | approve → `RETURNED` + refund payment status + restock; reject → back to `DELIVERED`       |

### payment.controller
| Function            | Access   | Contract                                                            |
|---------------------|----------|----------------------------------------------------------------------|
| createPaymentSession| customer | call gateway → return provider order/session id for frontend checkout |
| verifyPayment       | customer | client redirect callback → verify signature → mark `paid`, order → `CONFIRMED` |
| webhook             | **provider** (signature-verified, no JWT) | source of truth for status flips; idempotent by `providerPaymentId` |

### review.controller
| Function      | Access    | Contract                                                             |
|---------------|-----------|----------------------------------------------------------------------|
| listProductReviews | public | paginated per product, helpful sort                                  |
| upsertReview  | customer  | create **or** update own review (unique user+product); sets `isVerifiedPurchase`; recompute product aggregates |
| deleteReview  | owner/admin | remove + recompute aggregates                                       |
| markHelpful   | customer  | `helpfulCount++`, one hit per user (phase 2: per-user set)           |

---

## 7. Middleware Pipeline

```
request
  → cors (credentials)            [app.js ✅]
  → cookieParser / json / urlenc  [app.js ✅]
  → route-level: multer (only where files are uploaded)
  → verifyJWT          (reads access-token cookie, attaches req.user)
  → requireAdmin       (role === "admin", else 403)   ← NEW
  → controller
  → global errorHandler → ApiError → {statusCode, message} JSON
```

- **verifyJWT stays mandatory on everything user-scoped** (cart, wishlist, orders, checkout, reviews, me-routes). Catalog browsing is public.
- **requireAdmin** is a 5-line guard used exactly like `verifyJWT` in the route table below.
- Webhook route is deliberately **outside** verifyJWT — providers can't log in; it authenticates via signature instead.

---

## 8. API Route Map (`/api/v1/...`)

| Group    | Method + Path                          | Access   | Handler                  |
|----------|----------------------------------------|----------|--------------------------|
| auth     | POST /auth/register                    | public   | registerUser ✅          |
|          | POST /auth/login                       | public   | loginUser ✅             |
|          | POST /auth/logout                      | customer | logoutUser ✅            |
|          | POST /auth/refresh-token               | public*  | refreshAccessToken ✅    |
|          | POST /auth/change-password             | customer | changePassword           |
|          | GET  /auth/me                          | customer | getCurrentUser           |
| users    | POST /users/addresses                  | customer | addAddress               |
|          | PATCH/DELETE /users/addresses/:id      | customer | update/removeAddress     |
|          | GET  /users/me/orders                  | customer | getMyOrders              |
| categories | GET /categories                      | public   | listCategories           |
|          | GET /categories/:slug                  | public   | getCategoryBySlug        |
|          | POST/PATCH/DELETE /categories…         | admin    | category CRUD            |
| brands   | GET /brands · POST/PATCH/DELETE /brands… | public/admin | brand CRUD         |
| products | GET /products (filters, sort, page)    | public   | listProducts             |
|          | GET /products/:slug                    | public   | getProductBySlug         |
|          | GET /products/:slug/related            | public   | getRelatedProducts       |
|          | GET /products/search/suggest?q=        | public   | searchSuggestions        |
|          | POST /products (multipart)             | admin    | createProduct            |
|          | PATCH/DELETE /products/:id             | admin    | update/deleteProduct     |
|          | POST/PATCH/DELETE /products/:id/variants… | admin | variant management       |
| cart     | GET /cart                              | customer | getMyCart                |
|          | POST /cart/items                       | customer | addItem                  |
|          | PATCH /cart/items/:variantId           | customer | updateItemQty            |
|          | DELETE /cart/items/:variantId          | customer | removeItem               |
|          | DELETE /cart                           | customer | clearCart                |
|          | POST /cart/coupon · DELETE /cart/coupon| customer | apply/removeCoupon       |
| wishlist | GET /wishlist · POST /wishlist/:productId | customer | getMyWishlist / toggle |
| coupons  | POST/PATCH/DELETE /coupons…            | admin    | coupon CRUD              |
| orders   | POST /orders (checkout)                | customer | placeOrder               |
|          | GET /orders · GET /orders/:id          | customer | my orders / detail       |
|          | POST /orders/:id/cancel                | customer | cancelOrder              |
|          | POST /orders/:id/return                | customer | requestReturn            |
|          | GET /orders/admin/all                  | admin    | listAllOrders            |
|          | PATCH /orders/admin/:id/status         | admin    | updateOrderStatus        |
|          | POST /orders/admin/:id/return          | admin    | processReturn            |
| payments | POST /payments/session                 | customer | createPaymentSession     |
|          | POST /payments/verify                  | customer | verifyPayment            |
|          | POST /payments/webhook                 | provider | webhook (signature auth) |
| reviews  | GET /products/:slug/reviews            | public   | listProductReviews       |
|          | PUT /reviews/:productId                | customer | upsertReview             |
|          | DELETE /reviews/:productId             | customer | deleteReview (owner)     |
|          | POST /reviews/:productId/helpful       | customer | markHelpful              |

\* refresh-token is "public" but only meaningful with a valid refresh cookie.

---

## 9. Key Flows

### 9.1 Browse → cart → checkout (happy path)
```
GET /products?category=men&size=M&sort=price-asc
GET /products/slim-fit-oxford-shirt
POST /cart/items        { productId, variantId, qty }   ← stock checked here (soft check)
POST /cart/coupon       { code: "FIRST50" }             ← discount previewed
POST /orders                                            ← STOCK CHECKED HARD + DECREMENTED (transaction)
POST /payments/session → gateway → webhook → CONFIRMED
```
The soft check (cart) gives UX; the **hard check is inside the checkout transaction** — that's the only one that matters for correctness.

### 9.2 Oversell protection (no locks needed)
Variant stock decrement is a single conditional update:
`match: { _id: productId, "variants._id": vid, "variants.stock": { $gte: qty } }` + `update: { $inc: { "variants.$.stock": −qty } }`.
If `matchedCount === 0` → either stock ran out mid-checkout → 409 "Sold out" and the whole transaction aborts. Two concurrent buyers can never both pass.

### 9.3 Order lifecycle
```
PLACED → CONFIRMED → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
   └─ customer cancel (≤ PACKED) ─┘        └─ return window → RETURN_REQUESTED → RETURNED → REFUNDED
```
Every hop appends `{status, at, note}` to `statusTimeline` — the tracking UI is just that array rendered.

### 9.4 Auth flow (already built ✅)
login → `accessToken` (short) + `refreshToken` (long, stored on user) as httpOnly cookies → `verifyJWT` guards protected routes → `/refresh-token` rotates when access expires → logout unsets + clears.

---

## 10. Design Decisions & Tradeoffs

| Decision | Alternative rejected | Why |
|----------|----------------------|-----|
| Variants **embedded** in Product | separate `sku` collection | one-query product page, atomic positional stock updates, catalog scale (dozens of SKUs/product) is well within embedded limits. **Revisit** if flash-sale concurrency demands per-SKU collections |
| Prices **snapshotted** in cart/order lines | join live prices at read | orders are legal/financial records; a price edit must never rewrite them |
| Addresses **embedded** in User | Address collection | always fetched together; orders snapshot anyway |
| Soft delete on catalog | hard delete | order history + reviews must survive product removal |
| Status **timeline array** on order | single status field only | tracking UI + dispute audit for free |
| Coupon **code snapshot** on order | live ref | deactivating a coupon must not corrupt old orders |
| Denormalized `avgRating` on Product | aggregate on read | product list is the hottest query; recompute is O(reviews of one product) |
| Mongo **transactions** only in checkout | everywhere | one place needs multi-document atomicity (stock + order + cart); Atlas replica sets support it |

---

## 11. Build Order (suggested)

1. **Catalog read path** — Category, Brand, Product models + public product controllers/routes *(site becomes browsable)*
2. **Admin catalog CRUD** — `requireAdmin` middleware, product/variant management, cloudinary wiring
3. **Cart + wishlist** — models, controllers, coupon validation util
4. **Checkout** — Order + Payment models, `placeOrder` transaction, order status endpoints
5. **Reviews** — model, upsert, aggregate recompute
6. **Payments integration** — gateway session/verify/webhook
7. **Phase 2** — InventoryLog audit, per-user coupon limits, rate limiting, zod validation layer, search (Atlas Search) 

Each phase ships a working slice; no phase depends on a later one.
