'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { placeOrder, DbOrder } from '@/lib/supabase/orders';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  Lock,
  AlertCircle
} from 'lucide-react';

export function CartDrawer() {
  const queryClient = useQueryClient();
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

  // Drawer View Modes: 'cart' | 'checkout' | 'confirmation'
  const [viewMode, setViewMode] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<DbOrder | null>(null);

  // Customer Checkout Form
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    notes: '',
  });

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountRemaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shippingFee = amountRemaining === 0 || subtotal === 0 ? 0 : 12;
  const discountedSubtotal = subtotal * (1 - discount);
  const finalTotal = discountedSubtotal + shippingFee;

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'WIZARD10') {
      setDiscount(0.10);
      setPromoMessage('10% VIP Discount Applied!');
    } else if (code === 'RS11' || code === 'ZOAP') {
      setDiscount(0.15);
      setPromoMessage('15% Strain Lover Discount Applied!');
    } else {
      setPromoMessage('Invalid promo code. Try "WIZARD10"');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setOrderError(null);

    try {
      const orderPayload = {
        first_name: shippingForm.firstName,
        last_name: shippingForm.lastName,
        email: shippingForm.email,
        phone_number: shippingForm.phone || undefined,
        country: shippingForm.country,
        city: shippingForm.city,
        state: shippingForm.state,
        postal_code: shippingForm.postalCode,
        address: shippingForm.address,
        total_cost: Number(finalTotal.toFixed(2)),
        currency: 'EUR',
        notes: shippingForm.notes || undefined,
        items: items.map((item) => ({
          product_id: item.product.id && !item.product.id.startsWith('wt-') ? item.product.id : null,
          product_name: `${item.product.name}${item.selectedWeight ? ` (${item.selectedWeight})` : ''}${item.selectedSize ? ` (${item.selectedSize})` : ''}`,
          product_image: item.product.image || null,
          unit_price: item.price,
          quantity: item.quantity,
          total_price: Number((item.price * item.quantity).toFixed(2)),
        })),
      };

      const createdOrder = await placeOrder(orderPayload);
      
      // Invalidate admin queries so live orders update in real-time
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });

      setPlacedOrder(createdOrder);
      setViewMode('confirmation');
      clearCart();
    } catch (err: any) {
      console.error('Order placement error:', err);
      // If error occurs (e.g. database migration not yet run or network issue), provide graceful fallback
      setOrderError(err.message || 'Failed to place order with backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setViewMode('cart');
    setPlacedOrder(null);
    setOrderError(null);
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={resetAndClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#0b0a12] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* ======================================================== */}
          {/* HEADER                                                   */}
          {/* ======================================================== */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {viewMode === 'checkout' && (
                <button
                  onClick={() => setViewMode('cart')}
                  className="p-1 mr-1 text-white/60 hover:text-white transition"
                  aria-label="Back to bag"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <Sparkles className="w-4 h-4 text-wizard-purple-glow" />
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                {viewMode === 'confirmation'
                  ? 'ORDER CONFIRMATION'
                  : viewMode === 'checkout'
                  ? 'SECURE CHECKOUT'
                  : `YOUR BAG (${totalItems})`}
              </h2>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 text-wizard-muted hover:text-white transition rounded-full hover:bg-white/5"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ======================================================== */}
          {/* VIEW 1: ORDER CONFIRMATION VIEW                          */}
          {/* ======================================================== */}
          {viewMode === 'confirmation' && placedOrder && (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-5 overflow-y-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black uppercase text-white">
                  ORDER RESERVED!
                </h3>
                <p className="font-mono text-xs text-wizard-lime mt-1">
                  Order ID: {placedOrder.order_number}
                </p>
              </div>

              <p className="text-xs text-wizard-muted leading-relaxed max-w-sm">
                Thank you, <strong className="text-white">{placedOrder.first_name}</strong>. Your order is registered and pending fulfillment. Our team in Los Angeles will prepare your items for discrete dispatch.
              </p>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-left w-full space-y-2">
                <div className="flex justify-between text-wizard-muted">
                  <span>Customer Email:</span>
                  <span className="text-white">{placedOrder.email}</span>
                </div>
                <div className="flex justify-between text-wizard-muted">
                  <span>Shipping Destination:</span>
                  <span className="text-white">{placedOrder.city}, {placedOrder.country}</span>
                </div>
                <div className="flex justify-between text-wizard-muted">
                  <span>Total Paid / Due:</span>
                  <span className="text-wizard-purple-glow font-bold">€{Number(placedOrder.total_cost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-wizard-muted pt-2 border-t border-white/5">
                  <span>Admin Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">{placedOrder.status}</span>
                </div>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full rounded-xl bg-white py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition"
              >
                Continue Exploring
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: CHECKOUT SHIPPING FORM                          */}
          {/* ======================================================== */}
          {viewMode === 'checkout' && (
            <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-wizard-muted border-b border-white/10 pb-3">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit Encrypted Checkout • Free Discreet Packaging</span>
                </div>

                {orderError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-xs font-mono text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{orderError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <label className="block text-[11px] uppercase text-white/70 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={shippingForm.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase text-white/70 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={shippingForm.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <label className="block text-[11px] uppercase text-white/70 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={shippingForm.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase text-white/70 mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                    />
                  </div>
                </div>

                <div className="font-mono text-xs">
                  <label className="block text-[11px] uppercase text-white/70 mb-1">Shipping Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shippingForm.address}
                    onChange={handleInputChange}
                    placeholder="124 Melrose Ave, Suite 400"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>
                    <label className="block text-[11px] uppercase text-white/70 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      placeholder="Los Angeles"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase text-white/70 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={shippingForm.state}
                      onChange={handleInputChange}
                      placeholder="CA"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase text-white/70 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={shippingForm.postalCode}
                      onChange={handleInputChange}
                      placeholder="90038"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                    />
                  </div>
                </div>

                <div className="font-mono text-xs">
                  <label className="block text-[11px] uppercase text-white/70 mb-1">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={shippingForm.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                  />
                </div>

                <div className="font-mono text-xs">
                  <label className="block text-[11px] uppercase text-white/70 mb-1">Delivery Notes (Optional)</label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={shippingForm.notes}
                    onChange={handleInputChange}
                    placeholder="Gate code, discreet packaging preferences, or instructions..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
                  />
                </div>
              </div>

              {/* Bottom Summary & Place Order */}
              <div className="p-6 border-t border-white/10 bg-[#08080c] space-y-4">
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-wizard-muted">
                    <span>Items ({totalItems})</span>
                    <span className="text-white">€{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-wizard-lime">
                      <span>Promo Discount</span>
                      <span>-€{(subtotal * discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-wizard-muted">
                    <span>Discreet Shipping</span>
                    <span className="text-white">{shippingFee === 0 ? 'FREE' : `€${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                    <span>Total Cost</span>
                    <span className="text-emerald-400 font-mono">€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>CONFIRMING WITH BACKEND...</span>
                  ) : (
                    <>
                      <span>CONFIRM & PLACE ORDER (€{finalTotal.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: CART ITEMS LIST VIEW                             */}
          {/* ======================================================== */}
          {viewMode === 'cart' && (
            <>
              {/* Free Shipping Meter */}
              {items.length > 0 && (
                <div className="bg-white/[0.02] border-b border-white/5 px-6 py-3.5 text-xs font-mono">
                  {amountRemaining > 0 ? (
                    <p className="text-wizard-muted">
                      Add <span className="text-white font-bold">€{amountRemaining.toFixed(2)}</span> more for Free Priority Shipping
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
                            €{(item.price * item.quantity).toFixed(2)}
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
                      <span className="text-white">€{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-wizard-lime">
                        <span>VIP Discount ({(discount * 100).toFixed(0)}%)</span>
                        <span>-€{(subtotal * discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-wizard-muted">
                      <span>Estimated Shipping</span>
                      <span className="text-white">
                        {amountRemaining === 0 ? 'FREE' : '€12.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-wizard-purple-glow font-mono font-bold">
                        €{finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Proceed to Checkout Button */}
                  <button
                    onClick={() => setViewMode('checkout')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
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
