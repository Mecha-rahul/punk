import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_DATA } from '../data/products';
import { LOOKBOOK_SLIDES } from '../data/lookbook';
import { Compass, ArrowLeft, ArrowRight, Plus, ArrowUpRight, MoveHorizontal } from 'lucide-react';

export function HorizontalLookbook() {
  const { setSelectedProduct, formatPrice } = useStore();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollByAmount = (direction) => {
    if (scrollRef.current) {
      const shift = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: shift, behavior: 'smooth' });
    }
  };

  const handleScrollEvent = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / 380);
      setActiveIndex(Math.min(index, LOOKBOOK_SLIDES.length - 1));
    }
  };

  const openHotspotProduct = (productId) => {
    const prod = PRODUCTS_DATA.find(p => p.id === productId);
    if (prod) setSelectedProduct(prod);
  };

  return (
    <section id="lookbook-section" className="py-24 bg-brand-dark border-b border-brand-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-mega text-brand-accent mb-2">
            <Compass size={14} />
            <span>Cinematic Editorial</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-widest text-brand-light uppercase">
            THE LOOKBOOK
          </h2>
          <p className="text-brand-muted text-xs sm:text-sm font-light mt-2 max-w-xl">
            Drag horizontally or use arrow triggers to explore Campaign Serie 01. Click interactive hotspots on models to instantly inspect garments.
          </p>
        </div>

        {/* Gallery Navigation Controls */}
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs text-brand-muted">
            <span className="text-brand-light font-bold">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(LOOKBOOK_SLIDES.length).padStart(2, '0')}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scrollByAmount('left')}
              className="w-10 h-10 rounded-full border border-brand-border bg-brand-surface hover:bg-brand-black hover:border-brand-muted flex items-center justify-center text-brand-light transition-all active:scale-95"
              aria-label="Scroll left"
            >
              <ArrowLeft size={16} />
            </button>
            <button 
              onClick={() => scrollByAmount('right')}
              className="w-10 h-10 rounded-full border border-brand-border bg-brand-surface hover:bg-brand-black hover:border-brand-muted flex items-center justify-center text-brand-light transition-all active:scale-95"
              aria-label="Scroll right"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Drag Strip */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScrollEvent}
        className="flex gap-6 overflow-x-auto hide-scrollbar px-4 sm:px-8 pb-8 pt-2 drag-cursor select-none snap-x"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {LOOKBOOK_SLIDES.map((slide) => (
          <div 
            key={slide.id}
            className="flex-shrink-0 w-[300px] sm:w-[380px] md:w-[460px] snap-center group relative rounded-lg overflow-hidden bg-brand-surface border border-brand-border/80 transition-all duration-300 hover:border-brand-muted/70"
          >
            {/* Image Frame */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src={slide.image} 
                alt={slide.title}
                draggable="false"
                className="w-full h-full object-cover object-center filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 editorial-gradient opacity-90"></div>

              {/* Season Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest bg-brand-black/80 backdrop-blur-md px-2.5 py-1 rounded text-brand-light border border-brand-border">
                  {slide.season}
                </span>
              </div>

              {/* Interactive Garment Hotspot */}
              <div 
                style={{ top: slide.hotspot.y, left: slide.hotspot.x }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/hotspot"
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    openHotspotProduct(slide.productId);
                  }}
                  className="relative w-8 h-8 rounded-full bg-brand-accent/80 hover:bg-brand-accent text-white flex items-center justify-center backdrop-blur-md border border-white/40 shadow-xl transition-transform hover:scale-110 active:scale-95"
                  title="Shop this look"
                >
                  <span className="absolute inset-0 rounded-full bg-brand-accent animate-ping opacity-60"></span>
                  <Plus size={14} className="relative z-10" />
                </button>

                {/* Popover Card */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover/hotspot:flex flex-col w-52 p-3 bg-brand-black/95 backdrop-blur-xl border border-brand-border rounded shadow-2xl text-left pointer-events-none animate-fade-in z-30">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-brand-accent">Shop The Piece</span>
                  <span className="text-xs font-bold text-brand-light mt-0.5">{slide.productName}</span>
                  <span className="text-[11px] font-mono text-brand-muted mt-1">{formatPrice(slide.productPrice)}</span>
                </div>
              </div>

              {/* Slide Editorial Information */}
              <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
                <h3 className="font-editorial text-lg sm:text-xl font-bold tracking-wider text-brand-light uppercase">
                  {slide.title}
                </h3>
                <p className="text-xs font-light text-brand-bone/80 italic leading-relaxed">
                  {slide.quote}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <button 
                    onClick={() => openHotspotProduct(slide.productId)}
                    className="text-[11px] font-mono uppercase tracking-widest text-brand-light hover:text-brand-accent flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Garment</span>
                    <ArrowUpRight size={13} />
                  </button>
                  <span className="text-[10px] font-mono text-brand-muted uppercase">VOID ARCHIVE</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Bottom Drag Prompt */}
      <div className="text-center mt-2 text-[11px] font-mono tracking-widest text-brand-muted uppercase flex items-center justify-center gap-2">
        <MoveHorizontal size={14} />
        <span>Click and drag horizontally to view full spread</span>
      </div>
    </section>
  );
}
