import React, { useState, useMemo } from 'react';
import { PRODUCTS_DATA } from '../data/products';
import { ProductCard } from './ProductCard';
import { Inbox } from 'lucide-react';

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedFit, setSelectedFit] = useState('ALL');
  const [sortBy, setSortBy] = useState('FEATURED');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = ['ALL', 'Hoodies', 'Tees', 'Outerwear', 'Bottoms', 'Accessories'];
  const fits = ['ALL', 'Boxy', 'Oversized', 'Relaxed', 'Cropped'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(product => {
      if (selectedCategory !== 'ALL' && product.category !== selectedCategory) return false;
      if (selectedFit !== 'ALL' && product.fit !== selectedFit) return false;
      if (inStockOnly && !product.inStock) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.priceUSD - b.priceUSD;
      if (sortBy === 'PRICE_HIGH') return b.priceUSD - a.priceUSD;
      if (sortBy === 'RATING') return b.rating - a.rating;
      return 0; // FEATURED
    });
  }, [selectedCategory, selectedFit, sortBy, inStockOnly]);

  return (
    <section id="shop-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-brand-border">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-mega text-brand-muted block mb-1">
            Catalogue 01 / {filteredProducts.length} Garments
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-widest text-brand-light uppercase">
            SHOP ARCHIVE
          </h2>
        </div>

        {/* Sort & In-stock toggle */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <label className="flex items-center gap-2 text-brand-muted hover:text-brand-light cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={inStockOnly} 
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded bg-brand-dark border-brand-border text-brand-accent focus:ring-0 w-3.5 h-3.5"
            />
            <span>In-Stock Only</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-brand-muted">Sort:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-brand-surface text-brand-light text-xs font-mono py-1.5 px-3 rounded border border-brand-border focus:outline-none cursor-pointer"
            >
              <option value="FEATURED">Featured Drop</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="RATING">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="py-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-brand-border/60">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-mono uppercase tracking-wider py-1.5 px-3.5 rounded transition-all ${
                selectedCategory === cat 
                  ? 'bg-brand-light text-brand-black font-bold shadow-md' 
                  : 'bg-brand-surface text-brand-muted hover:text-brand-light hover:bg-brand-zinc border border-brand-border/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Fit Filter Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-brand-muted text-[11px] uppercase">Fit Silhouette:</span>
          <div className="flex gap-1.5">
            {fits.map(f => (
              <button 
                key={f}
                onClick={() => setSelectedFit(f)}
                className={`text-[11px] uppercase py-1 px-2.5 rounded transition-colors ${
                  selectedFit === f 
                    ? 'bg-brand-zinc text-brand-light border border-brand-muted' 
                    : 'text-brand-muted hover:text-brand-light border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-10">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-surface/40 rounded border border-brand-border mt-8">
          <Inbox size={36} className="text-brand-muted mx-auto mb-3" />
          <p className="font-mono text-sm text-brand-light">No pieces match current criteria.</p>
          <button 
            onClick={() => { setSelectedCategory('ALL'); setSelectedFit('ALL'); setInStockOnly(false); }}
            className="mt-4 text-xs font-mono uppercase tracking-widest text-brand-accent hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </section>
  );
}
