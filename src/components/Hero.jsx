import React from 'react';
import { ArrowRight, Eye, ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-brand-border">
      {/* Background Visual Collage */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90" 
          alt="VOID Studios Editorial Campaign" 
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-brand-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
        
        {/* Drop Tag Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-surface/90 border border-brand-border/80 text-[11px] font-mono tracking-mega uppercase text-brand-muted mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></span>
          <span>DROP 01 // AUTUMN / WINTER 2026</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-8xl font-black tracking-widest text-brand-light uppercase leading-[1.05] mb-6">
          MONOLITHIC<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand-bone to-brand-muted">
            ARCHIVES
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-brand-muted font-light tracking-wide mb-10 leading-relaxed">
          Architectural proportions crafted from 520 GSM loopback cotton, Japanese ripstop nylon, and Milanese calfskin. Designed in London. Milled for eternity.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 font-mono text-xs tracking-widest uppercase">
          <a 
            href="#shop-section"
            className="w-full sm:w-auto px-8 py-4 bg-brand-light text-brand-black font-bold rounded hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-2xl flex items-center justify-center gap-2"
          >
            <span>EXPLORE DROP 01</span>
            <ArrowRight size={15} />
          </a>

          <a 
            href="#lookbook-section"
            className="w-full sm:w-auto px-8 py-4 bg-brand-surface/80 hover:bg-brand-surface text-brand-light border border-brand-border rounded transition-all backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <span>VIEW EDITORIAL</span>
            <Eye size={15} />
          </a>
        </div>

        {/* Minimal Stat Strip */}
        <div className="mt-16 pt-8 border-t border-brand-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-3xl mx-auto font-mono text-[11px]">
          <div>
            <span className="block text-brand-muted uppercase">Fabric Density</span>
            <span className="text-brand-light font-bold text-sm">300 – 520 GSM</span>
          </div>
          <div>
            <span className="block text-brand-muted uppercase">Production</span>
            <span className="text-brand-light font-bold text-sm">150 Units / Drop</span>
          </div>
          <div>
            <span className="block text-brand-muted uppercase">Sourcing</span>
            <span className="text-brand-light font-bold text-sm">Osaka & Biella</span>
          </div>
          <div>
            <span className="block text-brand-muted uppercase">Dispatch</span>
            <span className="text-brand-light font-bold text-sm">Worldwide Express</span>
          </div>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-brand-muted font-mono text-[10px] tracking-widest uppercase">
        <span>SCROLL</span>
        <ChevronDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
