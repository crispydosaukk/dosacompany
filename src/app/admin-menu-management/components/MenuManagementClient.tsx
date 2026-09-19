'use client';

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { MENU_CATEGORIES, MENU_ITEMS, MenuItem, formatPrice } from '@/lib/menuData';
import { UtensilsCrossed, Plus, Search, Edit2, ToggleLeft, ToggleRight, Star, StarOff, X, Check, Leaf,  } from 'lucide-react';

type FilterStatus = 'all' | 'available' | 'unavailable';

function SpiceBadge({ level }: { level: string }) {
  if (level === 'none') return null;
  const map: Record<string, { label: string; color: string }> = {
    mild: { label: 'Mild', color: '#10984B' },
    medium: { label: 'Medium', color: '#f59e0b' },
    hot: { label: 'Hot 🌶️', color: '#ED2024' },
  };
  const s = map[level];
  if (!s) return null;
  return (
    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${s.color}20`, color: s.color }}>
      {s.label}
    </span>
  );
}

function EditItemModal({ item, onClose, onSave }: { item: MenuItem; onClose: () => void; onSave: (updated: MenuItem) => void }) {
  const [form, setForm] = useState({ ...item });

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--admin-card)' }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <h2 className="font-extrabold text-admin-foreground text-lg">Edit Menu Item</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:bg-white/5">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Item Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-foreground)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Price (pence)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-foreground)' }}
              />
              <p className="text-xs text-admin-muted mt-1">{formatPrice(form.price)}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-foreground)' }}
              >
                {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Image URL</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">EPOS Item ID</label>
            <input
              value={form.eposItemId}
              onChange={(e) => setForm({ ...form, eposItemId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Spice Level</label>
            <select
              value={form.spiceLevel}
              onChange={(e) => setForm({ ...form, spiceLevel: e.target.value as MenuItem['spiceLevel'] })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-foreground)' }}
            >
              <option value="none">None</option>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="hot">Hot</option>
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-admin-foreground font-semibold">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-admin-foreground font-semibold">Featured</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t" style={{ borderColor: 'var(--admin-border)' }}>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: '#ED2024' }}
          >
            <Check size={16} />
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border font-semibold text-sm text-admin-muted hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--admin-border)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuManagementClient() {
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'available' && item.available) ||
        (filterStatus === 'unavailable' && !item.available);
      return matchCat && matchSearch && matchStatus;
    });
  }, [items, selectedCategory, search, filterStatus]);

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const toggleFeatured = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item))
    );
  };

  const saveItem = (updated: MenuItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const stats = {
    total: items.length,
    available: items.filter((i) => i.available).length,
    unavailable: items.filter((i) => !i.available).length,
    featured: items.filter((i) => i.featured).length,
  };

  const getCategoryName = (id: string) => MENU_CATEGORIES.find((c) => c.id === id)?.name || id;

  return (
    <AdminLayout activePage="menu">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-admin-foreground flex items-center gap-2">
              <UtensilsCrossed size={24} className="text-primary" />
              Menu Management
            </h1>
            <p className="text-admin-muted text-sm mt-1">
              {stats.total} items · {stats.available} available · {stats.unavailable} unavailable
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ background: '#ED2024' }}
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Items', value: stats.total, color: '#ED2024' },
            { label: 'Available', value: stats.available, color: '#10984B' },
            { label: 'Unavailable', value: stats.unavailable, color: '#f59e0b' },
            { label: 'Featured', value: stats.featured, color: '#8b5cf6' },
          ].map((s) => (
            <div
              key={`stat-${s.label}`}
              className="rounded-2xl border p-4"
              style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}
            >
              <p className="text-admin-muted text-xs font-semibold uppercase tracking-wide mb-1">{s.label}</p>
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)', color: 'var(--admin-foreground)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'available', 'unavailable'] as FilterStatus[]).map((s) => (
              <button
                key={`filter-${s}`}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors capitalize ${
                  filterStatus === s ? 'text-white border-transparent' : 'text-admin-muted hover:bg-white/5'
                }`}
                style={{
                  background: filterStatus === s ? '#ED2024' : 'var(--admin-card)',
                  borderColor: filterStatus === s ? 'transparent' : 'var(--admin-border)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={`cat-tab-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-colors flex-shrink-0 ${
                selectedCategory === cat.id ? 'text-white border-transparent' : 'text-admin-muted hover:bg-white/5'
              }`}
              style={{
                background: selectedCategory === cat.id ? '#ED2024' : 'var(--admin-card)',
                borderColor: selectedCategory === cat.id ? 'transparent' : 'var(--admin-border)',
              }}
            >
              <span>{cat.emoji}</span>
              {cat.name}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  background: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : 'var(--admin-bg)',
                  color: selectedCategory === cat.id ? 'white' : 'var(--admin-muted)',
                }}
              >
                {cat.id === 'all' ? items.length : items.filter((i) => i.categoryId === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Items table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  {['Item', 'Category', 'Price', 'Status', 'Featured', 'Actions'].map((h) => (
                    <th
                      key={`th-${h}`}
                      className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide"
                      style={{ color: 'var(--admin-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr
                    key={`item-row-${item.id}`}
                    className="border-b transition-colors hover:bg-white/3"
                    style={{ borderColor: idx < filtered.length - 1 ? 'var(--admin-border)' : 'transparent' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-admin-foreground text-sm">{item.name}</p>
                            <Leaf size={12} className="text-green-500 flex-shrink-0" title="Vegetarian" />
                          </div>
                          <p className="text-admin-muted text-xs truncate max-w-[200px]">{item.description}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <SpiceBadge level={item.spiceLevel} />
                            {item.allergens.length > 0 && (
                              <span className="text-xs text-admin-muted">
                                {item.allergens.slice(0, 2).join(', ')}
                                {item.allergens.length > 2 && ` +${item.allergens.length - 2}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-admin-muted">
                        {getCategoryName(item.categoryId)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-admin-foreground text-sm">{formatPrice(item.price)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors ${
                          item.available
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' :'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {item.available ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          item.featured ? 'text-yellow-500 bg-yellow-50' : 'text-admin-muted hover:bg-white/5'
                        }`}
                        title={item.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {item.featured ? <Star size={15} fill="currentColor" /> : <StarOff size={15} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold text-admin-muted hover:bg-white/5 transition-colors"
                        style={{ borderColor: 'var(--admin-border)' }}
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-admin-muted">
                <UtensilsCrossed size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No items found</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-admin-muted text-xs mt-4 text-center">
          Showing {filtered.length} of {items.length} items
        </p>
      </div>

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={saveItem}
        />
      )}
    </AdminLayout>
  );
}
