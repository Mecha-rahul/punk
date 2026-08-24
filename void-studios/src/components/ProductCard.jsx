import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, Plus } from 'lucide-react';

export function ProductCard({ product }) {
  const { setSelectedProduct, formatPrice, toggleWishlist, wishlist, addToCart } = useStore();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const defaultColor = product.colors[0];
  const defaultSize = product.sizes[0];

  return (
    <div 
      className="group relative flex flex-col bg-brand-surface rounded border border-brand-border/80 overflow-hidden transition-all duration-300 hover:border-brand-muted/60 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[3/4] bg-brand-dark overflow-hidden cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        {/* Primary & Secondary Image Flip */}
        <img 
          src={isHovered && product.images[1] ? product.images[1] : product.images[currentImgIndex]} 
          alt={product.name}
          className="w-full h-full object-cover object-center filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tags.map((tag, i) => (
            <span 
              key={i}
              className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded font-bold ${
                tag === 'LIMITED DROP' ? 'bg-brand-accent text-white' :
                tag === 'SOLD OUT' ? 'bg-zinc-800 text-zinc-400' :
                'bg-brand-black/80 backdrop-blur-md text-brand-light border border-brand-border'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Wishlist Heart Trigger */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-black/70 backdrop-blur-md border border-brand-border flex items-center justify-center text-brand-light hover:text-brand-accent transition-all z-10"
          title="Save to wishlist"
        >
          <Heart 
            size={14} 
            className={isWishlisted ? "text-brand-accent fill-brand-accent" : ""} 
          />
        </button>

        {/* Fit Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[10px] font-mono uppercase tracking-wider bg-brand-black/90 backdrop-blur-md text-brand-bone px-2 py-0.5 rounded border border-brand-border">
            {product.fit} Cut
          </span>
        </div>

        {/* Quick Add Overlay on Hover */}
        {product.inStock && (
          <div className="absolute inset-x-3 bottom-3 hidden group-hover:flex gap-1.5 z-20 animate-fade-in">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(product);
              }}
              className="flex-1 bg-brand-light hover:bg-white text-brand-black font-mono text-[11px] font-bold py-2.5 px-3 rounded text-center tracking-wider transition-colors uppercase flex items-center justify-center gap-1 shadow-lg"
            >
              <Eye size={13} />
              <span>Inspect</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, defaultSize, defaultColor);
              }}
              className="bg-brand-black hover:bg-zinc-900 text-brand-light border border-brand-border font-mono text-[11px] py-2.5 px-3 rounded flex items-center justify-center transition-colors"
              title="Quick Add to Bag"
            >
              <Plus size={14} />
            </button>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 border border-zinc-700 bg-brand-black/80 px-3 py-1 rounded">
              ARCHIVED / SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Color Swatches */}
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.map((c, i) => (
              <button 
                key={i}
                onClick={() => setCurrentImgIndex(c.imgIndex || 0)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${currentImgIndex === (c.imgIndex || 0) ? 'border-brand-accent scale-110' : 'border-zinc-700 hover:border-zinc-500'}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[10px] font-mono text-brand-muted ml-1 uppercase">
              {product.colors.length} {product.colors.length === 1 ? 'colorway' : 'colorways'}
            </span>
          </div>

          {/* Title & Tagline */}
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-medium text-sm text-brand-light group-hover:text-brand-bone cursor-pointer tracking-wide"
          >
            {product.name}
          </h3>
          <p className="text-[11px] font-mono text-brand-muted mt-0.5 truncate">
            {product.tagline}
          </p>
        </div>

        {/* Price & Sizes */}
        <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-brand-light tracking-wider">
            {formatPrice(product.priceUSD)}
          </span>
          <div className="flex gap-1 text-[10px] text-brand-muted uppercase">
            {product.sizes.slice(0, 4).map((s, idx) => (
              <span key={idx} className={product.sizeStock[s] === 0 ? 'line-through opacity-40' : ''}>
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && <span>+{product.sizes.length - 4}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
