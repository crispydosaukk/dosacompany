'use client';

import React, { useState } from 'react';
import { ArrowUpDown, RefreshCw, Eye, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from './ordersData';
import { toast } from 'sonner';

interface Props {
  orders: Order[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSelectOrder: (order: Order) => void;
  selectedOrder: Order | null;
}

const PAYMENT_BADGE: Record<string, string> = {
  PAID: 'bg-secondary/10 text-secondary',
  PAYMENT_PENDING: 'bg-amber-400/10 text-amber-400',
  PAYMENT_FAILED: 'bg-red-400/10 text-red-400',
  REFUNDED: 'bg-purple-400/10 text-purple-400',
};

const EPOS_BADGE: Record<string, string> = {
  ACCEPTED: 'bg-secondary/10 text-secondary',
  PENDING: 'bg-amber-400/10 text-amber-400',
  FAILED: 'bg-red-400/10 text-red-400',
  SENDING: 'bg-blue-400/10 text-blue-400',
  NOT_SENT: 'bg-admin-border text-admin-muted',
};

const KITCHEN_BADGE: Record<string, string> = {
  PREPARING: 'bg-blue-400/10 text-blue-400',
  READY: 'bg-purple-400/10 text-purple-400',
  SENT: 'bg-secondary/10 text-secondary',
  PENDING: 'bg-admin-border text-admin-muted',
  COMPLETED: 'bg-admin-border text-admin-muted',
};

const STATUS_BADGE: Record<string, string> = {
  COMPLETED: 'bg-admin-border text-admin-muted',
  PREPARING: 'bg-blue-400/10 text-blue-400',
  READY: 'bg-purple-400/10 text-purple-400',
  SENT_TO_KITCHEN: 'bg-secondary/10 text-secondary',
  EPOS_ACCEPTED: 'bg-secondary/10 text-secondary',
  SENT_TO_EPOS: 'bg-blue-400/10 text-blue-400',
  PAID: 'bg-secondary/10 text-secondary',
  PAYMENT_FAILED: 'bg-red-400/10 text-red-400',
  EPOS_FAILED: 'bg-red-400/10 text-red-400',
  CANCELLED: 'bg-admin-border text-admin-muted',
  REFUNDED: 'bg-purple-400/10 text-purple-400',
};

const PAGE_SIZE = 10;

export default function OrdersTable({ orders, selectedIds, onToggleSelect, onToggleSelectAll, onSelectOrder, selectedOrder }: Props) {
  const [page, setPage] = useState(1);
  const [retrying, setRetrying] = useState<Set<string>>(new Set());

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pageOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRetryEpos = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setRetrying((prev) => new Set(prev).add(order.id));
    // Backend integration: POST /api/epos/orders/:id/retry
    await new Promise((r) => setTimeout(r, 1800));
    setRetrying((prev) => { const next = new Set(prev); next.delete(order.id); return next; });
    toast.success(`EPOS retry sent for ${order.orderNumber}`);
  };

  const allSelected = pageOrders.length > 0 && pageOrders.every((o) => selectedIds.has(o.id));

  return (
    <div>
      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 mb-3 animate-fade-in">
          <span className="text-primary font-semibold text-sm">{selectedIds.size} selected</span>
          <button className="text-sm text-admin-foreground hover:text-primary font-medium transition-colors">Mark Completed</button>
          <button className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">Cancel Orders</button>
          <button onClick={() => { selectedIds.forEach(() => {}); }} className="ml-auto text-admin-muted hover:text-admin-foreground text-sm">
            Clear selection
          </button>
        </div>
      )}

      <div className="admin-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 rounded accent-primary"
                    aria-label="Select all"
                  />
                </th>
                {[
                  { label: 'Order #', key: 'orderNumber' },
                  { label: 'Time', key: 'time' },
                  { label: 'Table', key: 'table' },
                  { label: 'Customer', key: 'customer' },
                  { label: 'Items', key: 'items' },
                  { label: 'Subtotal', key: 'subtotal' },
                  { label: 'VAT', key: 'vat' },
                  { label: 'Total', key: 'total' },
                  { label: 'Payment', key: 'paymentStatus' },
                  { label: 'EPOS', key: 'eposStatus' },
                  { label: 'Kitchen', key: 'kitchenStatus' },
                  { label: 'Actions', key: '' },
                ].map((col) => (
                  <th key={`th-${col.label}`} className="px-4 py-3 text-left text-xs font-semibold text-admin-muted uppercase tracking-wide whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.key && col.key !== '' && (
                        <ArrowUpDown size={11} className="text-admin-muted/40" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageOrders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-16 text-center">
                    <div className="text-3xl mb-3">📋</div>
                    <p className="text-admin-foreground font-semibold">No orders found</p>
                    <p className="text-admin-muted text-sm mt-1">Try adjusting your filters or search query</p>
                  </td>
                </tr>
              ) : (
                pageOrders.map((order) => {
                  const isSelected = selectedIds.has(order.id);
                  const isActive = selectedOrder?.id === order.id;
                  const isRetrying = retrying.has(order.id);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className={`border-b border-admin-border/40 transition-colors cursor-pointer ${
                        isActive ? 'bg-primary/8 border-l-2 border-l-primary' : 'hover:bg-white/3'
                      } ${isSelected ? 'bg-white/5' : ''}`}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(order.id)}
                          className="w-4 h-4 rounded accent-primary"
                          aria-label={`Select order ${order.orderNumber}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {order.eposStatus === 'FAILED' && (
                            <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
                          )}
                          <span className="text-xs font-mono text-admin-foreground whitespace-nowrap">{order.orderNumber}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono-nums text-admin-muted">{order.time}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">{order.table}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-admin-foreground font-medium whitespace-nowrap">{order.customer}</p>
                          <p className="text-xs text-admin-muted font-mono">{order.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-admin-muted font-mono-nums">{order.items.reduce((s, i) => s + i.quantity, 0)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-admin-muted font-mono-nums">£{(order.subtotal / 100).toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-admin-muted font-mono-nums">£{(order.vat / 100).toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-admin-foreground font-mono-nums">£{(order.total / 100).toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${PAYMENT_BADGE[order.paymentStatus] || ''}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${EPOS_BADGE[order.eposStatus] || ''}`}>
                            {order.eposStatus}
                          </span>
                          {order.eposStatus === 'FAILED' && (
                            <button
                              onClick={(e) => handleRetryEpos(e, order)}
                              disabled={isRetrying}
                              className="w-6 h-6 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 flex items-center justify-center transition-colors disabled:opacity-50"
                              aria-label="Retry EPOS"
                              title="Retry EPOS submission"
                            >
                              <RefreshCw size={12} className={isRetrying ? 'animate-spin' : ''} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${KITCHEN_BADGE[order.kitchenStatus] || ''}`}>
                          {order.kitchenStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectOrder(order); }}
                          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-admin-muted hover:text-admin-foreground flex items-center justify-center transition-colors"
                          aria-label="View order details"
                          title="View order details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-admin-border">
          <p className="text-xs text-admin-muted">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, orders.length)}–{Math.min(page * PAGE_SIZE, orders.length)} of {orders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg bg-admin-card border border-admin-border text-admin-muted hover:text-admin-foreground hover:border-primary disabled:opacity-40 flex items-center justify-center transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={`page-btn-${p}`}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  p === page
                    ? 'bg-primary text-white' :'bg-admin-card border border-admin-border text-admin-muted hover:text-admin-foreground hover:border-primary'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg bg-admin-card border border-admin-border text-admin-muted hover:text-admin-foreground hover:border-primary disabled:opacity-40 flex items-center justify-center transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}