'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { ChefHat, Clock, CheckCircle, AlertTriangle, RefreshCw, Eye, Printer, Settings, Zap } from 'lucide-react';

type KitchenStatus = 'new' | 'preparing' | 'ready' | 'completed';
type KitchenMode = 'epos_routed' | 'direct';

interface KitchenTicket {
  id: string;
  orderNumber: string;
  table: string;
  customer: string;
  items: { name: string; qty: number; modifiers: string[] }[];
  note: string;
  status: KitchenStatus;
  receivedAt: string;
  updatedAt: string;
  elapsedMins: number;
}

const TICKETS: KitchenTicket[] = [
  {
    id: 'kt1', orderNumber: 'DC-20260919-000123', table: 'Table 3', customer: 'Priya Sharma',
    items: [{ name: 'Masala Dosa', qty: 2, modifiers: ['Extra Sambar', 'Coconut Chutney'] }, { name: 'Idli (2 pcs)', qty: 1, modifiers: [] }],
    note: 'No onions please', status: 'preparing', receivedAt: '09:31', updatedAt: '09:33', elapsedMins: 8,
  },
  {
    id: 'kt2', orderNumber: 'DC-20260919-000122', table: 'Table 7', customer: 'James Wilson',
    items: [{ name: 'Onion Bhaji', qty: 1, modifiers: [] }, { name: 'Chicken Curry', qty: 1, modifiers: ['Hot spice'] }, { name: 'Garlic Naan', qty: 2, modifiers: [] }],
    note: '', status: 'new', receivedAt: '09:38', updatedAt: '09:38', elapsedMins: 2,
  },
  {
    id: 'kt3', orderNumber: 'DC-20260919-000121', table: 'Table 12', customer: 'Anita Patel',
    items: [{ name: 'Mango Lassi', qty: 2, modifiers: [] }, { name: 'Gulab Jamun', qty: 1, modifiers: [] }],
    note: '', status: 'ready', receivedAt: '09:15', updatedAt: '09:28', elapsedMins: 25,
  },
  {
    id: 'kt4', orderNumber: 'DC-20260919-000120', table: 'Table 1', customer: 'Mohammed Ali',
    items: [{ name: 'Rava Dosa', qty: 1, modifiers: ['Extra Ghee'] }, { name: 'Filter Coffee', qty: 2, modifiers: [] }],
    note: 'Allergy: nuts', status: 'completed', receivedAt: '09:00', updatedAt: '09:18', elapsedMins: 40,
  },
];

const STATUS_CONFIG: Record<KitchenStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; next?: KitchenStatus; nextLabel?: string }> = {
  new: { label: 'New', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', icon: <Zap size={14} />, next: 'preparing', nextLabel: 'Start Preparing' },
  preparing: { label: 'Preparing', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', icon: <RefreshCw size={14} />, next: 'ready', nextLabel: 'Mark Ready' },
  ready: { label: 'Ready', color: '#10984B', bg: 'rgba(16,152,75,0.12)', border: 'rgba(16,152,75,0.4)', icon: <CheckCircle size={14} />, next: 'completed', nextLabel: 'Complete' },
  completed: { label: 'Completed', color: '#6B7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', icon: <CheckCircle size={14} /> },
};

export default function AdminKitchenPage() {
  const [tickets, setTickets] = useState<KitchenTicket[]>(TICKETS);
  const [kitchenMode, setKitchenMode] = useState<KitchenMode>('epos_routed');
  const [filterStatus, setFilterStatus] = useState<'all' | KitchenStatus>('all');
  const [selected, setSelected] = useState<KitchenTicket | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [prepTime, setPrepTime] = useState('20');

  const updateStatus = (id: string, status: KitchenStatus) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) } : t));
  };

  const filtered = filterStatus === 'all' ? tickets : tickets.filter(t => t.status === filterStatus);
  const activeCount = tickets.filter(t => t.status === 'new' || t.status === 'preparing').length;

  return (
    <AdminLayout activePage="kitchen">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <ChefHat size={20} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-admin-foreground">Kitchen</h1>
              <p className="text-xs text-admin-muted mt-0.5">{activeCount} active tickets · Avg prep: {prepTime} mins</p>
            </div>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border text-admin-muted hover:text-admin-foreground transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
            <Settings size={15} /> Settings
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="rounded-2xl border p-5 mb-6 space-y-4" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
            <h3 className="font-extrabold text-admin-foreground">Kitchen Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Kitchen Routing Mode</label>
                <select value={kitchenMode} onChange={(e) => setKitchenMode(e.target.value as KitchenMode)} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}>
                  <option value="epos_routed">EPOS → Kitchen (EPOS handles routing)</option>
                  <option value="direct">Direct App → Kitchen</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Default Prep Time (mins)</label>
                <input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} />
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.3)' }}>
              <AlertTriangle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-admin-muted">
                {kitchenMode === 'epos_routed' ?'In EPOS-routed mode, orders are sent to the kitchen via your EPOS system. The kitchen display here shows a mirror of EPOS kitchen tickets.' :'In Direct mode, the application sends kitchen tickets directly without going through EPOS. Configure your Kitchen Display System (KDS) webhook below.'}
              </p>
            </div>
            {kitchenMode === 'direct' && (
              <div>
                <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">KDS Webhook URL</label>
                <input className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="https://your-kds-system.com/webhook" />
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {(['new', 'preparing', 'ready', 'completed'] as KitchenStatus[]).map((s) => {
            const sc = STATUS_CONFIG[s];
            const count = tickets.filter(t => t.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                className="rounded-2xl p-4 border text-left transition-all"
                style={{ background: filterStatus === s ? sc.bg : 'var(--admin-card)', borderColor: filterStatus === s ? sc.border : 'var(--admin-border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: sc.color }}>{sc.icon}</span>
                  <span className="text-2xl font-extrabold" style={{ color: sc.color }}>{count}</span>
                </div>
                <p className="text-xs font-bold text-admin-muted">{sc.label}</p>
              </button>
            );
          })}
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ticket) => {
            const sc = STATUS_CONFIG[ticket.status];
            return (
              <div key={ticket.id} className="rounded-2xl border overflow-hidden" style={{ background: 'var(--admin-card)', borderColor: sc.border }}>
                {/* Ticket Header */}
                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ background: sc.bg, borderColor: sc.border }}>
                  <div>
                    <p className="text-xs font-extrabold" style={{ color: sc.color }}>{ticket.table.toUpperCase()}</p>
                    <p className="text-xs font-bold text-admin-muted">{ticket.orderNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: ticket.elapsedMins > 20 ? '#EF4444' : 'var(--admin-muted)' }}>
                      <Clock size={12} /> {ticket.elapsedMins}m
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {sc.icon} {sc.label}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 space-y-2">
                  {ticket.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-sm font-extrabold text-admin-foreground w-6 flex-shrink-0">{item.qty}×</span>
                      <div>
                        <p className="text-sm font-bold text-admin-foreground">{item.name}</p>
                        {item.modifiers.map((mod, j) => (
                          <p key={j} className="text-xs text-admin-muted">+ {mod}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                  {ticket.note && (
                    <div className="mt-2 px-3 py-2 rounded-lg border" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
                      <p className="text-xs font-bold text-yellow-400">📝 {ticket.note}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex items-center gap-2">
                  {sc.next && (
                    <button
                      onClick={() => updateStatus(ticket.id, sc.next!)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                      style={{ background: STATUS_CONFIG[sc.next].color }}
                    >
                      {sc.nextLabel}
                    </button>
                  )}
                  <button onClick={() => setSelected(ticket)} className="w-9 h-9 rounded-xl flex items-center justify-center border text-admin-muted hover:text-admin-foreground transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                    <Eye size={15} />
                  </button>
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center border text-admin-muted hover:text-admin-foreground transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                    <Printer size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <ChefHat size={40} className="mx-auto mb-3 text-admin-muted opacity-30" />
            <p className="text-admin-muted font-semibold">No kitchen tickets</p>
            <p className="text-xs text-admin-muted mt-1">Orders will appear here once paid and sent to kitchen</p>
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--admin-card)' }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <h2 className="font-extrabold text-admin-foreground">Kitchen Ticket</h2>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:bg-white/5"><CheckCircle size={16} /></button>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-center py-3 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  <p className="text-2xl font-extrabold text-admin-foreground">{selected.table}</p>
                  <p className="text-xs text-admin-muted">{selected.orderNumber}</p>
                  <p className="text-xs text-admin-muted mt-1">Customer: {selected.customer}</p>
                </div>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                    <span className="text-lg font-extrabold text-admin-foreground w-8">{item.qty}×</span>
                    <div>
                      <p className="font-bold text-admin-foreground">{item.name}</p>
                      {item.modifiers.map((m, j) => <p key={j} className="text-xs text-admin-muted">+ {m}</p>)}
                    </div>
                  </div>
                ))}
                {selected.note && <p className="text-sm font-bold text-yellow-400">Note: {selected.note}</p>}
                <div className="flex items-center justify-between text-xs text-admin-muted pt-2">
                  <span>Received: {selected.receivedAt}</span>
                  <span>Updated: {selected.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
