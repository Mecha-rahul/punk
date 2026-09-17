// ==================================================================
// AKUMA — site-wide copy & configuration
// Edit brand text here; components read from this file.
// ==================================================================

export const BRAND = {
  name: 'AKUMA',
  meaning: '悪魔',
  tagline: 'Bold luxury streetwear. Limited drops. No restocks.',
  footerBlurb:
    'AKUMA is a luxury streetwear label built on heavyweight fabric, restricted drops and archive-minded design.',
  copyright: '© 2026 AKUMA',
  madeIn: 'Made in India',
}

export const ANNOUNCEMENTS = [
  'FREE SHIPPING ON ORDERS ABOVE ₹5,000',
  'NEW DROP LIVE NOW',
  'LIMITED UNITS — NO RESTOCKS',
]

export const TRUST_BADGES = ['SHIPS FAST', 'LIMITED DROPS', 'NO RESTOCKS']

// Header nav — structure drives the desktop dropdowns and the mobile accordion.
export const NAV_LINKS = [
  { label: 'NEW ARRIVALS', to: '/new-arrivals' },
  {
    label: 'TOPS',
    children: [
      { label: 'T-SHIRTS', to: '/tops/tshirts' },
      { label: 'HOODIES', to: '/tops/hoodies' },
      { label: 'JACKETS', to: '/tops/jackets' },
      { label: 'FULL SLEEVE T-SHIRT', to: '/tops/full-sleeve' },
      { label: 'TANK TOPS', to: '/tops/tank-tops' },
    ],
  },
  {
    label: 'BOTTOMS',
    children: [
      { label: 'PANTS', to: '/bottoms/pants' },
      { label: 'JEANS', to: '/bottoms/jeans' },
      { label: 'SHORTS', to: '/bottoms/shorts' },
    ],
  },
  { label: 'ACCESSORIES', to: '/accessories' },
  { label: 'SALE', to: '/sale', accent: true },
]

export const FOOTER_LINKS = {
  shop: [
    { label: 'New Arrivals', to: '/new-arrivals' },
    { label: 'Tops', to: '/tops' },
    { label: 'Bottoms', to: '/bottoms' },
    { label: 'Accessories', to: '/accessories' },
    { label: 'Sale', to: '/sale' },
  ],
  support: [
    { label: 'Track Order', to: '/account' },
    { label: 'Returns & Exchange Policy', to: '/account' },
    { label: 'FAQs', to: '/account' },
    { label: 'Contact Us', to: '/account' },
    { label: 'Terms of Service', to: '/account' },
    { label: 'Privacy Policy', to: '/account' },
  ],
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'WhatsApp', href: '#' },
  ],
}

export const PROMO_CODES = {
  AKUMA10: 10, // % off — mock validation lives in cart summary
}

export const FREE_SHIPPING_THRESHOLD = 5000 // ₹
export const SHIPPING_FLAT_RATE = 199 // ₹, below the free threshold
