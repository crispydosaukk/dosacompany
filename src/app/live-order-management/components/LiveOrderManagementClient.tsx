'use client';

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import OrderFiltersBar from './OrderFiltersBar';
import OrdersTable from './OrdersTable';
import OrderDetailPanel from './OrderDetailPanel';
import { Order, ALL_ORDERS } from './ordersData';

export default function LiveOrderManagementClient() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterTable, setFilterTable] = useState('ALL');
  const [filterPayment, setFilterPayment] = useState('ALL');
  const [filterEpos, setFilterEpos] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredOrders = useMemo(() => {
    return ALL_ORDERS.filter((order) => {
      const matchSearch =
        search === '' ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.includes(search);
      const matchStatus = filterStatus === 'ALL' || order.status === filterStatus;
      const matchTable = filterTable === 'ALL' || order.table.toString() === filterTable;
      const matchPayment = filterPayment === 'ALL' || order.paymentStatus === filterPayment;
      const matchEpos = filterEpos === 'ALL' || order.eposStatus === filterEpos;
      return matchSearch && matchStatus && matchTable && matchPayment && matchEpos;
    });
  }, [search, filterStatus, filterTable, filterPayment, filterEpos]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  return (
    <AdminLayout activePage="orders">
      <div className="flex h-full overflow-hidden">
        {/* Main content */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedOrder ? 'mr-0' : ''}`}>
          <div className="p-6 xl:p-8 pb-4 max-w-screen-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-admin-foreground">Live Orders</h1>
                <p className="text-admin-muted text-sm mt-0.5">
                  {filteredOrders.length} orders · Last updated 09:41
                  <span className="inline-flex items-center gap-1 ml-2 text-secondary">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse inline-block" />
                    Live
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-sm bg-admin-card border border-admin-border text-admin-foreground rounded-xl px-4 py-2 hover:bg-admin-card-hover transition-colors">
                  Export CSV
                </button>
              </div>
            </div>

            <OrderFiltersBar
              search={search}
              onSearch={setSearch}
              filterStatus={filterStatus}
              onFilterStatus={setFilterStatus}
              filterTable={filterTable}
              onFilterTable={setFilterTable}
              filterPayment={filterPayment}
              onFilterPayment={setFilterPayment}
              filterEpos={filterEpos}
              onFilterEpos={setFilterEpos}
            />
          </div>

          <div className="flex-1 overflow-auto px-6 xl:px-8 pb-6 max-w-screen-2xl mx-auto w-full">
            <OrdersTable
              orders={filteredOrders}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onSelectOrder={setSelectedOrder}
              selectedOrder={selectedOrder}
            />
          </div>
        </div>

        {/* Detail panel */}
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}