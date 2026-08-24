export const CURRENCIES = {
  INR: { symbol: '₹', rate: 1.0, name: 'INR (India)' },
  USD: { symbol: '$', rate: 0.012, name: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, name: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0095, name: 'GBP (£)' }
};

export const PRODUCTS_DATA = [
  {
    id: 'pk-01',
    name: 'Acid Wash Boxy Hoodie',
    tagline: '340 GSM Heavyweight Loopback Cotton',
    category: 'Hoodies',
    fit: 'Boxy',
    priceINR: 2899,
    tags: ['DROP 01', '340 GSM'],
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewsCount: 42,
    colors: [
      { name: 'Acid Faded Black', hex: '#1c1c1c', imgIndex: 0 },
      { name: 'Vintage Washed Charcoal', hex: '#383838', imgIndex: 1 },
      { name: 'Raw Sand', hex: '#cfc9be', imgIndex: 2 }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeStock: { S: 3, M: 6, L: 4, XL: 1, XXL: 0 },
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '340 GSM custom knit loopback 100% Indian combed cotton',
      'Drop-shoulder boxy silhouette tailored in New Delhi',
      'Double-layered hood with seamless kangaroo pocket',
      'Distressed raw ribbed hem for vintage lived-in look',
      'Tonal embroidered PUNK THRIFT archival monogram'
    ],
    care: 'Cold machine wash inside out. Flat dry in shade to preserve wash texture.',
    fitGuide: 'True to boxy streetwear cut. Choose your usual size for standard relaxed look.'
  },
  {
    id: 'pk-02',
    name: 'Archival Distressed Graphic Tee',
    tagline: '240 GSM Pure Combed Cotton Jersey',
    category: 'Tees',
    fit: 'Oversized',
    priceINR: 1399,
    tags: ['BESTSELLER', '240 GSM'],
    inStock: true,
    stockCount: 38,
    rating: 4.8,
    reviewsCount: 89,
    colors: [
      { name: 'Vintage Onyx', hex: '#161616', imgIndex: 0 },
      { name: 'Off-White Milk', hex: '#e8e5dc', imgIndex: 1 },
      { name: 'Faded Moss', hex: '#3a3f36', imgIndex: 2 }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sizeStock: { XS: 5, S: 11, M: 14, L: 8, XL: 4, XXL: 0 },
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '240 GSM heavy compact combed cotton',
      '1.2-inch thick ribbed mock collar (anti-sagging)',
      'Hand-screenprinted vintage artwork using eco water-based dyes',
      'Double-needle stitching across shoulders and hem'
    ],
    care: 'Gentle wash in cold water. Do not iron directly on print.',
    fitGuide: 'Generous oversized fit with dropped shoulders and longer sleeves.'
  },
  {
    id: 'pk-03',
    name: 'Technical Tactical Windbreaker',
    tagline: 'Matte Nylon Ripstop with Mesh Lining',
    category: 'Outerwear',
    fit: 'Relaxed',
    priceINR: 3499,
    tags: ['LIMITED DROP', 'LOW STOCK'],
    inStock: true,
    stockCount: 6,
    rating: 5.0,
    reviewsCount: 18,
    colors: [
      { name: 'Stealth Black', hex: '#0d0d0d', imgIndex: 0 },
      { name: 'Cement Grey', hex: '#525458', imgIndex: 1 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeStock: { S: 1, M: 3, L: 2, XL: 0 },
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      'Water-resistant matte nylon ripstop with breathable mesh',
      'Dual two-way heavy YKK zipper with branded pullers',
      'Concealed chest utility pockets with key loop clip',
      'Adjustable elastic bungee cord toggle waistband'
    ],
    care: 'Hand wash or dry clean recommended.',
    fitGuide: 'Relaxed layerable cut.'
  },
  {
    id: 'pk-04',
    name: 'Wide-Leg Pleated Parachute Pants',
    tagline: '280 GSM Cotton Twill with Ankle Bungees',
    category: 'Bottoms',
    fit: 'Relaxed',
    priceINR: 2499,
    tags: ['NEW DROP', '280 GSM'],
    inStock: true,
    stockCount: 18,
    rating: 4.8,
    reviewsCount: 27,
    colors: [
      { name: 'Washed Black', hex: '#141414', imgIndex: 0 },
      { name: 'Olive Khaki', hex: '#48443b', imgIndex: 1 }
    ],
    sizes: ['28', '30', '32', '34', '36'],
    sizeStock: { 28: 3, 30: 7, 32: 6, 34: 2, 36: 0 },
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '280 GSM premium Indian cotton twill',
      'Deep knee dart pleats creating exaggerated volume',
      'Dual oversized cargo utility flap pockets',
      'Internal drawstring waist + ankle cinch toggles'
    ],
    care: 'Machine wash cold. Line dry.',
    fitGuide: 'Wide-leg straight fit with customizable ankle taper.'
  },
  {
    id: 'pk-05',
    name: 'Raw Hem Boxy Mockneck Tee',
    tagline: '260 GSM Compact Interlock Cotton',
    category: 'Tees',
    fit: 'Boxy',
    priceINR: 1499,
    tags: ['260 GSM', 'ESSENTIAL'],
    inStock: true,
    stockCount: 22,
    rating: 4.7,
    reviewsCount: 31,
    colors: [
      { name: 'Raw Chalk', hex: '#ede9df', imgIndex: 0 },
      { name: 'Onyx Black', hex: '#111111', imgIndex: 1 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeStock: { S: 4, M: 8, L: 7, XL: 3 },
    images: [
      'https://images.unsplash.com/photo-1503342452485-86b7f54527ef?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '260 GSM double-faced compact cotton',
      'High 2-inch mock collar with raw edge cuff finish',
      'Square boxy body proportions tailored for Indian climate',
      'Pre-shrunk to retain shape wash after wash'
    ],
    care: 'Cold gentle wash. Flat dry.',
    fitGuide: 'Structured boxy fit.'
  },
  {
    id: 'pk-06',
    name: 'Curated Leather Crossbody Bag',
    tagline: 'Full-Grain Pebble Leather + Metal Hardware',
    category: 'Accessories',
    fit: 'One Size',
    priceINR: 1899,
    tags: ['THRIFT ARCHIVE'],
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewsCount: 19,
    colors: [
      { name: 'Nero Black', hex: '#0f0f0f', imgIndex: 0 }
    ],
    sizes: ['ONE SIZE'],
    sizeStock: { 'ONE SIZE': 9 },
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      'Pebbled full-grain leather with water-repellent coating',
      'Matte gunmetal hardware with quick-release buckle',
      'Interior padded compartment for everyday essentials'
    ],
    care: 'Wipe clean with natural leather conditioner.',
    fitGuide: 'Adjustable strap extends up to 54 inches.'
  },
  {
    id: 'pk-07',
    name: 'Vintage Wash Distressed Cap',
    tagline: 'Heavy 100% Washed Cotton Canvas',
    category: 'Accessories',
    fit: 'One Size',
    priceINR: 899,
    tags: ['RESTOCKED'],
    inStock: true,
    stockCount: 30,
    rating: 4.9,
    reviewsCount: 54,
    colors: [
      { name: 'Faded Black', hex: '#242424', imgIndex: 0 },
      { name: 'Earth Clay', hex: '#877b6d', imgIndex: 1 }
    ],
    sizes: ['ONE SIZE'],
    sizeStock: { 'ONE SIZE': 30 },
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      'Unstructured 6-panel low profile crown',
      'Antiqued brass slider buckle with tuck-in strap',
      'Embroidered PUNK.IN mini monogram'
    ],
    care: 'Spot clean only.',
    fitGuide: 'Adjustable standard fit (54-62cm).'
  },
  {
    id: 'pk-08',
    name: 'Cropped Thermal Zip Hoodie',
    tagline: '320 GSM French Terry Fleece',
    category: 'Hoodies',
    fit: 'Cropped',
    priceINR: 2799,
    tags: ['LIMITED DROP', 'SOLD OUT'],
    inStock: false,
    stockCount: 0,
    rating: 4.9,
    reviewsCount: 36,
    colors: [
      { name: 'Vintage Charcoal', hex: '#333333', imgIndex: 0 },
      { name: 'Bone Taupe', hex: '#d5cfc4', imgIndex: 1 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeStock: { S: 0, M: 0, L: 0, XL: 0 },
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '320 GSM loopback cotton fleece with thermal lining',
      'Cropped waist sitting right at belt-line with oversized sleeves',
      'Double-slider metal zipper'
    ],
    care: 'Hand wash cold. Lay flat to dry.',
    fitGuide: 'Boxy cropped silhouette.'
  }
];
