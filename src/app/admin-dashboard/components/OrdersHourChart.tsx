'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Realistic South Indian restaurant order distribution — lunch peak 12-14, dinner peak 18-21
const ORDERS_BY_HOUR = [
  { hour: '10:00', orders: 2, revenue: 78 },
  { hour: '11:00', orders: 5, revenue: 197 },
  { hour: '12:00', orders: 14, revenue: 548 },
  { hour: '13:00', orders: 18, revenue: 712 },
  { hour: '14:00', orders: 11, revenue: 433 },
  { hour: '15:00', orders: 4, revenue: 156 },
  { hour: '16:00', orders: 3, revenue: 118 },
  { hour: '17:00', orders: 6, revenue: 234 },
  { hour: '18:00', orders: 13, revenue: 511 },
  { hour: '19:00', orders: 21, revenue: 824 },
  { hour: '20:00', orders: 17, revenue: 668 },
  { hour: '21:00', orders: 9, revenue: 354 },
  { hour: '22:00', orders: 3, revenue: 118 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-admin-card border border-admin-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-admin-muted text-xs font-semibold mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={`tooltip-row-${i}`} className="flex items-center gap-2 text-sm">
          <span className="text-admin-foreground font-bold font-mono-nums">
            {p.dataKey === 'revenue' ? `£${p.value}` : `${p.value} orders`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function OrdersHourChart() {
  return (
    <div className="admin-card rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-admin-foreground font-bold text-base">Orders by Hour</h3>
          <p className="text-admin-muted text-xs mt-0.5">Today · Service hours 10:00–22:30</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-admin-muted">Orders</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={ORDERS_BY_HOUR} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: 'var(--admin-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fill: 'var(--admin-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="var(--primary)"
            strokeWidth={2.5}
            fill="url(#ordersGradient)"
            dot={false}
            activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'var(--admin-card)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}