'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    clearCart,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountRemaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'WIZARD10') {
      setDiscount(0.10);
      setPromoMessage('10% VIP Discount Applied!');
    } else if (promoCode.toUpperCase() === 'RS11' || promoCode.toUpperCase() === 'ZOAP') {
      setDiscount(0.15);
      setPromoMessage('15% Strain Lover Discount Applied!');
    } else {
      setPromoMessage('Invalid promo code. Try "WIZARD10"');
    }
  };

  const finalTotal = subtotal * (1 - discount);

  const handleSimulatedCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      clearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b0a12] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-wizard-purple-glow" />
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                YOUR BAG ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-wizard-muted hover:text-white transition rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Checkout Completed View */}
          {checkoutComplete ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="font-display text-2xl font-black uppercase text-white">
                ORDER RESERVED
              </h3>
              <p className="text-sm text-wizard-muted leading-relaxed">
                Thank you for your order. A confirmation and pickup/shipping tracking link has been simulated for your session.
              </p>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs font-mono text-left w-full space-y-1">
                <div className="flex justify-between text-wizard-muted">
                  <span>Simulated Order ID:</span>
                  <span className="text-white">#WT-2026-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between text-wizard-muted">
                  <span>Status:</span>
                  <span className="text-emerald-400">Dispatched to Fulfillment</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setCheckoutComplete(false);
                  closeCart();
                }}
                className="w-full rounded-xl bg-white py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition"
              >
                Continue Exploring
              </button>
            </div>
          ) : (
            <>
              {/* Free Shipping Meter */}
              {items.length > 0 && (
                <div className="bg-white/[0.02] border-b border-white/5 px-6 py-3.5 text-xs font-mono">
                  {amountRemaining > 0 ? (
                    <p className="text-wizard-muted">
                      Add <span className="text-white font-bold">${amountRemaining.toFixed(2)}</span> more for Free Priority Shipping
                    </p>
                  ) : (
                    <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      You qualified for Free Priority Shipping!
                    </p>
                  )}
                  <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-wizard-purple to-wizard-lime transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-white/5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-mono uppercase tracking-widest text-white/60">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-wizard-muted max-w-xs">
                      Discover our legendary strains, limited seed packs, and custom-milled streetwear.
                    </p>
                    <Link
                      href="/shop"
                      onClick={closeCart}
                      className="mt-2 rounded-xl bg-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition"
                    >
                      Shop The Catalog
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-white/40 hover:text-red-400 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variant metadata */}
                        <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-wizard-muted">
                          {item.selectedWeight && <span>Weight: {item.selectedWeight}</span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          {item.product.thc && (
                            <span className="text-wizard-purple-glow">THC: {item.product.thc}</span>
                          )}
                        </div>

                        {/* Quantity & Price */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-white/15 rounded-lg bg-white/5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-white/70 hover:text-white transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 text-white/70 hover:text-white transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-mono text-sm font-bold text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-[#08080c] space-y-4">
                  {/* Promo Code Input */}
                  <form onSubmit={applyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. WIZARD10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow uppercase"
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-white hover:text-black transition uppercase"
                    >
                      Apply
                    </button>
                  </form>
                  {promoMessage && (
                    <p className="text-[11px] font-mono text-wizard-lime">{promoMessage}</p>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-wizard-muted">
                      <span>Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-wizard-lime">
                        <span>VIP Discount ({(discount * 100).toFixed(0)}%)</span>
                        <span>-${(subtotal * discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-wizard-muted">
                      <span>Estimated Shipping</span>
                      <span className="text-white">
                        {amountRemaining === 0 ? 'FREE' : '$12.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-wizard-purple-glow">
                        ${(finalTotal + (amountRemaining === 0 ? 0 : 12)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    disabled={isCheckingOut}
                    onClick={handleSimulatedCheckout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <span>PROCESSING RESERVATION...</span>
                    ) : (
                      <>
                        <span>PROCEED TO CHECKOUT</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/40">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-Bit Encrypted Secure Checkout</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

