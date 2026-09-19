'use client';

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { RotateCcw, Search, AlertTriangle, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

type RefundStatus = 'completed' | 'pending' | 'failed';

interface Refund {
  id: string;
  orderNumber: string;
  table: string;
  customer: string;
  originalAmount: number;
  refundAmount: number;
  type: 'full' | 'partial';
  status: RefundStatus;
  reason: string;
  initiatedBy: string;
  stripeRefundId: string;
  eposSent: boolean;
  createdAt: string;
}

const REFUNDS: Refund[] = [
  { id: 'r1', orderNumber: 'DC-20260919-000121', table: 'Table 12', customer: 'Anita Patel', originalAmount: 4820, refundAmount: 4820, type: 'full', status: 'completed', reason: 'Customer request – wrong order', initiatedBy: 'admin@dosacompany.co.uk', stripeRefundId: 're_3Qx...', eposSent: true, createdAt: '2026-09-19 09:10' },
  { id: 'r2', orderNumber: 'DC-20260919-000117', table: 'Table 15', customer: 'Emma Thompson', originalAmount: 2750, refundAmount: 1200, type: 'partial', status: 'completed', reason: 'Item unavailable after order', initiatedBy: 'manager@dosacompany.co.uk', stripeRefundId: 're_3Qy...', eposSent: true, createdAt: '2026-09-19 08:30' },
  { id: 'r3', orderNumber: 'DC-20260918-000098', table: 'Table 4', customer: 'Tom Harris', originalAmount: 3200, refundAmount: 3200, type: 'full', status: 'pending', reason: 'Duplicate payment', initiatedBy: 'admin@dosacompany.co.uk', stripeRefundId: 'Pending...', eposSent: false, createdAt: '2026-09-18 19:45' },
  { id: 'r4', orderNumber: 'DC-20260918-000087', table: 'Table 8', customer: 'Lisa Park', originalAmount: 1890, refundAmount: 1890, type: 'full', status: 'failed', reason: 'Card expired', initiatedBy: 'admin@dosacompany.co.uk', stripeRefundId: 'Failed', eposSent: false, createdAt: '2026-09-18 17:20' },
];

const STATUS_CONFIG: Record<RefundStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  completed: { label: 'Completed', color: '#10984B', bg: 'rgba(16,152,75,0.15)', icon: <CheckCircle size={13} /> },
  pending: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: <Clock size={13} /> },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', icon: <XCircle size={13} /> },
};

function fmt(pence: number) { return `£${(pence / 100).toFixed(2)}`; }

interface NewRefundModalProps {
  onClose: () => void;
  onSubmit: (data: { orderNumber: string; amount: string; reason: string }) => void;
}

function NewRefundModal({ onClose, onSubmit }: NewRefundModalProps) {
  const [form, setForm] = useState({ orderNumber: '', amount: '', reason: '' });
  const [warned, setWarned] = useState(false);

  const handleSubmit = () => {
    if (!warned) { setWarned(true); return; }
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--admin-card)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <h2 className="font-extrabold text-admin-foreground">Initiate Refund</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:bg-white/5"><XCircle size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          {warned && (
            <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-400">Warning: Order may have been sent to EPOS/Kitchen</p>
                <p className="text-xs text-admin-muted mt-1">Please ensure the kitchen has been notified before proceeding with this refund. Click Confirm Refund to proceed.</p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Order Number</label>
            <input value={form.orderNumber} onChange={(e) => setForm(f => ({ ...f, orderNumber: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="DC-20260919-000123" />
          </div>
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Refund Amount (£)</label>
            <input value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))} type="number" step="0.01" min="0" className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Reason</label>
            <select value={form.reason} onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}>
              <option value="">Select reason...</option>
              <option value="Customer request – wrong order">Customer request – wrong order</option>
              <option value="Item unavailable after order">Item unavailable after order</option>
              <option value="Duplicate payment">Duplicate payment</option>
              <option value="Quality issue">Quality issue</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: 'var(--admin-border)' }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-admin-muted hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2" style={{ background: warned ? '#EF4444' : 'var(--primary)' }}>
            <RotateCcw size={15} /> {warned ? 'Confirm Refund' : 'Review & Refund'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRefundsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RefundStatus>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [refunds, setRefunds] = useState<Refund[]>(REFUNDS);
  const [selected, setSelected] = useState<Refund | null>(null);

  const filtered = useMemo(() => {
    return refunds.filter((r) => {
      const matchSearch = !search || r.orderNumber.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, refunds]);

  const totalRefunded = refunds.filter(r => r.status === 'completed').reduce((s, r) => s + r.refundAmount, 0);

  return (
    <AdminLayout activePage="refunds">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <RotateCcw size={20} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-admin-foreground">Refunds</h1>
              <p className="text-xs text-admin-muted mt-0.5">{refunds.length} refunds · {fmt(totalRefunded)} returned</p>
            </div>
          </div>
          <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors" style={{ background: 'var(--primary)' }}>
            <RotateCcw size={15} /> New Refund
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Refunded', value: fmt(totalRefunded), color: '#8B5CF6' },
            { label: 'Completed', value: refunds.filter(r => r.status === 'completed').length, color: '#10984B' },
            { label: 'Pending', value: refunds.filter(r => r.status === 'pending').length, color: '#F59E0B' },
            { label: 'Failed', value: refunds.filter(r => r.status === 'failed').length, color: '#EF4444' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-semibold text-admin-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order or customer..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }} />
          </div>
          <div className="flex gap-2">
            {(['all', 'completed', 'pending', 'failed'] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-2 rounded-xl text-xs font-bold transition-colors capitalize" style={{ background: statusFilter === s ? 'var(--primary)' : 'var(--admin-card)', color: statusFilter === s ? '#fff' : 'var(--admin-muted)', border: `1px solid ${statusFilter === s ? 'var(--primary)' : 'var(--admin-border)'}` }}>
                {s === 'all' ? 'All' : STATUS_CONFIG[s as RefundStatus]?.label ?? s}
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
                  {['Order #', 'Table', 'Customer', 'Original', 'Refunded', 'Type', 'Reason', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-admin-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const sc = STATUS_CONFIG[r.status];
                  return (
                    <tr key={r.id} className="border-b hover:bg-white/3 transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                      <td className="px-4 py-3 text-xs font-bold text-admin-foreground font-mono-nums whitespace-nowrap">{r.orderNumber}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-admin-foreground whitespace-nowrap">{r.table}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-admin-foreground">{r.customer}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-admin-muted whitespace-nowrap">{fmt(r.originalAmount)}</td>
                      <td className="px-4 py-3 text-sm font-extrabold whitespace-nowrap" style={{ color: '#8B5CF6' }}>{fmt(r.refundAmount)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: r.type === 'full' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: r.type === 'full' ? '#EF4444' : '#F59E0B' }}>
                          {r.type === 'full' ? 'Full' : 'Partial'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-admin-muted max-w-[160px] truncate">{r.reason}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.color }}>
                          {sc.icon} {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-admin-muted whitespace-nowrap">{r.createdAt}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(r)} className="w-7 h-7 rounded-lg flex items-center justify-center text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors">
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
              <RotateCcw size={32} className="mx-auto mb-3 text-admin-muted opacity-40" />
              <p className="text-admin-muted font-semibold">No refunds found</p>
            </div>
          )}
        </div>

        {showNewModal && (
          <NewRefundModal
            onClose={() => setShowNewModal(false)}
            onSubmit={(data) => {
              const newRefund: Refund = {
                id: `r${Date.now()}`,
                orderNumber: data.orderNumber,
                table: 'Unknown',
                customer: 'Manual Entry',
                originalAmount: Math.round(parseFloat(data.amount || '0') * 100),
                refundAmount: Math.round(parseFloat(data.amount || '0') * 100),
                type: 'full',
                status: 'pending',
                reason: data.reason,
                initiatedBy: 'admin@dosacompany.co.uk',
                stripeRefundId: 'Pending...',
                eposSent: false,
                createdAt: new Date().toLocaleString('en-GB'),
              };
              setRefunds((prev) => [newRefund, ...prev]);
            }}
          />
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--admin-card)' }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <h2 className="font-extrabold text-admin-foreground">Refund Detail</h2>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:bg-white/5"><XCircle size={16} /></button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  ['Order', selected.orderNumber],
                  ['Customer', selected.customer],
                  ['Original Amount', fmt(selected.originalAmount)],
                  ['Refund Amount', fmt(selected.refundAmount)],
                  ['Type', selected.type === 'full' ? 'Full Refund' : 'Partial Refund'],
                  ['Reason', selected.reason],
                  ['Initiated By', selected.initiatedBy],
                  ['Stripe Refund ID', selected.stripeRefundId],
                  ['EPOS Notified', selected.eposSent ? 'Yes' : 'No'],
                  ['Date', selected.createdAt],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                    <span className="text-xs font-bold text-admin-muted uppercase tracking-wide">{k}</span>
                    <span className="text-sm font-semibold text-admin-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
