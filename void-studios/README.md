# AKUMA — Streetwear Storefront (Frontend)

Bold luxury streetwear brand site. Vite + React + Tailwind, frontend-only with mock data and local state, structured so a backend can be wired in without rewrites. 悪魔

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## Where things live

| What | Where |
|---|---|
| Brand copy, nav links, footer links, promo codes | `src/content/content.js` |
| Mock product catalog (18 products) | `src/data/products.js` |
| Color palette / design tokens | `src/index.css` (`:root` vars) + `tailwind.config.js` |
| Wordmark component | `src/components/Logo.jsx` |

## Swap in real assets later

- **Product photos** → drop files in `public/assets/products/` and point each product's `images[]` at them. Missing images render a designed "image coming soon" placeholder automatically.
- **Hero video/image** → replace `HERO_SOURCE` at the top of `src/components/Hero.jsx` (accepts `.mp4` or `.jpg`).
- **Category tiles / lookbook** → `public/assets/categories/`, `public/assets/lookbook/` (sources in `CategoryShowcase.jsx` and `Home.jsx`).

## Logo icon slot

`src/components/Logo.jsx` contains an empty `<span data-logo-icon-slot>` — drop the real brand mark (SVG or `<img>`) there when supplied. The wordmark font is controlled by the `font-wordmark` entry in `tailwind.config.js` (Anton → Archivo Black fallback).

## Plug in a real backend later

| Feature | File to change |
|---|---|
| Auth (login/register/session) | `src/context/StoreContext.jsx` — `login()`, `register()`, `logout()` currently mock + `localStorage` |
| Cart persistence / server cart | same context — swap `localStorage` reads/writes for API calls |
| Product catalog | replace `src/data/products.js` with API fetches (field names already match) |
| Checkout / payments | `src/pages/CheckoutPage.jsx` — placeholder marks the exact POST point |
| Promo codes | `src/content/content.js` → `PROMO_CODES` (mock validation in `CartPage.jsx`) |

## Routes

`/` · `/login` · `/register` · `/logout` · `/wishlist` · `/cart` · `/checkout` · `/account` · `/new-arrivals` · `/tops[/:subcategory]` · `/bottoms[/:subcategory]` · `/accessories` · `/sale` · `/product/:productId` · `/search?q=` · 404 catch-all
