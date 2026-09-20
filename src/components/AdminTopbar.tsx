'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, RefreshCw, AlertTriangle, LayoutDashboard, UtensilsCrossed, Settings, LogOut, User } from 'lucide-react';
import Link from 'next/link';

interface Props {
  onToggleSidebar: () => void;
}

export default function AdminTopbar({ onToggleSidebar }: Props) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Breadcrumb Navbar */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          <Link href="/admin-dashboard" className="text-admin-muted hover:text-admin-foreground transition-colors">Dosa Company</Link>
          <span className="text-admin-border">/</span>
          <Link href="/admin-dashboard" className="text-admin-foreground font-semibold hover:text-primary transition-colors flex items-center gap-1.5">
            <LayoutDashboard size={14} className="text-primary" />
            <span>Dashboard</span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Customer Menu Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-admin-muted hover:text-admin-foreground bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-admin-border transition-colors"
          title="Open Live Customer Menu in new tab"
        >
          <UtensilsCrossed size={13} className="text-primary" />
          <span>Customer Menu</span>
        </Link>

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
            onClick={() => {
              setShowNotifications((v) => !v);
              setShowUserMenu(false);
            }}
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

        {/* User avatar menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu((v) => !v);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm cursor-pointer hover:bg-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="User profile menu"
            aria-haspopup="true"
            aria-expanded={showUserMenu}
          >
            A
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-11 w-56 admin-card rounded-2xl shadow-xl border z-50 overflow-hidden py-1" style={{ borderColor: 'var(--admin-border)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <p className="text-xs font-bold text-admin-foreground">Admin User</p>
                <p className="text-xs text-admin-muted truncate">admin@dosacompany.co.uk</p>
                <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                  Super Admin
                </span>
              </div>
              <div className="py-1">
                <Link
                  href="/admin-dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-admin-foreground hover:bg-white/5 transition-colors"
                >
                  <LayoutDashboard size={14} className="text-admin-muted" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin-settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-admin-foreground hover:bg-white/5 transition-colors"
                >
                  <Settings size={14} className="text-admin-muted" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-admin-foreground hover:bg-white/5 transition-colors"
                >
                  <UtensilsCrossed size={14} className="text-admin-muted" />
                  <span>Customer Menu</span>
                </Link>
              </div>
              <div className="border-t py-1" style={{ borderColor: 'var(--admin-border)' }}>
                <Link
                  href="/admin-login"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}