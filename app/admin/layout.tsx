'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentAdmin, logoutAdmin, AdminProfile } from '@/lib/supabase/auth';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Store, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login or register, do not show admin sidebar/shell
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register';

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const current = await getCurrentAdmin();
        if (!current) {
          router.push('/admin/login');
          return;
        }
        setAdmin(current);
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isAuthPage, router]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-wizard-purple-glow animate-pulse" />
          <span>Verifying Admin Workspace...</span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0d0c14] border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-wizard-purple-glow" />
          <span className="font-display font-black text-sm tracking-widest text-white">
            WIZARD TREES ADMIN
          </span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-white/80 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0910] border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-2.5 pb-6 border-b border-white/10 mb-6">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-wizard-purple-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base tracking-wider text-white">
                WIZARD TREES
              </h2>
              <p className="text-[10px] font-mono text-wizard-muted uppercase tracking-widest">
                Admin Console
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5 font-mono text-xs">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-purple-950/40 border border-purple-500/40 text-white font-bold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-wizard-purple-glow' : ''}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-2 text-white/50 text-[11px] truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{admin?.email}</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition"
          >
            <Store className="w-4 h-4 text-wizard-lime" />
            <span>View Live Store</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}

