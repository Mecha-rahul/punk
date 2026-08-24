import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, X, CheckCircle, Trash2, Loader2, Lock, ShieldCheck } from 'lucide-react';

export function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    formatPrice,
    subtotalUSD,
    discountUSD,
    finalSubtotalUSD,
    discountPercent,
    applyPromo,
    shippingRemainingUSD,
    freeShippingThresholdUSD
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isCartOpen) return null;

  const shippingProgress = Math.min(100, Math.round(((freeShippingThresholdUSD - shippingRemainingUSD) / freeShippingThresholdUSD) * 100));

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-brand-black/80 backdrop-blur-sm animate-fade-in flex justify-end">
      <div 
        className="w-full max-w-md bg-brand-dark border-l border-brand-border h-full flex flex-col justify-between shadow-2xl animate-fade-in text-brand-light"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-accent" />
            <h3 className="font-editorial text-lg font-bold tracking-widest uppercase">
              Your Archive Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button 
            onClick={() => { setIsCartOpen(false); setCheckoutSuccess(false); }}
            className="w-8 h-8 rounded-full border border-brand-border hover:border-brand-muted flex items-center justify-center text-brand-muted hover:text-brand-light"
          >
            <X size={16} />
          </button>
        </div>

        {/* Free Shipping Milestone Meter */}
        <div className="bg-brand-surface px-6 py-3 border-b border-brand-border text-xs font-mono">
          <div className="flex justify-between items-center mb-1.5 text-[11px]">
            <span className="text-brand-muted uppercase">Complimentary Express Shipping</span>
            <span className="font-bold text-brand-light">
              {shippingRemainingUSD === 0 ? 'UNLOCKED' : `${formatPrice(shippingRemainingUSD)} remaining`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-brand-dark rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-accent transition-all duration-500 rounded-full"
              style={{ width: `${shippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {checkoutSuccess ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <h4 className="font-editorial text-xl font-bold uppercase tracking-wider text-brand-light">
                Order Dispatched Simulation
              </h4>
              <p className="text-xs font-mono text-brand-muted max-w-xs mx-auto">
                Thank you for ordering with VOID Studios. Confirmation email sent to your inbox.
              </p>
              <button 
                onClick={() => { setIsCartOpen(false); setCheckoutSuccess(false); }}
                className="mt-4 px-6 py-2.5 bg-brand-light text-brand-black font-mono text-xs font-bold rounded uppercase tracking-wider"
              >
                Continue Browsing
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <ShoppingBag size={36} className="text-brand-muted mx-auto stroke-1" />
              <p className="font-mono text-sm text-brand-light uppercase">Your bag is empty</p>
              <p className="text-xs font-mono text-brand-muted">Explore Drop 01 to add archival garments.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2 bg-brand-surface border border-brand-border text-brand-light font-mono text-xs uppercase tracking-wider rounded hover:border-brand-muted"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.key} className="flex gap-4 p-3 bg-brand-surface rounded border border-brand-border/70">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded bg-brand-dark" />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-brand-light">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.key)}
                        className="text-brand-muted hover:text-brand-accent p-0.5"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-brand-muted mt-0.5">
                      Size: <span className="text-brand-light font-bold">{item.size}</span> • Color: {item.color.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 font-mono text-xs">
                    <div className="flex items-center border border-brand-border rounded bg-brand-dark">
                      <button 
                        onClick={() => updateQuantity(item.key, -1)}
                        className="px-2 py-0.5 text-brand-muted hover:text-brand-light"
                      >
                        -
                      </button>
                      <span className="px-2 text-[11px]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.key, 1)}
                        className="px-2 py-0.5 text-brand-muted hover:text-brand-light"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-brand-light">
                      {formatPrice(item.priceUSD * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && !checkoutSuccess && (
          <div className="p-6 bg-brand-surface border-t border-brand-border space-y-4">
            {/* Promo Code Box */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="PROMO CODE (e.g. VOID15)" 
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 bg-brand-dark border border-brand-border rounded px-3 py-2 text-xs font-mono uppercase text-brand-light focus:outline-none focus:border-brand-muted"
              />
              <button 
                onClick={() => applyPromo(inputCode)}
                className="px-4 py-2 bg-brand-zinc text-brand-light font-mono text-xs uppercase tracking-wider rounded hover:bg-zinc-700 transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Subtotal Calculations */}
            <div className="space-y-1.5 font-mono text-xs border-t border-brand-border/60 pt-3">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span>{formatPrice(subtotalUSD)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-brand-accent">
                  <span>VIP Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(discountUSD)}</span>
                </div>
              )}

              <div className="flex justify-between text-brand-muted">
                <span>Express Worldwide Shipping</span>
                <span>{shippingRemainingUSD === 0 ? 'FREE' : formatPrice(15)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-brand-light pt-2 border-t border-brand-border/60">
                <span>Estimated Total</span>
                <span>{formatPrice(finalSubtotalUSD + (shippingRemainingUSD === 0 ? 0 : 15))}</span>
              </div>
            </div>

            {/* Checkout Actions */}
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-brand-accent hover:bg-brand-accentHover text-white font-mono text-xs font-bold tracking-widest uppercase rounded transition-all shadow-xl flex items-center justify-center gap-2 active:scale-98"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Proceed to Checkout • {formatPrice(finalSubtotalUSD + (shippingRemainingUSD === 0 ? 0 : 15))}</span>
                </>
              )}
            </button>

            <div className="text-[10px] font-mono text-brand-muted text-center flex items-center justify-center gap-2">
              <ShieldCheck size={12} />
              <span>256-Bit Encrypted Checkout • Free 30-Day Returns</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
