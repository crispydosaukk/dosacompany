'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { CheckCircle2, XCircle, RefreshCw, Wifi } from 'lucide-react';

const EPOS_DATA = [{ name: 'Success Rate', value: 94.7, fill: 'var(--secondary)' }];

export default function EposHealthCard() {
  return (
    <div className="admin-card rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-admin-foreground font-bold text-base">EPOS Health</h3>
          <p className="text-admin-muted text-xs mt-0.5">Today's integration status</p>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary text-xs font-bold px-2.5 py-1 rounded-full">
          <Wifi size={11} />
          Connected
        </div>
      </div>

      <div className="flex items-center justify-center my-2">
        <div className="relative">
          <ResponsiveContainer width={140} height={140}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              data={EPOS_DATA}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'var(--admin-border)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono-nums text-admin-foreground">94.7%</span>
            <span className="text-xs text-admin-muted">Success</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-secondary" />
            <span className="text-xs text-admin-muted">Orders sent</span>
          </div>
          <span className="text-sm font-bold font-mono-nums text-admin-foreground">45</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-red-400" />
            <span className="text-xs text-admin-muted">Failed</span>
          </div>
          <span className="text-sm font-bold font-mono-nums text-red-400">2</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="text-amber-400" />
            <span className="text-xs text-admin-muted">Pending retry</span>
          </div>
          <span className="text-sm font-bold font-mono-nums text-amber-400">1</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-admin-border">
        <div className="text-xs text-admin-muted mb-1">Last successful ping</div>
        <div className="text-xs text-admin-foreground font-mono-nums">09:40:12 · 142ms response</div>
      </div>
    </div>
  );
}