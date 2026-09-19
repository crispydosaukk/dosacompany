'use client';

import React, { useState } from 'react';
import { Menu, Bell, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  onToggleSidebar: () => void;
}

export default function AdminTopbar({ onToggleSidebar }: Props) {
  const [showNotifications, setShowNotifications] = useState(false);

  const NOTIFICATIONS = [
    { id: 'notif-001', type: 'error', message: 'EPOS failed for DC-20260919-000245', time: '09:35', table: 12 },
    { id: 'notif-002', type: 'success', message: 'New order DC-20260919-000247 received', time: '09:41', table: 1 },
    { id: 'notif-003', type: 'warning', message: 'Table 7 order pending EPOS confirmation', time: '09:33', table: 7 },
  ];

  return (
    <header className="h-14 flex items-center justify-between px-4 xl:px-6 flex-shrink-0 border-b" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
          <Link href="/admin-dashboard" className="text-admin-muted hover:text-admin-foreground transition-colors">Dosa Company</Link>
          <span className="text-admin-border">/</span>
          <span className="text-admin-foreground font-semibold">Admin</span>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-secondary/10 text-secondary text-xs font-bold px-2.5 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
          Live
        </div>

        {/* EPOS alert */}
        <div className="hidden md:flex items-center gap-1.5 bg-red-400/10 text-red-400 text-xs font-bold px-2.5 py-1.5 rounded-full">
          <AlertTriangle size={12} />
          2 EPOS Failures
        </div>

        {/* Refresh */}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors" aria-label="Refresh data">
          <RefreshCw size={16} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 admin-card rounded-2xl shadow-xl border z-50 overflow-hidden" style={{ borderColor: 'var(--admin-border)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <h3 className="text-admin-foreground font-bold text-sm">Notifications</h3>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="px-4 py-3 border-b hover:bg-white/3 transition-colors cursor-pointer" style={{ borderColor: 'var(--admin-border)' }}>
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      n.type === 'error' ? 'bg-red-400/10' : n.type === 'success' ? 'bg-secondary/10' : 'bg-amber-400/10'
                    }`}>
                      {n.type === 'error' ? <AlertTriangle size={12} className="text-red-400" /> : <Bell size={12} className={n.type === 'success' ? 'text-secondary' : 'text-amber-400'} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-admin-foreground text-xs font-medium leading-snug">{n.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-admin-muted font-mono-nums">{n.time}</span>
                        <span className="text-xs text-admin-muted">Table {n.table}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs text-primary font-semibold hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm cursor-pointer hover:bg-primary/30 transition-colors">
          A
        </div>
      </div>
    </header>
  );
}