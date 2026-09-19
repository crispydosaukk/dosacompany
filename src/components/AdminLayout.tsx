'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

interface Props {
  children: React.ReactNode;
  activePage: string;
}

export default function AdminLayout({ children, activePage }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--admin-bg)' }}>
      <AdminSidebar
        collapsed={sidebarCollapsed}
        activePage={activePage}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminTopbar onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}