'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Users, Plus, Edit2, Trash2, X, Check, Shield, Eye, EyeOff, Mail } from 'lucide-react';

type Role = 'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'MANAGER' | 'STAFF';
type UserStatus = 'active' | 'inactive';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string; description: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', color: '#ED2024', bg: 'rgba(237,32,36,0.15)', description: 'Full system access including settings, users, and all data' },
  RESTAURANT_ADMIN: { label: 'Restaurant Admin', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', description: 'Full restaurant management except system settings' },
  MANAGER: { label: 'Manager', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', description: 'Orders, menu, tables, refunds and reports' },
  STAFF: { label: 'Staff', color: '#10984B', bg: 'rgba(16,152,75,0.15)', description: 'View orders and update kitchen status only' },
};

const PERMISSIONS_BY_ROLE: Record<Role, string[]> = {
  SUPER_ADMIN: ['Dashboard', 'Orders', 'Tables', 'QR Manager', 'Menu', 'Modifiers', 'Payments', 'Refunds', 'EPOS', 'Kitchen', 'Analytics', 'Settings', 'Users & Roles', 'Audit Logs'],
  RESTAURANT_ADMIN: ['Dashboard', 'Orders', 'Tables', 'QR Manager', 'Menu', 'Modifiers', 'Payments', 'Refunds', 'EPOS', 'Kitchen', 'Analytics'],
  MANAGER: ['Dashboard', 'Orders', 'Tables', 'Menu', 'Payments', 'Refunds', 'Kitchen', 'Analytics'],
  STAFF: ['Dashboard', 'Orders', 'Kitchen'],
};

const INITIAL_USERS: AdminUser[] = [
  { id: 'u1', name: 'Super Admin', email: 'admin@dosacompany.co.uk', role: 'SUPER_ADMIN', status: 'active', lastLogin: '2026-09-19 09:30', createdAt: '2026-01-01', permissions: PERMISSIONS_BY_ROLE.SUPER_ADMIN },
  { id: 'u2', name: 'Restaurant Manager', email: 'manager@dosacompany.co.uk', role: 'MANAGER', status: 'active', lastLogin: '2026-09-19 08:45', createdAt: '2026-02-15', permissions: PERMISSIONS_BY_ROLE.MANAGER },
  { id: 'u3', name: 'Kitchen Staff', email: 'staff@dosacompany.co.uk', role: 'STAFF', status: 'active', lastLogin: '2026-09-19 09:00', createdAt: '2026-03-10', permissions: PERMISSIONS_BY_ROLE.STAFF },
  { id: 'u4', name: 'Priya Nair', email: 'priya@dosacompany.co.uk', role: 'RESTAURANT_ADMIN', status: 'inactive', lastLogin: '2026-09-10 14:20', createdAt: '2026-04-01', permissions: PERMISSIONS_BY_ROLE.RESTAURANT_ADMIN },
];

interface UserModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onSave: (u: AdminUser) => void;
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const isNew = !user;
  const [form, setForm] = useState<AdminUser>(user ?? {
    id: `u-${Date.now()}`,
    name: '',
    email: '',
    role: 'STAFF',
    status: 'active',
    lastLogin: 'Never',
    createdAt: new Date().toISOString().split('T')[0],
    permissions: PERMISSIONS_BY_ROLE.STAFF,
  });
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');

  const handleRoleChange = (role: Role) => {
    setForm(f => ({ ...f, role, permissions: PERMISSIONS_BY_ROLE[role] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ background: 'var(--admin-card)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <h2 className="font-extrabold text-admin-foreground text-lg">{isNew ? 'Add New User' : 'Edit User'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:bg-white/5"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Full Name</label>
              <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="email@dosacompany.co.uk" />
            </div>
          </div>
          {isNew && (
            <div>
              <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} placeholder="Min 8 characters" />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-muted">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-2 uppercase tracking-wide">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => {
                const rc = ROLE_CONFIG[role];
                const isSelected = form.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className="p-3 rounded-xl border text-left transition-all"
                    style={{ borderColor: isSelected ? rc.color : 'var(--admin-border)', background: isSelected ? rc.bg : 'var(--admin-bg)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold" style={{ color: rc.color }}>{rc.label}</span>
                      {isSelected && <Check size={12} style={{ color: rc.color }} />}
                    </div>
                    <p className="text-xs text-admin-muted leading-tight">{rc.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-2 uppercase tracking-wide">Permissions (based on role)</label>
            <div className="flex flex-wrap gap-1.5">
              {PERMISSIONS_BY_ROLE[form.role].map((p) => (
                <span key={p} className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>{p}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">Status</label>
            <div className="flex gap-2">
              {(['active', 'inactive'] as const).map((s) => (
                <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors capitalize" style={{ background: form.status === s ? (s === 'active' ? '#10984B' : '#EF4444') : 'var(--admin-bg)', color: form.status === s ? '#fff' : 'var(--admin-muted)', border: `1px solid ${form.status === s ? 'transparent' : 'var(--admin-border)'}` }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: 'var(--admin-border)' }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-admin-muted hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2" style={{ background: 'var(--primary)' }}>
            <Check size={15} /> {isNew ? 'Create User' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [editTarget, setEditTarget] = useState<AdminUser | null | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  const saveUser = (u: AdminUser) => {
    setUsers((prev) => {
      const exists = prev.find((x) => x.id === u.id);
      if (exists) return prev.map((x) => x.id === u.id ? u : x);
      return [...prev, u];
    });
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <AdminLayout activePage="users">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(237,32,36,0.15)' }}>
              <Users size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-admin-foreground">Users & Roles</h1>
              <p className="text-xs text-admin-muted mt-0.5">{users.length} users · {users.filter(u => u.status === 'active').length} active</p>
            </div>
          </div>
          <button onClick={() => setEditTarget(null)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors" style={{ background: 'var(--primary)' }}>
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--admin-bg)' }}>
          {[{ id: 'users', label: 'Users' }, { id: 'roles', label: 'Roles & Permissions' }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as 'users' | 'roles')} className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors" style={{ background: activeTab === tab.id ? 'var(--admin-card)' : 'transparent', color: activeTab === tab.id ? 'var(--admin-foreground)' : 'var(--admin-muted)' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.map((user) => {
              const rc = ROLE_CONFIG[user.role];
              return (
                <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-lg flex-shrink-0" style={{ background: rc.bg, color: rc.color }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-admin-foreground">{user.name}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: rc.bg, color: rc.color }}>{rc.label}</span>
                      {user.status === 'inactive' && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(107,114,128,0.15)', color: '#6B7280' }}>Inactive</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-admin-muted"><Mail size={11} /> {user.email}</span>
                      <span className="text-xs text-admin-muted">Last login: {user.lastLogin}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditTarget(user)} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => deleteUser(user.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-admin-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => {
              const rc = ROLE_CONFIG[role];
              const userCount = users.filter(u => u.role === role).length;
              return (
                <div key={role} className="rounded-2xl border p-5" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield size={16} style={{ color: rc.color }} />
                      <span className="font-extrabold text-admin-foreground">{rc.label}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: rc.bg, color: rc.color }}>{userCount} user{userCount !== 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-xs text-admin-muted mb-3">{rc.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PERMISSIONS_BY_ROLE[role].map((p) => (
                      <span key={p} className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--admin-muted)' }}>{p}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editTarget !== undefined && (
        <UserModal user={editTarget} onClose={() => setEditTarget(undefined)} onSave={saveUser} />
      )}
    </AdminLayout>
  );
}
