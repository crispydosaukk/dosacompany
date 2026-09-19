'use client';

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { CreditCard, Search, Eye, Download, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded' | 'partially_refunded';

interface Payment {
  id: string;
  orderNumber: string;
  table: string;
  customer: string;
  email: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  stripeId: string;
  createdAt: string;
  eposStatus: string;
}

const PAYMENTS: Payment[] = [
  { id: 'p1', orderNumber: 'DC-20260919-000123', table: 'Table 3', customer: 'Priya Sharma', email: 'priya@example.com', amount: 3550, status: 'paid', method: 'Visa •••• 4242', stripeId: 'pi_3QxK2L...', createdAt: '2026-09-19 09:31', eposStatus: 'Accepted' },
  { id: 'p2', orderNumber: 'DC-20260919-000122', table: 'Table 7', customer: 'James Wilson', email: 'james@example.com', amount: 2195, status: 'paid', method: 'Mastercard •••• 5555', stripeId: 'pi_3QxJ1K...', createdAt: '2026-09-19 09:15', eposStatus: 'Accepted' },
  { id: 'p3', orderNumber: 'DC-20260919-000121', table: 'Table 12', customer: 'Anita Patel', email: 'anita@example.com', amount: 4820, status: 'refunded', method: 'Visa •••• 1234', stripeId: 'pi_3QxI0J...', createdAt: '2026-09-19 08:55', eposStatus: 'Cancelled' },
  { id: 'p4', orderNumber: 'DC-20260919-000120', table: 'Table 1', customer: 'Mohammed Ali', email: 'mali@example.com', amount: 1895, status: 'failed', method: 'Amex •••• 3782', stripeId: 'pi_3QxH9I...', createdAt: '2026-09-19 08:40', eposStatus: 'N/A' },
  { id: 'p5', orderNumber: 'DC-20260919-000119', table: 'Table 5', customer: 'Sarah Chen', email: 'sarah@example.com', amount: 5640, status: 'paid', method: 'Apple Pay', stripeId: 'pi_3QxG8H...', createdAt: '2026-09-19 08:22', eposStatus: 'Accepted' },
  { id: 'p6', orderNumber: 'DC-20260919-000118', table: 'Table 9', customer: 'Raj Kumar', email: 'raj@example.com', amount: 3210, status: 'paid', method: 'Google Pay', stripeId: 'pi_3QxF7G...', createdAt: '2026-09-19 08:10', eposStatus: 'Accepted' },
  { id: 'p7', orderNumber: 'DC-20260919-000117', table: 'Table 15', customer: 'Emma Thompson', email: 'emma@example.com', amount: 2750, status: 'partially_refunded', method: 'Visa •••• 9876', stripeId: 'pi_3QxE6F...', createdAt: '2026-09-19 07:55', eposStatus: 'Accepted' },
  { id: 'p8', orderNumber: 'DC-20260919-000116', table: 'Table 2', customer: 'David Brown', email: 'david@example.com', amount: 1650, status: 'pending', method: 'Mastercard •••• 7890', stripeId: 'pi_3QxD5E...', createdAt: '2026-09-19 07:40', eposStatus: 'Pending' },
];

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  paid: { label: 'Paid', color: '#10984B', bg: 'rgba(16,152,75,0.15)', icon: <CheckCircle size={13} /> },
  pending: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: <Clock size={13} /> },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', icon: <XCircle size={13} /> },
  refunded: { label: 'Refunded', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', icon: <RefreshCw size={13} /> },
  partially_refunded: { label: 'Part. Refunded', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: <RefreshCw size={13} /> },
};

function fmt(pence: number) { return `£${(pence / 100).toFixed(2)}`; }

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [selected, setSelected] = useState<Payment | null>(null);

  const filtered = useMemo(() => {
    return PAYMENTS.filter((p) => {
      const matchSearch = !search || p.orderNumber.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalRevenue = PAYMENTS.filter(p => p.status === 'paid' || p.status === 'partially_refunded').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = PAYMENTS.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);
  const successRate = Math.round((PAYMENTS.filter(p => p.status === 'paid').length / PAYMENTS.length) * 100);

  return (
    <AdminLayout activePage="payments">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(237,32,36,0.15)' }}>
              <CreditCard size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-admin-foreground">Payments</h1>
              <p className="text-xs text-admin-muted mt-0.5">{PAYMENTS.length} transactions today</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border text-admin-muted hover:text-admin-foreground transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today's Revenue", value: fmt(totalRevenue), sub: '+12% vs yesterday', icon: <TrendingUp size={18} />, color: '#10984B', up: true },
            { label: 'Refunded', value: fmt(totalRefunded), sub: '1 order refunded', icon: <TrendingDown size={18} />, color: '#8B5CF6', up: false },
            { label: 'Success Rate', value: `${successRate}%`, sub: `${PAYMENTS.filter(p => p.status === 'paid').length} of ${PAYMENTS.length} paid`, icon: <CheckCircle size={18} />, color: '#3B82F6', up: true },
            { label: 'Failed', value: `${PAYMENTS.filter(p => p.status === 'failed').length}`, sub: 'payments failed', icon: <XCircle size={18} />, color: '#EF4444', up: false },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl p-4 border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-admin-muted">{kpi.label}</p>
                <span style={{ color: kpi.color }}>{kpi.icon}</span>
              </div>
              <p className="text-2xl font-extrabold text-admin-foreground">{kpi.value}</p>
              <p className="text-xs text-admin-muted mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer, email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary"
              style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'paid', 'pending', 'failed', 'refunded'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-colors capitalize"
                style={{
                  background: statusFilter === s ? 'var(--primary)' : 'var(--admin-card)',
                  color: statusFilter === s ? '#fff' : 'var(--admin-muted)',
                  border: `1px solid ${statusFilter === s ? 'var(--primary)' : 'var(--admin-border)'}`,
                }}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s as PaymentStatus]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  {['Order #', 'Table', 'Customer', 'Amount', 'Method', 'Status', 'EPOS', 'Date', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-admin-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const sc = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id} className="border-b hover:bg-white/3 transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                      <td className="px-4 py-3 text-xs font-bold text-admin-foreground font-mono-nums whitespace-nowrap">{p.orderNumber}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-admin-foreground whitespace-nowrap">{p.table}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-admin-foreground">{p.customer}</p>
                        <p className="text-xs text-admin-muted">{p.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-extrabold text-admin-foreground whitespace-nowrap">{fmt(p.amount)}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-admin-muted whitespace-nowrap">{p.method}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.color }}>
                          {sc.icon} {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: p.eposStatus === 'Accepted' ? '#10984B' : p.eposStatus === 'N/A' ? '#6B7280' : '#F59E0B' }}>{p.eposStatus}</td>
                      <td className="px-4 py-3 text-xs text-admin-muted whitespace-nowrap">{p.createdAt}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(p)} className="w-7 h-7 rounded-lg flex items-center justify-center text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <CreditCard size={32} className="mx-auto mb-3 text-admin-muted opacity-40" />
              <p className="text-admin-muted font-semibold">No payments found</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--admin-card)' }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <h2 className="font-extrabold text-admin-foreground">Payment Detail</h2>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:bg-white/5"><XCircle size={16} /></button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  ['Order', selected.orderNumber],
                  ['Table', selected.table],
                  ['Customer', selected.customer],
                  ['Email', selected.email],
                  ['Amount', fmt(selected.amount)],
                  ['Method', selected.method],
                  ['Stripe ID', selected.stripeId],
                  ['EPOS Status', selected.eposStatus],
                  ['Date', selected.createdAt],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                    <span className="text-xs font-bold text-admin-muted uppercase tracking-wide">{k}</span>
                    <span className="text-sm font-semibold text-admin-foreground">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-bold text-admin-muted uppercase tracking-wide">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>
                    {STATUS_CONFIG[selected.status].icon} {STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
