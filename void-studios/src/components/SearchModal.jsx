import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_DATA } from '../data/products';
import { Search, X } from 'lucide-react';

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, setSelectedProduct, formatPrice } = useStore();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const searchResults = PRODUCTS_DATA.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.fit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-brand-black/90 backdrop-blur-md p-4 sm:p-8 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-3xl">
        
        {/* Search Input Bar */}
        <div className="flex items-center justify-between border-b border-brand-muted/40 pb-4 mb-8">
          <div className="flex items-center gap-3 flex-1">
            <Search size={24} className="text-brand-muted" />
            <input 
              ref={inputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH GARMENTS, GSM WEIGHT, CUT, COLORWAYS..."
              className="w-full bg-transparent text-xl sm:text-2xl font-editorial text-brand-light placeholder:text-brand-muted/50 focus:outline-none uppercase tracking-wider"
            />
          </div>
          <button 
            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
            className="text-brand-muted hover:text-brand-light p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Results Grid */}
        <div className="overflow-y-auto max-h-[70vh] space-y-4">
          {searchQuery.trim() === '' ? (
            <div className="text-xs font-mono text-brand-muted space-y-2">
              <span className="uppercase tracking-widest block mb-2">Suggested Inquiries:</span>
              <div className="flex flex-wrap gap-2">
                {['520 GSM Hoodie', 'Ripstop Bomber', 'Boxy Tee', 'Pleated Cargo', 'Calfskin Bag'].map((tag, i) => (
                  <button 
                    key={i}
                    onClick={() => setSearchQuery(tag)}
                    className="bg-brand-surface px-3 py-1.5 rounded border border-brand-border hover:border-brand-muted text-brand-bone"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchResults.map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIsSearchOpen(false);
                  }}
                  className="flex gap-4 p-3 bg-brand-surface rounded border border-brand-border hover:border-brand-muted cursor-pointer transition-colors"
                >
                  <img src={prod.images[0]} alt={prod.name} className="w-16 h-20 object-cover rounded bg-brand-dark" />
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-mono uppercase text-brand-accent">{prod.category} • {prod.fit}</span>
                    <h4 className="text-sm font-bold text-brand-light">{prod.name}</h4>
                    <span className="text-xs font-mono text-brand-muted mt-1">{formatPrice(prod.priceUSD)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 font-mono text-xs text-brand-muted">
              No matching garments located for "{searchQuery}".
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
