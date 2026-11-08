'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { FlyToCartOverlay, FlyingItem } from '@/components/shop/FlyToCartOverlay';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    options?: { size?: string; weight?: string; quantity?: number },
    startCoord?: { x: number; y: number }
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  isAgeVerified: boolean;
  verifyAge: (remember: boolean) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  isCartBumping: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(true); // Default true for SSR
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [flyingItem, setFlyingItem] = useState<FlyingItem | null>(null);
  const [isCartBumping, setIsCartBumping] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedAge = localStorage.getItem('wt_age_verified');
      if (savedAge !== 'true') {
        setIsAgeVerified(false);
      }

      const savedCart = localStorage.getItem('wt_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      // localStorage may fail in restricted/private modes
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wt_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const verifyAge = (remember: boolean) => {
    setIsAgeVerified(true);
    if (remember) {
      try {
        localStorage.setItem('wt_age_verified', 'true');
      } catch {
        // ignore
      }
    }
  };

  const triggerFlyAnimation = (
    image: string,
    startCoord?: { x: number; y: number }
  ) => {
    if (typeof window === 'undefined') return;

    // Locate the navbar cart button
    const cartButton = document.getElementById('navbar-cart-btn');
    const targetRect = cartButton?.getBoundingClientRect();

    const startX = startCoord?.x ?? (window.innerWidth / 2);
    const startY = startCoord?.y ?? (window.innerHeight / 2);

    const targetX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 60;
    const targetY = targetRect ? targetRect.top + targetRect.height / 2 : 50;

    setFlyingItem({
      id: Math.random().toString(),
      image,
      startX,
      startY,
      targetX,
      targetY,
    });
  };

  const handleFlyComplete = () => {
    setFlyingItem(null);
    setIsCartBumping(true);
    setTimeout(() => setIsCartBumping(false), 500);
  };

  const addToCart = (
    product: Product,
    options?: { size?: string; weight?: string; quantity?: number },
    startCoord?: { x: number; y: number }
  ) => {
    const qty = options?.quantity || 1;
    const size = options?.size;
    const weight = options?.weight;

    const variantKey = size || weight || 'default';
    const uniqueId = `${product.id}-${variantKey}`;

    // Trigger Fly-to-Cart Framer Motion animation
    triggerFlyAnimation(product.image, startCoord);

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === uniqueId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === uniqueId ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: uniqueId,
            product,
            quantity: qty,
            selectedSize: size,
            selectedWeight: weight,
            price: product.price,
          },
        ];
      }
    });

    showToast(`Added ${product.name} to Bag`);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        isAgeVerified,
        verifyAge,
        toastMessage,
        showToast,
        isCartBumping,
      }}
    >
      {children}
      <FlyToCartOverlay flyingItem={flyingItem} onComplete={handleFlyComplete} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
