import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-brand-border">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90" 
          alt="PUNK STUDIOS Campaign" 
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-brand-black/60"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-surface/90 border border-brand-border text-[11px] font-mono tracking-mega uppercase text-brand-muted mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></span>
          <span>DROP 01 // BATCH 01 // DELHI, INDIA</span>
        </div>

        {/* Clean Headline without '// IN' */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-8xl font-black tracking-widest text-brand-light uppercase leading-[1.05] mb-6">
          PUNK THRIFT<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand-bone to-brand-muted">
            STUDIOS
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-brand-muted font-light tracking-wide mb-10 leading-relaxed">
          Curated heavyweight streetwear and archival thrift pieces. Crafted with 200–340 GSM Indian combed cotton and bespoke hardware. Designed & based in New Delhi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs tracking-widest uppercase">
          <a 
            href="#shop-section"
            className="w-full sm:w-auto px-8 py-4 bg-brand-light text-brand-black font-bold rounded hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-2xl flex items-center justify-center gap-2"
          >
            <span>EXPLORE CATALOGUE</span>
            <ArrowRight size={15} />
          </a>

          <a 
            href="#lookbook-section"
            className="w-full sm:w-auto px-8 py-4 bg-brand-surface/80 hover:bg-brand-surface text-brand-light border border-brand-border rounded transition-all backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <span>LOOKBOOK EDITORIAL</span>
            <Eye size={15} />
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-brand-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-3xl mx-auto font-mono text-[11px]">
          <div>
            <span className="block text-brand-muted uppercase">Fabric Specs</span>
            <span className="text-brand-light font-bold text-sm">200 – 340 GSM</span>
          </div>
          <div>
            <span className="block text-brand-muted uppercase">HQ Studio</span>
            <span className="text-brand-light font-bold text-sm">Delhi, India</span>
          </div>
          <div>
            <span className="block text-brand-muted uppercase">Drop Strategy</span>
            <span className="text-brand-light font-bold text-sm">Limited Batches</span>
          </div>
          <div>
            <span className="block text-brand-muted uppercase">Shipping</span>
            <span className="text-brand-light font-bold text-sm">Pan-India Express</span>
          </div>
        </div>
      </div>
    </section>
  );
}
