'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanyProducts } from '@/lib/supabase/products';
import { fetchCompanyOrders } from '@/lib/supabase/orders';
import { 
  ShoppingBag, 
  Package, 
  Euro, 
  Clock, 
  ArrowRight, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin_products'],
    queryFn: () => fetchCompanyProducts({ status: 'all' }),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin_orders'],
    queryFn: () => fetchCompanyOrders('all'),
  });

  // Calculate metrics
  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + Number(o.total_cost || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.quantity <= 5 && p.status === 'published');

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: 'Paid Revenue',
      value: `€${totalRevenue.toFixed(2)}`,
      icon: Euro,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/20 border-emerald-500/20',
    },
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      icon: ShoppingBag,
      color: 'text-wizard-purple-glow',
      bg: 'bg-purple-950/20 border-purple-500/20',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.length.toString(),
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-950/20 border-amber-500/20',
    },
    {
      label: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-950/20 border-blue-500/20',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white">
            Workspace Overview
          </h1>
          <p className="font-mono text-xs text-wizard-muted mt-1">
            Real-time catalog performance and customer orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-xl bg-white text-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-wizard-purple-glow hover:text-white transition"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-xl border border-white/20 bg-white/5 text-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl border p-5 backdrop-blur-md ${st.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-white/60">
                  {st.label}
                </span>
                <Icon className={`w-5 h-5 ${st.color}`} />
              </div>
              <p className="font-display text-2xl sm:text-3xl font-black text-white mt-3">
                {productsLoading || ordersLoading ? '...' : st.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Low stock alerts if any */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-mono text-xs uppercase font-bold text-amber-300">
              Low Inventory Warning ({lowStockProducts.length} items)
            </h4>
            <p className="text-xs text-white/70 mt-1">
              Some products have 5 or fewer items remaining in stock. Update quantities in the products manager.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="font-mono text-xs text-amber-300 hover:underline font-semibold flex items-center gap-1"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Recent Orders Preview */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0c14] overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-wizard-purple-glow" />
            <h3 className="font-display font-bold text-base uppercase text-white">
              Recent Customer Orders
            </h3>
          </div>
          <Link
            href="/admin/orders"
            className="font-mono text-xs text-wizard-purple-glow hover:text-white transition flex items-center gap-1"
          >
            <span>All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-wizard-muted">
            {ordersLoading ? 'Loading orders...' : 'No orders placed yet. Orders will appear here in real-time.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-white/40 uppercase">
                <tr>
                  <th className="p-4 pl-6">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 pl-6 font-bold text-white">
                      {ord.order_number}
                    </td>
                    <td className="p-4 text-white/80">
                      {ord.first_name} {ord.last_name}
                      <span className="block text-[11px] text-white/40">{ord.email}</span>
                    </td>
                    <td className="p-4 text-white/70">
                      {ord.city}, {ord.country}
                    </td>
                    <td className="p-4 font-bold text-white">
                      €{Number(ord.total_cost).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          ord.status === 'paid'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : ord.status === 'in_progress'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                            : ord.status === 'cancelled'
                            ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right text-white/40">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

