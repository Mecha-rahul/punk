import React from 'react';
import { useStore } from '../context/StoreContext';

export function AnnouncementBar() {
  const { shippingRemainingINR, formatPrice } = useStore();

  return (
    <div className="bg-brand-black border-b border-brand-border text-[11px] font-mono tracking-widest text-brand-muted py-2 px-4 overflow-hidden relative z-40">
      <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping inline-block"></span>
          <strong className="text-brand-light">PUNK.IN DROP 01 LIVE</strong> — BASED IN DELHI, INDIA
        </span>
        <span>•</span>
        <span>
          {shippingRemainingINR === 0 ? (
            <strong className="text-brand-light">COMPLIMENTARY EXPRESS SHIPPING UNLOCKED ACROSS INDIA</strong>
          ) : (
            <>ADD {formatPrice(shippingRemainingINR)} FOR FREE EXPRESS DELIVERY ACROSS INDIA</>
          )}
        </span>
        <span>•</span>
        <span>PROMO CODE <span className="text-brand-light font-bold">PUNK10</span> FOR 10% OFF</span>
        <span>•</span>
        <span>200 – 340 GSM HEAVYWEIGHT INDIAN COMBED COTTON</span>
        <span>•</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping inline-block"></span>
          <strong className="text-brand-light">PUNK.IN DROP 01 LIVE</strong> — BASED IN DELHI, INDIA
        </span>
        <span>•</span>
        <span>ADD {formatPrice(shippingRemainingINR)} FOR FREE EXPRESS DELIVERY</span>
      </div>
    </div>
  );
}
