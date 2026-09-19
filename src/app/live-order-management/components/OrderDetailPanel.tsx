'use client';

import React, { useState } from 'react';
import { X, RefreshCw, AlertTriangle, CheckCircle2, User, Mail, Phone, FileText, Loader2 } from 'lucide-react';
import { Order } from './ordersData';
import { toast } from 'sonner';

interface Props {
  order: Order;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  PAID: 'text-secondary',
  EPOS_ACCEPTED: 'text-secondary',
  SENT_TO_KITCHEN: 'text-secondary',
  COMPLETED: 'text-admin-muted',
  PAYMENT_FAILED: 'text-red-400',
  EPOS_FAILED: 'text-red-400',
  SENT_TO_EPOS: 'text-blue-400',
  PREPARING: 'text-blue-400',
  READY: 'text-purple-400',
  PAYMENT_PENDING: 'text-amber-400',
  DRAFT: 'text-admin-muted',
};

export default function OrderDetailPanel({ order, onClose }: Props) {
  const [retrying, setRetrying] = useState(false);
  const [refunding, setRefunding] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    // Backend integration: POST /api/epos/orders/:id/retry
    await new Promise((r) => setTimeout(r, 2000));
    setRetrying(false);
    toast.success(`EPOS retry submitted for ${order.orderNumber}`);
  };

  const handleRefund = async () => {
    if (!confirm(`Refund £${(order.total / 100).toFixed(2)} for ${order.orderNumber}? This will process through Stripe.`)) return;
    setRefunding(true);
    // Backend integration: POST /api/refunds with { orderId, stripePaymentId, amount, reason }
    await new Promise((r) => setTimeout(r, 2000));
    setRefunding(false);
    toast.success('Refund initiated via Stripe. Allow 5–10 business days.');
  };

  return (
    <div className="w-96 flex-shrink-0 border-l border-admin-border bg-admin-card overflow-y-auto flex flex-col" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="sticky top-0 bg-admin-card border-b border-admin-border px-5 py-4 flex items-center justify-between z-10">
        <div>
          <h3 className="text-admin-foreground font-bold text-sm">Order Details</h3>
          <p className="text-xs font-mono text-admin-muted mt-0.5">{order.orderNumber}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-admin-muted hover:text-admin-foreground flex items-center justify-center transition-colors" aria-label="Close panel">
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-5 flex-1">
        {/* Status overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/4 rounded-xl p-3">
            <p className="text-xs text-admin-muted mb-1">Table</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">{order.table}</div>
              <span className="text-admin-foreground font-bold text-sm">Table {order.table}</span>
            </div>
          </div>
          <div className="bg-white/4 rounded-xl p-3">
            <p className="text-xs text-admin-muted mb-1">Total</p>
            <p className="text-admin-foreground font-bold text-lg font-mono-nums">£{(order.total / 100).toFixed(2)}</p>
          </div>
          <div className="bg-white/4 rounded-xl p-3">
            <p className="text-xs text-admin-muted mb-1">Payment</p>
            <p className={`font-bold text-sm ${order.paymentStatus === 'PAID' ? 'text-secondary' : 'text-red-400'}`}>{order.paymentStatus}</p>
          </div>
          <div className="bg-white/4 rounded-xl p-3">
            <p className="text-xs text-admin-muted mb-1">EPOS</p>
            <div className="flex items-center gap-1.5">
              {order.eposStatus === 'FAILED' && <AlertTriangle size={13} className="text-red-400" />}
              <p className={`font-bold text-sm ${order.eposStatus === 'ACCEPTED' ? 'text-secondary' : order.eposStatus === 'FAILED' ? 'text-red-400' : 'text-amber-400'}`}>
                {order.eposStatus}
              </p>
            </div>
          </div>
        </div>

        {/* EPOS failure action */}
        {order.eposStatus === 'FAILED' && (
          <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold text-sm">EPOS submission failed</p>
                <p className="text-admin-muted text-xs mt-0.5">
                  {order.eposRetries} attempt{order.eposRetries !== 1 ? 's' : ''} · Payment is PAID — do not charge customer again
                </p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="w-full flex items-center justify-center gap-2 bg-red-400/10 hover:bg-red-400/20 text-red-400 font-semibold text-sm rounded-xl py-2.5 transition-colors disabled:opacity-60"
            >
              {retrying ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
              {retrying ? 'Retrying EPOS...' : 'Retry EPOS Submission'}
            </button>
          </div>
        )}

        {/* Customer info */}
        <div>
          <h4 className="text-xs font-semibold text-admin-muted uppercase tracking-wide mb-3">Customer</h4>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <User size={14} className="text-admin-muted flex-shrink-0" />
              <span className="text-sm text-admin-foreground">{order.customer}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={14} className="text-admin-muted flex-shrink-0" />
              <span className="text-sm text-admin-foreground break-all">{order.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-admin-muted flex-shrink-0" />
              <span className="text-sm text-admin-foreground font-mono">{order.phone}</span>
            </div>
            {order.specialInstructions && (
              <div className="flex items-start gap-3">
                <FileText size={14} className="text-admin-muted flex-shrink-0 mt-0.5" />
                <span className="text-sm text-amber-400 italic">"{order.specialInstructions}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Order items */}
        <div>
          <h4 className="text-xs font-semibold text-admin-muted uppercase tracking-wide mb-3">Items Ordered</h4>
          <div className="space-y-2.5">
            {order.items.map((item) => (
              <div key={`detail-item-${item.id}`} className="bg-white/4 rounded-xl px-3 py-2.5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-admin-foreground font-semibold text-sm">{item.quantity}× {item.name}</p>
                    {item.modifiers.length > 0 && (
                      <p className="text-xs text-admin-muted mt-0.5">{item.modifiers.join(' · ')}</p>
                    )}
                  </div>
                  <span className="text-admin-foreground font-bold text-sm font-mono-nums ml-3">
                    £{((item.unitPrice * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-3 border-t border-admin-border pt-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-admin-muted">Subtotal</span>
              <span className="text-admin-foreground font-mono-nums">£{(order.subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-admin-muted">VAT (20%)</span>
              <span className="text-admin-foreground font-mono-nums">£{(order.vat / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-admin-border pt-2">
              <span className="text-admin-foreground">Total</span>
              <span className="text-admin-foreground font-mono-nums">£{(order.total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment info */}
        {order.stripePaymentId && (
          <div>
            <h4 className="text-xs font-semibold text-admin-muted uppercase tracking-wide mb-2">Payment Reference</h4>
            <p className="text-xs font-mono text-admin-foreground bg-white/4 rounded-xl px-3 py-2">{order.stripePaymentId}</p>
          </div>
        )}

        {/* Status timeline */}
        <div>
          <h4 className="text-xs font-semibold text-admin-muted uppercase tracking-wide mb-3">Status Timeline</h4>
          <div className="space-y-0">
            {order.statusHistory.map((entry, idx) => (
              <div key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white ${STATUS_COLORS[entry.status] ? 'bg-white/10' : 'bg-white/5'}`}>
                    {entry.status.includes('FAILED') ? (
                      <AlertTriangle size={10} className="text-red-400" />
                    ) : (
                      <CheckCircle2 size={10} className={STATUS_COLORS[entry.status] || 'text-admin-muted'} />
                    )}
                  </div>
                  {idx < order.statusHistory.length - 1 && (
                    <div className="w-px h-6 bg-admin-border mt-1" />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold ${STATUS_COLORS[entry.status] || 'text-admin-muted'}`}>{entry.status}</p>
                    <span className="text-xs text-admin-muted font-mono-nums flex-shrink-0">{entry.timestamp}</span>
                  </div>
                  {entry.note && <p className="text-xs text-admin-muted/70 mt-0.5">{entry.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund action */}
        {order.paymentStatus === 'PAID' && order.stripePaymentId && (
          <div className="border-t border-admin-border pt-4">
            {order.eposStatus === 'ACCEPTED' && (
              <div className="flex items-start gap-2 bg-amber-400/8 border border-amber-400/20 rounded-xl px-3 py-2.5 mb-3">
                <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-400">This order has already been sent to the EPOS and kitchen. Refunding will not automatically cancel preparation.</p>
              </div>
            )}
            <button
              onClick={handleRefund}
              disabled={refunding}
              className="w-full flex items-center justify-center gap-2 bg-purple-400/10 hover:bg-purple-400/20 text-purple-400 font-semibold text-sm rounded-xl py-2.5 transition-colors disabled:opacity-60"
            >
              {refunding ? <Loader2 size={15} className="animate-spin" /> : null}
              {refunding ? 'Processing refund...' : `Refund £${(order.total / 100).toFixed(2)} via Stripe`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}