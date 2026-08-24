import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, Ruler, Check, ShoppingBag } from 'lucide-react';

export function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, formatPrice, addToCart, setIsSizeGuideOpen } = useStore();
  if (!selectedProduct) return null;

  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[0]);
  const [activeImgIndex, setActiveImgIndex] = useState(selectedColor.imgIndex || 0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('DETAILS');

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setActiveImgIndex(color.imgIndex || 0);
  };

  const currentStockForSize = selectedProduct.sizeStock[selectedSize] || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-black/85 backdrop-blur-xl overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-brand-dark border border-brand-border rounded-lg shadow-2xl overflow-hidden animate-fade-in my-8 text-brand-light"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Modal Button */}
        <button 
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-brand-black/80 border border-brand-border text-brand-muted hover:text-brand-light flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          
          {/* Left Column: Image Gallery with Horizontal Thumbnail Strip */}
          <div className="lg:col-span-7 bg-brand-black p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-brand-border">
            {/* Main Large Image */}
            <div className="relative aspect-[4/5] rounded overflow-hidden bg-brand-surface mb-4">
              <img 
                src={selectedProduct.images[activeImgIndex] || selectedProduct.images[0]} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover object-center filter contrast-105"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-mono uppercase tracking-widest bg-brand-black/90 px-2.5 py-1 rounded text-brand-light border border-brand-border">
                  {selectedProduct.fit} Cut
                </span>
              </div>
            </div>

            {/* Horizontal Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {selectedProduct.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative w-20 h-24 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                    activeImgIndex === idx ? 'border-brand-accent scale-95' : 'border-brand-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Garment Specs, Sizing & Add to Cart */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-brand-dark">
            
            <div>
              {/* Category & Tags */}
              <div className="flex items-center justify-between text-xs font-mono text-brand-muted mb-2">
                <span className="uppercase tracking-widest">{selectedProduct.category}</span>
                <div className="flex items-center gap-1 text-brand-accent">
                  <Star size={13} className="fill-brand-accent" />
                  <span>{selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Price */}
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-wider uppercase text-brand-light">
                {selectedProduct.name}
              </h2>
              <p className="text-xs font-mono text-brand-muted mt-1">
                {selectedProduct.tagline}
              </p>

              <div className="mt-4 pb-4 border-b border-brand-border flex items-baseline justify-between">
                <span className="text-2xl font-mono font-bold tracking-wider text-brand-light">
                  {formatPrice(selectedProduct.priceUSD)}
                </span>
                <span className="text-[11px] font-mono text-brand-muted">
                  Taxes & duties included
                </span>
              </div>

              {/* Colorway Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-brand-muted uppercase">Colorway:</span>
                  <span className="text-brand-light font-bold">{selectedColor.name}</span>
                </div>
                <div className="flex gap-2.5">
                  {selectedProduct.colors.map((col, i) => (
                    <button 
                      key={i}
                      onClick={() => handleColorSelect(col)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor.name === col.name ? 'border-brand-accent scale-110' : 'border-zinc-700 hover:border-zinc-400'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {selectedColor.name === col.name && (
                        <Check size={12} className={col.hex === '#111111' || col.hex === '#0a0a0a' ? 'text-white' : 'text-black'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-brand-muted uppercase">Select Size:</span>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-brand-accent hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Ruler size={12} />
                    <span>Size Chart & Fit Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {selectedProduct.sizes.map((sz) => {
                    const stock = selectedProduct.sizeStock[sz] || 0;
                    const isSoldOut = stock === 0;
                    return (
                      <button 
                        key={sz}
                        disabled={isSoldOut}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2.5 text-xs font-mono rounded border transition-all relative ${
                          isSoldOut 
                            ? 'bg-brand-surface/30 border-brand-border/40 text-zinc-600 cursor-not-allowed line-through' 
                            : selectedSize === sz 
                              ? 'bg-brand-light text-brand-black font-bold border-white' 
                              : 'bg-brand-surface text-brand-light border-brand-border hover:border-brand-muted'
                        }`}
                      >
                        {sz}
                        {stock > 0 && stock <= 3 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-accent"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Status Indicator */}
                <div className="mt-2 text-[11px] font-mono text-brand-muted">
                  {currentStockForSize === 0 ? (
                    <span className="text-red-400">Sold out in size {selectedSize}. Restock dropping next month.</span>
                  ) : currentStockForSize <= 3 ? (
                    <span className="text-brand-accent font-bold">Only {currentStockForSize} left in stock for size {selectedSize}</span>
                  ) : (
                    <span className="text-green-400">In Stock — Dispatches within 24 Hours</span>
                  )}
                </div>
              </div>

              {/* Quantity and Add to Bag */}
              <div className="mt-6 pt-6 border-t border-brand-border flex gap-3">
                <div className="flex items-center border border-brand-border rounded bg-brand-surface">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-brand-muted hover:text-brand-light"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono text-xs">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-brand-muted hover:text-brand-light"
                  >
                    +
                  </button>
                </div>

                <button 
                  disabled={currentStockForSize === 0}
                  onClick={() => {
                    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
                    setSelectedProduct(null);
                  }}
                  className={`flex-1 py-3.5 px-6 rounded font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                    currentStockForSize === 0 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-brand-accent hover:bg-brand-accentHover text-white active:scale-95'
                  }`}
                >
                  <ShoppingBag size={15} />
                  <span>{currentStockForSize === 0 ? 'Sold Out' : `Add To Bag • ${formatPrice(selectedProduct.priceUSD * quantity)}`}</span>
                </button>
              </div>

              {/* Tabs: Specifications & Care */}
              <div className="mt-8 border-t border-brand-border pt-4">
                <div className="flex gap-6 border-b border-brand-border/60 pb-2 text-xs font-mono uppercase tracking-wider">
                  <button 
                    onClick={() => setActiveTab('DETAILS')}
                    className={`pb-1 transition-colors ${activeTab === 'DETAILS' ? 'text-brand-light border-b-2 border-brand-accent' : 'text-brand-muted hover:text-brand-light'}`}
                  >
                    Garment Specs
                  </button>
                  <button 
                    onClick={() => setActiveTab('CARE')}
                    className={`pb-1 transition-colors ${activeTab === 'CARE' ? 'text-brand-light border-b-2 border-brand-accent' : 'text-brand-muted hover:text-brand-light'}`}
                  >
                    Fabric & Care
                  </button>
                  <button 
                    onClick={() => setActiveTab('FIT')}
                    className={`pb-1 transition-colors ${activeTab === 'FIT' ? 'text-brand-light border-b-2 border-brand-accent' : 'text-brand-muted hover:text-brand-light'}`}
                  >
                    Fit Advice
                  </button>
                </div>

                <div className="pt-3 text-xs text-brand-bone/80 font-light leading-relaxed">
                  {activeTab === 'DETAILS' && (
                    <ul className="space-y-1.5 list-disc list-inside">
                      {selectedProduct.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'CARE' && (
                    <p>{selectedProduct.care}</p>
                  )}
                  {activeTab === 'FIT' && (
                    <p>{selectedProduct.fitGuide}</p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
