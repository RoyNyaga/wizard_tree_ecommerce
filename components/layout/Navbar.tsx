'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase/client';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Check,
  LayoutDashboard
} from 'lucide-react';

const ANNOUNCEMENTS = [
  { text: 'Send To Us On Telegram', link: 'https://t.me' },
  { text: 'Worldwide Discreet Shipping Available', link: '/shop' },
  { text: 'Authentic Genetics & Streetwear Drops Live', link: '/shop' },
];

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'EUR €' },
  { code: 'USD', symbol: '$', label: 'USD $' },
  { code: 'GBP', symbol: '£', label: 'GBP £' },
  { code: 'CAD', symbol: '$', label: 'CAD $' },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart, isCartBumping } = useCart();

  // Hide storefront navbar on admin dashboard pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Admin auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdminAuth() {
      try {
        const admin = await getCurrentAdmin();
        if (mounted) {
          setIsAdminLoggedIn(!!admin);
        }
      } catch {
        if (mounted) {
          setIsAdminLoggedIn(false);
        }
      }
    }

    checkAdminAuth();

    // Listen for sign-in / sign-out events in real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const admin = await getCurrentAdmin();
          if (mounted) setIsAdminLoggedIn(!!admin);
        } catch {
          if (mounted) setIsAdminLoggedIn(false);
        }
      } else {
        if (mounted) setIsAdminLoggedIn(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Announcement ticker state
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  // Currency dropdown state
  const [currency, setCurrency] = useState('EUR');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  // Search overlay state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Next / Prev announcement handlers
  const handlePrevAnnouncement = () => {
    setAnnouncementIdx((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNextAnnouncement = () => {
    setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full shadow-lg">
        {/* ======================================================== */}
        {/* TOP ANNOUNCEMENT BAR (Dark Plum / Purple)              */}
        {/* ======================================================== */}
        <div className="bg-[#260940] border-b border-white/10 text-white text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left Chevron */}
            <button
              onClick={handlePrevAnnouncement}
              className="p-1 text-white/70 hover:text-white transition"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Announcement Text */}
            <div className="flex-1 text-center font-normal tracking-wide text-[13px] px-2">
              <a
                href={ANNOUNCEMENTS[announcementIdx].link}
                target={ANNOUNCEMENTS[announcementIdx].link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="hover:underline transition inline-block text-white"
              >
                {ANNOUNCEMENTS[announcementIdx].text}
              </a>
            </div>

            {/* Right Chevron */}
            <button
              onClick={handleNextAnnouncement}
              className="p-1 text-white/70 hover:text-white transition"
              aria-label="Next announcement"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN NAVIGATION BAR (Deep Royal Purple #360e5b)        */}
        {/* ======================================================== */}
        <div className="bg-[#360e5b] text-white py-3.5 px-4 sm:px-8 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* LEFT: Mobile Menu Button + Logo + Navigation Links */}
            <div className="flex items-center gap-6 sm:gap-8">
              {/* Mobile Hamburger Toggle (hidden on desktop) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-white/90 hover:text-white p-1"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Wizard Trees Brand Logo Image */}
              <Link href="/" className="flex items-center group py-0.5">
                <div className="relative flex items-center justify-center">
                  <Image
                    src="/images/brand/logo.png"
                    alt="Wizard Trees"
                    width={130}
                    height={40}
                    priority
                    className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-md"
                  />
                </div>
              </Link>

              {/* Desktop Links: Home, Catalog, Contact, Dashboard (if logged in) */}
              <nav className="hidden md:flex items-center gap-7 text-[15px] font-normal tracking-wide text-white">
                <Link
                  href="/"
                  className="hover:text-purple-200 transition-colors duration-150"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="hover:text-purple-200 transition-colors duration-150"
                >
                  Catalog
                </Link>
                <Link
                  href="/about"
                  className="hover:text-purple-200 transition-colors duration-150"
                >
                  Contact
                </Link>
                {isAdminLoggedIn && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-900/40 px-3.5 py-1 text-xs font-mono font-bold tracking-wider uppercase text-purple-200 hover:bg-white hover:text-black hover:border-white transition shadow-sm shadow-purple-950/50"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-wizard-lime" />
                    <span>Dashboard</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* RIGHT: Currency Dropdown + Search + Account + Shopping Bag */}
            <div className="flex items-center gap-5 sm:gap-6 text-white">
              {/* Currency Selector (EUR ⌵) */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-1 text-[13px] font-medium text-white hover:text-purple-200 transition-colors select-none py-1"
                  aria-label="Currency selector"
                >
                  <span>{currency}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isCurrencyOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsCurrencyOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-32 rounded-lg bg-[#260940] border border-white/10 shadow-2xl py-1.5 z-40 animate-fade-in text-xs">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCurrency(c.code);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/10 transition ${currency === c.code ? 'text-white font-bold' : 'text-white/70'
                            }`}
                        >
                          <span>{c.label}</span>
                          {currency === c.code && <Check className="w-3.5 h-3.5 text-purple-300" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-purple-200 transition-colors p-1"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* User Account / Admin Dashboard Link */}
              <Link
                href={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
                className="relative text-white hover:text-purple-200 transition-colors p-1"
                aria-label={isAdminLoggedIn ? "Admin Dashboard" : "Sign In"}
                title={isAdminLoggedIn ? "Admin Dashboard" : "Sign In"}
              >
                <User className="w-5 h-5 stroke-[1.8]" />
                {isAdminLoggedIn && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-wizard-lime ring-2 ring-[#360e5b]" />
                )}
              </Link>

              {/* Shopping Bag Icon with Cart Count */}
              <motion.button
                id="navbar-cart-btn"
                onClick={openCart}
                animate={isCartBumping ? { scale: [1, 1.25, 0.95, 1], rotate: [0, -8, 8, 0] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative text-white hover:text-purple-200 transition-colors p-1"
                aria-label="View bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#360e5b]"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* EXPANDABLE SEARCH OVERLAY                                 */}
        {/* ======================================================== */}
        {isSearchOpen && (
          <div className="bg-[#2a0b47] border-b border-white/10 py-4 px-4 sm:px-8 text-white animate-fade-in">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-white/50" />
              <input
                type="text"
                autoFocus
                placeholder="Search products, strains, merchandise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full bg-transparent border-none text-sm text-white placeholder-white/40 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-white/60 hover:text-white p-1"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* MOBILE DRAWER MENU                                       */}
      {/* ======================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-[#360e5b] text-white p-6 shadow-2xl flex flex-col justify-between z-10">
            <div>
              {/* Header with Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <Image
                    src="/images/brand/logo.png"
                    alt="Wizard Trees"
                    width={110}
                    height={34}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-white/70 hover:text-white"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <nav className="mt-8 flex flex-col space-y-5 text-lg font-medium">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-purple-200 transition"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-purple-200 transition"
                >
                  Catalog
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-purple-200 transition"
                >
                  Contact
                </Link>
                {isAdminLoggedIn && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-wizard-lime font-mono text-base font-bold uppercase tracking-wider pt-3 border-t border-white/10"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 space-y-4 text-sm">
              <div className="flex items-center justify-between text-white/70">
                <span>Currency</span>
                <span className="text-white font-bold">{currency}</span>
              </div>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center rounded-lg bg-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
              >
                Send To Us On Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
