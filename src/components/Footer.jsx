import React from 'react';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand-border py-16 text-brand-muted font-mono text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Col 1: Brand */}
        <div className="space-y-3">
          <span className="font-editorial text-2xl font-black tracking-mega text-brand-light block">
            VOID
          </span>
          <p className="text-[11px] leading-relaxed text-brand-muted max-w-xs">
            Luxury heavyweight streetwear archive and architectural garments. Made in limited quantities with zero overproduction.
          </p>
          <div className="pt-2 text-[10px] text-brand-zinc">
            © 2026 VOID STUDIOS LTD. ALL RIGHTS RESERVED.
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2 uppercase tracking-wider text-[11px]">
          <span className="text-brand-light font-bold block mb-3">Archive Directory</span>
          <a href="#shop-section" className="block hover:text-brand-light transition-colors">Shop All Drops</a>
          <a href="#lookbook-section" className="block hover:text-brand-light transition-colors">Campaign Lookbook</a>
          <a href="#drops-section" className="block hover:text-brand-light transition-colors">Drop Schedule</a>
          <a href="#about-section" className="block hover:text-brand-light transition-colors">Fabric & Craft Manifesto</a>
        </div>

        {/* Col 3: Customer Care */}
        <div className="space-y-2 uppercase tracking-wider text-[11px]">
          <span className="text-brand-light font-bold block mb-3">Client Services</span>
          <a href="#" className="block hover:text-brand-light transition-colors">Worldwide Express Shipping</a>
          <a href="#" className="block hover:text-brand-light transition-colors">Returns & Authenticity</a>
          <a href="#" className="block hover:text-brand-light transition-colors">Garment Care Instructions</a>
          <a href="#" className="block hover:text-brand-light transition-colors">Contact / Concierge</a>
        </div>

        {/* Col 4: GitHub / Developer Link */}
        <div className="space-y-3">
          <span className="text-brand-light font-bold block uppercase tracking-wider text-[11px]">Repository & Creator</span>
          <p className="text-[11px] leading-relaxed">
            Engineered with React + Tailwind CSS. Designed for seamless deployment on Vercel or GitHub Pages.
          </p>
          <a 
            href="https://github.com/piyushpant-rgb" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-surface hover:bg-brand-zinc text-brand-light border border-brand-border rounded text-[11px] font-bold uppercase transition-colors"
          >
            <Github size={14} />
            <span>github.com/piyushpant-rgb</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
