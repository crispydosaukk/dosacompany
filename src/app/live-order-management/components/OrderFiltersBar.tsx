'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filterStatus: string;
  onFilterStatus: (v: string) => void;
  filterTable: string;
  onFilterTable: (v: string) => void;
  filterPayment: string;
  onFilterPayment: (v: string) => void;
  filterEpos: string;
  onFilterEpos: (v: string) => void;
}

const TABLE_OPTIONS = ['ALL', ...Array.from({ length: 30 }, (_, i) => (i + 1).toString())];

export default function OrderFiltersBar({
  search, onSearch,
  filterStatus, onFilterStatus,
  filterTable, onFilterTable,
  filterPayment, onFilterPayment,
  filterEpos, onFilterEpos,
}: Props) {
  const hasActiveFilters = filterStatus !== 'ALL' || filterTable !== 'ALL' || filterPayment !== 'ALL' || filterEpos !== 'ALL' || search !== '';

  const clearAll = () => {
    onSearch('');
    onFilterStatus('ALL');
    onFilterTable('ALL');
    onFilterPayment('ALL');
    onFilterEpos('ALL');
  };

  const selectClass = "text-sm bg-admin-card border border-admin-border text-admin-foreground rounded-xl px-3 py-2 focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
        <input
          type="text"
          placeholder="Search order #, customer, phone..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-admin-card border border-admin-border text-admin-foreground rounded-xl text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-admin-muted"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-muted hover:text-admin-foreground">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select value={filterStatus} onChange={(e) => onFilterStatus(e.target.value)} className={selectClass}>
        <option value="ALL">All Status</option>
        <option value="DRAFT">Draft</option>
        <option value="PAYMENT_PENDING">Payment Pending</option>
        <option value="PAYMENT_FAILED">Payment Failed</option>
        <option value="PAID">Paid</option>
        <option value="SENT_TO_EPOS">Sent to EPOS</option>
        <option value="EPOS_ACCEPTED">EPOS Accepted</option>
        <option value="EPOS_FAILED">EPOS Failed</option>
        <option value="SENT_TO_KITCHEN">Sent to Kitchen</option>
        <option value="PREPARING">Preparing</option>
        <option value="READY">Ready</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="REFUNDED">Refunded</option>
      </select>

      {/* Table filter */}
      <select value={filterTable} onChange={(e) => onFilterTable(e.target.value)} className={selectClass}>
        <option value="ALL">All Tables</option>
        {TABLE_OPTIONS.slice(1).map((t) => (
          <option key={`table-opt-${t}`} value={t}>Table {t}</option>
        ))}
      </select>

      {/* Payment filter */}
      <select value={filterPayment} onChange={(e) => onFilterPayment(e.target.value)} className={selectClass}>
        <option value="ALL">All Payments</option>
        <option value="PAID">Paid</option>
        <option value="PAYMENT_PENDING">Pending</option>
        <option value="PAYMENT_FAILED">Failed</option>
        <option value="REFUNDED">Refunded</option>
      </select>

      {/* EPOS filter */}
      <select value={filterEpos} onChange={(e) => onFilterEpos(e.target.value)} className={selectClass}>
        <option value="ALL">All EPOS</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="SENDING">Sending</option>
        <option value="FAILED">Failed</option>
        <option value="PENDING">Pending</option>
        <option value="NOT_SENT">Not Sent</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}