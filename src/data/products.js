export const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, name: 'USD' },
  EUR: { symbol: '€', rate: 0.92, name: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, name: 'GBP' },
  JPY: { symbol: '¥', rate: 154.0, name: 'JPY' }
};

export const PRODUCTS_DATA = [
  {
    id: 'vd-01',
    name: 'Heavyweight Boxy Hoodie',
    tagline: '520 GSM French Terry Cotton',
    category: 'Hoodies',
    fit: 'Boxy',
    priceUSD: 140,
    tags: ['LIMITED DROP', 'HEAVYWEIGHT'],
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewsCount: 38,
    colors: [
      { name: 'Obsidian Black', hex: '#111111', imgIndex: 0 },
      { name: 'Washed Charcoal', hex: '#373737', imgIndex: 1 },
      { name: 'Bone Taupe', hex: '#cfc9be', imgIndex: 2 }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeStock: { S: 3, M: 6, L: 4, XL: 1, XXL: 0 },
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '520 GSM ultra-heavyweight brushed loopback French Terry',
      'Double-layered hood with seamless kangaroo pocket',
      'Drop shoulder architectural silhouette with tight ribbed waist',
      'Preshrunk with enzyme wash for vintage lived-in handfeel',
      'Signature gunmetal engraved VOID metal bar at hem'
    ],
    care: 'Cold hand wash or gentle cycle inside out. Lay flat to dry. Do not tumble dry.',
    fitGuide: 'True to boxy fit. Take your normal size for intended relaxed look, or size up for exaggerated drape.'
  },
  {
    id: 'vd-02',
    name: 'Archival Oversized Tee',
    tagline: '300 GSM Organic Combed Jersey',
    category: 'Tees',
    fit: 'Oversized',
    priceUSD: 58,
    tags: ['CORE ESSENTIAL', 'BESTSELLER'],
    inStock: true,
    stockCount: 42,
    rating: 4.8,
    reviewsCount: 94,
    colors: [
      { name: 'Vintage Black', hex: '#161616', imgIndex: 0 },
      { name: 'Raw Bone', hex: '#e3dfd3', imgIndex: 1 },
      { name: 'Zinc Olive', hex: '#3b3e34', imgIndex: 2 }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sizeStock: { XS: 4, S: 12, M: 15, L: 8, XL: 3, XXL: 0 },
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '300 GSM custom-knit combed cotton',
      'Thick 1.25" high-neck rib collar (keeps shape forever)',
      'Elongated sleeve with dropped shoulder drape',
      'Blind stitched hems for clean minimalist profile',
      'Screenprinted subtle tonal studio coordinate branding on nape'
    ],
    care: 'Machine wash cold with like colors. Hang dry.',
    fitGuide: 'Oversized by design with a generous chest and dropped shoulders.'
  },
  {
    id: 'vd-03',
    name: 'Technical Tactical Bomber',
    tagline: 'Water-Repellent Italian Ripstop',
    category: 'Outerwear',
    fit: 'Relaxed',
    priceUSD: 285,
    tags: ['DROP 01', 'LOW STOCK'],
    inStock: true,
    stockCount: 5,
    rating: 5.0,
    reviewsCount: 19,
    colors: [
      { name: 'Stealth Black', hex: '#0a0a0a', imgIndex: 0 },
      { name: 'Titanium Grey', hex: '#4a4d52', imgIndex: 1 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeStock: { S: 1, M: 2, L: 2, XL: 0 },
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      'Custom waterproof matte Italian technical nylon',
      'PrimaLoft® Gold thermal insulation for all-season warmth',
      '2-way matte black heavy-duty Raccagni zipper',
      'Modular chest utility pocket with hidden key ring clip',
      'Magnetic closure side entry pockets with fleece lining'
    ],
    care: 'Specialist dry clean only.',
    fitGuide: 'Relaxed fit with room for layering over heavy knitwear or hoodies.'
  },
  {
    id: 'vd-04',
    name: 'Pleated Cargo Trouser',
    tagline: 'Heavy Cotton Twill with Bungee Cuffs',
    category: 'Bottoms',
    fit: 'Relaxed',
    priceUSD: 165,
    tags: ['NEW ARRIVAL'],
    inStock: true,
    stockCount: 19,
    rating: 4.7,
    reviewsCount: 22,
    colors: [
      { name: 'Onyx', hex: '#111111', imgIndex: 0 },
      { name: 'Washed Earth', hex: '#4e433a', imgIndex: 1 }
    ],
    sizes: ['28', '30', '32', '34', '36'],
    sizeStock: { 28: 2, 30: 6, 32: 8, 34: 3, 36: 0 },
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '380 GSM Japanese cotton-twill weave',
      'Deep dual front pleats for voluminous silhouette',
      'Streamlined envelope cargo pockets with matte snap buttons',
      'Adjustable elastic toggle hem for tapered or wide-leg styling',
      'Internal drawstring waistband with premium horn buttons'
    ],
    care: 'Machine wash cold inside out. Warm iron on reverse.',
    fitGuide: 'Wide-leg straight fit through thigh with customizable ankle cinch.'
  },
  {
    id: 'vd-05',
    name: 'Cropped Thermal Zip-Up',
    tagline: 'Waffle-Knit Lined Heavyweight Fleece',
    category: 'Hoodies',
    fit: 'Cropped',
    priceUSD: 155,
    tags: ['LIMITED DROP', 'SOLD OUT'],
    inStock: false,
    stockCount: 0,
    rating: 4.9,
    reviewsCount: 41,
    colors: [
      { name: 'Vintage Sun-fade Grey', hex: '#484848', imgIndex: 0 },
      { name: 'Off-White Milk', hex: '#f0ece1', imgIndex: 1 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeStock: { S: 0, M: 0, L: 0, XL: 0 },
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      'Cropped waist with exaggerated wide sleeves',
      '480 GSM French Terry outer + 240 GSM thermal waffle interior',
      'Distressed raw edges around pockets and cuffs',
      'Antiqued silver double-slider zipper'
    ],
    care: 'Hand wash cold. Lay flat to dry.',
    fitGuide: 'Boxy cropped length sitting right at belt line.'
  },
  {
    id: 'vd-06',
    name: 'Sculpted Minimalist Crossbody',
    tagline: 'Full-Grain Italian Calfskin',
    category: 'Accessories',
    fit: 'One Size',
    priceUSD: 110,
    tags: ['LEATHER', 'CORE ESSENTIAL'],
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewsCount: 15,
    colors: [
      { name: 'Matte Nero', hex: '#0d0d0d', imgIndex: 0 }
    ],
    sizes: ['ONE SIZE'],
    sizeStock: { 'ONE SIZE': 8 },
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      'Supple pebbled Italian calfskin leather',
      'Adjustable nylon webbing strap with quick-release metal buckle',
      'Internal card slots and microfiber phone divider',
      'Debossed minimalist VOID logo branding'
    ],
    care: 'Treat with natural leather balm.',
    fitGuide: 'Adjustable strap extends from 34" to 58".'
  },
  {
    id: 'vd-07',
    name: 'Raw Edge Boxy Mockneck',
    tagline: '400 GSM Heavy Interlock Cotton',
    category: 'Tees',
    fit: 'Boxy',
    priceUSD: 72,
    tags: ['DROP 01'],
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewsCount: 17,
    colors: [
      { name: 'Raw Chalk', hex: '#eceae2', imgIndex: 0 },
      { name: 'Onyx', hex: '#111111', imgIndex: 1 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeStock: { S: 3, M: 5, L: 4, XL: 0 },
    images: [
      'https://images.unsplash.com/photo-1503342452485-86b7f54527ef?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '400 GSM double-faced compact cotton',
      '2-inch mock neck collar with subtle rolled lip',
      'Architectural wide body with high armholes',
      'Reinforced shoulder tape for structural longevity'
    ],
    care: 'Cold gentle wash. Flat dry.',
    fitGuide: 'Tailored boxy drape.'
  },
  {
    id: 'vd-08',
    name: 'Structured Studio Cap',
    tagline: 'Heavy Washed Canvas + Metal Buckle',
    category: 'Accessories',
    fit: 'One Size',
    priceUSD: 45,
    tags: ['RESTOCK'],
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    reviewsCount: 63,
    colors: [
      { name: 'Faded Black', hex: '#222222', imgIndex: 0 },
      { name: 'Desert Sand', hex: '#d1c7b7', imgIndex: 1 }
    ],
    sizes: ['ONE SIZE'],
    sizeStock: { 'ONE SIZE': 25 },
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      'Unstructured 6-panel low profile fit',
      'Custom antiqued brass slider clasp',
      'Tonal embroidery of minimalist monogram'
    ],
    care: 'Spot clean with damp cloth.',
    fitGuide: 'Adjustable one size fits all (54-62cm).'
  }
];
