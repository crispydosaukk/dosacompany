'use client';

import React, { useState, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { QrCode, Download, Eye, RefreshCw, ToggleLeft, ToggleRight, Printer, Search, X,  } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

interface TableQR {
  id: number;
  name: string;
  token: string;
  status: 'active' | 'disabled';
  url: string;
}

function generateToken(tableId: number): string {
  const base = `dc-table-${tableId}-mk`;
  return btoa(base).replace(/=/g, '').substring(0, 16).toUpperCase();
}

const BASE_URL = 'https://dosacompany.co.uk/order/t';

function initTables(): TableQR[] {
  return Array.from({ length: 30 }, (_, i) => {
    const id = i + 1;
    const token = generateToken(id);
    return {
      id,
      name: `Table ${id}`,
      token,
      status: 'active',
      url: `${BASE_URL}/${token}`,
    };
  });
}

function QRCodeDisplay({ url, size = 120 }: { url: string; size?: number }) {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=111111&bgcolor=FFFFFF&margin=10`;
  return (
    <img
      src={qrApiUrl}
      alt={`QR code for ${url}`}
      width={size}
      height={size}
      className="rounded-lg"
      loading="lazy"
    />
  );
}

function QRPreviewModal({ table, onClose }: { table: TableQR; onClose: () => void }) {
  const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(table.url)}&color=111111&bgcolor=FFFFFF&margin=20`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `dosa-company-${table.name.toLowerCase().replace(' ', '-')}-qr.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Print-ready card header */}
        <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #111111, #1a0a0a)' }}>
          <div className="flex justify-center mb-3">
            <AppLogo size={48} />
          </div>
          <p className="text-white font-bold text-lg">Dosa Company</p>
          <p className="text-gray-400 text-sm">Milton Keynes</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-500 text-sm font-medium mb-4">Scan to Order</p>
          <div className="flex justify-center mb-4">
            <div className="p-3 border-2 border-gray-100 rounded-xl">
              <QRCodeDisplay url={table.url} size={200} />
            </div>
          </div>
          <p className="font-extrabold text-2xl text-gray-900 mb-1">{table.name}</p>
          <p className="text-gray-400 text-xs mb-1">Order directly from your table</p>
          <p className="text-gray-300 text-xs font-mono break-all">{table.url}</p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: '#ED2024' }}
          >
            <Download size={16} />
            Download PNG
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TableQRManagerClient() {
  const [tables, setTables] = useState<TableQR[]>(initTables);
  const [previewTable, setPreviewTable] = useState<TableQR | null>(null);
  const [search, setSearch] = useState('');
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);

  const filtered = tables.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = useCallback((id: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'active' ? 'disabled' : 'active' } : t
      )
    );
  }, []);

  const regenerate = useCallback(async (id: number) => {
    setRegeneratingId(id);
    await new Promise((r) => setTimeout(r, 600));
    const newToken = generateToken(id) + Math.random().toString(36).substring(2, 6).toUpperCase();
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, token: newToken, url: `${BASE_URL}/${newToken}` }
          : t
      )
    );
    setRegeneratingId(null);
  }, []);

  const downloadAll = () => {
    tables.forEach((table, idx) => {
      setTimeout(() => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(table.url)}&color=111111&bgcolor=FFFFFF&margin=20`;
        const link = document.createElement('a');
        link.href = url;
        link.download = `dosa-company-table-${table.id}-qr.png`;
        link.click();
      }, idx * 200);
    });
  };

  const activeCount = tables.filter((t) => t.status === 'active').length;

  return (
    <AdminLayout activePage="qr-codes">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-admin-foreground flex items-center gap-2">
              <QrCode size={24} className="text-primary" />
              Table QR Manager
            </h1>
            <p className="text-admin-muted text-sm mt-1">
              {activeCount} active / {tables.length} total tables
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-muted)' }}
            >
              <Printer size={16} />
              Print All
            </button>
            <button
              onClick={downloadAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ background: '#ED2024' }}
            >
              <Download size={16} />
              Download All
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Search tables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: 'var(--admin-card)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-foreground)',
            }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((table) => (
            <div
              key={`qr-table-${table.id}`}
              className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg"
              style={{
                background: 'var(--admin-card)',
                borderColor: table.status === 'disabled' ? 'var(--admin-border)' : 'var(--admin-border)',
                opacity: table.status === 'disabled' ? 0.6 : 1,
              }}
            >
              {/* Status bar */}
              <div
                className="h-1"
                style={{ background: table.status === 'active' ? '#10984B' : '#6b7280' }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-admin-foreground text-sm">{table.name}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      table.status === 'active' ?'bg-green-100 text-green-700' :'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {table.status === 'active' ? 'Active' : 'Disabled'}
                  </span>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-3">
                  <div className="p-2 bg-white rounded-xl border border-gray-100">
                    <QRCodeDisplay url={table.url} size={80} />
                  </div>
                </div>

                <p className="text-admin-muted text-xs font-mono text-center truncate mb-4">
                  {table.token}
                </p>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPreviewTable(table)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-muted)' }}
                  >
                    <Eye size={13} />
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(table.url)}&color=111111&bgcolor=FFFFFF&margin=20`;
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `dosa-company-${table.name.toLowerCase().replace(' ', '-')}-qr.png`;
                      link.click();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-colors"
                    style={{ background: '#ED2024' }}
                  >
                    <Download size={13} />
                    Download
                  </button>
                  <button
                    onClick={() => regenerate(table.id)}
                    disabled={regeneratingId === table.id}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-muted)' }}
                  >
                    <RefreshCw size={13} className={regeneratingId === table.id ? 'animate-spin' : ''} />
                    Regen
                  </button>
                  <button
                    onClick={() => toggleStatus(table.id)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--admin-border)', color: table.status === 'active' ? '#10984B' : 'var(--admin-muted)' }}
                  >
                    {table.status === 'active' ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                    {table.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTable && (
        <QRPreviewModal table={previewTable} onClose={() => setPreviewTable(null)} />
      )}
    </AdminLayout>
  );
}
