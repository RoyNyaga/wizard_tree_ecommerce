'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCompanyOrders, updateOrderStatus, DbOrder } from '@/lib/supabase/orders';
import {
  ShoppingBag,
  Search,
  X,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'paid', label: 'Paid' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin_orders', statusFilter],
    queryFn: () => fetchCompanyOrders(statusFilter),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => updateOrderStatus(id, status),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
      setSelectedOrder(updatedOrder);
    },
  });

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.first_name.toLowerCase().includes(q) ||
      o.last_name.toLowerCase().includes(q) ||
      o.country.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white">
            Orders Management
          </h1>
          <p className="font-mono text-xs text-wizard-muted mt-1">
            Track customer shipments, payment receipts, and dispatch fulfillment
          </p>
        </div>
      </div>

      {/* Toolbar: Status filter tabs and search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition ${statusFilter === f.id
                  ? 'bg-purple-950/60 border border-purple-500/50 text-white font-bold'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search order # or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 font-mono text-xs text-white placeholder-white/30 focus:outline-none focus:border-wizard-purple-glow"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0c14] overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-wizard-muted">
            Loading orders from Supabase...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-wizard-muted">
            No orders found matching this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-white/40 uppercase">
                <tr>
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 pl-6 font-bold text-white">
                      {ord.order_number}
                    </td>
                    <td className="p-4 text-white/90">
                      {ord.first_name} {ord.last_name}
                      <span className="block text-[11px] text-white/40">{ord.email}</span>
                    </td>
                    <td className="p-4 text-white/70">
                      {ord.city}, {ord.country}
                    </td>
                    <td className="p-4 text-white/60">
                      {ord.items?.length || 1} item(s)
                    </td>
                    <td className="p-4 font-bold text-white">
                      ${Number(ord.total_cost).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${ord.status === 'paid'
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
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white hover:text-black font-mono text-xs transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ORDER DETAILS INSPECTION DRAWER                          */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 flex w-full max-w-full justify-end pl-0 sm:pl-10 pointer-events-none">
            <div className="w-full sm:w-[500px] max-w-full bg-[#0c0b14] border-l border-white/10 shadow-2xl p-5 sm:p-8 flex flex-col justify-between pointer-events-auto h-full overflow-y-auto">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="font-display font-black text-xl text-white">
                      {selectedOrder.order_number}
                    </h2>
                    <p className="font-mono text-xs text-wizard-muted">
                      Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-white/60 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status modifier buttons */}
                <div>
                  <label className="block text-xs font-mono uppercase text-white/50 mb-2">
                    Update Order Status
                  </label>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      onClick={() =>
                        statusMutation.mutate({ id: selectedOrder.id, status: 'pending' })
                      }
                      className={`py-2 px-3 rounded-lg border transition ${selectedOrder.status === 'pending'
                          ? 'border-amber-400 bg-amber-950/40 text-amber-300 font-bold'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                        }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() =>
                        statusMutation.mutate({ id: selectedOrder.id, status: 'in_progress' })
                      }
                      className={`py-2 px-3 rounded-lg border transition ${selectedOrder.status === 'in_progress'
                          ? 'border-blue-400 bg-blue-950/40 text-blue-300 font-bold'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                        }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() =>
                        statusMutation.mutate({ id: selectedOrder.id, status: 'paid' })
                      }
                      className={`py-2 px-3 rounded-lg border transition ${selectedOrder.status === 'paid'
                          ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 font-bold'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                        }`}
                    >
                      Paid
                    </button>
                    <button
                      onClick={() =>
                        statusMutation.mutate({ id: selectedOrder.id, status: 'cancelled' })
                      }
                      className={`py-2 px-3 rounded-lg border transition ${selectedOrder.status === 'cancelled'
                          ? 'border-red-400 bg-red-950/40 text-red-300 font-bold'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                        }`}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3 font-mono text-xs">
                  <h3 className="font-bold text-white uppercase text-xs">Customer Information</h3>
                  <div className="space-y-1.5 text-white/80">
                    <p className="font-bold text-white">
                      {selectedOrder.first_name} {selectedOrder.last_name}
                    </p>
                    <p className="flex items-center gap-2 text-white/60">
                      <Mail className="w-3.5 h-3.5 text-wizard-purple-glow" />
                      <span>{selectedOrder.email}</span>
                    </p>
                    {selectedOrder.phone_number && (
                      <p className="flex items-center gap-2 text-white/60">
                        <Phone className="w-3.5 h-3.5 text-wizard-purple-glow" />
                        <span>{selectedOrder.phone_number}</span>
                      </p>
                    )}
                    <p className="flex items-start gap-2 text-white/60 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-wizard-purple-glow flex-shrink-0 mt-0.5" />
                      <span>
                        {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state}{' '}
                        {selectedOrder.postal_code}, {selectedOrder.country}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Items Purchased */}
                <div className="space-y-3 font-mono text-xs">
                  <h3 className="font-bold text-white uppercase">Order Items</h3>
                  <div className="divide-y divide-white/5 border border-white/10 rounded-xl bg-white/[0.02] p-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {item.product_image && (
                              <div className="relative w-10 h-10 rounded border border-white/10 overflow-hidden bg-black flex-shrink-0">
                                <Image src={item.product_image} alt="" fill className="object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white">{item.product_name}</p>
                              <p className="text-[11px] text-white/40">
                                Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-white">
                            ${Number(item.total_price).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/40 py-2 text-center">1 item reserved</p>
                    )}
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="pt-2 border-t border-white/10 font-mono text-xs flex justify-between items-center">
                  <span className="text-white/60 uppercase">Total Order Value</span>
                  <span className="font-display font-black text-xl text-emerald-400">
                    ${Number(selectedOrder.total_cost).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white hover:text-black font-mono text-xs font-bold uppercase transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

