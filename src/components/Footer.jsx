import React from 'react';

export function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand-border py-16 text-brand-muted font-mono text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <span className="font-editorial text-2xl font-black tracking-mega text-brand-light block">
            PUNK STUDIOS
          </span>
          <p className="text-[11px] leading-relaxed text-brand-muted max-w-sm">
            Heavyweight streetwear and archival thrift studios based in New Delhi, India. Milled with 200–340 GSM Indian combed cotton and custom hardware.
          </p>
          <div className="pt-2 text-[10px] text-brand-zinc">
            © 2026 PUNK STUDIOS. ALL RIGHTS RESERVED. NEW DELHI, INDIA.
          </div>
        </div>

        {/* Col 2: Directory */}
        <div className="space-y-2 uppercase tracking-wider text-[11px]">
          <span className="text-brand-light font-bold block mb-3">Catalogue</span>
          <a href="#shop-section" className="block hover:text-brand-light transition-colors">Shop Batch 01</a>
          <a href="#lookbook-section" className="block hover:text-brand-light transition-colors">Delhi Lookbook</a>
          <a href="#drops-section" className="block hover:text-brand-light transition-colors">Drop Countdown</a>
          <a href="#about-section" className="block hover:text-brand-light transition-colors">Sourcing Manifesto</a>
        </div>

        {/* Col 3: Customer Service */}
        <div className="space-y-2 uppercase tracking-wider text-[11px]">
          <span className="text-brand-light font-bold block mb-3">Customer Care</span>
          <a href="#" className="block hover:text-brand-light transition-colors">Pan-India Express Delivery</a>
          <a href="#" className="block hover:text-brand-light transition-colors">UPI / Cards / NetBanking</a>
          <a href="#" className="block hover:text-brand-light transition-colors">7-Day Easy Returns</a>
          <a href="#" className="block hover:text-brand-light transition-colors">Delhi Studio Concierge</a>
        </div>

      </div>
    </footer>
  );
}
