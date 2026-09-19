'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plug, CheckCircle, XCircle, RefreshCw, AlertTriangle, Save, Eye, EyeOff, Zap, Link2, Settings } from 'lucide-react';

type ConnectionStatus = 'connected' | 'disconnected' | 'testing' | 'error';
type EposMode = 'mock' | 'live';

interface MenuMapping {
  id: string;
  appItemName: string;
  eposItemId: string;
  eposItemName: string;
  mapped: boolean;
  category: string;
}

const MENU_MAPPINGS: MenuMapping[] = [
  { id: '1', appItemName: 'Masala Dosa', eposItemId: '12345', eposItemName: 'MASALA DOSA', mapped: true, category: 'Dosas' },
  { id: '2', appItemName: 'Plain Dosa', eposItemId: '12346', eposItemName: 'PLAIN DOSA', mapped: true, category: 'Dosas' },
  { id: '3', appItemName: 'Idli (2 pcs)', eposItemId: '12347', eposItemName: 'IDLI 2PC', mapped: true, category: 'Idli & Vada' },
  { id: '4', appItemName: 'Medu Vada', eposItemId: '12348', eposItemName: 'MEDU VADA', mapped: true, category: 'Idli & Vada' },
  { id: '5', appItemName: 'Sambar Vada', eposItemId: '', eposItemName: '', mapped: false, category: 'Idli & Vada' },
  { id: '6', appItemName: 'Onion Bhaji', eposItemId: '12350', eposItemName: 'ONION BHAJI', mapped: true, category: 'Starters' },
  { id: '7', appItemName: 'Paneer Tikka', eposItemId: '', eposItemName: '', mapped: false, category: 'Starters' },
  { id: '8', appItemName: 'Mango Lassi', eposItemId: '12352', eposItemName: 'MANGO LASSI', mapped: true, category: 'Drinks' },
];

const RETRY_LOG = [
  { id: 'rl1', orderNumber: 'DC-20260919-000120', attempt: 3, status: 'success', time: '09:35:12', error: null },
  { id: 'rl2', orderNumber: 'DC-20260918-000095', attempt: 2, status: 'failed', time: '18:22:05', error: 'Connection timeout' },
  { id: 'rl3', orderNumber: 'DC-20260918-000088', attempt: 1, status: 'success', time: '15:10:33', error: null },
];

export default function AdminEposPage() {
  const [mode, setMode] = useState<EposMode>('mock');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'connection' | 'mapping' | 'logs'>('connection');
  const [mappings, setMappings] = useState<MenuMapping[]>(MENU_MAPPINGS);
  const [editingMapping, setEditingMapping] = useState<string | null>(null);
  const [config, setConfig] = useState({
    apiUrl: '',
    restaurantId: '',
    apiKey: '',
    webhookSecret: '',
    timeout: '30',
    retryAttempts: '3',
  });

  const testConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus(mode === 'mock' ? 'connected' : config.apiUrl ? 'connected' : 'error');
    }, 2000);
  };

  const mappedCount = mappings.filter(m => m.mapped).length;
  const unmappedCount = mappings.filter(m => !m.mapped).length;

  return (
    <AdminLayout activePage="epos">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Plug size={20} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-admin-foreground">EPOS Integration</h1>
              <p className="text-xs text-admin-muted mt-0.5">Connect and manage your EPOS system</p>
            </div>
          </div>
          {/* Connection Status Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-card)' }}>
            <span className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'testing' ? 'bg-yellow-500 animate-pulse' : connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'}`} />
            <span className="text-sm font-bold text-admin-foreground capitalize">{connectionStatus === 'testing' ? 'Testing...' : connectionStatus}</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
          <Zap size={16} className="text-yellow-400 flex-shrink-0" />
          <span className="text-sm font-bold text-admin-foreground flex-1">Integration Mode</span>
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--admin-border)' }}>
            {(['mock', 'live'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setConnectionStatus('disconnected'); }}
                className="px-4 py-2 text-sm font-bold transition-colors capitalize"
                style={{
                  background: mode === m ? (m === 'live' ? 'var(--primary)' : '#10984B') : 'transparent',
                  color: mode === m ? '#fff' : 'var(--admin-muted)',
                }}
              >
                {m === 'mock' ? '🧪 Mock / Test' : '🔴 Live'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'mock' && (
          <div className="flex items-start gap-3 p-4 rounded-xl border mb-6" style={{ background: 'rgba(16,152,75,0.08)', borderColor: 'rgba(16,152,75,0.3)' }}>
            <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-400">Mock Mode Active</p>
              <p className="text-xs text-admin-muted mt-1">All orders are simulated. No real EPOS system is contacted. Use this mode for testing the complete ordering flow before connecting your live EPOS.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--admin-bg)' }}>
          {([
            { id: 'connection', label: 'Connection', icon: <Link2 size={14} /> },
            { id: 'mapping', label: `Menu Mapping (${unmappedCount} unmapped)`, icon: <Settings size={14} /> },
            { id: 'logs', label: 'Retry Logs', icon: <RefreshCw size={14} /> },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex-1 justify-center"
              style={{
                background: activeTab === tab.id ? 'var(--admin-card)' : 'transparent',
                color: activeTab === tab.id ? 'var(--admin-foreground)' : 'var(--admin-muted)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Connection Tab */}
        {activeTab === 'connection' && (
          <div className="space-y-4">
            <div className="rounded-2xl border p-5 space-y-4" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
              <h3 className="font-extrabold text-admin-foreground">API Configuration</h3>
              {mode === 'live' && (
                <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
                  <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-admin-muted">Live mode requires your EPOS API documentation and credentials. Contact your EPOS provider for the API endpoint, restaurant ID, and API key.</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">API Endpoint URL</label>
                  <input value={config.apiUrl} onChange={(e) => setConfig(c => ({ ...c, apiUrl: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="https://api.yourepos.com/v1" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Restaurant ID</label>
                  <input value={config.restaurantId} onChange={(e) => setConfig(c => ({ ...c, restaurantId: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="DOSA-MK-001" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">API Key</label>
                  <div className="relative">
                    <input type={showApiKey ? 'text' : 'password'} value={config.apiKey} onChange={(e) => setConfig(c => ({ ...c, apiKey: e.target.value }))} className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="••••••••••••••••" />
                    <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-muted hover:text-admin-foreground">
                      {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Webhook Secret</label>
                  <input type="password" value={config.webhookSecret} onChange={(e) => setConfig(c => ({ ...c, webhookSecret: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="••••••••••••••••" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Timeout (seconds)</label>
                  <input type="number" value={config.timeout} onChange={(e) => setConfig(c => ({ ...c, timeout: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Retry Attempts</label>
                  <input type="number" value={config.retryAttempts} onChange={(e) => setConfig(c => ({ ...c, retryAttempts: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={testConnection} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors" style={{ borderColor: '#3B82F6', color: '#3B82F6' }}>
                  {connectionStatus === 'testing' ? <RefreshCw size={15} className="animate-spin" /> : <Zap size={15} />}
                  {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors" style={{ background: 'var(--primary)' }}>
                  <Save size={15} /> Save Configuration
                </button>
              </div>
            </div>

            {/* Webhook URL */}
            <div className="rounded-2xl border p-5" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
              <h3 className="font-extrabold text-admin-foreground mb-3">Webhook Endpoint</h3>
              <p className="text-xs text-admin-muted mb-3">Configure this URL in your EPOS system to receive order status updates:</p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border font-mono text-sm" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)', color: '#10984B' }}>
                https://dosacompany.co.uk/api/webhooks/epos
              </div>
            </div>
          </div>
        )}

        {/* Mapping Tab */}
        {activeTab === 'mapping' && (
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--admin-border)' }}>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-admin-foreground">{mappedCount} mapped</span>
                {unmappedCount > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                    <AlertTriangle size={12} /> {unmappedCount} unmapped
                  </span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--admin-border)' }}>
                    {['App Item', 'Category', 'EPOS Item ID', 'EPOS Item Name', 'Status'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-admin-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m) => (
                    <tr key={m.id} className="border-b hover:bg-white/3 transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                      <td className="px-4 py-3 text-sm font-semibold text-admin-foreground">{m.appItemName}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-admin-muted">{m.category}</td>
                      <td className="px-4 py-3">
                        {editingMapping === m.id ? (
                          <input
                            defaultValue={m.eposItemId}
                            onBlur={(e) => {
                              setMappings(prev => prev.map(item => item.id === m.id ? { ...item, eposItemId: e.target.value, mapped: !!e.target.value } : item));
                              setEditingMapping(null);
                            }}
                            autoFocus
                            className="w-full px-2 py-1 rounded-lg text-xs font-semibold text-admin-foreground border outline-none focus:border-primary"
                            style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}
                          />
                        ) : (
                          <button onClick={() => setEditingMapping(m.id)} className="text-xs font-mono text-admin-foreground hover:text-primary transition-colors">
                            {m.eposItemId || <span className="text-admin-muted italic">Click to set</span>}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-admin-muted">{m.eposItemName || '—'}</td>
                      <td className="px-4 py-3">
                        {m.mapped ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,152,75,0.15)', color: '#10984B' }}>
                            <CheckCircle size={12} /> Mapped
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                            <AlertTriangle size={12} /> Unmapped
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-3">
            {RETRY_LOG.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${log.status === 'success' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                  {log.status === 'success' ? <CheckCircle size={18} className="text-green-400" /> : <XCircle size={18} className="text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-admin-foreground">{log.orderNumber}</p>
                  <p className="text-xs text-admin-muted mt-0.5">Attempt #{log.attempt} · {log.time}{log.error ? ` · Error: ${log.error}` : ''}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: log.status === 'success' ? 'rgba(16,152,75,0.15)' : 'rgba(239,68,68,0.15)', color: log.status === 'success' ? '#10984B' : '#EF4444' }}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
