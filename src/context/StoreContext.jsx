import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, CURRENCIES } from '../data/products';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('void_cart');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });
  const [currency, setCurrency] = useState('USD');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('void_cart', JSON.stringify(cart));
    } catch(e) {}
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const formatPrice = (usdAmount) => {
    const curr = CURRENCIES[currency];
    const converted = usdAmount * curr.rate;
    if (currency === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(0)}`;
  };

  const addToCart = (product, size, color, quantity = 1) => {
    const itemKey = `${product.id}-${size}-${color.name}`;
    setCart(prev => {
      const existing = prev.find(item => item.key === itemKey);
      if (existing) {
        return prev.map(item =>
          item.key === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, {
        key: itemKey,
        productId: product.id,
        name: product.name,
        tagline: product.tagline,
        priceUSD: product.priceUSD,
        size,
        color,
        image: product.images[color.imgIndex || 0],
        quantity
      }];
    });
    showToast(`Added "${product.name}" (${size}) to bag`);
    setIsCartOpen(true);
  };

  const updateQuantity = (key, delta) => {
    setCart(prev => prev.map(item => {
      if (item.key === key) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(item => item.key !== key));
    showToast('Item removed from bag');
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const applyPromo = (code) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'VOID15' || upper === 'DROP01' || upper === 'PIYUSH') {
      setDiscountPercent(15);
      showToast('15% VIP discount applied!');
      return true;
    } else if (upper === 'VOID20') {
      setDiscountPercent(20);
      showToast('20% Black Tier discount applied!');
      return true;
    } else {
      showToast('Invalid promo code. Try "VOID15"');
      return false;
    }
  };

  const subtotalUSD = cart.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);
  const discountUSD = (subtotalUSD * discountPercent) / 100;
  const finalSubtotalUSD = subtotalUSD - discountUSD;
  const freeShippingThresholdUSD = 150;
  const shippingRemainingUSD = Math.max(0, freeShippingThresholdUSD - finalSubtotalUSD);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart,
      currency,
      setCurrency,
      formatPrice,
      isCartOpen,
      setIsCartOpen,
      selectedProduct,
      setSelectedProduct,
      isSizeGuideOpen,
      setIsSizeGuideOpen,
      isSearchOpen,
      setIsSearchOpen,
      searchQuery,
      setSearchQuery,
      wishlist,
      toggleWishlist,
      addToCart,
      updateQuantity,
      removeFromCart,
      toastMessage,
      showToast,
      subtotalUSD,
      discountUSD,
      finalSubtotalUSD,
      discountPercent,
      applyPromo,
      promoCode,
      setPromoCode,
      shippingRemainingUSD,
      freeShippingThresholdUSD,
      cartCount
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
