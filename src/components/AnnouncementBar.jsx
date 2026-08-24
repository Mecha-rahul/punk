import React from 'react';
import { useStore } from '../context/StoreContext';

export function AnnouncementBar() {
  const { shippingRemainingUSD, formatPrice } = useStore();

  return (
    <div className="bg-brand-black border-b border-brand-border text-[11px] font-mono tracking-widest text-brand-muted py-2 px-4 overflow-hidden relative z-40">
      <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping inline-block"></span>
          <strong className="text-brand-light">DROP 01 LIVE NOW</strong> — ARCHIVAL HEAVYWEIGHTS
        </span>
        <span>•</span>
        <span>
          {shippingRemainingUSD === 0 ? (
            <strong className="text-brand-light">COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING UNLOCKED</strong>
          ) : (
            <>ADD {formatPrice(shippingRemainingUSD)} FOR COMPLIMENTARY EXPRESS SHIPPING</>
          )}
        </span>
        <span>•</span>
        <span>PROMO CODE <span className="text-brand-light font-bold">VOID15</span> FOR 15% OFF FIRST DROP</span>
        <span>•</span>
        <span>ETHICALLY MILLED 520 GSM HEAVYWEIGHT FRENCH TERRY</span>
        <span>•</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping inline-block"></span>
          <strong className="text-brand-light">DROP 01 LIVE NOW</strong> — ARCHIVAL HEAVYWEIGHTS
        </span>
        <span>•</span>
        <span>ADD {formatPrice(shippingRemainingUSD)} FOR COMPLIMENTARY EXPRESS SHIPPING</span>
        <span>•</span>
        <span>PROMO CODE <span className="text-brand-light font-bold">VOID15</span> FOR 15% OFF FIRST DROP</span>
      </div>
    </div>
  );
}
