import React from 'react';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand-border py-16 text-brand-muted font-mono text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <span className="font-editorial text-2xl font-black tracking-mega text-brand-light block">
            PUNK.IN
          </span>
          <p className="text-[11px] leading-relaxed text-brand-muted max-w-xs">
            Heavyweight streetwear and archival thrift studios based in New Delhi, India. Milled with 200–340 GSM Indian combed cotton.
          </p>
          <div className="pt-2 text-[10px] text-brand-zinc">
            © 2026 PUNK THRIFT STUDIOS (PUNK.IN). NEW DELHI, INDIA.
          </div>
        </div>

        <div className="space-y-2 uppercase tracking-wider text-[11px]">
          <span className="text-brand-light font-bold block mb-3">Catalogue</span>
          <a href="#shop-section" className="block hover:text-brand-light transition-colors">Shop Batch 01</a>
          <a href="#lookbook-section" className="block hover:text-brand-light transition-colors">Delhi Lookbook</a>
          <a href="#drops-section" className="block hover:text-brand-light transition-colors">Drop Countdown</a>
          <a href="#about-section" className="block hover:text-brand-light transition-colors">Sourcing Manifesto</a>
        </div>

        <div className="space-y-2 uppercase tracking-wider text-[11px]">
          <span className="text-brand-light font-bold block mb-3">Customer Care</span>
          <a href="#" className="block hover:text-brand-light transition-colors">Pan-India Express Delivery</a>
          <a href="#" className="block hover:text-brand-light transition-colors">UPI & NetBanking</a>
          <a href="#" className="block hover:text-brand-light transition-colors">7-Day Easy Returns</a>
          <a href="#" className="block hover:text-brand-light transition-colors">Delhi Studio Concierge</a>
        </div>

        <div className="space-y-3">
          <span className="text-brand-light font-bold block uppercase tracking-wider text-[11px]">Creator & GitHub</span>
          <p className="text-[11px] leading-relaxed">
            Repository linked to <strong className="text-brand-light">PUNK.in</strong> on GitHub.
          </p>
          <a 
            href="https://github.com/piyushpant-rgb/PUNK.in" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-surface hover:bg-brand-zinc text-brand-light border border-brand-border rounded text-[11px] font-bold uppercase transition-colors"
          >
            <Github size={14} />
            <span>github.com/piyushpant-rgb/PUNK.in</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
