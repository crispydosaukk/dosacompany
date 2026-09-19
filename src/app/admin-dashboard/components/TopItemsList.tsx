'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const TOP_ITEMS = [
  { id: 'ti-001', name: 'Masala Dosa', count: 34, revenue: 2635, color: 'var(--primary)' },
  { id: 'ti-002', name: 'Gobi 65', count: 28, revenue: 2517, color: 'var(--secondary)' },
  { id: 'ti-003', name: 'Bombay Thali', count: 19, revenue: 2566, color: '#3B82F6' },
  { id: 'ti-004', name: 'Paneer 65', count: 17, revenue: 1528, color: '#8B5CF6' },
  { id: 'ti-005', name: 'Mango Lassi', count: 31, revenue: 1395, color: '#F59E0B' },
  { id: 'ti-006', name: 'Filter Coffee', count: 24, revenue: 840, color: '#6B7280' },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-admin-card border border-admin-border rounded-xl px-3 py-2 shadow-xl">
      <p className="text-admin-muted text-xs mb-1">{label}</p>
      <p className="text-admin-foreground text-sm font-bold">{payload[0].value} orders</p>
    </div>
  );
}

export default function TopItemsList() {
  return (
    <div className="admin-card rounded-2xl p-5 h-full">
      <div className="mb-4">
        <h3 className="text-admin-foreground font-bold text-base">Top Selling Items</h3>
        <p className="text-admin-muted text-xs mt-0.5">Today's most ordered dishes</p>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={TOP_ITEMS} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fill: 'var(--admin-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {TOP_ITEMS.map((item, index) => (
              <Cell key={`cell-${item.id}`} fill={item.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2.5 border-t border-admin-border pt-4">
        {TOP_ITEMS.slice(0, 4).map((item) => (
          <div key={`top-row-${item.id}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-admin-muted truncate max-w-[120px]">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-admin-foreground font-mono-nums">{item.count}x</span>
              <span className="text-xs text-admin-muted font-mono-nums">£{(item.revenue / 100).toFixed(0)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}