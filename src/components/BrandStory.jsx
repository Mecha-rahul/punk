import React from 'react';

export function BrandStory() {
  return (
    <section id="about-section" className="py-24 bg-brand-black border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[11px] font-mono uppercase tracking-mega text-brand-muted block">
            Brand Manifesto & Sourcing // Delhi, India
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-widest text-brand-light uppercase leading-tight">
            AUTHENTIC HEAVYWEAR. NO COMPROMISE.
          </h2>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed font-light">
            PUNK STUDIOS is built in New Delhi with a clear obsession: delivering substantial, authentic heavyweight streetwear and curated archival thrift pieces that stand the test of time.
          </p>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed font-light">
            We craft our garments from 200–340 GSM Indian combed cotton. Every batch is produced in limited numbers to eliminate deadstock and guarantee exclusivity for our community.
          </p>

          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-brand-border font-mono text-xs">
            <div>
              <span className="text-brand-light font-bold block text-base">200–340 GSM</span>
              <span className="text-brand-muted text-[10px] uppercase">Custom Knit Cotton</span>
            </div>
            <div>
              <span className="text-brand-light font-bold block text-base">DELHI HQ</span>
              <span className="text-brand-muted text-[10px] uppercase">Designed & Milled</span>
            </div>
            <div>
              <span className="text-brand-light font-bold block text-base">LIMITED RUNS</span>
              <span className="text-brand-muted text-[10px] uppercase">100 Pieces / Drop</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] rounded overflow-hidden bg-brand-surface border border-brand-border">
            <img 
              src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=85" 
              alt="Studio craft" 
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
          </div>
          <div className="aspect-[3/4] rounded overflow-hidden bg-brand-surface border border-brand-border mt-8">
            <img 
              src="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=85" 
              alt="Fabric details" 
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
