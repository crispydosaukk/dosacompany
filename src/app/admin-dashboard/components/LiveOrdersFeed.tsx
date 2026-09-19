'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface LiveOrder {
  id: string;
  orderNumber: string;
  table: number;
  customer: string;
  items: number;
  total: number;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  eposStatus: 'ACCEPTED' | 'PENDING' | 'FAILED' | 'SENDING';
  kitchenStatus: 'PREPARING' | 'READY' | 'SENT' | 'PENDING';
  time: string;
}

const LIVE_ORDERS: LiveOrder[] = [
  { id: 'order-001', orderNumber: 'DC-20260919-000247', table: 1, customer: 'Priya Sharma', items: 3, total: 3573, paymentStatus: 'PAID', eposStatus: 'ACCEPTED', kitchenStatus: 'PREPARING', time: '09:41' },
  { id: 'order-002', orderNumber: 'DC-20260919-000246', table: 5, customer: 'Rajan Mehta', items: 5, total: 5290, paymentStatus: 'PAID', eposStatus: 'ACCEPTED', kitchenStatus: 'READY', time: '09:38' },
  { id: 'order-003', orderNumber: 'DC-20260919-000245', table: 12, customer: 'Ananya Krishnan', items: 2, total: 2499, paymentStatus: 'PAID', eposStatus: 'FAILED', kitchenStatus: 'PENDING', time: '09:35' },
  { id: 'order-004', orderNumber: 'DC-20260919-000244', table: 7, customer: 'Suresh Patel', items: 4, total: 4150, paymentStatus: 'PAID', eposStatus: 'SENDING', kitchenStatus: 'PENDING', time: '09:33' },
  { id: 'order-005', orderNumber: 'DC-20260919-000243', table: 19, customer: 'Kavitha Nair', items: 6, total: 6875, paymentStatus: 'PAID', eposStatus: 'ACCEPTED', kitchenStatus: 'SENT', time: '09:29' },
];

const PAYMENT_BADGE: Record<string, string> = {
  PAID: 'bg-secondary/10 text-secondary',
  PENDING: 'bg-amber-400/10 text-amber-400',
  FAILED: 'bg-red-400/10 text-red-400',
};

const EPOS_BADGE: Record<string, string> = {
  ACCEPTED: 'bg-secondary/10 text-secondary',
  PENDING: 'bg-amber-400/10 text-amber-400',
  FAILED: 'bg-red-400/10 text-red-400',
  SENDING: 'bg-blue-400/10 text-blue-400',
};

const KITCHEN_BADGE: Record<string, string> = {
  PREPARING: 'bg-blue-400/10 text-blue-400',
  READY: 'bg-purple-400/10 text-purple-400',
  SENT: 'bg-secondary/10 text-secondary',
  PENDING: 'bg-admin-border text-admin-muted',
};

export default function LiveOrdersFeed() {
  const router = useRouter();

  return (
    <div className="admin-card rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-admin-border">
        <div>
          <h3 className="text-admin-foreground font-bold text-base">Live Orders</h3>
          <p className="text-admin-muted text-xs mt-0.5">Active orders requiring attention</p>
        </div>
        <button
          onClick={() => router.push('/live-order-management')}
          className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
        >
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border">
              {['Order', 'Table', 'Customer', 'Items', 'Total', 'Payment', 'EPOS', 'Kitchen', 'Time'].map((h) => (
                <th key={`loh-${h}`} className="px-4 py-3 text-left text-xs font-semibold text-admin-muted uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LIVE_ORDERS.map((order) => (
              <tr
                key={order.id}
                className="border-b border-admin-border/50 hover:bg-white/3 transition-colors cursor-pointer"
                onClick={() => router.push('/live-order-management')}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {order.eposStatus === 'FAILED' && <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />}
                    <span className="text-xs font-mono text-admin-foreground">{order.orderNumber.replace('DC-20260919-', '#')}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">{order.table}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-admin-foreground whitespace-nowrap">{order.customer}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-admin-muted font-mono-nums">{order.items}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-admin-foreground font-mono-nums">£{(order.total / 100).toFixed(2)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PAYMENT_BADGE[order.paymentStatus]}`}>{order.paymentStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${EPOS_BADGE[order.eposStatus]}`}>{order.eposStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${KITCHEN_BADGE[order.kitchenStatus]}`}>{order.kitchenStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-admin-muted font-mono-nums">{order.time}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}