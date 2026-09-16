import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, Ruler, Check, ShoppingBag, ChevronLeft, ChevronRight, MoveHorizontal, ArrowLeft, RotateCcw } from 'lucide-react';

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

  const handleResetSelection = () => {
    setSelectedColor(selectedProduct.colors[0]);
    setSelectedSize(selectedProduct.sizes[0]);
    setActiveImgIndex(selectedProduct.colors[0].imgIndex || 0);
    setQuantity(1);
  };

  const totalImages = selectedProduct.images.length;

  const handlePrevImage = (e) => {
    e && e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e && e.stopPropagation();
    setActiveImgIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalImages]);

  const currentStockForSize = selectedProduct.sizeStock[selectedSize] || 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brand-black/85 backdrop-blur-xl overflow-y-auto"
      onClick={() => setSelectedProduct(null)}
    >
      <div 
        className="relative w-full max-w-5xl bg-brand-dark border border-brand-border rounded-lg shadow-2xl overflow-hidden animate-fade-in my-8 text-brand-light"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Bar with Back / Undo Button */}
        <div className="bg-brand-surface/90 px-4 sm:px-6 py-3 border-b border-brand-border flex items-center justify-between">
          
          {/* Back to Catalogue */}
          <button 
            onClick={() => setSelectedProduct(null)}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-muted hover:text-brand-light bg-brand-dark px-3 py-1.5 rounded border border-brand-border hover:border-brand-muted transition-all active:scale-95"
            title="Back to Catalog"
          >
            <ArrowLeft size={14} />
            <span>Back to Catalogue</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Reset / Undo */}
            <button 
              onClick={handleResetSelection}
              className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-brand-muted hover:text-brand-light transition-colors"
              title="Reset color and size options"
            >
              <RotateCcw size={12} />
              <span>Reset Options</span>
            </button>

            {/* Close 'X' */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="w-8 h-8 rounded-full bg-brand-black border border-brand-border text-brand-muted hover:text-brand-light flex items-center justify-center transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Column: Image Gallery with Swipe Buttons */}
          <div className="lg:col-span-7 bg-brand-black p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-brand-border">
            
            <div className="relative aspect-[4/5] rounded overflow-hidden bg-brand-surface mb-4 group select-none">
              <img 
                src={selectedProduct.images[activeImgIndex] || selectedProduct.images[0]} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover object-center filter contrast-105 transition-all duration-300"
              />

              <div className="absolute top-3 left-3 z-20">
                <span className="text-[10px] font-mono uppercase tracking-widest bg-brand-black/90 px-2.5 py-1 rounded text-brand-light border border-brand-border">
                  {selectedProduct.fit} Cut
                </span>
              </div>

              <div className="absolute top-3 right-3 z-20">
                <span className="text-[10px] font-mono bg-brand-black/80 backdrop-blur-md px-2 py-0.5 rounded text-brand-light border border-brand-border">
                  {activeImgIndex + 1} / {totalImages}
                </span>
              </div>

              {/* Prev Swipe Button */}
              <button 
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-brand-black/80 hover:bg-brand-black text-brand-light border border-brand-border flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl"
                title="Previous Image"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next Swipe Button */}
              <button 
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-brand-black/80 hover:bg-brand-black text-brand-light border border-brand-border flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl"
                title="Next Image"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-3 inset-x-0 flex justify-center z-20 pointer-events-none">
                <span className="text-[10px] font-mono bg-brand-black/80 backdrop-blur-md px-3 py-1 rounded-full text-brand-muted border border-brand-border/60 flex items-center gap-1.5">
                  <MoveHorizontal size={12} />
                  <span>Click &lt; &gt; buttons to change photo</span>
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

          {/* Right Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-brand-dark">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-brand-muted mb-2">
                <span className="uppercase tracking-widest">{selectedProduct.category}</span>
                <div className="flex items-center gap-1 text-brand-accent">
                  <Star size={13} className="fill-brand-accent" />
                  <span>{selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-wider uppercase text-brand-light">
                {selectedProduct.name}
              </h2>
              <p className="text-xs font-mono text-brand-muted mt-1">
                {selectedProduct.tagline}
              </p>

              <div className="mt-4 pb-4 border-b border-brand-border flex items-baseline justify-between">
                <span className="text-2xl font-mono font-bold tracking-wider text-brand-light">
                  {formatPrice(selectedProduct.priceINR)}
                </span>
                <span className="text-[11px] font-mono text-brand-muted">
                  GST Included • Delhi Dispatch
                </span>
              </div>

              {/* Colorway */}
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
                        <Check size={12} className={col.hex === '#111111' || col.hex === '#0f0f0f' || col.hex === '#161616' || col.hex === '#1c1c1c' ? 'text-white' : 'text-black'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-brand-muted uppercase">Select Size:</span>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-brand-accent hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Ruler size={12} />
                    <span>Size Chart & Fit Advisor</span>
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

                <div className="mt-2 text-[11px] font-mono text-brand-muted">
                  {currentStockForSize === 0 ? (
                    <span className="text-red-400">Sold out in size {selectedSize}. Next batch dropping soon.</span>
                  ) : currentStockForSize <= 3 ? (
                    <span className="text-brand-accent font-bold">Only {currentStockForSize} left in stock for size {selectedSize}</span>
                  ) : (
                    <span className="text-green-400">In Stock — Dispatched within 24 Hours from Delhi</span>
                  )}
                </div>
              </div>

              {/* Add to Bag */}
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
                  <span>{currentStockForSize === 0 ? 'Sold Out' : `Add To Bag • ${formatPrice(selectedProduct.priceINR * quantity)}`}</span>
                </button>
              </div>

              {/* Tabs */}
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
