import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CURRENCIES } from '../data/products';
import { ShoppingBag, Search, Menu, X, Ruler } from 'lucide-react';

export function Header() {
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsSearchOpen, 
    currency, 
    setCurrency, 
    setIsSizeGuideOpen 
  } = useStore();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'glass-nav border-b border-brand-border/60 py-3.5 shadow-2xl' : 'bg-brand-black/90 py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[12px] uppercase tracking-widest font-mono text-brand-muted">
          <button onClick={() => scrollToSection('shop-section')} className="hover:text-brand-light transition-colors">Shop All</button>
          <button onClick={() => scrollToSection('lookbook-section')} className="hover:text-brand-light transition-colors">Lookbook</button>
          <button onClick={() => scrollToSection('drops-section')} className="hover:text-brand-light transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
            Drops
          </button>
          <button onClick={() => scrollToSection('about-section')} className="hover:text-brand-light transition-colors">Archive</button>
        </nav>

        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-brand-light p-1 focus:outline-none"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Center Logo */}
        <div className="flex flex-col items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="font-editorial text-2xl sm:text-3xl font-black tracking-mega text-brand-light hover:text-brand-bone transition-colors">
            VOID
          </span>
          <span className="text-[9px] font-mono tracking-ultra text-brand-muted -mt-1 uppercase">
            Studios Archive
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Currency Selector */}
          <div className="relative group hidden sm:block">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-brand-dark/90 text-brand-light text-[11px] font-mono uppercase tracking-wider py-1.5 px-2.5 rounded border border-brand-border hover:border-brand-muted/60 focus:outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map(curr => (
                <option key={curr} value={curr} className="bg-brand-dark text-brand-light">
                  {curr} ({CURRENCIES[curr].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-brand-muted hover:text-brand-light transition-colors p-1"
            title="Search Archive"
          >
            <Search size={19} />
          </button>

          {/* Size Guide Trigger */}
          <button 
            onClick={() => setIsSizeGuideOpen(true)}
            className="hidden lg:flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-brand-muted hover:text-brand-light transition-colors border border-brand-border px-2.5 py-1 rounded hover:border-brand-muted/50"
          >
            <Ruler size={13} />
            <span>Size Guide</span>
          </button>

          {/* Shopping Bag Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative bg-brand-light hover:bg-white text-brand-black px-3.5 py-1.5 rounded-full font-mono text-[12px] font-bold flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-white/5"
          >
            <ShoppingBag size={15} />
            <span>BAG</span>
            <span className="bg-brand-accent text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-brand-border px-6 py-6 space-y-4 animate-fade-in text-sm font-mono tracking-widest uppercase">
          <button onClick={() => scrollToSection('shop-section')} className="block w-full text-left py-2 text-brand-light border-b border-brand-border/40">Shop Collection</button>
          <button onClick={() => scrollToSection('lookbook-section')} className="block w-full text-left py-2 text-brand-light border-b border-brand-border/40">Editorial Lookbook</button>
          <button onClick={() => scrollToSection('drops-section')} className="block w-full text-left py-2 text-brand-light border-b border-brand-border/40 flex items-center justify-between">
            <span>Upcoming Drops</span>
            <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded border border-brand-accent/30">COUNTDOWN</span>
          </button>
          <button onClick={() => scrollToSection('about-section')} className="block w-full text-left py-2 text-brand-light border-b border-brand-border/40">Brand Philosophy</button>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-brand-muted">Currency:</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-brand-dark text-brand-light text-xs font-mono py-1 px-2 rounded border border-brand-border"
            >
              {Object.keys(CURRENCIES).map(curr => (
                <option key={curr} value={curr}>{curr} ({CURRENCIES[curr].symbol})</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
