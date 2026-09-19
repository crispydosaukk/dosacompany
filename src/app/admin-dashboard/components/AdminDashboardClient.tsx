'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import DashboardKPIGrid from './DashboardKPIGrid';
import OrdersHourChart from './OrdersHourChart';
import LiveOrdersFeed from './LiveOrdersFeed';
import TopItemsList from './TopItemsList';
import EposHealthCard from './EposHealthCard';

export default function AdminDashboardClient() {
  const [lastUpdated] = useState('09:41');

  return (
    <AdminLayout activePage="dashboard">
      <div className="p-6 xl:p-8 max-w-screen-2xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-admin-foreground">Dashboard</h1>
            <p className="text-admin-muted text-sm mt-0.5">
              Saturday, 19 September 2026 · Last updated {lastUpdated}
              <span className="inline-flex items-center gap-1 ml-2 text-secondary">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse inline-block" />
                Live
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="text-sm bg-admin-card border border-admin-border text-admin-foreground rounded-xl px-3 py-2 focus:outline-none focus:border-primary">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>

        {/* KPI Bento Grid */}
        <DashboardKPIGrid />

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2">
            <OrdersHourChart />
          </div>
          <div>
            <EposHealthCard />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2">
            <LiveOrdersFeed />
          </div>
          <div>
            <TopItemsList />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}