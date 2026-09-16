import React, { useState, useEffect } from 'react';

export function DropCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="drops-section" className="py-24 bg-brand-surface/70 border-b border-brand-border relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        
        <span className="text-[11px] font-mono uppercase tracking-mega text-brand-accent block mb-2">
          Next Drop Scheduled
        </span>
        <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-widest text-brand-light uppercase mb-4">
          DROP 02 // DELHI UNDERGROUND
        </h2>
        <p className="max-w-xl mx-auto text-xs sm:text-sm font-light text-brand-muted mb-12">
          Strictly limited to 100 numbered pieces. Heavyweight 340 GSM French Terry hoodies and curated vintage thrift outerwear.
        </p>

        {/* Countdown Clock Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto font-mono">
          {[
            { label: 'DAYS', val: timeLeft.days },
            { label: 'HOURS', val: timeLeft.hours },
            { label: 'MINUTES', val: timeLeft.minutes },
            { label: 'SECONDS', val: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="bg-brand-dark p-4 rounded border border-brand-border shadow-xl">
              <span className="text-2xl sm:text-4xl font-bold text-brand-light block">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase text-brand-muted tracking-widest mt-1 block">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
