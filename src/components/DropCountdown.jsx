import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export function DropCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 16, minutes: 42, seconds: 18 });
  const [email, setEmail] = useState('');
  const [signedUp, setSignedUp] = useState(false);

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

  const handleSignup = (e) => {
    e.preventDefault();
    if (email) setSignedUp(true);
  };

  return (
    <section id="drops-section" className="py-24 bg-brand-surface/70 border-b border-brand-border relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        
        <span className="text-[11px] font-mono uppercase tracking-mega text-brand-accent block mb-2">
          Next Archive Release
        </span>
        <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-widest text-brand-light uppercase mb-4">
          DROP 02 // MONOCHROME MONOLITH
        </h2>
        <p className="max-w-xl mx-auto text-xs sm:text-sm font-light text-brand-muted mb-12">
          Strictly limited to 150 pieces worldwide. Heavyweight Japanese Melton wool outerwear, technical trousers, and raw silver accessories.
        </p>

        {/* Countdown Clock Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto font-mono mb-12">
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

        {/* VIP Early Access Sign Up Form */}
        <div className="max-w-md mx-auto">
          {signedUp ? (
            <div className="p-4 bg-brand-dark rounded border border-green-500/40 text-green-400 font-mono text-xs flex items-center justify-center gap-2">
              <Check size={15} />
              <span>VIP Access Confirmed. Password sent 1 hour prior to drop.</span>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="flex gap-2">
              <input 
                type="email" 
                required
                placeholder="ENTER EMAIL FOR 1-HR EARLY ACCESS" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-brand-dark border border-brand-border rounded px-4 py-3 text-xs font-mono text-brand-light focus:outline-none focus:border-brand-muted placeholder:text-brand-muted/70"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-brand-light hover:bg-white text-brand-black font-mono text-xs font-bold uppercase tracking-wider rounded transition-all"
              >
                Join VIP
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
