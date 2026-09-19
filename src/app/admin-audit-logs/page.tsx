'use client';

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { ClipboardList, Search, Filter, Download, User, Settings, CreditCard, QrCode, UtensilsCrossed, RotateCcw, Plug, Shield } from 'lucide-react';

type AuditCategory = 'auth' | 'menu' | 'order' | 'payment' | 'refund' | 'qr' | 'settings' | 'epos' | 'user';

interface AuditLog {
  id: string;
  category: AuditCategory;
  action: string;
  user: string;
  userRole: string;
  entity: string;
  entityId: string;
  previousValue: string;
  newValue: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

const AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', category: 'auth', action: 'Admin Login', user: 'admin@dosacompany.co.uk', userRole: 'SUPER_ADMIN', entity: 'Session', entityId: 'sess_001', previousValue: '', newValue: 'Authenticated', ip: '192.168.1.1', timestamp: '2026-09-19 09:30:12', severity: 'info' },
  { id: 'al2', category: 'menu', action: 'Price Changed', user: 'manager@dosacompany.co.uk', userRole: 'MANAGER', entity: 'MenuItem', entityId: 'item_masala_dosa', previousValue: '£8.95', newValue: '£9.95', ip: '192.168.1.2', timestamp: '2026-09-19 09:15:44', severity: 'warning' },
  { id: 'al3', category: 'refund', action: 'Refund Initiated', user: 'admin@dosacompany.co.uk', userRole: 'SUPER_ADMIN', entity: 'Order', entityId: 'DC-20260919-000121', previousValue: 'PAID', newValue: 'REFUNDED', ip: '192.168.1.1', timestamp: '2026-09-19 09:10:05', severity: 'critical' },
  { id: 'al4', category: 'qr', action: 'QR Code Regenerated', user: 'admin@dosacompany.co.uk', userRole: 'SUPER_ADMIN', entity: 'Table', entityId: 'table_5', previousValue: 'TOKEN_OLD', newValue: 'TOKEN_NEW', ip: '192.168.1.1', timestamp: '2026-09-19 08:55:30', severity: 'warning' },
  { id: 'al5', category: 'epos', action: 'EPOS Retry Triggered', user: 'manager@dosacompany.co.uk', userRole: 'MANAGER', entity: 'Order', entityId: 'DC-20260919-000120', previousValue: 'EPOS_FAILED', newValue: 'EPOS_PENDING', ip: '192.168.1.2', timestamp: '2026-09-19 08:40:18', severity: 'warning' },
  { id: 'al6', category: 'menu', action: 'Item Disabled', user: 'manager@dosacompany.co.uk', userRole: 'MANAGER', entity: 'MenuItem', entityId: 'item_paneer_tikka', previousValue: 'available', newValue: 'unavailable', ip: '192.168.1.2', timestamp: '2026-09-19 08:30:00', severity: 'info' },
  { id: 'al7', category: 'settings', action: 'Orders Paused', user: 'admin@dosacompany.co.uk', userRole: 'SUPER_ADMIN', entity: 'RestaurantSettings', entityId: 'settings_001', previousValue: 'accept_orders: true', newValue: 'accept_orders: false', ip: '192.168.1.1', timestamp: '2026-09-19 08:00:00', severity: 'critical' },
  { id: 'al8', category: 'user', action: 'User Created', user: 'admin@dosacompany.co.uk', userRole: 'SUPER_ADMIN', entity: 'AdminUser', entityId: 'u_new', previousValue: '', newValue: 'staff@dosacompany.co.uk (STAFF)', ip: '192.168.1.1', timestamp: '2026-09-18 17:45:22', severity: 'info' },
  { id: 'al9', category: 'payment', action: 'Payment Reviewed', user: 'manager@dosacompany.co.uk', userRole: 'MANAGER', entity: 'Payment', entityId: 'pi_3QxK2L', previousValue: '', newValue: 'Reviewed by manager', ip: '192.168.1.2', timestamp: '2026-09-18 16:30:11', severity: 'info' },
  { id: 'al10', category: 'menu', action: 'Menu Item Created', user: 'admin@dosacompany.co.uk', userRole: 'SUPER_ADMIN', entity: 'MenuItem', entityId: 'item_new_special', previousValue: '', newValue: 'Chef Special Dosa – £12.95', ip: '192.168.1.1', timestamp: '2026-09-18 14:20:05', severity: 'info' },
  { id: 'al11', category: 'auth', action: 'Failed Login Attempt', user: 'unknown@example.com', userRole: 'N/A', entity: 'Session', entityId: 'sess_fail', previousValue: '', newValue: 'Authentication failed', ip: '203.0.113.42', timestamp: '2026-09-18 13:15:00', severity: 'critical' },
  { id: 'al12', category: 'qr', action: 'Table Disabled', user: 'manager@dosacompany.co.uk', userRole: 'MANAGER', entity: 'Table', entityId: 'table_20', previousValue: 'active', newValue: 'disabled', ip: '192.168.1.2', timestamp: '2026-09-18 12:00:00', severity: 'warning' },
];

const CATEGORY_CONFIG: Record<AuditCategory, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  auth: { label: 'Auth', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', icon: <Shield size={13} /> },
  menu: { label: 'Menu', color: '#10984B', bg: 'rgba(16,152,75,0.15)', icon: <UtensilsCrossed size={13} /> },
  order: { label: 'Order', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', icon: <ClipboardList size={13} /> },
  payment: { label: 'Payment', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: <CreditCard size={13} /> },
  refund: { label: 'Refund', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', icon: <RotateCcw size={13} /> },
  qr: { label: 'QR', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)', icon: <QrCode size={13} /> },
  settings: { label: 'Settings', color: '#ED2024', bg: 'rgba(237,32,36,0.15)', icon: <Settings size={13} /> },
  epos: { label: 'EPOS', color: '#F97316', bg: 'rgba(249,115,22,0.15)', icon: <Plug size={13} /> },
  user: { label: 'User', color: '#A78BFA', bg: 'rgba(167,139,250,0.15)', icon: <User size={13} /> },
};

const SEVERITY_CONFIG = {
  info: { label: 'Info', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  warning: { label: 'Warning', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
};

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AuditCategory>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const filtered = useMemo(() => {
    return AUDIT_LOGS.filter((log) => {
      const matchSearch = !search || log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase()) || log.entity.toLowerCase().includes(search.toLowerCase()) || log.entityId.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || log.category === categoryFilter;
      const matchSev = severityFilter === 'all' || log.severity === severityFilter;
      return matchSearch && matchCat && matchSev;
    });
  }, [search, categoryFilter, severityFilter]);

  return (
    <AdminLayout activePage="audit">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(237,32,36,0.15)' }}>
              <ClipboardList size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-admin-foreground">Audit Logs</h1>
              <p className="text-xs text-admin-muted mt-0.5">{AUDIT_LOGS.length} events recorded</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border text-admin-muted hover:text-admin-foreground transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
            <Download size={15} /> Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Critical Events', value: AUDIT_LOGS.filter(l => l.severity === 'critical').length, color: '#EF4444' },
            { label: 'Warnings', value: AUDIT_LOGS.filter(l => l.severity === 'warning').length, color: '#F59E0B' },
            { label: 'Info Events', value: AUDIT_LOGS.filter(l => l.severity === 'info').length, color: '#6B7280' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-semibold text-admin-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search action, user, entity..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-admin-muted"><Filter size={12} /> Category:</div>
            {(['all', ...Object.keys(CATEGORY_CONFIG)] as const).map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat as 'all' | AuditCategory)} className="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors capitalize" style={{ background: categoryFilter === cat ? 'var(--primary)' : 'var(--admin-card)', color: categoryFilter === cat ? '#fff' : 'var(--admin-muted)', border: `1px solid ${categoryFilter === cat ? 'var(--primary)' : 'var(--admin-border)'}` }}>
                {cat === 'all' ? 'All' : CATEGORY_CONFIG[cat as AuditCategory]?.label ?? cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-admin-muted"><Filter size={12} /> Severity:</div>
            {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
              <button key={sev} onClick={() => setSeverityFilter(sev)} className="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors capitalize" style={{ background: severityFilter === sev ? (sev === 'all' ? 'var(--primary)' : SEVERITY_CONFIG[sev as 'info' | 'warning' | 'critical'].color) : 'var(--admin-card)', color: severityFilter === sev ? '#fff' : 'var(--admin-muted)', border: `1px solid ${severityFilter === sev ? 'transparent' : 'var(--admin-border)'}` }}>
                {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Log Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  {['Timestamp', 'Category', 'Action', 'User', 'Entity', 'Change', 'IP', 'Severity', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-admin-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const cc = CATEGORY_CONFIG[log.category];
                  const sc = SEVERITY_CONFIG[log.severity];
                  return (
                    <tr key={log.id} className="border-b hover:bg-white/3 transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                      <td className="px-4 py-3 text-xs font-mono text-admin-muted whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: cc.bg, color: cc.color }}>
                          {cc.icon} {cc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-admin-foreground whitespace-nowrap">{log.action}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-admin-foreground">{log.user}</p>
                        <p className="text-xs text-admin-muted">{log.userRole}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-admin-foreground">{log.entity}</p>
                        <p className="text-xs font-mono text-admin-muted">{log.entityId}</p>
                      </td>
                      <td className="px-4 py-3 max-w-[160px]">
                        {log.previousValue && <p className="text-xs text-admin-muted line-through truncate">{log.previousValue}</p>}
                        {log.newValue && <p className="text-xs font-semibold text-admin-foreground truncate">{log.newValue}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-admin-muted whitespace-nowrap">{log.ip}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(log)} className="w-7 h-7 rounded-lg flex items-center justify-center text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors">
                          <Filter size={13} />
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
              <ClipboardList size={32} className="mx-auto mb-3 text-admin-muted opacity-40" />
              <p className="text-admin-muted font-semibold">No audit logs found</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--admin-card)' }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <h2 className="font-extrabold text-admin-foreground">Audit Event Detail</h2>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:bg-white/5"><ClipboardList size={16} /></button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  ['Timestamp', selected.timestamp],
                  ['Action', selected.action],
                  ['Category', CATEGORY_CONFIG[selected.category].label],
                  ['User', selected.user],
                  ['Role', selected.userRole],
                  ['Entity', selected.entity],
                  ['Entity ID', selected.entityId],
                  ['Previous Value', selected.previousValue || '—'],
                  ['New Value', selected.newValue || '—'],
                  ['IP Address', selected.ip],
                  ['Severity', selected.severity.charAt(0).toUpperCase() + selected.severity.slice(1)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start py-2 border-b gap-4" style={{ borderColor: 'var(--admin-border)' }}>
                    <span className="text-xs font-bold text-admin-muted uppercase tracking-wide flex-shrink-0">{k}</span>
                    <span className="text-sm font-semibold text-admin-foreground text-right">{v}</span>
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
