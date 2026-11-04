'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, options?: { size?: string; weight?: string; quantity?: number }) => void;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(true); // Default to true on SSR to avoid hydration flash, will check in useEffect
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const addToCart = (
    product: Product,
    options?: { size?: string; weight?: string; quantity?: number }
  ) => {
    const qty = options?.quantity || 1;
    const size = options?.size;
    const weight = options?.weight;

    const variantKey = size || weight || 'default';
    const uniqueId = `${product.id}-${variantKey}`;

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
    setIsCartOpen(true);
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
      }}
    >
      {children}
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

