'use client';

import React from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, AlertTriangle, CreditCard, Table2 } from 'lucide-react';


interface KPICard {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
  span?: 'wide' | 'normal';
}

const KPI_DATA: KPICard[] = [
  {
    id: 'kpi-revenue',
    label: "Today's Revenue",
    value: '£1,847.50',
    subValue: '47 orders',
    trend: 12.4,
    trendLabel: 'vs yesterday',
    icon: <TrendingUp size={22} />,
    variant: 'success',
    span: 'wide',
  },
  {
    id: 'kpi-live-orders',
    label: 'Live Orders',
    value: '8',
    subValue: '3 preparing · 2 ready',
    trend: undefined,
    icon: <ShoppingBag size={22} />,
    variant: 'info',
  },
  {
    id: 'kpi-epos-failures',
    label: 'EPOS Failures',
    value: '2',
    subValue: 'Require attention',
    trend: undefined,
    icon: <AlertTriangle size={22} />,
    variant: 'danger',
  },
  {
    id: 'kpi-payment-success',
    label: 'Payment Success',
    value: '97.8%',
    subValue: '46 of 47 succeeded',
    trend: 1.2,
    trendLabel: 'vs yesterday',
    icon: <CreditCard size={22} />,
    variant: 'success',
  },
  {
    id: 'kpi-avg-order',
    label: 'Avg Order Value',
    value: '£39.31',
    subValue: 'Per transaction',
    trend: -3.1,
    trendLabel: 'vs yesterday',
    icon: <TrendingDown size={22} />,
    variant: 'warning',
  },
  {
    id: 'kpi-active-tables',
    label: 'Active Tables',
    value: '12 / 30',
    subValue: '18 available',
    trend: undefined,
    icon: <Table2 size={22} />,
    variant: 'default',
  },
];

const variantStyles: Record<string, { bg: string; icon: string; badge: string }> = {
  default: { bg: 'bg-admin-card', icon: 'text-admin-muted bg-white/5', badge: '' },
  success: { bg: 'bg-admin-card', icon: 'text-secondary bg-secondary/10', badge: 'text-secondary bg-secondary/10' },
  warning: { bg: 'bg-admin-card', icon: 'text-amber-400 bg-amber-400/10', badge: 'text-amber-400 bg-amber-400/10' },
  danger: { bg: 'border-red-500/30 bg-red-500/5', icon: 'text-red-400 bg-red-400/10', badge: 'text-red-400 bg-red-400/10' },
  info: { bg: 'bg-admin-card', icon: 'text-blue-400 bg-blue-400/10', badge: 'text-blue-400 bg-blue-400/10' },
};

export default function DashboardKPIGrid() {
  return (
    // 5 normal + 1 wide = grid-cols-4: row1: wide(2) + 2 normal, row2: 3 normal
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {KPI_DATA.map((kpi) => {
        const styles = variantStyles[kpi.variant];
        return (
          <div
            key={kpi.id}
            className={`admin-card rounded-2xl p-5 transition-all duration-200 admin-card-hover ${styles.bg} ${kpi.span === 'wide' ? 'md:col-span-2' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${styles.icon}`}>
                {kpi.icon}
              </div>
              {kpi.trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${styles.badge}`}>
                  {kpi.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.trend >= 0 ? '+' : ''}{kpi.trend}%
                </div>
              )}
              {kpi.variant === 'danger' && (
                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full text-red-400 bg-red-400/10">
                  <AlertTriangle size={12} />
                  Action needed
                </div>
              )}
            </div>
            <div className="font-mono-nums text-3xl font-bold text-admin-foreground mb-1">{kpi.value}</div>
            <div className="text-xs font-semibold text-admin-muted uppercase tracking-wide mb-0.5">{kpi.label}</div>
            {kpi.subValue && (
              <div className="text-xs text-admin-muted/70 mt-1">{kpi.subValue}</div>
            )}
            {kpi.trendLabel && (
              <div className="text-xs text-admin-muted/50 mt-0.5">{kpi.trendLabel}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}