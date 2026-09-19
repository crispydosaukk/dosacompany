'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Sliders, Plus, Edit2, Trash2, X, Check, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';

interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  minSelections: number;
  maxSelections: number;
  appliedTo: string[];
  options: ModifierOption[];
  active: boolean;
}

const INITIAL_MODIFIERS: ModifierGroup[] = [
  {
    id: 'mod-1',
    name: 'Choose Chutney',
    type: 'single',
    required: true,
    minSelections: 1,
    maxSelections: 1,
    appliedTo: ['Masala Dosa', 'Plain Dosa', 'Onion Dosa'],
    active: true,
    options: [
      { id: 'o1', name: 'Coconut Chutney', price: 0, isDefault: true },
      { id: 'o2', name: 'Tomato Chutney', price: 0, isDefault: false },
      { id: 'o3', name: 'Both Chutneys', price: 0, isDefault: false },
    ],
  },
  {
    id: 'mod-2',
    name: 'Extras',
    type: 'multiple',
    required: false,
    minSelections: 0,
    maxSelections: 5,
    appliedTo: ['Masala Dosa', 'Idli', 'Vada'],
    active: true,
    options: [
      { id: 'o4', name: 'Extra Sambar', price: 100, isDefault: false },
      { id: 'o5', name: 'Extra Chutney', price: 75, isDefault: false },
      { id: 'o6', name: 'Cheese', price: 150, isDefault: false },
    ],
  },
  {
    id: 'mod-3',
    name: 'Spice Level',
    type: 'single',
    required: false,
    minSelections: 0,
    maxSelections: 1,
    appliedTo: ['Chicken Curry', 'Lamb Curry', 'Vegetable Curry'],
    active: true,
    options: [
      { id: 'o7', name: 'Mild', price: 0, isDefault: true },
      { id: 'o8', name: 'Medium', price: 0, isDefault: false },
      { id: 'o9', name: 'Hot', price: 0, isDefault: false },
      { id: 'o10', name: 'Extra Hot', price: 0, isDefault: false },
    ],
  },
  {
    id: 'mod-4',
    name: 'Dosa Size',
    type: 'single',
    required: true,
    minSelections: 1,
    maxSelections: 1,
    appliedTo: ['Special Dosa', 'Ghee Dosa'],
    active: false,
    options: [
      { id: 'o11', name: 'Regular', price: 0, isDefault: true },
      { id: 'o12', name: 'Large', price: 200, isDefault: false },
    ],
  },
];

function formatPrice(pence: number) {
  if (pence === 0) return 'Free';
  return `+£${(pence / 100).toFixed(2)}`;
}

interface EditModalProps {
  group: ModifierGroup | null;
  onClose: () => void;
  onSave: (g: ModifierGroup) => void;
}

function EditModal({ group, onClose, onSave }: EditModalProps) {
  const isNew = !group;
  const [form, setForm] = useState<ModifierGroup>(
    group ?? {
      id: `mod-${Date.now()}`,
      name: '',
      type: 'single',
      required: false,
      minSelections: 0,
      maxSelections: 1,
      appliedTo: [],
      options: [],
      active: true,
    }
  );
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState('0');

  const addOption = () => {
    if (!newOptionName.trim()) return;
    const opt: ModifierOption = {
      id: `o-${Date.now()}`,
      name: newOptionName.trim(),
      price: Math.round(parseFloat(newOptionPrice || '0') * 100),
      isDefault: form.options.length === 0,
    };
    setForm((f) => ({ ...f, options: [...f.options, opt] }));
    setNewOptionName('');
    setNewOptionPrice('0');
  };

  const removeOption = (id: string) => {
    setForm((f) => ({ ...f, options: f.options.filter((o) => o.id !== id) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ background: 'var(--admin-card)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <h2 className="font-extrabold text-admin-foreground text-lg">{isNew ? 'New Modifier Group' : 'Edit Modifier Group'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:bg-white/5"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Group Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary"
              style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}
              placeholder="e.g. Choose Chutney"
            />
          </div>
          {/* Type & Required */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Selection Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'single' | 'multiple' }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none"
                style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Required?</label>
              <select
                value={form.required ? 'yes' : 'no'}
                onChange={(e) => setForm((f) => ({ ...f, required: e.target.value === 'yes' }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none"
                style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}
              >
                <option value="yes">Required</option>
                <option value="no">Optional</option>
              </select>
            </div>
          </div>
          {/* Options */}
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-2 uppercase tracking-wide">Options ({form.options.length})</label>
            <div className="space-y-2 mb-3">
              {form.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border" style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-bg)' }}>
                  <GripVertical size={14} className="text-admin-muted flex-shrink-0" />
                  <span className="flex-1 text-sm font-semibold text-admin-foreground">{opt.name}</span>
                  <span className="text-xs font-bold" style={{ color: opt.price === 0 ? 'var(--admin-muted)' : '#10984B' }}>{formatPrice(opt.price)}</span>
                  {opt.isDefault && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,152,75,0.15)', color: '#10984B' }}>Default</span>}
                  <button onClick={() => removeOption(opt.id)} className="text-admin-muted hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary"
                style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}
                placeholder="Option name"
                onKeyDown={(e) => e.key === 'Enter' && addOption()}
              />
              <input
                value={newOptionPrice}
                onChange={(e) => setNewOptionPrice(e.target.value)}
                className="w-20 px-3 py-2 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary"
                style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}
                placeholder="£0.00"
                type="number"
                step="0.01"
                min="0"
              />
              <button
                onClick={addOption}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-colors"
                style={{ background: 'var(--primary)' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: 'var(--admin-border)' }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-admin-muted hover:bg-white/5 transition-colors">Cancel</button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-colors"
            style={{ background: 'var(--primary)' }}
          >
            <Check size={15} /> Save Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminModifiersPage() {
  const [modifiers, setModifiers] = useState<ModifierGroup[]>(INITIAL_MODIFIERS);
  const [editTarget, setEditTarget] = useState<ModifierGroup | null | undefined>(undefined);
  const [expanded, setExpanded] = useState<string | null>('mod-1');

  const toggleActive = (id: string) => {
    setModifiers((prev) => prev.map((m) => m.id === id ? { ...m, active: !m.active } : m));
  };

  const deleteGroup = (id: string) => {
    setModifiers((prev) => prev.filter((m) => m.id !== id));
  };

  const saveGroup = (g: ModifierGroup) => {
    setModifiers((prev) => {
      const exists = prev.find((m) => m.id === g.id);
      if (exists) return prev.map((m) => m.id === g.id ? g : m);
      return [...prev, g];
    });
  };

  return (
    <AdminLayout activePage="modifiers">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(237,32,36,0.15)' }}>
              <Sliders size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-admin-foreground">Modifiers</h1>
              <p className="text-xs text-admin-muted mt-0.5">{modifiers.length} modifier groups · {modifiers.filter(m => m.active).length} active</p>
            </div>
          </div>
          <button
            onClick={() => setEditTarget(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ background: 'var(--primary)' }}
          >
            <Plus size={16} /> New Group
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Groups', value: modifiers.length, color: '#3B82F6' },
            { label: 'Active', value: modifiers.filter(m => m.active).length, color: '#10984B' },
            { label: 'Total Options', value: modifiers.reduce((s, m) => s + m.options.length, 0), color: '#F59E0B' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-4 border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
              <p className="text-2xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs font-semibold text-admin-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Modifier Groups */}
        <div className="space-y-3">
          {modifiers.map((group) => (
            <div key={group.id} className="rounded-2xl border overflow-hidden" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/3 transition-colors"
                onClick={() => setExpanded(expanded === group.id ? null : group.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-admin-foreground">{group.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                      {group.type === 'single' ? 'Single' : 'Multiple'}
                    </span>
                    {group.required && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(237,32,36,0.15)', color: 'var(--primary)' }}>Required</span>
                    )}
                    {!group.active && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(107,114,128,0.15)', color: '#6B7280' }}>Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-admin-muted mt-1">{group.options.length} options · Applied to: {group.appliedTo.slice(0, 2).join(', ')}{group.appliedTo.length > 2 ? ` +${group.appliedTo.length - 2} more` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditTarget(group); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleActive(group.id); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ color: group.active ? '#10984B' : '#6B7280' }}
                  >
                    {group.active ? <Check size={14} /> : <X size={14} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteGroup(group.id); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  {expanded === group.id ? <ChevronUp size={16} className="text-admin-muted" /> : <ChevronDown size={16} className="text-admin-muted" />}
                </div>
              </div>
              {expanded === group.id && (
                <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: 'var(--admin-border)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map((opt) => (
                      <div key={opt.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl border" style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-bg)' }}>
                        <div className="flex items-center gap-2">
                          {opt.isDefault && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                          <span className="text-sm font-semibold text-admin-foreground">{opt.name}</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: opt.price === 0 ? 'var(--admin-muted)' : '#10984B' }}>{formatPrice(opt.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {editTarget !== undefined && (
        <EditModal
          group={editTarget}
          onClose={() => setEditTarget(undefined)}
          onSave={saveGroup}
        />
      )}
    </AdminLayout>
  );
}
