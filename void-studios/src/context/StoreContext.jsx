import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, CURRENCIES } from '../data/products';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('punk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });
  // DEFAULT CURRENCY: INR
  const [currency, setCurrency] = useState('INR');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('punk_cart', JSON.stringify(cart));
    } catch(e) {}
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const formatPrice = (inrAmount) => {
    const curr = CURRENCIES[currency] || CURRENCIES.INR;
    if (currency === 'INR') {
      return `₹${inrAmount.toLocaleString('en-IN')}`;
    }
    const converted = inrAmount * curr.rate;
    return `${curr.symbol}${converted.toFixed(currency === 'JPY' ? 0 : 2)}`;
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
        priceINR: product.priceINR,
        size,
        color,
        image: product.images[color.imgIndex || 0] || product.images[0],
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
    if (upper === 'PUNK10' || upper === 'DELHI' || upper === 'PIYUSH') {
      setDiscountPercent(10);
      showToast('10% Delhi VIP discount applied!');
      return true;
    } else if (upper === 'PUNK20') {
      setDiscountPercent(20);
      showToast('20% Drop 01 discount applied!');
      return true;
    } else {
      showToast('Invalid code. Try "PUNK10"');
      return false;
    }
  };

  const subtotalINR = cart.reduce((sum, item) => sum + (item.priceINR * item.quantity), 0);
  const discountINR = (subtotalINR * discountPercent) / 100;
  const finalSubtotalINR = subtotalINR - discountINR;
  const freeShippingThresholdINR = 2499;
  const shippingRemainingINR = Math.max(0, freeShippingThresholdINR - finalSubtotalINR);
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
      subtotalINR,
      discountINR,
      finalSubtotalINR,
      discountPercent,
      applyPromo,
      shippingRemainingINR,
      freeShippingThresholdINR,
      cartCount
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
